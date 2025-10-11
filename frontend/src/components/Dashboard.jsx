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
  ChevronLeft,
  ChevronRight,
  Zap,
  Command,
  MoreHorizontal
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Início', icon: HomeIcon, color: 'text-blue-600' },
    { id: 'planets', label: 'Planetas', icon: Globe, color: 'text-green-600' },
    { id: 'characters', label: 'Personagens', icon: Users, color: 'text-purple-600' },
    { id: 'spaceships', label: 'Naves', icon: Rocket, color: 'text-orange-600' },
    { id: 'starsystems', label: 'Sistemas Estelares', icon: Star, color: 'text-yellow-600' },
    { id: 'mfa-settings', label: 'MFA Security', icon: Shield, color: 'text-red-600' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'planets':
        return <PlanetManager />;
      case 'characters':
        return <CharacterManager />;
      case 'spaceships':
        return <SpaceshipManager />;
      case 'starsystems':
        return <StarSystemManager />;
      case 'mfa-settings':
        return <MfaSettings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Glassmorphism Sidebar */}
      <div className={`${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } fixed left-0 top-0 h-full backdrop-blur-xl bg-white/10 border-r border-white/20 transition-all duration-300 flex flex-col z-50`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Galactic Hub</h1>
                <p className="text-xs text-blue-200">Star Wars Universe</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white/70 hover:text-white"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-400/30 shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title={sidebarCollapsed ? item.label : ''}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`p-2 rounded-lg ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                    : 'group-hover:bg-white/20'
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                {!sidebarCollapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">{item.label}</span>
                    {activeSection === item.id && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    )}
                  </>
                )}
              </button>
              
              {/* Hover tooltip for collapsed sidebar */}
              {sidebarCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-white/20 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.email?.split('@')[0] || 'Comandante'}
                </p>
                <p className="text-xs text-blue-200 truncate">Jedi Master</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all duration-200 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title={sidebarCollapsed ? 'Sair' : ''}
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'ml-20' : 'ml-72'} transition-all duration-300`}>
        {/* Modern Header */}
        <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 px-8 py-6 relative z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
                <p className="text-blue-200 text-sm">
                  {activeSection === 'home' ? 'Command Center & Overview' : 'Advanced Management Console'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Enhanced Search */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl blur"></div>
                <div className="relative flex items-center">
                  <Command className="absolute left-4 w-4 h-4 text-blue-300" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="pl-12 pr-4 py-3 w-80 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                  <kbd className="absolute right-3 px-2 py-1 text-xs text-white/50 bg-white/10 rounded border border-white/20">
                    ⌘K
                  </kbd>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className="relative p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group">
                  <Bell className="w-5 h-5" />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                </button>
                
                <button className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                  <Activity className="w-5 h-5" />
                </button>
                
                <button className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area with glassmorphism */}
        <main className="p-8 relative z-30">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl min-h-[calc(100vh-200px)] p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;