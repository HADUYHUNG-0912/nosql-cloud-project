// Đổi URL này thành URL Cloud Run sau khi deploy, ví dụ:
// const API_URL = "https://nosql-backend-xxxxx.a.run.app/api/products";
const API_URL = "http://localhost:5000/api/products";

const form = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formMsg = document.getElementById("formMsg");
const productList = document.getElementById("productList");
const statsBox = document.getElementById("statsBox");
const filterCategory = document.getElementById("filterCategory");

async function loadProducts() {
  const category = filterCategory.value.trim();
  const url = category ? `${API_URL}?category=${encodeURIComponent(category)}` : API_URL;

  try {
    const res = await fetch(url);
    const json = await res.json();
    renderProducts(json.data || []);
  } catch (err) {
    productList.innerHTML = `<p class="empty">Không thể tải dữ liệu. Kiểm tra backend đã chạy chưa? (${err.message})</p>`;
  }
}

async function loadStats() {
  try {
    const res = await fetch(`${API_URL}/stats/category`);
    const stats = await res.json();
    if (!stats.length) {
      statsBox.textContent = "Chưa có dữ liệu";
      return;
    }
    statsBox.textContent = stats
      .map((s) => `${s._id}: ${s.totalProducts} SP · TB ${Math.round(s.avgPrice).toLocaleString("vi-VN")}đ`)
      .join("\n");
  } catch {
    statsBox.textContent = "Chưa kết nối được backend";
  }
}

function renderProducts(products) {
  if (!products.length) {
    productList.innerHTML = `<p class="empty">Chưa có sản phẩm nào.</p>`;
    return;
  }

  productList.innerHTML = products
    .map((p) => {
      const attrsText = p.attributes && Object.keys(p.attributes).length
        ? JSON.stringify(p.attributes, null, 0)
        : "—";
      return `
        <div class="card">
          <span class="cat">${escapeHTML(p.category)}</span>
          <h3>${escapeHTML(p.name)}</h3>
          <div class="price">${Number(p.price).toLocaleString("vi-VN")}đ</div>
          <div class="stock">Tồn kho: ${p.stock}</div>
          <div class="desc">${escapeHTML(p.description || "")}</div>
          <div class="attrs">${escapeHTML(attrsText)}</div>
          <div class="card-actions">
            <button class="edit-btn" onclick="editProduct('${p._id}')">Sửa</button>
            <button class="delete-btn" onclick="deleteProduct('${p._id}')">Xóa</button>
          </div>
        </div>`;
    })
    .join("");
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMsg.textContent = "";
  formMsg.className = "msg";

  let attributes = {};
  const attrsRaw = document.getElementById("attributes").value.trim();
  if (attrsRaw) {
    try {
      attributes = JSON.parse(attrsRaw);
    } catch {
      formMsg.textContent = "Thuộc tính riêng phải là JSON hợp lệ, ví dụ: {\"size\":\"M\"}";
      formMsg.classList.add("error");
      return;
    }
  }

  const payload = {
    name: document.getElementById("name").value.trim(),
    category: document.getElementById("category").value.trim(),
    price: Number(document.getElementById("price").value),
    stock: Number(document.getElementById("stock").value),
    description: document.getElementById("description").value.trim(),
    attributes,
  };

  const id = productIdInput.value;
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.message || "Lỗi không xác định");
    }
    formMsg.textContent = id ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm mới";
    formMsg.classList.add("success");
    resetForm();
    loadProducts();
    loadStats();
  } catch (err) {
    formMsg.textContent = `Lỗi: ${err.message}`;
    formMsg.classList.add("error");
  }
});

async function editProduct(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();

    productIdInput.value = p._id;
    document.getElementById("name").value = p.name;
    document.getElementById("category").value = p.category;
    document.getElementById("price").value = p.price;
    document.getElementById("stock").value = p.stock;
    document.getElementById("description").value = p.description || "";
    document.getElementById("attributes").value =
      p.attributes && Object.keys(p.attributes).length ? JSON.stringify(p.attributes) : "";

    formTitle.textContent = "Chỉnh sửa sản phẩm";
    submitBtn.textContent = "Cập nhật";
    cancelBtn.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    formMsg.textContent = `Không thể tải sản phẩm: ${err.message}`;
    formMsg.classList.add("error");
  }
}

async function deleteProduct(id) {
  if (!confirm("Xóa sản phẩm này?")) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Xóa thất bại");
    loadProducts();
    loadStats();
  } catch (err) {
    alert(err.message);
  }
}

function resetForm() {
  form.reset();
  productIdInput.value = "";
  formTitle.textContent = "Thêm sản phẩm mới";
  submitBtn.textContent = "Lưu sản phẩm";
  cancelBtn.classList.add("hidden");
}

cancelBtn.addEventListener("click", resetForm);
filterCategory.addEventListener("input", debounce(loadProducts, 300));

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

loadProducts();
loadStats();
