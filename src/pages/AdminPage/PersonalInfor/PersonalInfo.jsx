import { useState, useEffect } from "react";
import { useAuth } from "../../../presentation/hooks/useAuth";
import { useUser } from "../../../presentation/hooks/useUser";
import { getUserFromToken } from "../../../config/TokenHelper";
import { userAPI } from "../../../services/api";
import "./PersonalInfo.css";

function PersonalInfo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const user = getUserFromToken();
      if (!user) {
        throw new Error('No user found in token');
      }
      
      const data = await userAPI.getProfile(user.id);
      setFirstName(user?.username || "");
      setLastName(data.lastName || "");
      
      let formattedDate = "";
      const dateValue = data.dateOfBirth || data.birthDate || data.dob || "";
      if (Array.isArray(dateValue)) {
        const [year, month, day] = dateValue;
        formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
      } else if (typeof dateValue === 'string') {
        const datePart = dateValue.includes('T') ? dateValue.split('T')[0] : dateValue;
        const [year, month, day] = datePart.split('-');
        formattedDate = `${day}/${month}/${year}`;
      }
      setDateOfBirth(formattedDate);
      setGender(data.gender || "");
      setEmail(user?.email || "");
      setPhoneNumber(data.phoneNumber || "");
      setAvatarUrl(data.avatarUrl || "");
      setUserName(user?.username || "");
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="personal-info-container">
      <h2 className="personal-info-title">Thông tin cá nhân</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">Tên</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="form-input"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Họ</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="form-input"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Ngày sinh</label>
          <input
            type="text"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="form-input"
            readOnly
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="gender">Giới tính</label>
          <input
            type="text"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="form-input"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Số điện thoại</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="form-input"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;

