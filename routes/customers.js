const express = require("express");
const router = express.Router();

const db = require("../config/db");

// GET all customers
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM customers");

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching customers",
            error: error.message
        });
    }
});

// POST a new customer
router.post("/", async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        const sql = `
            INSERT INTO customers (name, phone, email)
            VALUES (?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            name,
            phone,
            email
        ]);

        res.status(201).json({
            message: "Customer added successfully",
            customer_id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding customer",
            error: error.message
        });
    }
});
// UPDATE a customer
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, email } = req.body;

        const sql = `
            UPDATE customers
            SET name = ?, phone = ?, email = ?
            WHERE id = ?
        `;

        const [result] = await db.query(sql, [
            name,
            phone,
            email,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json({
            message: "Customer updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating customer",
            error: error.message
        });
    }
});

// DELETE a customer
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM customers WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json({
            message: "Customer deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting customer",
            error: error.message
        });
    }
});

module.exports = router;