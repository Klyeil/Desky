import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/FeedSection.css';

function FeedSection() {
  const [feeds, setFeeds] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserFeeds = async () => {
      if (!user) {
        setError('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching my feeds from /api/feeds/my-feeds');
        const response = await axios.get('http://localhost:5001/api/feeds/my-feeds', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        console.log('Fetched feeds:', response.data);
        setFeeds(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        if (err.response?.status === 401) {
          setError('세션이 만료되었습니다. 다시 로그인하세요.');
          navigate('/login');
        } else {
          setFeeds([]);
          setError('피드를 가져오는 데 실패했습니다.');
        }
      }
    };

    fetchUserFeeds();
  }, [user, navigate]);

  const goToFeedDetail = (feedId) => {
    navigate(`/feeds/${feedId}`);
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="feeds">
      {feeds.length > 0 ? (
        feeds.map((feed) => {
          const imageUrl = `http://localhost:5001${feed.image.startsWith('/') ? '' : '/'}${feed.image}`; // 슬래시 보장
          console.log('Image URL:', imageUrl);
          return (
            <div
              key={feed._id}
              className="feed-item"
              onClick={() => goToFeedDetail(feed._id)}
            >
              {feed.image ? (
                <img
                  src={imageUrl}
                  alt={feed.title || '피드 이미지'}
                  className="feed-image"
                  onError={(e) => {
                    console.error('Image load failed for URL:', imageUrl);
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              ) : (
                <p>이미지 없음</p>
              )}
            </div>
          );
        })
      ) : (
        <p>표시할 피드가 없습니다.</p>
      )}
    </div>
  );
}

export default FeedSection;