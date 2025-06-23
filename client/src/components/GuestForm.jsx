import React, { useState } from 'react';
import styles from './GuestForm.module.css';
import { Button } from '@mui/material';

const GuestForm = ({ room, onBack, onSubmit }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        isSelf: true,
        requests: [],
        note: ''
    });

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox' && name === 'requests') {
            setForm(f => ({ ...f, requests: checked ? [...f.requests, value] : f.requests.filter(r => r !== value) }));
        } else if (type === 'radio' && name === 'isSelf') {
            setForm(f => ({ ...f, isSelf: value === 'true' }));
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className={styles.formWrap}>
            <h2>Đặt phòng của bạn</h2>
            {/* Thông tin phòng và khách sạn đã chọn */}
            {room && (
                <div className={styles.roomSummary}>
                    <b>Thông tin phòng đã chọn</b>
                    <div className={styles.roomCard}>
                        <img src={room.images && room.images[0] ? room.images[0] : '/assets/images/HotelBookingRoom1.jpg'} alt={room.type} className={styles.roomImg} />
                        <div className={styles.roomInfo}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{room.description}</div>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '8px 0' }}>
                                <span>{room.type}</span> | <span>{room.bedType}</span> | <span>{room.area} m²</span> | <span>{room.capacity} khách</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '4px 0' }}>
                                {room.amenities && room.amenities.map((a, i) => (
                                    <span key={i} style={{ background: '#f0f0f0', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>{a}</span>
                                ))}
                            </div>
                            <div style={{ color: '#e53935', fontWeight: 'bold', fontSize: '1.1em', margin: '8px 0' }}>
                                {room.pricePerNight ? room.pricePerNight.toLocaleString('vi-VN') + ' VND/đêm' : 'Liên hệ'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Form nhập thông tin khách */}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.section}>
                    <b>Thông tin liên hệ (đối với E-voucher)</b>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Tên đầy đủ (theo Hộ chiếu/CCCD)" />
                    <input name="email" value={form.email} onChange={handleChange} required placeholder="E-mail" type="email" />
                    <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Số điện thoại" type="tel" />
                    <div className={styles.radioGroup}>
                        <label><input type="radio" name="isSelf" value="true" checked={form.isSelf} onChange={handleChange} /> Tôi là khách lưu trú</label>
                        <label><input type="radio" name="isSelf" value="false" checked={!form.isSelf} onChange={handleChange} /> Tôi đang đặt cho người khác</label>
                    </div>
                </div>
                <div className={styles.section}>
                    <b>Bạn yêu cầu nào không?</b>
                    <label><input type="checkbox" name="requests" value="Phòng không hút thuốc" checked={form.requests.includes('Phòng không hút thuốc')} onChange={handleChange} /> Phòng không hút thuốc</label>
                    <label><input type="checkbox" name="requests" value="Phòng liên thông" checked={form.requests.includes('Phòng liên thông')} onChange={handleChange} /> Phòng liên thông</label>
                    <label><input type="checkbox" name="requests" value="Tầng lầu" checked={form.requests.includes('Tầng lầu')} onChange={handleChange} /> Tầng lầu</label>
                    <label><input type="checkbox" name="requests" value="Loại giường" checked={form.requests.includes('Loại giường')} onChange={handleChange} /> Loại giường</label>
                    <label><input type="checkbox" name="requests" value="Giờ nhận phòng" checked={form.requests.includes('Giờ nhận phòng')} onChange={handleChange} /> Giờ nhận phòng</label>
                    <label><input type="checkbox" name="requests" value="Giờ trả phòng" checked={form.requests.includes('Giờ trả phòng')} onChange={handleChange} /> Giờ trả phòng</label>
                </div>
                <div className={styles.section}>
                    <b>Yêu cầu đặc biệt</b>
                    <textarea name="note" value={form.note} onChange={handleChange} placeholder="Nhập yêu cầu nếu có" />
                </div>
                <div className={styles.btnGroup}>
                    <Button variant="contained" color="primary" type="submit">Tiếp tục thanh toán</Button>
                    <Button variant="text" color="secondary" onClick={onBack}>Quay lại chọn phòng</Button>
                </div>
            </form>
        </div>
    );
};

export default GuestForm;
