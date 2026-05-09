import { LessonContent } from '@/types';

interface LessonViewerProps {
  lesson: LessonContent;
  onFinish?: () => void;
}

export default function LessonViewer({ lesson, onFinish }: LessonViewerProps) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">{lesson.topic_title}</h2>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
          {lesson.jlpt_level}
        </span>
      </div>

      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-700 leading-relaxed mb-8">
          {lesson.explanation}
        </p>

        <h3 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">Ejemplos Prácticos</h3>
        <div className="space-y-4 mb-8">
          {lesson.examples.map((ex, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-blue-600 font-medium mb-1">{ex.reading}</p>
              <p className="text-2xl font-bold mb-2">{ex.japanese}</p>
              <p className="text-slate-600">{ex.spanish}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">Puntos Clave</h3>
        <ul className="list-disc list-inside space-y-2 mb-8 text-slate-700">
          {lesson.key_points.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

      {/* RENDERIZADO CONDICIONAL DEL BOTÓN */}
      {onFinish && (
        <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
          <button 
            onClick={onFinish}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center space-x-2"
          >
            <span>Ir al Examen Práctico</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}