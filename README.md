# ☕ Berkesan Coffee - Shop Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)
![MySQL](https://img.shields.io/badge/mysql-8.0+-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> Sistem manajemen coffee shop modern dengan frontend yang elegan dan backend API yang powerful. Dibangun dengan HTML/CSS/JavaScript, Express.js, dan MySQL.

## 📸 Preview

### Landing Page
![Landing Page](frontend/public/assets/img/kopi.jpeg)

Tampilan modern dengan design system yang konsisten:
- **Landing Page** - Intro coffee shop dengan menu navigasi
- **Order Page** - Pesan menu dengan UI keranjang interaktif
- **Admin Dashboard** - Dashboard untuk manage menu, order, dan reservasi
- **Reservation System** - Sistem reservasi tempat yang user-friendly

---

## 🎯 Fitur Utama

### 👥 Customer Features
- ✅ **Authentication** - Register dan login dengan JWT token
- ✅ **Browse Menu** - Lihat semua menu dengan filter kategori
- ✅ **Order System** - Pesan menu dengan keranjang belanja
- ✅ **Reservation** - Reservasi tempat untuk acara/group
- ✅ **Order History** - Lihat riwayat pemesanan
- ✅ **Contact** - Direct WhatsApp untuk order bulk/event

### 👨‍💼 Admin Features
- ✅ **Dashboard** - Overview statistik penjualan
- ✅ **Menu Management** - CRUD menu items
- ✅ **Order Management** - Track dan manage order status
- ✅ **Reservation Management** - Approval dan manage reservasi
- ✅ **Analytics** - Grafik penjualan 7 hari terakhir
- ✅ **Customer Management** - List dan manage customer

---

## 🏗️ Struktur Project

```
Berkesan-coffee-shop-management-system/
│
├── 📂 frontend/                          
│   ├── public/
│   │   ├── assets/
│   │   │   ├── img/
│   │   │   │   └── kopi.jpeg
│   │   │   └── css/
│   │   ├── pages/
│   │   │   ├── order.html
│   │   │   ├── about.html
│   │   │   ├── reservation.html
│   │   │   └── menu.html
│   │   └── js/
│   │       ├── api.js                   
│   │       ├── order.js
│   │       └── menu.js
│   ├── admin/
│   │   ├── index.html
│   │   ├── css/
│   │   │   └── index.css
│   │   └── js/
│   │       └── dashboard.js
│   ├── index.html                       
│   └── README.md
│
├── 📂 backend/                           
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js              
│   │   ├── controllers/
│   │   │   ├── authController.js        
│   │   │   ├── menuController.js        
│   │   │   ├── orderController.js       
│   │   │   ├── reservationController.js 
│   │   │   └── adminController.js       
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── menuRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── reservationRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js                  
│   │   │   ├── validation.js            
│   │   │   └── errorHandler.js          
│   │   ├── utils/
│   │   │   ├── response.js              
│   │   │   └── validators.js            
│   │   └── server.js                    
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── API_DOCS.md                      
│   └── README.md
│
├── 📂 database/
│   ├── schema.sql                       
│   ├── dummy_data.sql                   
│   └── README.md
│
├── .gitignore                           
├── README.md                            
├── CONTRIBUTING.md                      
└── LICENSE
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- MySQL 8.0+
- Git
- Tailscale (untuk akses kolaboratif)

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/fhdytt/Berkesan-coffee-shop-management-system.git
cd Berkesan-coffee-shop-management-system
```

#### 2. Setup Database
```bash
# Login ke MySQL
mysql -u root -p

# Jalankan script setup
mysql -u root -p < database/schema.sql

# Verify
mysql -u berkesan_user -p -e "USE berkesan_coffee; SHOW TABLES;"
```

#### 3. Setup Backend
```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env dengan credential Anda
nano .env

# Install dependencies
npm install

# Start backend
npm run dev
# Server berjalan di http://localhost:3000
```

#### 4. Run Frontend
```bash
# Buka folder frontend
cd ../frontend

# Gunakan Live Server atau simple HTTP server
npx http-server -p 5000
# Akses di http://localhost:5000
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3000/api
Production: http://<ubuntu-ip>:3000/api
```

### Authentication Endpoints

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "081234567890"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

### Menu Endpoints

**Get All Menu**
```http
GET /api/menu

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Espresso",
      "price": 25000,
      "description": "Strong Italian coffee",
      "category": "Coffee",
      "is_available": true,
      "created_at": "2024-05-14T10:00:00Z"
    }
  ]
}
```

**Create Menu (Admin Only)**
```http
POST /api/menu
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Caramel Latte",
  "price": 45000,
  "description": "Smooth latte with caramel",
  "category": "Coffee"
}

Response:
{
  "success": true,
  "message": "Menu created",
  "data": {
    "id": 2,
    "name": "Caramel Latte",
    "price": 45000
  }
}
```

### Order Endpoints

**Create Order**
```http
POST /api/orders
Content-Type: application/json

{
  "user_id": 1,
  "items": [
    {
      "menu_item_id": 1,
      "quantity": 2,
      "price": 25000
    }
  ],
  "total_price": 50000
}

Response:
{
  "success": true,
  "message": "Order created",
  "data": {
    "orderId": 5,
    "status": "pending"
  }
}
```

**Get All Orders**
```http
GET /api/orders
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": 5,
      "user_id": 1,
      "total_price": 50000,
      "status": "pending",
      "created_at": "2024-05-14T10:00:00Z",
      "items": [
        {
          "id": 1,
          "menu_item_id": 1,
          "name": "Espresso",
          "quantity": 2,
          "price": 25000
        }
      ]
    }
  ]
}
```

**Update Order Status**
```http
PATCH /api/orders/5/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}

Response:
{
  "success": true,
  "message": "Order status updated"
}
```

### Reservation Endpoints

**Create Reservation**
```http
POST /api/reservations
Content-Type: application/json

{
  "user_id": 1,
  "reservation_date": "2024-06-01",
  "reservation_time": "14:00",
  "guests": 4,
  "notes": "Birthday celebration"
}

Response:
{
  "success": true,
  "message": "Reservation created",
  "data": {
    "id": 1,
    "status": "pending"
  }
}
```

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3 + Tailwind CSS** - Modern styling
- **JavaScript (Vanilla)** - Interactive features
- **Font Awesome 6** - Icons
- **Google Fonts** - Typography

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Infrastructure
- **Ubuntu Server** - Linux OS
- **MySQL 8.0** - Database
- **PM2** - Process manager
- **Tailscale** - VPN for remote access
- **Git** - Version control

---

## 📋 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_price DECIMAL(10, 2),
  status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

### Reservations Table
```sql
CREATE TABLE reservations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INT NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔐 Environment Variables

Create `.env` file di folder `backend/`:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DB_HOST=127.0.0.1
DB_USER=berkesan_user
DB_PASSWORD=password123
DB_NAME=berkesan_coffee

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h

# Frontend URL (untuk CORS)
FRONTEND_URL=http://localhost:5000

# Development
DEBUG=true
```

---

## 🚀 Deployment

### Deploy ke Ubuntu Server

```bash
# SSH ke Ubuntu server
ssh -i ~/.ssh/id_rsa username@tailscale-ip

# Navigate ke project
cd ~/projects/Berkesan-coffee-shop-management-system

# Pull latest code
git pull origin main

# Install dependencies
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan credential

# Start dengan PM2
pm2 start src/server.js --name "berkesan-backend"
pm2 save

# Check status
pm2 status

# View logs
pm2 logs berkesan-backend
```

### Access dari Remote

```bash
# Setup Tailscale di Ubuntu (jika belum)
sudo tailscale up

# Get Tailscale IP
tailscale ip -4
# Contoh: 100.92.45.123

# Akses dari laptop teman
# http://100.92.45.123:3000/api/menu
```

---

## 📖 Workflow Kolaborasi

Untuk detail lengkap tentang workflow kolaborasi, lihat **[CONTRIBUTING.md](./CONTRIBUTING.md)**

Quick commands:
```bash
# Setup awal
git clone <repo>
git checkout develop
git pull origin develop

# Mulai feature baru
git checkout -b feature/your-feature-name

# Setelah coding
git add .
git commit -m "feat: description"
git push origin feature/your-feature-name

# Create Pull Request di GitHub
# Merge setelah review
```

---

## 🧪 Testing API

### Menggunakan cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Get all menu
curl http://localhost:3000/api/menu

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id":1,
    "items":[{"menu_item_id":1,"quantity":2,"price":25000}],
    "total_price":50000
  }'
