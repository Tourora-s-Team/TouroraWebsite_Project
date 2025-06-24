/**
 * Controller để quản lý các endpoint liên quan đến địa điểm
 */
// Kết nối MongoDB - Lấy model Location (nếu có)
const mongoose = require('mongoose');

// Cache để lưu trữ kết quả tìm kiếm phổ biến
let locationsCache = {};

/**
 * Hàm lấy danh sách địa điểm
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
const getLocations = async (req, res) => {
  try {
    // Lấy query từ request
    const { searchQuery = '' } = req.query;
    
    let locations = [];
    
    // Kiểm tra cache trước khi truy vấn database
    if (searchQuery && locationsCache[searchQuery.toLowerCase()]) {
      return res.status(200).json({
        success: true,
        locations: locationsCache[searchQuery.toLowerCase()]
      });
    }

    // Nếu có chuỗi tìm kiếm, thực hiện tìm kiếm trong database
    if (searchQuery) {
      try {
        // TODO: Tìm kiếm trong MongoDB
        // Đây là đoạn code mẫu để tìm kiếm trong MongoDB
        // Cần thêm model Location và kết nối MongoDB
        
        // const Location = mongoose.model('Location');
        // const results = await Location.find({
        //   name: { $regex: searchQuery, $options: 'i' }
        // }).limit(10);
        
        // if (results && results.length > 0) {
        //   locations = results.map(loc => ({
        //     name: loc.name,
        //     value: loc.name,
        //     label: loc.name,
        //     province: loc.province,
        //     latitude: loc.latitude,
        //     longitude: loc.longitude
        //   }));
        // }
        
        // Tạm thời dùng hàm mock để tìm kiếm trong danh sách cố định
        locations = mockSearchLocations(searchQuery);
        
        // Lưu vào cache để tái sử dụng
        if (locations.length > 0) {
          locationsCache[searchQuery.toLowerCase()] = locations;
          
          // Giới hạn kích thước cache
          const cacheKeys = Object.keys(locationsCache);
          if (cacheKeys.length > 100) { // Giới hạn 100 từ khóa
            delete locationsCache[cacheKeys[0]];
          }
        }
      } catch (dbError) {
        console.error('Database search error:', dbError);
        // Fallback sang tìm kiếm local khi có lỗi DB
        locations = mockSearchLocations(searchQuery);
      }
    }
      // Nếu không có tìm kiếm hoặc không tìm thấy kết quả, trả về các địa điểm phổ biến
    if (locations.length === 0) {
      locations = getPopularLocations();
    }

    // Trả về dữ liệu dưới dạng JSON
    return res.status(200).json({
      success: true,
      locations: locations
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách địa điểm',
      error: error.message
    });
  }
};

/**
 * Hàm trả về các địa điểm phổ biến
 * @returns {Array} Danh sách các địa điểm phổ biến
 */
const getPopularLocations = () => {
  return [
    { name: 'Hà Nội', value: 'Hà Nội', label: 'Hà Nội', province: 'Hà Nội', latitude: 21.0285, longitude: 105.8542 },
    { name: 'TP Hồ Chí Minh', value: 'TP Hồ Chí Minh', label: 'TP Hồ Chí Minh', province: 'TP Hồ Chí Minh', latitude: 10.8231, longitude: 106.6297 },
    { name: 'Đà Nẵng', value: 'Đà Nẵng', label: 'Đà Nẵng', province: 'Đà Nẵng', latitude: 16.0544, longitude: 108.2022 },
    { name: 'Huế', value: 'Huế', label: 'Huế', province: 'Thừa Thiên Huế', latitude: 16.4498, longitude: 107.5624 },
    { name: 'Nha Trang', value: 'Nha Trang', label: 'Nha Trang', province: 'Khánh Hòa', latitude: 12.2388, longitude: 109.1968 },
    { name: 'Đà Lạt', value: 'Đà Lạt', label: 'Đà Lạt', province: 'Lâm Đồng', latitude: 11.9416, longitude: 108.4384 },
    { name: 'Cần Thơ', value: 'Cần Thơ', label: 'Cần Thơ', province: 'Cần Thơ', latitude: 10.0452, longitude: 105.7469 },
    { name: 'Hải Phòng', value: 'Hải Phòng', label: 'Hải Phòng', province: 'Hải Phòng', latitude: 20.8449, longitude: 106.6881 },
    { name: 'Quy Nhơn', value: 'Quy Nhơn', label: 'Quy Nhơn', province: 'Bình Định', latitude: 13.7829, longitude: 109.2196 },
    { name: 'Vũng Tàu', value: 'Vũng Tàu', label: 'Vũng Tàu', province: 'Bà Rịa - Vũng Tàu', latitude: 10.3493, longitude: 107.0852 }
  ];
};

/**
 * Hàm tìm kiếm địa điểm dựa trên chuỗi tìm kiếm
 * Đây là hàm tạm thời cho đến khi kết nối với MongoDB
 * @param {string} query - Chuỗi tìm kiếm
 * @returns {Array} Danh sách các địa điểm phù hợp
 */
const mockSearchLocations = (query) => {
  if (!query) return getPopularLocations();
  
  const vietnamLocations = [
    ...getPopularLocations(),
    { name: 'Hội An', value: 'Hội An', label: 'Hội An', province: 'Quảng Nam', latitude: 15.8801, longitude: 108.3380 },
    { name: 'Sa Pa', value: 'Sa Pa', label: 'Sa Pa', province: 'Lào Cai', latitude: 22.3364, longitude: 103.8438 },
    { name: 'Hạ Long', value: 'Hạ Long', label: 'Hạ Long', province: 'Quảng Ninh', latitude: 20.9531, longitude: 107.0656 },
    { name: 'Phan Thiết', value: 'Phan Thiết', label: 'Phan Thiết', province: 'Bình Thuận', latitude: 10.9804, longitude: 108.2622 },
    { name: 'Phú Quốc', value: 'Phú Quốc', label: 'Phú Quốc', province: 'Kiên Giang', latitude: 10.2295, longitude: 103.9619 },
    { name: 'Buôn Ma Thuột', value: 'Buôn Ma Thuột', label: 'Buôn Ma Thuột', province: 'Đắk Lắk', latitude: 12.6662, longitude: 108.0503 },
    { name: 'Pleiku', value: 'Pleiku', label: 'Pleiku', province: 'Gia Lai', latitude: 13.9833, longitude: 108.0167 },
    { name: 'Kon Tum', value: 'Kon Tum', label: 'Kon Tum', province: 'Kon Tum', latitude: 14.3544, longitude: 107.9833 },
    { name: 'Vinh', value: 'Vinh', label: 'Vinh', province: 'Nghệ An', latitude: 18.6736, longitude: 105.6922 },
    { name: 'Thanh Hóa', value: 'Thanh Hóa', label: 'Thanh Hóa', province: 'Thanh Hóa', latitude: 19.8077, longitude: 105.7768 },
    { name: 'Nam Định', value: 'Nam Định', label: 'Nam Định', province: 'Nam Định', latitude: 20.4197, longitude: 106.1685 },
    { name: 'Hà Giang', value: 'Hà Giang', label: 'Hà Giang', province: 'Hà Giang', latitude: 22.8237, longitude: 104.9778 },
    { name: 'Lạng Sơn', value: 'Lạng Sơn', label: 'Lạng Sơn', province: 'Lạng Sơn', latitude: 21.8526, longitude: 106.7611 },
    { name: 'Cao Bằng', value: 'Cao Bằng', label: 'Cao Bằng', province: 'Cao Bằng', latitude: 22.6666, longitude: 106.2646 }
  ];
  
  const lowercaseQuery = query.toLowerCase();
  return vietnamLocations.filter(location => {
    return location.name.toLowerCase().includes(lowercaseQuery) || 
           location.province.toLowerCase().includes(lowercaseQuery);
  });
};

/**
 * Hàm lấy thông tin chi tiết một địa điểm dựa trên ID
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
const getLocationById = async (req, res) => {
  try {
    const locationId = req.params.id;

    // TODO: Tìm kiếm địa điểm từ MongoDB dựa trên ID
    // const Location = mongoose.model('Location');
    // const location = await Location.findById(locationId);
    
    // if (!location) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Không tìm thấy địa điểm'
    //   });
    // }

    // Hiện tại chỉ trả về một địa điểm mẫu
    const allLocations = mockSearchLocations('');
    const location = allLocations.find(loc => loc.value === locationId) || {
      name: 'Hà Nội',
      value: locationId,
      label: 'Hà Nội',
      province: 'Hà Nội',
      description: 'Thủ đô của Việt Nam',
      latitude: 21.0285,
      longitude: 105.8542
    };

    return res.status(200).json({
      success: true,
      location: location
    });
  } catch (error) {
    console.error(`Error fetching location with ID ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin địa điểm',
      error: error.message
    });
  }
};

/**
 * Tạo Location Model cho MongoDB (Đây là một khung mẫu)
 * Bạn có thể đặt mã này trong file riêng trong thư mục models
 */
// const LocationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   province: { type: String, required: true },
//   country: { type: String, default: 'Việt Nam' },
//   countryCode: { type: String, default: 'VN' },
//   latitude: { type: Number },
//   longitude: { type: Number },
//   isPopular: { type: Boolean, default: false }
// });

// Khi bạn sẵn sàng sử dụng MongoDB, bỏ comment phần này:
// mongoose.model('Location', LocationSchema);

module.exports = {
  getLocations,
  getLocationById
};
