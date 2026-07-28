import React from "react";

type Props = {
  size?: number;
  className?: string;
};

export default function Logo({ size = 24, className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38d9e8" />
          <stop offset="50%" stop-color="#6aa8ff" />
          <stop offset="100%" stop-color="#b58cff" />
        </linearGradient>
      </defs>
      
      {/* Outer brand circle */}
      <circle cx="16" cy="16" r="15" fill="#05050d" />
      
      {/* Globe rings */}
      <circle cx="16" cy="16" r="13" fill="none" stroke="url(#logoGrad)" stroke-width="2" />
      <ellipse cx="16" cy="16" rx="13" ry="4.5" fill="none" stroke="rgba(56, 217, 232, 0.45)" stroke-width="1" />
      <ellipse cx="16" cy="16" rx="4.5" ry="13" fill="none" stroke="rgba(56, 217, 232, 0.45)" stroke-width="1" />
      
      {/* Stylized K */}
      <g stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <line x1="11" y1="8" x2="11" y2="24" />
        <path d="M 21 8 L 11 16" />
        <path d="M 13.5 14 L 21 24" />
      </g>
    </svg>
  );
}
