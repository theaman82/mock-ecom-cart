import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Navbar from "./components/Navbar";
import Router from "./Router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <Router />
        <Toaster position="top-center" reverseOrder={false} />{" "}
      </div>
    </>
  );
}

export default App;
