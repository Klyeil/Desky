const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 상품 목록 조회
router.get('/list', async (req, res) => {
  try {
    const products = await Product.find().limit(4); // 상위 4개만
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: '서버 오류' });
  }
});

module.exports = router;