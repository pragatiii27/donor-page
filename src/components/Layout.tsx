import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Home, Package, Truck, Building } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showSidebar = true }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">DonateConnect</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">{user.name}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-700 hover:bg-red-800 px-3 py-1 rounded-md transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && user && (
          <aside className="w-64 bg-gray-800 text-white min-h-[calc(100vh-64px)] shadow-lg">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-6">
                <User size={24} />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>

              <nav>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => navigate(`/${user.role}/dashboard`)}
                      className="w-full flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <Home size={20} />
                      <span>Dashboard</span>
                    </button>
                  </li>
                  
                  {user.role === 'donor' && (
                    <>
                      <li>
                        <button 
                          onClick={() => navigate('/donor/donate')}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <Package size={20} />
                          <span>Make Donation</span>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => navigate('/donor/tracking')}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <Truck size={20} />
                          <span>Track Donations</span>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => navigate('/donor/institutes')}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <Building size={20} />
                          <span>Institutes</span>
                        </button>
                      </li>
                    </>
                  )}

                  {user.role === 'supplier' && (
                    <>
                      <li>
                        <button 
                          onClick={() => navigate('/supplier/requests')}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <Package size={20} />
                          <span>Pending Requests</span>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => navigate('/supplier/tracking')}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <Truck size={20} />
                          <span>Track Deliveries</span>
                        </button>
                      </li>
                    </>
                  )}

                  {user.role === 'transporter' && (
                    <>
                      <li>
                        <button 
                          onClick={() => navigate('/transporter/deliveries')}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <Package size={20} />
                          <span>Pending Deliveries</span>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => navigate('/transporter/completed')}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <Truck size={20} />
                          <span>Completed Deliveries</span>
                        </button>
                      </li>
                    </>
                  )}

                  {user.role === 'institute' && (
                    <>
                      <li>
                        <button 
                          onClick={() => navigate('/institute/requests')}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <Package size={20} />
                          <span>Create Request</span>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => navigate('/institute/donations')}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <Truck size={20} />
                          <span>Incoming Donations</span>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => navigate('/institute/volunteers')}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <User size={20} />
                          <span>Volunteer Requests</span>
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;