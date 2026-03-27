import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiBriefcase, FiActivity, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { getJobs } from '../api';

const STAGES = ['ALL', 'INTAKE', 'DIAGNOSIS', 'IN_SERVICE', 'QC_CHECK', 'READY', 'DELIVERED'];

const STAGE_LABELS = {
  ALL: 'All Stages',
  INTAKE: 'Intake',
  DIAGNOSIS: 'Diagnosis',
  IN_SERVICE: 'In Service',
  QC_CHECK: 'QC Check',
  READY: 'Ready',
  DELIVERED: 'Delivered',
};

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (stageFilter !== 'ALL') params.status = stageFilter;
      const res = await getJobs(params);
      setJobs(res.data.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [stageFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchJobs(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const activeStatuses = ['INTAKE', 'DIAGNOSIS', 'IN_SERVICE', 'QC_CHECK'];
  const kpi = {
    total: jobs.length,
    active: jobs.filter((j) => activeStatuses.includes(j.status)).length,
    ready: jobs.filter((j) => j.status === 'READY').length,
    delivered: jobs.filter((j) => j.status === 'DELIVERED').length,
  };

  return (
    <>
      <div className="top-bar">
        <h2 className="top-bar-title">Dashboard</h2>
        <div className="top-bar-actions">
          <Link to="/jobs/new" className="btn btn-primary" id="new-job-btn">
            <FiPlus /> New Job
          </Link>
        </div>
      </div>
      <div className="page-content">
        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card blue">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Total Jobs</span>
              <div className="kpi-card-icon"><FiBriefcase /></div>
            </div>
            <div className="kpi-card-value">{kpi.total}</div>
          </div>
          <div className="kpi-card orange">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Active</span>
              <div className="kpi-card-icon"><FiActivity /></div>
            </div>
            <div className="kpi-card-value">{kpi.active}</div>
          </div>
          <div className="kpi-card green">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Ready</span>
              <div className="kpi-card-icon"><FiCheckCircle /></div>
            </div>
            <div className="kpi-card-value">{kpi.ready}</div>
          </div>
          <div className="kpi-card purple">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Delivered</span>
              <div className="kpi-card-icon"><FiTruck /></div>
            </div>
            <div className="kpi-card-value">{kpi.delivered}</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by Job ID or issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-input"
            />
          </div>
          <select
            className="filter-select"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            id="stage-filter"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>{STAGE_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {/* Jobs Table */}
        {loading ? (
          <div className="loading-container"><div className="spinner" /><p>Loading jobs...</p></div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No jobs found</h3>
            <p>Create a new job to get started</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table" id="jobs-table">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Mechanic</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <span
                        className="job-id"
                        onClick={() => navigate(`/jobs/${job._id}`)}
                      >
                        {job.jobId}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-primary)' }}>
                      {job.customer?.name || '—'}
                    </td>
                    <td>
                      {job.vehicle ? `${job.vehicle.make} ${job.vehicle.model}` : '—'}
                      <br />
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {job.vehicle?.licensePlate}
                      </span>
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {job.reportedIssues}
                    </td>
                    <td>
                      <span className={`badge badge-${job.status}`}>
                        <span className="badge-dot" />
                        {STAGE_LABELS[job.status] || job.status}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-${job.priority}`} style={{ fontWeight: 600, fontSize: '13px' }}>
                        {job.priority}
                      </span>
                    </td>
                    <td>{job.assignedMechanic?.name || '—'}</td>
                    <td style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
