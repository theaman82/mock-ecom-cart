import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
