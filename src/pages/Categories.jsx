import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { FaHome, FaLightbulb, FaTools, FaCalendarAlt, FaPlus } from 'react-icons/fa';

function Categories() {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { name: 'HOME SERVICES', icon: <FaHome size={40} className="text-blue-500" /> },
    { name: 'CREATIVE SERVICES', icon: <FaLightbulb size={40} className="text-yellow-500" /> },
    { name: 'SKILLED SERVICES', icon: <FaTools size={40} className="text-green-500" /> },
    { name: 'EVENTS SERVICES', icon: <FaCalendarAlt size={40} className="text-red-500" /> },
  ];

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const AddCategoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-semibold text-center text-[#6B46C1] mb-8">ADD CATEGORY</h2>
        
        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Category Name"
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
                  <FaPlus />
                </div>
                <span className="text-gray-500">Select Category Image</span>
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
            onClick={() => setShowAddCategory(false)}
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );

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
        <div 
          className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
          onClick={() => setShowAddCategory(true)}
        >
          <FaPlus size={40} className="text-gray-400" />
          <span className="ml-2 text-gray-600 font-semibold">ADD CATEGORY</span>
        </div>
      </div>

      {showAddCategory && <AddCategoryModal />}
    </div>
  );
}

export default Categories;
