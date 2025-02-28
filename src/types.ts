export interface User {
  id: string;
  email: string;
  name: string;
  role: 'donor' | 'supplier' | 'transporter' | 'institute';
  phone?: string;
}

export interface Donor extends User {
  role: 'donor';
  donations: Donation[];
}

export interface Supplier extends User {
  role: 'supplier';
  storeType: string;
  storeAddress: string;
  products: string[];
  rating: number;
}

export interface Transporter extends User {
  role: 'transporter';
  vehicleModel: string;
  vehicleColor: string;
  licensePlate: string;
  drivingLicense: string;
  rating: number;
}

export interface Institute extends User {
  role: 'institute';
  address: string;
  history: string;
  licenseNumber: string;
  childrenCount: number;
  ageGroup: string;
  establishedYear: number;
  rating: number;
}

export interface Donation {
  id: string;
  donorId: string;
  instituteId: string;
  supplierId: string;
  transporterId: string;
  items: DonationItem[];
  status: 'pending' | 'accepted' | 'in-progress' | 'delivered';
  totalAmount: number;
  deliveryCharge: number;
  createdAt: string;
  otp: string;
}

export interface DonationItem {
  type: 'groceries' | 'clothing' | 'medication' | 'meals';
  quantity: number;
  unit: string;
  description?: string;
}

export interface VolunteerRequest {
  id: string;
  instituteId: string;
  title: string;
  description: string;
  skills: string[];
  date: string;
  status: 'open' | 'filled';
}

export interface InstituteRequest {
  id: string;
  instituteId: string;
  items: DonationItem[];
  urgency: 'normal' | 'urgent';
  status: 'pending' | 'fulfilled';
  createdAt: string;
}