const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

//전체 조회
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "서버 에러" });
  }
});

//개별 조회(roomId)
router.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findOne({ roomId: Number(roomId) });
    if (!room)
      return res.status(404).json({ error: "회의실을 찾을 수 없습니다." });

    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "서버 에러" });
  }
});

//회의실 예약
router.post("/:roomId/reserve", async (req, res) => {
  const { roomId } = req.params;
  const { start, end, title, user } = req.body;

  try {
    const room = await Room.findOne({ roomId: Number(roomId) });
    if (!room) return res.status(404).json({ message: "Room not found" });

    room.reservations.push({ start, end, title, user });
    await room.save();

    res.status(200).json({ message: "Reservation added" });
  } catch (error) {
    console.error("Reservation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//회의실 삭제
router.delete("/:roomId/reservations/:reservationId", async (req, res) => {
  const { roomId, reservationId } = req.params;

  try {
    const room = await Room.findOne({ roomId: parseInt(roomId) });
    if (!room)
      return res.status(404).json({ message: "회의실을 찾을 수 없습니다." });

    room.reservations = room.reservations.filter(
      (resv) => resv._id.toString() !== reservationId
    );

    await room.save();
    res.json({ message: "예약 삭제 성공" });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
