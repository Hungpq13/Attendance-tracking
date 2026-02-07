import { useState, useEffect } from "react";
import { getUserRole } from "../../services/permissions";
import { USER_ROLES } from "../../services/constants";
import PersonalInfo from "./PersonalInfor/PersonalInfo";
import ManageProfile from "./CreateUser/ManageProfile";
import InputWorkDay from "./InputWorkDay/InputWorkDay";
import WorkDayTable from "./ViewWorkDayTable/WorkDayTable";
import ManageAccount from "./ManageAccount";
import './ProfilePage.css';

function ProfilePage() {
  const userRole = getUserRole();
  const isAdmin = userRole === USER_ROLES.ADMIN;
  
  // Default to personal info for all roles
  const initialActive = "0";
  const initialPage = <PersonalInfo />;
  
  const [page, setPage] = useState(initialPage);
  const [active, setActive] = useState(initialActive);

  const handlePageChange = (e) => {
    const label = e.target.innerText;

    // Non-admins can only access personal info and view workday
    if (!isAdmin && label !== "Thông tin cá nhân" && label !== "Xem ngày công") {
      return;
    }

    switch (label) {
      case "Thông tin cá nhân":
        setPage(<PersonalInfo />);
        setActive("0");
        break;
      case "Tạo tài khoản người dùng":
        setPage(<ManageProfile />);
        setActive("1");
        break;
      case "Nhập ngày công":
        setPage(<InputWorkDay />);
        setActive("2");
        break;
      case "Xem ngày công":
        setPage(<WorkDayTable />);
        setActive("3");
        break;
      default:
        setPage(<PersonalInfo />);
        setActive("0");
    }
  };

  return (

    <div
      className={`profile-page-container ${
        active === "2" || active === "3" ? "layout-column" : ""
      }`}
    >
      <ManageAccount active={active} handlePageChange={handlePageChange} />
      <div className="profile-content">
        {page}
      </div>
    </div>
  );
}

export default ProfilePage;
