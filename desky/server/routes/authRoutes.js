const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// 회원가입
router.post('/register', async (req, res) => {
  const { email, password, username, nickname, birthday, address, profileImage } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = await User.findOne({ nickname });
    if (user) return res.status(400).json({ msg: 'Nickname already taken' });

    user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      username,
      nickname,
      birthday,
      address,
      profileImage, // 선택적 필드
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email, username, nickname } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username, nickname: user.nickname } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// 사용자 정보 조회
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// 회원 탈퇴
router.delete('/delete', auth, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.user);
      res.status(200).json({ msg: '회원 탈퇴 완료' });
    } catch (err) {
      res.status(500).json({ msg: '서버 오류' });
    }
  });

module.exports = router;