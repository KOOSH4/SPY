import React from 'react';
import { Page } from '../types';
import { APP_TITLE } from '../constants';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
  currentPage: Page;
}

export const Header: React.FC<HeaderProps> = ({ setCurrentPage, currentPage }) => {
  const navItems = [
    { label: 'تنظیمات بازی ⚙️', page: Page.SETUP },       // Game Setup
    { label: 'فهرست کلمات 📖', page: Page.WORD_LIST }, // Word List
    { label: 'قوانین 📜', page: Page.RULES },             // Rules
    { label: 'سوالات متداول ❓', page: Page.FAQ },         // FAQ
  ];

  return (
    <header className="bg-slate-800 shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 
          className="text-2xl font-bold text-sky-400 cursor-pointer"
          onClick={() => setCurrentPage(Page.SETUP)}
          aria-label="بازگشت به تنظیمات بازی" // Go back to game setup
        >
          {APP_TITLE}
        </h1>
        <nav aria-label="منوی اصلی"> {/* Main menu */}
          <ul className="flex space-x-4 rtl:space-x-reverse"> {/* Added rtl:space-x-reverse for RTL */}
            {navItems.map(item => (
              <li key={item.page}>
                <button
                  onClick={() => setCurrentPage(item.page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${currentPage === item.page 
                      ? 'bg-sky-500 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  aria-current={currentPage === item.page ? 'page' : undefined}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};