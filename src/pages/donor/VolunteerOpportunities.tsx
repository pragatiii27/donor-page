import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDonation } from '../../context/DonationContext';
import Layout from '../../components/Layout';
import { Users, Calendar, Clock, MapPin, Search, Building } from 'lucide-react';

// Mock volunteer opportunities
const volunteerOpportunities = [
  {
    id: 'v1',
    instituteId: 'i1',
    instituteName: 'Hope Orphanage',
    instituteAddress: '123 Hope Street, Mumbai',
    title: 'Weekend Art Classes',
    description: 'Looking for volunteers to teach art to children aged 8-12 on weekends. Activities include drawing, painting, and crafts. Materials will be provided.',
    skills: ['art', 'teaching'],
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: '10:00 AM - 12:00 PM',
    status: 'open'
  },
  {
    id: 'v2',
    instituteId: 'i2',
    instituteName: 'Sunshine Children\'s Home',
    instituteAddress: '456 Sunshine Avenue, Mumbai',
    title: 'Math Tutoring',
    description: 'We need volunteers to help our children with mathematics. Suitable for those with teaching experience or strong math skills.',
    skills: ['mathematics', 'teaching'],
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '4:00 PM - 6:00 PM',
    status: 'open'
  },
  {
    id: 'v3',
    instituteId: 'i3',
    instituteName: 'New Beginnings Orphanage',
    instituteAddress: '789 New Road, Mumbai',
    title: 'Sports Day Volunteers',
    description: 'Volunteers needed to help organize and run our annual sports day. Activities include cricket, football, and track events.',
    skills: ['sports', 'event organization'],
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    time: '9:00 AM - 5:00 PM',
    status: 'open'
  },
  {
    id: 'v4',
    instituteId: 'i1',
    instituteName: 'Hope Orphanage',
    instituteAddress: '123 Hope Street, Mumbai',
    title: 'Computer Skills Workshop',
    description: 'Looking for IT professionals to teach basic computer skills to teenagers. Topics include internet safety, basic office applications, and email.',
    skills: ['computer', 'teaching'],
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    time: '2:00 PM - 4:00 PM',
    status: 'open'
  },
  {
    id: 'v5',
    instituteId: 'i4',
    instituteName: 'Little Angels Home',
    instituteAddress: '101 Angel Street, Mumbai',
    title: 'Storytelling Session',
    description: 'We are looking for volunteers who can engage young children through storytelling. Ideal for those who love children\'s literature and have a flair for narration.',
    skills: ['storytelling', 'creativity'],
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    time: '11:00 AM - 12:30 PM',
    status: 'open'
  }
];

const VolunteerOpportunities: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [appliedOpportunities, setAppliedOpportunities] = useState<string[]>([]);
  
  if (!user || user.role !== 'donor') {
    return <div>Unauthorized access</div>;
  }

  // All unique skills from opportunities
  const allSkills = Array.from(
    new Set(
      volunteerOpportunities.flatMap(opportunity => opportunity.skills)
    )
  ).sort();

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Filter opportunities based on search and selected skills
  const filteredOpportunities = volunteerOpportunities.filter(opportunity => {
    const matchesSearch = 
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.instituteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkills = 
      selectedSkills.length === 0 || 
      selectedSkills.some(skill => opportunity.skills.includes(skill));
    
    return matchesSearch && matchesSkills;
  });

  // Handle apply button click
  const handleApply = (id: string) => {
    if (appliedOpportunities.includes(id)) {
      setAppliedOpportunities(appliedOpportunities.filter(oppId => oppId !== id));
    } else {
      setAppliedOpportunities([...appliedOpportunities, id]);
    }
  };

  return (
    <Layout title="Volunteer Opportunities">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Filters</h2>
            
            <div className="mb-4">
              <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Skills
              </label>
              <div className="space-y-2">
                {allSkills.map(skill => (
                  <div key={skill} className="flex items-center">
                    <input
                      id={`skill-${skill}`}
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      className="mr-2"
                    />
                    <label htmlFor={`skill-${skill}`} className="capitalize">
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Opportunities List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Available Opportunities ({filteredOpportunities.length})
            </h2>
            
            {filteredOpportunities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No volunteer opportunities found matching your criteria.</p>
            ) : (
              <div className="space-y-6">
                {filteredOpportunities.map(opportunity => (
                  <div key={opportunity.id} className="border rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800">{opportunity.title}</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {opportunity.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center mt-2 text-gray-600">
                      <Building size={16} className="mr-1" />
                      <span className="font-medium">{opportunity.instituteName}</span>
                    </div>
                    
                    <p className="mt-3 text-gray-700">{opportunity.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2 text-red-600" />
                        <span>{new Date(opportunity.date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2 text-red-600" />
                        <span>{opportunity.time}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2 text-red-600" />
                        <span>{opportunity.instituteAddress}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-700">Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {opportunity.skills.map(skill => (
                          <span 
                            key={skill} 
                            className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleApply(opportunity.id)}
                        className={`px-4 py-2 rounded-md ${
                          appliedOpportunities.includes(opportunity.id)
                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {appliedOpportunities.includes(opportunity.id) ? 'Cancel Application' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VolunteerOpportunities;