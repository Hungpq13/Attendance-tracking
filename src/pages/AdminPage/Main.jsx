import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../presentation/hooks/useAuth';
import { getUserFromToken } from '../../config/TokenHelper';
import { STORAGE_TOKEN, STORAGE_USER, STORAGE_REFRESH_TOKEN } from '../../config/constants';
import PersonalInfo from './PersonalInfor/PersonalInfo';
import ManageProfile from './CreateUser/ManageProfile';
import InputWorkDay from './InputWorkDay/InputWorkDay';
import WorkDayTable from './ViewWorkDayTable/WorkDayTable';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import './Main.css';

function Main() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = getUserFromToken();
    
    if (!userInfo) {
      navigate('/');
    } else {
      setUser(userInfo);
    }
  }, [navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <PersonalInfo />;
      case 'manage':
        return <ManageProfile />;
      case 'input':
        return <InputWorkDay />;
      case 'view':
        return <WorkDayTable />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="main-wrapper">
        <Topbar user={user} avatar={avatar} onAvatarChange={handleAvatarChange} />
        <main className="main-content">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
}

export default Main;



