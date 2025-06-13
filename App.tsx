import React, { useState, useCallback, useEffect } from 'react';
import { Page, GameSettings, ActiveGame, Player } from './types';
import { WORD_CATEGORIES, EVERYTHING_CATEGORY_KEY, PLAYER_NAME_PREFIX, CUSTOM_CATEGORY_KEY } from './constants';
import { Header } from './components/Header';
import { SetupScreen } from './components/SetupScreen';
import { PlayerTransitionScreen } from './components/PlayerTransitionScreen';
import { RevealWordScreen } from './components/RevealWordScreen';
import { TimerCountdownScreen } from './components/TimerCountdownScreen';
import { RulesScreen } from './components/RulesScreen';
import { FaqScreen } from './components/FaqScreen';
import { WordListScreen } from './components/WordListScreen'; // Added import

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.SETUP);
  const [activeGame, setActiveGame] = useState<ActiveGame | null>(null);

  const handleStartGame = useCallback((settings: GameSettings) => {
    const players: Player[] = [];
    for (let i = 0; i < settings.numPlayers; i++) {
      players.push({ id: i, name: `${PLAYER_NAME_PREFIX} ${i + 1}`, isSpy: false });
    }

    let spiesAssigned = 0;
    while (spiesAssigned < settings.numSpies) {
      const randomIndex = Math.floor(Math.random() * settings.numPlayers);
      if (!players[randomIndex].isSpy) {
        players[randomIndex].isSpy = true;
        spiesAssigned++;
      }
    }

    let wordToUse: string;
    let categoryToUse: string;

    if (settings.customWord && settings.customWord.trim() !== '') {
      wordToUse = settings.customWord.trim();
      categoryToUse = CUSTOM_CATEGORY_KEY;
    } else {
      let availableWords: { word: string, category: string }[] = [];
      let finalSelectedCategories: string[];

      if (settings.selectedCategories.includes(EVERYTHING_CATEGORY_KEY)) {
        finalSelectedCategories = Object.keys(WORD_CATEGORIES); 
      } else {
        finalSelectedCategories = settings.selectedCategories;
      }

      finalSelectedCategories.forEach(categoryKey => {
        if (WORD_CATEGORIES[categoryKey]) { 
          WORD_CATEGORIES[categoryKey].forEach(word => {
            availableWords.push({ word, category: categoryKey });
          });
        }
      });
      
      if (availableWords.length === 0) {
        // This case should ideally be prevented by validation in SetupScreen
        console.error("No words available for selected categories. Defaulting...");
        const defaultCategoryKey = Object.keys(WORD_CATEGORIES)[0] || "مکان‌ها";
        const defaultWords = WORD_CATEGORIES[defaultCategoryKey] || ["کلمه پیش‌فرض"];
        wordToUse = defaultWords[0];
        categoryToUse = defaultCategoryKey;
      } else {
        const randomWordWithCategory = availableWords[Math.floor(Math.random() * availableWords.length)];
        wordToUse = randomWordWithCategory.word;
        categoryToUse = randomWordWithCategory.category;
      }
    }

    setActiveGame({
      players,
      word: wordToUse,
      category: categoryToUse,
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
    // Future: Add logic for voting or game end summary.
    console.log("Timer ended, game discussion phase over.");
  }, []);

  const renderPage = () => {
    if (!activeGame && (currentPage === Page.PLAYER_TRANSITION || currentPage === Page.REVEAL_WORD || currentPage === Page.TIMER_COUNTDOWN)) {
        setCurrentPage(Page.SETUP);
        // setActiveGame(null); // Already null
        return <SetupScreen onStartGame={handleStartGame} />;
    }

    switch (currentPage) {
      case Page.SETUP:
        return <SetupScreen onStartGame={handleStartGame} />;
      case Page.RULES:
        return <RulesScreen />;
      case Page.FAQ:
        return <FaqScreen />;
      case Page.WORD_LIST: // Added case for WordListScreen
        return <WordListScreen />;
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
        // setCurrentPage(Page.SETUP); // Avoid infinite loop if state is corrupted
        return <SetupScreen onStartGame={handleStartGame} />;
    }
    // Fallback if activeGame was null for a game page, or unknown page
    // This ensures UI always renders something, defaults to setup.
    // This part is reached if a game page `break`s, meaning activeGame was null
    // AND the initial guard `if (!activeGame && ...)` somehow didn't catch it or was bypassed.
    // In this scenario, `currentPage` would be a game-specific page.
    const nonGamePagesHandledBySwitchReturnOrRedirect: Page[] = [Page.SETUP, Page.RULES, Page.FAQ, Page.WORD_LIST];
    if (!nonGamePagesHandledBySwitchReturnOrRedirect.includes(currentPage)) {
      setCurrentPage(Page.SETUP);
    }
    return <SetupScreen onStartGame={handleStartGame} />;
  };
  
  // Effect to manage navigation and active game state.
  // For instance, if user navigates away from game-specific pages back to SETUP,
  // consider if activeGame should be cleared.
  // Currently, navigating to SETUP does not clear activeGame, allowing game settings to persist
  // if the user just peeks at rules/faq.
  useEffect(() => {
    // Example: If navigating to SETUP and a game is "in progress" (e.g. past first player reveal)
    // you might want to prompt or automatically clear activeGame.
    // For now, this is kept simple.
    // if (currentPage === Page.SETUP && activeGame && activeGame.currentPlayerIndex > 0) {
    //   // setActiveGame(null); // Option to reset game if navigating back to setup mid-game
    // }
  }, [currentPage, activeGame]);


  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Header setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <main className="flex-grow container mx-auto px-0 sm:px-4 py-4">
        {renderPage()}
      </main>
      <footer className="text-center p-4 text-sm text-slate-500 border-t border-slate-700">
       SPY  🕵️ &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;