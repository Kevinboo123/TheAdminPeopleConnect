import React, { useState, useEffect } from 'react';
import { User, Settings, Users } from 'react-feather';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

// Default avatar as a data URI
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  console.log('Dashboard component rendering');
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Kevin Apiag',
    email: 'kevin.apiag@example.com',
    phone: '+1234567890',
    role: 'Admin',
    image: DEFAULT_AVATAR
  });

  const [userStats, setUserStats] = useState({
    serviceProviders: 0,
    clients: 0
  });

  const [bookingStats, setBookingStats] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [12, 19, 15, 25, 22, 30, 28]
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch user statistics from Firebase
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      let serviceProvidersCount = 0;
      let clientsCount = 0;

      if (data) {
        Object.values(data).forEach((userData) => {
          if (userData.roles) {
            if (userData.roles.includes('Service Provider')) {
              serviceProvidersCount++;
            }
            if (userData.roles.includes('Client')) {
              clientsCount++;
            }
          }
        });
      }

      setUserStats({
        serviceProviders: serviceProvidersCount,
        clients: clientsCount
      });
    });

    // Fetch booking statistics
    const fetchBookingStats = async () => {
      try {
        const response = await fetch('/api/booking-statistics');
        const data = await response.json();
        setBookingStats(data);
      } catch (error) {
        console.error('Failed to fetch booking statistics:', error);
      }
    };

    fetchBookingStats();

    // Fetch categories from Firebase
    const categoriesRef = ref(database, 'categories');
    const categoriesUnsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categoriesArray = Object.entries(data)
          .map(([id, category]) => ({
            id,
            ...category
          }))
          .slice(0, 5);
        setCategories(categoriesArray);
      }
    });

    return () => {
      unsubscribe();
      categoriesUnsubscribe();
    }
  }, []);

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setShowProfileMenu(false);
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
    setShowProfileMenu(false);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    // Update the profile data in state
    setProfileData({
      ...profileData,
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value
    });

    // Close the modal
    setShowProfileModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData({
        ...profileData,
        image: imageUrl
      });
    } else {
      setProfileData({
        ...profileData,
        image: DEFAULT_AVATAR
      });
    }
  };

  const handleSettingsUpdate = (e) => {
    e.preventDefault();
    // Handle settings update logic here
    setShowSettingsModal(false);
  };

  return (
    <div className="p-10 bg-gray-100 h-full">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-purple-600 text-black">Overview</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <img 
                src={profileData.image} 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-violet-600 bg-violet-600 object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold">{profileData.name}</p>
                <p className="text-xs text-gray-500">{profileData.role}</p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <button 
                  onClick={handleProfileClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={16} className="mr-3" />
                  Profile
                </button>
                <button 
                  onClick={handleSettingsClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings size={16} className="mr-3" />
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={profileData.name}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={profileData.email}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={profileData.phone}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-600"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <form onSubmit={handleSettingsUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-violet-600" />
                    <span className="text-sm text-gray-700">Email Notifications</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-violet-600" />
                    <span className="text-sm text-gray-700">SMS Notifications</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-600">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Statistics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">User Statistics</h2>
            <button
              onClick={() => navigate('/users')}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Users size={18} />
              <span>Manage Users</span>
            </button>
          </div>
          <Bar
            data={{
              labels: ['Service Providers', 'Clients'],
              datasets: [
                {
                  label: 'Number of Users',
                  data: [userStats.serviceProviders, userStats.clients],
                  backgroundColor: [
                    'rgba(147, 51, 234, 0.8)', // Purple for Service Providers
                    'rgba(59, 130, 246, 0.8)', // Blue for Clients
                  ],
                  borderColor: [
                    'rgba(147, 51, 234, 1)',
                    'rgba(59, 130, 246, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'User Distribution'
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0
                  }
                }
              }
            }}
          />
        </div>

        {/* Daily Bookings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Daily Bookings</h2>
          <Line
            data={{
              labels: bookingStats.labels,
              datasets: [
                {
                  label: 'Number of Bookings',
                  data: bookingStats.data,
                  fill: false,
                  borderColor: 'rgba(147, 51, 234, 1)',
                  tension: 0.1,
                  pointBackgroundColor: 'rgba(147, 51, 234, 1)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Bookings This Week'
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 5
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Categories</h2>
            <button
              onClick={() => navigate('/categories')}
              className="flex items-center gap-2 px-4 py-2 text-violet-600 hover:text-violet-700 transition-colors"
            >
              <span>View All</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mr-4">
                  <img
                    src={category.imageUrl || DEFAULT_AVATAR}
                    alt={category.name}
                    className="w-8 h-8 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-4 text-gray-500">
                No categories available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
