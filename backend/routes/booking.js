const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

//예약 생성
router.post("/", async (req, res) => {
  try {
    const { roomId, date, slots } = req.body;
    const newBooking = new Booking({ roomId, date, slots });
    await newBooking.save();
    res
      .status(201)
      .json({ message: "성공적으로 예약됐습니다.", data: newBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
