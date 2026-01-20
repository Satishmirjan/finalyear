
import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, BookOpen, GraduationCap, Users, BarChart3, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  accessibilityMode: boolean;
  setAccessibilityMode: (mode: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, accessibilityMode, setAccessibilityMode }) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: AppView.STUDY_ROOM, label: 'Study Hub', icon: BookOpen },
    { view: AppView.TEACHER_TOOLS, label: 'Educator Tools', icon: Users },
    { view: AppView.PROGRESS, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">LearnAI</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeView === item.view
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-xs font-semibold text-slate-500 uppercase">Accessibility</span>
            <button 
              onClick={() => setAccessibilityMode(!accessibilityMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${accessibilityMode ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${accessibilityMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
