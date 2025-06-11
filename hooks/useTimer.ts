
import { useState, useEffect, useCallback } from 'react';

interface TimerState {
  remainingTime: number;
  isRunning: boolean;
  isFinished: boolean;
  startTimer: (duration: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

export const useTimer = (initialDuration: number = 0): TimerState => {
  const [remainingTime, setRemainingTime] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout> | null = null;

    if (isRunning && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, remainingTime]);

  const startTimer = useCallback((duration: number) => {
    setRemainingTime(duration);
    setIsRunning(true);
    setIsFinished(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsFinished(false);
    // setRemainingTime(initialDuration); // Or set to 0 or a specific value based on needs
  }, []);

  return { remainingTime, isRunning, isFinished, startTimer, pauseTimer, resetTimer };
};
