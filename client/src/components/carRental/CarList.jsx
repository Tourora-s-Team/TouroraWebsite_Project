import styles from './CarList.module.css';
import CarCard from './CarCard';

// Giả sử chúng ta có dữ liệu xe
const cars = [
  {
    id: 1,
    name: 'Toyota Vios',
    type: 'Sedan',
    features: ['Tự động', '4 chỗ', 'Máy lạnh'],
    price: '800.000',
    image: '/vios.jpeg'
  },
  {
    id: 2,
    name: 'Toyota Vios',
    type: 'Sedan',
    features: ['Tự động', '4 chỗ', 'Máy lạnh'],
    price: '800.000',
    image: '/vios.jpeg'
  },
  {
    id: 3,
    name: 'Toyota Vios',
    type: 'Sedan',
    features: ['Tự động', '4 chỗ', 'Máy lạnh'],
    price: '800.000',
    image: '/vios.jpeg'
  },
  // Thêm các xe khác...
];

const CarList = () => {
  return (
    <div className={styles.container}>
      <div className={styles.carList}>
        {cars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default CarList;