const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

router.post("/", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });

    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 틀렸습니다." });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        userName: user.userName,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "로그인 성공",
      token,
      user: {
        userId: user.userId,
        name: user.name,
        userName: user.userName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
