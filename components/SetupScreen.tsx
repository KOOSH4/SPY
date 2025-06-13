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
  const initialCategories = Object.keys(WORD_CATEGORIES).length > 0 ? [Object.keys(WORD_CATEGORIES)[0]] : [];
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [timerDurationMinutes, setTimerDurationMinutes] = useState<number>(DEFAULT_TIMER_MINUTES);
  const [customWord, setCustomWord] = useState<string>('');
  
  const [errors, setErrors] = useState<{ players?: string; spies?: string; categories?: string; customWord?: string }>({});

  const categoryKeys = Object.keys(WORD_CATEGORIES);
  const allCategoryOptions = [...categoryKeys, EVERYTHING_CATEGORY_KEY]; 

  const timerOptions = TIMER_INCREMENT_OPTIONS.map(min => ({ value: min, label: `${min} دقیقه ⏱️` }));

  const validateSettings = useCallback(() => {
    const newErrors: { players?: string; spies?: string; categories?: string; customWord?: string } = {};
    if (numPlayers < MIN_PLAYERS || numPlayers > MAX_PLAYERS) {
      newErrors.players = `تعداد بازیکنان باید بین ${MIN_PLAYERS} و ${MAX_PLAYERS} باشد.`;
    }
    if (numSpies < 1) {
      newErrors.spies = 'حداقل باید 1 جاسوس وجود داشته باشد.';
    } else if (numSpies >= numPlayers) {
      newErrors.spies = 'تعداد جاسوس‌ها باید کمتر از کل بازیکنان باشد.';
    }

    if (customWord.trim() === '' && selectedCategories.length === 0) {
      newErrors.categories = 'حداقل یک دسته‌بندی انتخاب کنید، یا یک کلمه سفارشی وارد نمایید.';
    }
    if (customWord.trim() !== '' && customWord.trim().length < 2) { // Example validation for custom word
        newErrors.customWord = 'کلمه سفارشی باید حداقل ۲ حرف داشته باشد.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [numPlayers, numSpies, selectedCategories, customWord]);

  useEffect(() => {
    validateSettings();
  }, [numPlayers, numSpies, selectedCategories, customWord, validateSettings]);

  const handleStartGame = () => {
    if (validateSettings()) {
      onStartGame({
        numPlayers,
        numSpies,
        showCategoryToSpy,
        selectedCategories: customWord.trim() !== '' ? [] : selectedCategories,
        timerDuration: timerDurationMinutes * 60,
        customWord: customWord.trim() !== '' ? customWord.trim() : undefined,
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

  const handleCustomWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomWord(value);
    if (value.trim() !== '') {
      setSelectedCategories([]); // Clear categories if custom word is being typed
      if (errors.categories) { // Clear category error if custom word is now valid
        setErrors(prev => ({...prev, categories: undefined}));
      }
    }
  };

  const handleCategoryChange = (category: string) => {
    if (customWord.trim() !== '') return; // Don't change categories if custom word is set

    setSelectedCategories(prev => {
      if (category === EVERYTHING_CATEGORY_KEY) {
        return prev.includes(EVERYTHING_CATEGORY_KEY) ? [] : [EVERYTHING_CATEGORY_KEY];
      }
      const newSelection = prev.includes(EVERYTHING_CATEGORY_KEY) ? [] : [...prev];
      
      if (newSelection.includes(category)) {
        return newSelection.filter(c => c !== category);
      } else {
        return [...newSelection, category];
      }
    });
  };

  const isCustomWordActive = customWord.trim() !== '';

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-sky-400 text-center mb-6">تنظیمات بازی ⚙️</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label=" تعداد بازیکنان     🧑    "
            type="number"
            id="numPlayers"
            value={numPlayers}
            onChange={handlePlayerChange}
            min={MIN_PLAYERS}
            max={MAX_PLAYERS}
            error={errors.players}
            className="text-lg"
            aria-describedby={errors.players ? "numPlayers-error" : undefined}
          />
          <Input
            label="تعداد جاسوس‌ها 👤"
            type="number"
            id="numSpies"
            value={numSpies}
            onChange={handleSpyChange}
            min={1}
            max={numPlayers > 1 ? numPlayers -1 : 1}
            error={errors.spies}
            className="text-lg"
            aria-describedby={errors.spies ? "numSpies-error" : undefined}
          />
        </div>

        <Input
          label="کلمه سفارشی (اختیاری) 📝"
          type="text"
          id="customWord"
          value={customWord}
          onChange={handleCustomWordChange}
          placeholder="مثلا: درخت کریسمس"
          error={errors.customWord}
          className="text-lg"
          aria-describedby={errors.customWord ? "customWord-error" : undefined}
        />
        {isCustomWordActive && (
            <p className="text-xs text-sky-300 mt-1">کلمه سفارشی استفاده خواهد شد. انتخاب دسته‌بندی غیرفعال است.</p>
        )}


        <div>
          <label className={`block text-sm font-medium mb-2 ${isCustomWordActive ? 'text-slate-500' : 'text-slate-300'}`}>
            دسته‌بندی کلمات 📚 (یک یا چند مورد انتخاب کنید)
          </label>
          <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-700 rounded-md ${isCustomWordActive ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {allCategoryOptions.map(catKey => (
              <Checkbox
                key={catKey}
                id={`category-${catKey}`}
                label={catKey}
                checked={selectedCategories.includes(catKey)}
                onChange={() => handleCategoryChange(catKey)}
                disabled={isCustomWordActive || (catKey !== EVERYTHING_CATEGORY_KEY && selectedCategories.includes(EVERYTHING_CATEGORY_KEY))}
                className={isCustomWordActive ? 'cursor-not-allowed' : ''}
              />
            ))}
          </div>
          {errors.categories && <p id="categories-error" className="mt-1 text-xs text-red-400">{errors.categories}</p>}
        </div>
        
        <Select
          label="مدت زمان تایمر ⏱️"
          id="timerDuration"
          options={timerOptions}
          value={timerDurationMinutes}
          onChange={(e) => setTimerDurationMinutes(parseInt(e.target.value, 10))}
          className="text-lg"
        />
        
        <Checkbox
          label="نمایش دسته‌بندی به جاسوس؟ 🤫"
          id="showCategoryToSpy"
          checked={showCategoryToSpy}
          onChange={(e) => setShowCategoryToSpy(e.target.checked)}
        />

        <Button onClick={handleStartGame} fullWidth size="lg" variant="primary" className="mt-8">
          شروع بازی جدید 🚀
        </Button>
      </div>
    </div>
  );
};