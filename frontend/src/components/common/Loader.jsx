import React from 'react';

const Loader = ({ fullScreen = false, text = 'Loading collection...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      {/* Elegant concentric fashion loader */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-stone-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
      </div>
      {text && (
        <p className="text-xs uppercase tracking-widest text-stone-500 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
