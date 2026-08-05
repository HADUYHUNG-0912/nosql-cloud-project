const mongoose = require("mongoose");

/**
 * Schema sản phẩm.
 * Trường "attributes" dùng kiểu Mixed (Object tự do) để minh chứng
 * tính linh hoạt (schema-less) của NoSQL: mỗi loại sản phẩm có thể
 * lưu các thuộc tính hoàn toàn khác nhau mà không cần thay đổi cấu trúc.
 *
 * Ví dụ:
 *  - Áo thun:  { size: "M", color: "Đen", material: "Cotton" }
 *  - Laptop:   { cpu: "i5-1240P", ram: "16GB", storage: "512GB SSD" }
 */
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, default: "" },
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
