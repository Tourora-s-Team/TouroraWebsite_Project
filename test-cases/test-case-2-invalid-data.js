const http = require('http');

/**
 * TEST CASE 2: Đặt Xe Với Dữ Liệu Không Hợp Lệ (Negative Test)
 * Mục tiêu: Kiểm tra hệ thống xử lý lỗi khi dữ liệu input không hợp lệ
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

async function testCase2_InvalidData() {
    console.log(`${colors.blue}=== TEST CASE 2: DỮ LIỆU KHÔNG HỢP LỆ ===${colors.reset}`);
    console.log('Mục tiêu: Kiểm tra xử lý lỗi với dữ liệu không hợp lệ\n');
    
    const testScenarios = [
        {
            name: "Thiếu thông tin xe",
            data: {
                // car: missing
                supplier: {
                    id: "675ac1d2cc4de4474ee9543d",
                    name: "ABC Car Rental"
                },
                customerInfo: {
                    fullname: "Test User",
                    email: "test@example.com",
                    numberPhone: "0123456789"
                }
            },
            expectedMessage: "Thiếu thông tin bắt buộc"
        },
        {
            name: "Email không hợp lệ",
            data: {
                car: {
                    _id: "675b2f4c35f5d4bed041fa7c",
                    car_name: "Toyota Vios"
                },
                supplier: {
                    id: "675ac1d2cc4de4474ee9543d",
                    name: "ABC Car Rental"
                },
                customerInfo: {
                    fullname: "Test User",
                    email: "invalid-email", // Email không hợp lệ
                    numberPhone: "0123456789"
                },
                rental: {
                    startDate: "2025-07-01",
                    endDate: "2025-07-03"
                }
            },
            expectedMessage: "email"
        },
        {
            name: "Thiếu thông tin khách hàng",
            data: {
                car: {
                    _id: "675b2f4c35f5d4bed041fa7c",
                    car_name: "Toyota Vios"
                },
                supplier: {
                    id: "675ac1d2cc4de4474ee9543d",
                    name: "ABC Car Rental"
                },
                customerInfo: {
                    // fullname: missing
                    email: "test@example.com"
                    // numberPhone: missing
                },
                rental: {
                    startDate: "2025-07-01",
                    endDate: "2025-07-03"
                }
            },
            expectedMessage: "Thiếu thông tin khách hàng"
        },
        {
            name: "Ngày không hợp lệ (startDate > endDate)",
            data: {
                car: {
                    _id: "675b2f4c35f5d4bed041fa7c",
                    car_name: "Toyota Vios"
                },
                supplier: {
                    id: "675ac1d2cc4de4474ee9543d",
                    name: "ABC Car Rental"
                },
                customerInfo: {
                    fullname: "Test User",
                    email: "test@example.com",
                    numberPhone: "0123456789"
                },
                rental: {
                    startDate: "2025-07-03", // Sau endDate
                    endDate: "2025-07-01"   // Trước startDate
                }
            },
            expectedMessage: "ngày"
        },
        {
            name: "ObjectId không hợp lệ",
            data: {
                car: {
                    _id: "invalid-object-id", // ObjectId không hợp lệ
                    car_name: "Toyota Vios"
                },
                supplier: {
                    id: "675ac1d2cc4de4474ee9543d",
                    name: "ABC Car Rental"
                },
                customerInfo: {
                    fullname: "Test User",
                    email: "test@example.com",
                    numberPhone: "0123456789"
                },
                rental: {
                    startDate: "2025-07-01",
                    endDate: "2025-07-03"
                }
            },
            expectedMessage: "ID xe không hợp lệ"
        }
    ];

    const results = [];
    
    for (let i = 0; i < testScenarios.length; i++) {
        const scenario = testScenarios[i];
        console.log(`\n${colors.cyan}📤 Test ${i + 1}: ${scenario.name}${colors.reset}`);
        
        try {
            const response = await makeRequest('/api/car-rental-service/book', 'POST', scenario.data);
            
            console.log('Response:', JSON.stringify(response, null, 2));
            
            // Kiểm tra response
            const isError = response.success === false;
            const hasErrorMessage = response.message && response.message.length > 0;
            const messageRelevant = response.message && 
                response.message.toLowerCase().includes(scenario.expectedMessage.toLowerCase());
            
            console.log('- Success = false:', isError ? '✅' : '❌');
            console.log('- Có error message:', hasErrorMessage ? '✅' : '❌');
            console.log('- Message phù hợp:', messageRelevant ? '✅' : '❌');
            
            const passed = isError && hasErrorMessage;
            
            if (passed) {
                console.log(`${colors.green}✅ ${scenario.name}: PASS${colors.reset}`);
                results.push({ scenario: scenario.name, status: 'PASS', message: response.message });
            } else {
                console.log(`${colors.red}❌ ${scenario.name}: FAIL${colors.reset}`);
                results.push({ scenario: scenario.name, status: 'FAIL', response });
            }
            
        } catch (error) {
            console.log(`${colors.red}❌ ${scenario.name}: ERROR${colors.reset}`);
            console.error('Lỗi:', error.message);
            results.push({ scenario: scenario.name, status: 'ERROR', error: error.message });
        }
    }
    
    // Tổng kết
    const passCount = results.filter(r => r.status === 'PASS').length;
    const totalCount = results.length;
    
    console.log(`\n${colors.yellow}📊 TỔNG KẾT TEST CASE 2:${colors.reset}`);
    console.log(`Passed: ${passCount}/${totalCount}`);
    
    if (passCount === totalCount) {
        console.log(`${colors.green}✅ TEST CASE 2: PASS${colors.reset}`);
        return {
            testCase: 'Test Case 2 - Invalid Data',
            status: 'PASS',
            details: `Tất cả ${totalCount} sub-test đều pass`,
            results
        };
    } else {
        console.log(`${colors.red}❌ TEST CASE 2: FAIL${colors.reset}`);
        return {
            testCase: 'Test Case 2 - Invalid Data',
            status: 'FAIL',
            details: `Chỉ ${passCount}/${totalCount} sub-test pass`,
            results
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
    testCase2_InvalidData()
        .then(result => {
            console.log('\n' + '='.repeat(50));
            console.log('KẾT QUẢ CUỐI CÙNG:', result.status);
            console.log('='.repeat(50));
        })
        .catch(console.error);
}

module.exports = testCase2_InvalidData;
