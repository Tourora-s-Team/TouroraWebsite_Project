import React, { useMemo } from 'react';
import styles from './CarList.module.css';
import CarCard from './CarCard';

const CarList = ({ cars, partners }) => {
  // Kiểm tra xem cars có phải là một mảng không
  const hasCars = Array.isArray(cars) && cars.length > 0;
  
  // Log để debug
  console.log('[CarList] Nhận danh sách xe:', cars?.length, 'Và đối tác:', partners);
  
  // Nhóm xe theo đối tác nếu có thông tin đối tác
  const carsByPartner = useMemo(() => {
    if (!hasCars || !Array.isArray(partners) || partners.length === 0) {
      return null;
    }
    
    // Tạo map từ ID đối tác đến thông tin đối tác
    const partnerMap = new Map();
    partners.forEach(partner => {
      if (partner && partner.id) {
        partnerMap.set(partner.id.toString(), partner);
      }
    });
    
    // Nhóm xe theo đối tác
    const grouped = {};
    cars.forEach(car => {
      if (car && car.partner_id) {
        const partnerId = car.partner_id.toString();
        if (!grouped[partnerId]) {
          grouped[partnerId] = {
            partner: partnerMap.get(partnerId),
            cars: []
          };
        }
        grouped[partnerId].cars.push(car);
      }
    });
    
    return Object.values(grouped);
  }, [cars, partners, hasCars]);
  
  return (
    <div className={styles.container}>
      {!hasCars && (
        <div className={styles.noCars}>
          <p>Không tìm thấy xe phù hợp với tiêu chí của bạn.</p>
          <p>Vui lòng thử lại với tiêu chí khác hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
        </div>
      )}
      
      {hasCars && !carsByPartner && (
        <div className={styles.carList}>
          {cars.map((car, index) => (
            <CarCard 
              key={car.id || car._id || car.car_id || `car-${index}`} 
              car={car} 
            />
          ))}
        </div>
      )}
      
      {hasCars && carsByPartner && carsByPartner.map((group, groupIndex) => (
        <div key={`partner-${groupIndex}`} className={styles.partnerGroup}>
          {group.partner && (
            <div className={styles.partnerHeader}>
              <h3>{group.partner.name}</h3>
              {group.partner.address && <p>{group.partner.address}</p>}
            </div>
          )}
          <div className={styles.carList}>
            {group.cars.map((car, index) => (
              <CarCard 
                key={car.id || car._id || car.car_id || `car-group${groupIndex}-${index}`} 
                car={car} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarList;
