const mongoose = require('mongoose');
const Car = require('../src/models/Car');
const Account = require('../src/models/Account');

const migrateCarsWithCreatedBy = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/tour_booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Tìm account admin đầu tiên để gán cho các xe cũ
    const defaultAdmin = await Account.findOne({ role: 'admin' });
    if (!defaultAdmin) {
      console.log('Không tìm thấy admin account. Tạo admin mặc định...');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminAccount = new Account({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      await adminAccount.save();
      console.log('Đã tạo admin account mặc định (username: admin, password: admin123)');
      
      defaultAdmin = adminAccount;
    }

    // Cập nhật tất cả xe chưa có created_by
    const result = await Car.updateMany(
      { created_by: { $exists: false } },
      { created_by: defaultAdmin._id }
    );

    console.log(`Migration completed! Updated ${result.modifiedCount} cars with created_by field.`);
    console.log(`Default admin: ${defaultAdmin.username} (ID: ${defaultAdmin._id})`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Migration failed:', error);
    mongoose.connection.close();
  }
};

migrateCarsWithCreatedBy();
