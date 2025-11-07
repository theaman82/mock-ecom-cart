import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition-colors duration-200 ${
      isActive
        ? "text-yellow-200 underline  font-semibold"
        : "text-white hover:text-yellow-200"
    }`;

  return (
    <nav className="bg-teal-700 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide"
          onClick={closeMenu}
        >
          E-Com Cart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <NavLink to="/" className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClasses}>
            Products
          </NavLink>
          <NavLink to="/cart" className={navLinkClasses}>
            Cart
          </NavLink>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-lg"
        >
          {menuOpen ? (
            // Close (X) icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-teal-600 rounded-lg shadow-lg border border-teal-500 overflow-hidden">
          <NavLink to="/" className={navLinkClasses} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClasses} onClick={closeMenu}>
            Products
          </NavLink>
          <NavLink to="/cart" className={navLinkClasses} onClick={closeMenu}>
            Cart
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
