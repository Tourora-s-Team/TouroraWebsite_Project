const mongoose = require('mongoose');
const BusinessPartner = require('../src/models/BussinessPartner');
const Account = require('../src/models/Account');
const Service = require('../src/models/Service');

const seedBusinessPartners = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/tour_booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    await BusinessPartner.deleteMany({});
    console.log('Cleared existing business partners');

    // Tạo account và service demo nếu chưa có
    let demoAccount = await Account.findOne({ username: 'carpartner' });
    if (!demoAccount) {
      demoAccount = new Account({
        username: 'carpartner',
        password: 'password123',
        email: 'carpartner@example.com'
      });
      await demoAccount.save();
    }

    let carService = await Service.findOne({ service_name: 'Car Rental' });
    if (!carService) {
      carService = new Service({
        service_name: 'Car Rental',
        description: 'Dịch vụ cho thuê xe'
      });
      await carService.save();
    }

    // Tạo business partners mẫu
    const businessPartners = [
      {
        account_id: demoAccount._id,
        services_type_id: carService._id,
        company_name: 'VietCar Rental',
        country: 'Vietnam',
        states: 'Ho Chi Minh',
        address: '123 Nguyen Hue Street, District 1',
        phone: '0901234567',
        rating: 4.5,
        review_count: 150
      },
      {
        account_id: demoAccount._id,
        services_type_id: carService._id,
        company_name: 'Saigon Auto',
        country: 'Vietnam',
        states: 'Ho Chi Minh',
        address: '456 Le Loi Street, District 3',
        phone: '0907654321',
        rating: 4.2,
        review_count: 89
      },
      {
        account_id: demoAccount._id,
        services_type_id: carService._id,
        company_name: 'Hanoi Car Service',
        country: 'Vietnam',
        states: 'Hanoi',
        address: '789 Tran Hung Dao Street, Hoan Kiem',
        phone: '0912345678',
        rating: 4.0,
        review_count: 75
      }
    ];

    const createdPartners = await BusinessPartner.insertMany(businessPartners);
    console.log(`Created ${createdPartners.length} business partners`);
    
    createdPartners.forEach(partner => {
      console.log(`- ${partner.company_name} (ID: ${partner._id})`);
    });

    mongoose.connection.close();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding business partners:', error);
    mongoose.connection.close();
  }
};

seedBusinessPartners();
