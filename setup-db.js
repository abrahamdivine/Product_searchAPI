require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("./db");

async function setupDatabase() {
  try {
    const schema = fs.readFileSync(
      path.join(__dirname, "schema.sql"),
      "utf8"
    );

    await pool.query(schema);

    console.log("Products table created successfully!");
  } catch (error) {
    console.error("Database setup failed:", error.message);
  } finally {
    await pool.end();
  }
}
setupDatabase();