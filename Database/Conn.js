module.exports = {
  user: "sa",
  password: "123",
  server: "laptop-6s4rbqlb", // hoặc IP hoặc tên server SQL của bạn
  database: "QLTour",
  options: {
    encrypt: false, // true nếu dùng Azure, false nếu SQL Server local
    trustServerCertificate: true, // true nếu dùng self-signed cert
  },
};
