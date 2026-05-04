/**
 * DataEngine - Client-side "Database" using LocalStorage
 * This allows the project to run 100% serverless on Live Server.
 */

const DataEngine = {
  // Initial Seed Data
  defaultInventory: [
    { id: 1, name: "Aashirvaad Atta 5kg", price: 250, quantity: 50, category: "Staples", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 2, name: "India Gate Basmati Rice 1kg", price: 120, quantity: 30, category: "Staples", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 3, name: "Tata Salt 1kg", price: 24, quantity: 100, category: "Staples", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 4, name: "Fortune Sunflower Oil 1L", price: 145, quantity: 60, category: "Staples", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 5, name: "Amul Butter 100g", price: 56, quantity: 30, category: "Dairy", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 6, name: "Mother Dairy Milk 1L", price: 66, quantity: 40, category: "Dairy", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 7, name: "Maggi 2-Minute Noodles 140g", price: 30, quantity: 200, category: "Packaged Food", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 8, name: "Lays India's Magic Masala 50g", price: 20, quantity: 150, category: "Snacks", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 9, name: "Paneer Butter Masala", price: 180, quantity: 20, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" },
    { id: 10, name: "Dal Makhani", price: 140, quantity: 30, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" },
    { id: 11, name: "Butter Naan", price: 40, quantity: 100, category: "Breads", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" },
    { id: 12, name: "Veg Momos (8 pcs)", price: 60, quantity: 40, category: "Fast Food", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 13, name: "Chicken Biryani", price: 220, quantity: 30, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Karim's Local" },
    { id: 14, name: "Pani Puri (10 pcs)", price: 40, quantity: 100, category: "Street Food", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 15, name: "Coca Cola 750ml", price: 45, quantity: 80, category: "Beverages", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 16, name: "Oreo Biscuits 120g", price: 35, quantity: 120, category: "Snacks", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 17, name: "Cadbury Dairy Milk 50g", price: 40, quantity: 90, category: "Snacks", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 18, name: "Surf Excel Matic 1kg", price: 190, quantity: 40, category: "Household", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 19, name: "Dettol Liquid Soap 250ml", price: 99, quantity: 55, category: "Personal Care", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 20, name: "Colgate Strong Teeth 200g", price: 110, quantity: 70, category: "Personal Care", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 21, name: "Hakka Noodles", price: 120, quantity: 25, category: "Chinese", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 22, name: "Manchurian Gravy", price: 150, quantity: 20, category: "Chinese", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 23, name: "Spring Rolls (4 pcs)", price: 80, quantity: 35, category: "Fast Food", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 24, name: "Gulab Jamun (2 pcs)", price: 50, quantity: 60, category: "Desserts", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 25, name: "Rajma Chawal", price: 130, quantity: 40, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" },
    { id: 26, name: "Pepsi 2.25L", price: 95, quantity: 50, category: "Beverages", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 27, name: "Nescafe Classic 50g", price: 165, quantity: 45, category: "Beverages", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 28, name: "Haldiram's Bhujia 400g", price: 110, quantity: 80, category: "Snacks", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 29, name: "Britannia Marie Gold 250g", price: 40, quantity: 150, category: "Snacks", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 30, name: "Lifebuoy Total 10 Soap (3x125g)", price: 145, quantity: 60, category: "Personal Care", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 31, name: "Whisper Ultra Clean (15 pads)", price: 199, quantity: 40, category: "Personal Care", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 32, name: "Chole Bhature (2 pcs)", price: 120, quantity: 25, category: "Breakfast", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 33, name: "Masala Dosa", price: 90, quantity: 30, category: "Breakfast", vendor_type: "Restaurant", vendor_name: "Karim's Local" },
    { id: 34, name: "Cold Coffee", price: 80, quantity: 50, category: "Beverages", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 35, name: "Tandoori Chicken (Full)", price: 450, quantity: 15, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Karim's Local" },
    { id: 36, name: "Apple Royal Gala (1kg)", price: 180, quantity: 30, category: "Fruits & Veggies", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 37, name: "Banana Robusta (1 dozen)", price: 60, quantity: 40, category: "Fruits & Veggies", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 38, name: "Potato Jyoti (2kg)", price: 50, quantity: 100, category: "Fruits & Veggies", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 39, name: "Onion Nasik (1kg)", price: 40, quantity: 100, category: "Fruits & Veggies", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 40, name: "Tomato Local (1kg)", price: 30, quantity: 80, category: "Fruits & Veggies", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 41, name: "Britannia Milk Bikis (200g)", price: 30, quantity: 100, category: "Snacks", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 42, name: "Parle-G Gold (500g)", price: 60, quantity: 200, category: "Snacks", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 43, name: "Kellogg's Corn Flakes (475g)", price: 185, quantity: 40, category: "Packaged Food", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 44, name: "Saffola Gold Oil (1L)", price: 175, quantity: 60, category: "Staples", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 45, name: "Daawat Rozana Rice (5kg)", price: 350, quantity: 30, category: "Staples", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 46, name: "Lizol Floor Cleaner (500ml)", price: 95, quantity: 70, category: "Household", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 47, name: "Harpic Toilet Cleaner (750ml)", price: 140, quantity: 80, category: "Household", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 48, name: "Comfort Fabric Conditioner (200ml)", price: 55, quantity: 90, category: "Household", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 49, name: "Vim Dishwash Liquid (500ml)", price: 105, quantity: 100, category: "Household", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 50, name: "Dove Bar Soap (3x100g)", price: 180, quantity: 50, category: "Personal Care", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 51, name: "Head & Shoulders Shampoo (180ml)", price: 165, quantity: 40, category: "Personal Care", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 52, name: "Gillette Foam (200g)", price: 210, quantity: 30, category: "Personal Care", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 53, name: "Sensodyne Toothpaste (75g)", price: 120, quantity: 60, category: "Personal Care", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 54, name: "Red Bull Energy Drink (250ml)", price: 125, quantity: 100, category: "Beverages", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 55, name: "Tropicana Orange Juice (1L)", price: 110, quantity: 50, category: "Beverages", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 56, name: "Real Mixed Fruit Juice (1L)", price: 105, quantity: 60, category: "Beverages", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 57, name: "Lipton Green Tea (25 bags)", price: 155, quantity: 40, category: "Beverages", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 58, name: "Kwality Walls Choco Brownie (700ml)", price: 250, quantity: 20, category: "Dairy", vendor_type: "Supermarket", vendor_name: "Reliance Retail" },
    { id: 59, name: "Amul Cheese Slices (200g)", price: 145, quantity: 50, category: "Dairy", vendor_type: "Supermarket", vendor_name: "Vishal Mega Mart" },
    { id: 60, name: "Paneer Tikka (8 pcs)", price: 210, quantity: 25, category: "Starters", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" },
    { id: 61, name: "Malai Kofta", price: 180, quantity: 20, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" },
    { id: 62, name: "Laccha Paratha", price: 45, quantity: 80, category: "Breads", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" },
    { id: 63, name: "Garlic Naan", price: 55, quantity: 70, category: "Breads", vendor_type: "Restaurant", vendor_name: "Karim's Local" },
    { id: 64, name: "Chicken Seekh Kebab (4 pcs)", price: 160, quantity: 30, category: "Starters", vendor_type: "Restaurant", vendor_name: "Karim's Local" },
    { id: 65, name: "Mutton Rogan Josh", price: 380, quantity: 15, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Karim's Local" },
    { id: 66, name: "Hyderabadi Veg Biryani", price: 190, quantity: 25, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Karim's Local" },
    { id: 67, name: "Honey Chilli Potato", price: 140, quantity: 40, category: "Chinese", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 68, name: "Veg Chowmein", price: 110, quantity: 50, category: "Chinese", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 69, name: "Drums of Heaven (6 pcs)", price: 240, quantity: 20, category: "Chinese", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 70, name: "Spring Rolls (6 pcs)", price: 120, quantity: 35, category: "Fast Food", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 71, name: "Aloo Tikki Burger", price: 50, quantity: 100, category: "Fast Food", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 72, name: "Cheese Loaded Pizza (Medium)", price: 350, quantity: 15, category: "Fast Food", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 73, name: "Pav Bhaji (Special)", price: 110, quantity: 60, category: "Street Food", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 74, name: "Samosa (2 pcs)", price: 30, quantity: 150, category: "Street Food", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 75, name: "Dhokla (250g)", price: 60, quantity: 40, category: "Street Food", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 76, name: "Rasgulla (2 pcs)", price: 40, quantity: 80, category: "Desserts", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 77, name: "Kaju Katli (250g)", price: 240, quantity: 20, category: "Desserts", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 78, name: "Paper Masala Dosa", price: 110, quantity: 30, category: "South Indian", vendor_type: "Restaurant", vendor_name: "Karim's Local" },
    { id: 79, name: "Idli Sambar (2 pcs)", price: 60, quantity: 50, category: "South Indian", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 80, name: "Vada Sambar (2 pcs)", price: 70, quantity: 45, category: "South Indian", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 81, name: "Veg Grilled Sandwich", price: 85, quantity: 40, category: "Breakfast", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 82, name: "Omelette with Toast", price: 70, quantity: 35, category: "Breakfast", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" },
    { id: 83, name: "Poha (Plate)", price: 50, quantity: 60, category: "Breakfast", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 84, name: "Matar Paneer", price: 170, quantity: 30, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" },
    { id: 85, name: "Mix Veg", price: 150, quantity: 40, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" },
    { id: 86, name: "Tandoori Roti", price: 15, quantity: 200, category: "Breads", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" },
    { id: 87, name: "Rumali Roti", price: 20, quantity: 150, category: "Breads", vendor_type: "Restaurant", vendor_name: "Karim's Local" },
    { id: 88, name: "Mutton Biryani (Special)", price: 420, quantity: 10, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Karim's Local" },
    { id: 89, name: "Chicken Curry", price: 280, quantity: 20, category: "Main Course", vendor_type: "Restaurant", vendor_name: "Karim's Local" },
    { id: 90, name: "Veg Manchurian Dry", price: 130, quantity: 45, category: "Chinese", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 91, name: "Veg Fried Rice", price: 120, quantity: 50, category: "Chinese", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 92, name: "Chicken Fried Rice", price: 160, quantity: 30, category: "Chinese", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 93, name: "Schezwan Noodles", price: 140, quantity: 40, category: "Chinese", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 94, name: "French Fries (Large)", price: 90, quantity: 80, category: "Fast Food", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 95, name: "Chicken Burger", price: 110, quantity: 60, category: "Fast Food", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 96, name: "Veg Club Sandwich", price: 120, quantity: 40, category: "Breakfast", vendor_type: "Restaurant", vendor_name: "Chopsticks Corner" },
    { id: 97, name: "Rabri (100g)", price: 60, quantity: 30, category: "Desserts", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 98, name: "Jalebi (250g)", price: 80, quantity: 50, category: "Desserts", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 99, name: "Fruit Salad with Ice Cream", price: 150, quantity: 20, category: "Desserts", vendor_type: "Restaurant", vendor_name: "Bikaner Sweets" },
    { id: 100, name: "Lassi (Sweet/Salted)", price: 50, quantity: 100, category: "Beverages", vendor_type: "Restaurant", vendor_name: "Sharma Ji Dhaba" }
  ],

  init() {
    const DATA_VERSION = '1.1'; // Increment this to force update inventory
    const currentVersion = localStorage.getItem('lm_data_version');
    const existingInv = localStorage.getItem('lm_inventory');

    // Force update if version is old or inventory is missing/small
    if (!existingInv || currentVersion !== DATA_VERSION) {
      localStorage.setItem('lm_inventory', JSON.stringify(this.defaultInventory));
      localStorage.setItem('lm_data_version', DATA_VERSION);
    }
    
    if (!localStorage.getItem('lm_orders')) {
      localStorage.setItem('lm_orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('lm_reviews')) {
      localStorage.setItem('lm_reviews', JSON.stringify([
        { product_id: 1, customer_name: "Ravi Kumar", rating: 5, comment: "Fresh and nice packing!", created_at: new Date() },
        { product_id: 9, customer_name: "Amit Patel", rating: 5, comment: "Best paneer butter masala!", created_at: new Date() }
      ]));
    }
  },

  // Inventory Methods
  getInventory() {
    return JSON.parse(localStorage.getItem('lm_inventory'));
  },

  updateStock(id, quantity) {
    let inv = this.getInventory();
    const index = inv.findIndex(i => i.id == id);
    if (index !== -1) {
      inv[index].quantity = quantity;
      localStorage.setItem('lm_inventory', JSON.stringify(inv));
      this.notify();
    }
  },

  addProduct(product) {
    let inv = this.getInventory();
    product.id = Date.now();
    inv.push(product);
    localStorage.setItem('lm_inventory', JSON.stringify(inv));
    this.notify();
  },

  deleteProduct(id) {
    let inv = this.getInventory();
    inv = inv.filter(i => i.id != id);
    localStorage.setItem('lm_inventory', JSON.stringify(inv));
    this.notify();
  },

  // Order Methods
  getOrders() {
    return JSON.parse(localStorage.getItem('lm_orders'));
  },

  placeOrder(orderData) {
    let orders = this.getOrders();
    const partners = [
      { name: "Rahul Sharma", phone: "98765 43210" },
      { name: "Sandeep Kumar", phone: "87654 32109" },
      { name: "Amit Singh", phone: "76543 21098" },
      { name: "Vikram Raj", phone: "91234 56789" }
    ];
    const partner = partners[Math.floor(Math.random() * partners.length)];
    
    const newOrder = {
      ...orderData,
      id: orders.length + 101,
      status: 'Pending',
      created_at: new Date(),
      delivery_partner: partner,
      eta: Math.floor(Math.random() * 20) + 15 // 15-35 mins
    };
    orders.unshift(newOrder);
    localStorage.setItem('lm_orders', JSON.stringify(orders));

    // Deduct stock
    orderData.items.forEach(item => {
      let inv = this.getInventory();
      const p = inv.find(i => i.id == item.id);
      if (p) {
        p.quantity = Math.max(0, p.quantity - item.qty);
        localStorage.setItem('lm_inventory', JSON.stringify(inv));
      }
    });

    this.notify();
    return newOrder;
  },

  updateOrderStatus(orderId, status) {
    let orders = this.getOrders();
    const index = orders.findIndex(o => o.id == orderId);
    if (index !== -1) {
      orders[index].status = status;
      localStorage.setItem('lm_orders', JSON.stringify(orders));
      this.notify();
    }
  },

  // Review Methods
  getReviews(productId) {
    let reviews = JSON.parse(localStorage.getItem('lm_reviews'));
    return reviews.filter(r => r.product_id == productId);
  },

  addReview(review) {
    let reviews = JSON.parse(localStorage.getItem('lm_reviews'));
    review.created_at = new Date();
    reviews.push(review);
    localStorage.setItem('lm_reviews', JSON.stringify(reviews));
  },

  // Stats
  getStats() {
    const inv = this.getInventory();
    const orders = this.getOrders();
    return {
      totalProducts: inv.length,
      totalStock: inv.reduce((s, i) => s + i.quantity, 0),
      totalOrders: orders.length,
      totalRevenue: orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
      pendingOrders: orders.filter(o => o.status === 'Pending').length,
      deliveredOrders: orders.filter(o => o.status === 'Delivered').length
    };
  },

  // Pub/Sub for Real-time Simulation
  listeners: [],
  onUpdate(callback) {
    this.listeners.push(callback);
  },
  notify() {
    this.listeners.forEach(cb => cb());
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  }
};

DataEngine.init();
