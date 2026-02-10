import { useNavigate, useLocation } from 'react-router-dom';
import { getUserRole } from '../../../config/PermissionHelper';
import { USER_ROLES } from '../../../config/constants';
import './Sidebar.css';

function Sidebar({ currentPage, onPageChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getUserRole();
  const isAdmin = userRole === USER_ROLES.ADMIN;

  const menuItems = [
    { id: 'dashboard', label: 'Thông tin cá nhân', icon: '👤', role: 'all' },
    { id: 'manage', label: 'Quản lý tài khoản', icon: '👥', role: 'admin' },
    { id: 'input', label: 'Nhập ngày công', icon: '📝', role: 'admin' },
    { id: 'view', label: 'Xem ngày công', icon: '📋', role: 'all' },
  ];

  const filteredItems = menuItems.filter(
    (item) => item.role === 'all' || (item.role === 'admin' && isAdmin)
  );

  const handleItemClick = (id) => {
    onPageChange(id);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">⏱️</span>
          <span className="logo-text">Attendance</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <h3 className="section-title">Quản lý</h3>
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
