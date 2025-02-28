import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, Building } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div 
        className="bg-cover bg-center h-screen flex items-center"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Connect, Donate, Transform Lives
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
            A platform connecting donors, suppliers, and transporters to help orphanages receive the resources they need.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <button 
              onClick={() => navigate('/login/donor')}
              className="bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 flex flex-col items-center"
            >
              <Heart size={32} className="mb-2" />
              <span className="text-lg font-semibold">Donor</span>
            </button>
            
            <button 
              onClick={() => navigate('/login/supplier')}
              className="bg-gray-800 hover:bg-gray-900 text-white py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 flex flex-col items-center"
            >
              <ShoppingBag size={32} className="mb-2" />
              <span className="text-lg font-semibold">Supplier</span>
            </button>
            
            <button 
              onClick={() => navigate('/login/transporter')}
              className="bg-gray-800 hover:bg-gray-900 text-white py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 flex flex-col items-center"
            >
              <Truck size={32} className="mb-2" />
              <span className="text-lg font-semibold">Transporter</span>
            </button>
            
            <button 
              onClick={() => navigate('/login/institute')}
              className="bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 flex flex-col items-center"
            >
              <Building size={32} className="mb-2" />
              <span className="text-lg font-semibold">Institute</span>
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Institutes Request</h3>
              <p className="text-gray-600">Orphanages post their needs for groceries, clothing, medications, or meals.</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Donors Contribute</h3>
              <p className="text-gray-600">Donors select items to donate, choose a supplier, and make secure payments.</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Delivery Process</h3>
              <p className="text-gray-600">Suppliers prepare items, transporters deliver them, and institutes verify with OTP.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2025 DonateConnect. All rights reserved.</p>
          <p className="text-gray-400">Connecting hearts for a better tomorrow.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;