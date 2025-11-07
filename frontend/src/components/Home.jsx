import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-teal-50 to-white min-h-screen">
      <h1 className="text-5xl font-extrabold text-teal-800 mb-4 drop-shadow-sm tracking-tight">
        Welcome to <span className="text-teal-600">E-Com Cart</span>
      </h1>
      <p className="text-gray-600 max-w-xl mb-10 text-lg">
        Discover our curated collection of mock products. Add your favorites to the cart, review your order, and enjoy a seamless checkout experience. Fast, simple, and beautiful.
      </p>
      <Link
        to="/products"
        className="bg-teal-700 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-teal-800 transition-all shadow-lg"
      >
        Shop Now
      </Link>
    </section>
  );
};

export default Home;
