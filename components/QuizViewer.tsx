// src/components/QuizViewer.tsx
import { useState } from 'react';
import { TopicQuiz } from '@/types';

interface QuizViewerProps {
  quizData: TopicQuiz;
  onComplete: (success: boolean) => void;
}

export default function QuizViewer({ quizData, onComplete }: QuizViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Umbral para aprobar
  const PASS_THRESHOLD = 4;
  const questions = quizData.questions;
  const currentQ = questions[currentIndex];

  const handleSubmit = () => {
    if (!selectedId) return;
    setIsSubmitted(true);
    if (selectedId === currentQ.correct_option_id) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedId(null);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleFinish = () => {
    onComplete(score >= PASS_THRESHOLD);
  };

  // VISTA: Pantalla Final de Resultados
  if (showResults) {
    const passed = score >= PASS_THRESHOLD;
    return (
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center animate-in zoom-in-95 duration-500">
        <span className="text-6xl mb-6 block">{passed ? '🏆' : '📚'}</span>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          {passed ? '¡Examen Superado!' : 'Necesitas repasar más'}
        </h2>
        <p className="text-slate-500 mb-8 text-lg">
          Acertaste <strong className="text-slate-800">{score}</strong> de {questions.length} preguntas.
          (Mínimo requerido: {PASS_THRESHOLD})
        </p>
        
        <button 
          onClick={handleFinish}
          className={`px-8 py-4 text-white font-bold rounded-xl transition-colors w-full ${
            passed ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {passed ? 'Guardar progreso y continuar' : 'Registrar fallo y seguir'}
        </button>
      </div>
    );
  }

  // VISTA: Carrusel de Preguntas
  const isCorrect = selectedId === currentQ.correct_option_id;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Pregunta {currentIndex + 1} de {questions.length}
        </span>
        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Aciertos: {score}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-8">{currentQ.question_text}</h2>

      <div className="space-y-3 mb-8">
        {currentQ.options.map((opt) => {
          let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-lg ";
          
          if (!isSubmitted) {
            btnClass += selectedId === opt.id 
              ? "border-blue-500 bg-blue-50 text-blue-700" 
              : "border-slate-100 hover:border-blue-200 bg-white text-slate-700";
          } else {
            if (opt.id === currentQ.correct_option_id) {
              btnClass += "border-green-500 bg-green-50 text-green-700";
            } else if (opt.id === selectedId) {
              btnClass += "border-red-500 bg-red-50 text-red-700";
            } else {
              btnClass += "border-slate-100 bg-slate-50 text-slate-400 opacity-50";
            }
          }

          return (
            <button
              key={opt.id}
              disabled={isSubmitted}
              onClick={() => setSelectedId(opt.id)}
              className={btnClass}
            >
              <span className="font-bold mr-4">{opt.id}.</span> {opt.text}
            </button>
          );
        })}
      </div>

      {isSubmitted ? (
        <div className="animate-in slide-in-from-bottom-2 duration-300">
          <div className={`p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
            <p className="font-bold mb-1">{isCorrect ? '¡Correcto! 🎉' : 'Incorrecto'}</p>
            <p className="text-sm leading-relaxed">{currentQ.explanation}</p>
          </div>
          <button 
            onClick={handleNext}
            className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
          >
            {currentIndex + 1 === questions.length ? 'Ver Resultados Finales' : 'Siguiente Pregunta'}
          </button>
        </div>
      ) : (
        <button 
          onClick={handleSubmit}
          disabled={!selectedId}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Comprobar
        </button>
      )}
    </div>
  );
}