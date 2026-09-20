const express = require("express");
const router = express.Router();

const db = require("../config/db");

// GET all menu items
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM menu_items");
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching menu items",
            error: error.message
        });
    }
});

// POST a new menu item
router.post("/", async (req, res) => {
    try {
        const { name, price, category } = req.body;

        const sql = `
            INSERT INTO menu_items (name, price, category)
            VALUES (?, ?, ?)
        `;

        const [result] = await db.query(sql, [name, price, category]);

        res.status(201).json({
            message: "Menu item added successfully",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding menu item",
            error: error.message
        });
    }
});
// DELETE a menu item
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM menu_items WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.json({
            message: "Menu item deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting menu item",
            error: error.message
        });
    }
});
// UPDATE a menu item
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category } = req.body;

        const sql = `
            UPDATE menu_items
            SET name = ?, price = ?, category = ?
            WHERE id = ?
        `;

        const [result] = await db.query(sql, [
            name,
            price,
            category,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.json({
            message: "Menu item updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating menu item",
            error: error.message
        });
    }
});

module.exports = router;