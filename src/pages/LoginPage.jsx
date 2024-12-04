import React, { useState } from 'react';
import { User, Lock } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa'; // Import the spinner icon
import dashboardLogo from '../assets/DashBoardLogo.png'; // Make sure the path is correct

function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (login === 'admin' && password === '123') {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img 
            src={dashboardLogo} 
            alt="Dashboard Logo" 
            className="h-24 w-auto"
          />
        </div>
        
        <h1 className="text-center text-purple-600 text-4xl font-bold mb-4 bold_poppins">PeopleConnect</h1>
        
        <p className="text-center text-purple-600 text-sm mb-4 bold_poppins">ADMIN</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute top-3 left-3 text-purple-600" size={20} />
            <input
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 bold_poppins"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-purple-600" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 bold_poppins"
            />
          </div>
          
          {error && <p className="text-red-500 text-center bold_poppins">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 ${loading ? 'bg-purple-400' : 'bg-purple-600'} text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 bold_poppins flex items-center justify-center`}
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
