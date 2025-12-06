
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Difficulty, PlayerRecord, WordChallenge } from './types';
import { fetchWordBatch } from './services/geminiService';
import { Atmosphere } from './components/Atmosphere';
import { unitsData } from './data/units';
import { firstTermData } from './data/firstTerm';
import { playCorrectSound, playIncorrectSound, playTickSound, playClickSound, initMusic } from './services/soundService';
import { ContactFab } from './components/ContactFab';
import { MusicToggle } from './components/MusicToggle';

// --- Sub-Components --- //

// 1. Intro Sequence
const IntroSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [opacity, setOpacity] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const lines = [
    "...",
    "Awake?",
    "Good. We have work to do.",
    "Before we begin...",
    "What difficulty will you play on?"
  ];

  useEffect(() => {
    // Attempt to start music immediately
    initMusic();

    // Fade in from black
    const t1 = setTimeout(() => setOpacity(1), 1000);
    
    // Progress text
    const t2 = setInterval(() => {
      setTextIndex(prev => {
        if (prev < lines.length - 1) return prev + 1;
        clearInterval(t2);
        return prev;
      });
    }, 2500);

    // Finish intro
    const t3 = setTimeout(onComplete, (lines.length * 2500) + 1000);

    return () => {
      clearTimeout(t1);
      clearInterval(t2);
      clearTimeout(t3);
    };
  }, [onComplete, lines.length]);

  return (
    <div className="flex items-center justify-center h-screen text-center transition-opacity duration-[2000ms]" style={{ opacity }}>
      <div className="space-y-6">
        <div className="text-4xl md:text-6xl text-gray-200 font-bold tracking-widest animate-pulse">
          {lines[textIndex]}
        </div>
        <div className="text-sm text-gray-600 uppercase tracking-[0.5em]">
          System: Interrogation Protocol
        </div>
      </div>
    </div>
  );
};

