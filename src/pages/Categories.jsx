import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { FaHome, FaLightbulb, FaTools, FaCalendarAlt, FaPlus } from 'react-icons/fa';

function Categories() {
  const categories = [
    { name: 'HOME SERVICES', icon: <FaHome size={40} className="text-blue-500" /> },
    { name: 'CREATIVE SERVICES', icon: <FaLightbulb size={40} className="text-yellow-500" /> },
    { name: 'SKILLED SERVICES', icon: <FaTools size={40} className="text-green-500" /> },
    { name: 'EVENTS SERVICES', icon: <FaCalendarAlt size={40} className="text-red-500" /> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Categories Offered</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="absolute top-2 right-2">
              <button className="text-red-500 hover:text-red-700">
                <FiTrash2 size={20} />
              </button>
            </div>
            <div className="flex flex-col items-center">
              {category.icon}
              <h2 className="mt-4 text-center font-semibold">{category.name}</h2>
            </div>
          </div>
        ))}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
          <FaPlus size={40} className="text-gray-400" />
          <span className="ml-2 text-gray-600 font-semibold">ADD SERVICE</span>
        </div>
      </div>
    </div>
  );
}

export default Categories;
