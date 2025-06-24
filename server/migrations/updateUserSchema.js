const mongoose = require('mongoose');
const User = require('../src/models/User');

// Migration script to update existing users with new schema fields
async function migrateUsers() {
  try {
    console.log('Starting user schema migration...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourora-website');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);
    
    for (const user of users) {
      const updateData = {};
      
      // Migrate phoneNumber to numberPhone if exists
      if (user.phoneNumber && !user.numberPhone) {
        updateData.numberPhone = user.phoneNumber;
        updateData.$unset = { phoneNumber: 1 };
      }
      
      // Add default values for new fields if they don't exist
      if (!user.nationality) {
        updateData.nationality = 'Vietnam';
      }
      
      if (!user.driverLicense) {
        updateData.driverLicense = {
          number: '',
          issueDate: null,
          expiryDate: null,
          issuingCountry: 'Vietnam',
          class: ''
        };
      }
      
      if (!user.emergencyContact) {
        updateData.emergencyContact = {
          name: '',
          phone: '',
          relationship: ''
        };
      }
      
      if (!user.preferences) {
        updateData.preferences = {
          preferredCarType: '',
          smokingAllowed: false,
          petFriendly: false,
          language: 'vi'
        };
      }
      
      if (!user.bookingHistory) {
        updateData.bookingHistory = [];
      }
      
      if (!user.updatedAt) {
        updateData.updatedAt = new Date();
      }
      
      // Update user if there are changes
      if (Object.keys(updateData).length > 0) {
        await User.findByIdAndUpdate(user._id, updateData);
        console.log(`Updated user: ${user.username || user.email}`);
      }
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateUsers();
}

module.exports = migrateUsers;
