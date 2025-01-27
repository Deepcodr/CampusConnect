import React, { useEffect, useState } from "react";
import axios from 'axios';

function Jobs() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getjobs'); // Update the URL if necessary
        const data = await response.json();
        setJobs(data);
        console.log(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (jobs.length === 0) {
    return <div>No jobs found.</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-stone-950">Job Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800">{job.job_name}</h2>
            <h6 className="text-sm text-gray-800 mb-4">{job.job_id}</h6>
            <p className="text-gray-600 mb-4">{job.job_description}</p>
            <div className="text-gray-500 text-sm">
              <p>
                <strong>Company:</strong> {job.company}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Experience:</strong> {job.experience}+
              </p>
              <p>
                <strong>Date Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Expires:</strong>{' '}
                {new Date(job.expirationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Jobs

