const https = require('https');
const http = require('http');

// Comprehensive test cho booking API
async function runAllTests() {
  console.log('=== COMPREHENSIVE BOOKING API TESTS ===\n');
  
  // Test 1: Booking thành công với ObjectId hợp lệ
  await testValidBooking();
  
  // Test 2: Validation với car ID sai
  await testInvalidCarId();
  
  // Test 3: Validation với supplier ID sai
  await testInvalidSupplierId();
  
  // Test 4: Test với missing data
  await testMissingData();
  
  console.log('\n=== ALL TESTS COMPLETED ===');
}

async function testValidBooking() {
  console.log('TEST 1: Booking thành công với ObjectId hợp lệ');
  try {
    const bookingData = {
      car: {
        _id: "685b2f4c35f5d4bed041fa7c",
        car_id: 5,
        car_name: "Toyota Vios",
        car_type: "Sedan",
        price_per_day: 800000
      },
      supplier: {
        id: "685ac1d2cc4de4474ee9543d",
        name: "ABC Car Rental"
      },
      customerInfo: {
        fullname: "Test User",
        email: "test@example.com",
        numberPhone: "0123456789"
      },
      rental: {
        startDate: "2025-06-27",
        startTime: "09:00",
        endDate: "2025-06-29",
        endTime: "18:00",
        mode: "self",
        location: "Hồ Chí Minh"
      },
      extras: [],
      pricing: { total: 1600000 }
    };
    
    const response = await makeBookingRequest(bookingData);
    
    if (response.success) {
      console.log('✅ PASS: Booking thành công');
    } else {
      console.log('❌ FAIL: Booking thất bại -', response.message);
    }
  } catch (error) {
    console.log('❌ FAIL: Error -', error.message);
  }
  console.log('');
}

async function testInvalidCarId() {
  console.log('TEST 2: Validation với car ID sai');
  try {
    const bookingData = {
      car: {
        _id: "invalid_id", // Invalid ObjectId
        car_name: "Toyota Vios"
      },
      supplier: {
        id: "685ac1d2cc4de4474ee9543d"
      },
      customerInfo: {
        fullname: "Test User",
        email: "test@example.com",
        numberPhone: "0123456789"
      },
      rental: {
        startDate: "2025-06-27",
        endDate: "2025-06-29"
      }
    };
    
    const response = await makeBookingRequest(bookingData);
    
    if (!response.success && response.message.includes('ID xe không hợp lệ')) {
      console.log('✅ PASS: Validation từ chối ObjectId sai');
    } else {
      console.log('❌ FAIL: Validation không hoạt động đúng');
    }
  } catch (error) {
    console.log('❌ FAIL: Error -', error.message);
  }
  console.log('');
}

async function testInvalidSupplierId() {
  console.log('TEST 3: Validation với supplier ID sai');
  try {
    const bookingData = {
      car: {
        _id: "685b2f4c35f5d4bed041fa7c"
      },
      supplier: {
        id: "123" // Invalid ObjectId
      },
      customerInfo: {
        fullname: "Test User", 
        email: "test@example.com",
        numberPhone: "0123456789"
      },
      rental: {
        startDate: "2025-06-27",
        endDate: "2025-06-29"
      }
    };
    
    const response = await makeBookingRequest(bookingData);
    
    if (!response.success && response.message.includes('ID nhà cung cấp không hợp lệ')) {
      console.log('✅ PASS: Validation từ chối supplier ID sai');
    } else {
      console.log('❌ FAIL: Validation không hoạt động đúng');
    }
  } catch (error) {
    console.log('❌ FAIL: Error -', error.message);
  }
  console.log('');
}

async function testMissingData() {
  console.log('TEST 4: Test với missing data');
  try {
    const bookingData = {
      // Missing car data
      supplier: {
        id: "685ac1d2cc4de4474ee9543d"
      }
    };
    
    const response = await makeBookingRequest(bookingData);
    
    if (!response.success && response.message.includes('Thiếu thông tin bắt buộc')) {
      console.log('✅ PASS: Validation từ chối missing data');
    } else {
      console.log('❌ FAIL: Validation không hoạt động đúng');
    }
  } catch (error) {
    console.log('❌ FAIL: Error -', error.message);
  }
  console.log('');
}

async function makeBookingRequest(bookingData) {
  const bookingJson = JSON.stringify(bookingData);
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/car-rental-service/book',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bookingJson)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ success: false, message: data });
        }
      });
    });
    req.on('error', reject);
    req.write(bookingJson);
    req.end();
  });
}

runAllTests();
