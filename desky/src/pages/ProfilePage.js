import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/ProfilePage.css';
import FeedSection from './FeedSection';
import CartSection from './CartSection';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말 회원 탈퇴하시겠습니까?')) return;

    try {
      const response = await axios.delete('http://localhost:5001/api/auth/delete', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      if (response.status === 200) {
        alert('회원 탈퇴가 완료되었습니다.');
        logout();
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.msg || '회원 탈퇴에 실패했습니다.');
    }
  };

  const handleMenuClick = (menu) => {
    if (menu === 'deleteAccount') {
      handleDeleteAccount();
    } else {
      setActiveTab(menu);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="sidebar-headerr">
          {user.profileImage ? (
            <img
              src={user.profileImage} // URL 직접 사용
              alt="Profile"
              className="sidebar-profile-images"
            />
          ) : (
            <div className="profile-placeholder">No Image</div>
          )}
          <h2 className="sidebar-nickname">@{user.nickname}</h2>
        </div>

        <div className="menu-itemm" onClick={() => handleMenuClick('feed')}>
          피드
        </div>
        <div className="menu-itemm" onClick={() => handleMenuClick('cart')}>
          장바구니
        </div>
        <div className="menu-itemm" onClick={() => handleMenuClick('inquiry')}>
          1:1 문의
        </div>
        <div className="menu-itemm" onClick={() => handleMenuClick('edit')}>
          정보 수정
        </div>
        <div className="menu-itemm" onClick={() => handleMenuClick('deleteAccount')}>
          회원 탈퇴
        </div>
      </div>

      <div className="profile-content">
        {error && <p className="error-message">{error}</p>}
        {activeTab === 'feed' && <FeedSection />}
        {activeTab === 'cart' && <CartSection />}
        {activeTab === 'inquiry' && <div>1:1 문의 섹션 (구현 예정)</div>}
        {activeTab === 'edit' && <div>정보 수정 섹션 (구현 예정)</div>}
      </div>
    </div>
  );
}

export default ProfilePage;