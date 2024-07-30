import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="p-1 bg-gray-500 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Dancing Script, cursive' }}>
        My List
      </h1>
      <div className="flex gap-4">
        <Link to="/" className="text-white font-semibold hover:text-gray-300">
          Home
        </Link>
        <Link to="/calendar" className="text-white font-semibold hover:text-gray-300">
          Calendar
        </Link>
        {/* Add more links if needed */}
      </div>
    </nav>
  );
};

export default Navbar;

