import React from 'react';
import { WORD_CATEGORIES, EVERYTHING_CATEGORY_KEY } from '../constants';

export const WordListScreen: React.FC = () => {
  const categories = Object.keys(WORD_CATEGORIES);
  const allWords = new Set<string>();
  categories.forEach(cat => {
    WORD_CATEGORIES[cat].forEach(word => allWords.add(word));
  });
  const totalUniqueWords = allWords.size;

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-sky-400 mb-6 text-center">فهرست کلمات بازی 📖</h2>
        
        <div className="mb-6 p-4 bg-slate-700 rounded-lg shadow">
          <p className="text-lg text-slate-200">
            تعداد کل دسته‌بندی‌ها (بدون احتساب همه‌چیز): <span className="font-semibold text-sky-300">{categories.length}</span>
          </p>
          <p className="text-lg text-slate-200">
            تعداد کل کلمات منحصر به فرد: <span className="font-semibold text-sky-300">{totalUniqueWords}</span>
          </p>
        </div>

        <div className="space-y-6">
          {categories.map(categoryName => (
            <section key={categoryName} aria-labelledby={`category-title-${categoryName}`}>
              <h3 
                id={`category-title-${categoryName}`}
                className="text-xl font-semibold text-sky-300 mb-2 border-b border-slate-700 pb-1"
              >
                {categoryName} (تعداد: {WORD_CATEGORIES[categoryName].length} کلمه)
              </h3>
              {WORD_CATEGORIES[categoryName].length > 0 ? (
                <ul className="list-none p-0 columns-2 sm:columns-3 md:columns-4 gap-x-6 text-slate-300 text-sm">
                  {WORD_CATEGORIES[categoryName].map(word => (
                    <li key={word} className="mb-1 p-1 bg-slate-700/50 rounded-md break-words">{word}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">کلمه‌ای در این دسته‌بندی وجود ندارد.</p>
              )}
            </section>
          ))}

          <section aria-labelledby="category-title-everything">
             <h3 
                id="category-title-everything"
                className="text-xl font-semibold text-sky-300 mb-2 border-b border-slate-700 pb-1"
              >
                {EVERYTHING_CATEGORY_KEY} (تعداد: {totalUniqueWords} کلمه)
              </h3>
              <p className="text-slate-300 text-sm">
                این دسته‌بندی شامل تمام کلمات منحصر به فرد از سایر دسته‌بندی‌های موجود در بازی می‌باشد.
              </p>
          </section>
        </div>
      </div>
    </div>
  );
};