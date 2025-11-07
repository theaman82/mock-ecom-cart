import Cart from "../models/cartModel.js";

// 🛒 Get Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate({
      path: "items.productId",
      select: "name price _id"
    });
    
    if (!cart) return res.json({ items: [], total: 0 });

    let total = 0;
    cart.items.forEach((item) => {
      if (item.productId && item.productId.price) {
        total += item.productId.price * item.qty;
      }
    });

    res.json({ items: cart.items, total });
  } catch (err) {
    console.error("Error in getCart:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ➕ Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, qty, replace = false } = req.body;

    let cart = await Cart.findOne();
    if (!cart) cart = new Cart({ items: [] });

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.qty = replace ? qty : existingItem.qty + qty;
    } else {
      cart.items.push({ productId, qty });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "name price _id"
    });
    
    res.json(populatedCart);
  } catch (err) {
    console.error("Error in addToCart:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ❌ Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    let cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== id
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error in removeFromCart:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
