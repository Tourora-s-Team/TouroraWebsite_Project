const http = require('http');

/**
 * TEST CASE 3: Tìm Kiếm Xe Với Bộ Lọc
 * Mục tiêu: Kiểm tra chức năng tìm kiếm xe với các bộ lọc khác nhau
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

async function testCase3_SearchCars() {
    console.log(`${colors.blue}=== TEST CASE 3: TÌM KIẾM XE VỚI BỘ LỌC ===${colors.reset}`);
    console.log('Mục tiêu: Kiểm tra chức năng tìm kiếm xe với filter\n');
    
    const searchScenarios = [
        {
            name: "Tìm kiếm cơ bản theo location",
            filters: {
                location: "Hồ Chí Minh",
                startDate: "2025-07-01",
                endDate: "2025-07-03",
                mode: "self"
            },
            expectedCriteria: {
                hasResults: true,
                locationMatches: true
            }
        },
        {
            name: "Tìm kiếm với filter loại xe",
            filters: {
                location: "Hồ Chí Minh",
                startDate: "2025-07-01", 
                endDate: "2025-07-03",
                mode: "self",
                carType: "Sedan",
                transmission: "Automatic"
            },
            expectedCriteria: {
                hasResults: true,
                carTypeMatches: true,
                transmissionMatches: true
            }
        },
        {
            name: "Tìm kiếm với filter giá",
            filters: {
                location: "Hồ Chí Minh",
                startDate: "2025-07-01",
                endDate: "2025-07-03", 
                mode: "self",
                priceRange: "500000-1000000"
            },
            expectedCriteria: {
                hasResults: true,
                priceInRange: true
            }
        },
        {
            name: "Tìm kiếm với filter số ghế",
            filters: {
                location: "Hồ Chí Minh",
                startDate: "2025-07-01",
                endDate: "2025-07-03",
                mode: "self", 
                seats: "5"
            },
            expectedCriteria: {
                hasResults: true,
                seatsMatch: true
            }
        },
        {
            name: "Tìm kiếm với sắp xếp theo giá",
            filters: {
                location: "Hồ Chí Minh",
                startDate: "2025-07-01",
                endDate: "2025-07-03",
                mode: "self",
                sortBy: "price_low"
            },
            expectedCriteria: {
                hasResults: true,
                isSorted: true
            }
        }
    ];

    const results = [];
    
    for (let i = 0; i < searchScenarios.length; i++) {
        const scenario = searchScenarios[i];
        console.log(`\n${colors.cyan}🔍 Test ${i + 1}: ${scenario.name}${colors.reset}`);
        
        try {
            const searchData = { filters: scenario.filters };
            console.log('Search filters:', JSON.stringify(searchData, null, 2));
            
            const response = await makeRequest('/api/car-rental-service/search', 'POST', searchData);
            
            console.log('Response summary:');
            console.log('- Success:', response.success);
            console.log('- Cars found:', response.cars ? response.cars.length : 0);
            
            if (response.cars && response.cars.length > 0) {
                console.log('- First car:', {
                    name: response.cars[0].car_name,
                    type: response.cars[0].car_type,
                    price: response.cars[0].price_per_day,
                    seats: response.cars[0].seats
                });
            }
            
            // Validation logic
            const validationResults = validateSearchResults(response, scenario);
            
            console.log('\n🔍 Kết quả kiểm tra:');
            Object.entries(validationResults).forEach(([key, value]) => {
                console.log(`- ${key}:`, value ? '✅' : '❌');
            });
            
            const passed = Object.values(validationResults).every(v => v === true);
            
            if (passed) {
                console.log(`${colors.green}✅ ${scenario.name}: PASS${colors.reset}`);
                results.push({ 
                    scenario: scenario.name, 
                    status: 'PASS', 
                    carsFound: response.cars ? response.cars.length : 0 
                });
            } else {
                console.log(`${colors.red}❌ ${scenario.name}: FAIL${colors.reset}`);
                results.push({ 
                    scenario: scenario.name, 
                    status: 'FAIL', 
                    validationResults,
                    response: response.message || 'Unexpected response format'
                });
            }
            
        } catch (error) {
            console.log(`${colors.red}❌ ${scenario.name}: ERROR${colors.reset}`);
            console.error('Lỗi:', error.message);
            results.push({ 
                scenario: scenario.name, 
                status: 'ERROR', 
                error: error.message 
            });
        }
    }
    
    // Tổng kết
    const passCount = results.filter(r => r.status === 'PASS').length;
    const totalCount = results.length;
    
    console.log(`\n${colors.yellow}📊 TỔNG KẾT TEST CASE 3:${colors.reset}`);
    console.log(`Passed: ${passCount}/${totalCount}`);
    
    if (passCount === totalCount) {
        console.log(`${colors.green}✅ TEST CASE 3: PASS${colors.reset}`);
        return {
            testCase: 'Test Case 3 - Search Cars',
            status: 'PASS',
            details: `Tất cả ${totalCount} search scenario đều pass`,
            results
        };
    } else {
        console.log(`${colors.red}❌ TEST CASE 3: FAIL${colors.reset}`);
        return {
            testCase: 'Test Case 3 - Search Cars',
            status: 'FAIL',
            details: `Chỉ ${passCount}/${totalCount} search scenario pass`,
            results
        };
    }
}

// Hàm validation kết quả search
function validateSearchResults(response, scenario) {
    const results = {
        hasSuccessField: response.hasOwnProperty('success'),
        isSuccessTrue: response.success === true,
        hasCarsArray: Array.isArray(response.cars),
        hasResults: response.cars && response.cars.length > 0
    };
    
    if (!results.hasResults) {
        return results;
    }
    
    const cars = response.cars;
    const filters = scenario.filters;
    
    // Kiểm tra filter carType
    if (filters.carType) {
        results.carTypeMatches = cars.every(car => 
            car.car_type && car.car_type.toLowerCase().includes(filters.carType.toLowerCase())
        );
    }
    
    // Kiểm tra filter transmission
    if (filters.transmission) {
        results.transmissionMatches = cars.every(car =>
            car.transmission && car.transmission.toLowerCase().includes(filters.transmission.toLowerCase())
        );
    }
    
    // Kiểm tra filter price range
    if (filters.priceRange) {
        const priceMatches = filters.priceRange.match(/(\d+)-(\d+)/);
        if (priceMatches) {
            const minPrice = parseInt(priceMatches[1]);
            const maxPrice = parseInt(priceMatches[2]);
            results.priceInRange = cars.every(car =>
                car.price_per_day >= minPrice && car.price_per_day <= maxPrice
            );
        }
    }
    
    // Kiểm tra filter seats
    if (filters.seats) {
        const requiredSeats = parseInt(filters.seats);
        results.seatsMatch = cars.every(car => car.seats === requiredSeats);
    }
    
    // Kiểm tra sắp xếp
    if (filters.sortBy === 'price_low') {
        results.isSorted = true;
        for (let i = 1; i < cars.length; i++) {
            if (cars[i].price_per_day < cars[i-1].price_per_day) {
                results.isSorted = false;
                break;
            }
        }
    }
    
    // Kiểm tra không có xe maintenance
    results.noMaintenanceCars = cars.every(car => car.car_status !== 'maintenance');
    
    return results;
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
    testCase3_SearchCars()
        .then(result => {
            console.log('\n' + '='.repeat(50));
            console.log('KẾT QUẢ CUỐI CÙNG:', result.status);
            console.log('='.repeat(50));
        })
        .catch(console.error);
}

module.exports = testCase3_SearchCars;
