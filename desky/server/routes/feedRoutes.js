const express = require('express');
const router = express.Router();
const Feed = require('../models/Feed');
const auth = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 피드 업로드
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);
  console.log('User:', req.user);

  try {
    if (!title || !content) {
      return res.status(400).json({ msg: '제목과 내용을 입력해주세요.' });
    }
    if (!req.file) {
      return res.status(400).json({ msg: '이미지를 업로드해주세요.' });
    }

    const feed = new Feed({
      title,
      content,
      image: req.file.path,
      author: req.user,
    });
    await feed.save();
    res.status(201).json(feed);
  } catch (err) {
    console.error('업로드 에러:', err);
    res.status(500).json({ msg: '피드 업로드 실패', error: err.message });
  }
});

// 내 피드 조회 (새 엔드포인트)
router.get('/my-feeds', auth, async (req, res) => {
  try {
    const feeds = await Feed.find({ author: req.user })
      .populate('author', 'nickname profileImage')
      .populate('products')
      .populate('comments.author', 'nickname profileImage')
      .sort({ createdAt: -1 }); // 최신순 정렬
    res.json(feeds);
  } catch (err) {
    console.error('내 피드 조회 에러:', err);
    res.status(500).json({ msg: '서버 오류', error: err.message });
  }
});

// 피드 상세 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.id)
      .populate('author', 'nickname profileImage')
      .populate('products')
      .populate('comments.author', 'nickname profileImage');
    if (!feed) return res.status(404).json({ msg: '피드 없음' });
    feed.views += 1;
    await feed.save();
    res.json(feed);
  } catch (err) {
    console.error('조회 에러:', err);
    res.status(500).json({ msg: '서버 오류', error: err.message });
  }
});

// 좋아요 토글
router.post('/:id/like', auth, async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.id);
    if (!feed) return res.status(404).json({ msg: '피드 없음' });
    const userId = req.user;
    const index = feed.likedBy.indexOf(userId);
    if (index === -1) {
      feed.likedBy.push(userId);
    } else {
      feed.likedBy.splice(index, 1);
    }
    await feed.save();
    res.json({ liked: index === -1 });
  } catch (err) {
    console.error('좋아요 에러:', err);
    res.status(500).json({ msg: '서버 오류', error: err.message });
  }
});

// 저장 토글
router.post('/:id/save', auth, async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.id);
    if (!feed) return res.status(404).json({ msg: '피드 없음' });
    const userId = req.user;
    const index = feed.savedBy.indexOf(userId);
    if (index === -1) {
      feed.savedBy.push(userId);
    } else {
      feed.savedBy.splice(index, 1);
    }
    await feed.save();
    res.json({ saved: index === -1 });
  } catch (err) {
    console.error('저장 에러:', err);
    res.status(500).json({ msg: '서버 오류', error: err.message });
  }
});

// 댓글 작성
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content, parentId } = req.body;
    if (!content) return res.status(400).json({ msg: '댓글 내용을 입력해주세요.' });
    const comment = {
      content,
      author: req.user,
      parentId: parentId || null,
    };
    const feed = await Feed.findById(req.params.id);
    if (!feed) return res.status(404).json({ msg: '피드 없음' });
    feed.comments.unshift(comment);
    await feed.save();
    const newComment = feed.comments[0];
    await newComment.populate('author', 'nickname profileImage');
    res.json(newComment);
  } catch (err) {
    console.error('댓글 에러:', err);
    res.status(500).json({ msg: '서버 오류', error: err.message });
  }
});

// 피드 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.id);
    if (!feed) return res.status(404).json({ msg: '피드 없음' });
    if (String(feed.author) !== String(req.user)) {
      return res.status(403).json({ msg: '권한 없음' });
    }
    await Feed.deleteOne({ _id: req.params.id });
    res.json({ msg: '피드 삭제 완료' });
  } catch (err) {
    console.error('삭제 에러:', err);
    res.status(500).json({ msg: '서버 오류', error: err.message });
  }
});

module.exports = router;