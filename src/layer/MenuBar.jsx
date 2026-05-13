import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // ← react-icons থেকে নেওয়া

const MenuBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="bg-slate-900 text-white fixed top-0 left-0 right-0 z-[1000] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* বাম দিক: মেনু আইকন (হ্যামবার্গার বা ব্যাক) + লোগো */}
            <div className="flex items-center gap-4">
              <button
                className="md:hidden text-3xl cursor-pointer select-none focus:outline-none"
                onClick={() => setOpen(!open)} // ← এখন toggle করবে
                aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              >
                {open ? (
                  <FiX />  // খোলা থাকলে ব্যাক/ক্লোজ আইকন
                ) : (
                  <FiMenu />  // বন্ধ থাকলে হ্যামবার্গার
                )}
              </button>

              <div className="text-xl sm:text-2xl font-bold">My Shop</div>
            </div>

            {/* ডেস্কটপ মেনু */}
            <ul className="hidden md:flex items-center gap-8 lg:gap-12">
              <li>
                <Link to="/" className="text-base lg:text-lg hover:text-orange-400 transition-colors duration-200">
                  হোম
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-base lg:text-lg hover:text-orange-400 transition-colors duration-200">
                  প্রোফাইল
                </Link>
              </li>
              <li>
                <Link to="/customer-bills" className="text-base lg:text-lg hover:text-orange-400 transition-colors duration-200">
                  কাস্টমার বিল
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-base lg:text-lg hover:text-orange-400 transition-colors duration-200">
                  রিপোর্ট
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-base lg:text-lg hover:text-orange-400 transition-colors duration-200">
                  সেটিংস
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* মোবাইল সাইডবার */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-[999] transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* সাইডবারের উপরে ক্লোজ বাটন (আইকন) */}
          <button
            className="text-4xl cursor-pointer mb-10 text-right w-full focus:outline-none"
            onClick={() => setOpen(false)}
            aria-label="মেনু বন্ধ করুন"
          >
            <FiX />
          </button>

          <div className="flex flex-col gap-6 text-lg font-medium">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="hover:text-orange-400 transition-colors duration-200 py-2 px-3 rounded hover:bg-slate-800"
            >
              হোম
            </Link>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="hover:text-orange-400 transition-colors duration-200 py-2 px-3 rounded hover:bg-slate-800"
            >
              প্রোফাইল
            </Link>
            <Link
              to="/customer-bills"
              onClick={() => setOpen(false)}
              className="hover:text-orange-400 transition-colors duration-200 py-2 px-3 rounded hover:bg-slate-800"
            >
              কাস্টমার বিল
            </Link>
            <Link
              to="/report"
              onClick={() => setOpen(false)}
              className="hover:text-orange-400 transition-colors duration-200 py-2 px-3 rounded hover:bg-slate-800"
            >
              রিপোর্ট
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="hover:text-orange-400 transition-colors duration-200 py-2 px-3 rounded hover:bg-slate-800"
            >
              সেটিংস
            </Link>
          </div>
        </div>
      </div>

      {/* ওভারলে (ক্লিক করলে বন্ধ) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[998] md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default MenuBar;