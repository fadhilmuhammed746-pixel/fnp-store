import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showTagline = true, size = 'md' }) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group focus:outline-none ${className}`}>
      {/* Custom Geometric Brand Icon */}
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-900/60 via-surface-card to-slate-900 border border-purple-500/30 p-1.5 transition-transform duration-300 group-hover:scale-105 group-hover:border-purple-400/60 group-hover:shadow-glow-sm"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer faceted geometric hexagon */}
          <path
            d="M20 4L34 12V28L20 36L6 28V12L20 4Z"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            strokeLinejoin="round"
            className="transition-all duration-300 group-hover:stroke-purple-400"
          />
          {/* Inner futuristic geometric FNP portal mark */}
          <path
            d="M13 14H27M13 20H23M13 26H19"
            stroke="#F8FAFC"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Glowing NextGen cyan energy node */}
          <circle cx="28" cy="24" r="2.5" fill="#06B6D4" />
          <defs>
            <linearGradient id="logoGradient" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C084FC" />
              <stop offset="0.5" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight text-white ${textSize}`}>
            FNP
          </span>
          <span className={`font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 ${textSize}`}>
            STORE
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400/80 -mt-0.5">
            NextGen Market
          </span>
        )}
      </div>
    </Link>
  );
};
