import React, { useState } from 'react';
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
    Divider,
    ImageList,
    ImageListItem
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AirConditionerIcon from '@mui/icons-material/AcUnit';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WifiIcon from '@mui/icons-material/Wifi';
import PoolIcon from '@mui/icons-material/Pool';
import ElevatorIcon from '@mui/icons-material/Elevator';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const HotelDetail = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [selectedRoomType, setSelectedRoomType] = useState(null);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const hotelImages = [
        '/assets/images/HotelBookingRoom1.jpg',
        '/assets/images/HotelBookingRoom2.jpg',
        '/assets/images/HotelBookingRoom3.jpg',
        '/assets/images/HotelBookingRoom4.jpg',
        '/assets/images/HotelBookingRoom5.jpg',
        '/assets/images/HotelBookingRoom6.jpg',
    ];

    const rooms = [
        {
            type: 'Deluxe',
            images: ['/assets/images/HotelBookingRoom1.jpg'],
            size: '41.0 m²',
            amenities: ['Không hút thuốc', 'Vòi tắm đứng', 'Tủ lạnh', 'Máy lạnh'],
            options: [
                {
                    name: 'Deluxe Room - Room Only - Semi-flexible Rate',
                    beds: '2 giường đơn hoặc 1 giường cỡ king',
                    breakfast: false,
                    originalPrice: '2,611,190 VND',
                    currentPrice: '1,958,399 VND',
                    refundable: false
                },
                {
                    name: 'Deluxe Room - Breakfast - Semi-flexible Rate',
                    beds: '2 giường đơn hoặc 1 giường cỡ king',
                    breakfast: true,
                    originalPrice: '3,003,694 VND',
                    currentPrice: '2,252,771 VND',
                    refundable: false
                }
            ]
        }
    ];

    return (
        <div className={styles.root}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Grid container spacing={3} className={styles.header}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" component="h1">
                            Khách sạn Melia Vinpearl Riverfront Đà Nẵng
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} my={1}>
                            <Rating value={4.5} readOnly precision={0.5} />
                            <Typography variant="body2">(337 đánh giá)</Typography>
                            <Chip
                                label="Hạng 1 trong số Khách sạn và Khu nghỉ dưỡng 5 sao ở Đà Nẵng"
                                color="primary"
                                size="small"
                            />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <LocationOnIcon color="action" />
                            <Typography variant="body2">
                                341 Trần Hưng Đạo, Sơn Trà, An Hải Bắc, Sơn Trà, Đà Nẵng, Việt Nam, 550000
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.priceSection}>
                        <Typography variant="caption" color="textSecondary">
                            Giá/phòng/đêm từ
                        </Typography>
                        <Typography variant="h4" color="primary">
                            1.958.399 VND
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
                                <img src={image} alt={`Hotel view ${index + 1}`} />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>

                {/* Navigation Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab label="Tổng quan" />
                        <Tab label="Phòng" />
                        <Tab label="Vị trí" />
                        <Tab label="Tiện ích" />
                        <Tab label="Chính sách" />
                        <Tab label="Đánh giá" />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box className={styles.tabContent}>
                    {currentTab === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h6" gutterBottom>
                                    Tiện ích chính
                                </Typography>
                                <Grid container spacing={2}>
                                    {[
                                        { icon: <AirConditionerIcon />, label: 'Máy lạnh' },
                                        { icon: <RestaurantIcon />, label: 'Nhà hàng' },
                                        { icon: <WifiIcon />, label: 'WiFi' },
                                        { icon: <PoolIcon />, label: 'Hồ bơi' },
                                        { icon: <ElevatorIcon />, label: 'Thang máy' },
                                        { icon: <LocalParkingIcon />, label: 'Chỗ đậu xe' },
                                        { icon: <AccessTimeIcon />, label: 'Lễ tân 24h' },
                                    ].map((amenity, index) => (
                                        <Grid item xs={6} sm={4} key={index}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {amenity.icon}
                                                <Typography variant="body2">{amenity.label}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Box mt={4}>
                                    <Typography variant="h6" gutterBottom>
                                        Trong khu vực
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography>Cầu sông Hàn</Typography>
                                                <Typography>514 m</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography>Ga Đà Nẵng</Typography>
                                                <Typography>2.09 km</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" gutterBottom>
                                    Đánh giá từ khách
                                </Typography>
                                <Box className={styles.reviews}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Typography variant="h3">9.0</Typography>
                                        <Typography variant="body1">Xuất sắc</Typography>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        337 đánh giá
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    {currentTab === 1 && (
                        <Box className={styles.roomsSection}>
                            {rooms.map((room, index) => (
                                <Box key={index} className={styles.roomCard}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={4}>
                                            <img src={room.images[0]} alt={room.type} className={styles.roomImage} />
                                            <Box className={styles.roomDetails}>
                                                <Typography variant="h6">{room.type}</Typography>
                                                <Typography variant="body2">{room.size}</Typography>
                                                <Box className={styles.amenities}>
                                                    {room.amenities.map((amenity, i) => (
                                                        <Typography key={i} variant="body2">• {amenity}</Typography>
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            {room.options.map((option, i) => (
                                                <Box key={i} className={styles.roomOption}>
                                                    <Grid container alignItems="center">
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="subtitle1">{option.name}</Typography>
                                                            <Typography variant="body2">{option.beds}</Typography>
                                                            {option.breakfast && (
                                                                <Typography variant="body2" color="primary">
                                                                    Gồm bữa sáng
                                                                </Typography>
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={12} md={3}>
                                                            <Box textAlign="right">
                                                                <Typography variant="caption">
                                                                    <s>{option.originalPrice}</s>
                                                                </Typography>
                                                                <Typography variant="h6" color="primary">
                                                                    {option.currentPrice}
                                                                </Typography>
                                                                <Typography variant="caption">
                                                                    Chưa bao gồm thuế và phí
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} md={3}>
                                                            <Button variant="contained" color="primary" fullWidth>
                                                                Chọn
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Container>
        </div>
    );
};

export default HotelDetail;
