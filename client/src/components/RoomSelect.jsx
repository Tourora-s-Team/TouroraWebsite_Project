import React, { useEffect, useState } from 'react';
import styles from './RoomSelect.module.css';
import { Button } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import BedIcon from '@mui/icons-material/Bed';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import CheckIcon from '@mui/icons-material/Check';

const RoomSelect = ({ hotelId, onSelectRoom }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`/api/room/hotel/${hotelId}`)
            .then(res => {
                if (!res.ok) throw new Error('Không lấy được danh sách phòng');
                return res.json();
            })
            .then(data => {
                // Tạo thêm các loại phòng ảo để hiển thị đa dạng hơn (chỉ hiển thị, không lưu DB)
                let extended = [...data];
                if (data.length > 0) {
                    const base = data[0];
                    const types = [
                        { type: 'Single', bedType: 'Single Bed', price: 500000 },
                        { type: 'Double', bedType: 'Double Bed', price: 600000 },
                        { type: 'Deluxe', bedType: 'King Bed', price: 900000 },
                        { type: 'Family', bedType: '2 Double Beds', price: 1200000 },
                        { type: 'Suite', bedType: 'Suite', price: 2000000 },
                        { type: 'Economy', bedType: 'Single Bed', price: 400000 },
                        { type: 'Premium', bedType: 'King Bed', price: 2500000 },
                        { type: 'Special', bedType: 'Special Bed', price: 3000000 }
                    ];
                    types.forEach((t, i) => {
                        extended.push({
                            ...base,
                            _id: base._id + '_fake_' + i,
                            type: t.type,
                            bedType: t.bedType,
                            pricePerNight: t.price,
                            description: `Phòng ${t.type} - ${t.bedType}`,
                            area: base.area + i * 2,
                            images: base.images,
                        });
                    });
                }
                setRooms(extended);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [hotelId]);

    if (loading) return <div>Đang tải danh sách phòng...</div>;
    if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;
    if (!rooms.length) return <div>Không có phòng nào khả dụng.</div>;

    // Nhóm phòng theo loại (ví dụ: Deluxe, Suite...)
    const grouped = rooms.reduce((acc, room) => {
        const type = room.type || 'Khác';
        if (!acc[type]) acc[type] = [];
        acc[type].push(room);
        return acc;
    }, {});

    return (
        <div className={styles.roomSection}>
            {Object.entries(grouped).map(([type, list]) => (
                <div key={type} className={styles.roomGroup}>
                    <h2 className={styles.roomType}>{type}</h2>
                    <div className={styles.roomList}>
                        {list.map(room => (
                            <div key={room._id} className={styles.roomCard}>
                                <img src={room.images && room.images[0] ? room.images[0] : '/assets/images/HotelBookingRoom1.jpg'} alt={room.type} className={styles.roomImg} />
                                <div className={styles.roomInfo}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{room.description}</div>
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '8px 0' }}>
                                        <SquareFootIcon fontSize="small" /> <span>{room.area} m²</span>
                                        <GroupIcon fontSize="small" /> <span>{room.capacity} khách</span>
                                        <BedIcon fontSize="small" /> <span>{room.bedType}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '4px 0' }}>
                                        {room.amenities && room.amenities.map((a, i) => (
                                            <span key={i} style={{ background: '#f0f0f0', borderRadius: 4, padding: '2px 8px', fontSize: 13, display: 'flex', alignItems: 'center' }}><CheckIcon style={{ fontSize: 15, color: '#43a047', marginRight: 2 }} />{a}</span>
                                        ))}
                                    </div>
                                    <div className={styles.roomPrice}>{room.pricePerNight ? room.pricePerNight.toLocaleString('vi-VN') + ' VND/đêm' : 'Liên hệ'}</div>
                                    <Button variant="contained" color="primary" onClick={() => onSelectRoom(room)}>
                                        Chọn
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RoomSelect;
