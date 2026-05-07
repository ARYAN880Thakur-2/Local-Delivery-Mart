const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Persistent SQLite database (file-based, survives restarts)
const db = new sqlite3.Database(path.join(__dirname, 'localmart.db'));

// Enable WAL mode and other performance settings
db.run("PRAGMA journal_mode=WAL");
db.run("PRAGMA synchronous=NORMAL");
db.run("PRAGMA cache_size=-64000"); // 64MB cache

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    category TEXT,
    vendor_type TEXT,
    vendor_name TEXT,
    image_url TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    address TEXT,
    phone TEXT DEFAULT '',
    total_amount REAL,
    status TEXT DEFAULT 'Pending',
    items JSON,
    estimated_time TEXT DEFAULT '30 mins',
    delivery_notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed data only if inventory is empty
  db.get("SELECT COUNT(*) as count FROM inventory", [], (err, row) => {
    if (err || row.count > 0) return;

    console.log('Seeding initial inventory data...');
    const stmt = db.prepare("INSERT INTO inventory (name, price, quantity, category, vendor_type, vendor_name) VALUES (?, ?, ?, ?, ?, ?)");

    // Supermarket items
    stmt.run("Aashirvaad Atta 5kg", 250.00, 50, "Staples", "Supermarket", "Reliance Retail");
    stmt.run("India Gate Basmati Rice 1kg", 120.00, 30, "Staples", "Supermarket", "Reliance Retail");
    stmt.run("Tata Salt 1kg", 24.00, 100, "Staples", "Supermarket", "Reliance Retail");
    stmt.run("Fortune Sunflower Oil 1L", 145.00, 60, "Staples", "Supermarket", "Reliance Retail");
    stmt.run("Amul Butter 100g", 56.00, 30, "Dairy", "Supermarket", "Reliance Retail");
    stmt.run("Mother Dairy Milk 1L", 66.00, 40, "Dairy", "Supermarket", "Reliance Retail");
    stmt.run("Maggi 2-Minute Noodles 140g", 30.00, 200, "Packaged Food", "Supermarket", "Vishal Mega Mart");
    stmt.run("Lays India's Magic Masala 50g", 20.00, 150, "Snacks", "Supermarket", "Vishal Mega Mart");
    stmt.run("Parle-G Biscuits 100g", 10.00, 300, "Snacks", "Supermarket", "Vishal Mega Mart");
    stmt.run("Surf Excel Matic Liquid 1L", 210.00, 25, "Home Care", "Supermarket", "Vishal Mega Mart");
    stmt.run("Colgate MaxFresh 150g", 110.00, 80, "Personal Care", "Supermarket", "Reliance Retail");
    stmt.run("Dettol Handwash 200ml", 99.00, 50, "Personal Care", "Supermarket", "Reliance Retail");
    stmt.run("Red Label Tea 500g", 240.00, 45, "Beverages", "Supermarket", "Reliance Retail");
    stmt.run("Nescafe Classic Coffee 50g", 150.00, 30, "Beverages", "Supermarket", "Vishal Mega Mart");
    stmt.run("Fresh Apples (Kashmiri) 1kg", 180.00, 20, "Fruits & Vegetables", "Supermarket", "Reliance Fresh");
    stmt.run("Fresh Onions 1kg", 45.00, 100, "Fruits & Vegetables", "Supermarket", "Reliance Fresh");
    stmt.run("Kwality Walls Cornetto", 50.00, 60, "Ice Cream", "Supermarket", "Reliance Fresh");
    stmt.run("Britannia Good Day 150g", 25.00, 120, "Snacks", "Supermarket", "Vishal Mega Mart");
    stmt.run("Coca Cola 1.5L", 80.00, 40, "Beverages", "Supermarket", "Reliance Retail");
    stmt.run("Haldiram's Bhujia 400g", 110.00, 50, "Snacks", "Supermarket", "Vishal Mega Mart");
    stmt.run("Cadbury Dairy Milk Silk 60g", 80.00, 70, "Chocolates", "Supermarket", "Reliance Fresh");
    stmt.run("Godrej No.1 Soap (4 Pack)", 95.00, 45, "Personal Care", "Supermarket", "Vishal Mega Mart");
    stmt.run("Clinic Plus Shampoo 340ml", 195.00, 30, "Personal Care", "Supermarket", "Reliance Retail");

    // Restaurant items
    stmt.run("Paneer Butter Masala", 180.00, 20, "Main Course", "Restaurant", "Sharma Ji Dhaba");
    stmt.run("Dal Makhani", 140.00, 30, "Main Course", "Restaurant", "Sharma Ji Dhaba");
    stmt.run("Butter Naan", 40.00, 100, "Breads", "Restaurant", "Sharma Ji Dhaba");
    stmt.run("Veg Momos (8 pcs)", 60.00, 40, "Fast Food", "Restaurant", "Chopsticks Corner");
    stmt.run("Chicken Chowmein", 110.00, 25, "Fast Food", "Restaurant", "Chopsticks Corner");
    stmt.run("Chhole Bhature", 80.00, 35, "Street Food", "Restaurant", "Bikaner Sweets");
    stmt.run("Samosa (2 pcs) with Chutney", 30.00, 50, "Snacks", "Restaurant", "Bikaner Sweets");
    stmt.run("Special Masala Dosa", 120.00, 20, "South Indian", "Restaurant", "Anna's Kitchen");
    stmt.run("Idli Sambar (2 pcs)", 60.00, 50, "South Indian", "Restaurant", "Anna's Kitchen");
    stmt.run("Chicken Biryani", 220.00, 30, "Main Course", "Restaurant", "Karim's Local");
    stmt.run("Veg Hakka Noodles", 100.00, 40, "Fast Food", "Restaurant", "Chopsticks Corner");
    stmt.run("Pani Puri (10 pcs)", 40.00, 100, "Street Food", "Restaurant", "Bikaner Sweets");
    stmt.finalize();

    // Seed reviews
    const reviewStmt = db.prepare("INSERT INTO reviews (product_id, customer_name, rating, comment) VALUES (?, ?, ?, ?)");
    reviewStmt.run(1, "Ravi Kumar", 5, "Fresh and nice packing!");
    reviewStmt.run(2, "Priya Singh", 4, "Good quality rice.");
    reviewStmt.run(24, "Amit Patel", 5, "Best paneer butter masala in town!");
    reviewStmt.run(27, "Sneha Gupta", 4, "Momos are crispy and delicious.");
    reviewStmt.run(33, "Rahul Verma", 5, "Biryani is just amazing!");
    reviewStmt.finalize();

    console.log('Database seeded successfully!');
  });
});

