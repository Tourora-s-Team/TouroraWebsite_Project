const mongoose = require("mongoose");
require("../config/db/index").connect();
const faker = require("faker");

// Import models
const Flight = require("../models/Flight");
const Booking = require("../models/Booking_Flight");

const Review = require("../models/Review_Flight");

const airlines = ["Vietnam Airlines", "Vietjet Air", "Bamboo Airways"];
const cities = [
  { city: "Ho Chi Minh", airport: "Tan Son Nhat" },
  { city: "Ha Noi", airport: "Noi Bai" },
  { city: "Da Nang", airport: "Da Nang International" },
  { city: "Nha Trang", airport: "Cam Ranh" },
  { city: "Hai Phong", airport: "Cat Bi" },
];

const sampleFlights = [
  {
    flightNumber: "VN101",
    airline: "Vietnam Airlines",
    departure: {
      city: "Ho Chi Minh",
      airport: "Tan Son Nhat",
      date: new Date("2024-01-20 08:00:00"),
    },
    arrival: {
      city: "Ha Noi",
      airport: "Noi Bai",
      date: new Date("2024-01-20 10:00:00"),
    },
    price: {
      economy: 1500000,
      business: 3500000,
    },
    seats: {
      economy: 150,
      business: 20,
    },
  },
  {
    flightNumber: "VJ202",
    airline: "Vietjet Air",
    departure: {
      city: "Da Nang",
      airport: "Da Nang International",
      date: new Date("2024-01-21 09:00:00"),
    },
    arrival: {
      city: "Ho Chi Minh",
      airport: "Tan Son Nhat",
      date: new Date("2024-01-21 10:30:00"),
    },
    price: {
      economy: 1200000,
      business: 2800000,
    },
    seats: {
      economy: 180,
      business: 10,
    },
  },
];

for (let i = 0; i < 20; i++) {
  const from = faker.random.arrayElement(cities);
  let to;
  do {
    to = faker.random.arrayElement(cities);
  } while (to.city === from.city);

  const airline = faker.random.arrayElement(airlines);
  const flightNumber = `${airline
    .split(" ")[0]
    .substring(0, 2)
    .toUpperCase()}${faker.datatype.number({ min: 100, max: 999 })}`;
  const depDate = faker.date.between("2024-07-01", "2024-12-31");
  const arrDate = new Date(
    depDate.getTime() +
      faker.datatype.number({ min: 1, max: 4 }) * 60 * 60 * 1000
  );

  sampleFlights.push({
    flightNumber,
    airline,
    departure: {
      city: from.city,
      airport: from.airport,
      date: depDate,
    },
    arrival: {
      city: to.city,
      airport: to.airport,
      date: arrDate,
    },
    price: {
      economy: faker.datatype.number({ min: 900000, max: 2500000 }),
      business: faker.datatype.number({ min: 2500000, max: 5000000 }),
    },
    seats: {
      economy: faker.datatype.number({ min: 80, max: 200 }),
      business: faker.datatype.number({ min: 8, max: 30 }),
    },
  });
}

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Flight.deleteMany({});
    await Booking.deleteMany({});

    await Review.deleteMany({});

    console.log("🗑️ Cleared existing data");

    // Insert sample flights
    const insertedFlights = await Flight.insertMany(sampleFlights);
    console.log("✈️ Added sample flights:", insertedFlights.length);

    // Create sample booking
    const booking = await Booking.create({
      bookingCode: "BK001",
      flightId: insertedFlights[0]._id,
      passengers: [
        {
          fullName: "John Doe",
          dateOfBirth: new Date("1990-01-01"),
          phone: "0123456789",
          email: "john@example.com",
          seatType: "economy",
        },
      ],
      totalPrice: 1500000,
      status: "confirmed",
    });

    // Create sample review
    await Review.create({
      flightId: insertedFlights[0]._id,
      rating: 5,
      comment: "Great flight experience!",
    });

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📡 Database connection closed");
  }
};

seedDatabase();
