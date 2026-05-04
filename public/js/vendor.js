// Vendor Logic - Powered by DataEngine (No Backend Required)
const inventoryListEl = document.getElementById('vendor-inventory-list');
const ordersListEl = document.getElementById('orders-list');
const toastContainer = document.getElementById('toast-container');

let allOrdersData = [];

// Auth Check
if (localStorage.getItem('userRole') !== 'vendor') {
  window.location.href = 'login.html';
}

function loadVendorData() {
  const inventory = DataEngine.getInventory();
  const orders = DataEngine.getOrders();
  renderInventory(inventory);
  renderOrders(orders);
  loadStats();
}

// Initial Load
loadVendorData();

// Sync Simulation
DataEngine.onUpdate(() => {
  loadVendorData();
});

function loadStats() {
  const stats = DataEngine.getStats();
  document.getElementById('stat-products').textContent = stats.totalProducts;
  document.getElementById('stat-orders').textContent = stats.totalOrders;
  document.getElementById('stat-revenue').textContent = '₹' + stats.totalRevenue.toFixed(0);
  document.getElementById('stat-pending').textContent = stats.pendingOrders;
}

function renderInventory(inventory) {
  inventoryListEl.innerHTML = inventory.map(item => `
    <tr class="table-row">
      <td>${item.vendor_name || '-'}</td>
      <td><strong>${item.name}</strong><br><small>${item.category}</small></td>
      <td>₹${item.price.toFixed(2)}</td>
      <td><input type="number" id="qty-${item.id}" value="${item.quantity}" style="width:60px;" class="form-control"></td>
      <td>
        <button class="action-btn" onclick="updateStock(${item.id})">Update</button>
        <button class="action-btn" style="background:#ef4444;" onclick="deleteProduct(${item.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function updateStock(id) {
  const qty = parseInt(document.getElementById(`qty-${id}`).value);
  if (isNaN(qty) || qty < 0) return;
  DataEngine.updateStock(id, qty);
  showToast("Stock updated!");
}

function deleteProduct(id) {
  if (confirm("Delete this item?")) {
    DataEngine.deleteProduct(id);
    showToast("Product deleted!");
  }
}

function renderOrders(orders) {
  allOrdersData = orders;
  if (orders.length === 0) {
    ordersListEl.innerHTML = '<tr><td colspan="6" style="text-align:center;">No orders yet.</td></tr>';
    return;
  }
  ordersListEl.innerHTML = orders.map(order => {
    const time = new Date(order.created_at).toLocaleTimeString();
    let actionBtn = '';
    if (order.status === 'Pending') actionBtn = `<button class="action-btn" onclick="DataEngine.updateOrderStatus(${order.id}, 'Accepted')">Accept</button>`;
    else if (order.status === 'Accepted') actionBtn = `<button class="action-btn" style="background:#2e7d32;" onclick="DataEngine.updateOrderStatus(${order.id}, 'Delivered')">Deliver</button>`;
    else actionBtn = `<button class="action-btn" style="background:#374151;" onclick="generateBill(${order.id})">Bill</button>`;

    return `
      <tr class="table-row">
        <td>#${order.id}</td>
        <td><strong>${order.customer_name}</strong><br><small>${order.address}</small></td>
        <td>₹${order.totalAmount.toFixed(2)}</td>
        <td>${time}</td>
        <td><span class="order-status status-${order.status}">${order.status}</span></td>
        <td>${actionBtn}</td>
      </tr>
    `;
  }).join('');
}

function generateBill(id) {
  const order = allOrdersData.find(o => o.id === id);
  if (!order) return;
  const content = document.getElementById('receipt-content');
  content.innerHTML = `
    <strong>Order #${order.id}</strong><br>
    Customer: ${order.customer_name}<br>
    Address: ${order.address}<br>
    <hr>
    Total Paid: ₹${order.totalAmount.toFixed(2)}
  `;
  document.getElementById('receipt-modal').style.display = 'flex';
}

function closeReceipt() { document.getElementById('receipt-modal').style.display = 'none'; }

function showToast(m) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerText = m;
  toastContainer.appendChild(t); setTimeout(() => t.remove(), 3000);
}

function openAddProductModal() { document.getElementById('add-product-modal').style.display = 'flex'; }
function closeAddProductModal() { document.getElementById('add-product-modal').style.display = 'none'; }

function addNewProduct() {
  const name = document.getElementById('new-product-name').value;
  const price = parseFloat(document.getElementById('new-product-price').value);
  const qty = parseInt(document.getElementById('new-product-qty').value);
  const cat = document.getElementById('new-product-category').value;
  const type = document.getElementById('new-product-type').value;
  const vendor = document.getElementById('new-product-vendor').value;

  if (!name || isNaN(price)) return;
  DataEngine.addProduct({ name, price, quantity: qty, category: cat, vendor_type: type, vendor_name: vendor });
  closeAddProductModal();
  showToast("Added successfully!");
}
