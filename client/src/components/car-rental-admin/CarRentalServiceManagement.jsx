import React, { useState, useEffect } from 'react';
import styles from './CarRentalServiceManagement.module.css';

const CarRentalServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [cars, setCars] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    car_id: '',
    business_partner_id: '',
    car_rental_status: true,
    type_driver: 'self'
  });

  useEffect(() => {
    fetchData();
    // Tự động lấy business_partner_id từ localStorage
    const businessPartnerId = localStorage.getItem('businessPartnerId');
    if (businessPartnerId) {
      setFormData(prev => ({
        ...prev,
        business_partner_id: businessPartnerId
      }));
    }
  }, []);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch services, cars, and partners concurrently
      const [servicesRes, carsRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/car-rental-services`, { headers }),
        fetch(`${apiUrl}/api/admin/cars`, { headers })
      ]);

      if (servicesRes.ok && carsRes.ok) {
        const servicesData = await servicesRes.json();
        const carsData = await carsRes.json();

        setServices(servicesData.data || servicesData);
        setCars(carsData);
      } else {
        setError('Không thể tải dữ liệu');
      }
    } catch (error) {
      setError('Lỗi kết nối');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const businessPartnerId = localStorage.getItem('businessPartnerId');
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    
    // Đảm bảo business_partner_id được gán đúng
    const submitData = {
      ...formData,
      business_partner_id: businessPartnerId || formData.business_partner_id
    };

    // Validate business_partner_id
    if (!submitData.business_partner_id) {
      setError('Không tìm thấy thông tin đối tác. Vui lòng đăng nhập lại.');
      return;
    }
    
    try {
      const url = editingService 
        ? `${apiUrl}/api/admin/car-rental-services/${editingService._id}`
        : `${apiUrl}/api/admin/car-rental-services`;
      
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        await fetchData();
        resetForm();
        setShowAddForm(false);
        setEditingService(null);
        setError(''); // Clear any previous errors
      } else {
        const data = await response.json();
        if (data.carStatus === 'maintenance') {
          setError('Không thể tạo dịch vụ cho xe đang bảo trì. Vui lòng chọn xe khác hoặc thay đổi trạng thái xe.');
        } else {
          setError(data.error || 'Có lỗi xảy ra');
        }
      }
    } catch (error) {
      setError('Lỗi kết nối');
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      car_id: service.car_id._id,
      business_partner_id: service.business_partner_id?._id || '',
      car_rental_status: service.car_rental_status,
      type_driver: service.type_driver
    });
    setShowAddForm(true);
  };
  const handleDelete = async (serviceId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) return;

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/admin/car-rental-services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchData();
      } else {
        setError('Không thể xóa dịch vụ');
      }
    } catch (error) {
      setError('Lỗi kết nối');
      console.error('Error deleting service:', error);
    }
  };
  const handleSyncAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/admin/car-rental-services/sync/all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Đồng bộ thành công! Đã cập nhật ${result.data.synchronized} xe.`);
        await fetchData();
      } else {
        setError('Không thể đồng bộ dữ liệu');
      }
    } catch (error) {
      setError('Lỗi kết nối');
      console.error('Error syncing data:', error);
    }
  };
  const resetForm = () => {
    const businessPartnerId = localStorage.getItem('businessPartnerId');
    setFormData({
      car_id: '',
      business_partner_id: businessPartnerId || '',
      car_rental_status: true,
      type_driver: 'self'
    });
  };

  const getCarName = (carId) => {
    const car = cars.find(c => c._id === carId);
    return car ? car.car_name : 'Unknown';
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`${styles.statusBadge} ${status ? styles.active : styles.inactive}`}>
        {status ? 'Đang thuê' : 'Không thuê'}
      </span>
    );
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;

  return (
    <div className={styles.management}>
      <div className={styles.header}>
        <h2>Quản lý dịch vụ cho thuê xe</h2>
        <div className={styles.headerActions}>
          <button 
            className={styles.syncBtn}
            onClick={handleSyncAll}
            title="Đồng bộ trạng thái tất cả xe"
          >
            <i className="fas fa-sync"></i>
            Đồng bộ tất cả
          </button>
          <button 
            className={styles.addBtn}
            onClick={() => {
              setShowAddForm(true);
              setEditingService(null);
              resetForm();
            }}
          >
            <i className="fas fa-plus"></i>
            Thêm dịch vụ
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => {
                  setShowAddForm(false);
                  setEditingService(null);
                  resetForm();
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
              <form onSubmit={handleSubmit} className={styles.form}>
              {/* Hiển thị thông tin business partner */}
              <div className={styles.inputGroup}>
                <label>Đối tác kinh doanh</label>
                <div className={styles.businessPartnerInfo}>
                  <i className="fas fa-building"></i>
                  <span>{localStorage.getItem('businessPartnerName') || 'Chưa xác định'}</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Xe *</label>
                <select
                  name="car_id"
                  value={formData.car_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn xe</option>
                  {cars
                    .filter(car => car.car_status !== 'maintenance') // Lọc bỏ xe đang bảo trì
                    .map(car => (
                      <option key={car._id} value={car._id}>
                        {car.car_name} - {car.car_type} ({car.car_status === 'available' ? 'Rảnh' : 
                                                        car.car_status === 'rented' ? 'Đang thuê' : 
                                                        car.car_status})
                      </option>
                    ))}
                </select>
                {cars.filter(car => car.car_status === 'maintenance').length > 0 && (
                  <small style={{ color: '#dc3545', marginTop: '0.25rem', display: 'block' }}>
                    <i className="fas fa-info-circle"></i> 
                    {cars.filter(car => car.car_status === 'maintenance').length} xe đang bảo trì không hiển thị
                  </small>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label>Loại lái xe *</label>
                <select
                  name="type_driver"
                  value={formData.type_driver}
                  onChange={handleInputChange}
                  required
                >
                  <option value="self">Tự lái</option>
                  <option value="driver">Có tài xế</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>
                  <input
                    type="checkbox"
                    name="car_rental_status"
                    checked={formData.car_rental_status}
                    onChange={handleInputChange}
                  />
                  Đang cho thuê
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>
                  {editingService ? 'Cập nhật' : 'Thêm'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingService(null);
                    resetForm();
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Xe</th>
              <th>Loại xe</th>
              <th>Trạng thái xe</th>
              <th>Loại lái</th>
              <th>Trạng thái thuê</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service._id}>
                <td>{service.car_rental_service_id}</td>
                <td>{service.car_id?.car_name || 'N/A'}</td>
                <td>{service.car_id?.car_type || 'N/A'}</td>
                <td>
                  <span className={`${styles.carStatusBadge} ${styles[service.car_id?.car_status]}`}>
                    {service.car_id?.car_status === 'available' ? 'Rảnh' : 
                     service.car_id?.car_status === 'rented' ? 'Đang thuê' : 
                     service.car_id?.car_status === 'maintenance' ? 'Bảo trì' : service.car_id?.car_status}
                  </span>
                </td>
                <td>{service.type_driver === 'self' ? 'Tự lái' : 'Có tài xế'}</td>
                <td>{getStatusBadge(service.car_rental_status)}</td>
                <td>{new Date(service.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEdit(service)}
                      title="Sửa"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(service._id)}
                      title="Xóa"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {services.length === 0 && (
          <div className={styles.noData}>
            Không có dịch vụ nào
          </div>
        )}
      </div>
    </div>
  );
};

export default CarRentalServiceManagement;
