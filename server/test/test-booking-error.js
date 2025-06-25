const https = require('https');
const http = require('http');

// Test booking API với dữ liệu có lỗi để kiểm tra validation
async function testBookingWithError() {
  try {
    console.log('=== Testing Car Booking API với ID sai để kiểm tra validation ===');
    
    // Mock booking data với car_id là số thay vì ObjectId (để test validation)
    const bookingData = {
      car: {
        _id: "7", // Số thay vì ObjectId - sẽ gây lỗi validation
        car_id: 7,
        car_name: "Toyota Vios",
        car_type: "Sedan", 
        price_per_day: 800000
      },
      supplier: {
        id: "685ac1d2cc4de4474ee9543d", // ObjectId hợp lệ
        name: "ABC Car Rental",
        location: "Hồ Chí Minh"
      },
      customerInfo: {
        fullname: "Nguyễn Văn Test",
        email: "test@example.com", 
        numberPhone: "0123456789"
      },
      rental: {
        startDate: "2025-06-26",
        startTime: "09:00",
        endDate: "2025-06-28",
        endTime: "18:00",
        mode: "self",
        location: "Hồ Chí Minh"
      },
      pickupLocation: {
        address: "123 Test Street",
        coordinates: { lat: 10.762622, lng: 106.660172 },
        type: "office"
      },
      dropoffLocation: {
        address: "456 Test Avenue",
        coordinates: { lat: 10.762622, lng: 106.660172 },
        type: "office"
      },
      extras: [],
      pricing: {
        basePrice: 1600000,
        extraCharges: 0,
        taxes: 0,
        total: 1600000,
        days: 2,
        currency: "VND"
      }
    };
    
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
    
    const response = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        });
      });
      req.on('error', reject);
      req.write(bookingJson);
      req.end();
    });
    
    console.log('Booking response:', response);
    
    if (response.success) {
      console.log('❌ Booking thành công (không mong muốn)');
    } else {
      console.log('✅ Booking thất bại như mong đợi (validation hoạt động):');
      console.log('Error:', response.message);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testBookingWithError();
