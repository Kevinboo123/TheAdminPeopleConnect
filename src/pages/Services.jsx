import React, { useState } from 'react';
import { FiSearch, FiBell, FiTrash2, FiPlus } from 'react-icons/fi';
import { FaHome, FaLightbulb, FaTools, FaCalendarAlt } from 'react-icons/fa';

function Services() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Dummy data for services with icons
  const services = [
    { id: 1, name: 'HOME SERVICES', icon: FaHome, color: 'text-blue-500' },
    { id: 2, name: 'CREATIVE SERVICES', icon: FaLightbulb, color: 'text-yellow-500' },
    { id: 3, name: 'SKILLED SERVICES', icon: FaTools, color: 'text-green-500' },
    { id: 4, name: 'EVENTS SERVICES', icon: FaCalendarAlt, color: 'text-red-500' },
  ];

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const AddSubCategoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-center text-[#6B46C1] mb-8">ADD SUB CATEGORY</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <select className="w-full p-3 border rounded-lg shadow-lg appearance-none bg-white">
              <option value="">Select Category</option>
              {services.map((service) => (
                <option key={service.id} value={service.name}>{service.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Enter Sub Category Name"
              className="w-full p-3 border rounded-lg shadow-lg"
            />
          </div>

          <div 
            onClick={() => document.getElementById('imageInput').click()}
            className="w-full h-32 border-2 border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer"
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Selected" className="h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-[#6B46C1] text-4xl mb-2">
                  <FiPlus />
                </div>
                <span className="text-gray-500">Select Sub Category Image</span>
              </div>
            )}
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <button
            className="w-full py-3 bg-[#6B46C1] text-white rounded-lg shadow-lg hover:bg-[#553C9A] transition duration-200"
            onClick={() => setShowAddModal(false)}
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );

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
        <div 
          className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
          onClick={() => setShowAddModal(true)}
        >
          <FiPlus size={40} className="text-gray-400" />
          <span className="ml-2 text-gray-600 font-semibold">ADD SERVICE</span>
        </div>
      </div>

      {showAddModal && <AddSubCategoryModal />}
    </div>
  );
}

export default Services;
