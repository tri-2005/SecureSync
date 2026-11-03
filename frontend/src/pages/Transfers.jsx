import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  RefreshCw,
  FolderSync,
  ArrowRight,
  CheckCircle,
  Clock,
  Send
} from 'lucide-react';
import { fetchTransfers } from '../services/apiClient';

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransfers();
    const interval = setInterval(loadTransfers, 3500);
    return () => clearInterval(interval);
  }, []);

  const loadTransfers = async () => {
    const data = await fetchTransfers();
    if (data) {
      setTransfers(data);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Page Title Banner */}
      <div className="page-title-banner">
        <h1 className="page-main-heading">
          File <span className="highlight-cyan">Transfers</span>
        </h1>
        <p className="page-subtitle">
          Real-time TCP socket transfer queue between Windows and Kali Linux
        </p>
      </div>

      {/* Top Status Card */}
      <div className="cyber-card" style={{ padding: '1.25rem 1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--purple)'
            }}>
              <ArrowLeftRight size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>
                Bidirectional Socket Transfer Stream
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Port 5000 (Kali Server) ↔ Port 5001 (Windows Receiver)
              </div>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={loadTransfers}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Queue
          </button>
        </div>
      </div>

      {/* Transfers Table Card */}
      <div className="cyber-card">
        <div className="cyber-card-header">
          <div className="cyber-card-title">
            <FolderSync size={18} style={{ color: 'var(--cyan)' }} />
            <span>Logged Transfers ({transfers.length})</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Real Socket Transfer Records
          </span>
        </div>

        <div className="table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Direction</th>
                <th>Source Node</th>
                <th>Destination Node</th>
                <th>Progress / Stream</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
                    No file transfers logged yet. Send or synchronize files to see real transfer records!
                  </td>
                </tr>
              ) : (
                transfers.map((item) => (
                  <tr key={item.id || item.time}>
                    <td className="mono" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {item.file}
                    </td>
                    <td>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.35rem',
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        color: item.direction?.includes('Windows →') ? 'var(--cyan)' : 'var(--kali-red)'
                      }}>
                        {item.direction || 'Windows → Kali'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.source}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.destination}
                    </td>
                    <td style={{ width: '220px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                          <span style={{ color: 'var(--cyan)' }}>{item.progress || 100}%</span>
                          <span style={{ color: 'var(--text-muted)' }}>{item.speed || 'TCP Stream'}</span>
                        </div>
                        <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${item.progress || 100}%`,
                            background: 'linear-gradient(90deg, #00d2ff, #22c55e)',
                            borderRadius: '3px'
                          }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-online">
                        <CheckCircle size={11} /> {item.status || 'Completed'}
                      </span>
                    </td>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>
                      {item.time}
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
