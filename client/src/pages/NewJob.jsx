import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiTruck, FiTool, FiArrowLeft, FiSend } from 'react-icons/fi';
import { createJob } from '../api';

const initialForm = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: new Date().getFullYear(),
  licensePlate: '',
  vehicleColor: '',
  odometer: '',
  reportedIssues: '',
  serviceType: 'GENERAL_SERVICE',
  priority: 'NORMAL',
};

export default function NewJob() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!form.customerName || !form.customerPhone || !form.vehicleMake || !form.vehicleModel || !form.licensePlate || !form.odometer || !form.reportedIssues) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await createJob({
        ...form,
        vehicleYear: parseInt(form.vehicleYear, 10),
        odometer: parseInt(form.odometer, 10),
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/')}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="top-bar-title">New Job Card</h2>
        </div>
      </div>
      <div className="page-content">
        <form onSubmit={handleSubmit} id="new-job-form">
          {error && (
            <div style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          {/* Section A — Customer Info */}
          <div className="form-section">
            <h3 className="form-section-title">
              <span className="section-icon" style={{ background: 'var(--accent-blue-soft)', color: 'var(--accent-blue)' }}>
                <FiUser />
              </span>
              Customer Information
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Customer Name *</label>
                <input className="form-input" type="text" name="customerName" value={form.customerName} onChange={handleChange} placeholder="Enter customer name" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-input" type="tel" name="customerPhone" value={form.customerPhone} onChange={handleChange} placeholder="9876543210" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} placeholder="email@example.com" />
              </div>
            </div>
          </div>

          {/* Section B — Vehicle Info */}
          <div className="form-section">
            <h3 className="form-section-title">
              <span className="section-icon" style={{ background: 'var(--accent-green-soft)', color: 'var(--accent-green)' }}>
                <FiTruck />
              </span>
              Vehicle Details
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Vehicle Make *</label>
                <input className="form-input" type="text" name="vehicleMake" value={form.vehicleMake} onChange={handleChange} placeholder="e.g. Maruti, Hyundai" />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Model *</label>
                <input className="form-input" type="text" name="vehicleModel" value={form.vehicleModel} onChange={handleChange} placeholder="e.g. Swift, Creta" />
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input className="form-input" type="number" name="vehicleYear" value={form.vehicleYear} onChange={handleChange} min="2000" max="2030" />
              </div>
              <div className="form-group">
                <label className="form-label">License Plate *</label>
                <input className="form-input" type="text" name="licensePlate" value={form.licensePlate} onChange={handleChange} placeholder="MH01AB1234" style={{ textTransform: 'uppercase' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input className="form-input" type="text" name="vehicleColor" value={form.vehicleColor} onChange={handleChange} placeholder="e.g. White, Black" />
              </div>
              <div className="form-group">
                <label className="form-label">Odometer (km) *</label>
                <input className="form-input" type="number" name="odometer" value={form.odometer} onChange={handleChange} placeholder="15000" />
              </div>
            </div>
          </div>

          {/* Section C — Service Info */}
          <div className="form-section">
            <h3 className="form-section-title">
              <span className="section-icon" style={{ background: 'var(--accent-orange-soft)', color: 'var(--accent-orange)' }}>
                <FiTool />
              </span>
              Service Details
            </h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Issue Description *</label>
                <textarea className="form-textarea" name="reportedIssues" value={form.reportedIssues} onChange={handleChange} placeholder="Describe the issue in detail..." />
              </div>
              <div className="form-group">
                <label className="form-label">Service Type</label>
                <select className="form-select" name="serviceType" value={form.serviceType} onChange={handleChange}>
                  <option value="GENERAL_SERVICE">General Service</option>
                  <option value="REPAIR">Repair</option>
                  <option value="INSPECTION">Inspection</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" name="priority" value={form.priority} onChange={handleChange}>
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                  <option value="EXPRESS">Express</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} id="submit-job-btn">
              <FiSend /> {submitting ? 'Creating...' : 'Create Job Card'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
