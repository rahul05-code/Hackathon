import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPhone, FiZap } from 'react-icons/fi';
import { getMechanics } from '../api';

export default function Mechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMechanics();
        setMechanics(res.data.data);
      } catch (err) {
        console.error('Failed to fetch mechanics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <div className="top-bar">
        <h2 className="top-bar-title">Mechanics</h2>
      </div>
      <div className="page-content">
        {loading ? (
          <div className="loading-container"><div className="spinner" /><p>Loading mechanics...</p></div>
        ) : mechanics.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔧</div>
            <h3>No mechanics found</h3>
            <p>Run the seed script to add sample mechanics</p>
          </div>
        ) : (
          <div className="mechanic-grid">
            {mechanics.map((m) => (
              <div
                key={m._id}
                className="mechanic-card"
                onClick={() => navigate(`/?mechanic=${m._id}`)}
              >
                <div className="mechanic-avatar">
                  {m.name.charAt(0)}
                </div>
                <h3 className="mechanic-name">{m.name}</h3>
                <p className="mechanic-spec">
                  <FiZap style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  {m.specialization || 'General'}
                </p>
                {m.phone && (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <FiPhone style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    {m.phone}
                  </p>
                )}
                <div className="mechanic-stats">
                  <span
                    className="mechanic-stat-badge"
                    style={{
                      background: m.activeJobs > 0 ? 'var(--accent-orange-soft)' : 'var(--accent-green-soft)',
                      color: m.activeJobs > 0 ? 'var(--accent-orange)' : 'var(--accent-green)',
                    }}
                  >
                    {m.activeJobs} active job{m.activeJobs !== 1 ? 's' : ''}
                  </span>
                  <span
                    className="mechanic-stat-badge"
                    style={{ background: 'var(--accent-blue-soft)', color: 'var(--accent-blue)' }}
                  >
                    {m.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
