import React, { useEffect, useState } from "react";
import { getProducts, addToCart, getCart } from "../api";
import { toast } from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
    getCart().then((res) => setCart(res.data.items));
  }, []);

  const handleAdd = (id) => {
    addToCart({ productId: id, qty: 1 }).then(() => {
      getCart().then((res) => setCart(res.data.items));
      toast.success("Added to cart!");
    });
  };

  return (
    <div className="container mx-auto px-4 py-[8%]">
      <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center tracking-tight">
        All Products
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-teal-100 flex flex-col justify-between"
          >
            <img
              src={p.image || "https://via.placeholder.com/200"}
              alt={p.name}
              className="rounded-t-2xl w-full h-48 object-contain mt-5"
            />
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-semibold text-xl text-gray-800 mb-2">
                {p.name}
              </h3>
              <p className="text-gray-500 mb-4 text-sm line-clamp-2">
                {p.shortDescription || "No description available."}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  {p.discountPrice ? (
                    <>
                      <span className="text-teal-700 font-bold text-lg">
                        ₹{p.discountPrice}
                      </span>
                      <span className="text-gray-400 text-sm line-through">
                        ₹{p.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-teal-700 font-bold text-lg">
                      ₹{p.price}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAdd(p._id)}
                  className="bg-teal-700 text-white px-5 py-2 rounded-lg hover:bg-teal-800 transition-all font-semibold cursor-pointer shadow"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
