import React from 'react';
import { MIN_PLAYERS } from '../constants'; // Ensure this path is correct

interface FaqItemProps {
  question: string;
  children: React.ReactNode;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, children }) => (
  <div className="py-3">
    <h3 className="text-lg font-semibold text-sky-300 mb-1">{question}</h3>
    <div className="text-slate-300 pr-2">{children}</div> {/* Added pr-2 for RTL text indent */}
  </div>
);

export const FaqScreen: React.FC = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-3xl">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-sky-400 mb-6 text-center">سوالات متداول ❓</h2>
        <div className="space-y-3 divide-y divide-slate-700">
          <FaqItem question="حداقل تعداد بازیکنان چقدر است؟">
            <p>بازی برای لذت‌بخش بودن حداقل به {MIN_PLAYERS} بازیکن نیاز دارد (مثلاً ۲ مامور و ۱ جاسوس).</p>
          </FaqItem>
          <FaqItem question="با چند جاسوس بازی کنیم؟">
            <p>معمولاً ۱ جاسوس برای ۳-۵ بازیکن و ۲ جاسوس برای ۶-۸ بازیکن تعادل خوبی است. می‌توانید این را در تنظیمات تغییر دهید. بازی تا یک جاسوس کمتر از تعداد کل بازیکنان را پشتیبانی می‌کند، اما به تعادل بازی توجه داشته باشید.</p>
          </FaqItem>
          <FaqItem question="اگر جاسوس کلمه را درست حدس بزند چه اتفاقی می‌افتد؟">
            <p>به طور سنتی، اگر جاسوسی متهم شود اما سپس کلمه مخفی را به درستی حدس بزند، جاسوس (یا جاسوس‌ها) برنده می‌شوند. می‌توانید تصمیم بگیرید که آیا می‌خواهید با این قانون بازی کنید.</p>
          </FaqItem>
          <FaqItem question="اگر نتوانیم تصمیم بگیریم جاسوس کیست چه؟">
            <p>اگر رای اکثریت واضحی وجود نداشته باشد، می‌توانید یک دور کوتاه دیگر بحث و رای‌گیری مجدد داشته باشید، یا جاسوس‌ها به دلیل عدم تصمیم‌گیری ماموران به طور پیش‌فرض برنده می‌شوند.</p>
          </FaqItem>
          <FaqItem question="آیا جاسوس‌ها باید دسته‌بندی را بدانند؟">
            <p>این یک گزینه در تنظیمات است. اگر جاسوس‌ها دسته‌بندی را بدانند، کارشان کمی آسان‌تر می‌شود. برای چالش سخت‌تر برای جاسوس‌ها، این گزینه را خاموش کنید.</p>
          </FaqItem>
           <FaqItem question="آیا می‌توانیم کلمات یا دسته‌بندی‌های خودمان را اضافه کنیم؟">
            <p>در حال حاضر، این برنامه وب از مجموعه‌ای از کلمات و دسته‌بندی‌های از پیش تعریف‌شده استفاده می‌کند. سفارشی‌سازی ممکن است در نسخه‌های آینده یک ویژگی باشد.</p>
          </FaqItem>
        </div>
      </div>
    </div>
  );
};