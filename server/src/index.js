const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./routes/auth");

const carRentalRoutes = require('./routes/carRentalService'); // Import router API
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();
const port = 3001;

// Middleware
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(express.json());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set secure: true if using https
}));

// Connect mongoDB
const db = require('./config/db')
db.connect()

// API Routes
app.use("/api/auth", authRoutes);
app.use('/api/car-rental-service  ', carRentalRoutes);
app.use("/api/user", userRoutes);

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