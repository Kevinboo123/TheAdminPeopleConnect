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
  const [categories, setCategories] = useState([]);
  const storage = getStorage();

  // Modified to fetch categories and their services
  useEffect(() => {
    const categoriesRef = ref(database, 'categories');
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val() || {};
      
      // Format categories for dropdown
      const formattedCategories = Object.keys(data).map(key => ({
        id: key,
        name: key,
        image: data[key].image
      }));
      setCategories(formattedCategories);

      // Format all services from all categories
      const allServices = [];
      Object.keys(data).forEach(categoryKey => {
        if (data[categoryKey].services) {
          Object.keys(data[categoryKey].services).forEach(serviceKey => {
            allServices.push({
              name: serviceKey,
              ...data[categoryKey].services[serviceKey],
              categoryName: categoryKey
            });
          });
        }
      });
      setServices(allServices);
    });
  }, []);

  // Modified to delete service from category
  const handleDeleteService = async (categoryName, serviceName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${serviceName}?`);
    if (confirmDelete) {
      try {
        const serviceRef = ref(database, `categories/${categoryName}/services/${serviceName}`);
        await remove(serviceRef);
        toast.success('Service deleted successfully!');
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service. Please try again.');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black">Services Offered</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div key={service.name} className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="absolute top-2 right-2">
              <button 
                className="text-red-500 hover:text-red-700" 
                onClick={() => handleDeleteService(service.categoryName, service.name)}
              >
                <FiTrash2 size={20} />
              </button>
            </div>
            <div className="flex flex-col items-center">
              {service.image && <img src={service.image} alt={service.name} className="w-16 h-16 object-cover" />}
              <h2 className="mt-4 text-center font-semibold">{service.name}</h2>
              <p className="text-sm text-gray-500">{service.categoryName}</p>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default Services;
