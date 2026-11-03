import React from 'react';

export default function KaliLogo({ size = 52, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 0 14px rgba(225, 29, 72, 0.65))' }}
    >
      <defs>
        <linearGradient id="kaliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
      </defs>
      {/* Kali Dragon Emblem Silhouette */}
      <path
        d="M82.4 22.8C75.2 20.1 63.8 21.2 55.4 27.2C46.8 33.3 42.1 42.9 38.6 51.5C36.2 57.5 33.4 63.4 29.1 68.2C25.4 72.3 20.6 75.4 15.2 77C18.6 76.8 22.1 76.1 25.3 74.8C31.5 72.3 36.3 67.5 39.8 62.1C43.5 56.4 46.5 50.1 50.8 44.8C55.6 38.8 62.2 33.9 69.8 31.7C74.8 30.2 80.2 30.4 85 32.2C81.2 27.8 86.8 25.2 82.4 22.8Z"
        fill="url(#kaliGrad)"
      />
      <path
        d="M68.5 14.5C59.3 14.2 49.8 17.5 42.6 23.3C35.2 29.3 30.5 38.1 27.2 46.8C24.8 53.2 22.8 59.9 19.3 65.8C16.8 70 13.2 73.6 8.8 76C12.5 75.3 16.2 74 19.4 71.8C25.6 67.6 29.8 61.3 33.2 55C36.8 48.3 40.5 41.3 45.8 35.8C51.6 29.7 59.4 25.1 67.6 23.4C73.4 22.2 79.6 22.7 85.2 24.8C80.8 19.8 74.8 14.7 68.5 14.5Z"
        fill="url(#kaliGrad)"
        opacity="0.9"
      />
      <path
        d="M52.1 8.2C44.6 9.4 36.9 13.5 31.5 18.9C25.8 24.6 22.4 32.4 19.8 39.9C17.7 45.9 15.8 52.2 12.8 57.8C10.7 61.7 7.7 65.1 4 67.6C7.5 66.8 10.9 65.3 13.8 63.1C19.2 59 22.8 53.1 25.6 47.1C28.6 40.8 31.9 34.2 36.6 29.2C41.8 23.6 48.9 19.5 56.4 18.2C61.8 17.3 67.5 17.8 72.8 19.8C68.6 15 60.6 8.5 52.1 8.2Z"
        fill="url(#kaliGrad)"
        opacity="0.75"
      />
      {/* Dragon Tail & Flame accents */}
      <path
        d="M28 72C34 78 44 82 52 82C62 82 72 77 78 70C74 72 68 73 63 72C54 70 47 64 42 57C38 63 33 68 28 72Z"
        fill="url(#kaliGrad)"
        opacity="0.85"
      />
    </svg>
  );
}
