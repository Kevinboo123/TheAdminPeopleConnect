import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);

    setTimeout(() => {
      localStorage.removeItem('token');
      
      navigate('/');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-6">Are you sure you want to logout?</h2>
        <button s
          onClick={handleLogout}
          disabled={loading}
          className={`bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
}

export default LogoutPage;