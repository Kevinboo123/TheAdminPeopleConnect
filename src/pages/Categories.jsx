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
  const [showAddService, setShowAddService] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const categoryInputRef = useRef(null);
  const serviceInputRef = useRef(null);
  const storage = getStorage();

  // Modified useEffect to fetch both categories and their services
  useEffect(() => {
    const categoriesRef = ref(database, 'categories');
    const servicesRef = ref(database, 'services');

    // Fetch both categories and services
    Promise.all([
      get(categoriesRef),
      get(servicesRef)
    ]).then(([categoriesSnapshot, servicesSnapshot]) => {
      const categoriesData = categoriesSnapshot.val() || {};
      const servicesData = servicesSnapshot.val() || {};

      const formattedCategories = Object.keys(categoriesData).map((key) => ({
        name: key,
        image: categoriesData[key].image,
        services: Object.keys(servicesData)
          .filter(serviceKey => servicesData[serviceKey].categoryId === key)
          .map(serviceKey => ({
            name: serviceKey,
            image: servicesData[serviceKey].image
          }))
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

  // Delete category from Firebase
  const handleDeleteCategory = async (categoryName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${categoryName}?`);
    if (confirmDelete) {
      const categoryRef = ref(database, `categories/${categoryName}`);
      await remove(categoryRef);
      toast.success('Category deleted successfully!');
    }
  };

  // Modified handleAddService to store in both locations
  const handleAddService = async () => {
    const serviceName = serviceInputRef.current.value.trim();
    if (!serviceName || !selectedImage || !selectedCategory) {
      toast.error('Please enter a service name, select an image, and ensure a category is selected.');
      return;
    }

    try {
      // Check if service already exists
      const existingServiceRef = ref(database, `services/${serviceName}`);
      const snapshot = await get(existingServiceRef);
      if (snapshot.exists()) {
        toast.error('Service already exists. Please choose a different name.');
        return;
      }

      // Upload image to Firebase Storage
      const imageRef = storageRef(storage, `service_images/${selectedImage.name}`);
      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);

      // Add service to main services collection with category reference
      await set(existingServiceRef, { 
        image: imageUrl,
        categoryId: selectedCategory 
      });

      // Reset input and selected image
      serviceInputRef.current.value = '';
      setSelectedImage(null);
      setShowAddService(false);
      toast.success('Service added successfully!');
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service. Please try again.');
    }
  };

  // Modified handleDeleteService to delete from both locations
  const handleDeleteService = async (categoryName, serviceName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${serviceName}?`);
    if (confirmDelete) {
      try {
        const serviceRef = ref(database, `services/${serviceName}`);
        await remove(serviceRef);
        toast.success('Service deleted successfully!');
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service. Please try again.');
      }
    }
  };

  const AddCategoryModal = ({ setShowAddCategory }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-semibold text-center text-[#6B46C1] mb-4">ADD CATEGORY</h2>

        <div className="space-y-4">
          {/* Category name input */}
          <input
            type="text"
            placeholder="Enter Category Name"
            ref={categoryInputRef}
            className="w-full p-3 border rounded-lg shadow-lg"
          />

          {/* Image selection */}
          <div
            onClick={() => document.getElementById('imageInput').click()}
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
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              className="w-1/2 mr-2 py-3 bg-[#6B46C1] text-white rounded-lg shadow-lg hover:bg-[#553C9A] transition duration-200"
              onClick={handleAddCategory}
            >
              Add
            </button>
            <button
              className="w-1/2 ml-2 py-3 bg-gray-300 text-gray-700 rounded-lg shadow-lg hover:bg-gray-400 transition duration-200"
              onClick={() => setShowAddCategory(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AddServiceModal = ({ setShowAddService, categoryName, handleAddService, serviceInputRef, selectedImage, handleImageSelect }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-semibold text-center text-[#6B46C1] mb-4">ADD SERVICE</h2>

        <div className="space-y-4">
          {/* Service name input */}
          <input
            type="text"
            placeholder="Enter Service Name"
            ref={serviceInputRef}
            className="w-full p-3 border rounded-lg shadow-lg"
          />

          {/* Image selection */}
          <div
            onClick={() => document.getElementById('imageInput').click()}
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
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          {/* Buttons */}
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-6">Categories & Services</h1>
      <div className="space-y-8">
        {categories.map((category, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img src={category.image} alt={category.name} className="w-16 h-16 object-cover rounded-lg" />
                <h2 className="ml-4 text-xl font-semibold">{category.name}</h2>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setShowAddService(true);
                  }}
                >
                  <FaPlus className="mr-2" />
                  Add Service
                </button>
                <button 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteCategory(category.name)}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {category.services && category.services.map((service, serviceIndex) => (
                <div key={serviceIndex} className="bg-gray-50 p-4 rounded-lg relative">
                  <button 
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteService(category.name, service.name)}
                  >
                    <FiTrash2 size={16} />
                  </button>
                  <div className="flex flex-col items-center">
                    <img src={service.image} alt={service.name} className="w-12 h-12 object-cover" />
                    <p className="mt-2 text-sm font-medium text-center">{service.name}</p>
                  </div>
                </div>
              ))}
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
      {showAddCategory && <AddCategoryModal setShowAddCategory={setShowAddCategory} />}
      {showAddService && (
        <AddServiceModal 
          setShowAddService={setShowAddService} 
          categoryName={selectedCategory}
          handleAddService={handleAddService}
          serviceInputRef={serviceInputRef}
          selectedImage={selectedImage}
          handleImageSelect={handleImageSelect}
        />
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default Categories;
