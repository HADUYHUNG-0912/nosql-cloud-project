# So sánh NoSQL (MongoDB) và SQL truyền thống

## 1. So sánh mô hình dữ liệu

**Nếu dùng SQL (ví dụ MySQL/PostgreSQL)**, bảng `products` sẽ cần cấu trúc cột cố định:

```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  description TEXT
);
```

**Vấn đề**: sản phẩm "Áo thun" cần thêm `size`, `color`, `material`; nhưng sản phẩm "Laptop" cần `cpu`, `ram`, `storage`.
Với SQL, phải chọn 1 trong 2 cách xử lý — cả hai đều không tối ưu:
- **Cách 1**: thêm cột cho tất cả thuộc tính có thể có (`size`, `color`, `cpu`, `ram`...) → dư thừa NULL rất nhiều, khó mở rộng khi có sản phẩm loại mới.
- **Cách 2**: tách thêm bảng `product_attributes` (EAV pattern: entity-attribute-value) → truy vấn phải JOIN nhiều bảng, phức tạp và chậm hơn.

**Với NoSQL (MongoDB)**, mỗi document lưu đúng những gì sản phẩm đó cần:

```json
{
  "name": "Áo thun cotton",
  "category": "Thời trang",
  "price": 150000,
  "stock": 50,
  "attributes": { "size": "M", "color": "Đen", "material": "Cotton" }
}
```

```json
{
  "name": "Laptop Dell XPS 13",
  "category": "Điện tử",
  "price": 25000000,
  "stock": 5,
  "attributes": { "cpu": "i5-1240P", "ram": "16GB", "storage": "512GB SSD" }
}
```

→ Không cần định nghĩa trước schema cứng, không có cột trống, dễ mở rộng khi thêm loại sản phẩm mới.

## 2. Bảng so sánh tổng quan

| Tiêu chí | SQL (Quan hệ) | NoSQL (MongoDB) |
|---|---|---|
| Cấu trúc dữ liệu | Cố định (schema chặt) | Linh hoạt (schema-less) |
| Quan hệ dữ liệu | Chuẩn hóa, dùng JOIN | Nhúng (embed) hoặc tham chiếu, ít cần JOIN |
| Khả năng mở rộng (scale) | Chủ yếu scale-up (nâng cấp máy chủ) | Dễ scale-out (sharding trên nhiều node) |
| Tốc độ đọc/viết dữ liệu phi cấu trúc | Chậm hơn, cần JOIN nhiều bảng | Nhanh hơn vì dữ liệu liên quan nằm cùng 1 document |
| Tính toàn vẹn (ACID) | Mạnh, hỗ trợ transaction phức tạp | Hỗ trợ transaction nhưng thường ưu tiên tính sẵn sàng |
| Phù hợp với | Dữ liệu có cấu trúc rõ, ít thay đổi (kế toán, ngân hàng) | Dữ liệu thay đổi nhanh, đa dạng (catalog sản phẩm, log, IoT) |
| Ví dụ hệ quản trị | MySQL, PostgreSQL, SQL Server | MongoDB, Firebase Firestore, CouchDB |

## 3. Kết luận cho đề tài này

Bài toán quản lý sản phẩm cửa hàng online có đặc điểm:
- Nhiều loại sản phẩm khác nhau, mỗi loại có thuộc tính riêng biệt.
- Danh mục sản phẩm có thể thay đổi/mở rộng liên tục theo thời gian.
- Không yêu cầu transaction phức tạp giữa nhiều bảng (khác với hệ thống ngân hàng).

→ NoSQL (MongoDB) phù hợp hơn SQL cho bài toán này nhờ tính linh hoạt về schema và khả năng mở rộng dễ dàng khi danh mục sản phẩm tăng trưởng.

*Gợi ý: nhóm có thể tạo thêm 1 bảng SQL nhỏ (VD: dùng SQLite hoặc chỉ mô phỏng bằng script) chứa cùng dữ liệu, đo thời gian thêm 1 thuộc tính mới cho toàn bộ sản phẩm — để có số liệu thực tế minh chứng cho phần so sánh trong báo cáo.*
