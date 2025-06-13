export enum Page {
  SETUP = 'SETUP',
  RULES = 'RULES',
  FAQ = 'FAQ',
  WORD_LIST = 'WORD_LIST', // Added new page
  PLAYER_TRANSITION = 'PLAYER_TRANSITION',
  REVEAL_WORD = 'REVEAL_WORD',
  TIMER_COUNTDOWN = 'TIMER_COUNTDOWN',
}

export interface Player {
  id: number;
  name: string; // Player names will remain generic like "Player 1" / "بازیکن ۱"
  isSpy: boolean;
}

export interface GameSettings {
  numPlayers: number;
  numSpies: number;
  showCategoryToSpy: boolean;
  selectedCategories: string[]; // Changed from selectedCategory: string
  timerDuration: number; // in seconds
  customWord?: string; // Added for custom word input
}

export interface ActiveGame {
  players: Player[];
  word: string;
  category: string; // The specific category of the chosen word
  currentPlayerIndex: number;
  gameSettings: GameSettings;
}

export interface WordCategories {
  [categoryName: string]: string[];
}