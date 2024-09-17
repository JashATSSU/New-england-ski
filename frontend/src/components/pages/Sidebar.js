import React from 'react';

// Dummy data for ski resorts
const resortsList = [
  'loon',
  'brettonwoods',
  'attitash',
  'sugarloaf',
  'bolton-valley',
  'bromley-mountain',
  'burke-mountain',
  // Add more resorts as needed
];

const Sidebar = ({ onSelect }) => {
  return (
    <div className="sidebar">
      <h3>New England Ski Resorts Reference List</h3>
      <ul>
        {resortsList.map((resort, index) => (
          <li key={index} onClick={() => onSelect(resort)} className="sidebar-item">
            {resort}
          </li>
        ))}
      </ul>
      <style jsx>{`
        .sidebar {
          width: 250px;
          padding: 20px;
          background: #f1f1f1;
          border-right: 1px solid #ddd;
          height: calc(100vh - 55px); /* Adjust height to fit with the top position */
          position: fixed;
          top: 55px; /* Raised to be less than a centimeter below the navbar */
          left: 0;
          overflow-y: auto; /* Add scroll if content overflows */
        }
        
        .sidebar h3 {
          margin-top: 0;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
        }

        .sidebar-item {
          padding: 10px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .sidebar-item:hover {
          background-color: #ddd;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
