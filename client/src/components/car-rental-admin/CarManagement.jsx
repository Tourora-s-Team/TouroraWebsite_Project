import React, { useState, useEffect } from 'react';
import styles from './CarManagement.module.css';

const CarManagement = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Form data state
    const [formData, setFormData] = useState({
        car_name: '',
        car_type: '',
        transmission: 'auto',
        seats: 4,
        price_per_day: '',
        car_des: '',
        car_status: 'available',
        car_note: '',
        features: [],
        image: ''
    });

    useEffect(() => {
        fetchCars();
    }, []);
    const fetchCars = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            
            const response = await fetch(`${apiUrl}/api/admin/cars`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched cars:', data); // Debug: Log danh sách xe
                console.log('Number of cars:', data.length); // Debug: Số lượng xe
                setCars(data);
            } else {
                const errorData = await response.json();
                console.error('API Error:', errorData); // Debug: Log lỗi API
                setError('Không thể tải danh sách xe');
            }
        } catch (error) {
            setError('Lỗi kết nối');
            console.error('Error fetching cars:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeaturesChange = (e) => {
        const features = e.target.value.split(',').map(f => f.trim()).filter(f => f);
        setFormData(prev => ({
            ...prev,
            features
        }));
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

        try {
            const url = editingCar
                ? `${apiUrl}/api/admin/cars/${editingCar._id}`
                : `${apiUrl}/api/admin/cars`;

            const method = editingCar ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchCars();
                resetForm();
                setShowAddForm(false);
                setEditingCar(null);
            } else {
                const data = await response.json();
                setError(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            setError('Lỗi kết nối');
            console.error('Error saving car:', error);
        }
    };    const handleEdit = (car) => {
        setEditingCar(car);
        setFormData({
            car_name: car.car_name,
            car_type: car.car_type,
            transmission: car.transmission,
            seats: car.seats,
            price_per_day: car.price_per_day,
            car_des: car.car_des,
            car_status: car.car_status,
            car_note: car.car_note || '',
            features: car.features || [],
            image: car.image || ''
        });
        setShowAddForm(true);
    };    const handleDelete = async (carId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) return;

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/admin/cars/${carId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                await fetchCars();
            } else {
                setError('Không thể xóa xe');
            }
        } catch (error) {
            setError('Lỗi kết nối');
            console.error('Error deleting car:', error);
        }
    };
    const handleSyncCarStatuses = async () => {
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
                alert(`Đồng bộ thành công! Đã cập nhật trạng thái ${result.data.synchronized} xe.`);
                await fetchCars(); // Refresh danh sách xe
            } else {
                setError('Không thể đồng bộ trạng thái xe');
            }
        } catch (error) {
            setError('Lỗi kết nối khi đồng bộ');
            console.error('Error syncing car statuses:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            car_name: '',
            car_type: '',
            transmission: 'auto',
            seats: 4,
            price_per_day: '',
            car_des: '',
            car_status: 'available',
            car_note: '',
            features: [],
            image: ''
        });
    };

    const filteredCars = cars.filter(car => {
        const matchesSearch = car.car_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.car_type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || car.car_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const statusMap = {
            'available': { text: 'Rảnh', class: 'available' },
            'rented': { text: 'Đang cho thuê', class: 'rented' },
            'maintenance': { text: 'Bảo trì', class: 'maintenance' }
        };

        const statusInfo = statusMap[status] || { text: status, class: 'default' };
        return <span className={`${styles.statusBadge} ${styles[statusInfo.class]}`}>
            {statusInfo.text}
        </span>;
    };

    if (loading) return <div className={styles.loading}>Đang tải...</div>;

    return (
        <div className={styles.carManagement}>
            <div className={styles.header}>
                <h2>Quản lý xe cho thuê</h2>
                <button
                    className={styles.addBtn}
                    onClick={() => {
                        setShowAddForm(true);
                        setEditingCar(null);
                        resetForm();
                    }}
                >
                    <i className="fas fa-plus"></i>
                    Thêm xe mới
                </button>

                <button
                    className={styles.syncBtn}
                    onClick={handleSyncCarStatuses}
                    title="Đồng bộ trạng thái xe với dịch vụ cho thuê"
                >
                    <i className="fas fa-sync"></i>
                    Đồng bộ trạng thái
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm xe..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={styles.statusFilter}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="available">Rảnh</option>
                    <option value="rented">Đang cho thuê</option>
                    <option value="maintenance">Bảo trì</option>
                </select>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{editingCar ? 'Sửa thông tin xe' : 'Thêm xe mới'}</h3>
                            <button
                                className={styles.closeBtn}
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditingCar(null);
                                    resetForm();
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.carForm}>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label>Tên xe *</label>
                                    <input
                                        type="text"
                                        name="car_name"
                                        value={formData.car_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Loại xe *</label>
                                    <input
                                        type="text"
                                        name="car_type"
                                        value={formData.car_type}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Hộp số *</label>
                                    <select
                                        name="transmission"
                                        value={formData.transmission}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="auto">Tự động</option>
                                        <option value="manual">Số sàn</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Số ghế *</label>
                                    <input
                                        type="number"
                                        name="seats"
                                        value={formData.seats}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Giá thuê/ngày (VND) *</label>
                                    <input
                                        type="number"
                                        name="price_per_day"
                                        value={formData.price_per_day}
                                        onChange={handleInputChange}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Trạng thái *</label>
                                    <select
                                        name="car_status"
                                        value={formData.car_status}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="available">Rảnh</option>
                                        <option value="rented">Đang cho thuê</option>
                                        <option value="maintenance">Bảo trì</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Mô tả *</label>
                                <textarea
                                    name="car_des"
                                    value={formData.car_des}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Ghi chú</label>
                                <textarea
                                    name="car_note"
                                    value={formData.car_note}
                                    onChange={handleInputChange}
                                    rows="2"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Tính năng (phân cách bởi dấu phẩy)</label>
                                <input
                                    type="text"
                                    value={formData.features.join(', ')}
                                    onChange={handleFeaturesChange}
                                    placeholder="Ví dụ: Máy lạnh, GPS, Bluetooth"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Hình ảnh (URL)</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="URL hình ảnh xe"
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button type="submit" className={styles.saveBtn}>
                                    {editingCar ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingCar(null);
                                        resetForm();
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}            {/* Cars Table */}
            <div className={styles.tableContainer}>
                <table className={styles.carsTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên xe</th>
                            <th>Loại xe</th>
                            <th>Hộp số</th>
                            <th>Số ghế</th>
                            <th>Giá/ngày</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCars.map(car => (
                            <tr key={car._id}>
                                <td>{car.car_id}</td>
                                <td>{car.car_name}</td>
                                <td>{car.car_type}</td>
                                <td>{car.transmission === 'auto' ? 'Tự động' : 'Số sàn'}</td>
                                <td>{car.seats}</td>
                                <td>{new Intl.NumberFormat('vi-VN').format(car.price_per_day)} VND</td>
                                <td>{getStatusBadge(car.car_status)}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => handleEdit(car)}
                                            title="Sửa"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(car._id)}
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

                {filteredCars.length === 0 && (
                    <div className={styles.noData}>
                        Không có xe nào được tìm thấy
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarManagement;
