import React from 'react';
import { Users, Plus, Search, Filter } from 'lucide-react';

export default function Staffing() {
  const staff = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Stage Manager',
      department: 'Production',
      status: 'Active',
      availability: 'Available'
    },
    {
      id: 2,
      name: 'Mike Thompson',
      role: 'Audio Engineer',
      department: 'Technical',
      status: 'Active',
      availability: 'On Project'
    },
    {
      id: 3,
      name: 'David Wilson',
      role: 'Lighting Designer',
      department: 'Technical',
      status: 'Active',
      availability: 'Available'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Staffing</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search staff..."
              className="pl-10 pr-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
            />
            <Search className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
          </div>
          <button className="flex items-center px-4 py-2 bg-mono-100 text-mono-700 rounded-lg hover:text-accent">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-mono-800 text-white rounded-lg hover:bg-accent">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Name</div>
          <div>Role</div>
          <div>Department</div>
          <div>Availability</div>
          <div></div>
        </div>
        
        {staff.map(person => (
          <div key={person.id} className="grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50">
            <div className="col-span-2 flex items-center">
              <Users className="w-5 h-5 text-mono-400 mr-2" />
              <div>
                <div className="font-medium text-mono-900">{person.name}</div>
                <div className="text-sm text-mono-500">{person.status}</div>
              </div>
            </div>
            <div className="text-mono-600">{person.role}</div>
            <div className="text-mono-600">{person.department}</div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                person.availability === 'Available' ? 'bg-mono-100 text-mono-800' : 'bg-mono-200 text-mono-800'
              }`}>
                {person.availability}
              </span>
            </div>
            <div className="flex justify-end space-x-2">
              <button className="text-mono-600 hover:text-accent">View</button>
              <button className="text-mono-600 hover:text-accent">Edit</button>
              <button className="text-mono-600 hover:text-accent">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}