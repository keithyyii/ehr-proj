import React, { useState } from 'react';
// FIX: Changed import path to explicitly include the file extension (.jsx)
import { useNavigation } from '../context/NavigationContext.jsx'; 

const initialSidebarItems = [
  { label: 'Overview', icon: '📊', view: 'dashboard' },
  { label: 'Appointments', icon: '📅', view: 'appointments' },
  { label: 'Patients', icon: '👤', view: 'patients' },
  { label: 'Encounters', icon: '📝', view: 'encounters' },
  { label: 'Reports', icon: '📈', view: 'reports' },
  { label: 'Inventory', icon: '📦', view: 'inventory' },
  { label: 'Administration', icon: '⚙️', view: 'admin' },
];

const NavItem = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
      isActive
        ? 'bg-red-600 text-white shadow-sm font-semibold'
        : 'text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium'
    }`}
  >
    <span className="w-5 h-5 mr-3 text-base">{icon}</span>
    <span>{label}</span>
  </button>
);

const Sidebar = () => {
  const { currentView, navigate } = useNavigation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Hardcoded avatar/logo paths for demo; adjust if moved
  // NOTE: These paths assume the assets are available at the root relative path in the final build.
  const logoSrc = "src/assets/images/tupehrlogo.jpg"; 
  const avatarSrc = "src/assets/images/avatar-placeholder.jpg"; 

  // Handlers for profile actions
  const handleSignOut = () => {
    // Implement actual sign out/auth context logic here
    console.log("Signing out...");
    navigate('login'); // Assuming a 'login' view exists
    setIsProfileMenuOpen(false);
  };
  const handleViewProfile = () => {
    navigate('my-profile');
    setIsProfileMenuOpen(false);
  };
  const handleSettings = () => {
    navigate('settings');
    setIsProfileMenuOpen(false);
  };

  return (
    <div className="flex flex-col flex-shrink-0 bg-white border-r border-gray-200 w-64">
      <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
        <div className="flex items-center">
          <img src={logoSrc} alt="TUP Clinic Logo" className="w-8 h-8 mr-2 rounded"/>
          <span className="text-lg font-bold text-red-600">TUP</span>
          <span className="text-xs text-gray-500 ml-1">Clinic</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition duration-150 relative"
          >
            <img src={avatarSrc} alt="Profile" className="w-8 h-8 rounded-full" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
              <button
                onClick={handleViewProfile}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-150"
              >
                View Profile
              </button>
              <button
                onClick={handleSettings}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-150"
              >
                Settings
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-grow py-3 px-2 space-y-1 overflow-y-auto">
        {initialSidebarItems.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            isActive={currentView === item.view}
            onClick={() => navigate(item.view)}
          />
        ))}

        <div className="pt-2 mt-3 border-t border-gray-200 space-y-1">
          <NavItem icon="❓" label="Help" isActive={currentView === 'help'} onClick={() => navigate('help')} />
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs">
          <p className="font-semibold text-gray-900">Dr. Rivera</p>
          <p className="text-gray-500 mt-1">Last backup: 2 days ago</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;