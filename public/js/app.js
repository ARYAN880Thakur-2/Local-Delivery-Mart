// Data Engine powered - Zero Backend needed
// State
let inventory = [];
let cart = [];
let currentFilter = 'All';
let searchQuery = '';
let myOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');

// Auth Check
if (!localStorage.getItem('isLoggedIn')) {
  window.location.href = 'login.html';
}

// DOM Elements
const productListEl = document.getElementById('product-list');
const cartListEl = document.getElementById('cart-list');
const emptyCartMsg = document.getElementById('empty-cart-msg');
const cartFooter = document.getElementById('cart-footer');
const cartTotalAmount = document.getElementById('cart-total-amount');
const checkoutBtn = document.getElementById('checkout-btn');
const toastContainer = document.getElementById('toast-container');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');

// --- DATA HANDLING ---
function loadData() {
  inventory = DataEngine.getInventory();
  renderProducts();
  renderTrackingUI(DataEngine.getOrders());
}

// Initial Load
loadData();

// Real-time Update simulation
DataEngine.onUpdate(() => {
  loadData();
});

// Search functionality with debounce
let searchTimer = null;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderProducts();
  }, 300);
});

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.style.background = 'transparent';
      b.style.color = 'var(--text-dark)';
      b.style.borderColor = 'var(--text-gray)';
    });
    e.target.classList.add('active');
    e.target.style.background = 'var(--primary-color)';
    e.target.style.color = 'white';
    e.target.style.borderColor = 'var(--primary-color)';
    
    currentFilter = e.target.getAttribute('data-type');
    renderProducts();
  });
});

function closeSuccessModal() {
  document.getElementById('success-modal').style.display = 'none';
  openTrackingModal();
}

// Tracking Modal
function openTrackingModal() {
  document.getElementById('tracking-modal').style.display = 'flex';
  renderTrackingUI(DataEngine.getOrders());
}

function closeTrackingModal() {
  document.getElementById('tracking-modal').style.display = 'none';
}

function renderTrackingUI(orders) {
  const activeOrders = orders.filter(o => myOrders.includes(o.id));
  const trackingList = document.getElementById('active-orders-list');
  
  if (activeOrders.length > 0) {
    trackingList.innerHTML = activeOrders.map(order => generateTrackingHTML(order)).join('');
  } else {
    trackingList.innerHTML = '<div style="color: var(--text-gray); font-size: 0.9rem;">No active orders currently.</div>';
  }
}

