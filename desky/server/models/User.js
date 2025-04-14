const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true }, // name → username으로 변경
  nickname: { type: String, required: true, unique: true }, // 추가
  birthday: { type: String, required: true },
  address: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user',
  },
  profileImage: { type: String }, // 추가
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);