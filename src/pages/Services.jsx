import React, { useState, useEffect, useRef } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { ref, onValue, set, remove, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database } from '../firebase/firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Services() {
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const serviceInputRef = useRef(null);
  const storage = getStorage();

  // Fetch services from Firebase
  useEffect(() => {
    const servicesRef = ref(database, 'services');
    onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedServices = Object.keys(data).map((key) => ({
          name: key,
          image: data[key].image,
        }));
        setServices(formattedServices);
      } else {
        setServices([]);
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

  // Add new service to Firebase
  const handleAddService = async () => {
    const serviceName = serviceInputRef.current.value.trim();
    if (!serviceName || !selectedImage) {
      toast.error('Please enter a service name and select an image.');
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

      // Add service to Firebase Realtime Database
      await set(existingServiceRef, { image: imageUrl });

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

  // Delete service from Firebase
  const handleDeleteService = async (serviceName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${serviceName}?`);
    if (confirmDelete) {
      const serviceRef = ref(database, `services/${serviceName}`);
      await remove(serviceRef);
      toast.success('Service deleted successfully!');
    }
  };

  const AddServiceModal = ({ setShowAddService }) => (
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
      <h1 className="text-2xl font-bold text-black">Services Offered</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="absolute top-2 right-2">
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteService(service.name)}>
                <FiTrash2 size={20} />
              </button>
            </div>
            <div className="flex flex-col items-center">
              {service.image && <img src={service.image} alt={service.name} className="w-16 h-16 object-cover" />}
              <h2 className="mt-4 text-center font-semibold">{service.name}</h2>
            </div>
          </div>
        ))}
        <div 
          className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
          onClick={() => setShowAddService(true)}
        >
          <FaPlus size={40} className="text-gray-400" />
          <span className="ml-2 text-gray-600 font-semibold">ADD SERVICE</span>
        </div>
      </div>

      {showAddService && (
        <AddServiceModal setShowAddService={setShowAddService} />
      )}

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default Services;
