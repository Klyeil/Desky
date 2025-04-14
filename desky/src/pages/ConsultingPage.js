import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ConsultingPage.css';

function ConsultingPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5001/api/consulting', formData, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      alert('컨설팅 신청 완료!');
    } catch (err) {
      alert('신청 실패');
    }
  };

  return (
    <div className="consulting-page">
      <h1>1:1 데스크 셋업 컨설팅</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="요청 내용"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">신청하기</button>
      </form>
    </div>
  );
}

export default ConsultingPage;