const testCase1 = require('./test-case-1-successful-booking');
const testCase2 = require('./test-case-2-invalid-data');
const testCase3 = require('./test-case-3-search-cars');
const testCase4 = require('./test-case-4-booking-conflict');
const testCase5 = require('./test-case-5-booking-stats');

/**
 * TEST RUNNER - Chạy tất cả Test Cases
 * Thực hiện đầy đủ 5 test cases cho hệ thống thuê xe Tourora
 */

// Màu sắc cho console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    bold: '\x1b[1m'
};

async function runAllTests() {
    console.log(`${colors.bold}${colors.blue}`);
    console.log('='.repeat(70));
    console.log('          TOURORA WEBSITE - TEST SUITE EXECUTION');
    console.log('                  Hệ Thống Thuê Xe');
    console.log('='.repeat(70));
    console.log(`${colors.reset}\n`);

    const startTime = Date.now();
    const testResults = [];

    // Danh sách test cases
    const testCases = [
        { name: 'Test Case 1 - Successful Booking', fn: testCase1 },
        { name: 'Test Case 2 - Invalid Data', fn: testCase2 },
        { name: 'Test Case 3 - Search Cars', fn: testCase3 },
        { name: 'Test Case 4 - Booking Conflict', fn: testCase4 },
        { name: 'Test Case 5 - Booking Stats', fn: testCase5 }
    ];

    console.log(`${colors.cyan}🚀 Bắt đầu chạy ${testCases.length} test cases...${colors.reset}\n`);

    // Kiểm tra server trước khi chạy test
    console.log(`${colors.yellow}🔍 Kiểm tra server...${colors.reset}`);
    const serverCheck = await checkServerHealth();
    
    if (!serverCheck.healthy) {
        console.log(`${colors.red}❌ Server không khả dụng: ${serverCheck.error}${colors.reset}`);
        console.log(`${colors.yellow}💡 Hướng dẫn:${colors.reset}`);
        console.log('1. Mở terminal và cd vào thư mục server');
        console.log('2. Chạy: npm start');
        console.log('3. Đợi server khởi động trên port 3001');
        console.log('4. Chạy lại test suite này\n');
        return;
    }
    
    console.log(`${colors.green}✅ Server sẵn sàng!${colors.reset}\n`);

    // Chạy từng test case
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`${colors.bold}${colors.magenta}[${i + 1}/${testCases.length}] ${testCase.name}${colors.reset}`);
        console.log('─'.repeat(50));

        try {
            const result = await testCase.fn();
            testResults.push(result);
            
            // Thêm delay giữa các test để tránh conflict
            if (i < testCases.length - 1) {
                console.log(`${colors.yellow}⏳ Nghỉ 2 giây trước test tiếp theo...${colors.reset}\n`);
                await sleep(2000);
            }
        } catch (error) {
            console.log(`${colors.red}❌ ERROR trong ${testCase.name}: ${error.message}${colors.reset}`);
            testResults.push({
                testCase: testCase.name,
                status: 'ERROR',
                error: error.message
            });
        }
        
        console.log(''); // Xuống dòng
    }

    // Tổng kết kết quả
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`${colors.bold}${colors.blue}`);
    console.log('='.repeat(70));
    console.log('                      TỔNG KẾT TEST SUITE');
    console.log('='.repeat(70));
    console.log(`${colors.reset}`);

    const summary = generateTestSummary(testResults);
    
    console.log(`${colors.cyan}📊 THỐNG KÊ TỔNG QUAN:${colors.reset}`);
    console.log(`   🕐 Thời gian thực hiện: ${duration} giây`);
    console.log(`   📋 Tổng số test case: ${testResults.length}`);
    console.log(`   ${colors.green}✅ Passed: ${summary.passed}${colors.reset}`);
    console.log(`   ${colors.red}❌ Failed: ${summary.failed}${colors.reset}`);
    console.log(`   ${colors.yellow}⚠️  Error: ${summary.error}${colors.reset}`);
    console.log(`   ${colors.cyan}⏭️  Skipped: ${summary.skipped}${colors.reset}`);
    console.log(`   📈 Tỷ lệ thành công: ${summary.successRate}%\n`);

    // Chi tiết từng test case
    console.log(`${colors.cyan}📋 CHI TIẾT TỪNG TEST CASE:${colors.reset}`);
    testResults.forEach((result, index) => {
        const icon = getStatusIcon(result.status);
        const color = getStatusColor(result.status);
        console.log(`   ${icon} ${color}Test ${index + 1}: ${result.testCase} - ${result.status}${colors.reset}`);
        if (result.details) {
            console.log(`      💬 ${result.details}`);
        }
        if (result.error) {
            console.log(`      ⚠️  ${result.error}`);
        }
    });

    // Khuyến nghị
    console.log(`\n${colors.yellow}💡 KHUYẾN NGHỊ:${colors.reset}`);
    if (summary.successRate >= 90) {
        console.log(`   ${colors.green}🎉 Tuyệt vời! Hệ thống hoạt động rất tốt.${colors.reset}`);
    } else if (summary.successRate >= 70) {
        console.log(`   ${colors.yellow}⚠️  Hệ thống cơ bản hoạt động, cần cải thiện một số điểm.${colors.reset}`);
    } else {
        console.log(`   ${colors.red}🚨 Hệ thống có nhiều vấn đề, cần kiểm tra và sửa lỗi.${colors.reset}`);
    }

    // Lưu kết quả vào file
    await saveTestResults(testResults, summary, duration);
    
    console.log(`\n${colors.cyan}💾 Kết quả đã được lưu vào file: test-results.json${colors.reset}`);
    console.log(`${colors.blue}=`.repeat(70));
    console.log(`                   HOÀN THÀNH TEST SUITE`);
    console.log(`=`.repeat(70) + `${colors.reset}`);
}

