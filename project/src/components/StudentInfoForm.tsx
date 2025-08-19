import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, GraduationCap, Hash, Clock, AlertTriangle } from 'lucide-react';
import { useScreenshotPrevention } from '../hooks/useScreenshotPrevention';

interface StudentInfo {
  name: string;
  rollNumber: string;
  className: string;
  branch: string;
}

interface StudentInfoFormProps {
  onSubmit: (studentInfo: StudentInfo) => void;
}

export default function StudentInfoForm({ onSubmit }: StudentInfoFormProps) {
  useScreenshotPrevention();
  
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    rollNumber: '',
    className: '',
    branch: ''
  });

  const [errors, setErrors] = useState<Partial<StudentInfo>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentInfo(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof StudentInfo]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<StudentInfo> = {};
    if (!studentInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!studentInfo.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }
    if (!studentInfo.className.trim()) {
      newErrors.className = 'Class is required';
    }
    if (!studentInfo.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(studentInfo);
    }
  };

  const formAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const inputAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-100 to-blue-100 flex items-center justify-center px-3 py-2 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-10 w-full max-w-lg border border-indigo-100 mx-auto my-2 sm:my-0"
      >
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5
              }}
              className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6"
            >
              <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </motion.div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 mb-2 sm:mb-3 tracking-tight">
            Online Exam Portal
          </h1>
          <p className="text-gray-600 text-base sm:text-lg px-2">Complete your registration to begin</p>
        </motion.div>

        {/* Form Section */}
        <motion.form
          variants={formAnimation}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <motion.div
            whileFocus={{ scale: 1.03 }}
            whileHover={{ scale: 1.01 }}
            className="group"
          >
            <label htmlFor="name" className="block text-sm sm:text-base font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                id="name"
                name="name"
                value={studentInfo.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200 bg-white/70 shadow-sm ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                autoComplete="off"
              />
            </div>
            {errors.name && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-sm text-red-600">{errors.name}</motion.p>}
          </motion.div>

          <motion.div
            whileFocus={{ scale: 1.03 }}
            whileHover={{ scale: 1.01 }}
            className="group"
          >
            <label htmlFor="rollNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              Roll Number
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={studentInfo.rollNumber}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200 bg-white/70 shadow-sm ${
                  errors.rollNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your roll number"
                autoComplete="off"
              />
            </div>
            {errors.rollNumber && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-sm text-red-600">{errors.rollNumber}</motion.p>}
          </motion.div>

          <motion.div
            whileFocus={{ scale: 1.03 }}
            whileHover={{ scale: 1.01 }}
            className="group"
          >
            <label htmlFor="className" className="block text-sm font-semibold text-gray-700 mb-2">
              Semester
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
              <select
                id="className"
                name="className"
                value={studentInfo.className}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200 bg-white/70 shadow-sm appearance-none ${
                  errors.className ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your Semester</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
                <option value="5th">5th</option>
                <option value="6th">6th</option>
              </select>
            </div>
            {errors.className && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-sm text-red-600">{errors.className}</motion.p>}
          </motion.div>

          <motion.div
            whileFocus={{ scale: 1.03 }}
            whileHover={{ scale: 1.01 }}
            className="group"
          >
            <label htmlFor="branch" className="block text-sm font-semibold text-gray-700 mb-2">
              Branch
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
              <select
                id="branch"
                name="branch"
                value={studentInfo.branch}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200 bg-white/70 shadow-sm appearance-none ${
                  errors.branch ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your branch</option>
                <option value="Electronics">Electronics</option>
                <option value="CSE">CSE</option>
                <option value="Electrical">Electrical</option>
                <option value="Civil">Civil</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Automobile">Automobile</option>
              </select>
            </div>
            {errors.branch && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-sm text-red-600">{errors.branch}</motion.p>}
          </motion.div>

          {/* Warning Section */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl border border-amber-200"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1 text-sm sm:text-base text-amber-800">
                  <p className="font-medium mb-1 sm:mb-2">Important Notice:</p>
                  <ul className="space-y-1 list-disc list-inside text-sm">
                    <li>You have 30 minutes to complete the exam</li>
                    <li>Switching tabs will auto-submit your exam</li>
                    <li>Ensure stable internet connection</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl 
            transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center space-x-2 text-base sm:text-lg"
          >
            <span>Start Exam</span>
            <Clock className="h-5 w-5 animate-pulse" />
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}