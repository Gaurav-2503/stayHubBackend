const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, require: true , ref:'Place' },
  user : {type: mongoose.Schema.Types.ObjectId , required:true},
  checkIn: { type: Date, require: true },
  checkOut: { type: Date, require: true},
  nameOfUser: { type: String, require: true },
  phone: { type: String, require: true },
  numGuests: { type: Number, require: true },
  price: { type: Number, require: true },
});

const BookingModel = mongoose.model('Booking' , BookingSchema);

module.exports = BookingModel