import React, { useEffect, useState, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import * as nsfwjs from 'nsfwjs';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue, update, get } from 'firebase/database';
import './postManagementSlider.css';

const PostDetailDialog = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          <FiX size={24} />
        </button>
        <h2 className="text-lg font-bold mb-2">Post Details</h2>
        
        <div className="flex mb-4 justify-center">
          {post.postImages.map((image, index) => (
            <div key={index} className="w-[400px] h-[400px] bg-gray-200 rounded-md overflow-hidden mx-1">
              <img
                src={image}
                alt={`Post ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        <p className="mb-2"><strong>User:</strong> {post.userName || post.email}</p>
        <p className="mb-2"><strong>Description:</strong> {post.postDescription}</p>
        <p className="mb-2"><strong>Date:</strong> {post.bookDay}</p>
        <p className="mb-2"><strong>NSFW Analysis:</strong> 
          {post.nsfwClassifications ? (
            <div>
              {Object.entries(post.nsfwClassifications).map(([key, value]) => (
                <div key={key} className={`
                  ${value >= 0.7 ? 'text-red-600 font-bold' : 
                    value >= 0.4 ? 'text-orange-500' : 
                    'text-gray-500'}`
                }>
                  {key}: {(value * 100).toFixed(2)}%
                </div>
              ))}
            </div>
          ) : 'Not analyzed'}
        </p>
        <p className="mb-2"><strong>Status:</strong>
          <span className={`px-2 py-1 rounded-md font-semibold text-white ${ 
            post.postStatus === "Pending" ? "bg-orange-500" :
            post.postStatus === "Approved" ? "bg-green-500" :
            post.postStatus === "Rejected" ? "bg-red-500" :
            "bg-gray-400"
          }`}>
            {post.postStatus}
          </span>
        </p>
      </div>
    </div>
  );
};

function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const modelRef = useRef(null);

  const SENSITIVE_CLASSIFICATIONS = {
    'Drawing': 'Drawing',
    'H*ntai': 'H*ntai',
    'P*rn': 'P*rn',
    'S*xy': 'S*xy',
    'Neutral': 'Neutral'
  };

  useEffect(() => {
    const loadModel = async () => {
      modelRef.current = await nsfwjs.load();
    };
    loadModel();
  }, []);

  useEffect(() => {
    const postsRef = ref(database, 'posts');
    onValue(postsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedPosts = await Promise.all(
          Object.keys(data).map(async (key) => {
            // Try to fetch user name
            let userName = null;
            try {
              const usersRef = ref(database, 'users');
              const usersSnapshot = await get(usersRef);
              const users = usersSnapshot.val();
              
              // Find user by email
              if (users) {
                const userKey = Object.keys(users).find(
                  userKey => users[userKey].email === data[key].email
                );
                
                if (userKey) {
                  userName = users[userKey].name || null;
                }
              }
            } catch (error) {
              console.error('Error fetching user name:', error);
            }

            return {
              id: key,
              categoryName: data[key].categoryName,
              email: data[key].email,
              userName: userName,
              postDescription: data[key].postDescription,
              postImages: data[key].postImages ? Object.values(data[key].postImages) : [],
              postStatus: data[key].postStatus,
              bookDay: data[key].bookDay || 'N/A',
              nsfwClassifications: data[key].nsfwClassifications || null
            };
          })
        );
        setPosts(formattedPosts);
      } else {
        setPosts([]);
      }
    });
  }, []);

  const scanPendingPosts = async () => {
    const pendingPosts = posts.filter(post => post.postStatus === "Pending");

    for (const post of pendingPosts) {
      await analyzePostImages(post);
    }
  };

  const analyzePostImages = async (post) => {
    let isSafe = true;
    let nsfwClassifications = {
      'Drawing': 0,
      'H*ntai': 0,
      'P*rn': 0,
      'S*xy': 0,
      'Neutral': 0
    };

    for (const [index, imageUrl] of post.postImages.entries()) {
      const proxyUrl = `https://proxy-image-server-wx12.onrender.com/proxy-image?url=${encodeURIComponent(imageUrl)}`;

      const img = new Image();
      img.src = proxyUrl;
      img.crossOrigin = 'anonymous';

      await new Promise((resolve) => {
        img.onload = async () => {
          const predictions = await modelRef.current.classify(img);
          
          predictions.forEach(prediction => {
            switch (prediction.className) {
              case 'Drawing':
                nsfwClassifications['Drawing'] = Math.max(nsfwClassifications['Drawing'], prediction.probability);
                break;
              case 'Hentai':
                nsfwClassifications['H*ntai'] = Math.max(nsfwClassifications['H*ntai'], prediction.probability);
                break;
              case 'Porn':
                nsfwClassifications['P*rn'] = Math.max(nsfwClassifications['P*rn'], prediction.probability);
                break;
              case 'Sexy':
                nsfwClassifications['S*xy'] = Math.max(nsfwClassifications['S*xy'], prediction.probability);
                break;
              case 'Neutral':
                nsfwClassifications['Neutral'] = Math.max(nsfwClassifications['Neutral'], prediction.probability);
                break;
            }
          });

          // Check if any sensitive classifications exceed 0.7 threshold
          const sensitiveClassifications = ['H*ntai', 'P*rn', 'S*xy'];
          const isRejected = sensitiveClassifications.some(
            classification => nsfwClassifications[classification] >= 0.7
          );

          if (isRejected) {
            isSafe = false;
          }
          
          resolve();
        };

        img.onerror = () => resolve();
      });

      if (!isSafe) break;
    }

    const newStatus = isSafe ? 'Approved' : 'Rejected';
    const postRef = ref(database, `posts/${post.id}`);
    await update(postRef, { 
      postStatus: newStatus,
      nsfwClassifications: nsfwClassifications
    });

    setPosts(prevPosts =>
      prevPosts.map(p => p.id === post.id ? { 
        ...p, 
        postStatus: newStatus,
        nsfwClassifications: nsfwClassifications
      } : p)
    );
  };

  const renderNSFWClassifications = (classifications) => {
    if (!classifications) return 'Not analyzed';

    return Object.entries(classifications)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => `${key}: ${(value * 100).toFixed(2)}%`)
      .join(', ');
  };

  const handleRowClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseDialog = () => {
    setSelectedPost(null);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-purple-600 text-black mb-6">Post Management</h1>
      
      <button 
        className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        onClick={scanPendingPosts}
      >
        Scan Pending Posts
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-6 bg-purple-500 text-white font-semibold p-4">
          <div className="text-left">POST</div>
          <div className="text-left">USER</div>
          <div className="text-left">DESCRIPTION</div>
          <div className="text-left">DATE</div>
          <div className="text-left">NSFW RESULT</div>
          <div className="text-left">STATUS</div>
        </div>
  
        {posts
          .sort((a, b) => a.postStatus === 'Pending' ? -1 : 1)
          .map((post) => (
            <div key={post.id} className="grid grid-cols-6 items-center p-4 border-b border-gray-200 cursor-pointer" onClick={() => handleRowClick(post)}>
              <div className="relative w-24 h-24 bg-gray-200 rounded-md overflow-hidden image-slider">
                {post.postImages.length > 0 && (
                  <img
                    src={post.postImages[0]}
                    alt="Post"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="text-left">{post.userName || post.email}</div>
              <div className="text-left">{post.postDescription}</div>
              <div className="text-left">{post.bookDay}</div>
              <div className="text-left">
                <span className={
                  post.nsfwClassifications && 
                  (post.nsfwClassifications['H*ntai'] >= 0.7 || 
                   post.nsfwClassifications['P*rn'] >= 0.7 || 
                   post.nsfwClassifications['S*xy'] >= 0.7) 
                    ? 'text-red-600 font-bold' 
                    : 'text-gray-500'
                }>
                  {renderNSFWClassifications(post.nsfwClassifications)}
                </span>
              </div>
              <div className="text-left">
                <span
                  className={`px-3 py-1 rounded-md font-semibold text-white ${
                    post.postStatus === "Pending"
                      ? "bg-orange-500"
                      : post.postStatus === "Approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {post.postStatus}
                </span>
              </div>
            </div>
          ))}
      </div>

      <PostDetailDialog post={selectedPost} onClose={handleCloseDialog} />
    </div>
  );
}

export default PostManagement;