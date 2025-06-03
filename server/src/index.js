const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./routes/api'); // Import router API

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Serve React (chỉ dùng khi deploy production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}

// Route mặc định (dev)
app.get('/', (req, res) => {
  res.send('Server Express đang chạy. Hãy truy cập React tại http://localhost:3000');
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});