const http = require('http');

/**
 * TEST CASE 5: Lấy Thống Kê Booking
 * Mục tiêu: Kiểm tra API lấy thống kê booking hoạt động chính xác
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

async function testCase5_BookingStats() {
    console.log(`${colors.blue}=== TEST CASE 5: THỐNG KÊ BOOKING ===${colors.reset}`);
    console.log('Mục tiêu: Kiểm tra API lấy thống kê booking\n');
    
    try {
        // Bước 1: Lấy thống kê booking
        console.log(`${colors.cyan}📤 Bước 1: Gọi API thống kê...${colors.reset}`);
        
        const statsResponse = await makeRequest('/api/car-rental-service/bookings/stats', 'GET');
        console.log('Stats response:', JSON.stringify(statsResponse, null, 2));

        // Bước 2: Validation cấu trúc response
        console.log(`\n${colors.cyan}🔍 Bước 2: Kiểm tra cấu trúc response...${colors.reset}`);
        
        const structureValidation = {
            hasSuccessField: statsResponse.hasOwnProperty('success'),
            isSuccessTrue: statsResponse.success === true,
            hasStatsField: statsResponse.hasOwnProperty('stats'),
            statsIsObject: typeof statsResponse.stats === 'object' && statsResponse.stats !== null
        };

        console.log('🔍 Kiểm tra cấu trúc:');
        console.log('- Có trường success:', structureValidation.hasSuccessField ? '✅' : '❌');
        console.log('- Success = true:', structureValidation.isSuccessTrue ? '✅' : '❌');
        console.log('- Có trường stats:', structureValidation.hasStatsField ? '✅' : '❌');
        console.log('- Stats là object:', structureValidation.statsIsObject ? '✅' : '❌');

        if (!structureValidation.statsIsObject) {
            console.log(`${colors.red}❌ Response không có cấu trúc hợp lệ${colors.reset}`);
            return {
                testCase: 'Test Case 5 - Booking Stats',
                status: 'FAIL',
                details: 'Response không có cấu trúc stats hợp lệ',
                response: statsResponse
            };
        }

        // Bước 3: Validation nội dung thống kê
        console.log(`\n${colors.cyan}📊 Bước 3: Kiểm tra nội dung thống kê...${colors.reset}`);
        
        const stats = statsResponse.stats;
        const contentValidation = validateStatsContent(stats);

        console.log('🔍 Kiểm tra nội dung thống kê:');
        Object.entries(contentValidation).forEach(([key, value]) => {
            const displayKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
            console.log(`- ${displayKey}:`, value ? '✅' : '❌');
        });

        // Bước 4: Lấy danh sách booking để so sánh
        console.log(`\n${colors.cyan}📋 Bước 4: Lấy danh sách booking để verify...${colors.reset}`);
        
        const bookingsResponse = await makeRequest('/api/car-rental-service/bookings?limit=100', 'GET');
        console.log('Bookings response summary:', {
            success: bookingsResponse.success,
            totalBookings: bookingsResponse.bookings ? bookingsResponse.bookings.length : 0,
            hasMetadata: !!bookingsResponse.metadata
        });

        // Bước 5: Cross-validation với danh sách booking
        let crossValidation = { dataConsistent: true };
        
        if (bookingsResponse.success && bookingsResponse.bookings) {
            crossValidation = validateStatsConsistency(stats, bookingsResponse.bookings);
            
            console.log('🔍 Kiểm tra tính nhất quán:');
            Object.entries(crossValidation).forEach(([key, value]) => {
                const displayKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
                console.log(`- ${displayKey}:`, value ? '✅' : '❌');
            });
        }

        // Bước 6: Test hiệu suất
        console.log(`\n${colors.cyan}⚡ Bước 6: Test hiệu suất API...${colors.reset}`);
        
        const performanceResult = await testApiPerformance();
        console.log('🔍 Kiểm tra hiệu suất:');
        console.log('- Thời gian phản hồi < 2s:', performanceResult.responseTimeOk ? '✅' : '❌');
        console.log('- API ổn định:', performanceResult.stable ? '✅' : '❌');

        // Kết luận test
        const allValidations = {
            ...structureValidation,
            ...contentValidation,
            ...crossValidation,
            ...performanceResult
        };

        const passedValidations = Object.values(allValidations).filter(v => v === true).length;
        const totalValidations = Object.keys(allValidations).length;
        
        console.log(`\n${colors.yellow}📊 TỔNG KẾT VALIDATION:${colors.reset}`);
        console.log(`Passed: ${passedValidations}/${totalValidations}`);

        // In chi tiết thống kê
        if (stats) {
            console.log(`\n${colors.cyan}📈 CHI TIẾT THỐNG KÊ:${colors.reset}`);
            printStatsDetails(stats);
        }

        if (passedValidations >= totalValidations * 0.8) { // Pass nếu >= 80% validation đúng
            console.log(`\n${colors.green}✅ TEST CASE 5: PASS${colors.reset}`);
            return {
                testCase: 'Test Case 5 - Booking Stats',
                status: 'PASS',
                details: `${passedValidations}/${totalValidations} validations passed`,
                stats,
                performance: performanceResult
            };
        } else {
            console.log(`\n${colors.red}❌ TEST CASE 5: FAIL${colors.reset}`);
            return {
                testCase: 'Test Case 5 - Booking Stats',
                status: 'FAIL',
                details: `Chỉ ${passedValidations}/${totalValidations} validations passed`,
                failedValidations: Object.entries(allValidations)
                    .filter(([_, value]) => !value)
                    .map(([key, _]) => key)
            };
        }

    } catch (error) {
        console.log(`\n${colors.red}❌ TEST CASE 5: ERROR${colors.reset}`);
        console.error('Lỗi:', error.message);
        return {
            testCase: 'Test Case 5 - Booking Stats',
            status: 'ERROR',
            error: error.message
        };
    }
}

// Validation nội dung thống kê
function validateStatsContent(stats) {
    return {
        hasTotalBookings: stats.hasOwnProperty('totalBookings') && typeof stats.totalBookings === 'number',
        hasBookingsByStatus: stats.hasOwnProperty('bookingsByStatus') && typeof stats.bookingsByStatus === 'object',
        hasRevenueStats: stats.hasOwnProperty('revenueStats') && typeof stats.revenueStats === 'object',
        hasPopularCars: stats.hasOwnProperty('popularCars') && Array.isArray(stats.popularCars),
        hasPopularLocations: stats.hasOwnProperty('popularLocations') && Array.isArray(stats.popularLocations),
        totalBookingsValid: typeof stats.totalBookings === 'number' && stats.totalBookings >= 0,
        revenueStatsValid: stats.revenueStats && 
            typeof stats.revenueStats.totalRevenue === 'number' &&
            typeof stats.revenueStats.averageBookingValue === 'number'
    };
}

// Validation tính nhất quán với danh sách booking
function validateStatsConsistency(stats, bookings) {
    const actualTotal = bookings.length;
    const statsTotal = stats.totalBookings;
    
    // Đếm booking theo status
    const statusCounts = {};
    bookings.forEach(booking => {
        const status = booking.status || 'pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Tính tổng revenue từ booking list
    const actualRevenue = bookings
        .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
        .reduce((sum, booking) => sum + (booking.pricing?.total || 0), 0);
    
    return {
        totalCountMatches: Math.abs(actualTotal - statsTotal) <= 1, // Cho phép sai lệch 1 do timing
        statusCountsReasonable: stats.bookingsByStatus && 
            Object.keys(statusCounts).every(status => 
                Math.abs((stats.bookingsByStatus[status] || 0) - (statusCounts[status] || 0)) <= 2
            ),
        revenueReasonable: stats.revenueStats && 
            Math.abs(actualRevenue - stats.revenueStats.totalRevenue) <= actualRevenue * 0.1 // 10% tolerance
    };
}

// Test hiệu suất API
async function testApiPerformance() {
    const startTime = Date.now();
    
    try {
        await makeRequest('/api/car-rental-service/bookings/stats', 'GET');
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        // Test multiple calls để kiểm tra stability
        const multipleCalls = await Promise.all([
            makeRequest('/api/car-rental-service/bookings/stats', 'GET'),
            makeRequest('/api/car-rental-service/bookings/stats', 'GET'),
            makeRequest('/api/car-rental-service/bookings/stats', 'GET')
        ]);
        
        const allSuccessful = multipleCalls.every(response => response.success);
        
        return {
            responseTimeOk: responseTime < 2000, // < 2 seconds
            stable: allSuccessful,
            responseTime
        };
    } catch (error) {
        return {
            responseTimeOk: false,
            stable: false,
            error: error.message
        };
    }
}

// In chi tiết thống kê
function printStatsDetails(stats) {
    if (stats.totalBookings !== undefined) {
        console.log(`📊 Tổng số booking: ${stats.totalBookings}`);
    }
    
    if (stats.bookingsByStatus) {
        console.log('📋 Booking theo trạng thái:');
        Object.entries(stats.bookingsByStatus).forEach(([status, count]) => {
            console.log(`   - ${status}: ${count}`);
        });
    }
    
    if (stats.revenueStats) {
        console.log('💰 Thống kê doanh thu:');
        console.log(`   - Tổng doanh thu: ${stats.revenueStats.totalRevenue?.toLocaleString()} VND`);
        console.log(`   - Giá trị trung bình: ${stats.revenueStats.averageBookingValue?.toLocaleString()} VND`);
    }
    
    if (stats.popularCars && stats.popularCars.length > 0) {
        console.log('🚗 Top xe phổ biến:');
        stats.popularCars.slice(0, 3).forEach((car, index) => {
            console.log(`   ${index + 1}. ${car.name} (${car.bookingCount} lượt thuê)`);
        });
    }
    
    if (stats.popularLocations && stats.popularLocations.length > 0) {
        console.log('📍 Top địa điểm phổ biến:');
        stats.popularLocations.slice(0, 3).forEach((location, index) => {
            console.log(`   ${index + 1}. ${location.name} (${location.bookingCount} lượt thuê)`);
        });
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
    testCase5_BookingStats()
        .then(result => {
            console.log('\n' + '='.repeat(50));
            console.log('KẾT QUẢ CUỐI CÙNG:', result.status);
            console.log('='.repeat(50));
        })
        .catch(console.error);
}

module.exports = testCase5_BookingStats;
