// src/components/HeroInput.tsx
import { useState } from 'react';

interface HeroInputProps {
  onAnalyze: (text: string) => void;
  loading: boolean;
  error?: string;
}

export default function HeroInput({ onAnalyze, loading, error }: HeroInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
      setText(''); // Limpiamos el input tras enviar
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Introduce texto en japonés (ej. 私はプログラミングが大好きです。)"
        className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 resize-none outline-none text-lg"
        rows={3}
        disabled={loading}
      />
      <div className="mt-4 flex justify-between items-center">
        <span className="text-red-500 text-sm">{error}</span>
        <button 
          type="submit" 
          disabled={loading || !text.trim()}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Analizando...' : 'Analizar Texto'}
        </button>
      </div>
    </form>
  );
}