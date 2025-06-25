require('dotenv').config(); // nạp biến môi trường từ .env
const mongoose = require('mongoose');
const CarRentalService = require('../src/models/CarRentalService');
const Car = require('../src/models/Car');
const BusinessPartner = require('../src/models/BussinessPartner');
const Service = require('../src/models/Service');

// Kết nối MongoDB từ biến môi trường
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Đã kết nối MongoDB');
  return seedCarRentalServices();
})
.catch((err) => {
  console.error('❌ Lỗi kết nối MongoDB:', err);
});

async function seedCarRentalServices() {
  try {
    const serviceTypeId = (await Service.findOne({ service_id: 'service02' }))._id; // ID của loại dịch vụ cho thuê xe
    // Tìm một business partner có dịch vụ cung cấp là cho thuê xe đầu tiên
    const partner = await BusinessPartner.findOne({ services_type_id: serviceTypeId });
    if (!partner) {
      throw new Error('❌ Không tìm thấy BusinessPartner nào.');
    }

    // Lấy toàn bộ xe
    const cars = await Car.find();
    if (!cars.length) {
      throw new Error('❌ Không có xe nào trong hệ thống.');
    }

    // Tạo danh sách CarRentalService cho từng xe
    const rentalServices = cars.map(car => ({
      car_id: car._id,
      business_partner_id: partner._id,
      car_rental_status: true,
      type_driver: 'driver', // hoặc 'self' tùy logic
    }));

    // Chèn vào DB
    await CarRentalService.insertMany(rentalServices);
    console.log(`✅ Đã gán ${cars.length} xe cho BusinessPartner "${partner.company_name}".`);
  } catch (err) {
    console.error('❌ Lỗi khi seed dữ liệu CarRentalService:', err.message);
  } finally {
    mongoose.connection.close();
  }
}
