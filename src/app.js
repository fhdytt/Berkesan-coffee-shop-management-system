const express = require("express");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const authRouter = require("./routes/authRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");
const menuRouter = require("./routes/menuRoutes");
const orderRouter = require("./routes/orderRoutes");
const kasirRouter = require("./routes/kasirRoutes");

const app = express();

// Middleware
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true, limit: "12mb" }));

// static files
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/menu", menuRouter);
app.use("/api/order", orderRouter);
app.use("/api/orders", orderRouter);
app.use("/api/kasir", kasirRouter);

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// About Page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/about.html"));
});

// Menu Page
app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/menu.html"));
});

// Login Page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/login.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/index.html"));
});

app.get("/kasir", (req, res) => {
  res.sendFile(path.join(__dirname, "../kasir/index.html"));
});

// search route
app.get("/search", (req, res) => {
  const query = req.query.q?.toLowerCase();

  const routes = {
    login: "/login",
    about: "/about",
    order: "/menu",
    admin: "/admin",
    kasir: "/kasir",
  };

  if (routes[query]) {
    return res.redirect(routes[query]);
  }

  return res.status(404).send("Pencarian tidak ditemukan");
});

// 404
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

module.exports = app;