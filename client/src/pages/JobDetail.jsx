import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit3, FiClock, FiUser, FiTruck as FiCar } from 'react-icons/fi';
import { getJobById, updateJobStage, assignMechanic as assignMechanicApi, getMechanics } from '../api';

const STAGE_LABELS = {
  INTAKE: 'Intake',
  DIAGNOSIS: 'Diagnosis',
  IN_SERVICE: 'In Service',
  QC_CHECK: 'QC Check',
  READY: 'Ready',
  DELIVERED: 'Delivered',
};

const ALL_STAGES = ['INTAKE', 'DIAGNOSIS', 'IN_SERVICE', 'QC_CHECK', 'READY', 'DELIVERED'];

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mechanics, setMechanics] = useState([]);
  const [showStageModal, setShowStageModal] = useState(false);
  const [stageForm, setStageForm] = useState({ stage: '', note: '' });
  const [updating, setUpdating] = useState(false);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const [jobRes, mechRes] = await Promise.all([getJobById(id), getMechanics()]);
      setJob(jobRes.data.data);
      setMechanics(mechRes.data.data);
    } catch (err) {
      console.error('Failed to fetch job:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJob(); }, [id]);

  const handleStageUpdate = async () => {
    if (!stageForm.stage || !stageForm.note) return;
    try {
      setUpdating(true);
      const res = await updateJobStage(id, { stage: stageForm.stage, note: stageForm.note });
      setJob(res.data.data);
      setShowStageModal(false);
      setStageForm({ stage: '', note: '' });
    } catch (err) {
      console.error('Failed to update stage:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignMechanic = async (mechanicId) => {
    try {
      const res = await assignMechanicApi(id, mechanicId);
      setJob(res.data.data);
    } catch (err) {
      console.error('Failed to assign mechanic:', err);
    }
  };

  if (loading) {
    return (
      <>
        <div className="top-bar"><h2 className="top-bar-title">Job Detail</h2></div>
        <div className="page-content"><div className="loading-container"><div className="spinner" /><p>Loading...</p></div></div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <div className="top-bar"><h2 className="top-bar-title">Job Detail</h2></div>
        <div className="page-content"><div className="empty-state"><h3>Job not found</h3></div></div>
      </>
    );
  }

  const sortedHistory = [...(job.stageHistory || [])].reverse();

  return (
    <>
      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/')}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="top-bar-title">Job Detail</h2>
        </div>
        <div className="top-bar-actions">
          <button className="btn btn-primary" onClick={() => { setStageForm({ stage: '', note: '' }); setShowStageModal(true); }} id="update-stage-btn">
            <FiEdit3 /> Update Stage
          </button>
        </div>
      </div>

      <div className="page-content">
        {/* Top: Job ID + Status */}
        <div className="detail-top">
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>{job.jobId}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className={`badge badge-${job.status}`}>
                <span className="badge-dot" />
                {STAGE_LABELS[job.status]}
              </span>
              <span className={`priority-${job.priority}`} style={{ fontWeight: 600, fontSize: '14px' }}>
                {job.priority} Priority
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {job.serviceType?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Info Panels */}
        <div className="detail-panels">
          {/* Customer Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiUser style={{ color: 'var(--accent-blue)' }} /> Customer Info
              </h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <p>{job.customer?.name || '—'}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{job.customer?.phone || '—'}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{job.customer?.email || '—'}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCar style={{ color: 'var(--accent-green)' }} /> Vehicle Info
              </h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Vehicle</label>
                <p>{job.vehicle ? `${job.vehicle.make} ${job.vehicle.model} (${job.vehicle.year})` : '—'}</p>
              </div>
              <div className="info-item">
                <label>Plate</label>
                <p>{job.vehicle?.licensePlate || '—'}</p>
              </div>
              <div className="info-item">
                <label>Odometer</label>
                <p>{job.odometer?.toLocaleString()} km</p>
              </div>
              <div className="info-item">
                <label>Color</label>
                <p>{job.vehicle?.color || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mechanic Assignment */}
        <div className="card" style={{ marginBottom: '28px' }}>
          <div className="card-header">
            <h3 className="card-title">Assigned Mechanic</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              {job.assignedMechanic ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="mechanic-avatar" style={{ width: '40px', height: '40px', fontSize: '16px', marginBottom: 0 }}>
                    {job.assignedMechanic.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{job.assignedMechanic.name}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{job.assignedMechanic.specialization}</p>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No mechanic assigned</p>
              )}
            </div>
            <select
              className="form-select"
              value={job.assignedMechanic?._id || ''}
              onChange={(e) => handleAssignMechanic(e.target.value)}
              id="assign-mechanic-select"
              style={{ maxWidth: '220px' }}
            >
              <option value="">Select mechanic</option>
              {mechanics.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Issue */}
        <div className="card" style={{ marginBottom: '28px' }}>
          <div className="card-header">
            <h3 className="card-title">Reported Issue</h3>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{job.reportedIssues}</p>
        </div>

        {/* Stage Timeline */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiClock style={{ color: 'var(--accent-purple)' }} /> Stage Timeline
            </h3>
          </div>
          <div className="timeline">
            {sortedHistory.map((entry, idx) => (
              <div className="timeline-item" key={idx}>
                <div className={`timeline-dot ${idx === 0 ? 'active' : 'completed'}`} />
                <div className="timeline-content">
                  <p className="timeline-stage">{STAGE_LABELS[entry.stage] || entry.stage}</p>
                  <p className="timeline-note">{entry.note}</p>
                  <p className="timeline-meta">
                    {entry.updatedBy} · {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Update Stage Modal */}
      {showStageModal && (
        <div className="modal-overlay" onClick={() => setShowStageModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Update Stage</h3>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">New Stage</label>
              <select
                className="form-select"
                value={stageForm.stage}
                onChange={(e) => setStageForm({ ...stageForm, stage: e.target.value })}
                id="stage-select"
                style={{ width: '100%' }}
              >
                <option value="">Select stage</option>
                {ALL_STAGES.map((s) => (
                  <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Note</label>
              <textarea
                className="form-textarea"
                value={stageForm.note}
                onChange={(e) => setStageForm({ ...stageForm, note: e.target.value })}
                placeholder="Add a note about this update..."
                id="stage-note"
                style={{ minHeight: '80px' }}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowStageModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleStageUpdate} disabled={updating || !stageForm.stage || !stageForm.note} id="confirm-stage-btn">
                {updating ? 'Updating...' : 'Update Stage'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
