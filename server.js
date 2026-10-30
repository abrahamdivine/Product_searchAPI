const express = require("express");
require("dotenv").config();

const pool = require("./db");
const app = express();

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to FindIt Product Search API",
    status: "Running!",
  });
});
 // Get products using cursor-based pagination
app.get("/products", async (req, res) => {
  try {
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit) || 10)
    );

    const lastId = req.query.lastId
      ? Number(req.query.lastId)
      : 0;

    if (
      !Number.isSafeInteger(lastId) ||
      lastId < 0
    ) {
      return res.status(400).json({
        error: "Invalid lastId cursor"
      });
    }

    const result = await pool.query(
      `SELECT * FROM products
       WHERE id > $1
       ORDER BY id ASC
       LIMIT $2`,
      [lastId, limit]
    );

    const products = result.rows;

    const nextCursor =
      products.length > 0
        ? products[products.length - 1].id
        : null;

    res.json({
      count: products.length,
      nextCursor,
      hasMore: products.length === limit,
      products
    });

  } catch (error) {
    console.error("Error fetching products:", error.stack);

    res.status(500).json({
      error: error.message
    });
  }
});

 // Product name suggestions (autocomplete)
app.get("/products/suggestions", async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || search.trim().length < 2) {
      return res.json({
        count: 0,
        suggestions: []
      });
    }

    const result = await pool.query(
      `SELECT id, name, brand, price_kobo
       FROM products
       WHERE name ILIKE $1
       ORDER BY name ASC
       LIMIT 10`,
      [`${search.trim()}%`]
    );

    res.json({
      count: result.rows.length,
      suggestions: result.rows
    });

  } catch (error) {
    console.error("Suggestion error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});
// Search products by name
app.get("/products/search", async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        error: "Please provide a search term",
      });
    }

    const result = await pool.query(
      "SELECT * FROM products WHERE name ILIKE $1 ORDER BY id LIMIT 10",
      [`%${search}%`]
    );

    res.json({
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    console.error("Search error:", error.stack);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`FindIt server running on port ${PORT}`);
});