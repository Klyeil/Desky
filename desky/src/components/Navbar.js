import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiSignIn, PiSignOut } from 'react-icons/pi';
import { FaRegUser } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* 로고 */}
      <Link to="/" className="nav_logo">
        <img src="/main_icon.png" alt="Desky Logo" className="logo-image" />
      </Link>

      {/* 센터 메뉴 */}
      <ul className="center-menu">
        <li>
          <Link to="/products">1:1 컨설팅</Link>
        </li>
        <li>
          <Link to="/community">커뮤니티</Link>
        </li>
        <li>
          <Link to="/desk">데스크 셋업</Link>
        </li>
      </ul>

      {/* 오른쪽 메뉴 */}
      <div className="nav-right">
        {user ? (
          <>
          
            <Link to="/profile" className="nav-button login-link">
              <FaRegUser className="user-icon" />
              마이페이지
            </Link>
            <div className="nav-button logout-link" onClick={handleLogout}>
              <PiSignOut className="login-icon" />
              로그아웃
            </div>
          </>
        ) : (
          <Link to="/login" className="nav-button login-link">
            <PiSignIn className="login-icon" />
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

