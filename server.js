require("dotenv").config();

const express = require("express");
const db = require("./config/db");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");
const customerRoutes = require("./routes/customers");
const inventoryRoutes = require("./routes/inventory");
const tableRoutes = require("./routes/tables");
const app = express();

app.use(express.json());
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/tables", tableRoutes);
app.get("/test-orders", (req, res) => {
    res.send("Orders route is working");
});
// Test MySQL connection
db.getConnection()
    .then(connection => {
        console.log("MySQL connected successfully");
        connection.release();
    })
    .catch(error => {
        console.log("MySQL connection failed:", error.message);
    });

app.get("/", (req, res) => {
    res.send("Restaurant Management System is running");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});