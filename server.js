require("dotenv").config();

const express = require("express");
const db = require("./config/db");

const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");
const customerRoutes = require("./routes/customers");
const inventoryRoutes = require("./routes/inventory");
const tableRoutes = require("./routes/tables");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());

// Serve frontend files from public folder
app.use(express.static("public"));


// ===============================
// API ROUTES
// ===============================

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/tables", tableRoutes);


// ===============================
// TEST ROUTE
// ===============================

app.get("/test-orders", (req, res) => {
    res.send("Orders route is working");
});


// ===============================
// DATABASE CONNECTION TEST
// ===============================

db.getConnection()
    .then(connection => {
        console.log("MySQL connected successfully");
        connection.release();
    })
    .catch(error => {
        console.log("MySQL connection failed:", error.message);
    });


// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


// ===============================
// START SERVER
// ===============================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
