import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import Map from '../../components/Map';
import { Building, Star, Users, Calendar, Search, MapPin } from 'lucide-react';

// Mock data for institutes
const institutes = [
  {
    id: 'i1',
    name: 'Hope Orphanage',
    address: '123 Hope Street, Mumbai',
    childrenCount: 35,
    ageGroup: '5-15 years',
    establishedYear: 2005,
    rating: 4.8,
    history: 'Hope Orphanage was founded in 2005 with the mission to provide care, education, and a loving environment for orphaned children. Over the years, we have helped hundreds of children find their path in life through education and skill development.',
    licenseNumber: 'ORG-12345',
    lat: 19.0760,
    lng: 72.8777
  },
  {
    id: 'i2',
    name: 'Sunshine Children\'s Home',
    address: '456 Sunshine Avenue, Mumbai',
    childrenCount: 28,
    ageGroup: '3-12 years',
    establishedYear: 2010,
    rating: 4.5,
    history: 'Sunshine Children\'s Home was established in 2010 to provide shelter and education to abandoned and orphaned children. We focus on holistic development including academics, sports, and arts.',
    licenseNumber: 'ORG-23456',
    lat: 19.0330,
    lng: 72.8353
  },
  {
    id: 'i3',
    name: 'New Beginnings Orphanage',
    address: '789 New Road, Mumbai',
    childrenCount: 42,
    ageGroup: '6-18 years',
    establishedYear: 2008,
    rating: 4.7,
    history: 'New Beginnings was founded with the belief that every child deserves a chance at a bright future. We provide education, healthcare, and vocational training to prepare our children for independent living.',
    licenseNumber: 'ORG-34567',
    lat: 19.1136,
    lng: 72.9023
  },
  {
    id: 'i4',
    name: 'Little Angels Home',
    address: '101 Angel Street, Mumbai',
    childrenCount: 25,
    ageGroup: '2-10 years',
    establishedYear: 2012,
    rating: 4.6,
    history: 'Little Angels Home specializes in caring for younger children, providing early childhood education and development in a nurturing environment.',
    licenseNumber: 'ORG-45678',
    lat: 19.0178,
    lng: 72.8478
  },
  {
    id: 'i5',
    name: 'Bright Future Foundation',
    address: '202 Future Lane, Mumbai',
    childrenCount: 50,
    ageGroup: '5-18 years',
    establishedYear: 2003,
    rating: 4.9,
    history: 'Bright Future Foundation is one of the oldest orphanages in the region, with a strong focus on academic excellence and character development.',
    licenseNumber: 'ORG-56789',
    lat: 19.0821,
    lng: 72.9010
  }
];

const InstituteList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.0760, 72.8777]);
  
  if (!user || user.role !== 'donor') {
    return <div>Unauthorized access</div>;
  }

  // Filter institutes based on search term
  const filteredInstitutes = institutes.filter(institute => 
    institute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institute.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected institute details
  const selectedInstituteDetails = institutes.find(i => i.id === selectedInstitute);

  // Get map locations
  const getMapLocations = () => {
    if (selectedInstitute) {
      const institute = institutes.find(i => i.id === selectedInstitute);
      if (institute) {
        return [{
          lat: institute.lat,
          lng: institute.lng,
          name: institute.name,
          description: institute.address
        }];
      }
    }
    
    return filteredInstitutes.map(institute => ({
      lat: institute.lat,
      lng: institute.lng,
      name: institute.name,
      description: institute.address
    }));
  };

  // Handle institute selection
  const handleInstituteSelect = (id: string) => {
    setSelectedInstitute(id);
    const institute = institutes.find(i => i.id === id);
    if (institute) {
      setMapCenter([institute.lat, institute.lng]);
    }
  };

  // Handle donate button click
  const handleDonate = () => {
    navigate('/donor/donate');
  };

  return (
    <Layout title="Orphanage Institutes">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search institutes by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Institutes List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Institutes ({filteredInstitutes.length})</h2>
            
            {filteredInstitutes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No institutes found matching your search.</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredInstitutes.map(institute => (
                  <div 
                    key={institute.id}
                    onClick={() => handleInstituteSelect(institute.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedInstitute === institute.id ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{institute.name}</h3>
                      <div className="flex items-center">
                        <Star className="text-yellow-500 fill-yellow-500" size={16} />
                        <span className="ml-1">{institute.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin size={14} className="mr-1" />
                      <span>{institute.address}</span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Users size={14} className="mr-1 text-gray-500" />
                        <span>{institute.childrenCount} children</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-500" />
                        <span>Est. {institute.establishedYear}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Institute Details */}
        <div className="lg:col-span-2">
          {selectedInstituteDetails ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedInstituteDetails.name}</h2>
                  <div className="flex items-center mt-1">
                    <MapPin size={16} className="text-gray-500 mr-1" />
                    <span className="text-gray-600">{selectedInstituteDetails.address}</span>
                  </div>
                </div>
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="text-yellow-500 fill-yellow-500" size={18} />
                  <span className="ml-1 font-bold">{selectedInstituteDetails.rating}</span>
                </div>
              </div>
              
              {/* Map */}
              <div className="mb-6">
                <Map 
                  center={mapCenter}
                  zoom={15}
                  locations={getMapLocations()}
                  height="250px"
                />
              </div>
              
              {/* Institute Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Users className="text-red-600 mr-2" size={20} />
                    <h3 className="font-semibold">Children</h3>
                  </div>
                  <p className="text-lg font-bold">{selectedInstituteDetails.childrenCount}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Calendar className="text-red-600 mr-2" size={20} />
                    <h3 className="font-semibold">Established</h3>
                  </div>
                  <p className="text-lg font-bold">{selectedInstituteDetails.establishedYear}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Building className="text-red-600 mr-2" size={20} />
                    <h3 className="font-semibold">License</h3>
                  </div>
                  <p className="text-lg font-bold">{selectedInstituteDetails.licenseNumber}</p>
                </div>
              </div>
              
              {/* Institute History */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">About</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedInstituteDetails.history}</p>
                </div>
              </div>
              
              {/* Age Group */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Age Group</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg font-bold">{selectedInstituteDetails.ageGroup}</p>
                </div>
              </div>
              
              {/* Donate Button */}
              <div className="text-center">
                <button onClick={handleDonate} className="btn-primary px-8 py-3">
                  Donate to {selectedInstituteDetails.name}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full">
              <Building size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">
                Select an institute from the list to view details.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InstituteList;