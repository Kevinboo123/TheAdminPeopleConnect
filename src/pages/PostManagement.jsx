import React, { useEffect, useState } from 'react';
import { FiCheck, FiX, FiImage } from 'react-icons/fi';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

function PostManagement() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Reference to the 'users' node in your Firebase Realtime Database
    const usersRef = ref(database, 'users');

    // Listen for value changes
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Map the data into an array format suitable for rendering
        const formattedPosts = Object.keys(data).map((key) => ({
          id: key,
          user: data[key].name, // Adjust 'name' according to your data structure
          profileImageUrl: data[key].profileImageUrl, // Adjust 'profileImageUrl' according to your data structure
        }));
        setPosts(formattedPosts);
      } else {
        setPosts([]);
      }
    });
  }, []);

  return (
    <div className="p-6 bg-purple-600 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Post Requests</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-3 bg-purple-500 text-white font-semibold p-4">
          <div>POST</div>
          <div>USER</div>
          <div>ACTION</div>
        </div>
        {posts.map((post) => (
          <div key={post.id} className="grid grid-cols-3 items-center p-4 border-b border-gray-200">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                {post.profileImageUrl ? (
                  <img
                    src={post.profileImageUrl}
                    alt={`${post.user}'s profile`}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <FiImage size={24} className="text-gray-400" />
                )}
              </div>
            </div>
            <div>{post.user}</div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 bg-green-100 text-green-600 px-3 py-1 rounded-md hover:bg-green-200">
                <FiCheck size={16} />
                <span>Approve</span>
              </button>
              <button className="flex items-center space-x-1 bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200">
                <FiX size={16} />
                <span>Reject</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostManagement;
