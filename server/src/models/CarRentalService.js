const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const carRentalServiceSchema = new mongoose.Schema({
  car_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  business_partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessPartner',
    required: true
  },
  car_rental_status: {
    type: Boolean,
    required: true
  },
  type_driver: {
    type: String,
    required: true,
    maxlength: 6
  }
}, {
  timestamps: true
});

carRentalServiceSchema.plugin(AutoIncrement, { inc_field: 'car_rental_service_id' });

// Middleware để đồng bộ car status sau khi save
carRentalServiceSchema.post('save', async function(doc) {
  try {
    const { updateCarStatusBasedOnRentals } = require('../utils/carStatusSync');
    await updateCarStatusBasedOnRentals(doc.car_id);
  } catch (error) {
    console.error('Error syncing car status after save:', error);
  }
});

// Middleware để đồng bộ car status sau khi update
carRentalServiceSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    try {
      const { updateCarStatusBasedOnRentals } = require('../utils/carStatusSync');
      await updateCarStatusBasedOnRentals(doc.car_id);
    } catch (error) {
      console.error('Error syncing car status after update:', error);
    }
  }
});

// Middleware để đồng bộ car status sau khi delete
carRentalServiceSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      const { updateCarStatusBasedOnRentals } = require('../utils/carStatusSync');
      await updateCarStatusBasedOnRentals(doc.car_id);
    } catch (error) {
      console.error('Error syncing car status after delete:', error);
    }
  }
});

// Middleware để đồng bộ car status sau khi updateMany
carRentalServiceSchema.post('updateMany', async function() {
  try {
    console.log('UpdateMany detected, running full sync...');
    const { syncAllCarStatuses } = require('../utils/carStatusSync');
    await syncAllCarStatuses();
  } catch (error) {
    console.error('Error syncing car status after updateMany:', error);
  }
});

// Middleware để đồng bộ car status sau khi deleteMany
carRentalServiceSchema.post('deleteMany', async function() {
  try {
    console.log('DeleteMany detected, running full sync...');
    const { syncAllCarStatuses } = require('../utils/carStatusSync');
    await syncAllCarStatuses();
  } catch (error) {
    console.error('Error syncing car status after deleteMany:', error);
  }
});

module.exports = mongoose.model('CarRentalService', carRentalServiceSchema);
