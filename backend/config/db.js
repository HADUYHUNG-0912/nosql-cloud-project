const mongoose = require("mongoose");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // ignore if unable to set
}

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("Chưa cấu hình MONGO_URI trong file .env");
    }
    await mongoose.connect(uri);
    console.log("✅ Kết nối MongoDB Atlas thành công");
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
