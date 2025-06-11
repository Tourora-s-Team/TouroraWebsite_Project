// Tạo Slice (giống như module chứa state + action): Lưu thông tin đặt xe để sử dụng giữa các trang.
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    mode: ""
};

const CarRentalSlice = createSlice({
    name: 'carRental',
    initialState,
    reducers: {
        setCarRentalData: (state, action) => {
            state.location = action.payload.location;
            state.startDate = action.payload.startDate;
            state.startTime = action.payload.startTime;
            state.endDate = action.payload.endDate;
            state.endTime = action.payload.endTime;
            state.mode = action.payload.mode;

        },
        clearCarRentalData: (state) => {
            state.location = '';
            state.startDate = '';
            state.startTime = '';
            state.endDate = '';
            state.endTime = '';
            state.mode = '';
            
        }
    }
});

export const { setCarRentalData, clearCarRentalData } = CarRentalSlice.actions;
export default CarRentalSlice.reducer;
