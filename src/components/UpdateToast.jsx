import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.error('SW Registration Error:', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-slate-900 text-white rounded-lg shadow-xl flex items-center justify-between gap-4 max-w-sm">
      <span className="text-sm font-medium">New version available!</span>
      <div className="flex gap-2">
        <button
          onClick={() => updateServiceWorker(true)}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-semibold transition"
        >
          Refresh
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="px-2 py-1.5 text-slate-400 hover:text-white text-xs transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}