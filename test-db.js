require("dotenv").config();

const pool = require("./db");

async function testConnection() {
  try {
    const result = await pool.query(
      "SELECT id, name, category, price_kobo FROM products ORDER BY id"
    );

    console.table(result.rows);
  } catch (error) {
    console.error("Query failed:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();