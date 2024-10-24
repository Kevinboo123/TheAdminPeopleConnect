import React from 'react';
import { FiSearch, FiBell, FiTrash2, FiPlus } from 'react-icons/fi';
import { FaHome, FaLightbulb, FaTools, FaCalendarAlt } from 'react-icons/fa';

function Services() {
  // Dummy data for services with icons
  const services = [
    { id: 1, name: 'HOME SERVICES', icon: FaHome, color: 'text-blue-500' },
    { id: 2, name: 'CREATIVE SERVICES', icon: FaLightbulb, color: 'text-yellow-500' },
    { id: 3, name: 'SKILLED SERVICES', icon: FaTools, color: 'text-green-500' },
    { id: 4, name: 'EVENTS SERVICES', icon: FaCalendarAlt, color: 'text-red-500' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services Offered</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <FiBell size={20} className="text-gray-600" />
          <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="absolute top-2 right-2">
              <button className="text-red-500 hover:text-red-700">
                <FiTrash2 size={20} />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <service.icon size={60} className={`${service.color} mb-4`} />
              <h2 className="text-center font-semibold">{service.name}</h2>
            </div>
          </div>
        ))}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
          <FiPlus size={40} className="text-gray-400" />
          <span className="ml-2 text-gray-600 font-semibold">ADD SERVICE</span>
        </div>
      </div>
    </div>
  );
}

export default Services;
