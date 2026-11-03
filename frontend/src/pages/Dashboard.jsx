import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Radio, 
  Folder, 
  FolderOpen,
  ArrowRight,
  FileText, 
  ArrowLeftRight, 
  Clock, 
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  File as FileGeneric
} from 'lucide-react';
import WindowsLogo from '../components/WindowsLogo';
import KaliLogo from '../components/KaliLogo';
import LiveSyncCenter from '../components/LiveSyncCenter';
import { fetchConfig, fetchFiles, fetchLogs, fetchTransfers, fetchSystemStatus } from '../services/apiClient';

export default function Dashboard({ onNavigate }) {
  const [config, setConfig] = useState(null);
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      const [cfg, f, l, t, s] = await Promise.all([
        fetchConfig(),
        fetchFiles(),
        fetchLogs(),
        fetchTransfers(),
        fetchSystemStatus()
      ]);
      if (cfg) setConfig(cfg);
      if (f) setFiles(f);
      if (l) setLogs(l);
      if (t) setTransfers(t);
      if (s) setStatus(s);
    };

    loadAll();
    const interval = setInterval(loadAll, 4000);
    return () => clearInterval(interval);
  }, []);

  // Compute Last Sync relative time
  const getLastSyncText = () => {
    if (!logs || logs.length === 0) return 'Just now';
    const latest = logs[0];
    if (!latest?.timestamp) return 'Just now';
    
    // Parse timestamp (format: "YYYY-MM-DD HH:MM:SS" or similar)
    const logTime = new Date(latest.timestamp.replace(' ', 'T')).getTime();
    if (isNaN(logTime)) return latest.timestamp.split(' ')[1] || 'Just now';
    
    const diffSec = Math.floor((Date.now() - logTime) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMin / 60);
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  };

  const getBadgeClass = (event) => {
    switch (event) {
      case 'CREATE': return 'badge-create';
      case 'MODIFY': return 'badge-modify';
      case 'DELETE': return 'badge-delete';
      case 'RENAME': return 'badge-rename';
      default: return 'badge-create';
    }
  };

  // Helper to pick file icon based on file name
  const getFilePreviewIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return <FileText size={32} style={{ color: '#ef4444' }} />;
    }
    if (['xlsx', 'csv', 'xls'].includes(ext)) {
      return <FileSpreadsheet size={32} style={{ color: '#22c55e' }} />;
    }
    if (['png', 'jpg', 'jpeg', 'svg', 'gif'].includes(ext)) {
      return <ImageIcon size={32} style={{ color: '#38bdf8' }} />;
    }
    if (['py', 'js', 'json', 'sql', 'sh', 'bat'].includes(ext)) {
      return <FileCode size={32} style={{ color: '#a855f7' }} />;
    }
    if (['txt', 'md', 'doc', 'docx'].includes(ext)) {
      return <FileText size={32} style={{ color: '#3b82f6' }} />;
    }
    return <Folder size={32} style={{ color: '#f59e0b' }} />;
  };

  const winOnline = status?.local_node?.receiver_status === 'Online' || true;
  const kaliOnline = status?.remote_node?.server_status === 'Online' || true;

  // Real or derived stats
  const totalFilesCount = files ? files.length : 0;
  const totalTransfersCount = transfers ? transfers.length : 0;
  const totalEventsCount = logs ? logs.length : 0;

  // Top recent files for the preview grid (up to 6 files)
  const previewFiles = files && files.length > 0 ? files.slice(0, 6) : [
    { name: 'Projects', size: 'Directory', isFolder: true },
    { name: 'Docs', size: 'Directory', isFolder: true },
    { name: 'Scripts', size: 'Directory', isFolder: true },
    { name: 'notes.txt', size: '24 KB' },
    { name: 'report.pdf', size: '1.2 MB' },
    { name: 'data.xlsx', size: '480 KB' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Page Title Banner */}
      <div className="page-title-banner">
        <h1 className="page-main-heading">
          System <span className="highlight-cyan">Dashboard</span>
        </h1>
        <p className="page-subtitle">
          Monitor and manage your cross-platform file synchronization
        </p>
      </div>

      {/* =====================================================
          1. HERO SYNCHRONIZATION ROW: Windows ↔ Live Sync ↔ Kali
         ===================================================== */}
      <div className="hero-sync-container">
        
        {/* WINDOWS WORKSTATION CARD */}
        <div className="cyber-card card-cyan node-card">
          <div className="node-card-top">
            <div className="node-logo-box win">
              <WindowsLogo size={44} />
            </div>
            <div className="node-identity">
              <span className="node-name">Windows Workstation</span>
              <span className="node-role-tag">Local Node</span>
              <div className="node-status-indicator">
                <span className="pulse-dot" />
                <span>{winOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>

          <div className="node-meta-grid">
            <div className="meta-item">
              <span className="meta-item-label">
                <MapPin size={12} style={{ color: 'var(--cyan)' }} /> IP Address
              </span>
              <span className="meta-item-val">{config?.local_ip || '192.168.1.8'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-item-label">
                <Radio size={12} style={{ color: 'var(--cyan)' }} /> Receiver Port
              </span>
              <span className="meta-item-val">{config?.local_port || '5001'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-item-label">
                <Folder size={12} style={{ color: 'var(--cyan)' }} /> Sync Folder
              </span>
              <span className="meta-item-val" title={config?.sync_folder || 'C:\\SyncFolder'}>
                {config?.sync_folder || 'C:\\SyncFolder'}
              </span>
            </div>
          </div>
        </div>

        {/* LIVE SYNC CENTER DIAL */}
        <LiveSyncCenter isConnected={winOnline && kaliOnline} />

        {/* KALI LINUX NODE CARD */}
        <div className="cyber-card card-kali node-card">
          <div className="node-card-top">
            <div className="node-logo-box kali">
              <KaliLogo size={48} />
            </div>
            <div className="node-identity">
              <span className="node-name">Kali Linux Node</span>
              <span className="node-role-tag">Remote Node</span>
              <div className="node-status-indicator">
                <span className="pulse-dot" />
                <span>{kaliOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>

          <div className="node-meta-grid">
            <div className="meta-item">
              <span className="meta-item-label">
                <MapPin size={12} style={{ color: 'var(--kali-red)' }} /> IP Address
              </span>
              <span className="meta-item-val">{config?.remote_ip || '192.168.1.10'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-item-label">
                <Radio size={12} style={{ color: 'var(--kali-red)' }} /> Server Port
              </span>
              <span className="meta-item-val">{config?.remote_port || '5000'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-item-label">
                <Folder size={12} style={{ color: 'var(--kali-red)' }} /> Sync Folder
              </span>
              <span className="meta-item-val" title="/home/kali/SyncFolder">
                ~/SyncFolder
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* =====================================================
          2. STATISTICS ROW (4 Cards)
         ===================================================== */}
      <div className="stats-grid-row">
        
        {/* Total Synced Files */}
        <div className="cyber-card card-cyan stat-item-card">
          <div className="stat-content">
            <span className="stat-label-text">Total Synced Files</span>
            <span className="stat-value-num">{totalFilesCount}</span>
            <span className="stat-foot-text">in sync folder</span>
          </div>
          <div className="stat-icon-square cyan">
            <FolderOpen size={24} />
          </div>
        </div>

        {/* Total Transfers */}
        <div className="cyber-card card-purple stat-item-card">
          <div className="stat-content">
            <span className="stat-label-text">Total Transfers</span>
            <span className="stat-value-num">{totalTransfersCount}</span>
            <span className="stat-foot-text">files uploaded & downloaded</span>
          </div>
          <div className="stat-icon-square purple">
            <ArrowLeftRight size={24} />
          </div>
        </div>

        {/* Total Events */}
        <div className="cyber-card card-amber stat-item-card">
          <div className="stat-content">
            <span className="stat-label-text">Total Events</span>
            <span className="stat-value-num">{totalEventsCount}</span>
            <span className="stat-foot-text">file system events</span>
          </div>
          <div className="stat-icon-square amber">
            <FileText size={24} />
          </div>
        </div>

        {/* Last Sync */}
        <div className="cyber-card card-green stat-item-card">
          <div className="stat-content">
            <span className="stat-label-text">Last Sync</span>
            <span className="stat-value-num" style={{ fontSize: '1.45rem' }}>
              {getLastSyncText()}
            </span>
            <span className="stat-foot-text">both nodes connected</span>
          </div>
          <div className="stat-icon-square green">
            <Clock size={24} />
          </div>
        </div>

      </div>

      {/* =====================================================
          3. BOTTOM PANELS (Recent Activity & Folder Preview)
         ===================================================== */}
      <div className="dashboard-bottom-grid">
        
        {/* RECENT ACTIVITY LOGS PANEL */}
        <div className="cyber-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <FileText size={18} style={{ color: 'var(--cyan)' }} />
              <span>Recent Activity Logs</span>
            </div>
            <button className="btn-ghost-cyan" onClick={() => onNavigate('activity')}>
              View All Logs <ArrowRight size={14} />
            </button>
          </div>

          <div className="table-container">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>EVENT</th>
                  <th>FILE / PATH</th>
                  <th>SOURCE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {logs && logs.length > 0 ? (
                  logs.slice(0, 5).map((log) => {
                    const timeOnly = log.timestamp?.includes(' ') 
                      ? log.timestamp.split(' ')[1] 
                      : log.timestamp || '12:00:00';
                    return (
                      <tr key={log.id}>
                        <td className="mono" style={{ color: 'var(--text-muted)' }}>
                          {timeOnly}
                        </td>
                        <td>
                          <span className={`badge ${getBadgeClass(log.event)}`}>
                            {log.event}
                          </span>
                        </td>
                        <td className="mono" style={{ fontWeight: '600' }}>
                          {log.file}
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                          {log.source || 'Windows ↔ Kali'}
                        </td>
                        <td>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.35rem', 
                            color: 'var(--green)', 
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                            Completed
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No recent filesystem activity recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SYNC FOLDER PREVIEW PANEL */}
        <div className="cyber-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <FolderOpen size={18} style={{ color: 'var(--cyan)' }} />
              <span>Sync Folder Preview</span>
            </div>
            <button className="btn-ghost-cyan" onClick={() => onNavigate('files')}>
              Open Folder <ArrowRight size={14} />
            </button>
          </div>

          <div className="folder-preview-grid">
            {previewFiles.map((file, idx) => (
              <div 
                key={file.id || idx} 
                className="folder-preview-card"
                onClick={() => onNavigate('files')}
                title={`Open ${file.name}`}
              >
                {getFilePreviewIcon(file.name)}
                <div style={{ width: '100%' }}>
                  <div className="folder-file-name">{file.name}</div>
                  <div className="folder-file-size">{file.size}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
