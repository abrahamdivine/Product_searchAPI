require("dotenv").config();

const pool = require("./db");

async function testProducts() {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id LIMIT 10"
    );

     console.log("Query successful!");
    console.log("Products returned:", result.rows.length);
    console.table(result.rows);
  } catch (error) {
    console.error("Database query failed:", error);
  } finally {
    await pool.end();
  }
}

testProducts();