import React, { useState } from 'react';
import styles from './HotelBookingForm.module.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import "react-datepicker/dist/react-datepicker.css";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StarIcon from '@mui/icons-material/Star';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Popover, Box, Typography, Button, IconButton, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Đăng ký locale tiếng Việt
registerLocale('vi', vi);

const HotelBookingForm = () => {
    const [formData, setFormData] = useState({
        destination: '',
        checkIn: new Date(),
        checkOut: new Date(new Date().setDate(new Date().getDate() + 4)), // Default to 4 nights
        guests: 2,
        rooms: 1
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const [tempGuests, setTempGuests] = useState(2);
    const [tempRooms, setTempRooms] = useState(1);

    // Calculate number of nights
    const getNights = () => {
        const diffTime = Math.abs(formData.checkOut - formData.checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleGuestPopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setTempGuests(formData.guests);
        setTempRooms(formData.rooms);
    };

    const handleGuestPopoverClose = () => {
        setAnchorEl(null);
    };

    const handleGuestPopoverSave = () => {
        setFormData(prev => ({
            ...prev,
            guests: tempGuests,
            rooms: tempRooms
        }));
        handleGuestPopoverClose();
    };

    const open = Boolean(anchorEl);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.searchContainer}>
                <div className={styles.searchHeader}>
                    <h2>Khách sạn xem gần đây</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Thành phố, địa điểm hoặc tên khách sạn</label>
                        <div className={styles.inputWrapper}>
                            <LocationOnIcon className={styles.icon} />
                            <input
                                type="text"
                                name="destination"
                                value={formData.destination}
                                onChange={handleChange}
                                placeholder="Thành phố, khách sạn, điểm đến"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.dateContainer}>
                        <div className={styles.dateGroup}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nhận phòng</label>
                                <div className={styles.inputWrapper}>
                                    <CalendarTodayIcon className={styles.icon} />                                    <DatePicker
                                        selected={formData.checkIn}
                                        onChange={date => setFormData(prev => ({ ...prev, checkIn: date }))}
                                        dateFormat="EEE, dd/MM/yyyy"
                                        className={styles.input}
                                        minDate={new Date()}
                                        locale="vi"
                                    />
                                </div>
                            </div>

                            <div className={styles.nightsDisplay}>
                                <NightsStayIcon />
                                <span>{getNights()} đêm</span>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Trả phòng</label>
                                <div className={styles.inputWrapper}>
                                    <CalendarTodayIcon className={styles.icon} />                                    <DatePicker
                                        selected={formData.checkOut}
                                        onChange={date => setFormData(prev => ({ ...prev, checkOut: date }))}
                                        dateFormat="EEE, dd/MM/yyyy"
                                        className={styles.input}
                                        minDate={formData.checkIn}
                                        locale="vi"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Khách và Phòng</label>
                        <div className={styles.inputWrapper}>
                            <PersonIcon className={styles.icon} />
                            <input
                                type="text"
                                value={`${formData.guests} người lớn, ${formData.rooms} phòng`}
                                className={styles.input}
                                readOnly
                                onClick={handleGuestPopoverOpen}
                            />
                        </div>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleGuestPopoverClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <Box className={styles.guestPopover}>
                                <div className={styles.guestPopoverItem}>
                                    <Typography>Số khách</Typography>
                                    <div className={styles.guestCounter}>
                                        <IconButton
                                            onClick={() => setTempGuests(prev => Math.max(1, prev - 1))}
                                            disabled={tempGuests <= 1}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography>{tempGuests}</Typography>
                                        <IconButton onClick={() => setTempGuests(prev => prev + 1)}>
                                            <AddIcon />
                                        </IconButton>
                                    </div>
                                </div>
                                <div className={styles.guestPopoverItem}>
                                    <Typography>Số phòng</Typography>
                                    <div className={styles.guestCounter}>
                                        <IconButton
                                            onClick={() => setTempRooms(prev => Math.max(1, prev - 1))}
                                            disabled={tempRooms <= 1}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography>{tempRooms}</Typography>
                                        <IconButton
                                            onClick={() => setTempRooms(prev => Math.min(tempGuests, prev + 1))}
                                            disabled={tempRooms >= tempGuests}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </div>
                                </div>
                                <Button
                                    variant="contained"
                                    onClick={handleGuestPopoverSave}
                                    fullWidth
                                    className={styles.applyButton}
                                >
                                    Áp dụng
                                </Button>
                            </Box>
                        </Popover>
                    </div>

                    <div className={styles.filterContainer}>                        <Chip
                        icon={<FilterAltIcon />}
                        label="Bộ lọc"
                        className={styles.filterChip}
                        variant="outlined"
                        onClick={() => { }}
                    />
                        <Chip
                            icon={<RestaurantIcon />}
                            label="Có ăn sáng"
                            className={styles.filterChip}
                            variant="outlined"
                            onClick={() => { }}
                        />
                        <Chip
                            icon={<StarIcon />}
                            label="5"
                            className={styles.filterChip}
                            variant="outlined"
                            onClick={() => { }}
                        />
                        <Chip
                            icon={<ApartmentIcon />}
                            label="Khách sạn"
                            className={styles.filterChip}
                            variant="outlined"
                            onClick={() => { }}
                        />
                        <Chip
                            icon={<ThumbUpIcon />}
                            label="8+ Ấn tượng"
                            className={styles.filterChip}
                            variant="outlined"
                            onClick={() => { }}
                        />
                    </div>

                    <div className={styles.searchButtonContainer}>
                        <button type="submit" className={styles.button}>
                            Tìm khách sạn
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HotelBookingForm;
