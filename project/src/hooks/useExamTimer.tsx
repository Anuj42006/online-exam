import { useState, useEffect, useRef } from 'react';

export function useExamTimer(initialSeconds: number, onTimeUp: (timeRemaining: number) => void) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const onTimeUpRef = useRef(onTimeUp);

  // Update the callback ref when it changes
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true);
          clearInterval(intervalRef.current);
          onTimeUpRef.current(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { timeRemaining, isTimeUp };
}