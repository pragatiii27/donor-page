import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDonation } from '../../context/DonationContext';
import Layout from '../../components/Layout';
import { Package, Truck, Building, Users } from 'lucide-react';

const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getDonationsByDonor } = useDonation();
  const navigate = useNavigate();
  
  if (!user || user.role !== 'donor') {
    return <div>Unauthorized access</div>;
  }

  const donations = getDonationsByDonor(user.id);
  
  // Calculate statistics
  const totalDonations = donations.length;
  const pendingDonations = donations.filter(d => d.status === 'pending' || d.status === 'accepted').length;
  const completedDonations = donations.filter(d => d.status === 'delivered').length;
  const totalAmount = donations.reduce((sum, donation) => sum + donation.totalAmount, 0);

  return (
    <Layout title="Donor Dashboard">
      <div className="dashboard-bg rounded-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
        <p className="text-gray-200">Make a difference today by supporting orphanages in need.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Total Donations</h3>
            <Package className="text-red-600" size={24} />
          </div>
          <p className="text-3xl font-bold">{totalDonations}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <Truck className="text-yellow-600" size={24} />
          </div>
          <p className="text-3xl font-bold">{pendingDonations}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
            <Building className="text-green-600" size={24} />
          </div>
          <p className="text-3xl font-bold">{completedDonations}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Total Amount</h3>
            <span className="text-blue-600 font-bold">₹</span>
          </div>
          <p className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/donor/donate')}
            className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Package size={32} className="text-red-600 mb-2" />
            <span className="font-medium">Make Donation</span>
          </button>
          
          <button 
            onClick={() => navigate('/donor/tracking')}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Truck size={32} className="text-gray-700 mb-2" />
            <span className="font-medium">Track Donations</span>
          </button>
          
          <button 
            onClick={() => navigate('/donor/institutes')}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Building size={32} className="text-gray-700 mb-2" />
            <span className="font-medium">View Institutes</span>
          </button>
          
          <button 
            onClick={() => navigate('/donor/volunteer')}
            className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Users size={32} className="text-red-600 mb-2" />
            <span className="font-medium">Volunteer</span>
          </button>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Recent Donations</h2>
        
        {donations.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No donations yet. Make your first donation today!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.slice(0, 5).map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Hope Orphanage
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donation.items.map(item => `${item.quantity} ${item.unit} ${item.type}`).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ₹{donation.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${donation.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          donation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {donations.length > 5 && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => navigate('/donor/donations')}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              View All Donations
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DonorDashboard;