// Kiểm tra server health
async function checkServerHealth() {
    try {
        const http = require('http');
        
        return new Promise((resolve) => {
            const req = http.request({
                hostname: 'localhost',
                port: 3001,
                path: '/api/car-rental-service/debug-search',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000
            }, (res) => {
                resolve({ healthy: res.statusCode < 500 });
            });
            
            req.on('error', (error) => {
                resolve({ healthy: false, error: error.message });
            });
            
            req.on('timeout', () => {
                resolve({ healthy: false, error: 'Server timeout' });
            });
            
            req.write(JSON.stringify({ filters: { location: 'test' } }));
            req.end();
        });
    } catch (error) {
        return { healthy: false, error: error.message };
    }
}

// Tạo tổng kết test
function generateTestSummary(results) {
    const summary = {
        passed: 0,
        failed: 0,
        error: 0,
        skipped: 0,
        total: results.length
    };

    results.forEach(result => {
        switch (result.status) {
            case 'PASS':
                summary.passed++;
                break;
            case 'FAIL':
                summary.failed++;
                break;
            case 'ERROR':
                summary.error++;
                break;
            case 'SKIP':
                summary.skipped++;
                break;
        }
    });

    summary.successRate = Math.round((summary.passed / summary.total) * 100);
    return summary;
}

// Lấy icon theo status
function getStatusIcon(status) {
    switch (status) {
        case 'PASS': return '✅';
        case 'FAIL': return '❌';
        case 'ERROR': return '💥';
        case 'SKIP': return '⏭️';
        default: return '❓';
    }
}

// Lấy màu theo status
function getStatusColor(status) {
    switch (status) {
        case 'PASS': return colors.green;
        case 'FAIL': return colors.red;
        case 'ERROR': return colors.red;
        case 'SKIP': return colors.yellow;
        default: return colors.reset;
    }
}

// Lưu kết quả test
async function saveTestResults(results, summary, duration) {
    const fs = require('fs').promises;
    
    const reportData = {
        timestamp: new Date().toISOString(),
        duration: parseFloat(duration),
        summary,
        testCases: results,
        environment: {
            nodeVersion: process.version,
            platform: process.platform,
            serverPort: 3001
        }
    };

    try {
        await fs.writeFile(
            './test-results.json', 
            JSON.stringify(reportData, null, 2),
            'utf8'
        );
    } catch (error) {
        console.log(`${colors.yellow}⚠️  Không thể lưu file kết quả: ${error.message}${colors.reset}`);
    }
}

// Helper function sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Chạy test suite
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = runAllTests;
