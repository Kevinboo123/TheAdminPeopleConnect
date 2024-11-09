import { useNavigate } from 'react-router-dom';

function LogoutPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication tokens/data from localStorage
    localStorage.removeItem('token');
    // You can clear other auth-related data here
    
    // Redirect to root path (which shows LoginPage in your routing)
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-6">Are you sure you want to logout?</h2>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default LogoutPage;