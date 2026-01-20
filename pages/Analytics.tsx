
import React from 'react';
import { UserProgress } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Award, Target } from 'lucide-react';

interface AnalyticsProps {
  history: UserProgress[];
}

const Analytics: React.FC<AnalyticsProps> = ({ history }) => {
  const data = history.map(h => ({
    name: h.topic,
    score: (h.score / h.totalQuestions) * 100,
    date: h.date
  }));

  const avgScore = data.length > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / data.length) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Learning Insights</h2>
        <p className="text-slate-500">Track your adaptive learning journey and performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-blue-600 w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase">Avg Mastery</span>
          </div>
          <div className="text-4xl font-black text-slate-900">{avgScore}%</div>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${avgScore}%` }} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Award className="text-emerald-600 w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase">Quiz Milestone</span>
          </div>
          <div className="text-4xl font-black text-slate-900">{data.length}</div>
          <p className="mt-2 text-sm text-slate-500 font-medium">Tests completed this month</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Target className="text-orange-600 w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase">Study Streaks</span>
          </div>
          <div className="text-4xl font-black text-slate-900">5 Days</div>
          <p className="mt-2 text-sm text-slate-500 font-medium">Keep it going! 🔥</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-96">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Performance Over Time</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