```

### Menggunakan Postman

1. Import collection dari `backend/API_DOCS.md`
2. Set environment variables
3. Test setiap endpoint

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL status
sudo systemctl status mysql

# Verify credentials
mysql -u berkesan_user -p -h 127.0.0.1

# Check if database exists
mysql -u berkesan_user -p -e "SHOW DATABASES;"
```

### Port Already in Use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found
```bash
# Clear node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### JWT Token Error
```
# Make sure to include Authorization header
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/orders
```

---

## 📞 Support & Contact

- **WhatsApp Admin**: [+62 878 8519 0765](https://wa.me/6287885190765)
- **Email**: bulk@berkesancoffee.com
- **Business Hours**: Mon-Sun 08:00-22:00 WIB

---

## 📝 Commit Message Guidelines

Gunakan format berikut untuk commit messages:

```
feat:  tambah fitur baru
fix:   perbaiki bug
docs:  update dokumentasi
style: perbaikan formatting/styling
db:    perubahan database schema
test:  tambah test cases
chore: maintenance tasks
```

Contoh:
```bash
git commit -m "feat: add user authentication with JWT"
git commit -m "fix: fix order calculation bug"
git commit -m "docs: update API documentation"
```

---

## 🤝 Contributing

Sebelum kontribusi, baca **[CONTRIBUTING.md](./CONTRIBUTING.md)** untuk workflow lengkap.

---

## 📄 License

Project ini menggunakan **MIT License** - lihat file [LICENSE](./LICENSE) untuk detail.

---

## 👥 Team

- **Anda** - Full Stack Developer
- **Teman** - Full Stack Developer
- **Berkesan Coffee** - Client/Business Owner

---

## 🎯 Roadmap

- [ ] Payment Gateway Integration (Midtrans/Stripe)
- [ ] SMS Notification untuk order status
- [ ] Email notification untuk reservasi
- [ ] Analytics Dashboard lebih detail
- [ ] Mobile app (React Native)
- [ ] Real-time order tracking
- [ ] Inventory management
- [ ] Staff management system

---

## ✅ Checklist Deployment

- [ ] Database sudah ter-setup dengan schema lengkap
- [ ] .env sudah dikonfigurasi dengan benar
- [ ] npm install sudah selesai
- [ ] Server bisa run tanpa error
- [ ] Frontend bisa akses API dengan lancar
- [ ] Tailscale sudah terinstall dan terkoneksi
- [ ] PM2 sudah setup untuk production
- [ ] SSL/HTTPS sudah dikonfigurasi (optional)
- [ ] Backup database sudah di-setup
- [ ] Monitoring sudah aktif

---

**Last Updated**: 15 Mei 2026  
**Version**: 1.0.0  
**Status**: 🟢 Production Ready

---

Made with ☕ by fhdytt & team
