
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { LearningContent, AppView } from '../types';
import { Sparkles, Loader2, BookCheck, ScrollText, BrainCircuit, Volume2, Trophy } from 'lucide-react';

interface StudyRoomProps {
  onContentCreated: (content: LearningContent) => void;
  existingContent?: LearningContent;
  onStartQuiz: (content: LearningContent) => void;
}

const StudyRoom: React.FC<StudyRoomProps> = ({ onContentCreated, existingContent, onStartQuiz }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards'>('summary');
  const [isReading, setIsReading] = useState(false);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const data = await geminiService.processContent(inputText);
      const newContent: LearningContent = {
        id: Math.random().toString(36).substr(2, 9),
        title: inputText.split('\n')[0].substring(0, 50) + '...',
        summary: data.summary,
        flashcards: data.flashcards,
        quiz: data.quiz,
        timestamp: Date.now(),
      };
      onContentCreated(newContent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReadSummary = async () => {
    if (!existingContent || isReading) return;
    setIsReading(true);
    const text = `Title: ${existingContent.title}. Summary: ${existingContent.summary}`;
    const duration = await geminiService.speak(text);
    setTimeout(() => setIsReading(false), duration || 3000);
  };

  if (!existingContent && !loading) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
            <Sparkles className="text-white w-10 h-10" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">What are we learning today?</h2>
          <p className="text-slate-500 text-lg">Paste your lecture notes, articles, or topics below.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="E.g., Quantum Physics is a branch of physics that..."
            className="w-full h-64 p-6 text-lg border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
          />
          <button
            onClick={handleProcess}
            disabled={!inputText.trim()}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <BrainCircuit className="w-5 h-5" />
            Analyze & Learn
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-600 font-medium">Gemini is synthesizing your learning material...</p>
      </div>
    );
  }

  const content = existingContent!;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-4 font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'summary' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-slate-400'
            }`}
          >
            <ScrollText className="w-4 h-4" />
            Adaptive Summary
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex-1 py-4 font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'flashcards' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-slate-400'
            }`}
          >
            <BookCheck className="w-4 h-4" />
            Flashcards
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'summary' ? (
            <div className="prose prose-slate max-w-none">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Topic Breakdown</h2>
                <button 
                  onClick={handleReadSummary}
                  disabled={isReading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isReading ? 'bg-blue-100 text-blue-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                >
                  <Volume2 className={`w-4 h-4 ${isReading ? 'animate-pulse' : ''}`} />
                  {isReading ? 'Reading...' : 'Listen to Content'}
                </button>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                {content.summary}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.flashcards.map((card, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-blue-600 mb-2">Q{idx + 1}</div>
                  <div className="font-semibold text-slate-800 mb-4">{card.question}</div>
                  <div className="text-slate-600 border-t border-slate-200 pt-4 mt-4 italic">
                    {card.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => onStartQuiz(content)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-3"
          >
            <Trophy className="w-5 h-5" />
            Take Personalized Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
