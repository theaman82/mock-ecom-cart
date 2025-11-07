import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, checkout, addToCart } from "../api";
import { toast } from "react-hot-toast";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState({ subtotal: 0, discount: 0, total: 0 });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState(null);

  const refreshCart = async () => {
    const res = await getCart();
    const items = res.data.items || [];
    setCart(items);
    setSummary(res.data.summary || { subtotal: 0, discount: 0, total: 0 });
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const handleRemove = async (id) => {
    await removeFromCart(id);
    toast.success("Item removed from cart");
    refreshCart();
  };

  const handleUpdateQty = async (productId, newQty) => {
    if (newQty <= 0) {
      handleRemove(productId);
      return;
    }
    await addToCart({ productId, qty: newQty, replace: true });
    toast.success("Quantity updated");
    refreshCart();
  };

  const handleCheckout = async () => {
    const formattedCart = cart.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.discountPrice || item.productId.price,
      qty: item.qty,
    }));

    const res = await checkout({ cartItems: formattedCart, name, email });
    setReceipt(res.data);
    refreshCart();
  };

  return (
    <div className="max-w-6xl mx-auto py-[15%] md:py-[10%] px-5">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="w-20 h-20 text-teal-200 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L7.5 15.75A2.25 2.25 0 009.664 18h7.086a2.25 2.25 0 002.164-1.5l3.024-7.56a1.125 1.125 0 00-1.05-1.5H6.343m-1.237 0l-.383-1.437m0 0L4.5 4.5m0 0V3m0 1.5h16.5"
            />
          </svg>
          <p className="text-gray-500 text-2xl font-semibold">
            Your cart is empty.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-teal-100">
            <h2 className="text-2xl font-bold text-teal-700 mb-4">
              Your Cart
            </h2>
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => {
                const product = item.productId;
                const hasDiscount = product.discountPrice && product.discountPrice < product.price;
                const price = hasDiscount ? product.discountPrice : product.price;

                return (
                  <li
                    key={product._id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 gap-5"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={product.image || "https://picsum.photos/200?random=${product.id}"}
                        alt={product.name}
                        className="w-20 h-20 rounded-lg object-contain border border-gray-100 bg-white"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-teal-700 font-bold text-lg">
                            ₹{price}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm line-through text-gray-400">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Subtotal:{" "}
                          <span className="font-semibold text-teal-600">
                            ₹{price * item.qty}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-teal-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleUpdateQty(product._id, item.qty - 1)}
                          className="px-3 py-1 text-teal-700 hover:bg-teal-50 transition"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 bg-white text-gray-700 border-x border-teal-100">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(product._id, item.qty + 1)}
                          className="px-3 py-1 text-teal-700 hover:bg-teal-50 transition"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 rounded-lg px-3 py-1 text-sm font-medium transition"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="bg-teal-50 p-6 rounded-xl shadow-lg border border-teal-100">
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">
              Order Summary
            </h3>

            <div className="space-y-2 mb-6">
              <p className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>₹{summary.subtotal}</span>
              </p>
              <p className="flex justify-between text-gray-700">
                <span>Discount:</span>
                <span className="text-green-600">- ₹{summary.discount}</span>
              </p>
              <hr />
              <p className="flex justify-between font-bold text-xl text-teal-700">
                <span>Total:</span>
                <span>₹{summary.total}</span>
              </p>
            </div>

            <h4 className="font-semibold mb-2 text-teal-700">Checkout</h4>
            <div className="flex flex-col gap-3 mb-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-teal-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-teal-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-all font-semibold shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {receipt && (
        <div className="mt-10 p-6 border border-green-200 rounded-xl bg-green-50 text-green-800 shadow">
          <h3 className="text-2xl font-semibold mb-2">✅ Receipt</h3>
          <p>Name: <span className="font-bold">{receipt.name}</span></p>
          <p>Email: <span className="font-bold">{receipt.email}</span></p>
          <p>Total: <span className="font-bold">₹{receipt.total}</span></p>
          <p>
            Time:{" "}
            <span className="font-bold">
              {new Date(receipt.timestamp).toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Cart;
