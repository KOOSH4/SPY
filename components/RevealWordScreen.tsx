import React, { useState, useEffect } from 'react';
import { Player, ActiveGame } from '../types';
import { Button } from './ui/Button';

interface RevealWordScreenProps {
  activeGame: ActiveGame;
  currentPlayer: Player;
  onWordHidden: () => void;
}

const HIDE_BUTTON_DELAY_MS = 5000; // 5 seconds

export const RevealWordScreen: React.FC<RevealWordScreenProps> = ({ activeGame, currentPlayer, onWordHidden }) => {
  const [isWordVisible, setIsWordVisible] = useState(false);
  const [isHideButtonEnabled, setIsHideButtonEnabled] = useState(false);
  const [countdown, setCountdown] = useState(Math.ceil(HIDE_BUTTON_DELAY_MS / 1000));

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    if (isWordVisible) {
      setIsHideButtonEnabled(false); // Disable initially when word is shown
      setCountdown(Math.ceil(HIDE_BUTTON_DELAY_MS / 1000));

      timerId = setTimeout(() => {
        setIsHideButtonEnabled(true);
        if (intervalId) clearInterval(intervalId);
      }, HIDE_BUTTON_DELAY_MS);

      intervalId = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearTimeout(timerId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isWordVisible]);

  const handleShowWord = () => {
    setIsWordVisible(true);
  };

  const handleHideAndPass = () => {
    setIsWordVisible(false);
    setIsHideButtonEnabled(false); 
    onWordHidden();
  };
  
  const { gameSettings, word, category } = activeGame;

  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <div className="bg-slate-800 p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-md">
        {!isWordVisible ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-sky-400 mb-4">
              {currentPlayer.name}، نوبت شماست. 🧐 {/* {currentPlayer.name}, it's your turn. */}
            </h2>
            <p className="text-slate-300 mb-8 text-lg">
              مطمئن شوید کس دیگری به صفحه نگاه نمی‌کند. 🤫 {/* Ensure no one else is looking at the screen. */}
            </p>
            <Button onClick={handleShowWord} size="lg" variant="primary" className="px-8 py-4 text-xl">
              نمایش نقش من ✨ {/* Reveal My Role */}
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-200 mb-2">نقش شما: 🎭</h2> {/* Your Role: */}
            {currentPlayer.isSpy ? (
              <>
                <p className="text-4xl sm:text-5xl font-bold text-red-500 my-4 animate-pulse">شما جاسوس هستید 🕵️</p> {/* YOU ARE THE SPY */}
                {gameSettings.showCategoryToSpy && (
                  <p className="text-xl text-slate-300 mt-2">
                    دسته‌بندی این است: <span className="font-semibold text-sky-300">{category}</span> {/* The category is: */}
                  </p>
                )}
                 <p className="text-sm text-slate-400 mt-4">
                  هدف شما این است که شناسایی نشوید و کلمه مخفی را حدس بزنید. مراقب باشید گیر نیفتید! 🎯 {/* Your goal is to blend in and guess the secret word. Don't get caught! */}
                </p>
              </>
            ) : (
              <>
                <p className="text-lg text-slate-300 mb-1">دسته‌بندی:</p> {/* The category is: */}
                <p className="text-3xl font-bold text-sky-400 mb-4">{category}</p>
                <p className="text-lg text-slate-300 mb-1">کلمه مخفی:</p> {/* The secret word is: */}
                <p className="text-4xl sm:text-5xl font-bold text-green-400 my-4">{word}</p>
                <p className="text-sm text-slate-400 mt-4">
                  هدف شما شناسایی جاسوس است. در سوال پرسیدن دقت کنید! 🎯 {/* Your goal is to identify the spy. Be careful with your questions! */}
                </p>
              </>
            )}
            <Button 
              onClick={handleHideAndPass} 
              size="lg" 
              variant="secondary"
              disabled={!isHideButtonEnabled}
              className="mt-10 w-full py-3 text-lg"
            >
              {isHideButtonEnabled ? 'پنهان کردن نقش و دادن دستگاه ⏩' : `پنهان‌سازی تا ${countdown} ثانیه دیگر... ⏳`}
              {/* Hide Role & Pass Device : Hiding in X s... */}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};