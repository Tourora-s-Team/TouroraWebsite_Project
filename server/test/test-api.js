const https = require('https');
const http = require('http');

// Test login và get cars
async function testAPI() {
  try {
    console.log('=== Testing Admin Login ===');
    
    // 1. Đăng nhập với tài khoản vana (có xe)
    const loginData = JSON.stringify({
      username: 'vana',
      password: '123' // Đảm bảo password đúng
    });
    
    const loginOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };
    
    const loginResponse = await new Promise((resolve, reject) => {
      const req = http.request(loginOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });
    
    console.log('Login response:', loginResponse);
    
    if (loginResponse.success) {
      const token = loginResponse.token;
      console.log('Token:', token);
      
      // Decode token để xem nội dung
      const jwt = require('jsonwebtoken');
      const decoded = jwt.decode(token);
      console.log('Decoded token:', decoded);
      
      console.log('\n=== Testing Get Cars API ===');
      
      // 2. Gọi API lấy danh sách xe
      const carsOptions = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/admin/cars',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const carsResponse = await new Promise((resolve, reject) => {
        const req = http.request(carsOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        });
        req.on('error', reject);
        req.end();
      });
      
      console.log('Cars response:', carsResponse);
      console.log('Number of cars:', carsResponse.length);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
