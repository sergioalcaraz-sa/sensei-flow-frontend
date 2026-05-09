// src/components/AnalysisResult.tsx
import { AnalysisResponse } from '@/types';

interface AnalysisResultProps {
  result: AnalysisResponse;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Resultado del Análisis</h2>
      <p className="text-2xl mb-6 font-medium">{result.original_text}</p>
      
      <div className="flex flex-wrap gap-3">
        {result.tokens.map((token, idx) => (
          <div key={idx} className="group relative flex flex-col items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors cursor-default">
            <span className="text-xs text-blue-600 mb-1">{token.reading}</span>
            <span className="text-xl font-bold">{token.surface}</span>
            
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-max max-w-[200px] bg-slate-800 text-white text-xs p-2 rounded shadow-lg z-10 text-center">
              <p className="font-bold border-b border-slate-600 pb-1 mb-1">{token.part_of_speech}</p>
              <p>{token.meaning}</p>
            </div>
          </div>
        ))}
      </div>

      {result.grammar_note && (
        <div className="mt-6 p-4 bg-blue-50 text-blue-900 rounded-xl text-sm leading-relaxed">
          <strong>Nota Gramatical:</strong> {result.grammar_note}
        </div>
      )}
    </div>
  );
}