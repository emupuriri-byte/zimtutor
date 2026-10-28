import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${iconSizes[size]} bg-black rounded-xl flex items-center justify-center shadow-sm text-white shrink-0 relative overflow-hidden border border-zinc-800`}
      >
        {/* Crisp monochrome diagonal accent */}
        <div className="absolute -top-3 -right-3 w-7 h-7 bg-white rotate-45 opacity-20"></div>

        {/* Graduation cap & open book custom SVG */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round"
        >
          {/* Graduation Cap */}
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
          {/* Book spine */}
          <path d="M12 17v4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-black ${titleSizes[size]}`}>
            ZIM
          </span>
          <span className={`font-black tracking-tight text-white bg-black px-1.5 py-0.5 rounded-md ${titleSizes[size]}`}>
            TUTOR
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-zinc-500 font-medium tracking-tight mt-0.5">
            Your Future Starts With the Right Teacher.
          </span>
        )}
      </div>
    </div>
  );
};
