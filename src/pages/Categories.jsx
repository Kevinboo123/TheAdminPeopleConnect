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
  const [selectedImage, setSelectedImage] = useState(null);
  const categoryInputRef = useRef(null);
  const storage = getStorage();
  const [showAddService, setShowAddService] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const serviceInputRef = useRef(null);

  // Modified to fetch categories with their services
  useEffect(() => {
    const categoriesRef = ref(database, 'categories');
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const formattedCategories = Object.keys(data).map((key) => ({
        name: key,
        image: data[key].image,
        services: data[key].services ? Object.keys(data[key].services).map(serviceKey => ({
          name: serviceKey,
          ...data[key].services[serviceKey]
        })) : []
      }));
      setCategories(formattedCategories);
    });
  }, []);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Add new category to Firebase
  const handleAddCategory = async () => {
    const categoryName = categoryInputRef.current.value.trim();
    if (!categoryName || !selectedImage) {
      toast.error('Please enter a category name and select an image.');
      return;
    }

    try {
      // Check if category already exists
      const existingCategoryRef = ref(database, `categories/${categoryName}`);
      const snapshot = await get(existingCategoryRef);
      if (snapshot.exists()) {
        toast.error('Category already exists. Please choose a different name.');
        return;
      }

      // Upload image to Firebase Storage
      const imageRef = storageRef(storage, `category_images/${selectedImage.name}`);
      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);

      // Add category to Firebase Realtime Database
      await set(existingCategoryRef, { image: imageUrl });

      // Reset input and selected image
      categoryInputRef.current.value = '';
      setSelectedImage(null);
      setShowAddCategory(false);
      toast.success('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category. Please try again.');
    }
  };

  // Modified to handle category deletion with its services
  const handleDeleteCategory = async (categoryName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${categoryName} and all its services?`);
    if (confirmDelete) {
      try {
        const categoryRef = ref(database, `categories/${categoryName}`);
        await remove(categoryRef);
        toast.success('Category and its services deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category. Please try again.');
      }
    }
  };

  // Add service handling
  const handleAddService = async () => {
    const serviceName = serviceInputRef.current.value.trim();
    if (!serviceName || !selectedImage || !selectedCategory) {
      toast.error('Please enter a service name and select an image.');
      return;
    }

    try {
      // Check if service already exists in the category
      const serviceRef = ref(database, `categories/${selectedCategory}/services/${serviceName}`);
      const snapshot = await get(serviceRef);
      if (snapshot.exists()) {
        toast.error('Service already exists in this category. Please choose a different name.');
        return;
      }

      // Upload image
      const imageRef = storageRef(storage, `service_images/${selectedImage.name}`);
      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);

      // Add service under category
      await set(serviceRef, {
        image: imageUrl
      });

      serviceInputRef.current.value = '';
      setSelectedImage(null);
      setShowAddService(false);
      toast.success('Service added successfully!');
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service. Please try again.');
    }
  };

  // Add Service Modal Component
  const AddServiceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-semibold text-center text-[#6B46C1] mb-4">
          Add Service to {selectedCategory}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Service Name"
            ref={serviceInputRef}
            className="w-full p-3 border rounded-lg shadow-lg"
          />

          <div
            onClick={() => document.getElementById('serviceImageInput').click()}
            className="w-full h-32 border-2 border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer"
          >
            {selectedImage ? (
              <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-[#6B46C1] text-4xl mb-2">
                  <FaPlus />
                </div>
                <span className="text-gray-500">Select Service Image</span>
              </div>
            )}
            <input
              id="serviceImageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <div className="flex justify-between">
            <button
              className="w-1/2 mr-2 py-3 bg-[#6B46C1] text-white rounded-lg shadow-lg hover:bg-[#553C9A] transition duration-200"
              onClick={handleAddService}
            >
              Add
            </button>
            <button
              className="w-1/2 ml-2 py-3 bg-gray-300 text-gray-700 rounded-lg shadow-lg hover:bg-gray-400 transition duration-200"
              onClick={() => setShowAddService(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AddCategoryModal = ({ 
    onClose, 
    onAdd, 
    categoryInputRef, 
    selectedImage, 
    handleImageSelect 
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-semibold text-center text-[#6B46C1] mb-4">ADD CATEGORY</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Category Name"
            ref={categoryInputRef}
            className="w-full p-3 border rounded-lg shadow-lg"
          />

          <div
            onClick={() => document.getElementById('categoryImageInput').click()}
            className="w-full h-32 border-2 border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer"
          >
            {selectedImage ? (
              <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-[#6B46C1] text-4xl mb-2">
                  <FaPlus />
                </div>
                <span className="text-gray-500">Select Category Image</span>
              </div>
            )}
            <input
              id="categoryImageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <div className="flex justify-between">
            <button
              className="w-1/2 mr-2 py-3 bg-[#6B46C1] text-white rounded-lg shadow-lg hover:bg-[#553C9A] transition duration-200"
              onClick={onAdd}
            >
              Add
            </button>
            <button
              className="w-1/2 ml-2 py-3 bg-gray-300 text-gray-700 rounded-lg shadow-lg hover:bg-gray-400 transition duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
                {/* Add Service Button */}
                <button 
                  className="text-[#6B46C1] hover:text-[#553C9A]"
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setShowAddService(true);
                  }}
                >
                  <FaPlus size={20} />
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
            {/* Display service count */}
            <p className="text-sm text-gray-500 mt-2">
              Services: {category.services?.length || 0}
            </p>
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
      {showAddService && <AddServiceModal />}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default Categories;
