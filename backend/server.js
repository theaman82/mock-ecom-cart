import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables (optional but good practice)
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
        shortDescription: "Noise cancelling over-ear headphones",
        price: 2000,
        discountPrice: 1599,
        image: "https://via.placeholder.com/200",
        category: "Electronics",
        stock: 20,
      },
      {
        name: "Gaming Mouse",
        shortDescription: "RGB lighting, 6 programmable buttons",
        price: 1200,
        discountPrice: 899,
        image: "https://via.placeholder.com/200",
        category: "Accessories",
        stock: 15,
      },
      {
        name: "Smart Watch",
        shortDescription: "Heart rate and sleep tracker",
        price: 2500,
        discountPrice: 1999,
        image: "https://via.placeholder.com/200",
        category: "Wearables",
        stock: 10,
      },
    ]);
    console.log("🌱 Mock products added to MongoDB");
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
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
