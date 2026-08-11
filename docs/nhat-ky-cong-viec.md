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
- **Cảnh báo tồn kho thấp**: Badge đỏ khi `stock < 10` (ngưỡng `[0, 10)`).
- **Filter & debounce**: Lọc danh mục realtime, không spam request.
- **Connection status indicator**: Hiển thị trạng thái kết nối Atlas realtime.

### 🔄 7. Thử nghiệm Deploy lên Google Cloud Run
- Cài Google Cloud CLI (SDK 579.0.0).
- Đăng nhập thành công với tài khoản `haduyhung0912@gmail.com`.
- **Vấn đề gặp phải**: Tất cả 4 GCP Project chưa kích hoạt Billing Account.
- **Giải pháp**: Cần vào [console.cloud.google.com/billing](https://console.cloud.google.com/billing) để kích hoạt (sẽ thực hiện ngày hôm sau).

---

---

## 📅 Ngày 06/08/2026 — Deploy lên Cloud hoàn chỉnh

### ✅ 1. Deploy Frontend lên Vercel
- Đăng nhập Vercel bằng tài khoản GitHub.
- Import repo `HADUYHUNG-0912/nosql-cloud-project`.
- Cấu hình Root Directory: `nosql-cloud-project/frontend`.
- **Kết quả**: Frontend live tại `https://nosql-cloud-project-nxnu.vercel.app`
- Vercel tự động redeploy mỗi khi `git push` lên GitHub.

### ✅ 2. Deploy Backend lên Render.com
- Tạo file `render.yaml` để cấu hình tự động.
- **Vấn đề gặp phải**: Root Directory bị sai (`nosql-cloud-project/backend` thay vì `backend`), và có dấu cách thừa `"backend "`.
- **Giải pháp**: Sửa lại trong Render Settings → Root Directory = `backend`.
- **Kết quả**: Backend live tại `https://nosql-backend-nogv.onrender.com`

### ✅ 3. Kết nối Frontend ↔ Backend trên Cloud
- Cập nhật `API_URL` trong `frontend/app.js` từ `localhost:5000` sang `https://nosql-backend-nogv.onrender.com/api/products`.
- Push lên GitHub → Vercel tự động redeploy trong 30 giây.
- **Kết quả**: Hệ thống hoàn chỉnh 100% trên Cloud, không cần máy local.

### 🏗️ Kiến trúc hệ thống hoàn chỉnh (sau hôm nay)

```
Người dùng (Browser)
        ↓ mở URL
🌐 Vercel (Frontend) — nosql-cloud-project-nxnu.vercel.app
   HTML + CSS + JS — giao diện Google Cloud Console theme
        ↓ gọi API fetch() qua HTTPS
⚙️ Render (Backend) — nosql-backend-nogv.onrender.com
   Node.js + Express — REST API CRUD (6 endpoints)
        ↓ kết nối mongoose+srv://
🍃 MongoDB Atlas (Database) — cluster0.xygxnwy.mongodb.net
   Collection: products — Dữ liệu sản phẩm schema-less
```

**Đây là kiến trúc Cloud-Native 3 tầng hoàn chỉnh:**
- **Frontend**: Vercel (CDN toàn cầu, free, auto-deploy từ GitHub)
- **Backend**: Render (Serverless Node.js, free tier 750h/tháng)
- **Database**: MongoDB Atlas (DBaaS, M0 Free, Google Cloud Singapore)

### ⚠️ Lưu ý khi Demo cho thầy cô
- Render Free Tier **sleep sau 15 phút không có request** → lần đầu gọi API sẽ chờ ~50 giây.
- **Giải pháp**: Mở URL `https://nosql-backend-nogv.onrender.com` trước 2 phút khi bắt đầu demo.

---

## 📅 Ngày 11/08/2026 — Bổ sung API truy vấn thuộc tính động

### ✅ 1. Thêm Endpoint Tìm kiếm theo Thuộc tính Động
- Bổ sung route `GET /api/products/search/attributes` vào file `backend/routes/products.js`.
- **Cơ chế**: Dùng MongoDB **dot-notation** (`attributes.<key>`) để query vào trường `Mixed` lồng nhau — đây là minh chứng rõ nhất cho sức mạnh NoSQL so với SQL (không cần `ALTER TABLE`, không cần biết trước cấu trúc).
- **Tính năng**:
  - Tham số bắt buộc: `attr_key` (tên thuộc tính) + `attr_val` (giá trị cần tìm).
  - Tham số tùy chọn: `category` (lọc kết hợp), `page`, `limit` (phân trang).
  - Trả về 400 nếu thiếu tham số, kèm ví dụ sử dụng.
- **Ví dụ truy vấn thực tế**:
  - `GET /api/products/search/attributes?attr_key=size&attr_val=M` → Tìm áo thun size M.
  - `GET /api/products/search/attributes?attr_key=ram&attr_val=16GB` → Tìm laptop 16GB RAM.
  - `GET /api/products/search/attributes?attr_key=color&attr_val=Đen&category=Thời trang` → Kết hợp filter.

---

## 📋 Danh sách Công việc Còn lại

### 🟡 Ưu tiên trung bình
- [x] ~~Bổ sung endpoint truy vấn theo thuộc tính động~~ → **Hoàn thành**: `GET /api/products/search/attributes?attr_key=size&attr_val=M` (thêm vào `routes/products.js` ngày 11/08/2026).
- [ ] Chụp ảnh màn hình MongoDB Atlas Dashboard để làm ảnh minh chứng cho báo cáo.
- [ ] Chụp ảnh màn hình giao diện web (Dashboard, CRUD, Biểu đồ, Benchmark, SQL vs NoSQL).
- [ ] Chụp ảnh màn hình Vercel + Render Dashboard (minh chứng deploy thành công).
- [ ] Chụp ảnh màn hình Render Logs (minh chứng backend đang chạy trên cloud).

### 🟢 Tài liệu & Báo cáo
- [ ] Viết khung Báo cáo Word (15–25 trang) dựa trên template.
- [ ] Tạo Slide thuyết trình (25–40 slide).
- [ ] Quay video demo ứng dụng chạy trên Vercel URL.
- [ ] Cập nhật `docs/task-division.md` với mức độ đóng góp thực tế.

---

## 📊 Tổng kết tiến độ (cập nhật ngày 06/08/2026)

| Hạng mục | Tình trạng |
|---|---|
| Kết nối MongoDB Atlas | ✅ Hoàn thành |
| Seed dữ liệu mẫu (4 sản phẩm) | ✅ Hoàn thành |
| Backend API (6 endpoints) | ✅ Hoàn thành |
| Giao diện Frontend nâng cấp (Google Cloud theme) | ✅ Hoàn thành |
| Dynamic Attribute Builder + Chart.js | ✅ Hoàn thành |
| Query Benchmark section | ✅ Hoàn thành |
| SQL vs NoSQL comparison page | ✅ Hoàn thành |
| Push GitHub | ✅ Hoàn thành |
| Deploy Frontend → Vercel | ✅ Live: nosql-cloud-project-nxnu.vercel.app |
| Deploy Backend → Render | ✅ Live: nosql-backend-nogv.onrender.com |
| Hệ thống Cloud hoàn chỉnh | ✅ **100% Online** |
| Chụp ảnh minh chứng | ⏳ Chưa làm |
| Báo cáo & Slide | ⏳ Chưa bắt đầu |
| Video Demo | ⏳ Chưa làm |

---

## 🔗 Link tổng hợp dự án

| Dịch vụ | URL |
|---|---|
| **Frontend (Vercel)** | https://nosql-cloud-project-nxnu.vercel.app |
| **Backend API (Render)** | https://nosql-backend-nogv.onrender.com |
| **Source Code (GitHub)** | https://github.com/HADUYHUNG-0912/nosql-cloud-project |
| **Database (Atlas)** | cluster0.xygxnwy.mongodb.net / shopdb |

---

*Nhật ký cập nhật lúc 10:00 ngày 06/08/2026*

---

## 🕒 Lịch sử Thay đổi (Changelog)

| Phiên bản | Ngày cập nhật | Người cập nhật | Nội dung tóm tắt |
|:---:|:---:|:---:|---|
| v1.3 | 11/08/2026 | Antigravity Agent | - Đổi ô lọc danh mục thành Select Box.<br>- Tạo API `POST /api/products/seed-bigdata` bơm 50.000 data.<br>- Thêm Demo "Thảm họa Alter Table" so sánh SQL vs NoSQL. |
| v1.2 | 11/08/2026 | Antigravity Agent | - Bổ sung nhật ký buổi làm việc ngày 11/08/2026.<br>- Đánh dấu hoàn thành endpoint `GET /search/attributes`.<br>- Cập nhật bảng tiến độ. |
| v1.1 | 11/08/2026 | Antigravity Agent | - Cập nhật quy ước ranh giới cho tồn kho `[0, 10)`.<br>- Bổ sung bảng Lịch sử thay đổi theo chuẩn Docs-as-Code. |
| v1.0 | 06/08/2026 | Nhóm dự án | - Khởi tạo tài liệu nhật ký công việc ban đầu. |
