const dotenv = require("dotenv");
dotenv.config();

const mongoose = require('mongoose');
const Car = require('../src/models/Car'); // Cập nhật đường dẫn nếu khác

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Kết nối MongoDB thành công'))
.catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Dữ liệu mẫu
const cars = [
  {
    car_name: 'Toyota Vios',
    car_type: 'Sedan',
    transmission: 'auto',
    seats: 4,
    price_per_day: 800000,
    car_des: 'Xe sedan phổ biến, tiết kiệm nhiên liệu.',
    car_status: 'available',
    car_note: 'Không hút thuốc trong xe',
    features: ['Tự động', '4 chỗ', 'Máy lạnh'],
    image: '/vios.jpeg'
  },
  {
    car_name: 'Toyota Vios',
    car_type: 'Sedan',
    transmission: 'auto',
    seats: 4,
    price_per_day: 800000,
    car_des: 'Xe sedan phổ biến, tiết kiệm nhiên liệu.',
    car_status: 'available',
    car_note: 'Không hút thuốc trong xe',
    features: ['Tự động', '4 chỗ', 'Máy lạnh'],
    image: '/vios.jpeg'
  },
  {
    car_name: 'Toyota Vios',
    car_type: 'Sedan',
    transmission: 'auto',
    seats: 4,
    price_per_day: 800000,
    car_des: 'Xe sedan phổ biến, tiết kiệm nhiên liệu.',
    car_status: 'available',
    car_note: 'Không hút thuốc trong xe',
    features: ['Tự động', '4 chỗ', 'Máy lạnh'],
    image: '/vios.jpeg'
  }
];

// Chèn dữ liệu
async function seedCars() {
  try {
    await Car.deleteMany(); // Xoá dữ liệu cũ nếu cần
    const result = await Car.insertMany(cars);
    console.log('Đã chèn thành công:');
  } catch (error) {
    console.error('Lỗi khi chèn dữ liệu:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedCars();
