const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  console.log('Debug middleware - authHeader:', authHeader);
  console.log('Debug middleware - token:', token);
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Debug middleware - JWT verify error:', err);
      return res.sendStatus(403);
    }
    
    console.log('Debug middleware - decoded user:', user);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
