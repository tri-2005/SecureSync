import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

export default function LiveSyncCenter({ isConnected = true }) {
  return (
    <div className="live-sync-center-wrap">
      {/* Animated wave lines connecting left and right */}
      <div className="sync-wave-line-left" />
      <div className="sync-wave-line-right" />

      {/* Center Circular Neon Dial */}
      <div className="live-sync-dial">
        <ArrowLeftRight size={28} className="dial-icon" />
        <span className="dial-text">LIVE SYNC</span>
      </div>

      {/* Status Pill below */}
      <div className="sync-status-pill">
        <span className={`pulse-dot ${isConnected ? '' : 'offline'}`} />
        <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
      </div>
    </div>
  );
}
