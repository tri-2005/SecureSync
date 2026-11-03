import React, { useState, useEffect } from 'react';
import { 
  ScrollText, 
  Clock, 
  RefreshCw, 
  Terminal, 
  Monitor,
  CheckCircle2
} from 'lucide-react';
import { fetchLogs } from '../services/apiClient';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 3500);
    return () => clearInterval(interval);
  }, []);

  const loadLogs = async () => {
    const data = await fetchLogs();
    if (data) {
      setLogs(data);
    }
    setLoading(false);
  };

  const filteredLogs = selectedEventType === 'ALL' 
    ? logs 
    : logs.filter(log => log.event === selectedEventType);

  const getBadgeClass = (event) => {
    switch (event) {
      case 'CREATE': return 'badge-create';
      case 'MODIFY': return 'badge-modify';
      case 'DELETE': return 'badge-delete';
      case 'RENAME': return 'badge-rename';
      default: return 'badge-create';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Page Title Banner */}
      <div className="page-title-banner">
        <h1 className="page-main-heading">
          Activity <span className="highlight-cyan">Logs</span>
        </h1>
        <p className="page-subtitle">
          Real-time Watchdog filesystem event audit trail
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="cyber-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Filter Events:
            </span>
            {['ALL', 'CREATE', 'MODIFY', 'DELETE', 'RENAME'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedEventType(type)}
                className={`btn btn-sm ${selectedEventType === type ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {type}
              </button>
            ))}
          </div>

          <button className="btn btn-secondary btn-sm" onClick={loadLogs}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Logs
          </button>

        </div>
      </div>

      {/* Activity Logs Table Card */}
      <div className="cyber-card">
        <div className="cyber-card-header">
          <div className="cyber-card-title">
            <ScrollText size={18} style={{ color: 'var(--cyan)' }} />
            <span>Filesystem Audit Stream ({filteredLogs.length} events)</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Watchdog Event Logger
          </span>
        </div>

        <div className="table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>EVENT</th>
                <th>TARGET FILE / PATH</th>
                <th>SOURCE WATCHER</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
                    No filesystem events logged yet. Perform file operations in C:\SyncFolder to see audit events!
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id || log.timestamp}>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>
                      {log.timestamp}
                    </td>
                    <td>
                      <span className={`badge ${getBadgeClass(log.event)}`}>
                        {log.event}
                      </span>
                    </td>
                    <td className="mono" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {log.file}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {log.source?.includes('Windows') ? (
                          <Monitor size={14} style={{ color: 'var(--cyan)' }} />
                        ) : (
                          <Terminal size={14} style={{ color: 'var(--kali-red)' }} />
                        )}
                        <span>{log.source || 'Watchdog'}</span>
                      </div>
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
                        <CheckCircle2 size={13} />
                        {log.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
