// src/components/ReviewMode.tsx
import { useState, useEffect } from 'react';
import { TopicProgress, LessonContent, StudyTopic } from '@/types';
import LessonViewer from './LessonViewer';

export default function ReviewMode() {
  const [progressList, setProgressList] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para cuando el usuario quiere repasar un tema específico
  const [selectedTopic, setSelectedTopic] = useState<StudyTopic | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lesson, setLesson] = useState<LessonContent | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/tutor/progress`);
      const data = await res.json();
      setProgressList(data || []);
    } catch (err) {
      console.error('Error fetching progress', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewTopic = async (topic: StudyTopic) => {
    setSelectedTopic(topic);
    setLessonLoading(true);
    try {
      // Reutilizamos el endpoint de lecciones del backend
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/tutor/lesson/${topic.id}`);
      const data = await res.json();
      setLesson(data);
    } catch (err) {
      console.error('Error al cargar la lección', err);
    } finally {
      setLessonLoading(false);
    }
  };

  // VISTA 2: Viendo una lección específica
  if (selectedTopic) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button 
          onClick={() => { setSelectedTopic(null); setLesson(null); }}
          className="text-blue-600 font-medium hover:underline flex items-center"
        >
          ← Volver a mis temas
        </button>

        {lessonLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500">Recuperando apuntes del Sensei...</p>
          </div>
        ) : lesson && (
          <LessonViewer 
            lesson={lesson} 
          />
        )}
      </div>
    );
  }

  // VISTA 1: Lista de Temas
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Mi Biblioteca de Estudio</h2>
        <p className="text-slate-500">Repasa libremente los temas que ya has desbloqueado.</p>
      </header>

      {loading ? (
        <p className="text-slate-500 text-center py-10">Cargando progreso...</p>
      ) : progressList.length === 0 ? (
        <div className="text-center py-20 bg-slate-100 rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-500 italic">Aún no has empezado ningún tema en el Modo Tutor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progressList.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleReviewTopic(item.study_topics)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase">
                  {item.study_topics.jlpt_level} • {item.study_topics.category}
                </span>
                {/* Barras de Retención (1 a 5) */}
                <div 
                  className="flex space-x-1 items-center" 
                  title={`Nivel de retención: ${item.mastery_level}/5`}
                >
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 w-3 rounded-full transition-colors ${
                        i < item.mastery_level 
                          ? "bg-green-500 shadow-sm" // Nivel alcanzado (Relleno)
                          : "bg-slate-200"           // Nivel pendiente (Vacío)
                      }`}
                    />
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {item.study_topics.title}
              </h3>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                {item.study_topics.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}