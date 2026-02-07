import { useState, useEffect } from "react";
import { userAPI } from "../../../services/api";
import { authAPI } from "../../../services/auth";
import "../CreateUser/ManageProfile.css";

function PasswordModal({ 
  isOpen, 
  currentPassword, 
  newPassword, 
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  onClose
}) {
  const changePasswordHandler = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp.");
      return;
    }

    try {
      await authAPI.changePassword(currentPassword, newPassword, confirmPassword);
      alert("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-header">Đổi mật khẩu</h2>
        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="off"
              style={{
                width: "100%",
                height: "50px",
                padding: "0 10px",
                fontSize: "16px",
                border: "2px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "#f5f5f5",
                boxSizing: "border-box"
              }}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="off"
              style={{
                width: "100%",
                height: "50px",
                padding: "0 10px",
                fontSize: "16px",
                border: "2px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "#f5f5f5",
                boxSizing: "border-box"
              }}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="off"
              style={{
                width: "100%",
                height: "50px",
                padding: "0 10px",
                fontSize: "16px",
                border: "2px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "#f5f5f5",
                boxSizing: "border-box"
              }}
            />
          </div>
        </div>
        <div className="modal-buttons" style={{ marginTop: "20px" }}>
          <button className="cancel-button" onClick={onClose}>
            Hủy
          </button>
          <button className="confirm-button" onClick={changePasswordHandler}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function PersonalInfo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("Nam");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getProfile();
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setBirthDate(data.birthDate || "");
      setGender(data.gender || "Nam");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setUserName(data.userName || "");
    } catch (error) {
     
    } finally {
      setLoading(false);
    }
  };

  const openModalHandler = () => {
    setOpenModal(true);
  };
  const closeModalHandler = () => {
    setOpenModal(false);
  };

  const firstNameChange = (e) => {
    setFirstName(e.target.value);
  };
  const lastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const birthDateChange = (e) => {
    setBirthDate(e.target.value);
  };
  const genderChange = (e) => {
    setGender(e.target.value);
  };
  const emailChange = (e) => {
    setEmail(e.target.value);
  };
  const phoneChange = (e) => {
    setPhone(e.target.value);
  };
  const addressChange = (e) => {
    setAddress(e.target.value);
  };
  const userNameChange = (e) => {
    setUserName(e.target.value);
  };

  return (
    <div className="manage-profile-container">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">Tên</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={firstNameChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Họ</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={lastNameChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="birthDate">Ngày sinh</label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={birthDateChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Giới tính</label>
          <select
            value={gender}
            id="gender"
            onChange={genderChange}
            className="form-select"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={emailChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={phoneChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="address">Địa chỉ</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={addressChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="userName">Tên đăng nhập</label>
          <input
            id="userName"
            value={userName}
            onChange={userNameChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="button-container">
        <button className="save-button change-password-button" onClick={openModalHandler}>
          Đổi mật khẩu
        </button>
      </div>
      <PasswordModal
        isOpen={openModal}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        setConfirmPassword={setConfirmPassword}
        onClose={closeModalHandler}
      />
    </div>
  );
}

export default PersonalInfo;
