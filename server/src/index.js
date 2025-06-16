const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
console.log("NODE_ENV:", process.env.NODE_ENV);
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const authRoutes = require("./routes/auth");

const carRentalRoutes = require('./routes/carRentalService'); // Import router API
const userRoutes = require("./routes/userRoutes");


const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());



// Connect mongoDB
const db = require('./config/db')
db.connect()


// CẤU HÌNH SESSION 
app.use(session({
  secret: process.env.SESSION_SECRET || "secret_key",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  }),
}));

app.use("/create-tour", bookingTourRouter);
// API Routes
app.use("/api/auth", authRoutes);
app.use('/api/car-rental-service', carRentalRoutes);
app.use("/api/user", userRoutes);

// Serve React (chỉ dùng khi deploy production)
const clientBuildPath = path.join(__dirname, '../../client/build');

if (process.env.NODE_ENV === 'production') {
  console.log("🌐 Serving React from:", clientBuildPath);
  app.use(express.static(clientBuildPath));

  // app.get('*', (req, res) => {
  //   res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  // });
}
// Route mặc định (dev)
app.get("/", (req, res) => {
  res.send(
    "Server Express đang chạy. Hãy truy cập React tại http://localhost:3000"
  );
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
