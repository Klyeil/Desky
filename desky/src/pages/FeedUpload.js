import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import '../styles/FeedUpload.css';

const FeedUpload = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      setError('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
  
    if (!title || !content || !image) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);
  
    try {
      const response = await axios.post('http://localhost:5001/api/feeds/upload', formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      if (response.status === 201) {
        alert('피드가 업로드되었습니다!');
        navigate('/feed');
      }
    } catch (err) {
      console.error('업로드 에러:', err); // 디버깅용
      setError(err.response?.data?.msg || '피드 업로드에 실패했습니다.');
    }
  };

  return (
    <div className="feed-upload-container">
      <form className="feed-upload-form" onSubmit={handleSubmit}>
        <div className="box-section">
          <div className="image-upload-area" onDragOver={handleDragOver} onDrop={handleDrop}>
            {preview ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <>
                <IoCloudUploadOutline className="upload-icon" />
                <p>드래그하여 파일을 업로드하거나</p>
                <label htmlFor="image" className="file-select-button">
                  파일 선택
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              name="content"
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="box-section product-selection-section">
          <div className="product-selection-header">
            <h3>선택된 제품</h3>
            <button type="button" className="add-product-btns">
              <FaPlus style={{ marginRight: '6px' }} />
              제품 추가
            </button>
          </div>
          <p>선택된 제품이 없습니다.</p>
        </div>

        <div className="button-group">
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            피드 업로드
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedUpload;