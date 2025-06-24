import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const CarContext = createContext();

const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastSearchParams, setLastSearchParams] = useState(null); // Lưu tham số tìm kiếm cuối cùng

  // Khôi phục dữ liệu từ localStorage khi khởi tạo
  useEffect(() => {
    // Thử lấy tham số tìm kiếm cuối cùng
    try {
      const lastParams = localStorage.getItem('lastCarSearchParams');
      if (lastParams) {
        const parsed = JSON.parse(lastParams);
        setLastSearchParams(parsed);
        
        // Thử lấy cache của kết quả tìm kiếm cuối
        const key = `cars_${btoa(encodeURIComponent(JSON.stringify({ 
          filters: parsed.filters, 
          sortBy: parsed.sortBy 
        })))}`;
        
        const cached = localStorage.getItem(key);
        if (cached) {
          const cachedData = JSON.parse(cached);
          const cachedTime = cachedData.timestamp || 0;
          const now = new Date().getTime();
          const cacheExpiry = 15 * 60 * 1000; // 15 phút
          
          if (now - cachedTime < cacheExpiry) {
            setCars(cachedData.cars || []);
            setPartner(Array.isArray(cachedData.partner) ? cachedData.partner : [cachedData.partner].filter(Boolean));
            console.log('[CarContext] Khôi phục dữ liệu tìm kiếm từ cache:', cachedData);
          }
        }
      }
    } catch (e) {
      console.warn('[CarContext] Lỗi khi khôi phục dữ liệu tìm kiếm:', e);
    }
  }, []);

  // Hàm fetch danh sách xe (lọc + sắp xếp)
  const fetchCars = useCallback(async (filters = {}, sortBy = '') => {
    // Đảm bảo filters luôn có trường location
    const safeFilters = {
      ...filters,
      // Đảm bảo location không bị undefined hoặc null hoặc chuỗi rỗng
      location: filters.location || 'Hồ Chí Minh'
    };
    
    console.log('[CarContext] Filters sau khi kiểm tra:', safeFilters);
    
    // Lưu tham số tìm kiếm hiện tại
    const currentParams = { filters: safeFilters, sortBy };
    setLastSearchParams(currentParams);
    
    // Lưu tham số tìm kiếm vào localStorage để có thể khôi phục
    try {
      localStorage.setItem('lastCarSearchParams', JSON.stringify(currentParams));
    } catch (e) {
      console.warn('[CarContext] Không thể lưu tham số tìm kiếm:', e);
    }
    
    const key = `cars_${btoa(encodeURIComponent(JSON.stringify(currentParams)))}`;
    
    // Kiểm tra và lấy cache nếu có
    const cached = localStorage.getItem(key);    
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const cachedTime = parsed.timestamp || 0;
        const now = new Date().getTime();
        const cacheExpiry = 15 * 60 * 1000; // 15 phút
        
        // Chỉ sử dụng cache nếu chưa hết hạn
        if (now - cachedTime < cacheExpiry) {
          setCars(parsed.cars || []);
          setPartner(Array.isArray(parsed.partner) ? parsed.partner : [parsed.partner].filter(Boolean));
          console.log('[CarContext] Dữ liệu lấy từ cache còn hiệu lực:', parsed);
          return;
        } else {
          console.log('[CarContext] Cache đã hết hạn, lấy dữ liệu mới');
        }
      } catch (e) {
        console.warn('[CarContext] Lỗi khi parse cache:', e);
        localStorage.removeItem(key); // Xóa cache lỗi
      }
    }

    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const axiosConfig = {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      };

      console.log('[CarContext] Gửi request đến API:', { filters: safeFilters, sortBy });

      try {
        // Gọi endpoint debug trước để xem request có hợp lệ không
        const debugResponse = await axios.post(
          `${apiUrl}/api/car-rental-service/debug-search`, 
          { filters: safeFilters, sortBy }, 
          axiosConfig
        );
        
        console.log('[CarContext] DEBUG response:', debugResponse.data);
        
        // Cảnh báo nếu có vấn đề với yêu cầu
        if (debugResponse.data.recommendedFix !== "Request appears valid") {
          console.warn('[CarContext] Có vấn đề với yêu cầu:', debugResponse.data.recommendedFix);
        }
      } catch (debugErr) {
        console.warn('[CarContext] Không thể kiểm tra yêu cầu:', debugErr);
      }

      // Gọi API chính
      let res;
      try {
        res = await axios.post(`${apiUrl}/api/car-rental-service/search`, { filters: safeFilters, sortBy }, axiosConfig);
        console.log('[CarContext] Kết quả trả về:', res);
      } catch (apiError) {
        if (apiError.response && apiError.response.status === 400) {
          // Nếu server báo lỗi 400, có thể là do thiếu location, thử lại với một location mặc định
          console.warn('[CarContext] Lỗi 400, thử lại với location mặc định');
          const retryFilters = { 
            ...safeFilters, 
            location: 'Hồ Chí Minh' // Luôn đảm bảo có location
          };
          res = await axios.post(`${apiUrl}/api/car-rental-service/search`, { filters: retryFilters, sortBy }, axiosConfig);
          console.log('[CarContext] Kết quả sau khi thử lại:', res);
        } else {
          // Nếu không phải lỗi 400 hoặc vẫn lỗi sau khi thử lại, ném lỗi để xử lý ở catch bên ngoài
          throw apiError;
        }
      }
      
      let carData = [];
      let partnerData = [];
      let allCars = [];

      // Xử lý dữ liệu trả về từ API
      console.log('[CarContext] Cấu trúc dữ liệu trả về:', JSON.stringify(res.data, null, 2));
      
      if (res.status === 200 && res.data) {
        if (res.data.success && res.data.data) {
          // Cấu trúc từ API hiện tại: 
          // data.data.results[]: mảng các đối tác, mỗi đối tác có partner{} và cars[]
          if (res.data.data.results && Array.isArray(res.data.data.results)) {
            partnerData = res.data.data.results.map(item => item.partner);
            // Tập hợp tất cả xe từ mọi đối tác thành một mảng
            allCars = res.data.data.results.flatMap(item => 
              Array.isArray(item.cars) ? item.cars : []
            );
            carData = allCars;
            console.log('[CarContext] Tìm thấy', carData.length, 'xe từ', partnerData.length, 'đối tác');
          } 
          // Trường hợp không có results array mà chỉ có một mảng xe
          else if (res.data.data.cars && Array.isArray(res.data.data.cars)) {
            carData = res.data.data.cars;
            partnerData = res.data.data.partners || [res.data.data.partner].filter(Boolean);
            console.log('[CarContext] Đã tìm thấy xe (cấu trúc đơn giản):', carData.length);
          }
          // Trường hợp data là mảng trực tiếp
          else if (Array.isArray(res.data.data)) {
            carData = res.data.data;
            console.log('[CarContext] Đã tìm thấy xe (mảng trực tiếp):', carData.length);
          }
        } 
        // Trường hợp khác
        else if (Array.isArray(res.data)) {
          carData = res.data;
          console.log('[CarContext] Đã tìm thấy xe (mảng response):', carData.length);
        }
      }
        if (carData.length === 0) {
        console.warn('[CarContext] Không tìm thấy xe trong response:', res.data);
      }

      setCars(carData);
      setPartner(partnerData);

      // Lưu cache nếu có dữ liệu
      try {
        if (carData.length > 0) {
          localStorage.setItem(
            key, 
            JSON.stringify({ 
              cars: carData, 
              partner: partnerData,
              timestamp: new Date().getTime()
            })
          );
          console.log('[CarContext] Dữ liệu đã được lưu cache:', carData.length);
        }
      } catch (e) {
        console.error('[CarContext] Lỗi khi lưu cache:', e);
      }    } catch (error) {
      console.error('[CarContext] Lỗi khi gọi API:', error);
      
      // Log chi tiết lỗi khi là lỗi axios
      if (error.isAxiosError) {
        console.error('[CarContext] Lỗi API:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data,
          }
        });
      }
      
      // Thông báo người dùng tùy theo loại lỗi
      let errorMessage = 'Có lỗi xảy ra khi tìm kiếm xe.';
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin tìm kiếm.';
        } else if (error.response.status === 404) {
          errorMessage = 'Không tìm thấy xe phù hợp với tiêu chí.';
        } else if (error.response.status === 500) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
      }
      
      // Có thể hiển thị thông báo ở UI (nếu cần)
      console.warn('[CarContext] Thông báo lỗi:', errorMessage);
      
      setCars([]);
      setPartner(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CarContext.Provider value={{ cars, partner, fetchCars, loading, lastSearchParams }}>
      {children}
    </CarContext.Provider>
  );
};

export default CarProvider;
