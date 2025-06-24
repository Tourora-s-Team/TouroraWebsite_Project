# Hệ thống quản trị xe cho thuê

## Tổng quan
Hệ thống quản trị cho phép admin đăng nhập và quản lý danh sách xe của công ty. Tất cả các API đều được bảo vệ bằng JWT authentication.

## Cấu trúc thư mục

### Backend
```
server/src/
├── middlewares/
│   └── authenticate-token.js          # Middleware xác thực JWT
├── routes/
│   ├── auth.js                       # Routes xác thực (login, verify)
│   └── car-admin.js                  # Routes admin quản lý xe (yêu cầu auth)
└── controllers/
    ├── auth-controller.js            # Controller xác thực
    └── car-rental-controller.js      # Controller quản lý xe
```

### Frontend
```
client/src/
├── components/car-rental-admin/
│   ├── AdminLogin.jsx               # Component đăng nhập admin
│   ├── AdminLayout.jsx              # Layout chung cho trang admin
│   ├── AdminDashboard.jsx           # Dashboard tổng quan
│   ├── CarManagement.jsx            # Quản lý danh sách xe
│   └── ProtectedRoute.jsx           # Component bảo vệ route
└── pages/car-rental-ad-pages/
    ├── AdminLoginPage.jsx           # Trang đăng nhập admin
    ├── AdminDashboardPage.jsx       # Trang dashboard
    ├── AdminCarManagementPage.jsx   # Trang quản lý xe
    └── AdminBookingManagementPage.jsx # Trang quản lý đặt xe
```

## Chức năng chính

### 1. Đăng nhập Admin
- **URL**: `/admin/login`
- **Chức năng**: Xác thực admin bằng email/password
- **Sau khi đăng nhập**: Token JWT được lưu trong localStorage

### 2. Dashboard
- **URL**: `/admin/dashboard`
- **Chức năng**: 
  - Hiển thị thống kê tổng quan (tổng số xe, xe rảnh, đang cho thuê, bảo trì)
  - Danh sách xe mới thêm gần đây
  - Biểu đồ phân bố trạng thái xe
  - Các thao tác nhanh

### 3. Quản lý xe
- **URL**: `/admin/cars`
- **Chức năng**:
  - **Xem**: Danh sách tất cả xe với thông tin chi tiết và trạng thái
  - **Thêm**: Thêm xe mới với các thông tin:
    - Tên xe, loại xe, hộp số (auto/manual)
    - Số ghế, giá thuê/ngày
    - Mô tả, ghi chú
    - Tính năng, hình ảnh
    - Trạng thái (rảnh/đang cho thuê/bảo trì)
  - **Sửa**: Cập nhật thông tin xe
  - **Xóa**: Xóa xe (có xác nhận)
  - **Tìm kiếm**: Tìm theo tên xe, loại xe
  - **Lọc**: Lọc theo trạng thái xe

### 4. Bảo vệ routes
- Tất cả routes admin yêu cầu authentication
- Token JWT được kiểm tra tự động
- Nếu token hết hạn, tự động chuyển về trang đăng nhập

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/verify` - Xác thực token (yêu cầu Bearer token)

### Car Management (Admin - yêu cầu authentication)
- `GET /api/admin/cars` - Lấy danh sách tất cả xe
- `POST /api/admin/cars` - Tạo xe mới
- `GET /api/admin/cars/:id` - Lấy thông tin xe theo ID
- `PUT /api/admin/cars/:id` - Cập nhật thông tin xe
- `DELETE /api/admin/cars/:id` - Xóa xe

## Cách sử dụng

### 1. Đăng nhập
1. Truy cập `http://localhost:3000/admin/login`
2. Nhập email và mật khẩu của admin
3. Nhấn "Đăng nhập"

### 2. Quản lý xe
1. Sau khi đăng nhập, truy cập `/admin/cars`
2. **Thêm xe mới**: Nhấn nút "Thêm xe mới", điền form và lưu
3. **Sửa xe**: Nhấn icon "Sửa" trên hàng xe muốn sửa
4. **Xóa xe**: Nhấn icon "Xóa" và xác nhận
5. **Tìm kiếm**: Sử dụng ô tìm kiếm phía trên bảng
6. **Lọc**: Chọn trạng thái trong dropdown để lọc

### 3. Xem thống kê
- Truy cập `/admin/dashboard` để xem tổng quan hệ thống

## Yêu cầu kỹ thuật

### Backend
- Node.js với Express
- MongoDB với Mongoose
- JWT cho authentication
- bcryptjs để mã hóa mật khẩu

### Frontend
- React với React Router
- Context API cho state management
- CSS Modules cho styling
- FontAwesome cho icons

## Bảo mật
- Tất cả API admin yêu cầu JWT token hợp lệ
- Token được gửi qua Authorization header: `Bearer <token>`
- Middleware `authenticate-token.js` xác thực mọi request đến admin APIs
- Mật khẩu được mã hóa bằng bcrypt trước khi lưu database

## Cách chạy hệ thống

1. **Backend**:
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Frontend**:
   ```bash
   cd client
   npm install
   npm start
   ```

3. Truy cập:
   - Website chính: `http://localhost:3000`
   - Admin: `http://localhost:3000/admin/login`
   - API: `http://localhost:3001`

## Ghi chú
- Để truy cập admin, cần có tài khoản user đã được tạo trong hệ thống
- Hiện tại chưa có phân quyền admin riêng, sử dụng tài khoản user thông thường
- Tính năng quản lý booking sẽ được phát triển trong tương lai
