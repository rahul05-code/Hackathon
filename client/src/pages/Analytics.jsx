import { useState, useEffect } from 'react';
import { FiBriefcase, FiActivity, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { getAnalytics } from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart,
} from 'recharts';

const STAGE_LABELS = {
  INTAKE: 'Intake',
  DIAGNOSIS: 'Diagnosis',
  IN_SERVICE: 'In Service',
  QC_CHECK: 'QC Check',
  READY: 'Ready',
  DELIVERED: 'Delivered',
};

const STAGE_COLORS = {
  INTAKE: '#4f8cff',
  DIAGNOSIS: '#a78bfa',
  IN_SERVICE: '#f5a524',
  QC_CHECK: '#22d3ee',
  READY: '#2dd4a8',
  DELIVERED: '#8b8fa3',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1e2235',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '13px',
      }}>
        <p style={{ color: '#e8eaf0', fontWeight: 600, marginBottom: '4px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAnalytics();
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <>
        <div className="top-bar"><h2 className="top-bar-title">Analytics</h2></div>
        <div className="page-content"><div className="loading-container"><div className="spinner" /><p>Loading analytics...</p></div></div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <div className="top-bar"><h2 className="top-bar-title">Analytics</h2></div>
        <div className="page-content"><div className="empty-state"><h3>No data available</h3></div></div>
      </>
    );
  }

  const barData = (data.jobsByStage || []).map((s) => ({
    name: STAGE_LABELS[s.stage] || s.stage,
    jobs: s.count,
    fill: STAGE_COLORS[s.stage] || '#4f8cff',
  }));

  const lineData = (data.jobsPerDay || []).map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    jobs: d.count,
  }));

  return (
    <>
      <div className="top-bar">
        <h2 className="top-bar-title">Analytics</h2>
      </div>
      <div className="page-content">
        {/* KPI Summary */}
        <div className="kpi-grid">
          <div className="kpi-card blue">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Total Jobs</span>
              <div className="kpi-card-icon"><FiBriefcase /></div>
            </div>
            <div className="kpi-card-value">{data.kpi?.total || 0}</div>
          </div>
          <div className="kpi-card orange">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Active</span>
              <div className="kpi-card-icon"><FiActivity /></div>
            </div>
            <div className="kpi-card-value">{data.kpi?.active || 0}</div>
          </div>
          <div className="kpi-card green">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Ready</span>
              <div className="kpi-card-icon"><FiCheckCircle /></div>
            </div>
            <div className="kpi-card-value">{data.kpi?.ready || 0}</div>
          </div>
          <div className="kpi-card purple">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Delivered</span>
              <div className="kpi-card-icon"><FiTruck /></div>
            </div>
            <div className="kpi-card-value">{data.kpi?.delivered || 0}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* Bar Chart — Jobs by Stage */}
          <div className="chart-card">
            <h3 className="chart-title">Jobs by Stage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <YAxis tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="jobs" radius={[6, 6, 0, 0]} fill="#4f8cff">
                  {barData.map((entry, index) => (
                    <rect key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Area Chart — Jobs per Day */}
          <div className="chart-card">
            <h3 className="chart-title">Jobs per Day (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f8cff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f8cff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <YAxis tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="jobs" stroke="#4f8cff" strokeWidth={2} fill="url(#colorJobs)" dot={{ fill: '#4f8cff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
