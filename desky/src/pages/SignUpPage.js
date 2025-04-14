import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRegEye } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import '../styles/LoginPage.css';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState(''); // 추가
  const [birth, setBirth] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [error, setError] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError('주소 검색 스크립트를 로드할 수 없습니다.');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddressSearch = () => {
    if (!scriptLoaded || !window.daum || !window.daum.Postcode) {
      setError('주소 검색 기능을 사용할 수 없습니다. 페이지 새로고침을 시도하세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        setAddress(data.address);
      },
    }).open();
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const fullAddress = `${address} ${detailAddress}`.trim();
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        email,
        password,
        username,
        nickname, // 추가
        birthday: birth,
        address: fullAddress,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setError('');
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.msg || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>회원가입</h1>
        <p>계정을 만들어 시작하세요</p>
        {error && <p className="error-message">{error}</p>}
        <div className="form-containers">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <div className="password-container">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <span className="eye-icon">
              <FaRegEye />
            </span>
          </div>
          <input
            type="text"
            placeholder="이름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="date"
            placeholder="생년월일"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="주소 검색"
            value={address}
            onClick={handleAddressSearch}
            readOnly
            className="input-field"
          />
          <input
            type="text"
            placeholder="상세 주소"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            className="input-field"
          />
          <button className="login-button" onClick={handleSignUp}>
            회원가입
          </button>
        </div>
        <div className="signup-link">
          이미 계정이 있으신가요? <a href="/login">로그인</a>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;