# Đặc Tả Test Cases - Hệ Thống Thuê Xe Tourora

## Tổng Quan
Tài liệu này mô tả 5 test case chính cho hệ thống thuê xe của dự án Tourora Website, bao gồm các tình huống kiểm thử tích cực và tiêu cực.

---

## Test Case 1: Đặt Xe Thành Công (Happy Path)

### Mục Tiêu
Kiểm tra chức năng đặt xe hoạt động chính xác trong điều kiện bình thường

### Điều Kiện Tiên Quyết
- Server đang chạy trên port 3001
- Database có sẵn dữ liệu xe và business partner hợp lệ
- Xe không bị maintenance và đang available

### Dữ Liệu Input
- Thông tin xe: ID, tên, loại, giá
- Thông tin nhà cung cấp: ID, tên, địa điểm
- Thông tin khách hàng: họ tên, email, số điện thoại
- Thông tin thuê xe: ngày bắt đầu, ngày kết thúc, chế độ thuê
- Thông tin đón/trả xe
- Thông tin giá cả

### Kết Quả Mong Đợi
- Status code: 200
- Response chứa `success: true`
- Trả về `bookingId` hợp lệ
- Booking được lưu vào database

### Tiêu Chí Pass/Fail
- **PASS**: Booking thành công, trả về bookingId
- **FAIL**: Lỗi trong quá trình booking hoặc không trả về bookingId

---

## Test Case 2: Đặt Xe Với Dữ Liệu Không Hợp Lệ (Negative Test)

### Mục Tiêu
Kiểm tra hệ thống xử lý lỗi khi dữ liệu input không hợp lệ

### Điều Kiện Tiên Quyết
- Server đang chạy trên port 3001

### Dữ Liệu Input
- Thiếu thông tin bắt buộc (car, supplier, hoặc customerInfo)
- Email không đúng định dạng
- Số điện thoại không hợp lệ
- Ngày không hợp lệ (startDate > endDate)

### Kết Quả Mong Đợi
- Status code: 400
- Response chứa `success: false`
- Message lỗi mô tả rõ ràng vấn đề

### Tiêu Chí Pass/Fail
- **PASS**: Hệ thống reject request và trả về lỗi phù hợp
- **FAIL**: Hệ thống accept request không hợp lệ hoặc crash

---

## Test Case 3: Tìm Kiếm Xe Với Bộ Lọc

### Mục Tiêu
Kiểm tra chức năng tìm kiếm xe với các bộ lọc khác nhau

### Điều Kiện Tiên Quyết
- Server đang chạy trên port 3001
- Database có đa dạng xe với các thuộc tính khác nhau

### Dữ Liệu Input
- Location: "Hồ Chí Minh"
- Car type: "Sedan"
- Price range: "500000-1000000"
- Transmission: "Automatic"
- Seats: 5

### Kết Quả Mong Đợi
- Status code: 200
- Response chứa danh sách xe phù hợp với filter
- Xe được sắp xếp theo tiêu chí yêu cầu
- Loại bỏ xe đang maintenance

### Tiêu Chí Pass/Fail
- **PASS**: Trả về danh sách xe đúng theo filter
- **FAIL**: Kết quả không đúng hoặc bao gồm xe không phù hợp

---

## Test Case 4: Kiểm Tra Xe Đang Được Thuê (Conflict Test)

### Mục Tiêu
Kiểm tra hệ thống ngăn chặn đặt xe đã được thuê trong thời gian trùng lặp

### Điều Kiện Tiên Quyết
- Server đang chạy trên port 3001
- Có xe đang được thuê trong khoảng thời gian cụ thể

### Dữ Liệu Input
- Cùng xe ID đã được đặt
- Thời gian thuê trùng với booking hiện có
- Thông tin khách hàng khác

### Kết Quả Mong Đợi
- Status code: 400
- Response chứa `success: false`
- Message: "Xe hiện đang được thuê bởi khách hàng khác"

### Tiêu Chí Pass/Fail
- **PASS**: Hệ thống từ chối booking trùng lặp
- **FAIL**: Cho phép double booking cùng một xe

---

## Test Case 5: Lấy Thống Kê Booking

### Mục Tiêu
Kiểm tra API lấy thống kê booking hoạt động chính xác

### Điều Kiện Tiên Quyết
- Server đang chạy trên port 3001
- Database có dữ liệu booking từ nhiều thời điểm khác nhau

### Dữ Liệu Input
- Không cần input đặc biệt
- Gọi endpoint GET /api/car-rental-service/bookings/stats

### Kết Quả Mong Đợi
- Status code: 200
- Response chứa:
  - Total bookings
  - Bookings by status
  - Revenue statistics
  - Popular cars/locations

### Tiêu Chí Pass/Fail
- **PASS**: Trả về thống kê chính xác và đầy đủ
- **FAIL**: Thiếu thống kê hoặc dữ liệu không chính xác

---

## Môi Trường Test
- **OS**: Windows
- **Node.js**: v14+
- **Database**: MongoDB
- **Test Framework**: Custom HTTP requests
- **Port**: 3001

## Cách Chạy Test
```bash
# Chạy từng test riêng biệt
node test-case-1-successful-booking.js
node test-case-2-invalid-data.js
node test-case-3-search-cars.js
node test-case-4-booking-conflict.js
node test-case-5-booking-stats.js

# Hoặc chạy tất cả
node run-all-tests.js
```

## Báo Cáo Kết Quả
Mỗi test sẽ in ra:
- ✅ PASS: Test thành công
- ❌ FAIL: Test thất bại với mô tả lỗi
- ⚠️ SKIP: Test bị bỏ qua do điều kiện không đủ
