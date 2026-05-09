// src/components/HistorySidebar.tsx
import { HistoryRecord } from '@/types';

interface HistorySidebarProps {
  history: HistoryRecord[];
  onSelect: (record: HistoryRecord) => void;
}

export default function HistorySidebar({ history, onSelect }: HistorySidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-6">
        <h3 className="text-lg font-semibold mb-4">Historial Reciente</h3>
        {history.length === 0 ? (
          <p className="text-sm text-slate-400">No hay análisis previos.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((record) => (
              <li 
                key={record.id} 
                onClick={() => onSelect(record)}
                className="p-3 bg-slate-50 rounded-lg text-sm border border-slate-100 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <p className="font-medium truncate">{record.original_text}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(record.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}