const mongoose = require("mongoose");
require("../config/db/index").connect();

// Import models
const Flight = require("../models/Flight");
const Booking = require("../models/Booking_Flight");
const Review = require("../models/Review_Flight");
const AddOns = require("../models/Addons");
const Payment = require("../models/Payment");

const sampleFlights = [
  {
    flightNumber: "VN101",
    airline: "Vietnam Airlines",
    departure: {
      city: "Ho Chi Minh",
      airport: "Tan Son Nhat",
      date: new Date("2024-07-10T08:00:00"),
    },
    arrival: {
      city: "Ha Noi",
      airport: "Noi Bai",
      date: new Date("2024-07-10T10:00:00"),
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
      date: new Date("2024-07-11T09:00:00"),
    },
    arrival: {
      city: "Ho Chi Minh",
      airport: "Tan Son Nhat",
      date: new Date("2024-07-11T10:30:00"),
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
  {
    flightNumber: "QH303",
    airline: "Bamboo Airways",
    departure: {
      city: "Ha Noi",
      airport: "Noi Bai",
      date: new Date("2024-07-12T13:00:00"),
    },
    arrival: {
      city: "Nha Trang",
      airport: "Cam Ranh",
      date: new Date("2024-07-12T15:00:00"),
    },
    price: {
      economy: 1400000,
      business: 3200000,
    },
    seats: {
      economy: 160,
      business: 15,
    },
  },
  {
    flightNumber: "VN404",
    airline: "Vietnam Airlines",
    departure: {
      city: "Hai Phong",
      airport: "Cat Bi",
      date: new Date("2024-07-13T07:30:00"),
    },
    arrival: {
      city: "Da Nang",
      airport: "Da Nang International",
      date: new Date("2024-07-13T09:00:00"),
    },
    price: {
      economy: 1100000,
      business: 2500000,
    },
    seats: {
      economy: 120,
      business: 8,
    },
  },
  {
    flightNumber: "VJ505",
    airline: "Vietjet Air",
    departure: {
      city: "Nha Trang",
      airport: "Cam Ranh",
      date: new Date("2024-07-14T16:00:00"),
    },
    arrival: {
      city: "Ha Noi",
      airport: "Noi Bai",
      date: new Date("2024-07-14T18:00:00"),
    },
    price: {
      economy: 1350000,
      business: 2900000,
    },
    seats: {
      economy: 170,
      business: 12,
    },
  },
  {
    flightNumber: "QH606",
    airline: "Bamboo Airways",
    departure: {
      city: "Ho Chi Minh",
      airport: "Tan Son Nhat",
      date: new Date("2024-07-15T11:00:00"),
    },
    arrival: {
      city: "Hai Phong",
      airport: "Cat Bi",
      date: new Date("2024-07-15T13:00:00"),
    },
    price: {
      economy: 1250000,
      business: 2700000,
    },
    seats: {
      economy: 140,
      business: 10,
    },
  },
  {
    flightNumber: "VN707",
    airline: "Vietnam Airlines",
    departure: {
      city: "Da Nang",
      airport: "Da Nang International",
      date: new Date("2024-07-16T06:00:00"),
    },
    arrival: {
      city: "Nha Trang",
      airport: "Cam Ranh",
      date: new Date("2024-07-16T07:30:00"),
    },
    price: {
      economy: 1150000,
      business: 2600000,
    },
    seats: {
      economy: 130,
      business: 9,
    },
  },
  {
    flightNumber: "VJ808",
    airline: "Vietjet Air",
    departure: {
      city: "Ha Noi",
      airport: "Noi Bai",
      date: new Date("2024-07-17T18:00:00"),
    },
    arrival: {
      city: "Ho Chi Minh",
      airport: "Tan Son Nhat",
      date: new Date("2024-07-17T20:00:00"),
    },
    price: {
      economy: 1550000,
      business: 3400000,
    },
    seats: {
      economy: 160,
      business: 14,
    },
  },
  {
    flightNumber: "QH909",
    airline: "Bamboo Airways",
    departure: {
      city: "Nha Trang",
      airport: "Cam Ranh",
      date: new Date("2024-07-18T14:00:00"),
    },
    arrival: {
      city: "Da Nang",
      airport: "Da Nang International",
      date: new Date("2024-07-18T15:30:00"),
    },
    price: {
      economy: 1050000,
      business: 2200000,
    },
    seats: {
      economy: 110,
      business: 7,
    },
  },
  {
    flightNumber: "VN010",
    airline: "Vietnam Airlines",
    departure: {
      city: "Ho Chi Minh",
      airport: "Tan Son Nhat",
      date: new Date("2024-07-19T12:00:00"),
    },
    arrival: {
      city: "Hai Phong",
      airport: "Cat Bi",
      date: new Date("2024-07-19T14:00:00"),
    },
    price: {
      economy: 1450000,
      business: 3100000,
    },
    seats: {
      economy: 150,
      business: 10,
    },
  },
];

const sampleAddOns = [
  {
    name: "Hành lý ký gửi 20kg",
    description: "Thêm 20kg hành lý ký gửi cho chuyến bay.",
    price: 250000,
    type: "baggage",
  },
  {
    name: "Hành lý ký gửi 30kg",
    description: "Thêm 30kg hành lý ký gửi cho chuyến bay.",
    price: 350000,
    type: "baggage",
  },
  {
    name: "Bữa ăn tiêu chuẩn",
    description: "Bữa ăn tiêu chuẩn trên máy bay.",
    price: 120000,
    type: "meal",
  },
  {
    name: "Bữa ăn chay",
    description: "Bữa ăn chay dành cho hành khách.",
    price: 130000,
    type: "meal",
  },
  {
    name: "Chọn chỗ ngồi phía trước",
    description: "Chọn chỗ ngồi ở hàng ghế đầu.",
    price: 80000,
    type: "other",
  },
  {
    name: "Chọn chỗ ngồi gần cửa sổ",
    description: "Chọn chỗ ngồi cạnh cửa sổ.",
    price: 70000,
    type: "other",
  },
  {
    name: "Bảo hiểm chuyến bay cơ bản",
    description: "Bảo hiểm tai nạn và trễ chuyến cơ bản.",
    price: 50000,
    type: "insurance",
  },
  {
    name: "Bảo hiểm chuyến bay nâng cao",
    description: "Bảo hiểm toàn diện cho chuyến bay.",
    price: 100000,
    type: "insurance",
  },
  {
    name: "Ưu tiên làm thủ tục",
    description: "Ưu tiên làm thủ tục check-in tại sân bay.",
    price: 60000,
    type: "other",
  },
  {
    name: "Dịch vụ xe đưa đón sân bay",
    description: "Xe đưa đón từ sân bay về khách sạn hoặc ngược lại.",
    price: 200000,
    type: "other",
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Flight.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await AddOns.deleteMany({});
    await Payment.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Insert sample AddOns
    await AddOns.insertMany(sampleAddOns);
    console.log("✨ Added sample AddOns:", sampleAddOns.length);

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
