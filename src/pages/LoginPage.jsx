import React, { useState } from 'react';
import { User, Lock } from 'react-feather';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (login === 'admin' && password === '123') {
      // Login successful
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-600">PeopleConnect</h1>
          <p className="text-gray-500">Admin Service Web</p>
        </div>
        
        <h2 className="text-2xl font-semibold text-center">Login as an Admin</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute top-3 left-3 text-purple-600" size={20} />
            <input
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-purple-600" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
