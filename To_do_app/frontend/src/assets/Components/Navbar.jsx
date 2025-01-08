import React from 'react';

const Navbar = () => {
  return (
    <div className="bg-blue-950 w-full h-[70px] flex justify-between items-center px-6 shadow-md">
      {/* 🅰️ Left Section */}
      <div className="left text-white font-bold text-3xl cursor-pointer hover:text-gray-300 transition duration-300 ease-in-out">
        <h1>MyTask</h1>
      </div>
      
      {/* 🅱️ Right Section */}
      <div className="right flex gap-8 text-white text-xl">
        <div className="home hover:text-gray-300 cursor-pointer transition duration-200">Home</div>
        <div className="about hover:text-gray-300 cursor-pointer transition duration-200">About</div>
        <div className="contact hover:text-gray-300 cursor-pointer transition duration-200">Contact</div>
      </div>
    </div>
  );
};

export default Navbar;