// ==================== REST API ====================

// Get all inventory (with optional search & filter)
app.get('/api/inventory', (req, res) => {
  const { search, type } = req.query;
  let sql = "SELECT * FROM inventory";
  let params = [];
  let conditions = [];

  if (search) {
    conditions.push("(name LIKE ? OR category LIKE ? OR vendor_name LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (type && type !== 'All') {
    conditions.push("vendor_type = ?");
    params.push(type);
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " ORDER BY vendor_type, category, name";

  console.log(`[API] Fetching inventory - Search: "${search || ''}", Type: "${type || 'All'}"`);
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('[API] Inventory Error:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log(`[API] Sending ${rows.length} items to client`);
    res.json(rows);
  });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single order
app.get('/api/orders/:id', (req, res) => {
  db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Order not found' });
    res.json(row);
  });
});

// Get reviews for a product
app.get('/api/reviews/:productId', (req, res) => {
  db.all("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC", [req.params.productId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Post a review
app.post('/api/reviews', (req, res) => {
  const { product_id, customer_name, rating, comment } = req.body;
  if (!product_id || !customer_name || !rating) {
    return res.status(400).json({ error: 'product_id, customer_name, and rating are required' });
  }
  db.run("INSERT INTO reviews (product_id, customer_name, rating, comment) VALUES (?, ?, ?, ?)",
    [product_id, customer_name, rating, comment], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    });
});

// Add new product (Vendor)
app.post('/api/inventory', (req, res) => {
  const { name, price, quantity, category, vendor_type, vendor_name } = req.body;
  if (!name || !price || quantity === undefined) {
    return res.status(400).json({ error: 'name, price, and quantity are required' });
  }
  db.run("INSERT INTO inventory (name, price, quantity, category, vendor_type, vendor_name) VALUES (?, ?, ?, ?, ?, ?)",
    [name, price, quantity, category || 'General', vendor_type || 'Supermarket', vendor_name || 'Local Vendor'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      // Broadcast updated inventory
      db.all("SELECT * FROM inventory ORDER BY vendor_type, category, name", [], (err2, rows) => {
        if (!err2) io.emit('inventory_update', rows);
      });
      res.json({ success: true, id: this.lastID });
    });
});

// Update product (Vendor)
app.put('/api/inventory/:id', (req, res) => {
  const { name, price, quantity, category, vendor_type, vendor_name } = req.body;
  db.run("UPDATE inventory SET name=COALESCE(?,name), price=COALESCE(?,price), quantity=COALESCE(?,quantity), category=COALESCE(?,category), vendor_type=COALESCE(?,vendor_type), vendor_name=COALESCE(?,vendor_name) WHERE id=?",
    [name, price, quantity, category, vendor_type, vendor_name, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.all("SELECT * FROM inventory ORDER BY vendor_type, category, name", [], (err2, rows) => {
        if (!err2) io.emit('inventory_update', rows);
      });
      res.json({ success: true, changes: this.changes });
    });
});

// Delete product (Vendor)
app.delete('/api/inventory/:id', (req, res) => {
  db.run("DELETE FROM inventory WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.all("SELECT * FROM inventory ORDER BY vendor_type, category, name", [], (err2, rows) => {
      if (!err2) io.emit('inventory_update', rows);
    });
    res.json({ success: true, changes: this.changes });
  });
});

// Dashboard stats (Vendor)
app.get('/api/stats', (req, res) => {
  const stats = {};
  db.get("SELECT COUNT(*) as total, SUM(quantity) as totalStock FROM inventory", [], (err, inv) => {
    stats.totalProducts = inv ? inv.total : 0;
    stats.totalStock = inv ? inv.totalStock : 0;
    db.get("SELECT COUNT(*) as total, SUM(total_amount) as revenue FROM orders", [], (err2, ord) => {
      stats.totalOrders = ord ? ord.total : 0;
      stats.totalRevenue = ord ? ord.revenue || 0 : 0;
      db.get("SELECT COUNT(*) as pending FROM orders WHERE status='Pending'", [], (err3, pend) => {
        stats.pendingOrders = pend ? pend.pending : 0;
        db.get("SELECT COUNT(*) as delivered FROM orders WHERE status='Delivered'", [], (err4, del) => {
          stats.deliveredOrders = del ? del.delivered : 0;
          res.json(stats);
        });
      });
    });
  });
});

// ==================== Socket.io Real-Time ====================
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send initial inventory
  db.all("SELECT * FROM inventory ORDER BY vendor_type, category, name", [], (err, rows) => {
    if (!err) socket.emit('inventory_update', rows);
  });

  // Handle vendor stock update
  socket.on('update_stock', (data) => {
    const { id, quantity } = data;
    db.run("UPDATE inventory SET quantity = ? WHERE id = ?", [quantity, id], function(err) {
      if (!err) {
        db.all("SELECT * FROM inventory ORDER BY vendor_type, category, name", [], (err2, rows) => {
          if (!err2) io.emit('inventory_update', rows);
        });
      }
    });
  });

  // Handle order placement
  socket.on('place_order', (orderData) => {
    const { customerName, address, phone, items, totalAmount, deliveryNotes } = orderData;

    if (!customerName || !address || !items || items.length === 0) {
      socket.emit('order_error', { message: 'Please fill all required fields' });
      return;
    }

    db.serialize(() => {
      // Deduct inventory
      items.forEach(item => {
        db.run("UPDATE inventory SET quantity = MAX(0, quantity - ?) WHERE id = ?", [item.qty, item.id]);
      });

      // Insert order
      db.run("INSERT INTO orders (customer_name, address, phone, total_amount, status, items, delivery_notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [customerName, address, phone || '', totalAmount, 'Pending', JSON.stringify(items), deliveryNotes || ''],
        function(err) {
          if (err) {
            console.error('Order error:', err);
            socket.emit('order_error', { message: 'Failed to place order' });
            return;
          }

          // Broadcast updates
          db.all("SELECT * FROM inventory ORDER BY vendor_type, category, name", [], (err2, rows) => {
            if (!err2) io.emit('inventory_update', rows);
          });
          db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err3, orders) => {
            if (!err3) io.emit('order_update', orders);
          });

          socket.emit('order_success', { orderId: this.lastID, status: 'Pending' });
        }
      );
    });
  });

  // Update order status (Vendor)
  socket.on('update_order_status', (data) => {
    const { orderId, status } = data;
    db.run("UPDATE orders SET status = ? WHERE id = ?", [status, orderId], function(err) {
      if (!err) {
        db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err2, rows) => {
          if (!err2) io.emit('order_update', rows);
        });
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Fallback route - serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`LocalMart server running on http://localhost:${PORT}`);
});
