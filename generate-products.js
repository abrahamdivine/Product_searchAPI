
require("dotenv").config();

const pool = require("./db");

const TARGET_PRODUCTS = 200000;
const BATCH_SIZE = 500;

const productNames = [
  "Samsung Galaxy A15",
  "iPhone 13",
  "Nike Air Max Shoes",
  "Adidas Running Shoes",
  "Wireless Earbuds",
  "Bluetooth Speaker",
  "Laptop Backpack",
  "Smart Watch",
  "USB-C Charger",
  "Gaming Headphones",
  "Men's Casual Shirt",
  "Women's Handbag",
  "Running Sneakers",
  "Water Bottle",
  "Laptop Stand",
  "Power Bank",
  "Wireless Mouse",
  "Cotton T-Shirt",
  "Travel Backpack",
  "Desk Lamp",
];

const categories = [
  "Electronics",
  "Shoes",
  "Accessories",
  "Computers",
  "Clothing",
  "Bags",
  "Home",
  "Sports",
];

const brands = [
  "Samsung",
  "Apple",
  "Nike",
  "Adidas",
  "Sony",
  "Anker",
  "HP",
  "Generic",
  "Puma",
  "Zara",
];

function generateProduct(index) {
  const baseName = productNames[index % productNames.length];

  return {
    name: `${baseName} Model ${index + 1}`,
    description: `Quality ${baseName.toLowerCase()} for everyday use`,
    category: categories[index % categories.length],
    brand: brands[index % brands.length],
    price_kobo: (Math.floor(Math.random() * 50000) + 1000) * 100,
    rating: Number((Math.random() * 4 + 1).toFixed(1)),
    stock: Math.floor(Math.random() * 100),
  };
}

async function generateProducts() {
  try {
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM products"
    );

    const existingCount = Number(countResult.rows[0].count);
    const remaining = TARGET_PRODUCTS - existingCount;

    if (remaining <= 0) {
      console.log(
        `Target already reached. Products in database: ${existingCount}`
      );
      return;
    }

    console.log(`Existing products: ${existingCount}`);
    console.log(`Products still needed: ${remaining}`);

    for (let offset = 0; offset < remaining; offset += BATCH_SIZE) {
      const batchCount = Math.min(
        BATCH_SIZE,
        remaining - offset
      );

      const values = [];
      const placeholders = [];

      for (let i = 0; i < batchCount; i++) {
        const product = generateProduct(existingCount + offset + i);
        const start = i * 7;

        placeholders.push(
          `($${start + 1}, $${start + 2}, $${start + 3}, ` +
          `$${start + 4}, $${start + 5}, $${start + 6}, $${start + 7})`
        );

        values.push(
          product.name,
          product.description,
          product.category,
          product.brand,
          product.price_kobo,
          product.rating,
          product.stock
        );
      }

      await pool.query(
        `INSERT INTO products
        (name, description, category, brand, price_kobo, rating, stock)
        VALUES ${placeholders.join(", ")}`,
        values
      );

      console.log(
        `Progress: ${Math.min(offset + batchCount, remaining)} / ${remaining} new products inserted`
      );
    }

    const finalCount = await pool.query(
      "SELECT COUNT(*) FROM products"
    );

    console.log(
      `Finished! Total products: ${finalCount.rows[0].count}`
    );
  } catch (error) {
    console.error("Product generation failed:", error.message);
  } finally {
    await pool.end();
  }
}

generateProducts();