import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import Product from "./models/productModel.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecom_cart")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));


const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      {
        name: "Wireless Headphones",
        shortDescription: "Noise cancelling over-ear headphones with premium sound quality.",
        price: 2000,
        discountPrice: 1599,
        image: "https://via.placeholder.com/200?text=Headphones",
        category: "Electronics",
        stock: 20,
      },
      {
        name: "Gaming Mouse",
        shortDescription: "Ergonomic design with RGB lighting and 6 programmable buttons.",
        price: 1200,
        discountPrice: 899,
        image: "https://via.placeholder.com/200?text=Gaming+Mouse",
        category: "Accessories",
        stock: 15,
      },
      {
        name: "Smart Watch",
        shortDescription: "Track heart rate, sleep, and daily activity with waterproof design.",
        price: 2500,
        discountPrice: 1999,
        image: "https://via.placeholder.com/200?text=Smart+Watch",
        category: "Wearables",
        stock: 10,
      },
      {
        name: "Bluetooth Speaker",
        shortDescription: "Portable speaker with deep bass and 12-hour battery life.",
        price: 1800,
        discountPrice: 1399,
        image: "https://via.placeholder.com/200?text=Speaker",
        category: "Electronics",
        stock: 18,
      },
      {
        name: "Mechanical Keyboard",
        shortDescription: "RGB backlit mechanical keyboard with blue switches.",
        price: 3000,
        discountPrice: 2599,
        image: "https://via.placeholder.com/200?text=Keyboard",
        category: "Accessories",
        stock: 12,
      },
      {
        name: "Fitness Band",
        shortDescription: "Compact fitness tracker with step counter and calorie monitor.",
        price: 1500,
        discountPrice: 1199,
        image: "https://via.placeholder.com/200?text=Fitness+Band",
        category: "Wearables",
        stock: 25,
      },
      {
        name: "Smartphone Stand",
        shortDescription: "Adjustable aluminum stand for phones and tablets.",
        price: 700,
        discountPrice: 499,
        image: "https://via.placeholder.com/200?text=Phone+Stand",
        category: "Accessories",
        stock: 30,
      },
      {
        name: "Wireless Charger",
        shortDescription: "Fast-charging pad compatible with all Qi-enabled devices.",
        price: 1300,
        discountPrice: 999,
        image: "https://via.placeholder.com/200?text=Wireless+Charger",
        category: "Electronics",
        stock: 22,
      },
      {
        name: "Laptop Backpack",
        shortDescription: "Water-resistant backpack with USB charging port and laptop sleeve.",
        price: 2200,
        discountPrice: 1799,
        image: "https://via.placeholder.com/200?text=Backpack",
        category: "Accessories",
        stock: 14,
      },
      {
        name: "LED Desk Lamp",
        shortDescription: "Dimmable desk lamp with touch control and night light mode.",
        price: 1600,
        discountPrice: 1249,
        image: "https://via.placeholder.com/200?text=Desk+Lamp",
        category: "Home",
        stock: 17,
      },
    ]);
    console.log("🌱 Mock products added to MongoDB");
  } else {
    console.log("✅ Products already exist in the database");
  }
};

seedProducts();



// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("✅ E-Commerce Cart API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
