const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// 장바구니 조회
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ msg: '서버 오류' });
  }
});

// 아이템 삭제
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user });
    if (!cart) return res.status(404).json({ msg: '장바구니 없음' });

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();
    res.json({ msg: '아이템 삭제 완료' });
  } catch (err) {
    res.status(500).json({ msg: '서버 오류' });
  }
});

module.exports = router;