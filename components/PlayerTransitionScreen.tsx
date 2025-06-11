import React from 'react';
import { Player } from '../types';
import { Button } from './ui/Button';

interface PlayerTransitionScreenProps {
  currentPlayer: Player;
  onPlayerReady: () => void;
}

export const PlayerTransitionScreen: React.FC<PlayerTransitionScreenProps> = ({ currentPlayer, onPlayerReady }) => {
  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <div className="bg-slate-800 p-8 sm:p-12 rounded-xl shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-sky-400 mb-6">
          دستگاه را به ... بدهید: 📲 {/* Pass the Device to: */}
        </h2>
        <p className="text-5xl sm:text-6xl font-bold text-white mb-10">
          {currentPlayer.name}
        </p>
        <Button onClick={onPlayerReady} size="lg" variant="primary" className="px-8 py-4 text-xl">
          آماده‌ام - نقش من را نشان بده 👀 {/* I'm Ready - Show My Role */}
        </Button>
      </div>
    </div>
  );
};