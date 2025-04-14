import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaListUl,
  FaListOl,
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import '../styles/PostCreationPage.css';

const PostCreationPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/community',
        { title, content },
        {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        }
      );
      console.log('Post created successfully:', response.data);
      navigate('/community');
    } catch (err) {
      setError(err.response?.data?.msg || '게시글 작성에 실패했습니다.');
    }
  };

  return (
    <div className="post-creation-container">
      <div className="post-header">
        <h1>게시물 작성</h1>
      </div>
      {error && <p className="error-message">{error}</p>}
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="title"
            name="title"
            placeholder="제목을 입력하세요"
            className="post-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group editor-container">
          <div className="editor-toolbar">
            <FaBold className="toolbar-icon" title="Bold" />
            <FaItalic className="toolbar-icon" title="Italic" />
            <FaUnderline className="toolbar-icon" title="Underline" />
            <FaAlignLeft className="toolbar-icon" title="Align Left" />
            <FaAlignCenter className="toolbar-icon" title="Align Center" />
            <FaAlignRight className="toolbar-icon" title="Align Right" />
            <FaListUl className="toolbar-icon" title="Bullet List" />
            <FaListOl className="toolbar-icon" title="Numbered List" />
          </div>
          <textarea
            id="description"
            name="description"
            placeholder="내용을 입력하세요"
            className="post-content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="button" className="save-draft">
            임시저장
          </button>
          <button
            type="button"
            className="cancel"
            onClick={() => navigate('/community')}
          >
            취소
          </button>
          <button type="submit" className="submit">
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreationPage;