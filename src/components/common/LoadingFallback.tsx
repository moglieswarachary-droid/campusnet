import React from 'react';
import { Layers } from 'lucide-react';

export const LoadingFallback: React.FC<{ message?: string }> = ({ 
  message = 'Loading CampusNet...' 
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-campus-deep-blue flex items-center justify-center text-white shadow-warm-lg animate-pulse">
          <Layers className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -inset-2 rounded-2xl border-2 border-campus-blue/20 animate-ping pointer-events-none" />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-campus-blue animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-campus-red animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-campus-blue animate-bounce" />
      </div>
      
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-campus-muted-text">
        {message}
      </p>
    </div>
  );
};

export default LoadingFallback;
