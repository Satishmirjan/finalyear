
import React from 'react';
import { AppView, LearningContent } from '../types';
import { BookOpen, Trophy, Clock, ChevronRight } from 'lucide-react';

interface DashboardProps {
  onStartStudy: () => void;
  savedContent: LearningContent[];
  onOpenContent: (content: LearningContent) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartStudy, savedContent, onOpenContent }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back, Learner</h2>
          <p className="text-slate-500">Pick up where you left off or start something new.</p>
        </div>
        <button 
          onClick={onStartStudy}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1"
        >
          Create New Module
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <BookOpen className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{savedContent.length}</div>
            <div className="text-sm text-slate-500">Modules Created</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <Trophy className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">85%</div>
            <div className="text-sm text-slate-500">Avg. Quiz Score</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Clock className="text-orange-600 w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">12h</div>
            <div className="text-sm text-slate-500">Study Time</div>
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Modules</h3>
        {savedContent.length === 0 ? (
          <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
            <p className="text-slate-500">No modules yet. Paste some content to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedContent.map((content) => (
              <button
                key={content.id}
                onClick={() => onOpenContent(content)}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all text-left flex justify-between items-center group"
              >
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{content.title}</h4>
                  <p className="text-sm text-slate-500 truncate max-w-xs">{content.summary}</p>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
