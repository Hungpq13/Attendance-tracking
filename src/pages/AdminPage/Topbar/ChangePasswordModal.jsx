import { useState } from 'react';
import { useAuth } from '../../../presentation/hooks/useAuth';

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
        transition: "all 0.2s ease",
        boxSizing: "border-box"
      }}
    />
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
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
        justifyContent: "center",
        pointerEvents: "auto"
      }}
    >
      <i className="fa-solid fa-eye"></i>
    </button>
  </div>
);

function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changePassword } = useAuth();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
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

export default ChangePasswordModal;
