import React from 'react';

export const RulesScreen: React.FC = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-3xl">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-sky-400 mb-6 text-center">قوانین بازی 📜</h2>
        <div className="space-y-4 text-slate-300">
          <section>
            <h3 className="text-xl font-semibold text-sky-300 mb-2">هدف بازی 🎯</h3>
            <p>
              <strong>برای غیر جاسوس‌ها (ماموران):</strong> شناسایی جاسوس/جاسوس‌ها در میان بازیکنان.
            </p>
            <p>
              <strong>برای جاسوس‌ها:</strong> خود را مخفی نگه دارید، شناسایی نشوید و سعی کنید کلمه/مکان مخفی که ماموران می‌دانند را حدس بزنید.
            </p>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold text-sky-300 mb-2">آماده‌سازی 🛠️</h3>
            <ol className="list-decimal list-inside space-y-1 pr-4">
              <li>تعداد بازیکنان و جاسوس‌ها را وارد کنید.</li>
              <li>یک یا چند دسته‌بندی کلمات را انتخاب کنید.</li>
              <li>مدت زمان تایمر برای بحث را تنظیم کنید.</li>
              <li>تصمیم بگیرید که آیا جاسوس‌ها باید دسته‌بندی را بدانند (اختیاری).</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-sky-300 mb-2">روند بازی 🔄</h3>
            <ol className="list-decimal list-inside space-y-1 pr-4">
              <li>بازیکنان دستگاه را به نوبت دست به دست می‌کنند. هر بازیکن به طور مخفیانه نقش خود را می‌بیند: یا مامور است و کلمه مخفی (و دسته‌بندی) را می‌بیند، یا جاسوس است.</li>
              <li>پس از اینکه همه نقش خود را دیدند، تایمر شروع می‌شود.</li>
              <li>بازیکنان به نوبت از یکدیگر سوال می‌پرسند. سوالات باید به گونه‌ای باشند که اگر مامور هستید، کلمه را لو ندهند، اما به اندازه کافی دقیق باشند تا دیگران را بیازمایند.</li>
              <li>جاسوس‌ها باید سعی کنند بدون دانستن کلمه، به سوالات به طور قانع‌کننده‌ای پاسخ دهند و سعی کنند کلمه را از سوالات و پاسخ‌های ماموران استنباط کنند.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-sky-300 mb-2">پایان دور و برنده شدن 🏆</h3>
            <ol className="list-decimal list-inside space-y-1 pr-4">
              <li>وقتی تایمر تمام می‌شود، بحث متوقف می‌شود. بازیکنان رای می‌دهند که به نظرشان چه کسی جاسوس/جاسوس‌ها است.</li>
              <li>
                <strong>ماموران برنده می‌شوند اگر:</strong> اکثریت بازیکنان به درستی یک جاسوس را شناسایی کنند. اگر چند جاسوس وجود داشته باشد، ممکن است به چند دور رای‌گیری نیاز داشته باشید یا قوانین خانگی برای این مورد تعیین کنید.
              </li>
              <li>
                <strong>جاسوس‌ها برنده می‌شوند اگر:</strong>
                <ul className="list-disc list-inside pr-6">
                    <li>یک جاسوس توسط رای اکثریت شناسایی نشود.</li>
                    <li>یک مامور به اشتباه توسط اکثریت متهم شود.</li>
                    <li>(قانون اختیاری) یک جاسوس کلمه مخفی را به درستی حدس بزند. این می‌تواند "آخرین شانس" برای یک جاسوس باشد اگر متهم شده باشد.</li>
                </ul>
              </li>
            </ol>
          </section>
           <section>
            <h3 className="text-xl font-semibold text-sky-300 mb-2">نکاتی برای ماموران 👍</h3>
            <ul className="list-disc list-inside space-y-1 pr-4">
              <li>سوالاتی بپرسید که مربوط به کلمه باشند اما خیلی واضح نباشند.</li>
              <li>به پاسخ‌های مبهم یا کسی که سعی در تغییر موضوع دارد توجه کنید.</li>
              <li>کلمه را به جاسوس لو ندهید!</li>
            </ul>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-sky-300 mb-2">نکاتی برای جاسوس‌ها 🤫</h3>
            <ul className="list-disc list-inside space-y-1 pr-4">
              <li>با دقت گوش دهید تا کلمه را از سوالات و پاسخ‌های دیگران استنباط کنید.</li>
              <li>پاسخ‌های کلی بدهید. با اعتماد به نفس رفتار کنید.</li>
              <li>اگر سوءظن به شما افتاد، سعی کنید شخص دیگری را متهم کنید.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};