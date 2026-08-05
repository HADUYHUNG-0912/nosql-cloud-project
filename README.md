# Xây dựng cơ sở dữ liệu NoSQL cho ứng dụng Cloud
### Đề tài 9 — Quản lý sản phẩm cửa hàng online (MongoDB Atlas + Google Cloud)

## 1. Mục tiêu
Xây dựng ứng dụng CRUD quản lý sản phẩm sử dụng cơ sở dữ liệu NoSQL (MongoDB Atlas),
triển khai trên hạ tầng Google Cloud, minh chứng tính linh hoạt của mô hình NoSQL
(schema-less) so với mô hình quan hệ (SQL) truyền thống.

## 2. Kiến trúc hệ thống

```
┌─────────────┐      HTTPS       ┌──────────────────────┐      mongodb+srv://      ┌────────────────────┐
│  Frontend   │ ───────────────▶ │   Backend API         │ ───────────────────────▶ │  MongoDB Atlas      │
│  (HTML/JS)  │ ◀─────────────── │   Node.js + Express    │ ◀─────────────────────── │  (Cluster host      │
│  Cloud      │      JSON        │   Google Cloud Run     │        JSON              │   trên Google Cloud) │
│  Storage/   │                  └──────────────────────┘                          └────────────────────┘
│  Firebase   │
└─────────────┘
```

- **Frontend**: HTML/CSS/JS thuần, gọi API bằng `fetch`. Deploy bằng Firebase Hosting hoặc Cloud Storage static website.
- **Backend**: Node.js + Express, cung cấp REST API CRUD. Đóng gói Docker, deploy trên **Google Cloud Run**.
- **Database**: MongoDB Atlas, cluster M0 Free Tier, chọn provider = **Google Cloud**, region gần Việt Nam (Singapore).

## 3. Cấu trúc thư mục

```
nosql-cloud-project/
├── backend/                # REST API (Node.js + Express + MongoDB)
│   ├── config/db.js        # Kết nối MongoDB Atlas
│   ├── models/Product.js   # Schema sản phẩm (Mongoose)
│   ├── routes/products.js  # Các endpoint CRUD + query nâng cao
│   ├── server.js           # Điểm khởi chạy server
│   ├── package.json
│   ├── Dockerfile          # Đóng gói cho Cloud Run
│   └── .env.example
├── frontend/                # UI đơn giản để test CRUD
│   ├── index.html
│   ├── style.css
│   └── app.js
├── docs/                    # Tài liệu hỗ trợ viết báo cáo
│   ├── architecture.md
│   ├── sql-vs-nosql-comparison.md
│   └── task-division.md
└── README.md                 # File này
```

## 4. Hướng dẫn chạy dự án (local)

### Bước 1 — Tạo MongoDB Atlas cluster
1. Đăng ký tại https://cloud.mongodb.com
2. Build a Database → Free (M0) → Provider: **Google Cloud** → Region: `asia-southeast1 (Singapore)`
3. Database Access → tạo user/password
4. Network Access → Add IP `0.0.0.0/0` (cho môi trường học tập)
5. Connect → lấy connection string dạng:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/shopdb`

### Bước 2 — Cài & chạy Backend
```bash
cd backend
cp .env.example .env      # điền MONGO_URI vào .env
npm install
npm run dev                # chạy ở http://localhost:5000
```

### Bước 3 — Chạy Frontend
```bash
cd frontend
# chỉ cần mở index.html bằng trình duyệt, hoặc dùng extension Live Server
```
Nếu backend chạy ở cổng khác, sửa biến `API_URL` trong `frontend/app.js`.

## 5. Deploy lên Google Cloud Run

```bash
cd backend
gcloud auth login
gcloud config set project <TEN_PROJECT_GCP>

# Build & deploy trực tiếp bằng source (Cloud Build tự build Docker image)
gcloud run deploy nosql-backend \
  --source . \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars MONGO_URI="<connection_string_atlas>"
```
Sau khi deploy xong, Cloud Run trả về 1 URL public — cập nhật URL đó vào `API_URL` trong `frontend/app.js`.

## 6. API Endpoints

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/api/products` | Lấy danh sách sản phẩm (hỗ trợ filter, phân trang) |
| GET | `/api/products/:id` | Lấy 1 sản phẩm theo ID |
| POST | `/api/products` | Tạo sản phẩm mới |
| PUT | `/api/products/:id` | Cập nhật sản phẩm |
| DELETE | `/api/products/:id` | Xóa sản phẩm |
| GET | `/api/products/stats/category` | Thống kê số lượng & giá trung bình theo category (dùng Aggregation Pipeline — minh chứng sức mạnh truy vấn NoSQL) |

## 7. Điểm nhấn để viết báo cáo
- **Tính linh hoạt schema**: mỗi sản phẩm có thể có các thuộc tính (`attributes`) khác nhau hoàn toàn (áo có `size`, `color`; laptop có `cpu`, `ram`) mà không cần sửa cấu trúc bảng — đây là điểm khác biệt lớn nhất so với SQL.
- **Aggregation Pipeline**: minh chứng khả năng truy vấn/thống kê phức tạp ngay trên dữ liệu phi cấu trúc.
- **Kiến trúc multi-service**: Atlas (DBaaS độc lập) + Google Cloud Run (compute) — thể hiện hiểu biết về cloud-native architecture.
- Xem thêm `docs/sql-vs-nosql-comparison.md` để lấy nội dung so sánh cho báo cáo.

## 8. Phân công nhóm
Xem chi tiết tại `docs/task-division.md`.
