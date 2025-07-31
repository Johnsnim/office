const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패", err));

const roomRoutes = require("./routes/roomRoutes");
const loginRoutes = require("./routes/login");

app.use("/api/rooms", roomRoutes);
app.use("/api/login", loginRoutes);

app.listen(PORT, () => {
  console.log(`서버 실행중 / 포트 => ${PORT}`);
});
