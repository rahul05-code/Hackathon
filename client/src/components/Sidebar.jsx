import { NavLink } from 'react-router-dom';
import { FiGrid, FiTruck, FiUsers, FiBarChart2, FiSettings } from 'react-icons/fi';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <FiGrid /> },
  { path: '/mechanics', label: 'Mechanics', icon: <FiUsers /> },
  { path: '/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <FiTruck />
        </div>
        <div>
          <h1>AutoGarage</h1>
          <span>Workshop Manager</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        <div className="sidebar-link" style={{ cursor: 'default', opacity: 0.5 }}>
          <span className="sidebar-icon"><FiSettings /></span>
          Settings
        </div>
      </div>
    </aside>
  );
}
