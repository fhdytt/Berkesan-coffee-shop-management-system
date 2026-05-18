require("dotenv").config();

const express = require("express");

const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

// MIDDLEWARE
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// STATIC FILE
app.use(express.static("public"));

// ROUTES
app.use("/api/auth", authRoutes);

module.exports = app;