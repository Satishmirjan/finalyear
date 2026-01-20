
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuizQuestion, LearningContent } from '../types';
import { geminiService } from '../services/geminiService';
import { Volume2, ChevronRight, CheckCircle2, XCircle, Home, RotateCcw } from 'lucide-react';

interface QuizSessionProps {
  content: LearningContent;
  accessibilityMode: boolean;
  onFinish: (score: number, total: number) => void;
  onExit: () => void;
}

const QuizSession: React.FC<QuizSessionProps> = ({ content, accessibilityMode, onFinish, onExit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentQuestion = content.quiz[currentIdx];

  const speakQuestion = useCallback(async () => {
    if (!currentQuestion || isSpeaking) return;
    setIsSpeaking(true);
    const text = `Question ${currentIdx + 1}: ${currentQuestion.question}. Option 1: ${currentQuestion.options[0]}. Option 2: ${currentQuestion.options[1]}. Option 3: ${currentQuestion.options[2]}. Option 4: ${currentQuestion.options[3]}. Please press 1, 2, 3, or 4 on your keyboard.`;
    const duration = await geminiService.speak(text);
    setTimeout(() => setIsSpeaking(false), duration || 1000);
  }, [currentQuestion, currentIdx, isSpeaking]);

  useEffect(() => {
    if (accessibilityMode && !isCompleted) {
      speakQuestion();
    }
  }, [currentIdx, accessibilityMode]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isCompleted || showFeedback) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        handleOptionSelect(parseInt(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isCompleted, showFeedback]);

  const handleOptionSelect = (idx: number) => {
    setSelectedIdx(idx);
    setShowFeedback(true);
    if (idx === currentQuestion.correctIndex) {
      setScore(s => s + 1);
      if (accessibilityMode) geminiService.speak("Correct!");
    } else {
      if (accessibilityMode) geminiService.speak(`Incorrect. The correct answer was ${currentQuestion.options[currentQuestion.correctIndex]}.`);
    }
  };

  const handleNext = () => {
    if (currentIdx < content.quiz.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setShowFeedback(false);
    } else {
      setIsCompleted(true);
      onFinish(score, content.quiz.length);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-8">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="text-blue-600 w-12 h-12" />
        </div>
        <h2 className="text-4xl font-bold text-slate-900">Quiz Completed!</h2>
        <div className="text-6xl font-black text-blue-600">
          {score} / {content.quiz.length}
        </div>
        <p className="text-slate-500 text-lg">Great effort! Your performance data has been added to your dashboard.</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={onExit}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            <Home className="w-5 h-5" />
            Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col justify-center">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Question {currentIdx + 1} of {content.quiz.length}</span>
            <h2 className={`text-3xl font-bold text-slate-900 mt-2 ${accessibilityMode ? 'text-4xl leading-tight' : ''}`}>
              {currentQuestion.question}
            </h2>
          </div>
          <button 
            onClick={speakQuestion}
            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
            title="Listen to question"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, idx) => {
            let stateClass = 'bg-white border-slate-200 hover:border-blue-300 text-slate-700';
            if (showFeedback) {
              if (idx === currentQuestion.correctIndex) {
                stateClass = 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-100';
              } else if (idx === selectedIdx) {
                stateClass = 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-100';
              } else {
                stateClass = 'bg-white border-slate-200 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={showFeedback}
                onClick={() => handleOptionSelect(idx)}
                className={`group flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-left ${stateClass} ${accessibilityMode ? 'p-8 text-2xl' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border-2 ${showFeedback && idx === currentQuestion.correctIndex ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 bg-slate-50 text-slate-400 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                    {idx + 1}
                  </div>
                  <span className="font-semibold">{option}</span>
                </div>
                {showFeedback && idx === currentQuestion.correctIndex && <CheckCircle2 className="text-emerald-500 w-6 h-6" />}
                {showFeedback && idx === selectedIdx && idx !== currentQuestion.correctIndex && <XCircle className="text-rose-500 w-6 h-6" />}
              </button>
            );
          })}
        </div>
      </div>

      {showFeedback && (
        <div className="bg-slate-900 text-white p-8 rounded-3xl animate-in slide-in-from-bottom-4 flex justify-between items-center shadow-2xl">
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-1">{selectedIdx === currentQuestion.correctIndex ? 'Correct!' : 'Keep Learning'}</h4>
            <p className="text-slate-400 leading-snug">{currentQuestion.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="ml-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
          >
            Next Question
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default QuizSession;
