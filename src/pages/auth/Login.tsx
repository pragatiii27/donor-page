import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { Heart, ShoppingBag, Truck, Building } from 'lucide-react';

const Login: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
        return 'Donor Login';
      case 'supplier':
        return 'Supplier Login';
      case 'transporter':
        return 'Transporter Login';
      case 'institute':
        return 'Institute Login';
      default:
        return 'Login';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!role) {
        throw new Error('Role is required');
      }
      
      await login(email, password, role);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={getRoleTitle()} showSidebar={false}>
      <div className="max-w-md mx-auto">
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
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate(`/register/${role}`)}
                className="text-red-600 hover:text-red-800"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;