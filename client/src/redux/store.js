// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import carRentalReducer from './CarRentalSlice.js';

// Kiểm tra localStorage để load state cũ (nếu có)
const persistedState = localStorage.getItem('reduxState')
  ? JSON.parse(localStorage.getItem('reduxState'))
  : undefined; // Sử dụng undefined thay vì {} để mặc định dùng initialState từ reducer

const store = configureStore({
  reducer: {
    carRental: carRentalReducer
  },
  preloadedState: persistedState // Đúng cách truyền persistedState
});

// Lưu state vào localStorage mỗi khi state thay đổi
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('reduxState', JSON.stringify(state));
});

export default store;