const sql = require("mssql");

const config = {
  server: "LAPTOP-6S4RBQLB",
  database: "QLuser",
  user: "sa", // user SQL Server bạn vừa tạo
  password: "123", // mật khẩu bạn đặt
  options: {
    encrypt: false, // hoặc true nếu SQL Server bật TLS
    trustServerCertificate: true, // chấp nhận self-signed certificate nếu có
  },
};

sql
  .connect(config)
  .then(() => {
    return sql.query("SELECT * FROM Nguoidung");
  })
  .then((result) => {
    console.log(result.recordset);
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });
