import { useState } from 'react';

import CarRentalSearchForm from './CarRentalSearchForm';
import styles from './CarRentalFillter.module.css';


const CarRentalFillter = () => {
  const [showSearchForm, setShowSearchForm] = useState(false);

  const toggleSearchForm = () => {
    setShowSearchForm(!showSearchForm);
  };

  return (
    <div className={styles.searchForm}>
      <h2 className={styles.formTitle}>Thuê xe tại Sân bay Quốc tế Tân Sơn Nhất (SGN)</h2>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Địa điểm nhận xe</label>
          <input 
            type="text" 
            className={styles.formInput} 
            value="Sân bay Quốc tế Tân Sơn Nhất (SGN)" 
            readOnly 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Loại tài xế</label>
           <input 
            type="text" 
            className={styles.formInput} 
            value="Tự lái" 
            readOnly 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Ngày nhận xe</label>
          <input 
            type="text" 
            className={styles.formInput} 
            value="Th 6, 6 thg 6, 2025" 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Giờ nhận xe</label>
          <input 
            type="text" 
            className={styles.formInput} 
            value="9:00" 
            readOnly 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Ngày trả xe</label>
          <input 
            type="text" 
            className={styles.formInput} 
            value="CN, 8 thg 6, 2025" 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Giờ trả xe</label>
           <input 
            type="text" 
            className={styles.formInput} 
            value="11:00" 
            readOnly 
          />
        </div>
        
        
        <div className={styles.formGroup}>
          <button className={styles.searchBtn} onClick={toggleSearchForm}>Thay đổi tìm kiếm</button>

        </div>
      </div>
      {showSearchForm && <CarRentalSearchForm />}
    </div>
  );
};

export default CarRentalFillter;