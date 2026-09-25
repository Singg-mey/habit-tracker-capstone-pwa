import React, { useState, useEffect } from 'react';
import { UpdateToast } from './components/UpdateToast';
import { OfflineBanner } from './components/OfflineBanner';
import { ShareButton } from './components/ShareButton';

export default function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Read 20 pages', status: 'synced' },
      { id: 2, name: '30 min Exercise', status: 'synced' }
    ];
  });
  const [input, setInput] = useState('');
  const [queue, setQueue] = useState(() => {
    const savedQueue = localStorage.getItem('offlineQueue');
    return savedQueue ? JSON.parse(savedQueue) : [];
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('offlineQueue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    const syncQueue = () => {
      if (queue.length > 0) {
        setHabits((prev) =>
          prev.map((item) =>
            queue.some((q) => q.id === item.id) ? { ...item, status: 'synced' } : item
          )
        );
        setQueue([]);
        localStorage.removeItem('offlineQueue');
      }
    };

    window.addEventListener('online', syncQueue);
    return () => window.removeEventListener('online', syncQueue);
  }, [queue]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const isOnline = navigator.onLine;
    const newHabit = {
      id: Date.now(),
      name: input,
      status: isOnline ? 'synced' : 'queued',
    };

    setHabits((prev) => [...prev, newHabit]);

    if (!isOnline) {
      setQueue((prev) => [...prev, newHabit]);
    }

    setInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col w-full overflow-x-hidden">
      <OfflineBanner />

      <header className="w-full p-4 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between gap-2">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 whitespace-nowrap">
          Habit Tracker PWA
        </h1>
        <ShareButton title="Check out my Habit Tracker PWA" />
      </header>

      <main className="w-full p-4 max-w-4xl mx-auto flex-1">
        <form onSubmit={addHabit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add new habit..."
            className="flex-1 min-w-0 p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shrink-0"
          >
            Add
          </button>
        </form>

        <h2 className="text-lg font-semibold mb-3">Your Habits</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between gap-2"
            >
              <span className="font-medium text-sm text-slate-800 break-words flex-1">
                {habit.name}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                  habit.status === 'synced'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {habit.status === 'synced' ? '✓ Synced' : '⏳ Queued'}
              </span>
            </div>
          ))}
        </div>
      </main>

      <UpdateToast />
    </div>
  );
}