// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { HistoryRecord, AnalysisResponse } from '@/types';

import Navbar from '@/components/Navbar';
import FreeMode from '@/components/FreeMode';
import TutorMode from '@/components/TutorMode';
import ReviewMode from '@/components/ReviewMode';
import HistorySidebar from '@/components/HistorySidebar';

type AppMode = 'free' | 'tutor' | 'review';

export default function Home() {
  const [mode, setMode] = useState<AppMode>('free');
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [sidebarSelection, setSidebarSelection] = useState<AnalysisResponse | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_URL}/tutor/next`);      if (res.ok) {
        const data = await res.json();
        setHistory(data || []);
      }
    } catch (err) {
      console.error('Error al recuperar el historial:', err);
    }
  };

  const handleSidebarSelect = (record: HistoryRecord) => {
    setMode('free'); // Forzamos ir al modo libre
    setSidebarSelection(record as unknown as AnalysisResponse);
  };

return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar mode={mode} setMode={setMode} />

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">
        {/* Contenido Principal */}
        <div className="lg:col-span-3">
          {mode === 'free' && <FreeMode onRefreshHistory={fetchHistory} externalResult={sidebarSelection} />}
          {mode === 'tutor' && <TutorMode />}
          {mode === 'review' && <ReviewMode />} {/* <-- Añadir condicional */}
        </div>

        {/* Barra Lateral (Compartida) */}
        <aside className="lg:col-span-1">
          <HistorySidebar history={history} onSelect={handleSidebarSelect} />
        </aside>
      </div>
    </main>
  );
}