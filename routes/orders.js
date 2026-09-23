const express = require("express");
const router = express.Router();

const db = require("../config/db");

console.log("UPDATED ORDERS.JS LOADED");

// GET ALL ORDERS
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM orders ORDER BY id DESC"
        );

        res.json(rows);

    } catch (error) {
        console.error("Error fetching orders:", error);

        res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        });
    }
});


// PLACE NEW ORDER
router.post("/", async (req, res) => {
    try {

        const {
            customer_name,
            customer_phone,
            item_name,
            quantity
        } = req.body;

        // Check required fields
        if (!customer_name) {
            return res.status(400).json({
                message: "Customer name is required"
            });
        }

        if (!customer_phone) {
            return res.status(400).json({
                message: "Customer phone is required"
            });
        }

        if (!item_name) {
            return res.status(400).json({
                message: "Item name is required"
            });
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }


        // CHECK CUSTOMER
        console.log("Checking customer:", customer_phone);

        const [existingCustomers] = await db.query(
            "SELECT * FROM customers WHERE phone = ?",
            [customer_phone]
        );


        // CREATE CUSTOMER IF NOT EXISTS
        if (existingCustomers.length === 0) {

            console.log("CUSTOMER INSERT CODE REACHED");

            await db.query(
                "INSERT INTO customers (name, phone) VALUES (?, ?)",
                [customer_name, customer_phone]
            );

            console.log(
                "Customer created:",
                customer_name,
                customer_phone
            );

        } else {

            console.log(
                "Customer already exists:",
                customer_name,
                customer_phone
            );
        }


        // FIND MENU ITEM
        const [menuItems] = await db.query(
            "SELECT * FROM menu_items WHERE name = ?",
            [item_name]
        );

        if (menuItems.length === 0) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }


        // GET PRICE
        const price = Number(menuItems[0].price);


        // CALCULATE TOTAL
        const total_price = price * Number(quantity);


        // CHECK INVENTORY
        const [inventory] = await db.query(
            "SELECT * FROM inventory WHERE item_name = ?",
            [item_name]
        );

        if (inventory.length === 0) {
            return res.status(404).json({
                message: "Item not available in inventory"
            });
        }


        // CHECK STOCK
        const availableQuantity = Number(inventory[0].quantity);
        const requestedQuantity = Number(quantity);

        if (availableQuantity < requestedQuantity) {
            return res.status(400).json({
                message: "Not enough inventory available",
                available: availableQuantity,
                requested: requestedQuantity
            });
        }


        // INSERT ORDER
        const [result] = await db.query(
            `
            INSERT INTO orders
            (customer_name, item_name, quantity, total_price)
            VALUES (?, ?, ?, ?)
            `,
            [
                customer_name,
                item_name,
                requestedQuantity,
                total_price
            ]
        );


        // REDUCE INVENTORY
        await db.query(
            `
            UPDATE inventory
            SET quantity = quantity - ?
            WHERE item_name = ?
            `,
            [
                requestedQuantity,
                item_name
            ]
        );


        // SUCCESS RESPONSE
        res.status(201).json({
            message: "Order placed successfully",
            order_id: result.insertId,
            customer: customer_name,
            item: item_name,
            quantity: requestedQuantity,
            price: price,
            total_price: total_price
        });

    } catch (error) {

        console.error("ERROR PLACING ORDER:", error);

        res.status(500).json({
            message: "Error placing order",
            error: error.message
        });
    }
});


// UPDATE ORDER STATUS
router.put("/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        const [result] = await db.query(
            `
            UPDATE orders
            SET status = ?
            WHERE id = ?
            `,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully"
        });

    } catch (error) {

        console.error("Error updating order:", error);

        res.status(500).json({
            message: "Error updating order",
            error: error.message
        });
    }
});


// DELETE ORDER
router.delete("/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM orders WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order deleted successfully"
        });

    } catch (error) {

        console.error("Error deleting order:", error);

        res.status(500).json({
            message: "Error deleting order",
            error: error.message
        });
    }
});


module.exports = router;