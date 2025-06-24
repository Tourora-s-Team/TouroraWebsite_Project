import React from 'react';
import styles from './CarRentalResultEmpty.module.css';

const CarRentalResultEmpty = () => {
    return (
        <div className={styles.emptyState}>
            <div className={styles.icon}>🚗</div>
            <h2>Không có xe phù hợp</h2>
            <p>Chúng tôi không thể tìm thấy xe nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
            <div className={styles.suggestions}>
                <h3>Hãy thử:</h3>
                <ul>
                    <li>Điều chỉnh ngày tháng của bạn</li>
                    <li>Xóa một số bộ lọc</li>
                    <li>Mở rộng khu vực tìm kiếm của bạn</li>
                    <li>Kiểm tra các loại xe khác nhau</li>
                </ul>
            </div>
        </div>
    );
};

export default CarRentalResultEmpty;
