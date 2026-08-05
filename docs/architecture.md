# Kiến trúc hệ thống

## 1. Sơ đồ tổng quan

```
┌────────────────────┐        HTTPS (fetch/JSON)        ┌──────────────────────────┐
│      Frontend        │ ───────────────────────────────▶ │      Backend API           │
│  HTML / CSS / JS      │                                   │  Node.js + Express         │
│  (Firebase Hosting     │ ◀─────────────────────────────── │  chạy trên Google Cloud Run│
│   hoặc Cloud Storage)  │           JSON response          └──────────────────────────┘
└────────────────────┘                                                │
                                                                        │ mongodb+srv://
                                                                        ▼
                                                          ┌──────────────────────────┐
                                                          │     MongoDB Atlas           │
                                                          │  Cluster M0 (Free Tier)     │
                                                          │  Provider: Google Cloud     │
                                                          │  Region: Singapore           │
                                                          └──────────────────────────┘
```

## 2. Giải thích các thành phần

### 2.1 Frontend
- Giao diện web tĩnh (HTML/CSS/JavaScript thuần), không cần framework nặng.
- Gọi trực tiếp REST API của backend bằng `fetch()`.
- Có thể host miễn phí trên Firebase Hosting hoặc Cloud Storage (static website).

### 2.2 Backend (Google Cloud Run)
- Viết bằng Node.js + Express, cung cấp các endpoint REST chuẩn CRUD.
- Đóng gói thành Docker container, deploy lên **Cloud Run** — dịch vụ serverless container của Google Cloud.
- Ưu điểm Cloud Run: tự động scale theo lượng truy cập, chỉ tính phí khi có request, phù hợp cho đồ án môn học (free tier lớn).
- Backend giao tiếp với MongoDB Atlas thông qua chuỗi kết nối `mongodb+srv://`.

### 2.3 Database (MongoDB Atlas)
- Dịch vụ Database-as-a-Service (DBaaS), độc lập với AWS/Azure/GCP nhưng cho phép chọn **cloud provider hạ tầng vật lý**.
- Trong đồ án này, cluster được host trên **Google Cloud**, region Singapore — đồng bộ với backend cũng chạy trên Google Cloud để giảm độ trễ (latency) giữa 2 dịch vụ.
- Sử dụng collection `products` với schema linh hoạt (trường `attributes` kiểu tự do).

## 3. Luồng xử lý một request (ví dụ: thêm sản phẩm)

1. Người dùng điền form trên Frontend → nhấn "Lưu sản phẩm".
2. Frontend gửi `POST /api/products` kèm dữ liệu JSON tới Backend (Cloud Run).
3. Backend validate dữ liệu, gọi Mongoose để insert document vào collection `products` trên Atlas.
4. Atlas lưu document, trả kết quả về Backend.
5. Backend trả JSON response về Frontend.
6. Frontend cập nhật lại danh sách sản phẩm hiển thị.

## 4. Vì sao kiến trúc này phù hợp với đề tài "ứng dụng cloud"

- Toàn bộ hệ thống không cần quản lý server vật lý (serverless database + serverless compute).
- Có thể scale tự động khi lượng truy cập tăng (Cloud Run tự thêm instance, Atlas hỗ trợ scale cluster).
- Minh chứng rõ khái niệm **DBaaS** (Database as a Service) — một mô hình phổ biến trong điện toán đám mây hiện đại.
