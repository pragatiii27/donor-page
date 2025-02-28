import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDonation } from '../../context/DonationContext';
import Layout from '../../components/Layout';
import Map from '../../components/Map';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../../components/PaymentForm';
import { DonationItem } from '../../types';
import { Package, Building, Truck, ShoppingBag, Star } from 'lucide-react';

// Mock Stripe promise (in a real app, you would use your actual publishable key)
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

// Mock data for institutes
const institutes = [
  {
    id: 'i1',
    name: 'Hope Orphanage',
    address: '123 Hope Street, City',
    childrenCount: 35,
    ageGroup: '5-15 years',
    rating: 4.8,
    lat: 19.0760,
    lng: 72.8777
  },
  {
    id: 'i2',
    name: 'Sunshine Children\'s Home',
    address: '456 Sunshine Avenue, City',
    childrenCount: 28,
    ageGroup: '3-12 years',
    rating: 4.5,
    lat: 19.0330,
    lng: 72.8353
  },
  {
    id: 'i3',
    name: 'New Beginnings Orphanage',
    address: '789 New Road, City',
    childrenCount: 42,
    ageGroup: '6-18 years',
    rating: 4.7,
    lat: 19.1136,
    lng: 72.9023
  }
];

// Mock data for suppliers
const suppliers = [
  {
    id: 's1',
    name: 'City Grocers',
    address: '123 Market Street, City',
    products: ['groceries', 'meals'],
    rating: 4.6,
    lat: 19.0760,
    lng: 72.8677
  },
  {
    id: 's2',
    name: 'Kids Clothing Store',
    address: '456 Fashion Avenue, City',
    products: ['clothing'],
    rating: 4.3,
    lat: 19.0330,
    lng: 72.8253
  },
  {
    id: 's3',
    name: 'MediCare Pharmacy',
    address: '789 Health Road, City',
    products: ['medication'],
    rating: 4.8,
    lat: 19.1136,
    lng: 72.8923
  },
  {
    id: 's4',
    name: 'General Supplies',
    address: '101 Supply Street, City',
    products: ['groceries', 'clothing', 'medication'],
    rating: 4.5,
    lat: 19.0560,
    lng: 72.8477
  }
];

// Mock data for transporters
const transporters = [
  {
    id: 't1',
    name: 'Fast Delivery',
    rating: 4.7
  },
  {
    id: 't2',
    name: 'City Express',
    rating: 4.5
  },
  {
    id: 't3',
    name: 'Reliable Transport',
    rating: 4.8
  }
];

