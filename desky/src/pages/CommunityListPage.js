import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/CommunityListPage.css';

const CommunityListPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/community', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setPosts(response.data);
      } catch (err) {
        console.error('커뮤니티 게시글 로드 실패:', err);
      }
    };
    fetchPosts();
  }, []);

  const handleWriteClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/community/post');
    } else {
      navigate('/community/post');
    }
  };

  return (
    <div className="community-page">
      <h1 className="community-main-title">커뮤니티 게시판</h1>
      <p className="community-subtitle">자유롭게 의견을 나누는 공간입니다</p>

      <table className="community-table">
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>글쓴이</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>댓글수</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post._id}>
              <td>{posts.length - index}</td>
              <td>
                <a href={`/community/${post._id}`}>{post.title}</a>
              </td>
              <td>{post.author?.username || 'Unknown'}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              <td>{post.views || 0}</td>
              <td>{post.comments?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="community-footer">
        <div className="community-pagination">
          <button className="page-arrow">&lt;</button>
          <span className="page-number">1</span>
          <button className="page-arrow">&gt;</button>
        </div>
        <button className="community-write-button" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>
    </div>
  );
};

export default CommunityListPage;