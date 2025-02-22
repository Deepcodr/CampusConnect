const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const path = require('path');
const MongoStore = require("connect-mongo");
const multer = require("multer");
const fs = require("fs/promises");
const excelJS = require("exceljs");
const moment = require('moment');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/uploads/"); // Store files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only PDF files for resume and additional files
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// Initialize multer with file filter
const upload = multer({
  storage,
  fileFilter,
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "additionalFiles", maxCount: 1 },
]);

dotenv.config();

const app = express();
const PORT = 5000;

const mongo_uri = process.env.MONGO_URI;
const session_secret = process.env.SESSION_SECRET;
const jwt_secret = process.env.JWT_SECRET;

mongoose
  .connect(mongo_uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


const jobSchema = new mongoose.Schema({
  job_name: String,
  job_id: String,
  company: String,
  about_company: String,
  job_description: String,
  location: String,
  experience: String,
  package: String,
  eligibleBranches: { type: [String], required: true },
  tenthPercentage: { type: Number, required: true },
  twelthPercentage: { type: Number, required: true },
  engineeringPercentage: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expirationDate: {
    type: Date,
    default: () => Date.now() + 2 * 24 * 60 * 60 * 1000,
  },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  year: { type: String, required: true, default: 'First Year' },
  branch: { type: String, required: true },
  division: { type: String, required: true },
  prn: { type: String, required: true },
  tenthPercentage: { type: Number, required: false },
  twelthPercentage: { type: Number, required: false },
  engineeringPercentage: { type: Number, required: false },
  resume: { type: String, required: false },
  role: { type: String, required: true, default: 'STUDENT' },
  username: { type: String, required: true },
  password: { type: String, required: true },
  profileCompletion: { type: Boolean, default: false },
  placedStatus: { type: Boolean, default: false}
});

jobSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job", // Reference to the Job collection
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Make sure to reference the User model here
    required: true,
  },
  jobName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  prn: {
    type: String,
    required: true,
  },
  resume: {
    type: String, // Path or URL to the resume file
    required: true,
  },
  additionalFiles: {
    type: String, // Path or URL to any optional files
  },
  appliedAt: {
    type: Date,
    default: Date.now, // Timestamp when the application was submitted
  },
});

//Models 
const Application = mongoose.model("Application", applicationSchema, 'applications');
const User = mongoose.model('User', userSchema, 'users');
const Job = mongoose.model('Job', jobSchema, 'jobs');

//session
app.use(
  session({
    secret: session_secret, // Use a strong secret from .env
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // MongoDB URI
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      maxAge: 5 * 60 * 60 * 1000, // 2 hours
    },
  })
);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}
)); // Enable CORS for the frontend
app.use(express.json());


// Hello Route For Testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

