import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDonation } from '../../context/DonationContext';
import Layout from '../../components/Layout';
import Map from '../../components/Map';
import { Package, Truck, Building, Clock } from 'lucide-react';

const TrackDonation: React.FC = () => {
  const { user } = useAuth();
  const { getDonationsByDonor } = useDonation();
  const [selectedDonation, setSelectedDonation] = useState<string | null>(null);
  
  if (!user || user.role !== 'donor') {
    return <div>Unauthorized access</div>;
  }

  const donations = getDonationsByDonor(user.id);
  const activeDonations = donations.filter(d => d.status !== 'delivered');
  
  // Mock data for tracking
  const trackingData = {
    transporter: {
      name: 'Fast Delivery',
      phone: '+91 9876543210',
      vehicle: 'Toyota Hiace (White)',
      licensePlate: 'MH 01 AB 1234',
      currentLocation: {
        lat: 19.0930,
        lng: 72.8558
      },
      eta: '25 minutes'
    },
    supplier: {
      name: 'City Grocers',
      address: '123 Market Street, City',
      location: {
        lat: 19.0760,
        lng: 72.8677
      }
    },
    institute: {
      name: 'Hope Orphanage',
      address: '123 Hope Street, City',
      location: {
        lat: 19.0760,
        lng: 72.8777
      }
    }
  };

  // Get tracking locations for map
  const getTrackingLocations = () => {
    return [
      {
        lat: trackingData.supplier.location.lat,
        lng: trackingData.supplier.location.lng,
        name: trackingData.supplier.name,
        description: 'Pickup Location'
      },
      {
        lat: trackingData.transporter.currentLocation.lat,
        lng: trackingData.transporter.currentLocation.lng,
        name: trackingData.transporter.name,
        description: 'Current Location'
      },
      {
        lat: trackingData.institute.location.lat,
        lng: trackingData.institute.location.lng,
        name: trackingData.institute.name,
        description: 'Delivery Location'
      }
    ];
  };

  // Get status steps based on donation status
  const getStatusSteps = (status: string) => {
    const steps = [
      { title: 'Order Placed', completed: true, time: '10:30 AM' },
      { title: 'Supplier Confirmed', completed: status !== 'pending', time: '10:45 AM' },
      { title: 'Items Packed', completed: status === 'in-progress' || status === 'delivered', time: '11:15 AM' },
      { title: 'In Transit', completed: status === 'in-progress' || status === 'delivered', time: '11:30 AM' },
      { title: 'Delivered', completed: status === 'delivered', time: status === 'delivered' ? '12:15 PM' : '' }
    ];
    return steps;
  };

  return (
    <Layout title="Track Donations">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donations List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Active Donations</h2>
            
            {activeDonations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active donations to track.</p>
            ) : (
              <div className="space-y-4">
                {activeDonations.map(donation => (
                  <div 
                    key={donation.id}
                    onClick={() => setSelectedDonation(donation.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedDonation === donation.id ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          Donation #{donation.id.substring(0, 8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${donation.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          donation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>
                        <span className="font-medium">Items:</span>{' '}
                        {donation.items.map(item => `${item.quantity} ${item.unit} ${item.type}`).join(', ')}
                      </p>
                      <p>
                        <span className="font-medium">Amount:</span> ₹{donation.totalAmount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Tracking Details */}
        <div className="lg:col-span-2">
          {selectedDonation ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">
                Tracking Details
              </h2>
              
              {/* Map */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Live Location</h3>
                <Map 
                  center={[trackingData.transporter.currentLocation.lat, trackingData.transporter.currentLocation.lng]}
                  zoom={13}
                  locations={getTrackingLocations()}
                  height="300px"
                />
              </div>
              
              {/* Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="text-red-600 mr-2" size={20} />
                    <h3 className="font-semibold">ETA</h3>
                  </div>
                  <p className="text-lg font-bold">{trackingData.transporter.eta}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Truck className="text-red-600 mr-2" size={20} />
                    <h3 className="font-semibold">Transporter</h3>
                  </div>
                  <p className="font-medium">{trackingData.transporter.name}</p>
                  <p className="text-sm text-gray-600">{trackingData.transporter.vehicle}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Package className="text-red-600 mr-2" size={20} />
                    <h3 className="font-semibold">OTP</h3>
                  </div>
                  <p className="text-lg font-bold tracking-widest">1234</p>
                  <p className="text-xs text-gray-600">Share with institute for verification</p>
                </div>
              </div>
              
              {/* Status Timeline */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Delivery Status</h3>
                
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Status Steps */}
                  {getStatusSteps(activeDonations.find(d => d.id === selectedDonation)?.status || '').map((step, index) => (
                    <div key={index} className="flex mb-6 relative">
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 z-10 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {step.completed && (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <p className="font-medium">{step.title}</p>
                        {step.time && (
                          <p className="text-sm text-gray-600">{step.time}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Contact Info */}
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Transporter</p>
                      <p className="font-medium">{trackingData.transporter.name}</p>
                      <p className="text-sm">{trackingData.transporter.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Supplier</p>
                      <p className="font-medium">{trackingData.supplier.name}</p>
                      <p className="text-sm">{trackingData.supplier.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full">
              <Truck size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">
                Select a donation from the list to view tracking details.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackDonation;