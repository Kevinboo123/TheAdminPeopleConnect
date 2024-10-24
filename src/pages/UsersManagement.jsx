import React, { useEffect, useState } from 'react';
import { MoreVertical } from 'react-feather';
import { database } from '../firebase/firebaseConfig'; // Adjust the path if needed
import { ref, onValue } from 'firebase/database';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Reference to the 'users' node in your Firebase Realtime Database
    const usersRef = ref(database, 'users');

    // Listen for value changes
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Map the data into an array format suitable for rendering
        const formattedUsers = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name, // Adjust 'name' according to your data structure
          avatar: data[key].profileImageUrl, // Adjust 'profileImageUrl' according to your data structure
        }));
        setUsers(formattedUsers);
      } else {
        setUsers([]);
      }
    });
  }, []);

  return (
    <div className="users-management p-6">
      <h2 className="users-management__title text-2xl font-bold mb-4">User Information</h2>
      <ul className="users-list">
        {users.map((user) => (
          <li key={user.id} className="users-list__item flex items-center justify-between p-3 border-b">
            <div className="flex items-center">
              <div className="users-list__avatar w-10 h-10 rounded-full overflow-hidden mr-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">N/A</span>
                  </div>
                )}
              </div>
              <span className="users-list__name">{user.name}</span>
            </div>
            <button className="users-list__more-options" aria-label="more options">
              <MoreVertical size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersManagement;
