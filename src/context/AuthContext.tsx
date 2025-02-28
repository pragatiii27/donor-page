import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (userData: any, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers = {
  donor: {
    id: 'd1',
    email: 'donor@example.com',
    password: 'password',
    name: 'John Donor',
    role: 'donor',
    donations: []
  },
  supplier: {
    id: 's1',
    email: 'supplier@example.com',
    password: 'password',
    name: 'Supply Store',
    role: 'supplier',
    storeType: 'Grocery',
    storeAddress: '123 Supply St',
    products: ['groceries', 'clothing'],
    rating: 4.5
  },
  transporter: {
    id: 't1',
    email: 'transporter@example.com',
    password: 'password',
    name: 'Fast Delivery',
    role: 'transporter',
    vehicleModel: 'Toyota Hiace',
    vehicleColor: 'White',
    licensePlate: 'TR-1234',
    drivingLicense: 'DL-987654',
    rating: 4.2
  },
  institute: {
    id: 'i1',
    email: 'institute@example.com',
    password: 'password',
    name: 'Hope Orphanage',
    role: 'institute',
    address: '456 Hope St',
    history: 'Founded in 2005 to provide care for abandoned children',
    licenseNumber: 'ORG-12345',
    childrenCount: 35,
    ageGroup: '5-15 years',
    establishedYear: 2005,
    rating: 4.8
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: string) => {
    // In a real app, this would be an API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // @ts-ignore - mockUsers type is complex
        const mockUser = mockUsers[role];
        
        if (mockUser && mockUser.email === email && mockUser.password === password) {
          // Remove password before storing
          const { password, ...userWithoutPassword } = mockUser;
          setUser(userWithoutPassword as User);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = async (userData: any, role: string) => {
    // In a real app, this would be an API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: `${role[0]}${Date.now()}`,
          ...userData,
          role
        };
        
        // Remove password before storing in state
        const { password, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword as User);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};