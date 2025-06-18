import React from 'react';
import styles from './HotelSearchResults.module.css';
import { Box, Container, Grid, Typography, Rating, Chip, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PoolIcon from '@mui/icons-material/Pool';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

const HotelSearchResults = ({ hotels }) => {
    return (
        <Container maxWidth="lg" className={styles.container}>
            <Grid container spacing={3}>
                {/* Left Sidebar - Filters */}
                <Grid item xs={12} md={3}>
                    <div className={styles.filterSection}>
                        <Typography variant="h6" gutterBottom>
                            Lọc gần đây
                        </Typography>
                        <div className={styles.filterGroup}>
                            <Typography variant="subtitle1">Khoảng giá</Typography>
                            {/* Price range slider will go here */}
                        </div>

                        <div className={styles.filterGroup}>
                            <Typography variant="subtitle1">Lọc phổ biến</Typography>
                            <div className={styles.filterOptions}>
                                <label className={styles.filterOption}>
                                    <input type="checkbox" /> Gần biển (202)
                                </label>
                                <label className={styles.filterOption}>
                                    <input type="checkbox" /> Có bữa sáng (124)
                                </label>
                                <label className={styles.filterOption}>
                                    <input type="checkbox" /> 4-5 sao giá tốt (75)
                                </label>
                            </div>
                        </div>

                        <div className={styles.filterGroup}>
                            <Typography variant="subtitle1">Đánh giá sao</Typography>
                            {[5, 4, 3, 2, 1].map(stars => (
                                <label key={stars} className={styles.filterOption}>
                                    <input type="checkbox" />
                                    <Rating value={stars} readOnly size="small" />
                                </label>
                            ))}
                        </div>
                    </div>
                </Grid>

                {/* Main Content - Hotel List */}
                <Grid item xs={12} md={9}>
                    <div className={styles.sortSection}>
                        <Typography variant="body1">
                            <strong>1846</strong> nơi lưu trú được tìm thấy
                        </Typography>
                        <div className={styles.sortControls}>
                            <Typography variant="body2">Xếp theo:</Typography>
                            <select className={styles.sortSelect}>
                                <option>Đề phổ biến</option>
                                <option>Giá thấp nhất</option>
                                <option>Đánh giá cao nhất</option>
                            </select>
                        </div>
                    </div>

                    {/* Hotel Cards */}
                    <div className={styles.hotelList}>
                        {hotels?.map((hotel, index) => (
                            <div key={index} className={styles.hotelCard}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <div className={styles.hotelImage}>
                                            <img src={hotel.mainImage} alt={hotel.name} />
                                            <div className={styles.imageGallery}>
                                                {hotel.images?.slice(0, 3).map((img, i) => (
                                                    <img key={i} src={img} alt={`${hotel.name} ${i + 1}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <div className={styles.hotelInfo}>
                                            <Typography variant="h6" className={styles.hotelName}>
                                                {hotel.name}
                                            </Typography>
                                            <div className={styles.ratingSection}>
                                                <Rating value={hotel.rating} readOnly precision={0.5} />
                                                <Typography variant="body2">
                                                    ({hotel.reviewCount} đánh giá)
                                                </Typography>
                                            </div>
                                            <div className={styles.location}>
                                                <LocationOnIcon fontSize="small" />
                                                <Typography variant="body2">{hotel.location}</Typography>
                                            </div>
                                            <div className={styles.amenities}>
                                                {hotel.hasPool && <PoolIcon />}
                                                {hotel.hasWifi && <WifiIcon />}
                                                {hotel.hasRestaurant && <RestaurantIcon />}
                                                {hotel.hasParking && <LocalParkingIcon />}
                                            </div>
                                            {hotel.promoTag && (
                                                <Chip
                                                    label={hotel.promoTag}
                                                    color="primary"
                                                    size="small"
                                                    className={styles.promoTag}
                                                />
                                            )}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <div className={styles.priceSection}>
                                            <Typography variant="caption" color="textSecondary">
                                                <s>{hotel.originalPrice}</s>
                                            </Typography>
                                            <Typography variant="h6" color="primary" className={styles.currentPrice}>
                                                {hotel.currentPrice}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                /đêm
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                className={styles.bookButton}
                                            >
                                                Chọn phòng
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        ))}
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
};

export default HotelSearchResults;
