import { useState, useEffect } from "react";
import { getUserRole } from "../../services/permissions";
import { USER_ROLES } from "../../services/constants";
import ManageProfile from "./CreateUser/ManageProfile";
import InputWorkDay from "./InputWorkDay/InputWorkDay";
import WorkDayTable from "./ViewWorkDayTable/WorkDayTable";
import ManageAccount from "./ManageAccount";
import './ProfilePage.css';

function ProfilePage() {
  const userRole = getUserRole();
  const isAdmin = userRole === USER_ROLES.ADMIN;
  const isHR = userRole === USER_ROLES.HR;
  const isUser = userRole === USER_ROLES.USER;
  
  // HR and regular users should start with viewWorkDayTable (option 3)
  // Admin starts with manageProfile (option 1)
  const initialActive = isAdmin ? "1" : "3";
  const initialPage = isAdmin ? <ManageProfile /> : <WorkDayTable />;
  
  const [page, setPage] = useState(initialPage);
  const [active, setActive] = useState(initialActive);

  const handlePageChange = (e) => {
    // Only admins can navigate between pages
    if (!isAdmin) {
      return;
    }
    
    switch (e.target.innerText) {
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
        setPage(<ManageProfile />);
        setActive("1");
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
