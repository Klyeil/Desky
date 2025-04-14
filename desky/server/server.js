const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const path = require('path');


dotenv.config();

const app = express();

// CORS 설정
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));


app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected for Desky'))
  .catch(err => console.log(err));

// 라우트 연결
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/community', require('./routes/communityRoutes'))
app.use('/api/feeds', require('./routes/feedRoutes'))
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/products', require('./routes/productRoutes'))



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Desky server running on port ${PORT}`));