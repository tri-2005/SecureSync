import React from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  ArrowLeftRight, 
  ScrollText, 
  Activity, 
  Settings,
  Shield,
  Layers
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'files', label: 'Files', icon: FolderOpen },
    { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
    { id: 'activity', label: 'Activity Logs', icon: ScrollText },
    { id: 'system', label: 'System Status', icon: Activity },
    { id: 'network', label: 'Network Config', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div>
        {/* Top Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-hex-icon">
            <Layers size={22} color="#00d2ff" style={{ filter: 'drop-shadow(0 0 6px #00d2ff)' }} />
          </div>
          <div className="brand-title-wrap">
            <span className="brand-title">SecureSync</span>
            <span className="brand-subtitle">CROSS-PLATFORM FILE SYNC</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Version / System Card */}
      <div className="sidebar-footer">
        <div className="sidebar-version-card">
          <div className="version-shield-icon">
            <Shield size={17} />
          </div>
          <div>
            <div className="version-title">SecureSync v1.0.0</div>
            <div className="version-sub">
              Real-time synchronization between Windows and Kali Linux
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
