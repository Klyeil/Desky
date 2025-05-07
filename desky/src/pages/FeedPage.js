import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/FeedPage.css';

const FeedPage = () => {
  const [feeds, setFeeds] = useState([]);
  const [error, setError] = useState('');
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
        setError('피드를 가져오는 데 실패했습니다.');
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

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="feed-page">
      <div className="feed-container">
        <div className="title">
          <div className="title-text">
            <h1 className="feed-main-title">데스크셋업</h1>
            <p className="feed-subtitle">여러분의 데스크셋업을 공유해보세요</p>
          </div>
          <button className="upload-button" onClick={handleUploadClick}>
            업로드
          </button>
        </div>
        <div className="feed-gridd">
          {feeds.length > 0 ? (
            feeds.map((feed) => {
              const imageUrl = `http://localhost:5001${feed.image.startsWith('/') ? '' : '/'}${feed.image}`;
              return (
                <div key={feed._id} className="feed-itemn" onClick={() => handleImageClick(feed._id)}>
                  <img
                    src={imageUrl}
                    alt={feed.title || '피드 이미지'}
                    className="feed-image"
                    onError={(e) => {
                      console.error('Image load failed for URL:', imageUrl);
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>
              );
            })
          ) : (
            <p>피드가 없습니다.</p>
          )}
        </div>
      </div>
      <button className="load-more-button">더 보기</button>
    </div>
  );
};

export default FeedPage;