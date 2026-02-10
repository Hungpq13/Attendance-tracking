import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../presentation/hooks/useAuth';
import './Login.css';

/**
 * Login Page
 * Trang đăng nhập người dùng
 */
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);
  
  // Lấy auth functions từ custom hook
  const { login, loading, error } = useAuth();

  /**
   * Xử lý submit form đăng nhập
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nhập liệu
    if (!username || !password) {
      alert('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
debugger ;
    try {
      // Gọi login use case từ hook
      const result = await login(username, password);
      
      if (result.success) {
        console.log('🎯 Chuyển hướng đến /main...');
        
        // Chờ một chút để browser lưu password trước khi chuyển hướng
        setTimeout(() => {
          navigate('/main', { replace: true });
        }, 100);
      }
    } catch (error) {
      console.error('❌ Lỗi đăng nhập:', error);
      alert(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
    }
  };

  return (
    <div className="center">
      <h2>Phần mềm quản lý ngày công</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="txt_field" style={{ cursor: 'pointer' }}>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            disabled={loading}
          />
          <span></span>
          <label htmlFor="username">Tên đăng nhập</label>
        </div>
        <div className="txt_field password-field">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password"
            title={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
          <span></span>
          <label htmlFor="password">Mật khẩu</label>
        </div>
        <div className="pass">Quên mật khẩu?</div>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <input 
          type="submit" 
          value={loading ? "Đang đăng nhập..." : "Đăng nhập"} 
          style={{marginBottom: '50px'}}
          disabled={loading}
        />
      </form>
    </div>
  );
}

export default Login;
 