require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
connectDB();

// Health check - dùng để kiểm tra khi deploy Cloud Run
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "NoSQL Cloud API đang chạy" });
});

app.use("/api/products", productRoutes);

// Xử lý route không tồn tại
app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy endpoint" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
