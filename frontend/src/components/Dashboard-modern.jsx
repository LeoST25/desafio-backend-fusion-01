import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Home from './Home';
import PlanetManager from './PlanetManager';
import MfaSettings from './MfaSettings';
import CharacterManager from './CharacterManager';
import SpaceshipManager from './SpaceshipManager';
import StarSystemManager from './StarSystemManager';
import { 
  LogOut, 
  User, 
  Globe, 
  Rocket, 
  Users, 
  Star,
  Shield,
  Settings,
  Menu,
  X,
  Home as HomeIcon,
  Activity,
  Bell,
  Search,
  ChevronRight,
  Plus,
  MoreVertical
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { 
      id: 'home', 
      label: 'Overview', 
      icon: HomeIcon, 
      color: 'text-blue-500',
      description: 'Dashboard principal'
    },
    { 
      id: 'planets', 
      label: 'Planets', 
      icon: Globe, 
      color: 'text-emerald-500',
      description: 'Gerenciar planetas'
    },
    { 
      id: 'characters', 
      label: 'Characters', 
      icon: Users, 
      color: 'text-purple-500',
      description: 'Personagens da galáxia'
    },
    { 
      id: 'spaceships', 
      label: 'Spaceships', 
      icon: Rocket, 
      color: 'text-orange-500',
      description: 'Frota espacial'
    },
    { 
      id: 'star-systems', 
      label: 'Star Systems', 
      icon: Star, 
      color: 'text-yellow-500',
      description: 'Sistemas estelares'
    },
    { 
      id: 'mfa-settings', 
      label: 'Security', 
      icon: Shield, 
      color: 'text-red-500',
      description: 'Configurações MFA'
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const getActiveMenuItem = () => {
    return menuItems.find(item => item.id === activeSection);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">Galactic Hub</h1>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color} ${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center ${sidebarCollapsed ? '' : 'flex-1'}`}>
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{getActiveMenuItem()?.label}</h1>
                <p className="text-sm text-gray-500">{getActiveMenuItem()?.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {/* Quick Add */}
              <button className="flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                New
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {activeSection === 'home' && <Home />}
            {activeSection === 'planets' && <PlanetManager />}
            {activeSection === 'characters' && <CharacterManager />}
            {activeSection === 'spaceships' && <SpaceshipManager />}
            {activeSection === 'star-systems' && <StarSystemManager />}
            {activeSection === 'mfa-settings' && <MfaSettings />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;