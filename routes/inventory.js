const express = require("express");
const router = express.Router();

const db = require("../config/db");

// GET all inventory items
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM inventory");

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching inventory",
            error: error.message
        });
    }
});

// POST a new inventory item
router.post("/", async (req, res) => {
    try {
        const { item_name, quantity, unit } = req.body;

        const sql = `
            INSERT INTO inventory (item_name, quantity, unit)
            VALUES (?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            item_name,
            quantity,
            unit
        ]);

        res.status(201).json({
            message: "Inventory item added successfully",
            inventory_id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding inventory",
            error: error.message
        });
    }
});

// UPDATE inventory
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { item_name, quantity, unit } = req.body;

        const sql = `
            UPDATE inventory
            SET item_name = ?, quantity = ?, unit = ?
            WHERE id = ?
        `;

        const [result] = await db.query(sql, [
            item_name,
            quantity,
            unit,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Inventory item not found"
            });
        }

        res.json({
            message: "Inventory updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating inventory",
            error: error.message
        });
    }
});

// DELETE inventory item
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM inventory WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Inventory item not found"
            });
        }

        res.json({
            message: "Inventory item deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting inventory",
            error: error.message
        });
    }
});

module.exports = router;