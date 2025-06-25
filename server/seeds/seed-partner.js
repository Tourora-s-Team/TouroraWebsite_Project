const mongoose = require('mongoose');
require('dotenv').config();

const BusinessPartner = require('../src/models/BussinessPartner');
const Account = require('../src/models/Account');
const Service = require('../src/models/Service');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_db_name');

    const accounts = await Account.find();
    const services = await Service.find();

    console.log(`🔍 Đã tìm thấy ${accounts.length} accounts và ${services.length} services.`);

    if (accounts.length < 2 || services.length < 2) {
      console.log('⚠️ Cần ít nhất 2 account và 2 service để seed dữ liệu mẫu.');
      process.exit(1);
    }

    const samplePartners = [
      {
        account_id: accounts[0]._id,
        services_type_id: services[0]._id,
        company_name: 'Công ty TNHH ABC',
        country: 'Việt Nam',
        states: 'Hồ Chí Minh',
        address: '123 Đường Lê Lợi, Quận 1',
        logo_url: 'https://via.placeholder.com/80x40?text=ABC',
        rating: 4.5,
        review_count: 1200,
        phone: '0909123456',
        email: 'abc@example.com',
        airport_pickup: true
      },
      {
        account_id: accounts[1]._id,
        services_type_id: services[1]._id,
        company_name: 'Công ty CP XYZ',
        country: 'Việt Nam',
        states: 'Hà Nội',
        address: '456 Đường Trần Hưng Đạo, Hoàn Kiếm',
        logo_url: 'https://via.placeholder.com/80x40?text=XYZ',
        rating: 4.2,
        review_count: 950,
        phone: '0911123456',
        email: 'xyz@example.com',
        airport_pickup: false
      }
    ];

    await BusinessPartner.deleteMany({});
    const inserted = await BusinessPartner.insertMany(samplePartners);
    console.log(`✅ Đã thêm ${inserted.length} business partners.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
};

seed();
