import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart, AiOutlineInfoCircle } from 'react-icons/ai';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import { IoMdImages } from 'react-icons/io';
import { AuthContext } from '../context/AuthContext';
import '../styles/FeedDetail.css';

const FeedDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/feeds/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setFeed(response.data);
        setComments(response.data.comments || []);
        setLiked(response.data.likedBy?.includes(user?._id));
        setSaved(response.data.savedBy?.includes(user?._id));
      } catch (err) {
        setError('피드를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedDetail();
  }, [id, user]);

  const handleLike = async () => {
    try {
      await axios.post(
        `http://localhost:5001/api/feeds/${id}/like`,
        {},
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setLiked((prev) => !prev);
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(
        `http://localhost:5001/api/feeds/${id}/save`,
        {},
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setSaved((prev) => !prev);
    } catch (err) {
      console.error('저장 실패:', err);
    }
  };

  const handleEditPost = () => {
    navigate(`/feeds/edit/${id}`);
  };

  const handleDeletePost = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`http://localhost:5001/api/feeds/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      alert('게시글이 삭제되었습니다.');
      navigate('/feed');
    } catch (err) {
      alert('게시글 삭제 실패');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/feeds/${id}/comments`,
        { content: commentText },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setComments([response.data, ...comments]);
      setCommentText('');
    } catch (err) {
      alert('댓글 작성 실패');
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/feeds/${id}/comments`,
        { content: replyText, parentId },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === parentId
            ? { ...comment, replies: [response.data, ...(comment.replies || [])] }
            : comment
        )
      );
      setReplyText('');
      setReplyingTo(null);
    } catch (err) {
      alert('답글 작성 실패');
    }
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!feed) return <div className="error">피드를 찾을 수 없습니다.</div>;

  const isAuthor = user && String(user._id) === String(feed.author._id);

  return (
    <div className="community-detail-container">
      <div className="post-card">
        <h1 className="post-title">{feed.title}</h1>
        <div className="post-meta">
          <img
            src={feed.author?.profileImage || '/default-avatar.png'}
            alt="작성자"
            className="author-avatar"
          />
          <div className="author-info">
            <span className="author-name">{feed.author?.nickname || 'Unknown'}</span>
            <span className="post-date">{new Date(feed.createdAt).toLocaleDateString()}</span>
            <span className="post-views">조회수 {feed.views || 0}</span>
          </div>
        </div>

        <div className="post-content">
          {feed.image && <img src={feed.image} alt={feed.title} className="post-image" />}
          <p>{feed.content}</p>
        </div>

        {feed.products && feed.products.length > 0 && (
          <div className="used-products-section">
            <h2 className="used-products-title">사용 제품 목록</h2>
            <div className="used-products-list">
              {feed.products.map((product) => (
                <div key={product._id} className="used-product-item">
                  <div className="used-product-left">
                    <span className="product-name">{product.name}</span>
                  </div>
                  <div className="used-product-right">
                    <span className="product-price">{product.price.toLocaleString()}원</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="feed-actions">
          <div className="like-icon" onClick={handleLike}>
            {liked ? <AiFillHeart color="#7655E3" size={24} /> : <AiOutlineHeart color="gray" size={24} />}
          </div>
          <div className="save-icon" onClick={handleSave}>
            {saved ? <MdBookmark color="#7655E3" size={24} /> : <MdBookmarkBorder color="gray" size={24} />}
          </div>
        </div>

        {isAuthor && (
          <div className="post-actions">
            <button className="edit-btn" onClick={handleEditPost}>수정</button>
            <button className="delete-btn" onClick={handleDeletePost}>삭제</button>
          </div>
        )}
      </div>

      <div className="comment-container">
        <div className="comment-write-box">
          <h2 className="comment-title">댓글 작성</h2>
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              className="comment-textarea"
              placeholder="댓글을 입력하세요..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <div className="comment-form-bottom">
              <label htmlFor="fileInput" className="comment-file-label">
                <IoMdImages size={20} />
                <input id="fileInput" type="file" style={{ display: 'none' }} />
              </label>
              <button type="submit" className="comment-submit-btn">등록</button>
            </div>
          </form>
        </div>

        <div className="comment-list-box">
          <h2 className="comment-list-title">댓글 {comments.length}개</h2>
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment._id} className="comment-item">
                <div className="comment-meta">
                  <img
                    src={comment.author?.profileImage || '/default-avatar.png'}
                    alt="작성자"
                    className="comment-author-avatar"
                  />
                  <div className="comment-author-info">
                    <span className="comment-author-name">{comment.author?.nickname || '익명'}</span>
                    <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="comment-content">{comment.content}</p>
                <div className="comment-actions">
                  <span className="reply-link" onClick={() => setReplyingTo(comment._id)}>답글</span>
                </div>

                {replyingTo === comment._id && (
                  <form className="reply-form" onSubmit={(e) => handleReplySubmit(e, comment._id)}>
                    <div className="reply-textarea-container">
                      <textarea
                        className="reply-textarea"
                        placeholder="답글을 입력하세요..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                      />
                      <button type="submit" className="reply-submit-btn">등록</button>
                    </div>
                  </form>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <ul className="reply-list">
                    {comment.replies.map((reply) => (
                      <li key={reply._id} className="reply-item">
                        <div className="reply-meta">
                          <img
                            src={reply.author?.profileImage || '/default-avatar.png'}
                            alt="작성자"
                            className="reply-author-avatar"
                          />
                          <div className="reply-author-info">
                            <span className="reply-author-name">{reply.author?.nickname || '익명'}</span>
                            <span className="reply-date">{new Date(reply.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="reply-content">{reply.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="detail-navigation">
        <button className="nav-btn prev-post">{'< 이전글'}</button>
        <button className="nav-btn next-post">{'다음글 >'}</button>
        <button className="nav-btn back-button" onClick={() => navigate('/feed')}>
          목록으로
        </button>
      </div>
    </div>
  );
};

export default FeedDetail;