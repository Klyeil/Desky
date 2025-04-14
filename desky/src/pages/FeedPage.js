import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/FeedPage.css';

const FeedPage = () => {
  const [feeds, setFeeds] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/feeds', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setFeeds(response.data);
      } catch (err) {
        console.error('Error fetching feeds:', err);
      }
    };
    fetchFeeds();
  }, []);

  const handleImageClick = (id) => {
    navigate(`/feeds/${id}`);
  };

  const handleUploadClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    } else {
      navigate('/desk/upload');
    }
  };

  return (
    <div className="feed-page">
      <div className="feed-container">
        <div className="title">
          <h1 className="feed-main-title">데스크셋업</h1>
          <p className="feed-subtitle">여러분의 데스크셋업을 공유해보세요</p>
        </div>
        <button className="upload-button" onClick={handleUploadClick}>
          업로드
        </button>
        <div className="feed-gridd">
          {feeds.map((feed) => (
            <div key={feed._id} className="feed-itemn" onClick={() => handleImageClick(feed._id)}>
              <img src={feed.image} alt={feed.title} className="feed-image" />
            </div>
          ))}
        </div>
      </div>
      <button className="load-more-button">더 보기</button>
    </div>
  );
};

export default FeedPage;