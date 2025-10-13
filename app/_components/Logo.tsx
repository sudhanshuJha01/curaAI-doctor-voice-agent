import React from 'react';

const Logo = ({ width = 40, height = 40 }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#2196F3', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M100,0 C20,0 0,20 0,70 L0,150 C0,180 20,200 100,200 C180,200 200,180 200,150 L200,70 C200,20 180,0 100,0 Z"
        fill="url(#shieldGradient)"
      />
      <rect x="75" y="50" width="50" height="100" fill="white" />
      <rect x="50" y="75" width="100" height="50" fill="white" />
    </svg>
  );
};

export default Logo;