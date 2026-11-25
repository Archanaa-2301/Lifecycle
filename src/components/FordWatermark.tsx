import React from 'react';

export const FordWatermark: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none absolute flex items-center justify-center opacity-[0.06] dark:opacity-[0.08] transition-opacity duration-300 ${className}`}
    >
      <svg
        viewBox="0 0 600 240"
        className="w-[380px] md:w-[540px] max-w-full h-auto text-slate-300 dark:text-cyan-200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="300"
          cy="120"
          rx="280"
          ry="110"
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray="6 0"
        />
        <ellipse
          cx="300"
          cy="120"
          rx="265"
          ry="96"
          stroke="currentColor"
          strokeWidth="3"
        />
        {/* Stylized Ford cursive wordmark script */}
        <path
          d="M175 165 C 160 165, 150 145, 160 115 C 172 75, 205 60, 240 60 C 265 60, 275 75, 265 95 C 255 115, 235 125, 205 125 C 190 125, 182 118, 185 105 C 192 78, 222 75, 238 75 C 242 75, 244 78, 240 85 C 235 95, 218 100, 200 100 C 182 100, 172 112, 168 128 C 162 148, 170 152, 185 145 C 195 140, 212 125, 225 110 L 235 120 C 218 140, 198 165, 175 165 Z"
          fill="currentColor"
        />
        <path
          d="M255 135 C 250 145, 245 158, 252 160 C 258 162, 268 155, 275 142 C 285 122, 292 102, 285 100 C 278 98, 265 115, 255 135 Z"
          fill="currentColor"
        />
        <path
          d="M280 135 C 275 148, 272 158, 282 160 C 298 162, 318 135, 332 110 C 342 92, 338 88, 328 90 C 318 92, 302 110, 292 130 L 305 132 C 315 118, 325 108, 330 108 C 332 108, 330 115, 322 125 C 310 142, 298 152, 290 150 C 285 148, 288 138, 292 128 L 280 135 Z"
          fill="currentColor"
        />
        <path
          d="M338 155 C 345 158, 355 155, 362 148 C 375 135, 388 112, 395 85 C 400 68, 395 62, 385 65 C 375 68, 362 85, 355 105 C 348 125, 350 140, 358 142 C 362 144, 370 138, 378 128 L 385 135 C 375 148, 362 158, 350 158 C 338 158, 332 148, 338 132 L 350 95 C 358 72, 370 58, 385 55 C 400 52, 412 62, 405 85 C 398 110, 385 135, 372 152 L 390 150 L 388 158 L 338 158 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
