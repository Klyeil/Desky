import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronRight } from 'react-icons/fa';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/products/list');
        setProducts(response.data);
      } catch (error) {
        console.error('상품 목록 불러오기 실패:', error);
        setProducts([]);
      }
    };

    const fetchFeeds = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/feeds/main');
        setFeeds(response.data);
      } catch (error) {
        console.error('피드 불러오기 실패:', error);
        setFeeds([]);
      }
    };

    fetchProducts();
    fetchFeeds();
  }, []);

  const visibleProducts = products.slice(0, 4);
  const visibleFeeds = feeds.slice(0, 3);

  const handleFeedClick = (feedId) => {
    navigate(`/feeds/${feedId}`);
  };

  return (
    <div className="main-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">나만의 완벽한 데스크셋업</h1>
          <p className="hero-subtitle">
            최고의 제품으로 만드는 당신만의 특별한 작업·공간
          </p>
          <button className="hero-button">공유하기</button>
        </div>
      </section>

      <section className="bestseller-section">
        <h2 className="section-title">
          데스크 상품
          <FaChevronRight
            onClick={() => navigate('/products')}
            style={{ cursor: 'pointer', marginLeft: '8px', fontSize: '15px' }}
          />
        </h2>
        <div className="bestseller-grid">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
              <div className="product-item" key={product._id}>
                <img src={product.image} alt={product.name} />
                <p className="product-name">{product.name}</p>
                <p className="product-price">
                  {product.price ? product.price.toLocaleString() : '0'}원
                </p>
              </div>
            ))
          ) : (
            <p>표시할 상품이 없습니다.</p>
          )}
        </div>
      </section>

      <section className="gallery-section">
        <h2 className="section-title">
          데스크 셋업
          <FaChevronRight
            onClick={() => navigate('/desk')}
            style={{ cursor: 'pointer', marginLeft: '8px', fontSize: '15px' }}
          />
        </h2>
        <div className="gallery-grid">
          {visibleFeeds.length > 0 ? (
            visibleFeeds.map((feed) => (
              <div
                key={feed._id}
                className="gallery-item"
                onClick={() => handleFeedClick(feed._id)}
              >
                <img src={feed.image} alt={feed.title} />
                <p className="gallery-name">
                  {feed.title} <span>@{feed.author?.nickname || 'unknown'}</span>
                </p>
              </div>
            ))
          ) : (
            <p>
              갤러리에 표시할 피드가 없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;