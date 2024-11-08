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

  // Fetch categories from Firebase Realtime Database
  useEffect(() => {
    const categoriesRef = ref(database, 'category');
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedCategories = Object.keys(data).map((key) => ({
          name: key,
          image: data[key].image,
        }));
        setCategories(formattedCategories);
      } else {
        setCategories([]);
      }
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
      const existingCategoryRef = ref(database, `category/${categoryName}`);
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

  const handleDeleteCategory = async (categoryName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${categoryName}?`);
    if (confirmDelete) {
      const categoryRef = ref(database, `category/${categoryName}`);
      await remove(categoryRef);
      toast.success('Category deleted successfully!');
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

          {/* Buttons for adding or canceling */}
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black">Categories Offered</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="absolute top-2 right-2">
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteCategory(category.name)}>
                <FiTrash2 size={20} />
              </button>
            </div>
            <div className="flex flex-col items-center">
              {category.image && <img src={category.image} alt={category.name} className="w-16 h-16 object-cover" />}
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

      {showAddCategory && (
        <AddCategoryModal setShowAddCategory={setShowAddCategory} />
      )}

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default Categories;
