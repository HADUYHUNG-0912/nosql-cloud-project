# 📋 Nhật ký Công việc — Dự án NoSQL Cloud

## Thông tin dự án
- **Tên đề tài**: Xây dựng cơ sở dữ liệu NoSQL cho ứng dụng Cloud
- **Đề tài số**: 9 — Quản lý sản phẩm cửa hàng online
- **Công nghệ**: MongoDB Atlas + Node.js/Express + Google Cloud
- **GitHub**: https://github.com/HADUYHUNG-0912/nosql-cloud-project

---

## 📅 Ngày 05/08/2026 — Buổi làm việc đầu tiên

### ✅ 1. Khởi tạo & Cấu hình Dự án
- Đọc và phân tích toàn bộ cấu trúc dự án (Backend + Frontend + Docs).
- Tạo file `.env` cho backend với thông tin kết nối MongoDB Atlas thực tế:
  - Cluster: `cluster0.xygxnwy.mongodb.net`
  - Database: `shopdb`
  - Region: Asia-Southeast1 (Singapore)
- Cài đặt dependencies backend (`npm install`): express, mongoose, cors, dotenv, nodemon.

### ✅ 2. Kết nối MongoDB Atlas thành công
- **Vấn đề gặp phải**: Lỗi `querySrv ECONNREFUSED` khi kết nối Atlas từ Windows.
- **Nguyên nhân**: DNS của ISP (Viettel) không phân giải được bản ghi SRV của MongoDB.
- **Giải pháp**: Thêm `dns.setServers(["8.8.8.8", "8.8.4.4"])` và `dns.setDefaultResultOrder("ipv4first")` vào file `backend/config/db.js`.
- **Kết quả**: Kết nối thành công `✅ Kết nối MongoDB Atlas thành công`.

### ✅ 3. Nạp Dữ liệu mẫu (Seed Data)
- Chạy `node seed.js` để thêm 4 sản phẩm mẫu vào collection `products` trên Atlas:
  1. **Áo thun cotton** — Thời trang — 150.000đ — `{size, color, material}`
  2. **Laptop Dell XPS 13** — Điện tử — 25.000.000đ — `{cpu, ram, storage}`
  3. **Bình giữ nhiệt 500ml** — Gia dụng — 199.000đ — `{capacity, color}`
  4. **Tai nghe Bluetooth** — Điện tử — 890.000đ — `{battery, connectivity}`

### ✅ 4. Chạy Backend Server Local
- Backend chạy thành công tại `http://localhost:5000`.
- Đã kiểm tra tất cả 6 API Endpoints hoạt động đúng:
  - `GET /api/products` — Lấy danh sách + phân trang
  - `GET /api/products/:id` — Lấy 1 sản phẩm
  - `POST /api/products` — Tạo mới
  - `PUT /api/products/:id` — Cập nhật
  - `DELETE /api/products/:id` — Xóa
  - `GET /api/products/stats/category` — Aggregation Pipeline

### ✅ 5. Đẩy Code lên GitHub
- Khởi tạo Git repository: `git init`.
- Commit đầu tiên với 18 files (không bao gồm `.env` và `node_modules` — bảo mật).
- Tạo repository GitHub: https://github.com/HADUYHUNG-0912/nosql-cloud-project
- Push thành công lên branch `main`.

### ✅ 6. Nâng cấp Giao diện Frontend (Google Cloud Console Theme)
**Đã thiết kế lại hoàn toàn 3 file Frontend:**

#### `frontend/index.html`
- Sidebar Navigation với 4 section: Dashboard, Sản phẩm CRUD, Thống kê & Biểu đồ, Kiểm thử Truy vấn, So sánh SQL vs NoSQL.
- Top Navigation bar theo phong cách Google Cloud Console.
- 4 KPI Cards: Tổng sản phẩm, Danh mục, Giá trung bình, Hàng sắp hết.
- Modal xác nhận trước khi xóa sản phẩm.
- Toast notifications thay thế `alert()`.
- Breadcrumb navigation.

#### `frontend/style.css`
- Màu sắc chuẩn Google Cloud: Blue `#1a73e8`, Red `#d93025`, Green `#188038`, Yellow `#f9ab00`.
- Dark sidebar `#202124` giống Google Cloud Console.
- Loading skeleton animation khi tải dữ liệu.
- Responsive: ẩn sidebar trên màn hình nhỏ.
- Card hover effects và micro-animations.

#### `frontend/app.js`
- **Dynamic Attribute Builder**: Thêm thuộc tính bằng nút `[+ Thêm thuộc tính]` thay vì nhập JSON thủ công.
- **Chart.js Integration**: 
  - Doughnut chart phân bổ danh mục (Dashboard).
  - Bar chart số lượng sản phẩm theo danh mục.
  - Bar chart giá trung bình theo danh mục.
- **Query Benchmark**: Đo tốc độ (ms) 4 loại truy vấn khác nhau.
- **Cảnh báo tồn kho thấp**: Badge đỏ khi `stock < 10`.
- **Filter & debounce**: Lọc danh mục realtime, không spam request.
- **Connection status indicator**: Hiển thị trạng thái kết nối Atlas realtime.

### 🔄 7. Thử nghiệm Deploy lên Google Cloud Run
- Cài Google Cloud CLI (SDK 579.0.0).
- Đăng nhập thành công với tài khoản `haduyhung0912@gmail.com`.
- **Vấn đề gặp phải**: Tất cả 4 GCP Project chưa kích hoạt Billing Account.
- **Giải pháp**: Cần vào [console.cloud.google.com/billing](https://console.cloud.google.com/billing) để kích hoạt (sẽ thực hiện ngày hôm sau).

---

## 📋 Danh sách Công việc Còn lại

### 🔴 Ưu tiên cao (Ngày mai)
- [ ] Kích hoạt Billing Account trên Google Cloud Console.
- [ ] Deploy Backend lên Google Cloud Run (`gcloud run deploy nosql-backend --source .`).
- [ ] Cập nhật `API_URL` trong `frontend/app.js` sang URL Cloud Run.
- [ ] Deploy Frontend lên Vercel (liên kết với GitHub repo, auto-deploy).

### 🟡 Ưu tiên trung bình
- [ ] Bổ sung endpoint truy vấn theo thuộc tính động: `GET /api/products?attr_key=size&attr_val=M`.
- [ ] Commit và push phiên bản giao diện mới lên GitHub.
- [ ] Chụp ảnh màn hình MongoDB Atlas Dashboard để làm ảnh minh chứng cho báo cáo.
- [ ] Chụp ảnh màn hình giao diện web (Dashboard, CRUD, Biểu đồ, Benchmark).

### 🟢 Tài liệu & Báo cáo
- [ ] Viết khung Báo cáo Word (15–25 trang) dựa trên template.
- [ ] Tạo Slide thuyết trình (25–40 slide).
- [ ] Quay video demo ứng dụng sau khi deploy xong.
- [ ] Cập nhật `docs/task-division.md` với mức độ đóng góp thực tế.

---

## 📊 Tổng kết tiến độ hôm nay

| Hạng mục | Tình trạng |
|---|---|
| Kết nối MongoDB Atlas | ✅ Hoàn thành |
| Seed dữ liệu mẫu (4 sản phẩm) | ✅ Hoàn thành |
| Backend API (6 endpoints) | ✅ Hoàn thành |
| Giao diện Frontend nâng cấp | ✅ Hoàn thành |
| Push GitHub | ✅ Hoàn thành |
| Google Cloud CLI cài & đăng nhập | ✅ Hoàn thành |
| Deploy Cloud Run | ⏳ Chờ Billing |
| Deploy Frontend Vercel | ⏳ Ngày mai |
| Báo cáo & Slide | ⏳ Chưa bắt đầu |

---

*Nhật ký được tạo tự động lúc 23:05 ngày 05/08/2026*
