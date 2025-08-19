import React, { useState, useEffect, useCallback } from 'react';
import { motion } from "motion/react"
import { Clock, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { useExamTimer } from '../hooks/useExamTimer';
import { useExamSecurity } from '../hooks/useExamSecurity';
import { useScreenshotPrevention } from '../hooks/useScreenshotPrevention';

interface StudentInfo {
  name: string;
  rollNumber: string;
  className: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ExamPageProps {
  studentInfo: StudentInfo;
  onExamSubmit: (answers: Record<number, number>, timeRemaining: number) => void;
}

const examQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "Which programming language is primarily used for web development?",
    options: ["Python", "JavaScript", "C++", "Java"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is 15 × 8?",
    options: ["120", "115", "125", "130"],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1
  }
];

export default function ExamPage({ studentInfo, onExamSubmit }: ExamPageProps) {
  useScreenshotPrevention();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitExam = useCallback((timeRemaining: number) => {
    if (!isSubmitted) {
      setIsSubmitted(true);
      onExamSubmit(answers, timeRemaining);
    }
  }, [answers, isSubmitted, onExamSubmit]);

  const { timeRemaining, isTimeUp } = useExamTimer(30 * 60, handleSubmitExam); // 30 minutes
  useExamSecurity(handleSubmitExam, isSubmitted);

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    if (!isSubmitted) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: answerIndex
      }));
    }
  };

  const handleManualSubmit = () => {
    handleSubmitExam(timeRemaining);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 600) return 'text-green-600'; // > 10 minutes
    if (timeRemaining > 300) return 'text-yellow-600'; // > 5 minutes
    return 'text-red-600'; // <= 5 minutes
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = examQuestions.length;

  if (isSubmitted || isTimeUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isTimeUp ? "Time's Up!" : "Exam Submitted"}
          </h2>
          <p className="text-gray-600 mb-4">
            {isTimeUp 
              ? "Your exam has been automatically submitted as the time limit has been reached." 
              : "Your exam has been successfully submitted."
            }
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              <strong>Student:</strong> {studentInfo.name}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Roll Number:</strong> {studentInfo.rollNumber}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Questions Answered:</strong> {answeredCount} out of {totalQuestions}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            You may now close this window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6 sticky top-4 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-indigo-600" />
            <div>
              <h2 className="font-semibold text-gray-900">{studentInfo.name}</h2>
              <p className="text-sm text-gray-600">Roll: {studentInfo.rollNumber} | {studentInfo.className}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="font-semibold text-gray-900">{answeredCount}/{totalQuestions}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className={`h-5 w-5 ${getTimerColor()}`} />
              <span className={`text-xl font-mono font-bold ${getTimerColor()}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>
        
        {timeRemaining <= 300 && (
          <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-800">Less than 5 minutes remaining!</p>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6">
          {examQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Question {question.id}: {question.question}
              </h3>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                      answers[question.id] === index
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={index}
                      checked={answers[question.id] === index}
                      onChange={() => handleAnswerChange(question.id, index)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                      answers[question.id] === index
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[question.id] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                You have answered {answeredCount} out of {totalQuestions} questions
              </p>
              {answeredCount < totalQuestions && (
                <p className="text-sm text-amber-600">
                  Please answer all questions before submitting
                </p>
              )}
            </div>
            <button
              onClick={handleManualSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      {/* Security Warning */}
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-200 rounded-lg p-3 max-w-sm">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <p className="text-xs text-red-800">
            Switching tabs or losing focus will auto-submit your exam
          </p>
        </div>
      </div>
    </div>
  );
}