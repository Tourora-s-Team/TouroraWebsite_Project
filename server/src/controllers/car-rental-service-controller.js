const CarRentalService = require('../models/CarRentalService');
const Car = require('../models/Car');
const BusinessPartner = require('../models/BussinessPartner');
const { syncCarStatus, syncAllCarStatuses, updateCarStatusBasedOnRentals } = require('../utils/carStatusSync');

/**
 * Tạo car rental service mới
 */
const createCarRentalService = async (req, res) => {
  try {
    let { car_id, business_partner_id, car_rental_status, type_driver } = req.body;

    // Nếu user có business_partner_id trong token, ưu tiên sử dụng ID đó
    if (req.user && req.user.businessPartnerId) {
      business_partner_id = req.user.businessPartnerId;
    }

    // Validate business_partner_id
    if (!business_partner_id) {
      return res.status(400).json({ 
        error: 'Thiếu thông tin đối tác (business_partner_id)'
      });
    }    // Kiểm tra xe có tồn tại và thuộc về user hiện tại
    let carFilter = { _id: car_id };
    if (req.user && req.user.userId) {
      carFilter.created_by = req.user.userId;
    }
    
    const car = await Car.findOne(carFilter);
    if (!car) {
      return res.status(404).json({ error: 'Xe không tồn tại hoặc không có quyền truy cập' });
    }

    // Kiểm tra xe có đang bảo trì không
    if (car.car_status === 'maintenance') {
      return res.status(400).json({ 
        error: 'Không thể tạo dịch vụ cho thuê cho xe đang bảo trì',
        carStatus: car.car_status 
      });
    }

    // Kiểm tra business partner có tồn tại không
    const partner = await BusinessPartner.findById(business_partner_id);
    if (!partner) {
      return res.status(404).json({ error: 'Đối tác không tồn tại' });
    }

    const carRentalService = new CarRentalService({
      car_id,
      business_partner_id,
      car_rental_status,
      type_driver
    });

    await carRentalService.save();
    
    // Middleware sẽ tự động đồng bộ car status ngay lập tức

    res.status(201).json({
      success: true,
      data: carRentalService,
      message: 'Tạo dịch vụ cho thuê xe thành công'
    });
  } catch (error) {
    console.error('Error creating car rental service:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy tất cả car rental services
 */
const getCarRentalServices = async (req, res) => {
  try {
    // Tạo filter dựa trên business_partner_id
    let filter = {};
    if (req.user && req.user.businessPartnerId) {
      filter.business_partner_id = req.user.businessPartnerId;
    }

    const services = await CarRentalService.find(filter)
      .populate('car_id', 'car_name car_type car_status')
      .populate('business_partner_id', 'company_name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Error fetching car rental services:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy car rental service theo ID
 */
const getCarRentalServiceById = async (req, res) => {
  try {
    // Tạo filter dựa trên business_partner_id
    let filter = { _id: req.params.id };
    if (req.user && req.user.businessPartnerId) {
      filter.business_partner_id = req.user.businessPartnerId;
    }

    const service = await CarRentalService.findOne(filter)
      .populate('car_id')
      .populate('business_partner_id');

    if (!service) {
      return res.status(404).json({ error: 'Dịch vụ không tồn tại hoặc không có quyền truy cập' });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching car rental service:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Cập nhật car rental service
 */
const updateCarRentalService = async (req, res) => {
  try {
    const { car_rental_status, type_driver } = req.body;

    // Tạo filter dựa trên business_partner_id
    let filter = { _id: req.params.id };
    if (req.user && req.user.businessPartnerId) {
      filter.business_partner_id = req.user.businessPartnerId;
    }

    // Lấy service hiện tại để kiểm tra xe và quyền truy cập
    const currentService = await CarRentalService.findOne(filter).populate('car_id');
    if (!currentService) {
      return res.status(404).json({ error: 'Dịch vụ không tồn tại hoặc không có quyền truy cập' });
    }

    // Kiểm tra xe có đang bảo trì không và đang cố gắng set status thành true
    if (currentService.car_id.car_status === 'maintenance' && car_rental_status === true) {
      return res.status(400).json({ 
        error: 'Không thể kích hoạt dịch vụ cho xe đang bảo trì',
        carStatus: currentService.car_id.car_status 
      });
    }

    const service = await CarRentalService.findOneAndUpdate(
      filter,
      { car_rental_status, type_driver },
      { new: true }
    ).populate('car_id').populate('business_partner_id');

    // Middleware sẽ tự động đồng bộ car status ngay lập tức

    res.json({
      success: true,
      data: service,
      message: 'Cập nhật dịch vụ thành công'
    });
  } catch (error) {
    console.error('Error updating car rental service:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Xóa car rental service
 */
const deleteCarRentalService = async (req, res) => {
  try {
    // Tạo filter dựa trên business_partner_id
    let filter = { _id: req.params.id };
    if (req.user && req.user.businessPartnerId) {
      filter.business_partner_id = req.user.businessPartnerId;
    }

    const service = await CarRentalService.findOneAndDelete(filter);

    if (!service) {
      return res.status(404).json({ error: 'Dịch vụ không tồn tại hoặc không có quyền truy cập' });
    }

    // Middleware sẽ tự động đồng bộ car status

    res.json({
      success: true,
      message: 'Xóa dịch vụ thành công'
    });
  } catch (error) {
    console.error('Error deleting car rental service:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Đồng bộ tất cả car status
 */
const syncAllCarStatus = async (req, res) => {
  try {
    const result = await syncAllCarStatuses();
    
    res.json({
      success: true,
      message: 'Đồng bộ trạng thái xe thành công',
      data: result
    });
  } catch (error) {
    console.error('Error syncing car statuses:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Đồng bộ car status cho một xe cụ thể
 */
const syncCarStatusById = async (req, res) => {
  try {
    const carId = req.params.carId;
    const newStatus = await updateCarStatusBasedOnRentals(carId);
    
    res.json({
      success: true,
      message: `Đồng bộ trạng thái xe thành công: ${newStatus}`,
      data: { carId, newStatus }
    });
  } catch (error) {
    console.error('Error syncing car status:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy danh sách xe với thông tin rental status
 */
const getCarsWithRentalStatus = async (req, res) => {
  try {
    const cars = await Car.find();
    
    // Lấy thông tin rental cho mỗi xe
    const carsWithRentalInfo = await Promise.all(cars.map(async (car) => {
      const activeRentals = await CarRentalService.find({
        car_id: car._id,
        car_rental_status: true
      }).populate('business_partner_id', 'company_name');

      return {
        ...car.toObject(),
        activeRentals: activeRentals,
        rentalCount: activeRentals.length,
        isRented: activeRentals.length > 0
      };
    }));

    res.json({
      success: true,
      data: carsWithRentalInfo,
      count: carsWithRentalInfo.length
    });
  } catch (error) {
    console.error('Error fetching cars with rental status:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCarRentalService,
  getCarRentalServices,
  getCarRentalServiceById,
  updateCarRentalService,
  deleteCarRentalService,
  syncAllCarStatus,
  syncCarStatusById,
  getCarsWithRentalStatus
};
