import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, checkout, addToCart } from "../api";
import { toast } from "react-hot-toast";
import "./receipt-print.css";

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

  const [errors, setErrors] = useState({ name: "", email: "" });

  const validateForm = () => {
    const newErrors = { name: "", email: "" };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formattedCart = cart.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.discountPrice || item.productId.price,
        qty: item.qty,
      }));

      const res = await checkout({ cartItems: formattedCart, name, email });
      setReceipt(res.data);
      refreshCart();
      
      // Clear form
      setName("");
      setEmail("");
      setErrors({ name: "", email: "" });
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    }
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
              <div>
                <input
                  type="text"
                  placeholder="Name *"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  className={`border ${errors.name ? 'border-red-300' : 'border-teal-200'} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-400' : 'focus:ring-teal-400'}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`border ${errors.email ? 'border-red-300' : 'border-teal-200'} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-400' : 'focus:ring-teal-400'}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={!cart.length}
              className={`w-full px-6 py-3 rounded-lg font-semibold shadow-md transition-all ${
                cart.length
                  ? 'bg-teal-700 hover:bg-teal-800 text-white'
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
            >
              {cart.length ? 'Proceed to Checkout' : 'Cart is Empty'}
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receipt && (
<div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full mx-auto shadow-2xl relative overflow-hidden">
            {/* Success Banner */}
            <div className="bg-teal-700 text-white p-6 text-center relative">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Order Confirmed!</h3>
              <p className="text-teal-100 mt-1">Thank you for your purchase</p>
            </div>

            {/* Receipt Details */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-semibold">{receipt.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-semibold">{receipt.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold">
                      {new Date(receipt.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-semibold">
                      {new Date(receipt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Items</span>
                    <span className="font-semibold">{receipt.items.length} items</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold text-gray-700">Total Amount</span>
                    <span className="text-2xl font-bold text-teal-700">₹{receipt.total}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setReceipt(null)}
                  className="flex-1 w-full px-6 py-2.5 border border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 transition duration-200"
                >
                  Close
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
