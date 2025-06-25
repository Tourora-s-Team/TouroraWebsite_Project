const mongoose = require('mongoose');
const BookingCarDetails = require('../src/models/BookingCarDetails');

const sampleBookings = [
  {
    bookingId: 'CR1703532000001TEST',
    car: {
      car_id: 'car001',
      car_name: 'Toyota Vios 2023',
      car_type: 'Sedan',
      brand: 'Toyota',
      model: 'Vios',
      year: 2023,
      seats: 5,
      transmission: 'Automatic',
      fuel_type: 'Gasoline',
      price_per_day: 800000,
      image_url: 'https://example.com/vios.jpg',
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth']
    },
    supplier: {
      id: 'supplier001',
      name: 'ABC Car Rental',
      location: 'Ho Chi Minh City',
      phone: '0123456789',
      email: 'info@abccarrental.com',
      address: '123 Nguyen Hue, District 1, Ho Chi Minh City',
      rating: 4.5,
      price: 800000,
      features: ['Free Cancellation', 'Airport Pickup', 'Basic Insurance'],
      cancellationPolicy: 'Free cancellation before 24h',
      pickupLocations: ['Office', 'Airport'],
      insurance: 'Basic Insurance',
      fuelPolicy: 'Full-Full',
      mileageLimit: 'Unlimited'
    },
    rental: {
      startDate: new Date('2025-07-01'),
      startTime: '09:00',
      endDate: new Date('2025-07-03'),
      endTime: '18:00',
      mode: 'self',
      location: 'Ho Chi Minh City',
      totalDays: 3
    },
    pickupLocation: {
      address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
      coordinates: { lat: 10.7769, lng: 106.7009 },
      type: 'office',
      contactInfo: '0123456789'
    },
    dropoffLocation: {
      address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
      coordinates: { lat: 10.7769, lng: 106.7009 },
      type: 'office',
      contactInfo: '0123456789'
    },
    customerInfo: {
      fullname: 'Nguyen Van A',
      email: 'nguyenvana@example.com',
      phone: '0987654321',
      dateOfBirth: new Date('1990-05-15'),
      nationality: 'Vietnam',
      driverLicense: 'B12345678',
      licenseIssueDate: new Date('2020-01-15'),
      licenseExpiryDate: new Date('2030-01-15'),
      emergencyContact: 'Tran Thi B',
      emergencyPhone: '0123456789',
      specialRequests: 'Pickup at hotel'
    },
    extras: [
      {
        id: 'insurance_plus',
        name: 'Extended Insurance',
        description: 'Comprehensive insurance coverage',
        price: 200000,
        type: 'insurance'
      }
    ],
    pricing: {
      basePrice: 2400000, // 3 days * 800,000
      extraCharges: 600000, // 3 days * 200,000
      taxes: 300000,
      total: 3300000,
      days: 3,
      currency: 'VND'
    },
    status: 'confirmed',
    paymentStatus: 'paid',
    notes: {
      customer: 'Pickup at hotel please',
      internal: 'VIP customer - provide excellent service',
      supplier: ''
    }
  },
  {
    bookingId: 'CR1703532000002TEST',
    car: {
      car_id: 'car002',
      car_name: 'Honda City 2023',
      car_type: 'Sedan',
      brand: 'Honda',
      model: 'City',
      year: 2023,
      seats: 5,
      transmission: 'CVT',
      fuel_type: 'Gasoline',
      price_per_day: 900000,
      image_url: 'https://example.com/city.jpg',
      features: ['Air Conditioning', 'GPS Navigation', 'USB Charging']
    },
    supplier: {
      id: 'supplier002',
      name: 'XYZ Car Services',
      location: 'Hanoi',
      phone: '0987654321',
      email: 'contact@xyzcar.com',
      address: '456 Ba Dinh, Hanoi',
      rating: 4.2,
      price: 900000,
      features: ['Free Cancellation', 'City Pickup', 'Full Insurance'],
      cancellationPolicy: 'Free cancellation before 48h',
      pickupLocations: ['Office', 'Hotel'],
      insurance: 'Full Insurance',
      fuelPolicy: 'Full-Full',
      mileageLimit: '300km/day'
    },
    rental: {
      startDate: new Date('2025-07-05'),
      startTime: '08:00',
      endDate: new Date('2025-07-07'),
      endTime: '20:00',
      mode: 'driver',
      location: 'Hanoi',
      totalDays: 2
    },
    customerInfo: {
      fullname: 'Le Thi C',
      email: 'lethic@example.com',
      phone: '0912345678',
      dateOfBirth: new Date('1985-12-20'),
      nationality: 'Vietnam',
      driverLicense: '',
      emergencyContact: 'Le Van D',
      emergencyPhone: '0987654321',
      specialRequests: 'Need English-speaking driver'
    },
    extras: [],
    pricing: {
      basePrice: 1800000, // 2 days * 900,000
      extraCharges: 0,
      taxes: 180000,
      total: 1980000,
      days: 2,
      currency: 'VND'
    },
    status: 'pending',
    paymentStatus: 'pending',
    notes: {
      customer: 'Need English-speaking driver',
      internal: 'First-time customer',
      supplier: ''
    }
  }
];

async function seedBookings() {
  try {
    console.log('Starting to seed booking data...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourora-website');
    console.log('Connected to database');
    
    // Clear existing test bookings
    await BookingCarDetails.deleteMany({ bookingId: { $regex: /TEST$/ } });
    console.log('Cleared existing test bookings');
    
    // Insert sample bookings
    const result = await BookingCarDetails.insertMany(sampleBookings);
    console.log(`Successfully inserted ${result.length} sample bookings`);
    
    // Display inserted bookings
    result.forEach(booking => {
      console.log(`- ${booking.bookingId}: ${booking.customerInfo.fullName} - ${booking.car.car_name} (${booking.status})`);
    });
    
  } catch (error) {
    console.error('Error seeding bookings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedBookings();
}

module.exports = { seedBookings, sampleBookings };
