import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Save, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Folder,
  MapPin
} from 'lucide-react';
import WindowsLogo from '../components/WindowsLogo';
import KaliLogo from '../components/KaliLogo';
import { fetchConfig, updateConfig, testConnection } from '../services/apiClient';

export default function NetworkConfig({ showToast }) {
  const [config, setConfig] = useState({
    node_name: 'Windows Workstation',
    role: 'windows',
    local_ip: '192.168.1.8',
    local_port: 5001,
    remote_ip: '192.168.1.10',
    remote_port: 5000,
    sync_folder: 'C:\\SyncFolder',
    api_port: 8000
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadCurrentConfig();
  }, []);

  const loadCurrentConfig = async () => {
    setLoading(true);
    const data = await fetchConfig();
    if (data) {
      setConfig(data);
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setTestResult(null);
    setErrorMsg('');
  };

  const validateConfig = () => {
    if (!config.remote_ip || !config.remote_ip.trim()) {
      setErrorMsg('Remote Kali IP address cannot be empty.');
      return false;
    }
    if (!config.remote_port || isNaN(config.remote_port)) {
      setErrorMsg('Remote server port must be a valid number.');
      return false;
    }
    if (!config.local_port || isNaN(config.local_port)) {
      setErrorMsg('Local receiver port must be a valid number.');
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateConfig()) return;

    setSaving(true);
    const res = await updateConfig(config);
    setSaving(false);

    if (res?.success) {
      showToast('Network Configuration saved successfully to config.json');
      setErrorMsg('');
    } else {
      setErrorMsg(res?.message || 'Failed to save configuration');
    }
  };

  const handleTestConnection = async () => {
    if (!validateConfig()) return;

    setTesting(true);
    setTestResult(null);
    const res = await testConnection(config.remote_ip, config.remote_port);
    setTesting(false);
    setTestResult(res);

    if (res?.success) {
      showToast(`Socket Connection OK: ${config.remote_ip}:${config.remote_port}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Page Title Banner */}
      <div className="page-title-banner">
        <h1 className="page-main-heading">
          Network <span className="highlight-cyan">Config</span>
        </h1>
        <p className="page-subtitle">
          Dynamic IP & TCP socket endpoint configuration for Windows and Kali Linux
        </p>
      </div>

      {/* Info Card */}
      <div className="cyber-card" style={{ padding: '1.2rem 1.6rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Network size={22} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Configure machine-specific IP addresses and TCP socket ports. Changes are persisted to <strong style={{ color: 'var(--cyan)' }}>config.json</strong> and read by the synchronization engine without hardcoding.
          </div>
        </div>
      </div>

      {/* Node Settings Grid */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        
        {/* Local Machine Settings (Windows) */}
        <div className="cyber-card card-cyan" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-dim)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div className="node-logo-box win" style={{ width: '48px', height: '48px' }}>
                <WindowsLogo size={30} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>Local Machine Settings</h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Windows Node</span>
              </div>
            </div>
            <span className="badge badge-win">Local Host</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="form-label">Node Identifier:</label>
              <input 
                type="text" 
                className="form-input"
                value={config.node_name || ''}
                onChange={(e) => handleChange('node_name', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Local Windows IP Address:</label>
              <input 
                type="text" 
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                placeholder="192.168.1.8"
                value={config.local_ip || ''}
                onChange={(e) => handleChange('local_ip', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Windows Receiver Port (Default 5001):</label>
              <input 
                type="number" 
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                value={config.local_port || 5001}
                onChange={(e) => handleChange('local_port', parseInt(e.target.value) || 5001)}
              />
            </div>

            <div>
              <label className="form-label">Local Sync Folder Path:</label>
              <input 
                type="text" 
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                value={config.sync_folder || 'C:\\SyncFolder'}
                onChange={(e) => handleChange('sync_folder', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Remote Machine Settings (Kali Linux) */}
        <div className="cyber-card card-kali" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-dim)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div className="node-logo-box kali" style={{ width: '48px', height: '48px' }}>
                <KaliLogo size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>Remote Machine Settings</h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Kali Linux Node</span>
              </div>
            </div>
            <span className="badge badge-kali">Remote Target</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="form-label">Remote Kali IP Address (Dynamic DHCP):</label>
              <input 
                type="text" 
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)', borderColor: 'var(--border-glow-kali)' }}
                placeholder="192.168.1.10"
                value={config.remote_ip || ''}
                onChange={(e) => handleChange('remote_ip', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Kali Server Port (Default 5000):</label>
              <input 
                type="number" 
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                value={config.remote_port || 5000}
                onChange={(e) => handleChange('remote_port', parseInt(e.target.value) || 5000)}
              />
            </div>

            <div>
              <label className="form-label">Kali Sync Folder:</label>
              <div style={{
                fontFamily: 'var(--font-mono)',
                padding: '0.65rem 1rem',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-dim)',
                color: 'var(--kali-red)',
                fontSize: '0.88rem'
              }}>
                ~/SyncFolder
              </div>
            </div>

            <div style={{ 
              padding: '0.85rem 1rem', 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border-dim)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '0.5rem'
            }}>
              Outbound TCP transfers connect directly to <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{config.remote_ip || '192.168.1.10'}:{config.remote_port || 5000}</span>.
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer Card */}
      <div className="cyber-card" style={{ padding: '1.25rem 1.6rem' }}>
        {errorMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {testResult && (
          <div style={{
            padding: '0.75rem 1rem',
            background: testResult.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${testResult.success ? 'rgba(34, 197, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
            borderRadius: 'var(--radius-md)',
            color: testResult.success ? '#4ade80' : '#fbbf24',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-mono)',
            marginBottom: '1rem'
          }}>
            {testResult.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{testResult.message}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={handleTestConnection}
            disabled={testing}
          >
            {testing ? <RefreshCw size={14} className="spin" /> : <Radio size={14} style={{ color: 'var(--cyan)' }} />}
            {testing ? 'Testing Socket Ping...' : 'Test Socket Connection'}
          </button>

          <button 
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={14} />
            {saving ? 'Saving...' : 'Save Network Config'}
          </button>
        </div>
      </div>

    </div>
  );
}