function toggleOrderDetails(id) {
  const el = document.getElementById('order-details-' + id);
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function generateTrackingHTML(order) {
  let progress = 33;
  let statusText = 'Order Received';
  let statusColor = '#3b82f6'; // blue
  let statusIcon = '📋';

  if (order.status === 'Accepted') {
    progress = 66;
    statusText = 'Preparing Your Order';
    statusColor = '#f59e0b'; // orange
    statusIcon = '👨‍🍳';
  } else if (order.status === 'Picked Up' || order.status === 'Out for Delivery') {
    progress = 85;
    statusText = 'Partner on the way';
    statusColor = '#8b5cf6'; // purple
    statusIcon = '🛵';
  } else if (order.status === 'Delivered') {
    progress = 100;
    statusText = 'Delivered';
    statusColor = '#10b981'; // green
    statusIcon = '✅';
  }

  const partner = order.delivery_partner || { name: "Assigning...", phone: "---" };
  const eta = order.eta || 25;

  let itemsHtml = '';
  try {
    const items = order.items;
    const list = items.map(item => `
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #4b5563; border-bottom: 1px dashed #e5e7eb; padding-bottom: 6px; margin-bottom: 6px;">
        <span><span style="font-weight: 600;">${item.qty}x</span> ${item.name}</span>
        <span>₹${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `).join('');
    
    itemsHtml = `
      <div style="background: #fdfdfd; padding: 12px; border-radius: 12px; margin-top: 15px; border: 1px solid #f3f4f6;">
        <div style="font-weight: 700; font-size: 0.85rem; color: #1f2937; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em;">Order Summary</div>
        ${list}
        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 0.95rem; margin-top: 10px; color: #111827; border-top: 1px solid #eee; pt: 8px;">
          <span>Total Paid</span>
          <span>₹${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>`;
  } catch (e) {}

  return `
    <div class="tracking-card" style="background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px; border: 1px solid #f3f4f6; overflow: hidden; transition: all 0.3s ease;">
      <div style="padding: 16px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; background: #fafafa;">
         <div>
            <div style="font-size: 0.75rem; font-weight: 600; color: #9ca3af; text-transform: uppercase;">Order ID</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: #111827;">#${order.id}</div>
         </div>
         <div style="text-align: right;">
            <div style="font-size: 0.75rem; font-weight: 600; color: #9ca3af; text-transform: uppercase;">Estimated Time</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: var(--primary-color);">${eta} MINS</div>
         </div>
      </div>
      
      <div style="padding: 20px;">
        <div style="display: flex; gap: 15px; align-items: flex-start; margin-bottom: 20px;">
           <div style="width: 48px; height: 48px; background: ${statusColor}15; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
              ${statusIcon}
           </div>
           <div style="flex: 1;">
              <div style="font-weight: 800; font-size: 1rem; color: #111827;">${statusText}</div>
              <div style="font-size: 0.85rem; color: #6b7280; margin-top: 2px;">Your order is currently ${statusText.toLowerCase()}</div>
           </div>
        </div>

        <div style="height: 6px; background: #f3f4f6; border-radius: 10px; margin-bottom: 25px; position: relative; overflow: hidden;">
           <div style="position: absolute; left: 0; top: 0; height: 100%; width: ${progress}%; background: ${statusColor}; border-radius: 10px; transition: width 1s ease-in-out;"></div>
        </div>

        <div style="background: #f8fafc; border-radius: 16px; padding: 15px; display: flex; align-items: center; gap: 12px; border: 1px solid #e2e8f0;">
           <div style="width: 40px; height: 40px; background: white; border-radius: 50%; border: 2px solid var(--primary-color); display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
           </div>
           <div style="flex: 1;">
              <div style="font-weight: 700; font-size: 0.9rem; color: #1e293b;">${partner.name}</div>
              <div style="font-size: 0.8rem; color: #64748b;">Delivery Partner</div>
           </div>
           <a href="tel:${partner.phone}" style="width: 36px; height: 36px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; box-shadow: 0 4px 10px ${statusColor}40;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
           </a>
        </div>

        <div style="margin-top: 15px; text-align: center;">
           <button onclick="toggleOrderDetails(${order.id})" style="background: none; border: none; color: #6366f1; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 4px; margin: 0 auto;">
              VIEW ORDER DETAILS <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
           </button>
        </div>

        <div id="order-details-${order.id}" style="display: none; transition: all 0.3s ease;">
          ${itemsHtml}
        </div>
      </div>
    </div>
  `;
}

function renderProducts() {
  let filtered = inventory;
  if (currentFilter !== 'All') filtered = filtered.filter(item => item.vendor_type === currentFilter);
  if (searchQuery) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    productListEl.innerHTML = '<p style="text-align: center; padding: 2rem;">No items found.</p>';
    return;
  }

  productListEl.innerHTML = filtered.map(item => {
    let stockStatus = item.quantity > 0 ? '<span class="stock-badge stock-high">In Stock</span>' : '<span class="stock-badge stock-out">Out of Stock</span>';
    const cartItem = cart.find(c => c.id === item.id);
    const inCart = cartItem ? `<span style="font-size:0.75rem;color:var(--secondary-color);font-weight:600;">${cartItem.qty} in cart</span>` : '';

    return `
      <div class="product-item">
        <div class="product-meta"><span>${item.vendor_name}</span>${stockStatus}</div>
        <div class="product-name">${item.name}</div>
        <div class="product-price">₹${item.price.toFixed(2)}</div>
        <div style="font-size: 0.8rem; color: var(--text-gray);">${item.category} ${inCart}</div>
        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
          <button class="btn" onclick="addToCart(${item.id})" ${item.quantity === 0 ? 'disabled' : ''}>Add to Cart</button>
          <button class="btn" style="background:transparent; border:1px solid var(--primary-color); color:var(--primary-color);" onclick="openReviews(${item.id}, '${item.name.replace(/'/g, "\\'")}')">Reviews</button>
        </div>
      </div>
    `;
  }).join('');
}

