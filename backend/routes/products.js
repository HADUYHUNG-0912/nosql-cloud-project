const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products  -> lấy danh sách, hỗ trợ filter theo category + phân trang
router.get("/", async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const filter = category ? { category } : {};

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({ total, page: Number(page), limit: Number(limit), data: products });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// GET /api/products/stats/category -> thống kê theo category (Aggregation Pipeline)
// Minh chứng khả năng truy vấn/thống kê nâng cao của NoSQL
router.get("/stats/category", async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          totalStock: { $sum: "$stock" },
        },
      },
      { $sort: { totalProducts: -1 } },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// GET /api/products/search/attributes?attr_key=size&attr_val=M&category=Thời trang
// -> Tìm kiếm sản phẩm theo thuộc tính động trong trường `attributes`
// Đây là minh chứng nổi bật của NoSQL: truy vấn vào các trường lồng nhau (nested field)
// mà không cần biết trước cấu trúc schema — điều không thể làm dễ dàng với SQL.
router.get("/search/attributes", async (req, res) => {
  try {
    const { attr_key, attr_val, category, page = 1, limit = 20 } = req.query;

    // Bắt buộc phải có cả attr_key và attr_val
    if (!attr_key || !attr_val) {
      return res.status(400).json({
        message: "Thiếu tham số. Cần cung cấp cả attr_key và attr_val.",
        example: "/api/products/search/attributes?attr_key=size&attr_val=M",
      });
    }

    // Dùng dot-notation để query vào object lồng nhau: { "attributes.size": "M" }
    const filter = { [`attributes.${attr_key}`]: attr_val };

    // Hỗ trợ kết hợp với filter theo category
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      query: { attr_key, attr_val, ...(category && { category }) },
      data: products,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// GET /api/products/:id -> lấy 1 sản phẩm
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "ID không hợp lệ", error: err.message });
  }
});

// POST /api/products -> tạo sản phẩm mới
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Dữ liệu không hợp lệ", error: err.message });
  }
});

// PUT /api/products/:id -> cập nhật sản phẩm
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Dữ liệu không hợp lệ", error: err.message });
  }
});

// DELETE /api/products/:id -> xóa sản phẩm
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa sản phẩm", data: deleted });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
