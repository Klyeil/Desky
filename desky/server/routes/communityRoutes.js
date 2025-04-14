const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// 게시글 목록 조회
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: '서버 오류' });
  }
});

// 게시글 작성
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = new Post({
      title,
      content,
      author: req.user, // auth 미들웨어에서 설정된 사용자 ID
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: '게시글 작성 실패' });
  }
});

module.exports = router;