const mongoose = require('mongoose');
const CarRentalService = require('../src/models/CarRentalService');
const Car = require('../src/models/Car');
const BusinessPartner = require('../src/models/BussinessPartner');

// Load environment variables
require('dotenv').config();

async function seedCarRentalServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for CarRentalService seeding');

    // Clear existing data
    await CarRentalService.deleteMany({});
    console.log('Cleared existing CarRentalService data');

    // Get sample cars and business partners
    const cars = await Car.find().limit(10);
    const partners = await BusinessPartner.find().limit(5);

    if (cars.length === 0 || partners.length === 0) {
      console.log('No cars or partners found. Please seed cars and partners first.');
      return;
    }

    const carRentalServices = [];

    // Create rental services for each car with different partners
    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      const partner = partners[i % partners.length]; // Cycle through partners

      const service = {
        car_id: car._id,
        business_partner_id: partner._id,
        car_rental_status: false, // Initially all cars are available
        type_driver: Math.random() > 0.5 ? 'driver' : 'self' // Random type
      };

      carRentalServices.push(service);
    }

    // Insert the rental services
    const result = await CarRentalService.insertMany(carRentalServices);
    console.log(`Successfully seeded ${result.length} car rental services`);

    // Display the seeded data
    result.forEach((service, index) => {
      console.log(`${index + 1}. Car: ${cars.find(c => c._id.equals(service.car_id))?.car_name || 'Unknown'} 
         Partner: ${partners.find(p => p._id.equals(service.business_partner_id))?.company_name || 'Unknown'}
         Type: ${service.type_driver}
         Status: ${service.car_rental_status ? 'Rented' : 'Available'}`);
    });

    console.log('CarRentalService seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding CarRentalService:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedCarRentalServices();
}

module.exports = seedCarRentalServices;
