const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv= require('dotenv');
const path=require('path');

dotenv.config();

const app = express();
const PORT = 5000;

const mongo_uri = process.env.MONGO_URI;

mongoose
  .connect(mongo_uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


const jobSchema = new mongoose.Schema({
  job_name: String,
  job_id: String,
  company: String,
  job_description: String,
  location: String,
  experience: String,
  createdAt: { type: Date, default: Date.now },
  expirationDate: {
    type: Date,
    default: () => Date.now() + 14 * 24 * 60 * 60 * 1000,
  },
});

jobSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

const Job = mongoose.model('Job', jobSchema , 'jobs');

app.use(cors()); // Enable CORS for the frontend
app.use(express.json());

// Hello Route For Testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

//Route For Fetching All Jobs
app.get('/api/getjobs', async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all jobs
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

//Route For Posting a New Job
app.post('/api/jobs', async (req, res) => {
  const {
    job_name,
    job_id,
    company,
    job_description,
    location,
    experience,
    expirationDate,
  } = req.body;

  if (
    !job_name ||
    !job_id ||
    !company ||
    !job_description ||
    !location ||
    !experience
  ) {
    return res.status(400).json({ error: 'All fields except expirationDate are required' });
  }

  try {
    const newJob = new Job({
      job_name,
      job_id,
      company,
      job_description,
      location,
      experience,
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

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
