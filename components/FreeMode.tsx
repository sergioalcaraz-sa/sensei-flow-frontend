// src/components/FreeMode.tsx
import { useState, useEffect } from 'react';
import { AnalysisResponse } from '@/types';
import HeroInput from './HeroInput';
import AnalysisResult from './AnalysisResult';

interface FreeModeProps {
  onRefreshHistory: () => void;
  externalResult: AnalysisResponse | null; // Para cuando se hace clic en la barra lateral
}

export default function FreeMode({ onRefreshHistory, externalResult }: FreeModeProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  // Sincronizar si el usuario hace clic en el historial
  useEffect(() => {
    if (externalResult) setResult(externalResult);
  }, [externalResult]);

  const handleAnalyze = async (text: string) => {
    setLoading(true);
    setError('');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/analyze?text=${encodeURIComponent(text)}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Error en el servicio de análisis.');
      
      const data = await res.json();
      setResult(data);
      onRefreshHistory(); // Avisa a page.tsx que debe actualizar la barra lateral
    } catch (err) {
      setError('Error al procesar el texto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Analizador Lingüístico</h2>
        <p className="text-slate-500">Desglose morfológico y gramatical en tiempo real.</p>
      </header>

      <HeroInput onAnalyze={handleAnalyze} loading={loading} error={error} />
      {result && <AnalysisResult result={result} />}
    </div>
  );
}