const DonationForm: React.FC = () => {
  const { user } = useAuth();
  const { createDonation } = useDonation();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState<DonationItem[]>([]);
  const [selectedInstitute, setSelectedInstitute] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedTransporter, setSelectedTransporter] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.0760, 72.8777]);
  const [mapLocations, setMapLocations] = useState<any[]>([]);
  
  // Item types and their base prices
  const itemTypes = [
    { id: 'groceries', name: 'Groceries', basePrice: 50 },
    { id: 'clothing', name: 'Clothing', basePrice: 200 },
    { id: 'medication', name: 'Medication', basePrice: 100 },
    { id: 'meals', name: 'Full Day Meals', basePrice: 80 }
  ];

  // Add a new item to the donation
  const addItem = () => {
    setSelectedItems([
      ...selectedItems, 
      { type: 'groceries', quantity: 1, unit: 'kg' }
    ]);
  };

  // Remove an item from the donation
  const removeItem = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  // Update an item in the donation
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...selectedItems];
    // @ts-ignore
    newItems[index][field] = value;
    setSelectedItems(newItems);
  };

  // Calculate total amount based on selected items
  useEffect(() => {
    let total = 0;
    selectedItems.forEach(item => {
      const itemType = itemTypes.find(type => type.id === item.type);
      if (itemType) {
        total += itemType.basePrice * item.quantity;
      }
    });
    setTotalAmount(total);
    
    // Calculate delivery charge (10% of total or minimum ₹100)
    const delivery = Math.max(total * 0.1, 100);
    setDeliveryCharge(delivery);
  }, [selectedItems]);

  // Update map when institute or supplier is selected
  useEffect(() => {
    const locations: any[] = [];
    
    if (selectedInstitute) {
      const institute = institutes.find(i => i.id === selectedInstitute);
      if (institute) {
        locations.push({
          lat: institute.lat,
          lng: institute.lng,
          name: institute.name,
          description: 'Recipient Institute'
        });
        
        // Center map on institute if it's the only selection
        if (!selectedSupplier) {
          setMapCenter([institute.lat, institute.lng]);
        }
      }
    }
    
    if (selectedSupplier) {
      const supplier = suppliers.find(s => s.id === selectedSupplier);
      if (supplier) {
        locations.push({
          lat: supplier.lat,
          lng: supplier.lng,
          name: supplier.name,
          description: 'Supplier'
        });
        
        // Center map on supplier if it's the only selection
        if (!selectedInstitute) {
          setMapCenter([supplier.lat, supplier.lng]);
        }
      }
    }
    
    // If both are selected, center the map between them
    if (selectedInstitute && selectedSupplier) {
      const institute = institutes.find(i => i.id === selectedInstitute);
      const supplier = suppliers.find(s => s.id === selectedSupplier);
      
      if (institute && supplier) {
        setMapCenter([
          (institute.lat + supplier.lat) / 2,
          (institute.lng + supplier.lng) / 2
        ]);
      }
    }
    
    setMapLocations(locations);
  }, [selectedInstitute, selectedSupplier]);

  // Filter suppliers based on selected items
  const filteredSuppliers = suppliers.filter(supplier => {
    const requiredProducts = [...new Set(selectedItems.map(item => item.type))];
    return requiredProducts.every(product => supplier.products.includes(product));
  });

  // Handle form submission
  const handleSubmit = () => {
    if (!user) return;
    
    createDonation({
      donorId: user.id,
      instituteId: selectedInstitute,
      supplierId: selectedSupplier,
      transporterId: selectedTransporter,
      items: selectedItems,
      status: 'pending',
      totalAmount: totalAmount + deliveryCharge,
      deliveryCharge
    });
    
    navigate('/donor/dashboard');
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setStep(5); // Move to confirmation step
  };

  // Render different steps of the form
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Package className="mr-2 text-red-600" size={24} />
              Select Donation Items
            </h2>
            
            {selectedItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No items added yet. Start by adding items to donate.</p>
                <button onClick={addItem} className="btn-primary">
                  Add First Item
                </button>
              </div>
            ) : (
              <>
                {selectedItems.map((item, index) => (
                  <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Item #{index + 1}</h3>
                      <button 
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Type
                        </label>
                        <select
                          value={item.type}
                          onChange={(e) => updateItem(index, 'type', e.target.value)}
                          className="input-field"
                        >
                          {itemTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                          className="input-field"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Unit
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) => updateItem(index, 'unit', e.target.value)}
                          className="input-field"
                        >
                          <option value="kg">Kilograms (kg)</option>
                          <option value="pieces">Pieces</option>
                          <option value="boxes">Boxes</option>
                          <option value="sets">Sets</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="E.g., Rice, flour, pulses"
                        className="input-field"
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center mt-6">
                  <button onClick={addItem} className="btn-secondary">
                    Add Another Item
                  </button>
                  
                  <button 
                    onClick={() => setStep(2)} 
                    disabled={selectedItems.length === 0}
                    className="btn-primary"
                  >
                    Next: Select Institute
                  </button>
                </div>
              </>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Building className="mr-2 text-red-600" size={24} />
              Select Institute
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {institutes.map(institute => (
                <div 
                  key={institute.id}
                  onClick={() => setSelectedInstitute(institute.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedInstitute === institute.id ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{institute.name}</h3>
                    <div className="flex items-center">
                      <Star className="text-yellow-500 fill-yellow-500" size={16} />
                      <span className="ml-1">{institute.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">{institute.address}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-semibold">Children:</span> {institute.childrenCount}
                    </div>
                    <div>
                      <span className="font-semibold">Age Group:</span> {institute.ageGroup}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedInstitute && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Institute Location</h3>
                <Map 
                  center={mapCenter}
                  zoom={12}
                  locations={mapLocations}
                  height="300px"
                />
              </div>
            )}
            
            <div className="flex justify-between items-center mt-6">
              <button onClick={() => setStep(1)} className="btn-secondary">
                Back: Items
              </button>
              
              <button 
                onClick={() => setStep(3)} 
                disabled={!selectedInstitute}
                className="btn-primary"
              >
                Next: Select Supplier
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <ShoppingBag className="mr-2 text-red-600" size={24} />
              Select Supplier
            </h2>
            
            {filteredSuppliers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">No suppliers found that provide all the selected items.</p>
                <button onClick={() => setStep(1)} className="btn-primary">
                  Modify Items
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {filteredSuppliers.map(supplier => (
                    <div 
                      key={supplier.id}
                      onClick={() => setSelectedSupplier(supplier.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedSupplier === supplier.id ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{supplier.name}</h3>
                        <div className="flex items-center">
                          <Star className="text-yellow-500 fill-yellow-500" size={16} />
                          <span className="ml-1">{supplier.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">{supplier.address}</p>
                      <div className="mt-3">
                        <span className="font-semibold">Products:</span>{' '}
                        {supplier.products.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedSupplier && selectedInstitute && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Supplier & Institute Locations</h3>
                    <Map 
                      center={mapCenter}
                      zoom={12}
                      locations={mapLocations}
                      height="300px"
                    />
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-6">
                  <button onClick={() => setStep(2)} className="btn-secondary">
                    Back: Institute
                  </button>
                  
                  <button 
                    onClick={() => {
                      // Auto-select first transporter for simplicity
                      setSelectedTransporter(transporters[0].id);
                      setStep(4);
                    }} 
                    disabled={!selectedSupplier}
                    className="btn-primary"
                  >
                    Next: Payment
                  </button>
                </div>
              </>
            )}
          </div>
        );
      
      case 4:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2 text-red-600 font-bold">₹</span>
              Payment Details
            </h2>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 mb-4">
                  {selectedItems.map((item, index) => {
                    const itemType = itemTypes.find(type => type.id === item.type);
                    const itemTotal = itemType ? itemType.basePrice * item.quantity : 0;
                    
                    return (
                      <div key={index} className="flex justify-between">
                        <span>
                          {item.quantity} {item.unit} {itemType?.name} 
                          {item.description ? ` (${item.description})` : ''}
                        </span>
                        <span>₹{itemTotal}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>₹{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>₹{totalAmount + deliveryCharge}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Payment Method</h3>
              <Elements stripe={stripePromise}>
                <PaymentForm 
                  amount={totalAmount + deliveryCharge} 
                  onSuccess={handlePaymentSuccess} 
                />
              </Elements>
            </div>
            
            <button onClick={() => setStep(3)} className="btn-secondary">
              Back: Supplier
            </button>
          </div>
        );
      
      case 5:
        return (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mt-4">Donation Successful!</h2>
              <p className="text-gray-600 mt-2">
                Thank you for your generous donation. Your contribution will make a difference.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold mb-2">Donation Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Institute</p>
                  <p className="font-medium">
                    {institutes.find(i => i.id === selectedInstitute)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Supplier</p>
                  <p className="font-medium">
                    {suppliers.find(s => s.id === selectedSupplier)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Items</p>
                  <p className="font-medium">
                    {selectedItems.map(item => {
                      const typeName = itemTypes.find(t => t.id === item.type)?.name;
                      return `${item.quantity} ${item.unit} ${typeName}`;
                    }).join(', ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium">₹{totalAmount + deliveryCharge}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button onClick={handleSubmit} className="btn-primary">
                Complete Donation
              </button>
              <button onClick={() => navigate('/donor/tracking')} className="btn-secondary">
                Track Donation
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!user || user.role !== 'donor') {
    return <div>Unauthorized access</div>;
  }

  return (
    <Layout title="Make a Donation">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, title: 'Select Items' },
            { num: 2, title: 'Choose Institute' },
            { num: 3, title: 'Choose Supplier' },
            { num: 4, title: 'Payment' },
            { num: 5, title: 'Confirmation' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s.num ? 'bg-red-600 text-white' : 'bg-gray -200 text-gray-600'
                }`}
              >
                {s.num}
              </div>
              <span className={`mt-2 text-sm ${step >= s.num ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-red-600 rounded-full transition-all"
            style={{ width: `${(step - 1) * 25}%` }}
          ></div>
        </div>
      </div>
      
      {renderStep()}
    </Layout>
  );
};

export default DonationForm;