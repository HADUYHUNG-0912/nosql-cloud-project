# Phân công nhóm & Nhật ký công việc (mẫu)

## 1. Bảng phân công vai trò

| Thành viên | Vai trò | Công việc chính | Sản phẩm minh chứng |
|---|---|---|---|
| **Thành viên 1** | Database & Cloud Infra | Tạo & cấu hình MongoDB Atlas cluster (chọn provider Google Cloud); thiết kế schema `Product`; viết Aggregation Pipeline; setup Google Cloud project | Ảnh chụp Atlas dashboard, file `models/Product.js`, `routes/products.js` (phần stats) |
| **Thành viên 2** | Backend Development | Xây REST API CRUD (Express + Mongoose); viết Dockerfile; deploy backend lên Google Cloud Run; test API bằng Postman | File `server.js`, `routes/products.js`, `Dockerfile`; ảnh chụp Cloud Run deploy thành công |
| **Thành viên 3** | Frontend & Báo cáo | Xây UI CRUD (`index.html`, `style.css`, `app.js`); viết test case; quay video demo; tổng hợp viết báo cáo & slide | Frontend hoàn chỉnh, video demo, file báo cáo Word/PDF |

> Lưu ý: 3 thành viên nên cùng tham gia phần "học MongoDB cơ bản" ở tuần 1, và cùng tham gia buổi demo bảo vệ để trả lời câu hỏi.

## 2. Mẫu nhật ký công việc (Weekly Log)

| Tuần | Thành viên 1 | Thành viên 2 | Thành viên 3 |
|---|---|---|---|
| 1 | Tạo tài khoản Atlas, tạo cluster free, học MongoDB CRUD cơ bản | Học Node.js + Express cơ bản | Học HTML/CSS/JS cơ bản, khảo sát UI tham khảo |
| 2 | Thiết kế schema Product, tạo collection mẫu, nhập dữ liệu test | Viết CRUD API, kết nối MongoDB | Dựng khung UI (form + danh sách) |
| 3 | Viết Aggregation Pipeline thống kê | Viết Dockerfile, test deploy Cloud Run | Nối UI với API, test luồng CRUD |
| 4 | Hỗ trợ debug kết nối cloud, thu thập số liệu so sánh SQL/NoSQL | Deploy chính thức backend lên Cloud Run | Hoàn thiện UI, viết test case |
| 5 | Viết phần "Cơ sở lý thuyết" trong báo cáo | Viết phần "Kiến trúc hệ thống & triển khai" | Viết phần còn lại của báo cáo, làm slide, quay video demo |

*(Nhóm điều chỉnh nội dung cụ thể theo tiến độ thực tế và ghi % đóng góp của mỗi thành viên trước khi nộp.)*

## 3. Mức độ đóng góp (điền khi nộp bài)

| Thành viên | % đóng góp | Nhận xét |
|---|---|---|
| Thành viên 1 | ___% | |
| Thành viên 2 | ___% | |
| Thành viên 3 | ___% | |
