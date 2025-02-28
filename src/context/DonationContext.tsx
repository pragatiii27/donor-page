import React, { createContext, useContext, useState } from 'react';
import { Donation, DonationItem, InstituteRequest, VolunteerRequest } from '../types';

interface DonationContextType {
  donations: Donation[];
  instituteRequests: InstituteRequest[];
  volunteerRequests: VolunteerRequest[];
  createDonation: (donation: Omit<Donation, 'id' | 'createdAt' | 'otp'>) => void;
  updateDonationStatus: (id: string, status: Donation['status']) => void;
  createInstituteRequest: (request: Omit<InstituteRequest, 'id' | 'createdAt'>) => void;
  createVolunteerRequest: (request: Omit<VolunteerRequest, 'id'>) => void;
  getDonationsByDonor: (donorId: string) => Donation[];
  getDonationsByInstitute: (instituteId: string) => Donation[];
  getDonationsBySupplier: (supplierId: string) => Donation[];
  getDonationsByTransporter: (transporterId: string) => Donation[];
  getInstituteRequestsByInstitute: (instituteId: string) => InstituteRequest[];
  getVolunteerRequestsByInstitute: (instituteId: string) => VolunteerRequest[];
}

// Sample data
const mockDonations: Donation[] = [
  {
    id: 'd1',
    donorId: 'd1',
    instituteId: 'i1',
    supplierId: 's1',
    transporterId: 't1',
    items: [
      { type: 'groceries', quantity: 10, unit: 'kg', description: 'Rice, flour, and pulses' },
      { type: 'clothing', quantity: 20, unit: 'pieces', description: 'Children\'s clothes' }
    ],
    status: 'in-progress',
    totalAmount: 5000,
    deliveryCharge: 500,
    createdAt: new Date().toISOString(),
    otp: '1234'
  }
];

const mockInstituteRequests: InstituteRequest[] = [
  {
    id: 'r1',
    instituteId: 'i1',
    items: [
      { type: 'groceries', quantity: 15, unit: 'kg', description: 'Rice and wheat flour' },
      { type: 'medication', quantity: 5, unit: 'boxes', description: 'Basic first aid supplies' }
    ],
    urgency: 'normal',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

const mockVolunteerRequests: VolunteerRequest[] = [
  {
    id: 'v1',
    instituteId: 'i1',
    title: 'Weekend Art Classes',
    description: 'Looking for volunteers to teach art to children aged 8-12 on weekends',
    skills: ['art', 'teaching'],
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open'
  }
];

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  const [instituteRequests, setInstituteRequests] = useState<InstituteRequest[]>(mockInstituteRequests);
  const [volunteerRequests, setVolunteerRequests] = useState<VolunteerRequest[]>(mockVolunteerRequests);

  const createDonation = (donation: Omit<Donation, 'id' | 'createdAt' | 'otp'>) => {
    const newDonation: Donation = {
      ...donation,
      id: `d${Date.now()}`,
      createdAt: new Date().toISOString(),
      otp: Math.floor(1000 + Math.random() * 9000).toString() // 4-digit OTP
    };
    setDonations([...donations, newDonation]);
  };

  const updateDonationStatus = (id: string, status: Donation['status']) => {
    setDonations(donations.map(donation => 
      donation.id === id ? { ...donation, status } : donation
    ));
  };

  const createInstituteRequest = (request: Omit<InstituteRequest, 'id' | 'createdAt'>) => {
    const newRequest: InstituteRequest = {
      ...request,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setInstituteRequests([...instituteRequests, newRequest]);
  };

  const createVolunteerRequest = (request: Omit<VolunteerRequest, 'id'>) => {
    const newRequest: VolunteerRequest = {
      ...request,
      id: `v${Date.now()}`
    };
    setVolunteerRequests([...volunteerRequests, newRequest]);
  };

  const getDonationsByDonor = (donorId: string) => {
    return donations.filter(donation => donation.donorId === donorId);
  };

  const getDonationsByInstitute = (instituteId: string) => {
    return donations.filter(donation => donation.instituteId === instituteId);
  };

  const getDonationsBySupplier = (supplierId: string) => {
    return donations.filter(donation => donation.supplierId === supplierId);
  };

  const getDonationsByTransporter = (transporterId: string) => {
    return donations.filter(donation => donation.transporterId === transporterId);
  };

  const getInstituteRequestsByInstitute = (instituteId: string) => {
    return instituteRequests.filter(request => request.instituteId === instituteId);
  };

  const getVolunteerRequestsByInstitute = (instituteId: string) => {
    return volunteerRequests.filter(request => request.instituteId === instituteId);
  };

  return (
    <DonationContext.Provider value={{
      donations,
      instituteRequests,
      volunteerRequests,
      createDonation,
      updateDonationStatus,
      createInstituteRequest,
      createVolunteerRequest,
      getDonationsByDonor,
      getDonationsByInstitute,
      getDonationsBySupplier,
      getDonationsByTransporter,
      getInstituteRequestsByInstitute,
      getVolunteerRequestsByInstitute
    }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
};