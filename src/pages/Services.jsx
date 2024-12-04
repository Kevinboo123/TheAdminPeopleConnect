import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../firebase/firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Services() {
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category
  const [showModal, setShowModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]); // State for categories

  // Fetch all categories and sub-categories
  useEffect(() => {
    const categoryRef = ref(database, 'category');
    onValue(categoryRef, (snapshot) => {
      const data = snapshot.val() || {};
      const allSubCategories = [];
      const allCategories = [];

      // Flatten all sub-categories into a single array and collect categories
      Object.keys(data).forEach((categoryKey) => {
        allCategories.push(categoryKey); // Collect category names
        const category = data[categoryKey];
        if (category['Sub Categories']) {
          Object.entries(category['Sub Categories']).forEach(([subKey, value]) => {
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
      setCategories(allCategories); // Set categories state
    });
  }, []);

  // Handle sub-category deletion
  const handleDeleteSubCategory = async () => {
    if (!selectedSubCategory) return;

    const { categoryName, id } = selectedSubCategory;
    try {
      const subCategoryRef = ref(database, `category/${categoryName}/Sub Categories/${id}`);
      await remove(subCategoryRef);
      toast.success('Sub-category deleted successfully!');
      setShowModal(false); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting sub-category:', error);
      toast.error('Failed to delete sub-category. Please try again.');
    }
  };

  // Filtered sub-categories based on the selected category
  const filteredSubCategories = selectedCategory
    ? subCategories.filter(subCategory => subCategory.categoryName === selectedCategory)
    : subCategories; // Show all if no category is selected

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-600 text-black mb-6">Service Management</h1>
      
      {/* Category Selection Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="mb-4 p-1 border rounded w-1/4"
      >
        <option value="">All Categories</option> {/* Option for all categories */}
        {categories.map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredSubCategories.map((subCategory, index) => (
          <div 
            key={index} 
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <img 
                  src={subCategory.image} 
                  alt={subCategory.name} 
                  className="w-full h-32 object-cover rounded-lg"
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
                  className="text-red-600 hover:text-red-700 transition-colors p-2"
                  onClick={() => {
                    setSelectedSubCategory(subCategory);
                    setShowModal(true);
                  }}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubCategories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg">
          <p className="text-xl text-gray-500">No sub-categories available</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-md text-center w-64"> {/* Adjusted width for a smaller modal */}
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to delete {selectedSubCategory?.name}?
            </h2>
            <div className="flex space-x-2 justify-center">
              <button 
                onClick={handleDeleteSubCategory}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
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
