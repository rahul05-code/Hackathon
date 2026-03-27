import { useState, useEffect } from 'react';

const useJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch jobs here
  }, []);

  return { jobs };
};

export default useJobs;