function addToCart(itemId) {
  const item = inventory.find(i => i.id === itemId);
  if (!item || item.quantity <= 0) return;
  const existing = cart.find(c => c.id === itemId);
  if (existing) existing.qty < item.quantity ? existing.qty++ : showToast('Out of stock');
  else cart.push({ ...item, qty: 1 });
  updateCartUI();
  renderProducts();
}

function removeFromCart(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  updateCartUI();
  renderProducts();
}

function changeQty(itemId, delta) {
  const ci = cart.find(c => c.id === itemId);
  const ii = inventory.find(i => i.id === itemId);
  if (!ci || !ii) return;
  if (ci.qty + delta <= 0) removeFromCart(itemId);
  else if (ci.qty + delta <= ii.quantity) ci.qty += delta;
  updateCartUI();
  renderProducts();
}

function updateCartUI() {
  if (cart.length === 0) {
    emptyCartMsg.style.display = 'block';
    cartListEl.style.display = 'none';
    cartFooter.style.display = 'none';
    return;
  }
  emptyCartMsg.style.display = 'none';
  cartListEl.style.display = 'flex';
  cartFooter.style.display = 'block';
  cartListEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div style="flex: 1;">
        <div class="cart-item-name">${item.name}</div>
        <div style="font-size: 0.8rem; color: var(--text-gray);">₹${item.price.toFixed(2)}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
  const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  cartTotalAmount.textContent = `₹${total.toFixed(2)}`;
}

checkoutBtn.addEventListener('click', () => {
  const name = document.getElementById('customerName').value;
  const addr = document.getElementById('address').value;
  if (!name || !addr || cart.length === 0) return;
  const order = DataEngine.placeOrder({ customerName: name, address: addr, items: cart, totalAmount: cart.reduce((s,i)=>s+(i.price*i.qty), 0) });
  myOrders.push(order.id);
  localStorage.setItem('myOrders', JSON.stringify(myOrders));
  cart = [];
  updateCartUI();
  document.getElementById('success-order-id').innerText = '#' + order.id;
  document.getElementById('success-modal').style.display = 'flex';
});

function showToast(m) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerText = m;
  toastContainer.appendChild(t); setTimeout(() => t.remove(), 3000);
}

// Review System
let currentReviewProductId = null;
function openReviews(pid, pname) {
  currentReviewProductId = pid;
  document.getElementById('reviews-title').innerText = pname + ' Reviews';
  document.getElementById('reviews-modal').style.display = 'flex';
  const reviews = DataEngine.getReviews(pid);
  document.getElementById('reviews-list').innerHTML = reviews.length ? reviews.map(r => `
    <div style="margin-bottom:1rem; border-bottom:1px solid #eee;">
      <strong>${r.customer_name}</strong> (${r.rating}/5)<br>${r.comment}
    </div>
  `).join('') : '<p>No reviews yet.</p>';
}

function closeReviewsModal() { document.getElementById('reviews-modal').style.display = 'none'; }

function submitReview() {
  const name = document.getElementById('review-name').value;
  const rating = document.getElementById('review-rating').value;
  const comment = document.getElementById('review-comment').value;
  if (!name || !comment) return;
  DataEngine.addReview({ product_id: currentReviewProductId, customer_name: name, rating: parseInt(rating), comment });
  openReviews(currentReviewProductId, 'Product');
}
