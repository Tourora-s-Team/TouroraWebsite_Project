# Test Cases - Hệ Thống Thuê Xe Tourora

## Tổng Quan
Thư mục này chứa 5 test case chính để kiểm thử hệ thống thuê xe của dự án Tourora Website.

## Cấu Trúc Files

```
test-cases/
├── Test_Cases_Specification.md       # Đặc tả chi tiết các test case
├── test-case-1-successful-booking.js # Test đặt xe thành công
├── test-case-2-invalid-data.js       # Test dữ liệu không hợp lệ  
├── test-case-3-search-cars.js        # Test tìm kiếm xe
├── test-case-4-booking-conflict.js   # Test conflict booking
├── test-case-5-booking-stats.js      # Test thống kê booking
├── run-all-tests.js                  # Script chạy tất cả test
└── README.md                         # File này
```

## Yêu Cầu Tiên Quyết

1. **Server Backend đang chạy**
   ```bash
   cd server
   npm start
   ```
   Server phải chạy trên port 3001

2. **Database MongoDB**
   - Có kết nối MongoDB
   - Database chứa dữ liệu mẫu xe và business partner

3. **Node.js**
   - Version 14+ được khuyên dùng

## Cách Chạy Test

### Chạy Tất Cả Test (Khuyến nghị)
```bash
cd test-cases
node run-all-tests.js
```

### Chạy Từng Test Riêng Biệt
```bash
# Test 1: Đặt xe thành công
node test-case-1-successful-booking.js

# Test 2: Dữ liệu không hợp lệ
node test-case-2-invalid-data.js

# Test 3: Tìm kiếm xe
node test-case-3-search-cars.js

# Test 4: Booking conflict
node test-case-4-booking-conflict.js

# Test 5: Thống kê booking  
node test-case-5-booking-stats.js
```

## Mô Tả Test Cases

### Test Case 1: Đặt Xe Thành Công
- **Mục tiêu**: Kiểm tra flow đặt xe hoạt động bình thường
- **Input**: Dữ liệu booking hợp lệ
- **Expected**: Trả về booking ID và success = true

### Test Case 2: Dữ Liệu Không Hợp Lệ
- **Mục tiêu**: Kiểm tra validation và error handling
- **Input**: 5 sub-test với dữ liệu lỗi khác nhau
- **Expected**: Trả về lỗi phù hợp cho từng trường hợp

### Test Case 3: Tìm Kiếm Xe
- **Mục tiêu**: Kiểm tra API search với filter
- **Input**: Các bộ filter khác nhau (location, type, price, etc.)
- **Expected**: Kết quả đúng theo filter và sắp xếp

### Test Case 4: Booking Conflict
- **Mục tiêu**: Ngăn chặn double booking
- **Input**: 2 booking cùng xe, cùng thời gian
- **Expected**: Booking thứ 2 bị reject

### Test Case 5: Thống Kê Booking
- **Mục tiêu**: Kiểm tra API statistics
- **Input**: Gọi endpoint /bookings/stats
- **Expected**: Trả về thống kê đầy đủ và chính xác

## Kết Quả Test

### Console Output
- ✅ **PASS**: Test thành công
- ❌ **FAIL**: Test thất bại  
- 💥 **ERROR**: Lỗi hệ thống
- ⏭️ **SKIP**: Test bị bỏ qua

### File Kết Quả
Sau khi chạy `run-all-tests.js`, file `test-results.json` sẽ được tạo với:
- Tổng kết tất cả test
- Chi tiết từng test case
- Thời gian thực hiện
- Thông tin môi trường

## Troubleshooting

### Lỗi Thường Gặp

1. **ECONNREFUSED localhost:3001**
   ```
   Nguyên nhân: Server backend chưa chạy
   Giải pháp: cd server && npm start
   ```

2. **Invalid ObjectId**
   ```
   Nguyên nhân: Database chưa có dữ liệu
   Giải pháp: Chạy seed data hoặc cập nhật ObjectId trong test
   ```

3. **Database connection error**
   ```
   Nguyên nhân: MongoDB không kết nối được
   Giải pháp: Kiểm tra MongoDB connection string
   ```

### Debug Tips

1. **Kiểm tra server health**
   ```bash
   curl http://localhost:3001/api/car-rental-service/debug-search \
     -H "Content-Type: application/json" \
     -d '{"filters":{"location":"test"}}'
   ```

2. **Xem log server**
   - Mở terminal server để xem real-time logs
   - Kiểm tra request/response khi chạy test

3. **Cập nhật ObjectId**
   - Nếu test fail do ObjectId không tồn tại
   - Lấy ObjectId thật từ database và cập nhật trong test files

## Mở Rộng Test

### Thêm Test Case Mới
1. Tạo file `test-case-6-your-feature.js`
2. Follow pattern của các test hiện tại
3. Export function để có thể import vào `run-all-tests.js`
4. Cập nhật README này

### Test Data Management
- Cân nhắc tạo file `test-data.js` để quản lý test data tập trung
- Sử dụng factory pattern để tạo test data động
- Implement setup/teardown cho clean state

## Liên Hệ
Nếu có vấn đề với test cases, hãy kiểm tra:
1. Server logs
2. Database connection  
3. ObjectId validity
4. Network connectivity

---
**Lưu ý**: Test cases này được thiết kế để test integration, không phải unit test. Chúng cần môi trường đầy đủ (server + database) để chạy.
