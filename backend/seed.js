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
  {
    name: "Sách Đắc Nhân Tâm",
    category: "Sách",
    price: 85000,
    stock: 120,
    description: "Sách kỹ năng sống bán chạy nhất",
    attributes: { author: "Dale Carnegie", pages: 320, language: "Tiếng Việt" },
  },
  {
    name: "Sách Clean Code",
    category: "Sách",
    price: 350000,
    stock: 15,
    description: "Sách kinh điển cho lập trình viên",
    attributes: { author: "Robert C. Martin", language: "English", topic: "Programming" },
  },
  {
    name: "Giày Thể Thao Nike Air Force 1",
    category: "Thời trang",
    price: 2500000,
    stock: 40,
    description: "Giày sneaker thời trang, bền bỉ",
    attributes: { size: "42", color: "Trắng", brand: "Nike" },
  },
  {
    name: "Quần Jeans Levi's 501",
    category: "Thời trang",
    price: 1200000,
    stock: 60,
    description: "Quần ống đứng cổ điển",
    attributes: { waist: 32, length: 30, color: "Xanh Đậm" },
  },
  {
    name: "Tủ Lạnh Inverter Samsung 208L",
    category: "Gia dụng",
    price: 5490000,
    stock: 8,
    description: "Tiết kiệm điện, làm lạnh nhanh",
    attributes: { volume: "208L", type: "Inverter", warranty: "2 năm" },
  },
  {
    name: "Lò vi sóng Sharp 20L",
    category: "Gia dụng",
    price: 1350000,
    stock: 25,
    description: "Hâm nóng, rã đông tiện lợi",
    attributes: { power: "800W", capacity: "20L", timer: "35 phút" },
  },
  {
    name: "Bàn Phím Cơ Keychron K2",
    category: "Điện tử",
    price: 1850000,
    stock: 50,
    description: "Bàn phím cơ không dây, LED RGB",
    attributes: { switch: "Brown", connection: "Wireless/Wired", layout: "75%" },
  },
  {
    name: "Chuột Không Dây Logitech MX Master 3S",
    category: "Điện tử",
    price: 2400000,
    stock: 35,
    description: "Chuột công thái học cao cấp",
    attributes: { dpi: 8000, buttons: 7, connection: "Bluetooth/USB" },
  },
  {
    name: "Màn hình Dell UltraSharp U2723QE",
    category: "Điện tử",
    price: 13500000,
    stock: 12,
    description: "Màn hình 4K 27 inch chuẩn màu đồ họa",
    attributes: { resolution: "4K", size: "27 inch", panel: "IPS Black" },
  },
  {
    name: "Nồi Chiên Không Dầu Philips",
    category: "Gia dụng",
    price: 2100000,
    stock: 18,
    description: "Công nghệ Rapid Air, giảm 90% dầu mỡ",
    attributes: { capacity: "4.1L", power: "1400W" },
  },
  {
    name: "Balo Du Lịch The North Face",
    category: "Thời trang",
    price: 850000,
    stock: 45,
    description: "Chống nước, nhiều ngăn chứa đồ",
    attributes: { capacity: "30L", waterproof: true, color: "Đen" },
  },
  {
    name: "Đồng Hồ Thông Minh Apple Watch SE",
    category: "Điện tử",
    price: 6500000,
    stock: 22,
    description: "Đồng hồ thông minh theo dõi sức khỏe",
    attributes: { size: "40mm", color: "Midnight", gps: true },
  },
  {
    name: "Áo Khoác Gió Chống Nước",
    category: "Thời trang",
    price: 350000,
    stock: 80,
    description: "Gọn nhẹ, chống gió và mưa nhẹ",
    attributes: { size: "L", color: "Xanh Navy", material: "Nylon" },
  },
  {
    name: "Máy Lọc Không Khí Xiaomi",
    category: "Gia dụng",
    price: 3200000,
    stock: 15,
    description: "Lọc bụi mịn PM2.5, khử mùi",
    attributes: { coverage: "45m2", filter: "HEPA", smart_control: true },
  },
  {
    name: "Tai Nghe Có Dây Sony MDR",
    category: "Điện tử",
    price: 450000,
    stock: 100,
    description: "Âm thanh Extra Bass",
    attributes: { type: "In-ear", mic: true, length: "1.2m" },
  },
  {
    name: "Bàn Làm Việc Gỗ Sồi",
    category: "Nội thất",
    price: 2500000,
    stock: 5,
    description: "Bàn làm việc phong cách tối giản",
    attributes: { width: "120cm", depth: "60cm", material: "Gỗ tự nhiên" },
  },
  {
    name: "Ghế Công Thái Học Ergonomic",
    category: "Nội thất",
    price: 3800000,
    stock: 20,
    description: "Hỗ trợ cột sống, chống đau lưng",
    attributes: { material: "Lưới", max_weight: "120kg", tilt: "135 độ" },
  },
  {
    name: "Đèn Bàn LED Chống Cận",
    category: "Gia dụng",
    price: 450000,
    stock: 60,
    description: "Tùy chỉnh 3 chế độ sáng, chống mỏi mắt",
    attributes: { power: "10W", light_modes: 3, color_temp: "3000K-6000K" },
  },
  {
    name: "Máy Xay Sinh Tố Panasonic",
    category: "Gia dụng",
    price: 950000,
    stock: 25,
    description: "Xay đá nhuyễn, cối thủy tinh",
    attributes: { power: "450W", jar_material: "Thủy tinh", speeds: 2 },
  },
  {
    name: "Sách Cấu Trúc Dữ Liệu Và Giải Thuật",
    category: "Sách",
    price: 150000,
    stock: 50,
    description: "Kiến thức nền tảng CNTT",
    attributes: { author: "Nhiều tác giả", pages: 400, language: "Tiếng Việt" },
  }
];

(async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log(`✅ Đã thêm ${sampleProducts.length} sản phẩm mẫu`);
  await mongoose.disconnect();
  process.exit(0);
})();
