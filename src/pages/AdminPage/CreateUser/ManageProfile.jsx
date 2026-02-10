import { useState, useEffect } from "react";
import { useUser } from "../../../presentation/hooks/useUser";
import { getUserFromToken } from "../../../config/TokenHelper";
import { userAPI } from "../../../services/api";
import './ManageProfile.css';

function ManageProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("Nam");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Get user info from token (contains user ID)
      const user = getUserFromToken();
      if (!user) {
        throw new Error('No user found in token');
      }
      
      // Pass user ID to getProfile (Bearer token in Authorization header is automatic)
      const data = await userAPI.getProfile(user.id);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setBirthDate(data.birthDate || "");
      setGender(data.gender || "Nam");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setPosition(data.position || "");
      setUserName(data.userName || "");
    } catch (error) {
      console.error("Error loading profile:", error);
      // Use default data if API error
      setFirstName("Hưng");
      setLastName("Phạm");
      setBirthDate("2003-09-13");
      setGender("Nam");
      setEmail("hungpham@gmail.com");
      setPhone("1234567890");
      setPosition("Nhân viên");
      setUserName("hung.pq");
    } finally {
      setLoading(false);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const openModalHandler = () => {
    setOpenModal(true);
  };
  const closeModalHandler = () => {
    setOpenModal(false);
  };
  const saveChangesHandler = async () => {
    setLoading(true);
    try {
      const profileData = {
        firstName,
        lastName,
        birthDate,
        gender,
        email,
        phone,
        position,
        userName,
      };
      
      await userAPI.updateProfile(profileData);
      alert("Cập nhật thông tin thành công!");
      closeModalHandler();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  function Modal() {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-header">
            Xác nhận tạo tài khoản mới?
          </h2>
          <div className="modal-buttons">
            <button
              className="cancel-button"
              onClick={closeModalHandler}
            >
              Hủy
            </button>
            <button
              className="confirm-button"
              onClick={saveChangesHandler}
            >
             OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  const firstNameChange = (e) => {
    setFirstName(e.target.value);
    console.log("First Name: ", e.target.value);
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
  const positionChange = (e) => {
    setPosition(e.target.value);
  };
  const userNameChange = (e) => {
    setUserName(e.target.value);
  };

  return (
    <div className="manage-profile-container">
      
        <div className="form-row">

        <h2 className="personal-info-title">Cấp tài khoản mới</h2>
        <div className="button-container" style={{ marginLeft: "0.5rem" }}>
        <button
          className="create-button"
          onClick={openModalHandler}
        >
          Tạo tài khoản
        </button>
      </div>
      {openModal && <Modal />}
        </div>
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
          <label htmlFor="position">Chức vụ</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={positionChange}
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
     
      

 
     
    </div>
  );
}

export default ManageProfile;
