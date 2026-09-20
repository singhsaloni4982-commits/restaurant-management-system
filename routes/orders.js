const express = require("express");
const router = express.Router();

const db = require("../config/db");

// GET all orders
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM orders");

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        });
    }
});

// POST a new order
router.post("/", async (req, res) => {
    try {
        const {
            customer_name,
            item_name,
            quantity
        } = req.body;

        // Find menu item price
        const [menuItems] = await db.query(
            "SELECT price FROM menu_items WHERE name = ?",
            [item_name]
        );

        if (menuItems.length === 0) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        // Get price
        const price = menuItems[0].price;

        // Calculate total price
        const total_price = price * quantity;

        // Check inventory
        const [inventory] = await db.query(
            "SELECT quantity FROM inventory WHERE item_name = ?",
            [item_name]
        );

        if (inventory.length === 0) {
            return res.status(404).json({
                message: "Item not available in inventory"
            });
        }

        // Check stock
        if (inventory[0].quantity < quantity) {
            return res.status(400).json({
                message: "Not enough inventory available"
            });
        }

        // Insert order
        const sql = `
            INSERT INTO orders
            (customer_name, item_name, quantity, total_price)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            customer_name,
            item_name,
            quantity,
            total_price
        ]);

        // Reduce inventory
        await db.query(
            "UPDATE inventory SET quantity = quantity - ? WHERE item_name = ?",
            [quantity, item_name]
        );

        res.status(201).json({
            message: "Order placed successfully",
            order_id: result.insertId,
            total_price: total_price
        });

    } catch (error) {
        res.status(500).json({
            message: "Error placing order",
            error: error.message
        });
    }
});

// UPDATE order status
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const sql = `
            UPDATE orders
            SET status = ?
            WHERE id = ?
        `;

        const [result] = await db.query(sql, [
            status,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating order",
            error: error.message
        });
    }
});

// DELETE an order
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
        res.status(500).json({
            message: "Error deleting order"
        });
    }
});

module.exports = router;