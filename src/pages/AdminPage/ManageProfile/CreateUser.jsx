import { useState, useEffect, useRef } from "react";
import { useUser } from "../../../presentation/hooks/useUser";
import { getUserFromToken } from "../../../config/TokenHelper";
import { useToast } from "../../../hooks/useToast";
import { userAPI } from "../../../services/api";
import "./ManageProfile.css";
import PasswordResultModal from "./PasswordResultModal";

function CreateUser() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [useAutoPassword, setUseAutoPassword] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [displayUsername, setDisplayUsername] = useState("");
  const username = useRef(null);
  const passwordFieldRef = useRef(null);
  
  const { showToast } = useToast();

  // Auto-scroll to password field when it appears
  useEffect(() => {
    if (!useAutoPassword && passwordFieldRef.current) {
      const timer = setTimeout(() => {
        passwordFieldRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [useAutoPassword]);

  const handleCreateUser = async () => {
    if (!fullName || !userName) {
      showToast("Vui lòng nhập đầy đủ thông tin.", "warning");
      return;
    }

    // If not using auto password, password is required
    if (!useAutoPassword && !password) {
      showToast("Vui lòng nhập mật khẩu.", "warning");
      return;
    }

    try {
     
      let response;
      
      if (useAutoPassword) {
        // Use auto-generated password
        const userData = {
          fullName,
          userName,
          email: email || "",
        };
        response = await userAPI.createUser(userData);
      } else {
        // Use manual password
        const userData = {
          username: userName,
          fullName,
          password,
          email: email || "",
        };
        response = await userAPI.createUserWithPassword(userData);
      }

      const resultPassword = response.generatedPassword || password;
      setGeneratedPassword(resultPassword);
      setDisplayUsername(userName);
      setOpenModal(false);
      setShowPasswordModal(true);

      // Reset form
      setFullName("");
      setEmail("");
      setUserName("");
      setPassword("");
    } catch (error) {
      const errorMessage =
        error.detail ||
        error.message ||
        "Tạo tài khoản thất bại. Vui lòng thử lại.";
      showToast(errorMessage, "error");
    }
  };

  const openModalHandler = () => {
    setOpenModal(true);
  };

  const closeModalHandler = () => {
    setOpenModal(false);
  };

  const closePasswordModalHandler = () => {
    setShowPasswordModal(false);
    setDisplayUsername("");
  };

  function Modal() {
    return (
      <div className="modal-overlay create-user-confirmation">
        <div className="modal-content">
          <p>Bạn có chắc muốn tạo tài khoản mới?</p>
          <div className="modal-buttons">
            <button className="cancel-button" onClick={closeModalHandler}>
              Hủy
            </button>
            <button className="confirm-button" onClick={handleCreateUser}>
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
  };

  const userNameChange = (e) => {
    setUserName(e.target.value);
  };

  const passwordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <div className="manage-profile-container">
      <div className="form-row top-form-row">
        <h2 className="personal-info-title">Cấp tài khoản mới</h2>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fullName">Tên đầy đủ</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={fullNameChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email 
            <span style={{ fontSize: '0.8rem', color: '#d1d5db', fontWeight: '300', marginLeft: '0.25rem' }}>
              (*không bắt buộc)
            </span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={emailChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="userName">Tên đăng nhập</label>
          <input
            ref={username}
            id="userName"
            value={userName}
            onChange={userNameChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="checkbox-group">
        <label className="checkbox-group label">
          <input
            type="checkbox"
            checked={!useAutoPassword}
            onChange={() => {
              setUseAutoPassword(!useAutoPassword);
            }}
          />
          <span className="checkbox-label-text">
            Nhập mật khẩu thủ công hoặc sử dụng mật khẩu tự động tạo
          </span>
        </label>
      </div>

      {!useAutoPassword && (
        <div className="password-field-section" ref={passwordFieldRef}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={passwordChange}
                  className="form-input"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  title={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="button-container">
        <button className="create-button" onClick={openModalHandler}>
          Tạo tài khoản
        </button>
      </div>
      {openModal && <Modal />}
      <PasswordResultModal 
        isOpen={showPasswordModal} 
        password={generatedPassword} 
        username={displayUsername}
        onClose={closePasswordModalHandler}
      />
    </div>
  );
}

export default CreateUser;
