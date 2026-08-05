/* ===== CONFIGURATION ===== */
const API_URL = "http://localhost:5000/api/products";

/* ===== STATE ===== */
let allStats = [];
let dashPieChart = null;
let barChartCount = null;
let barChartPrice = null;
let deleteTargetId = null;

/* ===== DOM REFS ===== */
const sidebar        = document.getElementById("sidebar");
const hamburgerBtn   = document.getElementById("hamburgerBtn");
const connectionBadge= document.getElementById("connectionBadge");
const formTitle      = document.getElementById("formTitle");
const productForm    = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const submitBtn      = document.getElementById("submitBtn");
const cancelBtn      = document.getElementById("cancelBtn");
const formMsg        = document.getElementById("formMsg");
const productGrid    = document.getElementById("productGrid");
const filterCategory = document.getElementById("filterCategory");
const attrBuilder    = document.getElementById("attrBuilder");
const addAttrBtn     = document.getElementById("addAttrBtn");
const attrPreview    = document.getElementById("attrPreview");

/* ===== SIDEBAR TOGGLE ===== */
hamburgerBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  sidebar.classList.toggle("collapsed");
  document.querySelector(".main-content").classList.toggle("expanded");
});

/* ===== NAVIGATION ===== */
const navItems = document.querySelectorAll(".nav-item");
navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const section = item.dataset.section;
    switchSection(section);
    // Close sidebar on mobile
    if (window.innerWidth < 960) sidebar.classList.remove("open");
  });
});

function switchSection(sectionId) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  document.getElementById("section" + capitalize(sectionId)).classList.add("active");
  document.getElementById("nav" + capitalize(sectionId)).classList.add("active");

  // Lazy load section content
  if (sectionId === "stats")      renderStatCharts();
  if (sectionId === "products")   loadProducts();
  if (sectionId === "dashboard")  loadDashboard();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ===== TOAST ===== */
function showToast(msg, type = "info") {
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8h.01M12 12v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  };
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(24px)";
    toast.style.transition = "all .3s";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ===== CONNECTION STATUS ===== */
async function checkConnection() {
  try {
    const res = await fetch(`${API_URL.replace("/api/products", "")}/`);
    const data = await res.json();
    if (data.status === "OK") {
      connectionBadge.innerHTML = `<span class="status-dot connected"></span><span class="status-text">Đã kết nối Atlas</span>`;
    }
  } catch {
    connectionBadge.innerHTML = `<span class="status-dot error"></span><span class="status-text">Mất kết nối</span>`;
  }
}

/* ===== LOAD STATS (shared) ===== */
async function loadStats() {
  try {
    const res = await fetch(`${API_URL}/stats/category`);
    allStats = await res.json();
  } catch { allStats = []; }
}

/* ===== DASHBOARD ===== */
async function loadDashboard() {
  await loadStats();
  await loadProducts(true); // silent load for KPI
  renderDashPie();
  renderLowStock();
}

async function loadProducts(silent = false) {
  const category = filterCategory?.value?.trim() || "";
  const url = category ? `${API_URL}?category=${encodeURIComponent(category)}` : API_URL;

  if (!silent) {
    productGrid.innerHTML = `<div class="loading-skeleton">
      <div class="skeleton-card"></div><div class="skeleton-card"></div><div class="skeleton-card"></div>
    </div>`;
  }

  try {
    const res = await fetch(url);
    const json = await res.json();
    const products = json.data || [];

    if (!silent) renderProducts(products);

    // Update KPI
    document.getElementById("kpiTotal").textContent = json.total ?? products.length;
    document.getElementById("kpiCategories").textContent = allStats.length || "—";

    const avgPrice = allStats.length
      ? Math.round(allStats.reduce((s, c) => s + c.avgPrice, 0) / allStats.length)
      : 0;
    document.getElementById("kpiAvgPrice").textContent = avgPrice
      ? avgPrice.toLocaleString("vi-VN") + "đ"
      : "—";

    const lowCount = products.filter(p => p.stock < 10).length;
    document.getElementById("kpiLowStock").textContent = lowCount;

    // Populate category datalist
    const dl = document.getElementById("categoryList");
    if (dl) {
      dl.innerHTML = [...new Set(products.map(p => p.category))]
        .map(c => `<option value="${c}">`)
        .join("");
    }

    return products;
  } catch (err) {
    if (!silent) {
      productGrid.innerHTML = `<div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <h4>Không thể tải dữ liệu</h4>
        <p>Kiểm tra Backend đã chạy chưa: <code>npm run dev</code></p>
      </div>`;
    }
  }
}

