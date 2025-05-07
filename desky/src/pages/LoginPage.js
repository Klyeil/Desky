import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault(); // 새로고침 방지
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || '로그인에 실패했습니다.');
    }
  };

  if (loading) return <div>로딩 중</div>;

  return (
    <div className="main-page">
      <div className="login-container">
        <div className="login-box">
          <h1>로그인</h1>
          <p>이메일과 비밀번호를 입력하세요</p>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin} className="form-containers">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <button type="submit" className="login-button">
              로그인
            </button>
            <div className="save-password">
              <div className="login-save">
                <input type="checkbox" />
                <div className="save-login">로그인 상태 유지</div>
              </div>
              <div className="forget-password">
                <a href="/forget">비밀번호 찾기</a>
              </div>
            </div>
          </form>
          <div className="signup-link">
            계정이 없으신가요? <a href="/signup">회원가입</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

