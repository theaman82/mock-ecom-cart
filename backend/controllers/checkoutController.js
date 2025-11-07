import Cart from "../models/cartModel.js";

export const checkout = async (req, res) => {
  try {
    const { cartItems, name, email } = req.body;

    // calculate total
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.qty;
    });

    const receipt = {
      name,
      email,
      total,
      items: cartItems,
      timestamp: new Date().toISOString(),
    };

    // Clear the cart after successful checkout
    await Cart.findOneAndUpdate({}, { items: [] }, { new: true });

    res.json(receipt);
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Checkout failed" });
  }
};