/* ===== RENDER PRODUCTS ===== */
function renderProducts(products) {
  if (!products.length) {
    productGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <svg viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" stroke-width="2"/></svg>
      <h4>Chưa có sản phẩm nào</h4>
      <p>Hãy thêm sản phẩm đầu tiên từ form bên trái</p>
    </div>`;
    return;
  }
  productGrid.innerHTML = products.map(p => {
    const isLow = p.stock < 10;
    const attrs = p.attributes && Object.keys(p.attributes).length
      ? JSON.stringify(p.attributes, null, 0)
      : null;
    return `
    <div class="product-card${isLow ? " low-stock-card" : ""}">
      ${isLow ? `<span class="low-stock-badge">⚠ Sắp hết</span>` : ""}
      <span class="product-cat">${escapeHTML(p.category)}</span>
      <div class="product-name">${escapeHTML(p.name)}</div>
      <div class="product-price">${Number(p.price).toLocaleString("vi-VN")}đ</div>
      <div class="product-stock${isLow ? " low" : ""}">Tồn kho: ${p.stock}${isLow ? " ⚠" : ""}</div>
      <div class="product-desc">${escapeHTML(p.description || "")}</div>
      ${attrs ? `<div class="product-attrs">${escapeHTML(attrs)}</div>` : ""}
      <div class="product-actions">
        <button class="btn ghost sm" onclick="editProduct('${p._id}')">Sửa</button>
        <button class="btn danger sm" onclick="confirmDelete('${p._id}', '${escapeHTML(p.name)}')">Xóa</button>
      </div>
    </div>`;
  }).join("");
}

/* ===== RENDER DASHBOARD PIE ===== */
function renderDashPie() {
  if (!allStats.length) return;
  const ctx = document.getElementById("dashPieChart")?.getContext("2d");
  if (!ctx) return;
  if (dashPieChart) dashPieChart.destroy();
  dashPieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: allStats.map(s => s._id),
      datasets: [{
        data: allStats.map(s => s.totalProducts),
        backgroundColor: ["#4285f4","#34a853","#fbbc04","#ea4335","#a142f4","#24c1e0"],
        borderWidth: 2, borderColor: "#fff",
      }]
    },
    options: {
      cutout: "60%", responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { font: { family: "Google Sans", size: 12 }, padding: 16 } }
      }
    }
  });
}

/* ===== RENDER LOW STOCK LIST ===== */
async function renderLowStock() {
  const products = await loadProducts(true);
  const lowStockList = document.getElementById("lowStockList");
  if (!products) { lowStockList.innerHTML = `<p class="empty-hint">Không thể tải</p>`; return; }
  const lowItems = products.filter(p => p.stock < 10).sort((a, b) => a.stock - b.stock);
  if (!lowItems.length) {
    lowStockList.innerHTML = `<p class="empty-hint">Không có sản phẩm sắp hết hàng ✓</p>`;
    return;
  }
  lowStockList.innerHTML = lowItems.map(p => `
    <div class="low-stock-item">
      <span class="low-stock-item-name">${escapeHTML(p.name)}</span>
      <span class="low-stock-item-count">Còn ${p.stock}</span>
    </div>
  `).join("");
}

/* ===== STATS CHARTS ===== */
async function renderStatCharts() {
  await loadStats();

  // Fill table
  const tbody = document.getElementById("statsTableBody");
  if (allStats.length) {
    tbody.innerHTML = allStats.map(s => `
      <tr>
        <td><strong>${escapeHTML(s._id)}</strong></td>
        <td>${s.totalProducts}</td>
        <td>${Math.round(s.avgPrice).toLocaleString("vi-VN")}đ</td>
        <td>${s.totalStock ?? "—"}</td>
      </tr>
    `).join("");
  } else {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-cell">Chưa có dữ liệu</td></tr>`;
  }

  const colors = ["#4285f4","#34a853","#fbbc04","#ea4335","#a142f4","#24c1e0","#ff6d00"];
  const labels = allStats.map(s => s._id);

  // Bar chart — Count
  const ctx1 = document.getElementById("barChartCount")?.getContext("2d");
  if (ctx1) {
    if (barChartCount) barChartCount.destroy();
    barChartCount = new Chart(ctx1, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Số sản phẩm",
          data: allStats.map(s => s.totalProducts),
          backgroundColor: colors.map(c => c + "cc"),
          borderColor: colors, borderWidth: 2,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f1f3f4" } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Bar chart — Avg Price
  const ctx2 = document.getElementById("barChartPrice")?.getContext("2d");
  if (ctx2) {
    if (barChartPrice) barChartPrice.destroy();
    barChartPrice = new Chart(ctx2, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Giá TB (VNĐ)",
          data: allStats.map(s => Math.round(s.avgPrice)),
          backgroundColor: "#4285f433",
          borderColor: "#1a73e8", borderWidth: 2,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true, grid: { color: "#f1f3f4" },
            ticks: { callback: v => v.toLocaleString("vi-VN") + "đ" }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

/* ===== DYNAMIC ATTRIBUTE BUILDER ===== */
function addAttrRow(key = "", value = "") {
  const row = document.createElement("div");
  row.className = "attr-row";
  row.innerHTML = `
    <input type="text" class="attr-key" placeholder="Tên (vd: size, cpu)" value="${escapeAttr(key)}" />
    <span class="attr-row-sep">:</span>
    <input type="text" class="attr-val" placeholder="Giá trị (vd: M, i5)" value="${escapeAttr(value)}" />
    <button type="button" class="btn-remove-attr" title="Xóa thuộc tính">
      <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>`;
  row.querySelector(".btn-remove-attr").addEventListener("click", () => {
    row.remove();
    updateAttrPreview();
  });
  row.querySelectorAll("input").forEach(inp => inp.addEventListener("input", updateAttrPreview));
  attrBuilder.appendChild(row);
  updateAttrPreview();
}

function updateAttrPreview() {
  const obj = getAttrsFromBuilder();
  attrPreview.textContent = Object.keys(obj).length ? JSON.stringify(obj) : "{}";
}

function getAttrsFromBuilder() {
  const obj = {};
  attrBuilder.querySelectorAll(".attr-row").forEach(row => {
    const k = row.querySelector(".attr-key").value.trim();
    const v = row.querySelector(".attr-val").value.trim();
    if (k) obj[k] = v;
  });
  return obj;
}

function setAttrsToBuilder(attrs = {}) {
  attrBuilder.innerHTML = "";
  Object.entries(attrs).forEach(([k, v]) => addAttrRow(k, v));
  updateAttrPreview();
}

addAttrBtn.addEventListener("click", () => addAttrRow());

/* ===== FORM SUBMIT ===== */
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMsg.textContent = "";
  formMsg.className = "form-msg";

  const payload = {
    name:        document.getElementById("name").value.trim(),
    category:    document.getElementById("category").value.trim(),
    price:       Number(document.getElementById("price").value),
    stock:       Number(document.getElementById("stock").value),
    description: document.getElementById("description").value.trim(),
    attributes:  getAttrsFromBuilder(),
  };

  const id = productIdInput.value;
  const url    = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? "PUT" : "POST";

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<svg class="spin" viewBox="0 0 24 24" fill="none"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Đang lưu…`;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Lỗi không xác định");
    }
    showToast(id ? "✅ Đã cập nhật sản phẩm" : "✅ Đã thêm sản phẩm mới", "success");
    resetForm();
    loadProducts();
    await loadStats();
    renderStatCharts();
    loadDashboard();
  } catch (err) {
    formMsg.textContent = `Lỗi: ${err.message}`;
    formMsg.className = "form-msg error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Lưu sản phẩm`;
  }
});

/* ===== EDIT PRODUCT ===== */
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
    setAttrsToBuilder(p.attributes || {});

    formTitle.textContent = "Chỉnh sửa sản phẩm";
    submitBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Cập nhật`;
    cancelBtn.style.display = "flex";
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Switch to products section
    switchSection("products");
  } catch (err) {
    showToast(`Không thể tải sản phẩm: ${err.message}`, "error");
  }
}

/* ===== DELETE CONFIRM ===== */
function confirmDelete(id, name) {
  deleteTargetId = id;
  document.getElementById("modalMsg").textContent = `Xóa sản phẩm "${name}"? Hành động này không thể hoàn tác.`;
  document.getElementById("modalOverlay").style.display = "flex";
}

document.getElementById("modalCancel").addEventListener("click", () => {
  document.getElementById("modalOverlay").style.display = "none";
  deleteTargetId = null;
});

document.getElementById("modalConfirm").addEventListener("click", async () => {
  document.getElementById("modalOverlay").style.display = "none";
  if (!deleteTargetId) return;
  try {
    const res = await fetch(`${API_URL}/${deleteTargetId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Xóa thất bại");
    showToast("Đã xóa sản phẩm", "success");
    loadProducts();
    loadStats().then(() => { renderStatCharts(); loadDashboard(); });
  } catch (err) {
    showToast(err.message, "error");
  }
  deleteTargetId = null;
});

