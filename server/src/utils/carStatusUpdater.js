const BookingCarDetails = require('../models/BookingCarDetails');
const CarRentalService = require('../models/CarRentalService');
const mongoose = require('mongoose');

/**
 * Utility để tự động cập nhật trạng thái xe dựa trên thời gian booking
 */

// Cập nhật trạng thái xe khi booking hết hạn hoặc hoàn thành
async function updateExpiredBookings() {
  try {
    const now = new Date();
    
    // Tìm các booking đã hết hạn hoặc đã hoàn thành
    const expiredBookings = await BookingCarDetails.find({
      'rental.endDate': { $lt: now },
      status: { $in: ['confirmed', 'in_progress'] }
    });

    console.log(`Found ${expiredBookings.length} expired bookings to update`);

    for (const booking of expiredBookings) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Cập nhật booking thành completed
        booking.status = 'completed';
        booking.updatedAt = new Date();
        await booking.save({ session });

        // Cập nhật car rental status thành false (xe có sẵn)
        await CarRentalService.findByIdAndUpdate(
          booking.carRentalService_id,
          { car_rental_status: false },
          { session }
        );

        await session.commitTransaction();
        console.log(`Updated booking ${booking.bookingId} to completed`);

      } catch (error) {
        await session.abortTransaction();
        console.error(`Error updating booking ${booking.bookingId}:`, error);
      } finally {
        session.endSession();
      }
    }

    return expiredBookings.length;

  } catch (error) {
    console.error('Error updating expired bookings:', error);
    return 0;
  }
}

// Cập nhật trạng thái xe khi booking bắt đầu
async function updateStartingBookings() {
  try {
    const now = new Date();
    
    // Tìm các booking vừa bắt đầu (status là confirmed và startDate <= now)
    const startingBookings = await BookingCarDetails.find({
      'rental.startDate': { $lte: now },
      status: 'confirmed'
    });

    console.log(`Found ${startingBookings.length} starting bookings to update`);

    for (const booking of startingBookings) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Cập nhật booking thành in_progress
        booking.status = 'in_progress';
        booking.updatedAt = new Date();
        await booking.save({ session });

        // Đảm bảo car rental status là true
        await CarRentalService.findByIdAndUpdate(
          booking.carRentalService_id,
          { car_rental_status: true },
          { session }
        );

        await session.commitTransaction();
        console.log(`Updated booking ${booking.bookingId} to in_progress`);

      } catch (error) {
        await session.abortTransaction();
        console.error(`Error updating booking ${booking.bookingId}:`, error);
      } finally {
        session.endSession();
      }
    }

    return startingBookings.length;

  } catch (error) {
    console.error('Error updating starting bookings:', error);
    return 0;
  }
}

// Chạy tất cả cập nhật trạng thái
async function runStatusUpdates() {
  console.log('Running car status updates...');
  
  const expiredCount = await updateExpiredBookings();
  const startingCount = await updateStartingBookings();
  
  console.log(`Status update completed: ${expiredCount} expired, ${startingCount} starting`);
  
  return {
    expiredCount,
    startingCount,
    timestamp: new Date()
  };
}

// Hàm để thiết lập cron job (chạy mỗi giờ)
function startStatusUpdater() {
  // Chạy ngay lập tức
  runStatusUpdates();
  
  // Chạy mỗi giờ
  setInterval(runStatusUpdates, 60 * 60 * 1000); // 1 hour
  
  console.log('Car status updater started - running every hour');
}

module.exports = {
  updateExpiredBookings,
  updateStartingBookings,
  runStatusUpdates,
  startStatusUpdater
};
