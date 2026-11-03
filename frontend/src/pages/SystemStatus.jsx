import React, { useState, useEffect } from 'react';
import { 
  Info, 
  RefreshCw, 
  Folder, 
  Radio, 
  CheckCircle, 
  Server,
  Activity
} from 'lucide-react';
import WindowsLogo from '../components/WindowsLogo';
import KaliLogo from '../components/KaliLogo';
import { fetchSystemStatus } from '../services/apiClient';

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    const data = await fetchSystemStatus();
    if (data) {
      setStatus(data);
    }
    setLoading(false);
  };

  const win = status?.local_node;
  const kali = status?.remote_node;

  const winOnline = win?.receiver_status === 'Online';
  const kaliOnline = kali?.server_status === 'Online';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Page Title Banner */}
      <div className="page-title-banner">
        <h1 className="page-main-heading">
          System <span className="highlight-cyan">Status</span>
        </h1>
        <p className="page-subtitle">
          Component health and connection state for Windows and Kali Linux nodes
        </p>
      </div>

      {/* Info Banner */}
      <div className="cyber-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Info size={18} style={{ color: 'var(--cyan)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Live socket listener and TCP connectivity monitor. Metrics that cannot be determined reliably display <strong style={{ color: 'var(--text-primary)' }}>"Not available"</strong>.
            </span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadStatus}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Status
          </button>
        </div>
      </div>

      {/* Two Major Node Panels Grid */}
      <div className="grid-2">
        
        {/* WINDOWS SYSTEM CARD */}
        <div className="cyber-card card-cyan" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-dim)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="node-logo-box win" style={{ width: '56px', height: '56px' }}>
                <WindowsLogo size={36} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>Windows System</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Synchronization Node</span>
              </div>
            </div>
            <span className={`badge ${winOnline ? 'badge-online' : 'badge-offline'}`}>
              <span className={`pulse-dot ${winOnline ? '' : 'offline'}`} /> {winOnline ? 'Online' : 'Not available'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* Folder & Network Spec */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dim)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Role:</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{win?.role || 'Windows'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Receiver Port:</span>
                  <span className="mono" style={{ color: 'var(--cyan)' }}>Port {win?.receiver_port || 5001}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sync Folder:</span>
                  <span className="path-pill" style={{ margin: 0, padding: '0.15rem 0.65rem', fontSize: '0.75rem' }}>
                    {win?.sync_folder || 'C:\\SyncFolder'}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.04)'
              }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '600' }}>Windows Receiver Module</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Listening on port {win?.receiver_port || 5001}</div>
                </div>
                <span className={`badge ${winOnline ? 'badge-online' : 'badge-offline'}`}>
                  {win?.receiver_status || 'Not available'}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.04)'
              }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '600' }}>SyncFolder Filesystem</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{win?.sync_folder || 'C:\\SyncFolder'}</div>
                </div>
                <span className={`badge ${win?.folder_exists ? 'badge-online' : 'badge-offline'}`}>
                  {win?.folder_exists ? 'Available' : 'Not available'}
                </span>
              </div>
            </div>

            {/* Hardware Metrics - Clean Not Available */}
            <div className="grid-2" style={{ marginTop: '0.4rem' }}>
              <div style={{ background: 'rgba(6, 14, 30, 0.6)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CPU Usage</div>
                <div className="mono" style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '0.82rem' }}>Not available</div>
              </div>
              <div style={{ background: 'rgba(6, 14, 30, 0.6)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>RAM / Uptime</div>
                <div className="mono" style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '0.82rem' }}>Not available</div>
              </div>
            </div>

          </div>
        </div>

        {/* KALI LINUX SYSTEM CARD */}
        <div className="cyber-card card-kali" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-dim)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="node-logo-box kali" style={{ width: '56px', height: '56px' }}>
                <KaliLogo size={40} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>Kali Linux System</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Remote Synchronization Node</span>
              </div>
            </div>
            <span className={`badge ${kaliOnline ? 'badge-online' : 'badge-offline'}`}>
              <span className={`pulse-dot ${kaliOnline ? '' : 'offline'}`} /> {kaliOnline ? 'Online' : 'Not available'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* Folder & Network Spec */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dim)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Configured Kali IP:</span>
                  <span className="mono" style={{ color: 'var(--kali-red)', fontWeight: '600' }}>{kali?.ip || '192.168.1.10'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Server Port:</span>
                  <span className="mono" style={{ color: 'var(--cyan)' }}>Port {kali?.port || 5000}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sync Folder:</span>
                  <span className="path-pill" style={{ margin: 0, padding: '0.15rem 0.65rem', fontSize: '0.75rem', borderColor: 'rgba(225, 29, 72, 0.3)', color: 'var(--kali-red)', background: 'rgba(225, 29, 72, 0.1)' }}>
                    ~/SyncFolder
                  </span>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.04)'
              }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '600' }}>Kali TCP Server Socket</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Targeting {kali?.ip || '192.168.1.10'}:{kali?.port || 5000}</div>
                </div>
                <span className={`badge ${kaliOnline ? 'badge-online' : 'badge-offline'}`}>
                  {kali?.server_status || 'Not available'}
                </span>
              </div>
            </div>

            {/* Hardware Metrics - Clean Not Available */}
            <div className="grid-2" style={{ marginTop: '0.4rem' }}>
              <div style={{ background: 'rgba(6, 14, 30, 0.6)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CPU Usage</div>
                <div className="mono" style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '0.82rem' }}>Not available</div>
              </div>
              <div style={{ background: 'rgba(6, 14, 30, 0.6)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>RAM / Uptime</div>
                <div className="mono" style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '0.82rem' }}>Not available</div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
