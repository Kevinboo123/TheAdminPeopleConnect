import React, { useState } from 'react';
import { Bell, Search, User, Settings, X } from 'react-feather';

function Dashboard() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'New user registration',
      time: '5 minutes ago',
      isRead: false,
    },
    {
      id: 2,
      message: 'System update completed',
      time: '1 hour ago',
      isRead: false,
    },
    {
      id: 3,
      message: 'New service request',
      time: '2 hours ago',
      isRead: false,
    },
  ]);

  const [profileData, setProfileData] = useState({
    name: 'Kevin Apiag',
    email: 'kevin.apiag@example.com',
    phone: '+1234567890',
    role: 'Admin',
    image: '/path/to/your/image.png' // Update this path to your admin profile image
  });

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
      const imageUrl = URL.createObjectURL(file); // Create a URL for the selected image
      setProfileData({
        ...profileData,
        image: imageUrl // Update the image in profileData
      });
    }
  };

  const handleSettingsUpdate = (e) => {
    e.preventDefault();
    // Handle settings update logic here
    setShowSettingsModal(false);
  };

  // Handle notification click
  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-10 bg-gray-100 h-full">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-black">Overview</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative"
            >
              <Bell size={20} className="text-purple-600 cursor-pointer" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-violet-600 hover:text-violet-800"
                    >
                      Mark all as read
                    </button>
                    <button 
                      onClick={clearAllNotifications}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                          !notification.isRead ? 'bg-violet-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={`text-sm ${!notification.isRead ? 'font-semibold' : ''}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <img 
                src={profileData.image} // Use the image from profileData
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-violet-600"
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

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
        <p>Add your dashboard widgets and content here.</p>
      </div>
    </div>
  );
}

export default Dashboard;
