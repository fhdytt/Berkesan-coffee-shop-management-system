const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Import routes
const authRouter = require("./routes/authRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");
const menuRouter = require("./routes/menuRoutes");
const orderRouter = require("./routes/orderRoutes");
const kasirRouter = require("./routes/kasirRoutes");

// Import middleware
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet untuk security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
    },
  },
}));

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:3000', 'https://berkesan.tail119566.ts.net'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============================================
// RATE LIMITING
// ============================================

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 60, // 60 request per menit
  message: { success: false, message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter untuk login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // 10 request per 15 menit
  skipSuccessfulRequests: true, // Hanya hitung failed request
  message: { success: false, message: "Too many login attempts, please try again after 15 minutes" },
});

// Apply rate limiters
app.use(generalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ============================================
// BODY PARSING
// ============================================

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ============================================
// REQUEST LOGGING (Development only)
// ============================================

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// STATIC FILES (Frontend)
// ============================================

const frontendPath = path.join(__dirname, "../../frontend/public");
app.use(express.static(frontendPath, { redirect: false }));

// ============================================
// HEALTH CHECK (for monitoring)
// ============================================

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// FRONTEND ROUTES
// ============================================

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/order", (req, res) => {
  res.sendFile(path.join(frontendPath, "pages/order.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(frontendPath, "pages/about.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(frontendPath, "pages/login.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(frontendPath, "admin/index.html"));
});

app.get("/admin/", (req, res) => {
  res.sendFile(path.join(frontendPath, "admin/index.html"));
});

app.get("/kasir", (req, res) => {
  res.sendFile(path.join(frontendPath, "kasir/index.html"));
});

// ============================================
// ROUTES
// ============================================

app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/menu", menuRouter);
app.use("/api/order", orderRouter);
app.use("/api/kasir", kasirRouter);

// ============================================
// 404 HANDLER (API only)
// ============================================

app.use("/api", (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found` 
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(errorHandler);

module.exports = app;