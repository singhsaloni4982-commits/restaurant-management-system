const express = require("express");
const router = express.Router();

const db = require("../config/db");

// GET all tables
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM restaurant_tables"
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching tables",
            error: error.message
        });
    }
});

// ADD a new table
router.post("/", async (req, res) => {
    try {
        const { table_number, capacity } = req.body;

        const sql = `
            INSERT INTO restaurant_tables
            (table_number, capacity)
            VALUES (?, ?)
        `;

        const [result] = await db.query(sql, [
            table_number,
            capacity
        ]);

        res.status(201).json({
            message: "Table added successfully",
            table_id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding table",
            error: error.message
        });
    }
});

// RESERVE a table
router.put("/:id/reserve", async (req, res) => {
    try {
        const { id } = req.params;

        const [tables] = await db.query(
            "SELECT status FROM restaurant_tables WHERE id = ?",
            [id]
        );

        if (tables.length === 0) {
            return res.status(404).json({
                message: "Table not found"
            });
        }

        if (tables[0].status === "Reserved") {
            return res.status(400).json({
                message: "Table is already reserved"
            });
        }

        await db.query(
            `UPDATE restaurant_tables
             SET status = 'Reserved'
             WHERE id = ?`,
            [id]
        );

        res.json({
            message: "Table reserved successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error reserving table",
            error: error.message
        });
    }
});

// MAKE table available again
router.put("/:id/available", async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            `UPDATE restaurant_tables
             SET status = 'Available'
             WHERE id = ?`,
            [id]
        );

        res.json({
            message: "Table is now available"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating table",
            error: error.message
        });
    }
});

module.exports = router;