/* ===== RESET FORM ===== */
function resetForm() {
  productForm.reset();
  productIdInput.value = "";
  attrBuilder.innerHTML = "";
  updateAttrPreview();
  formTitle.textContent = "Thêm sản phẩm mới";
  submitBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Lưu sản phẩm`;
  cancelBtn.style.display = "none";
  formMsg.textContent = "";
}

cancelBtn.addEventListener("click", resetForm);

/* ===== FILTER ===== */
filterCategory.addEventListener("input", debounce(loadProducts, 300));

/* ===== BENCHMARK ===== */
document.getElementById("runBenchmarkBtn").addEventListener("click", async () => {
  const tbody = document.getElementById("benchmarkBody");
  const rows = tbody.querySelectorAll("tr");

  const tests = [
    { label: "GET tất cả sản phẩm", fn: () => fetch(API_URL) },
    { label: "GET theo ID", fn: async () => {
        const r = await fetch(API_URL);
        const j = await r.json();
        const first = j.data?.[0];
        return first ? fetch(`${API_URL}/${first._id}`) : r;
    }},
    { label: "Aggregation Pipeline (stats)", fn: () => fetch(`${API_URL}/stats/category`) },
    { label: "POST tạo sản phẩm benchmark", fn: () => fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "__benchmark__", category: "__test__", price: 1, stock: 1 })
    })},
  ];

  let totalTime = 0;
  for (let i = 0; i < tests.length; i++) {
    const td_time = rows[i].cells[3];
    const td_status = rows[i].cells[4];
    td_status.innerHTML = `<span class="badge running">Đang chạy…</span>`;
    td_time.textContent = "…";

    try {
      const t0 = performance.now();
      const res = await tests[i].fn();
      const t1 = performance.now();
      const ms = Math.round(t1 - t0);
      totalTime += ms;
      td_time.innerHTML = `<strong>${ms} ms</strong>`;
      td_status.innerHTML = res.ok
        ? `<span class="badge success">Thành công (${res.status})</span>`
        : `<span class="badge error">Lỗi (${res.status})</span>`;

      // Cleanup benchmark product
      if (i === 3 && res.ok) {
        const j = await res.json();
        if (j._id) fetch(`${API_URL}/${j._id}`, { method: "DELETE" }).catch(() => {});
      }
    } catch (err) {
      td_time.textContent = "—";
      td_status.innerHTML = `<span class="badge error">Lỗi kết nối</span>`;
    }
  }

  const result = document.getElementById("benchmarkResult");
  result.style.display = "block";
  result.innerHTML = `
    <strong>✅ Kiểm thử hoàn tất!</strong> Tổng thời gian: <strong>${totalTime} ms</strong>
    — Bình quân: <strong>${Math.round(totalTime / tests.length)} ms / truy vấn</strong>.
    Kết quả này thể hiện tốc độ phản hồi nhanh của MongoDB Atlas trên Google Cloud.
  `;
});

/* ===== UTILITIES ===== */
function escapeHTML(str) {
  const d = document.createElement("div");
  d.textContent = String(str);
  return d.innerHTML;
}
function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}
function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

/* ===== CSS SPIN ===== */
const style = document.createElement("style");
style.textContent = `.spin { animation: spinAnim .8s linear infinite; } @keyframes spinAnim { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

/* ===== INIT ===== */
(async () => {
  await checkConnection();
  await loadStats();
  await loadDashboard();
})();
