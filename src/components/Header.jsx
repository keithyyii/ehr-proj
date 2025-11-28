import React, { useState } from 'react';
// FIX: Changed import path to explicitly include the file extension (.jsx)
import { useNavigation } from '../context/NavigationContext.jsx';

const Header = () => {
  const { navigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  // Fixed button functionality using navigate()
  const handleNewEncounter = () => navigate('encounter');
  
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 h-16 shadow-sm flex-shrink-0">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-gray-900">Staff Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-50 text-gray-900 placeholder-gray-400 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-200 transition duration-200 w-72 text-sm"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        </div>
        <span className="text-xs text-gray-500">Fri, Nov 28 · 4:47 PM</span>
        <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
          <button className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition duration-150 relative">
            🔔
            <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              3
            </span>
          </button>
          <button
            onClick={handleNewEncounter}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 text-sm shadow-sm hover:shadow"
          >
            + Encounter
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;