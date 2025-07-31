const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  start: Date,
  end: Date,
  title: String,
  user: String,
});

const roomSchema = new mongoose.Schema(
  {
    roomId: Number,
    name: String,
    description: String,
    capa: Number,
    reservations: [reservationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
