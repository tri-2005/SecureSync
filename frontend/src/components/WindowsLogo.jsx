import React from 'react';

export default function WindowsLogo({ size = 48, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 0 12px rgba(0, 210, 255, 0.6))' }}
    >
      <defs>
        <linearGradient id="winGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Top Left Pane */}
      <path
        d="M0 12.5L35.5 7.6V41.5H0V12.5Z"
        fill="url(#winGrad)"
      />
      {/* Top Right Pane */}
      <path
        d="M39.8 7L88 0V41.5H39.8V7Z"
        fill="url(#winGrad)"
      />
      {/* Bottom Left Pane */}
      <path
        d="M0 45.8H35.5V79.8L0 74.8V45.8Z"
        fill="url(#winGrad)"
      />
      {/* Bottom Right Pane */}
      <path
        d="M39.8 45.8H88V88L39.8 80.4V45.8Z"
        fill="url(#winGrad)"
      />
    </svg>
  );
}