// 2. Difficulty Menu
const DifficultyMenu: React.FC<{ 
  onSelect: (d: Difficulty) => void;
  onSelectCustom: (words: WordChallenge[]) => void;
}> = ({ onSelect, onSelectCustom }) => {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCustomSelection = (key: string) => {
    setShowModal(false);
    let words: WordChallenge[] = [];
    if (key === 'first_term') {
      words = firstTermData;
    } else if (unitsData[key]) {
      words = unitsData[key];
    }
    
    if (words.length > 0) {
      // Shuffle the custom words for randomness
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      onSelectCustom(shuffled);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto">
        <div className="flex flex-col items-center justify-center w-full min-h-screen py-10">
          <div className="border-2 border-green-500/30 bg-green-900/10 p-8 rounded-lg backdrop-blur-sm shadow-[0_0_50px_rgba(0,255,0,0.1)] max-w-lg w-full">
            <h2 className="text-green-400 text-2xl mb-6 border-b border-green-500/30 pb-2 font-mono tracking-tighter">
              SELECT_INTENSITY_LEVEL
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {(Object.values(Difficulty) as Difficulty[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onSelect(lvl)}
                  className="group relative flex items-center justify-between p-4 border border-green-500/20 hover:bg-green-500/20 hover:border-green-400 transition-all text-left"
                >
                  <span className="text-xl font-bold text-green-100 group-hover:text-white">{lvl}</span>
                  <span className="text-xs text-green-400/60 group-hover:text-green-300 uppercase tracking-widest">
                     {lvl === 'A1' ? 'Basic Intelligence' : lvl === 'C2' ? 'Classified Data' : 'Standard Protocol'}
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-green-400/5 mix-blend-overlay pointer-events-none" />
                </button>
              ))}

              {/* Expand Arrow */}
              <button 
                onClick={() => setExpanded(!expanded)}
                className="flex flex-col items-center justify-center py-4 mt-2 text-green-400 hover:text-green-300 transition-colors opacity-80 hover:opacity-100"
              >
                <span className="text-xs uppercase tracking-widest mb-1">Access Special Archives</span>
                <svg 
                  className={`w-6 h-6 transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Options */}
              {expanded && (
                <button
                  onClick={() => setShowModal(true)}
                  className="group relative flex items-center justify-between p-4 border border-yellow-500/20 hover:bg-yellow-500/20 hover:border-yellow-400 transition-all text-left animate-in fade-in slide-in-from-top-2"
                >
                  <span className="text-xl font-bold text-yellow-100 group-hover:text-white">1st</span>
                  <span className="text-xs text-yellow-400/60 group-hover:text-yellow-300 uppercase tracking-widest">
                    Special Curriculum
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-yellow-400/5 mix-blend-overlay pointer-events-none" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for 1st Grade Selection */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border-2 border-green-500 p-6 md:p-8 rounded-lg max-w-md w-full shadow-[0_0_30px_rgba(0,255,0,0.2)]">
            <h3 className="text-xl md:text-2xl text-green-400 font-bold mb-6 text-center border-b border-green-500/30 pb-4">
              SELECT MODULE
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => handleCustomSelection('unit1')}
                className="p-3 border border-green-500/40 text-green-100 hover:bg-green-500/20 hover:border-green-400 transition-all text-center uppercase tracking-widest font-bold"
              >
                Unit 1
              </button>
              <button 
                onClick={() => handleCustomSelection('unit2')}
                className="p-3 border border-green-500/40 text-green-100 hover:bg-green-500/20 hover:border-green-400 transition-all text-center uppercase tracking-widest font-bold"
              >
                Unit 2
              </button>
              <button 
                onClick={() => handleCustomSelection('unit3')}
                className="p-3 border border-green-500/40 text-green-100 hover:bg-green-500/20 hover:border-green-400 transition-all text-center uppercase tracking-widest font-bold"
              >
                Unit 3
              </button>
              <button 
                onClick={() => handleCustomSelection('first_term')}
                className="p-3 border border-yellow-500/40 text-yellow-100 hover:bg-yellow-500/20 hover:border-yellow-400 transition-all text-center uppercase tracking-widest font-bold mt-2"
              >
                First Term
              </button>
              
              <button 
                onClick={() => setShowModal(false)}
                className="mt-4 text-xs text-gray-500 hover:text-gray-300 text-center uppercase"
              >
                [ Cancel Operation ]
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 3. Gameplay Session
const GameSession: React.FC<{ 
  difficulty: Difficulty; 
  customWords?: WordChallenge[];
  onGameOver: (records: PlayerRecord[]) => void 
}> = ({ difficulty, customWords, onGameOver }) => {
  const [words, setWords] = useState<WordChallenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(100); // Percentage
  const [records, setRecords] = useState<PlayerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stressLevel, setStressLevel] = useState(0);
  
  // Use number for browser timer ID
  const timerRef = useRef<number | null>(null);
  const maxTimeSec = difficulty === 'A1' || difficulty === 'A2' ? 7 : difficulty === 'C1' || difficulty === 'C2' ? 4 : 5;
  
  // Initialize
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (customWords && customWords.length > 0) {
        setWords(customWords);
        setLoading(false);
      } else {
        const newWords = await fetchWordBatch(difficulty, 5);
        if (mounted) {
          setWords(newWords);
          setLoading(false);
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, [difficulty, customWords]);

  // Timer Logic
  useEffect(() => {
    if (loading) return;

    const step = 100 / (maxTimeSec * 10); // Update every 100ms
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        const newValue = prev - step;
        
        const prevSec = Math.ceil((prev / 100) * maxTimeSec);
        const newSec = Math.ceil((newValue / 100) * maxTimeSec);
        
        if (newSec < prevSec && newSec <= 3 && newSec > 0) {
          playTickSound();
        }

        if (newValue <= 0) {
          handleSubmit(true); 
          return 0;
        }
        return newValue;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, currentIndex, maxTimeSec]); 

  const handleSubmit = useCallback(async (timeout = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const currentWord = words[currentIndex];
    const isCorrect = !timeout && input.trim().toLowerCase() === currentWord.english.toLowerCase();
    
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    const newRecord: PlayerRecord = {
      challenge: currentWord,
      playerAnswer: timeout ? '[NO RESPONSE]' : input,
      isCorrect,
      timeTaken: maxTimeSec * (1 - timeLeft / 100)
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);

    if (!isCorrect) {
      onGameOver(updatedRecords);
    } else {
      setStressLevel(prev => Math.min(prev + 0.1, 1));
      setInput('');
      setTimeLeft(100);
      
      if (currentIndex + 1 >= words.length) {
        setLoading(true);
        if (customWords) {
          const reshuffled = [...words].sort(() => Math.random() - 0.5);
          setWords(prev => [...prev, ...reshuffled]);
          setLoading(false);
          setCurrentIndex(prev => prev + 1);
        } else {
          const moreWords = await fetchWordBatch(difficulty, 5);
          setWords(prev => [...prev, ...moreWords]);
          setLoading(false);
          setCurrentIndex(prev => prev + 1);
        }
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }
  }, [input, words, currentIndex, records, timeLeft, maxTimeSec, difficulty, onGameOver, customWords]);

  if (loading && words.length === 0) {
    return <div className="text-center mt-40 text-green-500 animate-pulse">DECRYPTING DATA STREAMS...</div>;
  }

  const currentWord = words[currentIndex];

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-12 md:mt-24 p-6">
      <Atmosphere intensity={stressLevel} />
      
      <div className="bg-gray-900/80 border border-gray-700 p-12 rounded shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-2 right-4 text-xs text-gray-500 font-mono">
          CASE #{1000 + currentIndex}
        </div>
        
        <h1 className="text-6xl md:text-8xl font-arabic mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          {currentWord?.arabic}
        </h1>

        <input
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full bg-transparent border-b-2 border-gray-500 text-center text-3xl md:text-4xl font-mono text-green-400 focus:outline-none focus:border-green-400 transition-colors placeholder-gray-800 uppercase"
          placeholder="TRANSLATE"
          autoComplete="off"
        />
      </div>

      <div className="mt-8 h-2 bg-gray-800 rounded-full overflow-hidden relative">
        <div 
          className={`h-full transition-all duration-100 ease-linear ${timeLeft < 30 ? 'bg-red-600' : 'bg-white'}`}
          style={{ width: `${timeLeft}%` }}
        />
      </div>

      <div className="text-center mt-8 text-gray-500 italic text-sm opacity-50 font-serif">
        {stressLevel > 0.5 ? "\"Focus. Do not disappoint me.\"" : "Time is ticking..."}
      </div>
    </div>
  );
};

// 4. Results Dossier
const ResultDossier: React.FC<{ records: PlayerRecord[]; onRestart: () => void }> = ({ records, onRestart }) => {
  const correctCount = records.filter(r => r.isCorrect).length;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 flex items-start justify-center">
      <div className="relative my-4 md:my-10 bg-[#f4f1ea] text-gray-900 max-w-3xl w-full p-4 md:p-8 shadow-[0_0_50px_rgba(255,255,255,0.1)] font-dossier rotate-0 md:rotate-1">
        
        <div className="absolute top-24 right-2 md:top-32 md:right-10 border-4 md:border-8 border-red-900 text-red-900 font-bold text-3xl md:text-5xl px-4 py-1 md:px-6 md:py-2 opacity-75 -rotate-12 mix-blend-multiply pointer-events-none z-20">
          TERMINATED
        </div>

        <div className="border-b-4 border-black mb-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-4xl font-black text-black underline decoration-4 decoration-black">INTERROGATION REPORT</h1>
            <p className="text-xs md:text-sm mt-2 font-bold text-black uppercase tracking-widest">SUBJECT: #UNKNOWN</p>
          </div>
          <div className="text-left md:text-right flex flex-col items-start md:items-end w-full md:w-auto">
            <span className="text-xs font-bold text-black uppercase tracking-widest mb-1">Confirmed</span>
            <p className="text-5xl md:text-6xl font-black text-black leading-none tracking-tighter">
              SCORE: {correctCount}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8 text-base md:text-lg font-bold text-black">
          <p>The subject failed to maintain linguistic coherence under pressure.</p>
          <p>Details of the session are as follows:</p>
        </div>

        <div className="overflow-x-auto bg-white border-2 border-black shadow-inner relative z-10">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead className="bg-gray-200 border-b-2 border-black text-sm uppercase text-black font-black tracking-wider">
              <tr>
                <th className="p-4">Arabic</th>
                <th className="p-4">Target</th>
                <th className="p-4">Input</th>
                <th className="p-4">Result</th>
              </tr>
            </thead>
            <tbody className="font-mono text-base font-bold">
              {records.map((rec, idx) => {
                const isFail = !rec.isCorrect;
                return (
                  <tr 
                    key={idx} 
                    className={`${
                      isFail 
                        ? 'bg-black border-2 border-black' 
                        : 'bg-white border-b border-gray-400'
                    }`}
                  >
                    <td className={`p-4 font-arabic ${isFail ? 'text-4xl text-red-600' : 'text-3xl text-black'}`}>
                      {rec.challenge.arabic}
                    </td>
                    <td className={`p-4 ${isFail ? 'text-xl font-black text-red-600' : 'text-base text-black'}`}>
                      {rec.challenge.english}
                    </td>
                    <td className={`p-4 ${isFail ? 'text-xl font-black text-red-600' : 'text-base text-gray-900'}`}>
                      {rec.playerAnswer || '---'}
                    </td>
                    <td className={`p-4 font-black ${isFail ? 'text-xl' : 'text-base'}`}>
                      {isFail 
                        ? <span className="text-red-600">FAIL</span> 
                        : <span className="text-green-900">PASS</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={onRestart}
            className="bg-black text-white px-8 py-4 font-black hover:bg-red-900 transition-colors uppercase tracking-widest text-lg shadow-lg w-full md:w-auto"
          >
            Re-Evaluate Subject
          </button>
        </div>
        
        <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none mix-blend-multiply" />
      </div>
    </div>
  );
};

// --- Main App Component --- //

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.A1);
  const [sessionRecords, setSessionRecords] = useState<PlayerRecord[]>([]);
  const [customWordList, setCustomWordList] = useState<WordChallenge[] | undefined>(undefined);

  const handleIntroComplete = () => setGameState(GameState.MENU);
  
  const handleDifficultySelect = (d: Difficulty) => {
    setDifficulty(d);
    setCustomWordList(undefined);
    setGameState(GameState.PLAYING);
  };

  const handleCustomSelect = (words: WordChallenge[]) => {
    setCustomWordList(words);
    setDifficulty(Difficulty.A1);
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = (records: PlayerRecord[]) => {
    setSessionRecords(records);
    const flash = document.createElement('div');
    flash.className = 'fixed inset-0 bg-red-600 z-[100] pointer-events-none mix-blend-overlay';
    document.body.appendChild(flash);
    
    flash.animate([
      { opacity: 0 },
      { opacity: 1 },
      { opacity: 0 }
    ], { duration: 300, iterations: 2 });

    setTimeout(() => {
      document.body.removeChild(flash);
      setGameState(GameState.RESULTS);
    }, 1000);
  };

  const handleRestart = () => {
    setGameState(GameState.MENU);
    setSessionRecords([]);
    setCustomWordList(undefined);
  };

  // Global Click Sound
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'A' || target.closest('a')) {
        playClickSound();
        // Ensure music starts if allowed
        initMusic();
      }
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 font-mono overflow-hidden selection:bg-red-900 selection:text-white">
      {/* Background ambient light spots */}
      <div className="fixed top-[-10%] left-[20%] w-[400px] h-[400px] bg-yellow-900/10 rounded-full blur-[120px] pointer-events-none light-flicker" />
      
      {gameState === GameState.INTRO && <IntroSequence onComplete={handleIntroComplete} />}
      
      {gameState === GameState.MENU && (
        <>
          <Atmosphere intensity={0.2} />
          <DifficultyMenu onSelect={handleDifficultySelect} onSelectCustom={handleCustomSelect} />
          <ContactFab />
          <MusicToggle />
        </>
      )}

      {gameState === GameState.PLAYING && (
        <>
          <GameSession 
            difficulty={difficulty} 
            customWords={customWordList} 
            onGameOver={handleGameOver} 
          />
          <ContactFab />
          <MusicToggle />
        </>
      )}

      {gameState === GameState.RESULTS && (
        <>
          <ResultDossier records={sessionRecords} onRestart={handleRestart} />
          <ContactFab />
          <MusicToggle />
        </>
      )}
    </div>
  );
}
