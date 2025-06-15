const sql = require("mssql");

// Chỉ export config, KHÔNG kết nối và query ở đây

const config = {
  server: "LAPTOP-6S4RBQLB",
  database: "QLTour", // Đổi lại đúng tên database nếu cần
  user: "sa",
  password: "123",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

module.exports = config;
