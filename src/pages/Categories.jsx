import React, { useState, useEffect, useRef } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { ref, onValue, set, remove, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database } from '../firebase/firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubCategory, setShowAddSubCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const categoryInputRef = useRef(null);
  const subCategoryInputRef = useRef(null);
  const storage = getStorage();

  // Modified to fetch categories with sub-categories from Firebase
  useEffect(() => {
    const categoriesRef = ref(database, 'category');
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const formattedCategories = Object.keys(data).map((key) => ({
        name: key,
        image: data[key].image,
        subCategories: data[key].Sub_Categories ? Object.keys(data[key].Sub_Categories).map(subKey => ({
          name: subKey,
          ...data[key].Sub_Categories[subKey]
        })) : []
      }));
      setCategories(formattedCategories);
    });
  }, []);

  // Add handleImageSelect function
  const handleImageSelect = (file) => {
    if (file) {
      setSelectedImage(file);
    }
  };

  // Add handleDeleteCategory function
  const handleDeleteCategory = async (categoryName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${categoryName}?`);
    if (confirmDelete) {
      try {
        const categoryRef = ref(database, `category/${categoryName}`);
        await remove(categoryRef);
        toast.success('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category. Please try again.');
      }
    }
  };

  // Modified to add category with proper structure
  const handleAddCategory = async () => {
    const categoryName = categoryInputRef.current.value.trim();
    if (!categoryName || !selectedImage) {
      toast.error('Please enter a category name and select an image.');
      return;
    }

    try {
      const existingCategoryRef = ref(database, `category/${categoryName}`);
      const snapshot = await get(existingCategoryRef);
      if (snapshot.exists()) {
        toast.error('Category already exists. Please choose a different name.');
        return;
      }

      const imageRef = storageRef(storage, `category_images/${selectedImage.name}`);
      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);

      await set(existingCategoryRef, {
        image: imageUrl,
        Sub_Categories: {} // Initialize empty sub-categories
      });

      categoryInputRef.current.value = '';
      setSelectedImage(null);
      setShowAddCategory(false);
      toast.success('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category. Please try again.');
    }
  };

  // Modified handleAddSubCategory to fix the name handling
  const handleAddSubCategory = async () => {
    const subCategoryName = subCategoryInputRef.current.value.trim();
    if (!subCategoryName || !selectedImage || !selectedCategory) {
      toast.error('Please enter a sub-category name and select an image.');
      return;
    }

    try {
      // Create a URL-friendly version of the name for the key
      const subCategoryKey = subCategoryName.toLowerCase().replace(/\s+/g, '');
      const subCategoryRef = ref(database, `category/${selectedCategory}/Sub_Categories/${subCategoryKey}`);
      
      const snapshot = await get(subCategoryRef);
      if (snapshot.exists()) {
        toast.error('Sub-category already exists. Please choose a different name.');
        return;
      }

      const imageRef = storageRef(storage, `subcategory_images/${selectedImage.name}`);
      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);

      await set(subCategoryRef, {
        name: subCategoryName, // Store the original name
        image: imageUrl
      });

      subCategoryInputRef.current.value = '';
      setSelectedImage(null);
      setShowAddSubCategory(false);
      setSelectedCategory(null);
      toast.success('Sub-category added successfully!');
    } catch (error) {
      console.error('Error adding sub-category:', error);
      toast.error('Failed to add sub-category. Please try again.');
    }
  };

  // Add Category Modal Component
  function AddCategoryModal({ onClose, onAdd, categoryInputRef, selectedImage, handleImageSelect }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <input
            ref={categoryInputRef}
            type="text"
            placeholder="Enter category name"
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageSelect(e.target.files[0])}
            className="w-full mb-4"
          />
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="w-32 h-32 object-cover rounded mb-4"
            />
          )}
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#6B46C1] text-white rounded hover:bg-[#553C9A]"
              onClick={onAdd}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-6">Categories</h1>
      <div className="space-y-8">
        {categories.map((category, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img src={category.image} alt={category.name} className="w-16 h-16 object-cover rounded-lg" />
                <h2 className="ml-4 text-xl font-semibold">{category.name}</h2>
              </div>
              <div className="flex items-center space-x-4">
                {/* Add Sub-Category Button */}
                <button 
                  className="text-[#6B46C1] hover:text-[#553C9A] flex items-center"
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setShowAddSubCategory(true);
                  }}
                >
                  <FaPlus size={20} />
                  <span className="ml-2">Add Sub-Category</span>
                </button>
                {/* Delete Category Button */}
                <button 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteCategory(category.name)}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>

            {/* Display Sub-Categories */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Sub Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.subCategories && category.subCategories.map((subCategory, subIndex) => (
                  <div 
                    key={subIndex} 
                    className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      {subCategory.image && (
                        <img 
                          src={subCategory.image} 
                          alt={subCategory.name} 
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <span className="font-medium">{subCategory.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {(!category.subCategories || category.subCategories.length === 0) && (
                <p className="text-sm text-gray-500 mt-2">
                  No sub-categories added yet
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Add Category Button */}
        <div 
          className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
          onClick={() => setShowAddCategory(true)}
        >
          <FaPlus size={40} className="text-gray-400" />
          <span className="ml-2 text-gray-600 font-semibold">ADD CATEGORY</span>
        </div>
      </div>

      {/* Modals */}
      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onAdd={handleAddCategory}
          categoryInputRef={categoryInputRef}
          selectedImage={selectedImage}
          handleImageSelect={handleImageSelect}
        />
      )}
      {showAddSubCategory && (
        <AddSubCategoryModal
          onClose={() => {
            setShowAddSubCategory(false);
            setSelectedCategory(null);
          }}
          onAdd={handleAddSubCategory}
          subCategoryInputRef={subCategoryInputRef}
          selectedImage={selectedImage}
          handleImageSelect={handleImageSelect}
          categoryName={selectedCategory}
        />
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

// Add Sub-Category Modal Component
function AddSubCategoryModal({ onClose, onAdd, subCategoryInputRef, selectedImage, handleImageSelect, categoryName }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Add Sub-Category to {categoryName}</h2>
        <input
          ref={subCategoryInputRef}
          type="text"
          placeholder="Enter sub-category name"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageSelect(e.target.files[0])}
          className="w-full mb-4"
        />
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="w-32 h-32 object-cover rounded mb-4"
          />
        )}
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#6B46C1] text-white rounded hover:bg-[#553C9A]"
            onClick={onAdd}
          >
            Add Sub-Category
          </button>
        </div>
      </div>
    </div>
  );
}

export default Categories;
