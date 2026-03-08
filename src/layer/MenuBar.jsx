import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MenuBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'হোম', path: '/' },
    { name: 'পণ্য', path: './' },
    { name: 'ক্যাশ মেমো', path: '/' },
    { name: 'অর্ডার', path: '/' },
    { name: 'রিপোর্ট', path: '/' },
    { name: 'সেটিংস', path: '/' },
  ];

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      {/* max-w-7xl mx-auto রিমুভ করা হয়েছে → পুরো width নেবে */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* লোগো — বাম দিকে */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold">
              Manu
            </Link>
          </div>

          {/* ডেস্কটপ মেনু */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <div className="relative group">
              <button
                className="text-xl font-semibold px-4 py-2 rounded-md hover:bg-gray-700 transition"
              >
                মেনু ▼
              </button>

              {/* Dropdown */}
              <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-2 text-base hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* মোবাইল হ্যামবার্গার */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* মোবাইল মেনু */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MenuBar;