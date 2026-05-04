# 🛒 LocalMart - Hyperlocal Community Commerce Engine

LocalMart is a high-performance hyperlocal commerce platform designed for Tier 2/3 markets. It connects local vendors (supermarkets and restaurants) with community consumers in real-time, providing a seamless, low-friction shopping experience.

## 🚀 Features

### 🛒 Consumer Storefront
- **Real-time Inventory**: View live stock updates from local vendors.
- **Search & Filter**: Find products quickly by name, category, or vendor type.
- **Smart Cart**: Advanced cart management with quantity controls and persistence.
- **Order Tracking**: Real-time status updates (Pending → Accepted → Delivered).
- **Review System**: Rate and review local products to help the community.

### 🏢 Vendor OS (Dashboard)
- **Real-time Sync**: Update stock levels that reflect instantly on the consumer app.
- **Live Order Stream**: Manage incoming orders with one-click status updates.
- **Inventory Management**: Add new products or delete old ones with ease.
- **Business Insights**: Dashboard stats for Total Orders, Revenue, and Stock Levels.
- **Digital Billing**: Generate receipts and "send" SMS notifications.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Glassmorphism UI), JavaScript (ES6+).
- **Backend**: Node.js, Express.
- **Database**: SQLite (Persistent storage).
- **Real-time**: Socket.io for bi-directional live communication.
- **Design**: Premium aesthetics with Google Fonts (Inter) and HSL-tailored color palettes.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js installed on your machine.

### Quick Start (Windows)
1. Double-click **`RUN_ME.bat`** in the project folder.
2. The project will open automatically at `http://localhost:3000`.

### VS Code (Recommended)
1. Open the project folder in VS Code.
2. Press **F5** to start both the server and the frontend.

### Manual Setup
1. **Install Dependencies**: `npm install`
2. **Start Server**: `npm start`
3. **Access App**: Visit `http://localhost:3000` in your browser.

---

## 📂 Project Structure

```text
FINAL PROJECT/
├── server.js              # Node.js backend & API routes
├── localmart.db           # Persistent SQLite database
├── package.json           # Project metadata and dependencies
└── public/                # Frontend assets
    ├── index.html         # Consumer Storefront
    ├── vendor.html        # Vendor Portal
    ├── css/
    │   └── style.css      # Custom styling & animations
    └── js/
        ├── app.js         # Consumer logic & socket handling
        └── vendor.js      # Vendor dashboard & inventory logic
```

## 📝 License
This project is for educational/hackathon purposes.
