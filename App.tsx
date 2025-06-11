import React, { useState, useCallback, useEffect } from 'react';
import { Page, GameSettings, ActiveGame, Player } from './types';
import { WORD_CATEGORIES, EVERYTHING_CATEGORY_KEY, PLAYER_NAME_PREFIX } from './constants';
import { Header } from './components/Header';
import { SetupScreen } from './components/SetupScreen';
import { PlayerTransitionScreen } from './components/PlayerTransitionScreen';
import { RevealWordScreen } from './components/RevealWordScreen';
import { TimerCountdownScreen } from './components/TimerCountdownScreen';
import { RulesScreen } from './components/RulesScreen';
import { FaqScreen } from './components/FaqScreen';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.SETUP);
  const [activeGame, setActiveGame] = useState<ActiveGame | null>(null);

  const handleStartGame = useCallback((settings: GameSettings) => {
    const players: Player[] = [];
    for (let i = 0; i < settings.numPlayers; i++) {
      players.push({ id: i, name: `${PLAYER_NAME_PREFIX} ${i + 1}`, isSpy: false });
    }

    // Assign spies randomly
    let spiesAssigned = 0;
    while (spiesAssigned < settings.numSpies) {
      const randomIndex = Math.floor(Math.random() * settings.numPlayers);
      if (!players[randomIndex].isSpy) {
        players[randomIndex].isSpy = true;
        spiesAssigned++;
      }
    }

    let availableWords: { word: string, category: string }[] = [];
    let finalSelectedCategories: string[];

    if (settings.selectedCategories.includes(EVERYTHING_CATEGORY_KEY)) {
      finalSelectedCategories = Object.keys(WORD_CATEGORIES); // Use all defined categories
    } else {
      finalSelectedCategories = settings.selectedCategories;
    }

    finalSelectedCategories.forEach(categoryKey => {
      // Handle cases where EVERYTHING_CATEGORY_KEY might be passed here if logic changes
      // or if WORD_CATEGORIES itself has an "Everything" key (which it doesn't by default from constants)
      if (WORD_CATEGORIES[categoryKey]) { 
        WORD_CATEGORIES[categoryKey].forEach(word => {
          availableWords.push({ word, category: categoryKey });
        });
      }
    });
    
    if (availableWords.length === 0) {
      // Fallback if somehow no words are available (e.g. empty category or only "Everything" was selected but no words for it)
      console.error("No words available for selected categories. Defaulting...");
      const defaultCategoryKey = Object.keys(WORD_CATEGORIES)[0]; // Get the first actual category
      const defaultWords = WORD_CATEGORIES[defaultCategoryKey] || ["کلمه پیش‌فرض"];
      availableWords.push({ word: defaultWords[0], category: defaultCategoryKey });
    }

    const randomWordWithCategory = availableWords[Math.floor(Math.random() * availableWords.length)];

    setActiveGame({
      players,
      word: randomWordWithCategory.word,
      category: randomWordWithCategory.category,
      currentPlayerIndex: 0,
      gameSettings: settings,
    });
    setCurrentPage(Page.PLAYER_TRANSITION);
  }, []);

  const handlePlayerReady = useCallback(() => {
    setCurrentPage(Page.REVEAL_WORD);
  }, []);

  const handleWordHidden = useCallback(() => {
    if (activeGame) {
      const nextPlayerIndex = activeGame.currentPlayerIndex + 1;
      if (nextPlayerIndex < activeGame.gameSettings.numPlayers) {
        setActiveGame(prev => prev ? { ...prev, currentPlayerIndex: nextPlayerIndex } : null);
        setCurrentPage(Page.PLAYER_TRANSITION);
      } else {
        setCurrentPage(Page.TIMER_COUNTDOWN);
      }
    }
  }, [activeGame]);
  
  const handleTimerEnd = useCallback(() => {
    console.log("Timer ended, game discussion phase over.");
  }, []);

  const renderPage = () => {
    if (!activeGame && (currentPage === Page.PLAYER_TRANSITION || currentPage === Page.REVEAL_WORD || currentPage === Page.TIMER_COUNTDOWN)) {
        setCurrentPage(Page.SETUP);
        setActiveGame(null); 
        return <SetupScreen onStartGame={handleStartGame} />;
    }

    switch (currentPage) {
      case Page.SETUP:
        return <SetupScreen onStartGame={handleStartGame} />;
      case Page.RULES:
        return <RulesScreen />;
      case Page.FAQ:
        return <FaqScreen />;
      case Page.PLAYER_TRANSITION:
        if (activeGame) {
          return (
            <PlayerTransitionScreen
              currentPlayer={activeGame.players[activeGame.currentPlayerIndex]}
              onPlayerReady={handlePlayerReady}
            />
          );
        }
        break; 
      case Page.REVEAL_WORD:
        if (activeGame) {
          return (
            <RevealWordScreen
              activeGame={activeGame}
              currentPlayer={activeGame.players[activeGame.currentPlayerIndex]}
              onWordHidden={handleWordHidden}
            />
          );
        }
        break; 
      case Page.TIMER_COUNTDOWN:
        if (activeGame) {
          return (
            <TimerCountdownScreen
              durationSeconds={activeGame.gameSettings.timerDuration}
              onTimerEnd={handleTimerEnd}
              setCurrentPage={setCurrentPage}
            />
          );
        }
        break; 
      default:
        setCurrentPage(Page.SETUP); 
        return <SetupScreen onStartGame={handleStartGame} />;
    }
    // Fallback if activeGame was null for a game page
    setCurrentPage(Page.SETUP);
    return <SetupScreen onStartGame={handleStartGame} />;
  };
  
  useEffect(() => {
    if (activeGame && (currentPage === Page.SETUP || currentPage === Page.RULES || currentPage === Page.FAQ)) {
        if(currentPage === Page.SETUP && activeGame.currentPlayerIndex > 0) { 
            // Consider if game state should be cleared when navigating back to setup mid-game
            // setActiveGame(null); // Uncomment this if you want to reset game when navigating to setup
        }
    }
  }, [currentPage, activeGame]);


  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <footer className="text-center p-4 text-sm text-slate-500 border-t border-slate-700">
       SPY  🕵️ &copy; {new Date().getFullYear()} {/* Shadow Protocol */}
      </footer>
    </div>
  );
};

export default App;