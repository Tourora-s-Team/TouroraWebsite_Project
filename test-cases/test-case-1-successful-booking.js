const http = require('http');

/**
 * TEST CASE 1: Đặt Xe Thành Công (Happy Path)
 * Mục tiêu: Kiểm tra chức năng đặt xe hoạt động chính xác trong điều kiện bình thường
 */

// Màu sắc cho console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

async function testCase1_SuccessfulBooking() {
    console.log(`${colors.blue}=== TEST CASE 1: ĐẶT XE THÀNH CÔNG ===${colors.reset}`);
    console.log('Mục tiêu: Kiểm tra đặt xe trong điều kiện bình thường\n');
    
    try {
        // Dữ liệu booking hợp lệ
        const bookingData = {
            car: {
                _id: "675b2f4c35f5d4bed041fa7c", // ObjectId thực tế từ database
                car_id: 1,
                car_name: "Toyota Vios",
                car_type: "Sedan", 
                price_per_day: 800000
            },
            supplier: {
                id: "675ac1d2cc4de4474ee9543d", // ObjectId thực tế từ database
                name: "ABC Car Rental",
                location: "Hồ Chí Minh"
            },
            customerInfo: {
                fullname: "Nguyễn Văn Test",
                email: "test@example.com",
                numberPhone: "0123456789"
            },
            rental: {
                startDate: "2025-07-01",
                startTime: "09:00",
                endDate: "2025-07-03",
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

        console.log(`${colors.cyan}📤 Gửi request đặt xe...${colors.reset}`);
        console.log('Dữ liệu booking:', JSON.stringify(bookingData, null, 2));

        const response = await makeRequest('/api/car-rental-service/book', 'POST', bookingData);
        
        console.log(`\n${colors.cyan}📥 Nhận response:${colors.reset}`);
        console.log(JSON.stringify(response, null, 2));

        // Validation kết quả
        const testResults = {
            hasSuccess: response.hasOwnProperty('success'),
            isSuccessTrue: response.success === true,
            hasBookingId: response.hasOwnProperty('bookingId'),
            bookingIdValid: response.bookingId && response.bookingId.length > 0
        };

        console.log(`\n${colors.yellow}🔍 Kết quả kiểm tra:${colors.reset}`);
        console.log('- Có trường success:', testResults.hasSuccess ? '✅' : '❌');
        console.log('- Success = true:', testResults.isSuccessTrue ? '✅' : '❌');
        console.log('- Có bookingId:', testResults.hasBookingId ? '✅' : '❌');
        console.log('- BookingId hợp lệ:', testResults.bookingIdValid ? '✅' : '❌');

        // Kết luận test
        const passed = testResults.hasSuccess && testResults.isSuccessTrue && 
                      testResults.hasBookingId && testResults.bookingIdValid;

        if (passed) {
            console.log(`\n${colors.green}✅ TEST CASE 1: PASS${colors.reset}`);
            console.log(`BookingId được tạo: ${response.bookingId}`);
            return {
                testCase: 'Test Case 1 - Successful Booking',
                status: 'PASS',
                bookingId: response.bookingId,
                details: 'Đặt xe thành công với dữ liệu hợp lệ'
            };
        } else {
            console.log(`\n${colors.red}❌ TEST CASE 1: FAIL${colors.reset}`);
            console.log('Lý do:', !testResults.isSuccessTrue ? 'Booking không thành công' : 'Thiếu bookingId');
            return {
                testCase: 'Test Case 1 - Successful Booking',
                status: 'FAIL',
                details: 'Booking không thành công hoặc thiếu bookingId',
                response
            };
        }

    } catch (error) {
        console.log(`\n${colors.red}❌ TEST CASE 1: ERROR${colors.reset}`);
        console.error('Lỗi:', error.message);
        return {
            testCase: 'Test Case 1 - Successful Booking',
            status: 'ERROR',
            error: error.message
        };
    }
}

// Helper function để gửi HTTP request
async function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path,
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            const jsonData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(jsonData);
        }

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(responseData));
                } catch (e) {
                    resolve(responseData);
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Chạy test nếu file được gọi trực tiếp
if (require.main === module) {
    testCase1_SuccessfulBooking()
        .then(result => {
            console.log('\n' + '='.repeat(50));
            console.log('KẾT QUẢ CUỐI CÙNG:', result.status);
            console.log('='.repeat(50));
        })
        .catch(console.error);
}

module.exports = testCase1_SuccessfulBooking;
