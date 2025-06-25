require('dotenv').config(); 
const mongoose = require('mongoose');
const Service = require('../src/models/Service'); 

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  return seedService();
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Dữ liệu mẫu
const sampleServices = [
    {
        service_id: 'service01',
        serviceName: 'Dịch vụ du lịch',
    },
    {
        service_id: 'service02',
        serviceName: 'Dịch vụ cho thuê xe',
    },
    {
        service_id: 'service03',
        serviceName: 'Dịch vụ khách sạn',
    },
    {
        service_id: 'service04',
        serviceName: 'Dịch vụ khách sạn',
    },
    {
        service_id: 'service05',
        serviceName: 'Dịch vụ đặt vé máy bay',
    },
    {
        service_id: 'service06',
        serviceName: 'Dịch vụ bảo hiểm du lịch',
    }
];

async function seedService() {
  try {
    // Xóa dữ liệu cũ nếu cần
    await Service.deleteMany({});

    // Thêm dữ liệu mới
    await Service.insertMany(sampleServices);
    console.log('Seed Service data successfully!');
  } catch (err) {
    console.error('Error seeding Service data:', err);
  } finally {
    mongoose.connection.close();
  }
}
