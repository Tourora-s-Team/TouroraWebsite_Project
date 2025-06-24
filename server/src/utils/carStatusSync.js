const Car = require('../models/Car');
const CarRentalService = require('../models/CarRentalService');

/**
 * Đồng bộ trạng thái xe dựa trên car_rental_status
 * @param {ObjectId} carId - ID của xe
 * @param {Boolean} isRented - Trạng thái cho thuê (true = đang cho thuê, false = rảnh)
 */
const syncCarStatus = async (carId, isRented) => {
  try {
    const newStatus = isRented ? 'rented' : 'available';
    
    await Car.findByIdAndUpdate(carId, {
      car_status: newStatus
    });
    
    console.log(`Car ${carId} status updated to: ${newStatus}`);
  } catch (error) {
    console.error('Error syncing car status:', error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái tất cả xe dựa trên CarRentalService
 */
const syncAllCarStatuses = async () => {
  try {
    console.log('Starting car status synchronization...');
    
    // Lấy tất cả các car rental services
    const carRentalServices = await CarRentalService.find().populate('car_id');
    
    // Tạo map để track trạng thái xe
    const carStatusMap = new Map();
    
    // Duyệt qua tất cả car rental services
    for (const service of carRentalServices) {
      if (service.car_id) {
        const carId = service.car_id._id;
        
        // Bỏ qua xe đang bảo trì
        if (service.car_id.car_status === 'maintenance') {
          console.log(`Skipping car ${carId} - in maintenance`);
          continue;
        }
        
        // Nếu có ít nhất một service có car_rental_status = true, xe đang được thuê
        if (service.car_rental_status) {
          carStatusMap.set(carId.toString(), 'rented');
        } else if (!carStatusMap.has(carId.toString())) {
          // Chỉ set available nếu chưa có status nào được set
          carStatusMap.set(carId.toString(), 'available');
        }
      }
    }
    
    // Cập nhật trạng thái cho tất cả xe (trừ xe đang bảo trì)
    const updatePromises = [];
    for (const [carId, status] of carStatusMap) {
      updatePromises.push(
        Car.findByIdAndUpdate(carId, { car_status: status })
      );
    }
    
    // Cập nhật các xe không có trong CarRentalService về available (trừ xe bảo trì)
    const allCars = await Car.find();
    for (const car of allCars) {
      if (!carStatusMap.has(car._id.toString()) && car.car_status !== 'maintenance') {
        updatePromises.push(
          Car.findByIdAndUpdate(car._id, { car_status: 'available' })
        );
      }
    }
    
    await Promise.all(updatePromises);
    
    console.log(`Synchronized ${carStatusMap.size} car statuses`);
    return { success: true, synchronized: carStatusMap.size };
  } catch (error) {
    console.error('Error in syncAllCarStatuses:', error);
    throw error;
  }
};

/**
 * Kiểm tra và cập nhật trạng thái xe dựa trên tất cả CarRentalService của xe đó
 * @param {ObjectId} carId - ID của xe
 */
const updateCarStatusBasedOnRentals = async (carId) => {
  try {
    // Lấy thông tin xe hiện tại
    const car = await Car.findById(carId);
    if (!car) {
      console.log(`Car ${carId} not found`);
      return null;
    }

    // Nếu xe đang bảo trì, không thay đổi trạng thái
    if (car.car_status === 'maintenance') {
      console.log(`Car ${carId} is in maintenance, status not changed`);
      return car.car_status;
    }
    
    // Tìm tất cả car rental services cho xe này
    const activeRentals = await CarRentalService.find({
      car_id: carId,
      car_rental_status: true
    });
    
    // Nếu có ít nhất một rental active, xe đang được thuê
    const newStatus = activeRentals.length > 0 ? 'rented' : 'available';
    
    // Chỉ cập nhật nếu trạng thái thay đổi
    if (car.car_status !== newStatus) {
      await Car.findByIdAndUpdate(carId, {
        car_status: newStatus
      });
      console.log(`Car ${carId} status updated to: ${newStatus} (based on ${activeRentals.length} active rentals)`);
    } else {
      console.log(`Car ${carId} status unchanged: ${newStatus}`);
    }
    
    return newStatus;
  } catch (error) {
    console.error('Error updating car status based on rentals:', error);
    throw error;
  }
};

module.exports = {
  syncCarStatus,
  syncAllCarStatuses,
  updateCarStatusBasedOnRentals
};