//Route for fetching Job Details
app.get('/api/jobs/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

//Route for fetching all jobs for admin
app.get("/api/admin/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

//Route For Fetching User jobs
app.get('/api/getjobs', async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Unauthorized access. Please log in." });
    }

    const email = req.session.user.username; // Fetch email from session

    // Find jobs the student has already applied to
    const appliedJobs = await Application.find({ email }).select("jobId");

    // Extract job IDs from the applications
    const appliedJobIds = appliedJobs.map((application) => application.jobId);

    // Fetch jobs that the student has not applied to
    const jobs = await Job.find({ _id: { $nin: appliedJobIds } });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

//Route For Posting a New Job
app.post('/api/jobs', async (req, res) => {
  const {
    job_name,
    job_id,
    company,
    about_company,
    job_description,
    location,
    experience,
    package,
    eligibleBranches,
    tenthPercentage,
    twelthPercentage,
    engineeringPercentage,
    expirationDate,
  } = req.body;

  if (
    !job_name ||
    !job_id ||
    !company ||
    !about_company ||
    !job_description ||
    !location ||
    !experience ||
    !package ||
    eligibleBranches.length == 0 ||
    !tenthPercentage ||
    !twelthPercentage ||
    !engineeringPercentage
  ) {
    return res.status(400).json({ error: 'All fields except expirationDate are required' });
  }

  try {
    const newJob = new Job({
      job_name,
      job_id,
      company,
      about_company,
      job_description,
      location,
      experience,
      package,
      eligibleBranches,
      tenthPercentage,
      twelthPercentage,
      engineeringPercentage,
      expirationDate: expirationDate
        ? new Date(expirationDate)
        : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default to 2 weeks if not provided
    });

    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully!', job: newJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

app.post("/api/jobs/apply", upload, async (req, res) => {
  try {
    const { jobId } = req.body;

    var userId = req.session.user.id;

    if (!jobId) {
      return res.status(400).json({ error: "Job Not Found." });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const user = await User.findById(userId);

    if(!user)
    {
      return res.status(400).json({error : "User Not Found"});
    }

    if(user.placedStatus)
    {
      return res.status(400).json({error : "You are already placed."});
    }

    // Ensure required fields are provided
    if (!user.profileCompletion) {
      return res.status(400).json({ error: "Please complete profile before applying." });
    }

    const existingApplication = await Application.findOne({ jobId, userId });

    if (existingApplication) {
      return res.status(409).json({ message: "You have already applied to this job." });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(400).json({ error: "Job Not Found." });
    }

    if(user.tenthPercentage<job.tenthPercentage || user.twelthPercentage<job.twelthPercentage || user.engineeringPercentage<job.engineeringPercentage
      || !job.eligibleBranches.includes(user.branch)
    )
    {
      return res.status(400).json({error : "You are not eligible to apply for this job"});
    }

    // Prepare the application data
    const applicationData = {
      jobId,
      jobName: job.job_name, // Assuming job name is provided in the body
      userId,
      email: user.email,
      name: user.name,
      prn: user.prn,
      resume: user.resume,
    };

    // Save application to the database
    const application = new Application(applicationData);
    await application.save();

    res.status(200).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: "Failed to submit application." });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate user input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Find user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      jwt_secret,
      { expiresIn: "2h" } // Token valid for 2 hours
    );

    // Store session information on the server
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
      name: user.name,
    };

    // Send token and set session cookie
    res.cookie("session_token", token, {
      httpOnly: true, // Prevent client-side access to cookies
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict", // Strict cookie policy
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//fetch all students
app.get("/api/admin/students", async (req, res) => {
  try {
    if(!req.session.user)
    {
      return res.status(401).json({error : "Unauthorized"});
    }

    if (req.session.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access Denied" });
    }

    const students = await User.find({ role: "STUDENT" }).select("-password");
    res.json(students);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Update placed status
app.put("/api/admin/updateplaced/:id", async (req, res) => {
  try {
    if(!req.session.user)
    {
      return res.status(401).json({error : "Unauthorized"})
    }

    if (req.session.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access Denied" });
    }

    const { placedStatus } = req.body;

    const student = await User.findByIdAndUpdate(
      req.params.id,
      { placedStatus },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Placed status updated successfully", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

//Endpoint for updating user profile
app.put("/api/profile", upload, async (req, res) => {
  try {

    const userId = req.session.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { name, branch, tenthPercentage, twelthPercentage, engineeringPercentage } = req.body;
    let updateFields = { name, branch, tenthPercentage, twelthPercentage, engineeringPercentage };

    if (req.files.resume && req.files.resume[0]) {
      updateFields.resume = `/uploads/${req.files.resume[0].filename}`;
    }

    // Merge updated fields
    const updatedUser = { ...user.toObject(), ...updateFields };

    // Check if profile is fully completed
    var isProfileComplete;

    if (updatedUser.name &&
      updatedUser.username &&
      updatedUser.branch &&
      updatedUser.tenthPercentage &&
      updatedUser.twelthPercentage &&
      updatedUser.engineeringPercentage &&
      updatedUser.resume) {
      isProfileComplete = true;
    } else {
      isProfileComplete = false;
    }

    updateFields.profileCompletion = isProfileComplete;

    await User.findByIdAndUpdate(userId, updateFields);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Profile update failed" });
  }
});

// Endpoint to check if user is logged in (using session)
app.get("/api/me", async (req, res) => {
  try {
    // Check if the user session exists
    if (!req.session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    var username = req.session.user.username;
    // Return user session details
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user: user });
  } catch (error) {
    console.error("Error fetching user session:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Logout endpoint (destroy session)
app.post("/api/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to log out" });
      }
      res.clearCookie("session_token"); // Clear the cookie
      return res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/register", async (req, res) => {
  const { name, email, year, division, prn, username, password, branch } = req.body;

  try {
    // Check if the logged-in user is an admin
    if (!req.session.user || req.session.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash the password before saving
    var hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      year,
      division,
      prn,
      branch,
      username,
      password: hashedPassword,
      role: "STUDENT", // Default to STUDENT role
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/myapplications", async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== "STUDENT") {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const userId = req.session.user.id;
    // Fetch applications along with job details
    const applications = await Application.find({ userId }).populate("jobId", "job_name company");

    // Prepare response data
    const responseData = applications.map(app => ({
      applicationId: app._id,
      jobName: app.jobId.job_name,
      company: app.jobId.company,
      appliedTime: app.appliedAt.toLocaleString(),
    }));

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

//ROUTE FOR FETCHING JOB APPLICANTS
app.get("/api/admin/job/:jobId/applicants", async (req, res) => {
  const { jobId } = req.params;

  try {
    // Fetch job details
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Fetch applications for this job
    const applications = await Application.find({ jobId }).populate("name", "email");

    // Prepare data for response
    const applicants = applications.map((application) => ({
      jobId,
      jobName: job.job_name,
      studentName: application.name,
      prn: application.prn,
      applicationId: application._id,
      dateApplied: moment(application.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    }));

    res.status(200).json(applicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

//ROUTE FOR EXCEL EXPORT
app.get("/api/admin/job/:jobId/applicants/export", async (req, res) => {
  const { jobId } = req.params;

  try {
    // Find job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Fetch applications for this job and populate user details
    const applications = await Application.find({ jobId }).populate({
      path: "userId",
      select: "name email prn",
    });

    if (applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this job." });
    }

    // Create a new Excel workbook and worksheet
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applicants");

    // Explicitly set column headers and widths
    worksheet.columns = [
      { header: "Email", key: "email", width: 30 },
      { header: "Name of Student", key: "name", width: 25 },
      { header: "PRN", key: "prn", width: 15 },
      { header: "Resume Path", key: "resume", width: 40 },
      { header: "Application ID", key: "applicationId", width: 30 },
      { header: "Applied Time", key: "appliedTime", width: 25 },
    ];

    // Add data rows explicitly
    applications.forEach((application) => {
      worksheet.addRow({
        email: application.userId?.email || "N/A",
        name: application.userId?.name || "N/A",
        prn: application.userId?.prn || "N/A",
        resume: application.resume || "Not Uploaded",
        applicationId: application._id.toString(),
        appliedTime: new Date(application.appliedAt).toLocaleString(),
      });
    });

    // Auto-adjust column widths based on data length
    worksheet.columns.forEach((column) => {
      let maxLength = column.header.length; // Start with header length
      column.eachCell({ includeEmpty: true }, (cell) => {
        if (cell.value) {
          const cellLength = cell.value.toString().length;
          maxLength = Math.max(maxLength, cellLength);
        }
      });
      column.width = maxLength + 5; // Add padding
    });

    // Set response headers for file download
    res.setHeader("Content-Disposition", `attachment; filename=applicants_${job.job_name}.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    // Write the workbook to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({ message: "Server error while generating Excel file." });
  }
});

app.get("/resume", async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Fetch user details from DB
    const user = await User.findById(userId);
    if (!user || !user.resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Construct the full file path
    const resumePath = path.join(__dirname, user.resume);

    res.download(resumePath, "Resume.pdf", (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Error downloading resume" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
