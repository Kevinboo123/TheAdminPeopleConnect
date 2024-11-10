import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../firebase/firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Services() {
  const [subCategories, setSubCategories] = useState([]);

  // Fetch all sub-categories
  useEffect(() => {
    const categoryRef = ref(database, 'category');
    onValue(categoryRef, (snapshot) => {
      const data = snapshot.val() || {};
      const allSubCategories = [];
      
      // Flatten all sub-categories into a single array
      Object.keys(data).forEach((categoryKey) => {
        const category = data[categoryKey];
        if (category.Sub_Categories) {
          Object.entries(category.Sub_Categories).forEach(([subKey, value]) => {
            allSubCategories.push({
              id: subKey,
              name: value.name || subKey,
              image: value.image,
              categoryName: categoryKey
            });
          });
        }
      });
      
      setSubCategories(allSubCategories);
    });
  }, []);

  // Handle sub-category deletion
  const handleDeleteSubCategory = async (categoryName, subCategoryId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this sub-category?`);
    if (confirmDelete) {
      try {
        const subCategoryRef = ref(database, `category/${categoryName}/Sub_Categories/${subCategoryId}`);
        await remove(subCategoryRef);
        toast.success('Sub-category deleted successfully!');
      } catch (error) {
        console.error('Error deleting sub-category:', error);
        toast.error('Failed to delete sub-category. Please try again.');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-6">Sub-Categories Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories.map((subCategory, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <img 
                  src={subCategory.image} 
                  alt={subCategory.name} 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <span className="absolute top-2 right-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {subCategory.categoryName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {subCategory.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Category: {subCategory.categoryName}
                  </p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 transition-colors p-2"
                  onClick={() => handleDeleteSubCategory(subCategory.categoryName, subCategory.id)}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {subCategories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg">
          <p className="text-xl text-gray-500">No sub-categories available</p>
        </div>
      )}

      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
        draggable 
      />
    </div>
  );
}

export default Services;
