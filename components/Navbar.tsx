// src/components/Navbar.tsx
interface NavbarProps {
  mode: 'free' | 'tutor' | 'review'; // Añadimos 'review'
  setMode: (mode: 'free' | 'tutor' | 'review') => void;
}

export default function Navbar({ mode, setMode }: NavbarProps) {
  const btnClass = (targetMode: string) => 
    `px-5 py-2 rounded-lg text-sm font-semibold transition-all ${mode === targetMode ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            Sensei-Flow AI
          </span>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl space-x-1">
          <button onClick={() => setMode('free')} className={btnClass('free')}>
            Traductor Libre
          </button>
          <button onClick={() => setMode('tutor')} className={btnClass('tutor')}>
            Mi Tutor
          </button>
          <button onClick={() => setMode('review')} className={btnClass('review')}>
            Biblioteca
          </button>
        </div>
      </div>
    </nav>
  );
}