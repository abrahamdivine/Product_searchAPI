require("dotenv").config();

const pool = require("./db");

const products = [
  {
    name: "Samsung Galaxy A15",
    description: "Samsung smartphone with a clear display",
    category: "Electronics",
    brand: "Samsung",
    price_kobo: 25000000,
    rating: 4.5,
    stock: 10,
  },
  {
    name: "Nike Air Max Shoes",
    description: "Comfortable sports shoes for everyday wear",
    category: "Shoes",
    brand: "Nike",
    price_kobo: 4500000,
    rating: 4.7,
    stock: 8,
  },
  {
    name: "Samsung Wireless Earbuds",
    description: "Wireless earbuds with clear sound",
    category: "Electronics",
    brand: "Samsung",
    price_kobo: 8000000,
    rating: 4.2,
    stock: 15,
  },
];

async function seedProducts() {
  try {
    for (const product of products) {
      await pool.query(
        `INSERT INTO products
        (name, description, category, brand, price_kobo, rating, stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          product.name,
          product.description,
          product.category,
          product.brand,
          product.price_kobo,
          product.rating,
          product.stock,
        ]
      );
    }

    console.log("Test products added successfully!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await pool.end();
  }
}

seedProducts();