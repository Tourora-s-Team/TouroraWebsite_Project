const User = require('../models/user');
const BookingHotel = require('../models/booking-hotels');
const BookingRoomDetail = require('../models/booking-room-detail');
const Payment = require('../models/payment');
const Customer = require('../models/customer');

// Đặt phòng khách sạn
exports.createBooking = async (req, res) => {
    try {
        const {
            name, email, phone, isSelf, requests, note, room,
            hotelId, checkIn, checkOut, totalAmount, guestDetails,
            numberOfNights, subtotal, amount, paymentMethod
        } = req.body;
        // 1. Tạo hoặc lấy user đặt phòng
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                phoneNumber: phone,
                fullname: name,
                username: email || phone, // dùng email làm username
                paymentInfo: { cardNumber: 'N/A' } // tạm thời không yêu cầu nhập thẻ
            });
        }
        // 2. Tạo customer (người check-in)
        let customer;
        if (isSelf) {
            customer = await Customer.create({ name, email, phone, note, requests, isSelf: true });
        } else {
            const { customerInfo } = req.body;
            if (!customerInfo || !customerInfo.name) {
                return res.status(400).json({ error: 'Thiếu thông tin người nhận phòng (customerInfo)' });
            }
            customer = await Customer.create({ ...customerInfo, isSelf: false });
        }
        // 3. Tạo booking hotel
        const bookingHotel = await BookingHotel.create({
            userId: user._id,
            hotelId,
            checkIn,
            checkOut,
            totalAmount,
            status: 'Pending',
            guestDetails
        });
        // 4. Tạo booking room detail
        const bookingRoomDetail = await BookingRoomDetail.create({
            bookingId: bookingHotel._id,
            roomId: room._id,
            pricePerNight: room.pricePerNight,
            numberOfNights,
            subtotal,
            guestNames: [name],
            status: 'Active'
        });
        // 5. Tạo payment
        const payment = await Payment.create({
            bookingId: bookingHotel._id, // bookingHotel._id chính là id của booking vừa tạo
            amount,
            paymentMethod,
            status: 'Pending',
            currency: 'VND',
        });
        res.status(201).json({ bookingHotel, bookingRoomDetail, payment, customer });
    } catch (err) {
        console.error('Booking error:', err); // Log lỗi chi tiết ra terminal
        res.status(500).json({ error: err.message });
    }
};
