import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, checkout, addToCart } from "../api";
import { toast } from "react-hot-toast";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState(null);

  const refreshCart = () => {
    getCart().then((res) => {
      setCart(res.data.items);
      setTotal(res.data.total);
    });
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id).then(() => {
      refreshCart();
      toast.success("Item removed from cart");
    });
  };

  const handleUpdateQty = (productId, newQty) => {
    if (newQty === 0) {
      handleRemove(productId);
      return;
    }

    addToCart({ productId, qty: newQty, replace: true }).then(() => {
      refreshCart();
      toast.success("Quantity updated");
    });
  };

  const handleCheckout = () => {
    const formattedCart = cart.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.discountPrice || item.productId.price,
      qty: item.qty,
    }));

    checkout({ cartItems: formattedCart, name, email }).then((res) => {
      setReceipt(res.data);
      refreshCart();
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-xl mt-8 mb-8 border border-teal-100">
      <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center tracking-tight">
        🛒 Your Cart
      </h2>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <svg
            className="w-16 h-16 text-teal-200 mb-4"
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
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-teal-50">
            {cart.map((item) => {
              const product = item.productId;
              const price = product.discountPrice || product.price;

              return (
                <li
                  key={product._id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={product.image || "https://via.placeholder.com/80"}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover border border-teal-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-teal-700 font-bold text-xl">
                          ₹{price}
                        </span>
                        {product.discountPrice && (
                          <span className="text-sm line-through text-gray-400">
                            ₹{product.price}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          × {item.qty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Subtotal:{" "}
                        <span className="font-semibold text-teal-600">
                          ₹{price * item.qty}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-teal-200 rounded-lg overflow-hidden shadow-sm">
                      <button
                        onClick={() =>
                          handleUpdateQty(product._id, Math.max(0, item.qty - 1))
                        }
                        className="px-3 py-1 text-teal-700 bg-teal-50 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-white text-gray-700 border-x border-teal-100">
                        {item.qty}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQty(product._id, item.qty + 1)
                        }
                        className="px-3 py-1 text-teal-700 bg-teal-50 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="text-red-600 hover:text-white hover:bg-red-500 border border-red-200 rounded-lg px-3 py-1 text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 border-t pt-6 gap-4">
            <div className="flex flex-col items-start">
              <h3 className="font-semibold text-lg">Total:</h3>
              <h3 className="font-bold text-2xl text-teal-700">₹{total}</h3>
            </div>
            <div className="w-full sm:w-auto">
              <h3 className="font-semibold mb-2 text-teal-700">Checkout</h3>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-teal-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full sm:w-40"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-teal-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full sm:w-56"
                />
              </div>
              <button
                onClick={handleCheckout}
                className="w-full sm:w-auto bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-all font-semibold shadow-md"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}

      {receipt && (
        <div className="mt-8 p-6 border border-green-200 rounded-xl bg-green-50 text-green-800 shadow">
          <h3 className="text-2xl font-semibold mb-2">✅ Receipt</h3>
          <p className="mb-1">
            Name: <span className="font-bold">{receipt.name}</span>
          </p>
          <p className="mb-1">
            Email: <span className="font-bold">{receipt.email}</span>
          </p>
          <p className="mb-1">
            Total: <span className="font-bold">₹{receipt.total}</span>
          </p>
          <p className="mb-1">
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
