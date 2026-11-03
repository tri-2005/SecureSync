import React, { useState, useEffect } from 'react';
import { Calendar, Radio } from 'lucide-react';
import { fetchSystemStatus } from '../services/apiClient';

export default function Header() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format: "Tue, 30 Sep 2026"
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      // Format: "12:36:14 AM"
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setCurrentDate(dateStr);
      setCurrentTime(timeStr);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      const data = await fetchSystemStatus();
      if (data) setStatus(data);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const isRunning = Boolean(status);

  return (
    <header className="top-header">
      {/* Slogan on Left */}
      <div className="header-slogan">
        SECURE <span>•</span> SYNCHRONIZE <span>•</span> ACROSS PLATFORMS
      </div>

      {/* Date, Time & Engine Pill on Right */}
      <div className="header-right-group">
        <div className="header-datetime-box">
          <Calendar size={15} style={{ color: 'var(--cyan)' }} />
          <span className="header-date-text">{currentDate}</span>
          <span className="header-time-text">{currentTime}</span>
        </div>

        <div className="header-engine-pill">
          <span className={`pulse-dot ${isRunning ? '' : 'offline'}`} />
          <div className="engine-pill-text">
            <span className="engine-pill-title">Sync Engine</span>
            <span className={`engine-pill-state ${isRunning ? '' : 'offline'}`}>
              {isRunning ? 'Running' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
