import React from 'react';
import { Bell, Search } from 'react-feather';

function Dashboard() {
  return (
    <div className="p-10 bg-gray-100 h-full">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Overview</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <Bell size={20} className="text-gray-600" />
          <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
        </div>
      </header>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
        <p>Add your dashboard widgets and content here.</p>
      </div>
    </div>
  );
}

export default Dashboard;
