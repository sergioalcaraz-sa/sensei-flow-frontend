// src/components/TutorMode.tsx
import { useState, useEffect } from 'react';
import { TutorDecision, LessonContent, QuizQuestion } from '@/types';
import LessonViewer from './LessonViewer';
import QuizViewer from './QuizViewer';

type TutorStep = 'loading' | 'lesson' | 'quiz_loading' | 'quiz' | 'mastered';

export default function TutorMode() {
  const [step, setStep] = useState<TutorStep>('loading');
  const [error, setError] = useState('');
  
  const [decision, setDecision] = useState<TutorDecision | null>(null);
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);

  const fetchNextTopic = async () => {
    setStep('loading');
    setError('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      const res = await fetch(`${API_URL}/tutor/next`);
      const data: TutorDecision = await res.json();
      setDecision(data);

      if (data.mode === 'mastered') {
        setStep('mastered');
      } else if (data.topic) {
        const lessonRes = await fetch(`${API_URL}/tutor/lesson/${data.topic.id}`);
        setLesson(await lessonRes.json());
        setStep('lesson');
      }
    } catch (err) {
      setError('Error al conectar con el Tutor.');
      setStep('lesson'); // Fallback visual
    }
  };

  useEffect(() => { fetchNextTopic(); }, []);

  // Transición de Lección a Examen
  const handleGoToQuiz = async () => {
    if (!decision?.topic) return;
    setStep('quiz_loading');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/tutor/quiz/${decision.topic.id}`);
      setQuiz(await res.json());
      setStep('quiz');
    } catch (err) {
      setError('Error al generar el examen.');
      setStep('lesson');
    }
  };

  // Fin del ciclo: Se evalúa y se pide el siguiente tema
  const handleQuizComplete = async (success: boolean) => {
    if (!decision?.topic) return;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${API_URL}/tutor/quiz/submit?topic_id=${decision.topic.id}&success=${success}`, { 
        method: 'POST' 
      });
      fetchNextTopic(); // Reinicia el ciclo
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Sesión de Tutoría</h2>
        <p className="text-slate-500">Contenido adaptado a tu progreso actual.</p>
      </header>

      {error && <p className="text-red-500 bg-red-50 p-4 rounded-xl">{error}</p>}

      {(step === 'loading' || step === 'quiz_loading') && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 animate-pulse">
            {step === 'loading' ? 'Sensei está preparando tu clase...' : 'Sensei está redactando tu examen...'}
          </p>
        </div>
      )}

      {step === 'mastered' && (
        <div className="text-center py-20 bg-green-50 rounded-3xl border border-green-200">
          <h2 className="text-2xl font-bold text-green-800">Objetivo Alcanzado</h2>
          <p className="text-green-700 mt-2">{decision?.message}</p>
        </div>
      )}

      {step === 'lesson' && lesson && (
        <>
          <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            {decision?.mode === 'review' ? 'Repaso Sugerido' : 'Nuevo Concepto'}
          </div>
          <LessonViewer lesson={lesson} onFinish={handleGoToQuiz} />
        </>
      )}

      {step === 'quiz' && quiz && (
        <QuizViewer quizData={quiz} onComplete={handleQuizComplete} />
      )}
    </div>
  );
}