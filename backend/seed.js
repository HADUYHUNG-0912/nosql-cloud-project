// Script tạo dữ liệu mẫu để test nhanh.
// Chạy: node seed.js  (đảm bảo đã cấu hình .env trước)
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");

const sampleProducts = [
  {
    name: "Áo thun cotton",
    category: "Thời trang",
    price: 150000,
    stock: 50,
    description: "Áo thun cotton co giãn, thoáng mát",
    attributes: { size: "M", color: "Đen", material: "Cotton" },
  },
  {
    name: "Laptop Dell XPS 13",
    category: "Điện tử",
    price: 25000000,
    stock: 5,
    description: "Laptop mỏng nhẹ, hiệu năng cao",
    attributes: { cpu: "Intel i5-1240P", ram: "16GB", storage: "512GB SSD" },
  },
  {
    name: "Bình giữ nhiệt 500ml",
    category: "Gia dụng",
    price: 199000,
    stock: 100,
    description: "Giữ nhiệt 12 giờ, chất liệu inox 304",
    attributes: { capacity: "500ml", color: "Trắng" },
  },
  {
    name: "Tai nghe Bluetooth",
    category: "Điện tử",
    price: 890000,
    stock: 30,
    description: "Chống ồn chủ động, pin 24 giờ",
    attributes: { battery: "24h", connectivity: "Bluetooth 5.3" },
  },
];

(async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log(`✅ Đã thêm ${sampleProducts.length} sản phẩm mẫu`);
  await mongoose.disconnect();
  process.exit(0);
})();
