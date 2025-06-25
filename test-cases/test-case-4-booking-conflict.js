const http = require('http');

/**
 * TEST CASE 4: Kiểm Tra Xe Đang Được Thuê (Conflict Test)
 * Mục tiêu: Kiểm tra hệ thống ngăn chặn đặt xe đã được thuê trong thời gian trùng lặp
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

async function testCase4_BookingConflict() {
    console.log(`${colors.blue}=== TEST CASE 4: KIỂM TRA BOOKING CONFLICT ===${colors.reset}`);
    console.log('Mục tiêu: Ngăn chặn double booking cùng một xe\n');
    
    try {
        // Bước 1: Tạo booking đầu tiên (thành công)
        console.log(`${colors.cyan}📤 Bước 1: Tạo booking đầu tiên...${colors.reset}`);
        
        const firstBookingData = {
            car: {
                _id: "675b2f4c35f5d4bed041fa7c",
                car_id: 1,
                car_name: "Toyota Vios",
                car_type: "Sedan",
                price_per_day: 800000
            },
            supplier: {
                id: "675ac1d2cc4de4474ee9543d",
                name: "ABC Car Rental",
                location: "Hồ Chí Minh"
            },
            customerInfo: {
                fullname: "Khách Hàng Đầu Tiên",
                email: "first@example.com",
                numberPhone: "0123456789"
            },
            rental: {
                startDate: "2025-07-15",
                startTime: "09:00",
                endDate: "2025-07-17",
                endTime: "18:00",
                mode: "self",
                location: "Hồ Chí Minh"
            },
            pickupLocation: {
                address: "123 First Street",
                coordinates: { lat: 10.762622, lng: 106.660172 },
                type: "office"
            },
            dropoffLocation: {
                address: "456 First Avenue",
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

        const firstResponse = await makeRequest('/api/car-rental-service/book', 'POST', firstBookingData);
        console.log('First booking response:', JSON.stringify(firstResponse, null, 2));

        if (!firstResponse.success) {
            console.log(`${colors.yellow}⚠️ Không thể tạo booking đầu tiên, skip test này${colors.reset}`);
            return {
                testCase: 'Test Case 4 - Booking Conflict',
                status: 'SKIP',
                details: 'Không thể tạo booking đầu tiên để test conflict'
            };
        }

        console.log(`${colors.green}✅ Booking đầu tiên thành công: ${firstResponse.bookingId}${colors.reset}`);

        // Bước 2: Thử tạo booking thứ hai với cùng xe và thời gian trùng lặp
        console.log(`\n${colors.cyan}📤 Bước 2: Thử booking trùng lặp...${colors.reset}`);
        
        const conflictBookingData = {
            car: {
                _id: "675b2f4c35f5d4bed041fa7c", // Cùng xe
                car_id: 1,
                car_name: "Toyota Vios",
                car_type: "Sedan", 
                price_per_day: 800000
            },
            supplier: {
                id: "675ac1d2cc4de4474ee9543d", // Cùng supplier
                name: "ABC Car Rental",
                location: "Hồ Chí Minh"
            },
            customerInfo: {
                fullname: "Khách Hàng Thứ Hai", // Khách hàng khác
                email: "second@example.com",
                numberPhone: "0987654321"
            },
            rental: {
                startDate: "2025-07-16", // Thời gian trùng lặp
                startTime: "10:00",
                endDate: "2025-07-18",
                endTime: "17:00",
                mode: "self",
                location: "Hồ Chí Minh"
            },
            pickupLocation: {
                address: "789 Second Street",
                coordinates: { lat: 10.762622, lng: 106.660172 },
                type: "office"
            },
            dropoffLocation: {
                address: "321 Second Avenue",
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

        const conflictResponse = await makeRequest('/api/car-rental-service/book', 'POST', conflictBookingData);
        console.log('Conflict booking response:', JSON.stringify(conflictResponse, null, 2));

        // Bước 3: Validation kết quả
        console.log(`\n${colors.cyan}🔍 Bước 3: Kiểm tra kết quả...${colors.reset}`);
        
        const validationResults = {
            hasSuccessField: conflictResponse.hasOwnProperty('success'),
            isSuccessFalse: conflictResponse.success === false,
            hasErrorMessage: conflictResponse.message && conflictResponse.message.length > 0,
            messageAboutConflict: conflictResponse.message && 
                (conflictResponse.message.toLowerCase().includes('đang được thuê') ||
                 conflictResponse.message.toLowerCase().includes('không khả dụng') ||
                 conflictResponse.message.toLowerCase().includes('conflict') ||
                 conflictResponse.message.toLowerCase().includes('trùng lặp'))
        };

        console.log('🔍 Kết quả kiểm tra:');
        console.log('- Có trường success:', validationResults.hasSuccessField ? '✅' : '❌');
        console.log('- Success = false:', validationResults.isSuccessFalse ? '✅' : '❌');
        console.log('- Có error message:', validationResults.hasErrorMessage ? '✅' : '❌');
        console.log('- Message về conflict:', validationResults.messageAboutConflict ? '✅' : '❌');

        // Bước 4: Test thêm với thời gian không trùng lặp
        console.log(`\n${colors.cyan}📤 Bước 4: Test booking không trùng lặp...${colors.reset}`);
        
        const nonConflictBookingData = {
            ...conflictBookingData,
            customerInfo: {
                fullname: "Khách Hàng Thứ Ba",
                email: "third@example.com", 
                numberPhone: "0111222333"
            },
            rental: {
                startDate: "2025-07-20", // Không trùng lặp
                startTime: "09:00",
                endDate: "2025-07-22",
                endTime: "18:00",
                mode: "self",
                location: "Hồ Chí Minh"
            }
        };

        const nonConflictResponse = await makeRequest('/api/car-rental-service/book', 'POST', nonConflictBookingData);
        console.log('Non-conflict booking summary:', {
            success: nonConflictResponse.success,
            hasBookingId: !!nonConflictResponse.bookingId,
            message: nonConflictResponse.message
        });

        validationResults.nonConflictSuccess = nonConflictResponse.success === true;

        console.log('- Booking không trùng lặp thành công:', validationResults.nonConflictSuccess ? '✅' : '❌');

        // Kết luận test
        const mainTestPassed = validationResults.hasSuccessField && 
                              validationResults.isSuccessFalse && 
                              validationResults.hasErrorMessage;
        
        const bonusTestPassed = validationResults.nonConflictSuccess;

        if (mainTestPassed) {
            console.log(`\n${colors.green}✅ TEST CASE 4: PASS${colors.reset}`);
            console.log('✅ Hệ thống đã ngăn chặn double booking thành công');
            if (bonusTestPassed) {
                console.log('✅ Bonus: Booking không trùng lặp vẫn hoạt động bình thường');
            }
            
            return {
                testCase: 'Test Case 4 - Booking Conflict',
                status: 'PASS',
                details: 'Hệ thống ngăn chặn double booking thành công',
                firstBookingId: firstResponse.bookingId,
                conflictResponse: conflictResponse.message,
                bonusTest: bonusTestPassed
            };
        } else {
            console.log(`\n${colors.red}❌ TEST CASE 4: FAIL${colors.reset}`);
            console.log('❌ Hệ thống KHÔNG ngăn chặn được double booking');
            
            return {
                testCase: 'Test Case 4 - Booking Conflict', 
                status: 'FAIL',
                details: 'Hệ thống cho phép double booking - BUG nghiêm trọng!',
                validationResults,
                conflictResponse
            };
        }

    } catch (error) {
        console.log(`\n${colors.red}❌ TEST CASE 4: ERROR${colors.reset}`);
        console.error('Lỗi:', error.message);
        return {
            testCase: 'Test Case 4 - Booking Conflict',
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
    testCase4_BookingConflict()
        .then(result => {
            console.log('\n' + '='.repeat(50));
            console.log('KẾT QUẢ CUỐI CÙNG:', result.status);
            console.log('='.repeat(50));
        })
        .catch(console.error);
}

module.exports = testCase4_BookingConflict;
