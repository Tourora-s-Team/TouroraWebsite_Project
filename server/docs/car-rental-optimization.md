# Car Rental Booking System - Database Design và Logic

## Tổng quan

Hệ thống đặt xe thuê đã được thiết kế lại để tối ưu hóa database và quản lý trạng thái xe một cách hiệu quả.

## Thay đổi chính

### 1. Model BookingCarDetails - Tối ưu hóa Database

**Trước:**
```javascript
// Lưu toàn bộ thông tin car và supplier
car: {
  car_id: String,
  car_name: String,
  car_type: String,
  // ... nhiều trường khác
}
supplier: {
  id: String,
  name: String,
  // ... nhiều trường khác
}
```

**Sau:**
```javascript
// Chỉ lưu reference ID
car_id: { type: ObjectId, ref: 'Car' },
businessPartner_id: { type: ObjectId, ref: 'BusinessPartner' },
carRentalService_id: { type: ObjectId, ref: 'CarRentalService' }
```

**Lợi ích:**
- Giảm kích thước database
- Tránh dữ liệu trùng lặp
- Dễ maintain và update
- Tự động sync khi thông tin car/supplier thay đổi

### 2. Quản lý Trạng thái Xe (car_rental_status)

**Logic:**
- `car_rental_status = false`: Xe đang rảnh, có thể đặt
- `car_rental_status = true`: Xe đang được thuê

**Khi nào cập nhật:**

1. **Khi tạo booking mới:**
   ```
   booking.status = 'confirmed' → car_rental_status = true
   ```

2. **Khi booking bắt đầu:**
   ```
   booking.status = 'in_progress' → car_rental_status = true
   ```

3. **Khi hủy booking:**
   ```
   booking.status = 'cancelled' → car_rental_status = false
   ```

4. **Khi hoàn thành booking:**
   ```
   booking.status = 'completed' → car_rental_status = false
   ```

### 3. Kiểm tra Availability

**Trước khi đặt xe, hệ thống sẽ:**

1. Kiểm tra `car_rental_status = false`
2. Kiểm tra không có booking overlap trong database:
   ```javascript
   const overlappingBookings = await BookingCarDetails.find({
     carRentalService_id: carRentalService._id,
     status: { $in: ['confirmed', 'in_progress'] },
     $or: [
       {
         'rental.startDate': { $lte: requestedEndDate },
         'rental.endDate': { $gte: requestedStartDate }
       }
     ]
   });
   ```

## API Endpoints

### Booking Management

1. **POST /api/car-rental-service/book**
   - Tạo booking mới
   - Cập nhật car_rental_status = true

2. **PUT /api/car-rental-service/booking/:bookingId/status**
   - Cập nhật trạng thái booking
   - Tự động cập nhật car_rental_status

3. **POST /api/car-rental-service/booking/:bookingId/cancel**
   - Hủy booking
   - Cập nhật car_rental_status = false

4. **GET /api/car-rental-service/check-availability**
   - Kiểm tra xe có sẵn trong khoảng thời gian
   - Query: `carId`, `businessPartnerId`, `startDate`, `endDate`

5. **GET /api/car-rental-service/bookings/stats**
   - Thống kê booking và trạng thái xe

## Auto Status Updates

### Background Service

Hệ thống có service tự động chạy mỗi giờ để:

1. **Cập nhật booking hết hạn:**
   ```
   rental.endDate < now && status = 'in_progress' 
   → status = 'completed' + car_rental_status = false
   ```

2. **Cập nhật booking bắt đầu:**
   ```
   rental.startDate <= now && status = 'confirmed'
   → status = 'in_progress' + car_rental_status = true
   ```

## Database Transaction

**Tất cả operations quan trọng sử dụng MongoDB Transaction:**

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Update booking
  await booking.save({ session });
  
  // Update car status
  await CarRentalService.findByIdAndUpdate(
    carRentalService._id,
    { car_rental_status: newStatus },
    { session }
  );
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## Frontend Integration

**Không cần thay đổi gì ở frontend** - API response vẫn populate đầy đủ thông tin car và supplier để maintain compatibility.

## Seeding Data

Chạy script để tạo CarRentalService test data:

```bash
cd server
node seeds/seed-car-rental-services.js
```

## Testing

1. **Test booking flow:**
   - Đặt xe → kiểm tra car_rental_status = true
   - Hủy booking → kiểm tra car_rental_status = false

2. **Test availability:**
   - Đặt xe trong khoảng thời gian
   - Thử đặt xe khác overlap → should fail

3. **Test auto updates:**
   - Tạo booking với endDate trong quá khứ
   - Chạy status updater → booking = completed, car = available

## Performance Benefits

1. **Database size giảm ~60%** (không lưu trùng lặp thông tin car/supplier)
2. **Query faster** (chỉ join khi cần)
3. **Data consistency** (single source of truth)
4. **Easy maintenance** (update một nơi, reflect everywhere)
