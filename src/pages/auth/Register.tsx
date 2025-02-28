import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { Heart, ShoppingBag, Truck, Building } from 'lucide-react';

const Register: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Donor specific fields
    // Supplier specific fields
    storeType: '',
    storeAddress: '',
    products: [] as string[],
    // Transporter specific fields
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: '',
    drivingLicense: '',
    // Institute specific fields
    address: '',
    history: '',
    licenseNumber: '',
    childrenCount: 0,
    ageGroup: '',
    establishedYear: 2000,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getRoleIcon = () => {
    switch (role) {
      case 'donor':
        return <Heart size={32} className="text-red-600" />;
      case 'supplier':
        return <ShoppingBag size={32} className="text-gray-800" />;
      case 'transporter':
        return <Truck size={32} className="text-gray-800" />;
      case 'institute':
        return <Building size={32} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'donor':
        return 'Donor Registration';
      case 'supplier':
        return 'Supplier Registration';
      case 'transporter':
        return 'Transporter Registration';
      case 'institute':
        return 'Institute Registration';
      default:
        return 'Registration';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const checkboxValue = (e.target as HTMLInputElement).value;
      
      setFormData(prev => ({
        ...prev,
        products: checked 
          ? [...prev.products, checkboxValue]
          : prev.products.filter(item => item !== checkboxValue)
      }));
    } else if (name === 'childrenCount' || name === 'establishedYear') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      if (!role) {
        throw new Error('Role is required');
      }
      
      // Create user data based on role
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        ...(role === 'supplier' && {
          storeType: formData.storeType,
          storeAddress: formData.storeAddress,
          products: formData.products,
          rating: 0
        }),
        ...(role === 'transporter' && {
          vehicleModel: formData.vehicleModel,
          vehicleColor: formData.vehicleColor,
          licensePlate: formData.licensePlate,
          drivingLicense: formData.drivingLicense,
          rating: 0
        }),
        ...(role === 'institute' && {
          address: formData.address,
          history: formData.history,
          licenseNumber: formData.licenseNumber,
          childrenCount: formData.childrenCount,
          ageGroup: formData.ageGroup,
          establishedYear: formData.establishedYear,
          rating: 0
        })
      };
      
      await register(userData, role);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={getRoleTitle()} showSidebar={false}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center mb-6">
            {getRoleIcon()}
            <h2 className="text-2xl font-bold mt-2">{getRoleTitle()}</h2>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  {role === 'institute' ? 'Institute Name' : 'Full Name'}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Supplier Specific Fields */}
            {role === 'supplier' && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Supplier Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="storeType" className="block text-gray-700 text-sm font-bold mb-2">
                      Store Type
                    </label>
                    <select
                      id="storeType"
                      name="storeType"
                      value={formData.storeType}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Store Type</option>
                      <option value="Grocery">Grocery</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="General">General Store</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="storeAddress" className="block text-gray-700 text-sm font-bold mb-2">
                      Store Address
                    </label>
                    <input
                      id="storeAddress"
                      name="storeAddress"
                      type="text"
                      value={formData.storeAddress}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Products Available
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <input
                        id="groceries"
                        name="products"
                        type="checkbox"
                        value="groceries"
                        checked={formData.products.includes('groceries')}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="groceries">Groceries</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="clothing"
                        name="products"
                        type="checkbox"
                        value="clothing"
                        checked={formData.products.includes('clothing')}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="clothing">Clothing</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="medication"
                        name="products"
                        type="checkbox"
                        value="medication"
                        checked={formData.products.includes('medication')}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="medication">Medication</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="meals"
                        name="products"
                        type="checkbox"
                        value="meals"
                        checked={formData.products.includes('meals')}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="meals">Full Day Meals</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transporter Specific Fields */}
            {role === 'transporter' && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Transporter Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vehicleModel" className="block text-gray-700 text-sm font-bold mb-2">
                      Vehicle Model
                    </label>
                    <input
                      id="vehicleModel"
                      name="vehicleModel"
                      type="text"
                      value={formData.vehicleModel}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="vehicleColor" className="block text-gray-700 text-sm font-bold mb-2">
                      Vehicle Color
                    </label>
                    <input
                      id="vehicleColor"
                      name="vehicleColor"
                      type="text"
                      value={formData.vehicleColor}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="licensePlate" className="block text-gray-700 text-sm font-bold mb-2">
                      License Plate Number
                    </label>
                    <input
                      id="licensePlate"
                      name="licensePlate"
                      type="text"
                      value={formData.licensePlate}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="drivingLicense" className="block text-gray-700 text-sm font-bold mb-2">
                      Driving License Number
                    </label>
                    <input
                      id="drivingLicense"
                      name="drivingLicense"
                      type="text"
                      value={formData.drivingLicense}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Institute Specific Fields */}
            {role === 'institute' && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Institute Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="licenseNumber" className="block text-gray-700 text-sm font-bold mb-2">
                      License Number
                    </label>
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="childrenCount" className="block text-gray-700 text-sm font-bold mb-2">
                      Number of Children
                    </label>
                    <input
                      id="childrenCount"
                      name="childrenCount"
                      type="number"
                      value={formData.childrenCount}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="ageGroup" className="block text-gray-700 text-sm font-bold mb-2">
                      Age Group
                    </label>
                    <input
                      id="ageGroup"
                      name="ageGroup"
                      type="text"
                      placeholder="e.g., 5-15 years"
                      value={formData.ageGroup}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="establishedYear" className="block text-gray-700 text-sm font-bold mb-2">
                      Established Year
                    </label>
                    <input
                      id="establishedYear"
                      name="establishedYear"
                      type="number"
                      value={formData.establishedYear}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="history" className="block text-gray-700 text-sm font-bold mb-2">
                    Institute History
                  </label>
                  <textarea
                    id="history"
                    name="history"
                    value={formData.history}
                    onChange={handleChange}
                    className="input-field h-32"
                    required
                  ></textarea>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary mt-6 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate(`/login/${role}`)}
                className="text-red-600 hover:text-red-800"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;