import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './HotelDetail.module.css';
import {
    Container,
    Grid,
    Typography,
    Rating,
    Tabs,
    Tab,
    Box,
    Button,
    Chip,
    ImageList,
    ImageListItem
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RoomSelect from './RoomSelect';
import GuestForm from './GuestForm';

const HotelDetail = () => {
    console.log('HotelDetail component render');
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showGuestForm, setShowGuestForm] = useState(false);

    useEffect(() => {
        let ignore = false;
        setLoading(true);
        setError(null);
        console.log('Bắt đầu fetch hotel detail với id:', id);
        fetch(`http://localhost:3001/api/hotel/${id}`)
            .then(res => {
                console.log('Kết quả fetch:', res);
                if (!res.ok) throw new Error('Không tìm thấy khách sạn');
                return res.json();
            })
            .then(data => {
                console.log('Dữ liệu trả về:', data);
                if (!ignore) setHotel(data);
            })
            .catch(err => {
                console.log('Lỗi khi fetch:', err);
                if (!ignore) {
                    setError(err.message || 'Lỗi không xác định');
                    setHotel(null);
                }
            })
            .finally(() => {
                console.log('Kết thúc fetch, setLoading(false)');
                if (!ignore) setLoading(false);
            });
        return () => { ignore = true; };
    }, [id]);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    // Tab chuyển sang form khi chọn phòng
    useEffect(() => {
        if (showGuestForm) setCurrentTab(3);
    }, [showGuestForm]);

    // Ưu tiên hiển thị error nếu có
    if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;
    if (loading) return <div>Đang tải chi tiết khách sạn...</div>;
    if (!hotel || Object.keys(hotel).length === 0) return <div>Không có dữ liệu khách sạn.</div>;

    // fallback images nếu không có
    const hotelImages = Array.isArray(hotel.images) && hotel.images.length > 0 ? hotel.images.filter(Boolean) : [
        '/assets/images/HotelBookingRoom1.jpg',
        '/assets/images/HotelBookingRoom2.jpg',
        '/assets/images/HotelBookingRoom3.jpg',
        '/assets/images/HotelBookingRoom4.jpg',
        '/assets/images/HotelBookingRoom5.jpg',
        '/assets/images/HotelBookingRoom6.jpg',
    ];

    return (
        <div className={styles.root}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Grid container spacing={3} className={styles.header}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" component="h1">
                            {hotel.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} my={1}>
                            <Rating value={hotel.rating || 0} readOnly precision={0.5} />
                            <Typography variant="body2">({hotel.rating} sao)</Typography>
                            <Chip label={hotel.address?.city + ', ' + hotel.address?.country} color="primary" size="small" />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <LocationOnIcon color="action" />
                            <Typography variant="body2">
                                {hotel.address?.street}, {hotel.address?.city}, {hotel.address?.country}, {hotel.address?.zipCode}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.priceSection}>
                        <Typography variant="caption" color="textSecondary">
                            Giá/phòng/đêm từ
                        </Typography>
                        <Typography variant="h4" color="primary">
                            {hotel.pricePerNight ? hotel.pricePerNight.toLocaleString('vi-VN') + ' VND' : 'Liên hệ'}
                        </Typography>
                        <Button variant="contained" color="primary" fullWidth>
                            Chọn phòng
                        </Button>
                    </Grid>
                </Grid>

                {/* Image Gallery */}
                <Box className={styles.gallery}>
                    <ImageList variant="quilted" cols={4} gap={8}>
                        {hotelImages.map((image, index) => (
                            <ImageListItem
                                key={index}
                                cols={index === 0 ? 2 : 1}
                                rows={index === 0 ? 2 : 1}
                            >
                                <img src={image} alt={`Hotel view ${index + 1}`} onError={e => { e.target.onerror = null; e.target.src = '/assets/images/HotelBookingRoom1.jpg'; }} />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>

                {/* Navigation Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab label="Tổng quan" />
                        <Tab label="Tiện ích" />
                        <Tab label="Liên hệ" />
                        <Tab label="Đặt phòng" />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box className={styles.tabContent}>
                    {currentTab === 0 && (
                        <>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h6" gutterBottom>
                                        Mô tả
                                    </Typography>
                                    <Typography>{hotel.description}</Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="h6" gutterBottom>
                                        Đánh giá
                                    </Typography>
                                    <Box className={styles.reviews}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Typography variant="h3">{hotel.rating}</Typography>
                                            <Typography variant="body1">{hotel.rating >= 9 ? 'Xuất sắc' : hotel.rating >= 8 ? 'Rất tốt' : 'Tốt'}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                            {/* Danh sách phòng */}
                            <RoomSelect hotelId={hotel._id} onSelectRoom={room => { setSelectedRoom(room); setShowGuestForm(true); }} />
                        </>
                    )}
                    {currentTab === 1 && (
                        <Box className={styles.amenities}>
                            <Typography variant="h6" gutterBottom>Tiện ích</Typography>
                            <ul>
                                {hotel.amenities && hotel.amenities.map((a, i) => (
                                    <li key={i}>{a}</li>
                                ))}
                            </ul>
                        </Box>
                    )}
                    {currentTab === 2 && (
                        <Box className={styles.contact}>
                            <Typography variant="h6" gutterBottom>Liên hệ</Typography>
                            <div>SĐT: {hotel.contactInfo?.phone}</div>
                            <div>Email: {hotel.contactInfo?.email}</div>
                            <div>Website: {hotel.contactInfo?.website}</div>
                        </Box>
                    )}
                    {currentTab === 3 && (
                        <GuestForm
                            room={selectedRoom}
                            onBack={() => { setShowGuestForm(false); setCurrentTab(0); }}
                            onSubmit={form => {
                                // Xử lý submit ở đây (ví dụ: chuyển sang trang thanh toán)
                                alert('Đặt phòng thành công!');
                            }}
                        />
                    )}
                </Box>
            </Container>
        </div>
    );
};

export default HotelDetail;
