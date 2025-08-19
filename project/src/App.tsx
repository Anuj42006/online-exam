import React, { useState } from 'react';
import StudentInfoForm from './components/StudentInfoForm';
import ExamPage from './components/ExamPage';

interface StudentInfo {
  name: string;
  rollNumber: string;
  className: string;
}

type AppState = 'student-info' | 'exam' | 'completed';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('student-info');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [examResults, setExamResults] = useState<{
    answers: Record<number, number>;
    timeRemaining: number;
  } | null>(null);

  const handleStudentInfoSubmit = (info: StudentInfo) => {
    setStudentInfo(info);
    setCurrentState('exam');
  };

  const handleExamSubmit = (answers: Record<number, number>, timeRemaining: number) => {
    setExamResults({ answers, timeRemaining });
    setCurrentState('completed');
  };

  if (currentState === 'student-info') {
    return <StudentInfoForm onSubmit={handleStudentInfoSubmit} />;
  }

  if (currentState === 'exam' && studentInfo) {
    return <ExamPage studentInfo={studentInfo} onExamSubmit={handleExamSubmit} />;
  }

  if (currentState === 'completed' && examResults) {
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Exam Successfully Completed!
          </h1>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Student Name</p>
              <p className="text-lg font-semibold text-gray-900">{studentInfo?.name}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Roll Number</p>
              <p className="text-lg font-semibold text-gray-900">{studentInfo?.rollNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
              <p className="text-lg font-semibold text-green-600">
                {formatTime(examResults.timeRemaining)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600">
              Your responses have been successfully recorded.
            </p>
            <p className="text-sm text-gray-500">
              You may now close this window or wait for further instructions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // This shouldn't happen in normal flow, but just in case
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}

export default App;