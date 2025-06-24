# Car Booking ObjectId Cast Error - Fix Documentation

## Problem Description
Error occurred when booking a car: `Cast to ObjectId failed for value "7" (type number) at path "car_id" for model "CarRentalService"`

## Root Cause
The issue was caused by confusion between two different ID fields in the Car model:
- `Car._id`: MongoDB ObjectId (e.g., "685b2f4c35f5d4bed041fa7c")
- `Car.car_id`: Auto-increment number (e.g., 5, 7, etc.)

The `CarRentalService` model expects `car_id` field to be an ObjectId reference to `Car._id`, but sometimes the application was incorrectly using the numeric `car_id` field instead.

## Database Schema Context
```javascript
// Car Model
{
  _id: ObjectId("685b2f4c35f5d4bed041fa7c"), // MongoDB ObjectId
  car_id: 5,                                  // Auto-increment number
  car_name: "Toyota Vios",
  // ... other fields
}

// CarRentalService Model  
{
  car_id: ObjectId,              // References Car._id (NOT Car.car_id)
  business_partner_id: ObjectId, // References BusinessPartner._id
  // ... other fields
}
```

## Solution Implemented

### 1. Fixed Backend Logic (car-rental-controller.js)
- Updated `bookCar` function to always use `bookingData.car._id` (ObjectId) instead of `bookingData.car.car_id` (number)
- Added ObjectId validation using `mongoose.Types.ObjectId.isValid()`
- Added explicit ObjectId conversion using `new mongoose.Types.ObjectId()`

### 2. Enhanced Validation
- Added validation for all functions that query CarRentalService by car_id
- Functions updated: `bookCar`, `getSuppliers`, `checkCarAvailability`

### 3. Key Code Changes

#### Before:
```javascript
const car_id = bookingData.car.car_id; // Could be number
const carRentalService = await CarRentalService.findOne({
  car_id: car_id, // Could cause cast error if car_id is number
  business_partner_id: businessPartner_id
});
```

#### After:
```javascript
const car_id = bookingData.car._id || bookingData.car.id; // Always ObjectId string
// Validate ObjectId
if (!mongoose.Types.ObjectId.isValid(car_id)) {
  return res.status(400).json({
    success: false,
    message: 'ID xe không hợp lệ'
  });
}
// Convert to ObjectId for query
const carObjectId = new mongoose.Types.ObjectId(car_id);
const carRentalService = await CarRentalService.findOne({
  car_id: carObjectId, // Safe ObjectId query
  business_partner_id: partnerObjectId
});
```

## Test Results
✅ All validation tests pass:
- Valid ObjectId booking: Works correctly
- Invalid car ObjectId: Properly rejected with "ID xe không hợp lệ"
- Invalid supplier ObjectId: Properly rejected with "ID nhà cung cấp không hợp lệ"  
- Missing data: Properly rejected with "Thiếu thông tin bắt buộc"

## Files Modified
- `server/src/controllers/car-rental-controller.js`
  - Function: `bookCar`
  - Function: `getSuppliers` 
  - Function: `checkCarAvailability`

## Prevention
- Added comprehensive ObjectId validation
- Added clear comments explaining the difference between `_id` and `car_id`
- Created test scripts to verify the fix

## Future Considerations
- Frontend should consistently send `_id` fields for all ObjectId references
- Consider standardizing ID field naming across the application
- Regular testing of booking flow to catch similar issues early
