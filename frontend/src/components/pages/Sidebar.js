import React from 'react';

// Updated list of New England ski resorts
const resortsList = [
  'Loon',
  'brettonwoods',
  'Attitash',
  'Sugarloaf',
  'Bolton Valley',
  'Bromley Mountain',
  'Burke Mountain',
  'Stowe',
  'Jay Peak',
  'Killington',
  'Stratton',
  'Okemo',
  'mountsnow',
  'Wildcat',
  'Cannon',
  'Windham',
];

const Sidebar = ({ onSelect }) => {
  return (
    <div className="sidebar bg-gray-200 p-6 border-r border-gray-300 h-screen shadow-lg flex flex-col">
      <h3 className="text-xl font-bold mb-5 text-gray-800 text-center">New England Ski Resorts</h3>
      <div className="flex-grow overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-500 scrollbar-thumb-rounded">
        <ul className="space-y-3">
          {resortsList.map((resort, index) => (
            <li 
              key={index} 
              onClick={() => onSelect(resort.toLowerCase().replace(' ', '-'))}
              className="cursor-pointer p-3 rounded-lg bg-white shadow hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out transform hover:scale-105"
            >
              {resort}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Select a resort to view details</p>
      </div>
    </div>
  );
};

export default Sidebar;
