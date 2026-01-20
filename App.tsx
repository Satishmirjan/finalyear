
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudyRoom from './pages/StudyRoom';
import QuizSession from './pages/QuizSession';
import TeacherTools from './pages/TeacherTools';
import Analytics from './pages/Analytics';
import { AppView, LearningContent, UserProgress } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [savedContent, setSavedContent] = useState<LearningContent[]>([]);
  const [activeContent, setActiveContent] = useState<LearningContent | null>(null);
  const [quizHistory, setQuizHistory] = useState<UserProgress[]>([]);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (accessibilityMode) {
      geminiService.speak("Accessibility mode enabled. Voice navigation active. Try saying go to study hub or open analytics.");
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
          console.log('Voice Command:', command);

          if (command.includes('dashboard')) {
            setActiveView(AppView.DASHBOARD);
            geminiService.speak("Opening dashboard");
          } else if (command.includes('study hub') || command.includes('study room')) {
            setActiveView(AppView.STUDY_ROOM);
            geminiService.speak("Opening study hub");
          } else if (command.includes('teacher') || command.includes('tools') || command.includes('educator')) {
            setActiveView(AppView.TEACHER_TOOLS);
            geminiService.speak("Opening educator tools");
          } else if (command.includes('analytics') || command.includes('progress') || command.includes('data')) {
            setActiveView(AppView.PROGRESS);
            geminiService.speak("Opening analytics");
          }
        };

        recognition.onerror = () => {
          if (accessibilityMode) recognition.start();
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [accessibilityMode]);

  const handleContentCreated = (content: LearningContent) => {
    setSavedContent(prev => [content, ...prev]);
    setActiveContent(content);
    setActiveView(AppView.STUDY_ROOM);
  };

  const handleFinishQuiz = (score: number, total: number) => {
    if (activeContent) {
      const progress: UserProgress = {
        topic: activeContent.title,
        score,
        totalQuestions: total,
        date: new Date().toLocaleDateString(),
      };
      setQuizHistory(prev => [progress, ...prev]);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            onStartStudy={() => {
              setActiveContent(null);
              setActiveView(AppView.STUDY_ROOM);
            }} 
            savedContent={savedContent}
            onOpenContent={(content) => {
              setActiveContent(content);
              setActiveView(AppView.STUDY_ROOM);
            }}
          />
        );
      case AppView.STUDY_ROOM:
        return (
          <StudyRoom 
            onContentCreated={handleContentCreated} 
            existingContent={activeContent || undefined}
            onStartQuiz={(content) => {
              setActiveContent(content);
              setActiveView(AppView.QUIZ_SESSION);
            }}
          />
        );
      case AppView.QUIZ_SESSION:
        if (!activeContent) {
          setActiveView(AppView.DASHBOARD);
          return null;
        }
        return (
          <QuizSession 
            content={activeContent} 
            accessibilityMode={accessibilityMode}
            onFinish={handleFinishQuiz}
            onExit={() => setActiveView(AppView.DASHBOARD)}
          />
        );
      case AppView.TEACHER_TOOLS:
        return <TeacherTools />;
      case AppView.PROGRESS:
        return <Analytics history={quizHistory} />;
      default:
        return <Dashboard onStartStudy={() => setActiveView(AppView.STUDY_ROOM)} savedContent={[]} onOpenContent={() => {}} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView}
      accessibilityMode={accessibilityMode}
      setAccessibilityMode={setAccessibilityMode}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
