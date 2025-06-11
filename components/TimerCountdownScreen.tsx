import React, { useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { Page } from '../types';
import { Button } from './ui/Button';

interface TimerCountdownScreenProps {
  durationSeconds: number;
  onTimerEnd: () => void; 
  setCurrentPage: (page: Page) => void;
}

export const TimerCountdownScreen: React.FC<TimerCountdownScreenProps> = ({ durationSeconds, onTimerEnd, setCurrentPage }) => {
  const { remainingTime, isRunning, isFinished, startTimer } = useTimer(durationSeconds);

  useEffect(() => {
    startTimer(durationSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationSeconds, startTimer]);

  useEffect(() => {
    if (isFinished) {
      onTimerEnd();
    }
  }, [isFinished, onTimerEnd]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // Convert to Farsi numerals if desired, for now using standard numerals
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <div className="bg-slate-800 p-8 sm:p-12 rounded-xl shadow-2xl">
        {!isFinished ? (
          <>
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-400 mb-6">زمان باقی‌مانده ⏳</h2> {/* Time Remaining */}
            <div className="text-7xl sm:text-8xl font-mono font-bold text-white my-8 p-4 bg-slate-700 rounded-lg shadow-inner font-mono-numbers">
              {formatTime(remainingTime)}
            </div>
            <p className="text-slate-300 text-lg">
              بحث کنید، سوال بپرسید و سعی کنید جاسوس را شناسایی کنید (یا کلمه را اگر جاسوس هستید)! 🗣️ {/* Discuss, ask questions, and try to identify the spy (or the word if you are the spy)! */}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl sm:text-5xl font-bold text-red-500 mb-6 animate-bounce">وقت تمام شد! ⏰</h2> {/* TIME'S UP! */}
            <p className="text-xl text-slate-200 mb-8">
              مرحله بازجویی تمام شد. وقت آن است که در مورد سوء ظن خود صحبت کرده و رای دهید! 🗳️ {/* The interrogation phase is over. It's time to discuss your suspicions and vote! */}
            </p>
            <Button onClick={() => setCurrentPage(Page.SETUP)} size="lg" variant="primary">
              شروع بازی جدید 🎉 {/* Start a New Game */}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};