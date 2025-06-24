const mongoose = require('mongoose');
const Car = require('../models/Car');
const Service = require('../models/Service');
const BusinessPartner = require('../models/BussinessPartner');
const CarRentalService = require('../models/CarRentalService');
const BookingCarDetails = require('../models/BookingCarDetails');


/**
 * Car Rental Controller
 * 
 * Available APIs:
 * 
 * CAR MANAGEMENT:
 * - POST /api/car-rental-service/ - Create new car
 * - GET /api/car-rental-service/ - Get all cars
 * - GET /api/car-rental-service/:id - Get car by ID
 * - PUT /api/car-rental-service/:id - Update car
 * - DELETE /api/car-rental-service/:id - Delete car
 * 
 * SEARCH & BOOKING:
 * - POST /api/car-rental-service/search - Search cars with filters
 * - GET /api/car-rental-service/suppliers/:carId - Get suppliers for a car
 * - POST /api/car-rental-service/book - Book a car
 * 
 * BOOKING MANAGEMENT:
 * - GET /api/car-rental-service/bookings - Get all bookings (with pagination)
 * - GET /api/car-rental-service/booking/:bookingId - Get booking by ID  
 * - PUT /api/car-rental-service/booking/:bookingId/status - Update booking status
 * - POST /api/car-rental-service/booking/:bookingId/cancel - Cancel booking
 * - GET /api/car-rental-service/bookings/stats - Get booking statistics
 * 
 * DEBUG:
 * - POST /api/car-rental-service/debug-search - Debug search requests
 */
// Create
async function createCar(req, res) {
  try {
    // Tự động gán created_by từ token
    const carData = {
      ...req.body,
      created_by: req.user.userId
    };
    
    const car = new Car(carData);
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Read all
async function getCars(req, res) {
  try {
    // Debug: Kiểm tra token và user info
    console.log('Debug getCars - req.user:', req.user);
    console.log('Debug getCars - userId:', req.user?.userId);
    
    // Tạo filter dựa trên created_by
    let filter = {};
    if (req.user && req.user.userId) {
      filter.created_by = req.user.userId;
    }
    
    console.log('Debug getCars - filter:', filter);

    const cars = await Car.find(filter)
      .populate('created_by', 'username')
      .sort({ createdAt: -1 });
    
    console.log('Debug getCars - found cars count:', cars.length);
    console.log('Debug getCars - first car:', cars[0]);
    
    res.json(cars);
  } catch (err) {
    console.error('Error in getCars:', err);
    res.status(500).json({ error: err.message });
  }
}

// Read one
async function getCarById(req, res) {
  try {
    // Tạo filter dựa trên created_by
    let filter = { _id: req.params.id };
    if (req.user && req.user.userId) {
      filter.created_by = req.user.userId;
    }

    const car = await Car.findOne(filter)
      .populate('created_by', 'username');
      
    if (!car) return res.status(404).json({ error: "Xe không tồn tại hoặc không có quyền truy cập" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update
async function updateCar(req, res) {
  try {
    // Tạo filter dựa trên created_by
    let filter = { _id: req.params.id };
    if (req.user && req.user.userId) {
      filter.created_by = req.user.userId;
    }

    const car = await Car.findOneAndUpdate(
      filter,
      req.body,
      { new: true }
    ).populate('created_by', 'username');
    
    if (!car) return res.status(404).json({ error: "Xe không tồn tại hoặc không có quyền truy cập" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete
async function deleteCar(req, res) {
  try {
    // Tạo filter dựa trên created_by
    let filter = { _id: req.params.id };
    if (req.user && req.user.userId) {
      filter.created_by = req.user.userId;
    }

    const result = await Car.findOneAndDelete(filter);
    if (!result) return res.status(404).json({ error: "Xe không tồn tại hoặc không có quyền truy cập" });
    res.json({ message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function searchCar(req, res) {
  try {
    console.log("Received request body:", req.body);
    const { filters, sortBy } = req.body;
    
    // Nếu không có filters hoặc filters không phải object, sử dụng object rỗng
    const safeFilters = (filters && typeof filters === 'object') ? filters : {};
    const { location = '', carType, transmission, fuelType, seats, priceRange, mode } = safeFilters;

    // Định nghĩa location mặc định nếu cần
    const safeLocation = location && typeof location === 'string' ? location.trim() : 'Hồ Chí Minh';
    
    // Thay vì trả lỗi 400, chúng ta sẽ sử dụng giá trị mặc định
    if (!safeLocation) {
      console.warn("Location trống hoặc không hợp lệ, sử dụng mặc định 'Hồ Chí Minh'");
    }
    
    console.log(`Searching cars in location: ${safeLocation}`);

    // 1. Tìm service thuê xe
    const service = await Service.findOne({ service_id: 'service02' });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ thuê xe.",
      });
    }
    
    const serviceId = service._id;
    console.log(`Found service with ID: ${serviceId}`);

    // 2. Tìm đối tác theo location (mở rộng tìm kiếm trong nhiều trường)
    const locationRegex = new RegExp(safeLocation, 'i');
    
    const partners = await BusinessPartner.find({
      services_type_id: serviceId,
      $or: [
        { states: { $regex: locationRegex } },
        { address: { $regex: locationRegex } },
        { country: { $regex: locationRegex } },
        { company_name: { $regex: locationRegex } }
      ]
    });

    console.log(`Found ${partners.length} partners in location ${safeLocation}`);
    
    if (!partners.length) {
      return res.status(200).json({
        success: true,
        message: "Không tìm thấy đối tác nào phù hợp với vị trí.",
        data: [],
      });
    }

    const partnerIds = partners.map(p => p._id);

    // 3. Xây dựng query lọc theo các điều kiện từ request
    const rentalQuery = {
      business_partner_id: { $in: partnerIds },
    };
    
    // Lọc theo chế độ thuê xe (có tài xế hoặc tự lái)
    if (mode === 'driver' || mode === 'self') {
      rentalQuery.type_driver = mode;
    }
    
    console.log("Query for rental services:", rentalQuery);
    
    // Truy vấn dịch vụ thuê xe
    const rentalServices = await CarRentalService.find(rentalQuery)
      .populate({
        path: 'car_id',
        select: '-__v' // Loại bỏ trường không cần thiết
      });

    console.log(`Found ${rentalServices.length} car rental services`);
    
    // Xây dựng bộ lọc cho xe
    const carFilters = {};
    
    if (carType && carType !== 'Any') {
      carFilters.car_type = { $regex: new RegExp(carType, 'i') };
    }
    
    if (transmission && transmission !== 'Any') {
      carFilters.transmission = { $regex: new RegExp(transmission, 'i') };
    }
    
    if (fuelType && fuelType !== 'Any') {
      carFilters.fuel_type = { $regex: new RegExp(fuelType, 'i') };
    }
    
    if (seats && seats !== 'Any') {
      carFilters.seats = parseInt(seats);
    }
    
    if (priceRange && priceRange !== 'Any') {
      // Xử lý khoảng giá (format: "min-max" hoặc "min+")
      const priceMatches = priceRange.match(/(\d+)-(\d+)|(\d+)\+/);
      if (priceMatches) {
        if (priceMatches[3]) {
          // Format "min+"
          const minPrice = parseInt(priceMatches[3]);
          carFilters.price_per_day = { $gte: minPrice };
        } else {
          // Format "min-max"
          const minPrice = parseInt(priceMatches[1]);
          const maxPrice = parseInt(priceMatches[2]);
          carFilters.price_per_day = { $gte: minPrice, $lte: maxPrice };
        }
      }
    }
    
    console.log("Car filters:", carFilters);
    
    // 4. Áp dụng lọc xe và nhóm dữ liệu
    const filteredCars = rentalServices
      .filter(rs => {
        const car = rs.car_id;
        if (!car) return false;
        
        // Loại bỏ xe đang bảo trì
        if (car.car_status === 'maintenance') {
          console.log(`Excluding car ${car.car_name} - under maintenance`);
          return false;
        }
        
        // Kiểm tra từng điều kiện của carFilters
        for (const [key, value] of Object.entries(carFilters)) {
          if (typeof value === 'object') {
            // Trường hợp lọc khoảng giá
            if (value.$gte && car[key] < value.$gte) return false;
            if (value.$lte && car[key] > value.$lte) return false;
          } else if (key === 'seats') {
            // Trường hợp lọc số ghế (so sánh chính xác)
            if (car[key] !== value) return false;
          } else if (value instanceof RegExp) {
            // Trường hợp lọc bằng regex
            if (!value.test(car[key])) return false;
          } else if (car[key] !== value) {
            return false;
          }
        }
        return true;
      });
      
    console.log(`After filtering, found ${filteredCars.length} cars`);
    
    // Sắp xếp xe nếu có yêu cầu
    if (sortBy) {
      filteredCars.sort((a, b) => {
        const carA = a.car_id;
        const carB = b.car_id;
        
        switch (sortBy) {
          case 'price_low':
            return carA.price_per_day - carB.price_per_day;
          case 'price_high':
            return carB.price_per_day - carA.price_per_day;
          case 'rating':
            return carB.rating - carA.rating;
          case 'popularity':
            return carB.bookings_count - carA.bookings_count;
          default:
            return 0;
        }
      });
    }
    
    // Nhóm dữ liệu theo đối tác
    const groupedResult = partners.map(partner => {
      const partnerCars = filteredCars
        .filter(rs => rs.business_partner_id.toString() === partner._id.toString())
        .map(rs => {
          // Thêm thông tin về dịch vụ thuê xe vào đối tượng xe
          const carWithRentalInfo = {
            ...rs.car_id.toObject(),
            rental_id: rs._id,
            rental_mode: rs.mode,
            rental_conditions: rs.conditions || [],
            available_from: rs.available_from,
            available_to: rs.available_to
          };
          return carWithRentalInfo;
        });
        
      return { 
        partner: {
          id: partner._id,
          name: partner.company_name,
          location: partner.states,
          address: partner.address
        }, 
        cars: partnerCars 
      };
    });    // Lọc ra những partner không có xe phù hợp
    const filteredResult = groupedResult.filter(group => group.cars.length > 0);
    
    // Chuẩn bị dữ liệu phản hồi
    const responseData = {
      totalPartners: filteredResult.length,
      totalCars: filteredResult.reduce((total, group) => total + group.cars.length, 0),
      results: filteredResult
    };
    
    console.log(`Returning ${responseData.totalCars} cars from ${responseData.totalPartners} partners`);
    
    // Trả về kết quả
    res.status(200).json({
      success: true,
      message: filteredResult.length > 0 
        ? `Tìm thấy ${responseData.totalCars} xe tại ${safeLocation}` 
        : `Không tìm thấy xe phù hợp tại ${safeLocation}`,
      data: responseData,
    });

  } catch (error) {
    console.error("Error in searchCar:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi tìm kiếm xe",
      error: error.message,
    });
  }
}

// API để lấy danh sách nhà cung cấp cho một xe cụ thể
async function getSuppliers(req, res) {
  try {
    const carId = req.params.carId;
    console.log(`Fetching suppliers for car: ${carId}`);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: "ID xe không hợp lệ"
      });
    }

    // Tìm xe và các dịch vụ thuê xe liên quan
    const rentalServices = await CarRentalService.find({ car_id: carId })
      .populate('business_partner_id')
      .populate('car_id');

    if (!rentalServices.length) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhà cung cấp cho xe này.",
      });
    }

    // Xây dựng danh sách nhà cung cấp
    const suppliers = rentalServices.map(service => {
      const partner = service.business_partner_id;
      return {
        id: partner._id,
        name: partner.company_name,        
        logo: partner.logo_url || `https://via.placeholder.com/80x40?text=${encodeURIComponent(partner.company_name)}`,
        rating: partner.rating || Math.round((4.0 + Math.random() * 1.0) * 10) / 10, // Mock rating
        reviewCount: partner.review_count || Math.floor(Math.random() * 3000) + 500,
        price: service.price_per_day || service.car_id.price_per_day,
        location: partner.states || partner.address,
        features: [
          'Miễn phí hủy',
          partner.airport_pickup ? 'Pickup tại sân bay' : 'Pickup tại văn phòng',
          'Bảo hiểm cơ bản',
          ...(service.features || [])
        ],
        cancellationPolicy: service.cancellation_policy || 'Miễn phí hủy trước 24h',
        pickupLocations: service.pickup_locations || [partner.states, 'Văn phòng chính'],
        insurance: service.insurance_type || 'Bảo hiểm cơ bản',
        fuelPolicy: service.fuel_policy || 'Đầy-Đầy (Full-Full)',
        mileageLimit: service.mileage_limit || 'Không giới hạn km',
        contact: {
          phone: partner.phone,
          email: partner.email,
          address: partner.address
        },
        policies: {
          minAge: service.min_driver_age || 21,
          drivingLicenseRequired: service.license_required || 'Bằng lái quốc tế hoặc trong nước',
          deposit: service.deposit_amount || 'Theo quy định nhà cung cấp'
        }
      };
    });

    // Sắp xếp theo giá
    suppliers.sort((a, b) => a.price - b.price);

    res.status(200).json({
      success: true,
      message: `Tìm thấy ${suppliers.length} nhà cung cấp cho xe này`,
      suppliers: suppliers,
      car: rentalServices[0].car_id
    });

  } catch (error) {
    console.error("Error in getSuppliers:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin nhà cung cấp",
      error: error.message,
    });
  }
}

// Debug endpoint để kiểm tra request
async function debugSearch(req, res) {
  try {
    const { filters, sortBy } = req.body;
    
    const issues = [];
    const recommendations = [];
    
    // Kiểm tra filters
    if (!filters) {
      issues.push("Missing 'filters' object in request body");
      recommendations.push("Add 'filters' object to request body");
    } else {
      if (!filters.location) {
        issues.push("Missing 'location' field in filters");
        recommendations.push("Add 'location' field to filters object");
      } else if (typeof filters.location !== 'string' || filters.location.trim() === '') {
        issues.push("Invalid 'location' field - must be non-empty string");
        recommendations.push("Ensure 'location' is a non-empty string");
      }
    }
    
    // Kiểm tra sortBy
    if (sortBy && typeof sortBy !== 'string') {
      issues.push("Invalid 'sortBy' field - must be string");
      recommendations.push("Ensure 'sortBy' is a string");
    }
    
    const response = {
      success: issues.length === 0,
      message: issues.length === 0 ? "Request appears valid" : "Issues found in request",
      issues: issues,
      recommendations: recommendations,
      receivedData: { filters, sortBy },
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
    
  } catch (error) {    res.status(500).json({
      success: false,
      message: "Error analyzing request",
      error: error.message
    });
  }
}

// Book a car
async function bookCar(req, res) {
  try {
    const bookingData = req.body;
    console.log('Received booking data:', JSON.stringify(bookingData, null, 2));
    
    // Validate required fields
    if (!bookingData.car || !bookingData.supplier || !bookingData.customerInfo) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: xe, nhà cung cấp, hoặc thông tin khách hàng'
      });
    }

    // Validate customer info
    const { fullname, email, numberPhone } = bookingData.customerInfo;
    console.log('Customer info request booking car:', { fullname, email, numberPhone });
    if (!fullname || !email || !numberPhone) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin khách hàng bắt buộc'
      });
    }

    // Validate rental dates
    const { startDate, endDate } = bookingData.rental;
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin ngày thuê xe'
      });
    }    // Get car_id and businessPartner_id from the booking data
    // IMPORTANT: CarRentalService.car_id field expects ObjectId (từ Car._id), 
    // không phải trường Car.car_id (là số auto-increment).
    // Frontend có thể gửi cả hai giá trị này, nên ta phải chọn đúng ObjectId.
    const car_id = bookingData.car._id || bookingData.car.id; // Luôn dùng _id ObjectId
    const businessPartner_id = bookingData.supplier.id || bookingData.supplier._id;// Debug logging
    console.log('Debug bookCar - car_id (ObjectId):', car_id, typeof car_id);
    console.log('Debug bookCar - car.car_id (số):', bookingData.car.car_id, typeof bookingData.car.car_id);
    console.log('Debug bookCar - businessPartner_id:', businessPartner_id, typeof businessPartner_id);
    console.log('Debug bookCar - full bookingData.car:', JSON.stringify(bookingData.car, null, 2));

    // Validate that we have valid ObjectIds
    if (!car_id || !businessPartner_id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin ID xe hoặc nhà cung cấp'
      });
    }

    // Ensure we're using valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(car_id)) {
      return res.status(400).json({
        success: false,
        message: 'ID xe không hợp lệ'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(businessPartner_id)) {
      return res.status(400).json({
        success: false,
        message: 'ID nhà cung cấp không hợp lệ'
      });
    }    // Find the CarRentalService for this car and business partner
    console.log('Debug - Finding CarRentalService with:', {
      car_id,
      business_partner_id: businessPartner_id,
      car_id_type: typeof car_id,
      business_partner_id_type: typeof businessPartner_id
    });
    
    // Convert to ObjectId để đảm bảo query hoạt động đúng
    const carObjectId = new mongoose.Types.ObjectId(car_id);
    const partnerObjectId = new mongoose.Types.ObjectId(businessPartner_id);
    
    const carRentalService = await CarRentalService.findOne({
      car_id: carObjectId,
      business_partner_id: partnerObjectId
    }).populate('car_id');
    
    console.log('Debug - Found CarRentalService:', carRentalService ? 'Yes' : 'No');

    if (!carRentalService) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ thuê xe tương ứng'
      });
    }

    // Kiểm tra xe có đang bảo trì không
    if (carRentalService.car_id.car_status === 'maintenance') {
      return res.status(400).json({
        success: false,
        message: 'Xe hiện đang bảo trì, không thể đặt thuê',
        carStatus: carRentalService.car_id.car_status
      });
    }

    // Check if car is currently available (car_rental_status should be false)
    if (carRentalService.car_rental_status === true) {
      return res.status(400).json({
        success: false,
        message: 'Xe hiện đang được thuê bởi khách hàng khác'
      });
    }

    // Check for overlapping bookings in the requested time period
    const requestedStartDate = new Date(startDate);
    const requestedEndDate = new Date(endDate);
    
    const overlappingBookings = await BookingCarDetails.find({
      carRentalService_id: carRentalService._id,
      status: { $in: ['confirmed', 'in_progress'] },
      $or: [
        {
          'rental.startDate': { $lte: requestedEndDate },
          'rental.endDate': { $gte: requestedStartDate }
        }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Xe đã được đặt trong khoảng thời gian này'
      });
    }

    // Generate unique booking ID
    const bookingId = 'CR' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
      // Calculate total days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    
    // Debug pickup and dropoff locations
    console.log('Pickup location data:', JSON.stringify(bookingData.pickupLocation, null, 2));
    console.log('Dropoff location data:', JSON.stringify(bookingData.dropoffLocation, null, 2));
      // Prepare booking document for database
    const bookingDocument = {
      bookingId: bookingId,
      
      // Store only references using proper ObjectIds
      car_id: carObjectId,
      businessPartner_id: partnerObjectId,
      carRentalService_id: carRentalService._id,
      
      // Rental Details
      rental: {
        startDate: new Date(startDate),
        startTime: bookingData.rental.startTime,
        endDate: new Date(endDate),
        endTime: bookingData.rental.endTime,
        mode: bookingData.rental.mode,
        location: bookingData.rental.location,
        totalDays: totalDays
      },
        // Pickup and Dropoff Locations
      pickupLocation: bookingData.pickupLocation ? {
        address: bookingData.pickupLocation.address,
        coordinates: bookingData.pickupLocation.coordinates,
        type: bookingData.pickupLocation.type,
        contactInfo: bookingData.pickupLocation.contactInfo || null
      } : undefined,
      
      dropoffLocation: bookingData.dropoffLocation ? {
        address: bookingData.dropoffLocation.address,
        coordinates: bookingData.dropoffLocation.coordinates,
        type: bookingData.dropoffLocation.type,
        contactInfo: bookingData.dropoffLocation.contactInfo || null
      } : undefined,
        // Customer Information
      customerInfo: {
        fullname: bookingData.customerInfo.fullname || bookingData.customerInfo.fullName,
        email: bookingData.customerInfo.email,
        phone: bookingData.customerInfo.phone || bookingData.customerInfo.numberPhone,
        dateOfBirth: bookingData.customerInfo.dateOfBirth ? new Date(bookingData.customerInfo.dateOfBirth) : null,
        nationality: bookingData.customerInfo.nationality,
        driverLicense: bookingData.customerInfo.driverLicense,
        licenseIssueDate: bookingData.customerInfo.licenseIssueDate ? new Date(bookingData.customerInfo.licenseIssueDate) : null,
        licenseExpiryDate: bookingData.customerInfo.licenseExpiryDate ? new Date(bookingData.customerInfo.licenseExpiryDate) : null,
        emergencyContact: bookingData.customerInfo.emergencyContact,
        emergencyPhone: bookingData.customerInfo.emergencyPhone,
        specialRequests: bookingData.customerInfo.specialRequests
      },
      
      // Additional Services/Extras
      extras: (bookingData.extras || []).map(extra => ({
        id: extra.id,
        name: extra.name,
        description: extra.description,
        price: extra.price,
        type: extra.type
      })),
      
      // Pricing Breakdown
      pricing: {
        basePrice: bookingData.pricing?.basePrice || 0,
        extraCharges: bookingData.pricing?.extraCharges || 0,
        taxes: bookingData.pricing?.taxes || 0,
        total: bookingData.pricing?.total || 0,
        days: bookingData.pricing?.days || totalDays,
        currency: bookingData.pricing?.currency || 'VND'
      },
      
      // Status
      status: 'confirmed',
      paymentStatus: 'pending',
      
      // Notes
      notes: {
        customer: bookingData.customerInfo.specialRequests || '',
        internal: `Booking created via web interface at ${new Date().toISOString()}`,
        supplier: ''
      }
    };

    // Start transaction to ensure data consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Save booking to database
      const savedBooking = await BookingCarDetails.create([bookingDocument], { session });
      console.log('Booking saved to database with ID:', savedBooking[0]._id);

      // Update car rental status to true (car is now rented)
      await CarRentalService.findByIdAndUpdate(
        carRentalService._id,
        { car_rental_status: true },
        { session }
      );

      await session.commitTransaction();

      // Prepare response data (populate car and supplier info for response)
      const populatedBooking = await BookingCarDetails.findById(savedBooking[0]._id)
        .populate('car_id')
        .populate('businessPartner_id')
        .populate('carRentalService_id');

      const responseBooking = {
        id: bookingId,
        _id: savedBooking[0]._id,
        car: populatedBooking.car_id,
        supplier: populatedBooking.businessPartner_id,
        rental: populatedBooking.rental,
        customerInfo: populatedBooking.customerInfo,
        pricing: populatedBooking.pricing,
        status: 'confirmed',
        createdAt: savedBooking[0].createdAt,
        paymentStatus: 'pending',
        totalDays: totalDays,
        expiresAt: savedBooking[0].expiresAt
      };

      res.json({
        success: true,
        message: 'Đặt xe thành công',
        bookingId: bookingId,
        booking: responseBooking,
        databaseId: savedBooking[0]._id
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt xe: ' + error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Get booking by ID
async function getBookingById(req, res) {
  try {
    const { bookingId } = req.params;
    
    const booking = await BookingCarDetails.findOne({ bookingId: bookingId });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy booking'
      });
    }

    res.json({
      success: true,
      booking: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin booking: ' + error.message
    });
  }
}

// Get all bookings (with pagination and filters)
async function getAllBookings(req, res) {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      email, 
      startDate, 
      endDate 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (email) {
      filter['customerInfo.email'] = { $regex: email, $options: 'i' };
    }
    
    if (startDate || endDate) {
      filter['rental.startDate'] = {};
      if (startDate) {
        filter['rental.startDate'].$gte = new Date(startDate);
      }
      if (endDate) {
        filter['rental.startDate'].$lte = new Date(endDate);
      }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const bookings = await BookingCarDetails.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BookingCarDetails.countDocuments(filter);

    res.json({
      success: true,
      bookings: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách booking: ' + error.message
    });
  }
}

// Update booking status and manage car rental status
async function updateBookingStatus(req, res) {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed', 'in_progress'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    const booking = await BookingCarDetails.findOne({ bookingId });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy booking'
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update booking status
      booking.status = status;
      booking.updatedAt = new Date();
      
      if (status === 'cancelled') {
        booking.cancellation = {
          cancelledAt: new Date(),
          cancelledBy: 'admin', // hoặc lấy từ user context
          reason: req.body.reason || 'Cancelled by admin'
        };
      }

      await booking.save({ session });

      // Update car rental status based on booking status
      if (status === 'cancelled' || status === 'completed') {
        // Set car as available (car_rental_status = false)
        await CarRentalService.findByIdAndUpdate(
          booking.carRentalService_id,
          { car_rental_status: false },
          { session }
        );
      } else if (status === 'confirmed' || status === 'in_progress') {
        // Set car as rented (car_rental_status = true)
        await CarRentalService.findByIdAndUpdate(
          booking.carRentalService_id,
          { car_rental_status: true },
          { session }
        );
      }

      await session.commitTransaction();

      res.json({
        success: true,
        message: 'Cập nhật trạng thái booking thành công',
        booking: booking
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái booking: ' + error.message
    });
  }
}

// Cancel booking and update car status
async function cancelBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await BookingCarDetails.findOne({ bookingId });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy booking'
      });
    }

    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Không thể hủy booking này (quá gần thời gian nhận xe hoặc đã hoàn thành)'
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update booking to cancelled
      booking.status = 'cancelled';
      booking.cancellation = {
        cancelledAt: new Date(),
        cancelledBy: 'customer', // hoặc lấy từ user context
        reason: reason || 'Cancelled by customer'
      };
      booking.updatedAt = new Date();

      await booking.save({ session });

      // Set car as available
      await CarRentalService.findByIdAndUpdate(
        booking.carRentalService_id,
        { car_rental_status: false },
        { session }
      );

      await session.commitTransaction();

      res.json({
        success: true,
        message: 'Hủy booking thành công',
        booking: booking
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hủy booking: ' + error.message
    });
  }
}

// Get booking statistics
async function getBookingStats(req, res) {
  try {
    const stats = await BookingCarDetails.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' }
        }
      }
    ]);

    const totalBookings = await BookingCarDetails.countDocuments();
    const activeRentals = await CarRentalService.countDocuments({ car_rental_status: true });
    const availableCars = await CarRentalService.countDocuments({ car_rental_status: false });

    res.json({
      success: true,
      stats: {
        totalBookings,
        activeRentals,
        availableCars,
        statusBreakdown: stats
      }
    });

  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê booking: ' + error.message
    });
  }
}

// Check car availability for a specific time period
async function checkCarAvailability(req, res) {
  try {
    const { carId, businessPartnerId, startDate, endDate } = req.query;

    if (!carId || !businessPartnerId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin cần thiết để kiểm tra'
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: 'ID xe không hợp lệ'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(businessPartnerId)) {
      return res.status(400).json({
        success: false,
        message: 'ID nhà cung cấp không hợp lệ'
      });
    }

    const carRentalService = await CarRentalService.findOne({
      car_id: new mongoose.Types.ObjectId(carId),
      business_partner_id: new mongoose.Types.ObjectId(businessPartnerId)
    });

    if (!carRentalService) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ thuê xe'
      });
    }

    // Check for overlapping bookings
    const requestedStartDate = new Date(startDate);
    const requestedEndDate = new Date(endDate);
    
    const overlappingBookings = await BookingCarDetails.find({
      carRentalService_id: carRentalService._id,
      status: { $in: ['confirmed', 'in_progress'] },
      $or: [
        {
          'rental.startDate': { $lte: requestedEndDate },
          'rental.endDate': { $gte: requestedStartDate }
        }
      ]
    });

    const isAvailable = overlappingBookings.length === 0 && !carRentalService.car_rental_status;

    res.json({
      success: true,
      available: isAvailable,
      currentStatus: carRentalService.car_rental_status,
      conflictingBookings: overlappingBookings.length,
      message: isAvailable ? 'Xe có sẵn' : 'Xe không có sẵn trong thời gian này'
    });

  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra tính có sẵn: ' + error.message
    });
  }
}

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  searchCar,
  getSuppliers,
  debugSearch,
  bookCar,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingStats,
  checkCarAvailability
};
