import { getUserRole } from '../../services/permissions';
import { USER_ROLES } from '../../services/constants';
import './ManageAccount.css';

function ManageAccount({ active, handlePageChange }) {
  const userRole = getUserRole();
  
  // Only admins can access all features
  const isAdmin = userRole === USER_ROLES.ADMIN;
  const isHR = userRole === USER_ROLES.HR;
  const isUser = userRole === USER_ROLES.USER;

  return (
    <div className="manage-account">
     
      
      <ul>
         <h2>Bảng điều khiển</h2>
        <hr></hr>
        
        {isAdmin && (
          <li
            className={active === "1" ? "active" : ""}
            onClick={handlePageChange}
          >
            Tạo tài khoản người dùng
          </li>
        )}
        
        {isAdmin && (
          <li
            className={active === "2" ? "active" : ""}
            onClick={handlePageChange}
          >
            Nhập ngày công
          </li>
        )}
        
        <li
          className={active === "3" ? "active" : ""}
          onClick={handlePageChange}
        >
         Xem ngày công
        </li>
       
      </ul>
    </div>
  );
}

export default ManageAccount;
