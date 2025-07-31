const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  slots: {
    type: [Number],
    required: true,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
