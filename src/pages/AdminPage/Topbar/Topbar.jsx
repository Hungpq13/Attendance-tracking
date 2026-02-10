import { useAuth } from '../../../presentation/hooks/useAuth';
import { getUserRole } from '../../../config/PermissionHelper';
import { STORAGE_USER, STORAGE_TOKEN, STORAGE_REFRESH_TOKEN } from '../../../config/constants';
import './Topbar.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changePassword } = useAuth();

  const PasswordInputWithToggle = ({ value, onChange, showPassword, onToggle, placeholder }) => (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete="off"
        placeholder={placeholder}
        style={{
          width: "100%",
          height: "40px",
          padding: "0 40px 0 10px",
          fontSize: "14px",
          border: "1.5px solid #dbdfe6",
          borderRadius: "6px",
          transition: "all 0.2s ease"
        }}
      />
      <button
        type="button"
        onClick={onToggle}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          color: "#667eea",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {showPassword ? "👁️" : "👁️‍🗨️"}
      </button>
    </div>
  );

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp.");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      alert("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      onClose();
    } catch (error) {
      console.error("Lỗi thay đổi mật khẩu:", error);
      alert(error.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-header">Đổi mật khẩu</h2>
        <div style={{ display: "flex", gap: "1rem", width: "100%", flexDirection: "column" }}>
          <div>
            <label>Mật khẩu hiện tại</label>
            <PasswordInputWithToggle
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              showPassword={showCurrentPassword}
              onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>
          <div>
            <label>Mật khẩu mới</label>
            <PasswordInputWithToggle
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              showPassword={showNewPassword}
              onToggle={() => setShowNewPassword(!showNewPassword)}
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div>
            <label>Xác nhận mật khẩu mới</label>
            <PasswordInputWithToggle
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showPassword={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "1.5px solid #dbdfe6",
              borderRadius: "6px",
              backgroundColor: "#f5f5f5",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleChangePassword}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#667eea",
              color: "white",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

function Topbar({ user, avatar, onAvatarChange }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem(STORAGE_USER);
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_REFRESH_TOKEN);
      navigate('/');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      navigate('/');
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="topbar-left">
          <h2 className="topbar-title">Dashboard</h2>
        </div>

        <div className="topbar-right">
          <div className="user-badge">
            <span className="role-badge">{user ? getUserRole() : ''}</span>
          </div>

          <div className="user-menu">
            <button 
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="avatar-frame">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="avatar-img" />
                ) : (
                  <span className="avatar-initial">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <span className="username">{user?.username || 'User'}</span>
              <span className="dropdown-icon">▼</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <label className="dropdown-item upload-avatar">
                  <span>📷 Thay đổi ảnh đại diện</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      onAvatarChange(e);
                      setShowUserMenu(false);
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowUserMenu(false);
                  }}
                >
                  🔐 Đổi mật khẩu
                </button>
                <button 
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <PasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </header>
  );
}

export default Topbar;
