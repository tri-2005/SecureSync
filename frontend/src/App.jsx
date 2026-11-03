import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import Transfers from './pages/Transfers';
import ActivityLogs from './pages/ActivityLogs';
import SystemStatus from './pages/SystemStatus';
import NetworkConfig from './pages/NetworkConfig';

import { Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState([]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'files':
        return <Files showToast={showToast} />;
      case 'transfers':
        return <Transfers showToast={showToast} />;
      case 'activity':
        return <ActivityLogs showToast={showToast} />;
      case 'system':
        return <SystemStatus />;
      case 'network':
        return <NetworkConfig showToast={showToast} />;
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-wrapper">
        <Header activeTab={activeTab} />
        <main className="content-area">
          {renderContent()}
        </main>
      </div>

      {/* Toast Notification Container */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className="toast">
              <Bell size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.85rem' }}>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
