import React, { useState, useCallback, useEffect } from 'react';
import { GameSettings } from '../types';
import { WORD_CATEGORIES, MIN_PLAYERS, MAX_PLAYERS, TIMER_INCREMENT_OPTIONS, DEFAULT_TIMER_MINUTES, EVERYTHING_CATEGORY_KEY } from '../constants';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Checkbox } from './ui/Checkbox';

interface SetupScreenProps {
  onStartGame: (settings: GameSettings) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [numPlayers, setNumPlayers] = useState<number>(MIN_PLAYERS);
  const [numSpies, setNumSpies] = useState<number>(1);
  const [showCategoryToSpy, setShowCategoryToSpy] = useState<boolean>(true);
  // Initialize with the first category selected, or empty if "Everything" is the only one.
  const initialCategories = Object.keys(WORD_CATEGORIES).length > 0 ? [Object.keys(WORD_CATEGORIES)[0]] : [];
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [timerDurationMinutes, setTimerDurationMinutes] = useState<number>(DEFAULT_TIMER_MINUTES);
  
  const [errors, setErrors] = useState<{ players?: string; spies?: string; categories?: string }>({});

  const categoryKeys = Object.keys(WORD_CATEGORIES);
  const allCategoryOptions = [...categoryKeys, EVERYTHING_CATEGORY_KEY]; // Add "Everything" option

  const timerOptions = TIMER_INCREMENT_OPTIONS.map(min => ({ value: min, label: `${min} دقیقه ⏱️` })); // "minutes"

  const validateSettings = useCallback(() => {
    const newErrors: { players?: string; spies?: string; categories?: string } = {};
    if (numPlayers < MIN_PLAYERS || numPlayers > MAX_PLAYERS) {
      newErrors.players = `تعداد بازیکنان باید بین ${MIN_PLAYERS} و ${MAX_PLAYERS} باشد.`;
    }
    if (numSpies < 1) {
      newErrors.spies = 'حداقل باید 1 جاسوس وجود داشته باشد.';
    } else if (numSpies >= numPlayers) {
      newErrors.spies = 'تعداد جاسوس‌ها باید کمتر از کل بازیکنان باشد.';
    }
    if (selectedCategories.length === 0) {
      newErrors.categories = 'حداقل یک دسته‌بندی باید انتخاب شود.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [numPlayers, numSpies, selectedCategories]);

  // Trigger validation on state changes
  useEffect(() => {
    validateSettings();
  }, [numPlayers, numSpies, selectedCategories, validateSettings]);

  const handleStartGame = () => {
    if (validateSettings()) {
      onStartGame({
        numPlayers,
        numSpies,
        showCategoryToSpy,
        selectedCategories,
        timerDuration: timerDurationMinutes * 60, // convert minutes to seconds
      });
    }
  };

  const handlePlayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setNumPlayers(isNaN(val) ? 0 : val);
    if (numSpies >= val && val > 0) {
      setNumSpies(val - 1 > 0 ? val -1 : 1);
    }
  };
  
  const handleSpyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setNumSpies(isNaN(val) ? 0 : val);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (category === EVERYTHING_CATEGORY_KEY) {
        return prev.includes(EVERYTHING_CATEGORY_KEY) ? [] : [EVERYTHING_CATEGORY_KEY];
      }
      // If "Everything" was selected, clear it and select the specific category
      const newSelection = prev.includes(EVERYTHING_CATEGORY_KEY) ? [] : [...prev];
      
      if (newSelection.includes(category)) {
        return newSelection.filter(c => c !== category);
      } else {
        return [...newSelection, category];
      }
    });
  };


  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-sky-400 text-center mb-6">تنظیمات بازی ⚙️</h2> {/* Game Setup */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label=" تعداد بازیکنان     🧑    "  // Number of Players
            type="number"
            id="numPlayers"
            value={numPlayers}
            onChange={handlePlayerChange}
            min={MIN_PLAYERS}
            max={MAX_PLAYERS}
            error={errors.players}
            className="text-lg"
          />
          <Input
            label="تعداد جاسوس‌ها 👤" // Number of Spies
            type="number"
            id="numSpies"
            value={numSpies}
            onChange={handleSpyChange}
            min={1}
            max={numPlayers > 1 ? numPlayers -1 : 1}
            error={errors.spies}
            className="text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            دسته‌بندی کلمات 📚 (یک یا چند مورد انتخاب کنید) {/* Word Categories (select one or more) */}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-700 rounded-md">
            {allCategoryOptions.map(catKey => (
              <Checkbox
                key={catKey}
                id={`category-${catKey}`}
                label={catKey}
                checked={selectedCategories.includes(catKey)}
                onChange={() => handleCategoryChange(catKey)}
                disabled={catKey !== EVERYTHING_CATEGORY_KEY && selectedCategories.includes(EVERYTHING_CATEGORY_KEY)}
              />
            ))}
          </div>
          {errors.categories && <p className="mt-1 text-xs text-red-400">{errors.categories}</p>}
        </div>
        
        <Select
          label="مدت زمان تایمر ⏱️" // Timer Duration
          id="timerDuration"
          options={timerOptions}
          value={timerDurationMinutes}
          onChange={(e) => setTimerDurationMinutes(parseInt(e.target.value, 10))}
          className="text-lg"
        />
        
        <Checkbox
          label="نمایش دسته‌بندی به جاسوس؟ 🤫" // Show category to Spies?
          id="showCategoryToSpy"
          checked={showCategoryToSpy}
          onChange={(e) => setShowCategoryToSpy(e.target.checked)}
        />

        <Button onClick={handleStartGame} fullWidth size="lg" variant="primary" className="mt-8">
          شروع بازی جدید 🚀 {/* Start New Game */}
        </Button>
      </div>
    </div>
  );
};