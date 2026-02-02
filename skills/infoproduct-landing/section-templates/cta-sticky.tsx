/**
 * Sticky CTA для мобильных устройств
 *
 * Кнопка всегда видна при скролле
 * Touch-friendly: min 44×44 px
 */

import { useState, useEffect } from 'react';

interface StickyCTAProps {
  // Текст кнопки (от первого лица)
  text: string;
  // Ссылка
  href: string;
  // Цена (опционально)
  price?: {
    current: number;
    old?: number;
    currency?: string;
  };
  // Показывать только на мобильных
  mobileOnly?: boolean;
  // Показывать после скролла (в пикселях)
  showAfterScroll?: number;
  // Вариант стиля
  variant?: 'dark' | 'light' | 'gradient';
}

export function StickyCTA({
  text,
  href,
  price,
  mobileOnly = true,
  showAfterScroll = 400,
  variant = 'dark',
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  const variantStyles = {
    dark: 'bg-slate-900 text-white',
    light: 'bg-white text-slate-900 border-t border-slate-200',
    gradient: 'bg-gradient-to-r from-slate-900 to-slate-700 text-white',
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      } ${mobileOnly ? 'lg:hidden' : ''}`}
    >
      <div className={`px-4 py-3 ${variantStyles[variant]} safe-area-bottom`}>
        <div className="flex items-center justify-between gap-4">
          {/* Цена */}
          {price && (
            <div className="flex-shrink-0">
              <div className="flex items-baseline gap-2">
                {price.old && (
                  <span className="text-sm opacity-60 line-through">
                    {price.old.toLocaleString()}
                  </span>
                )}
                <span className="text-lg font-bold">
                  {price.current.toLocaleString()} {price.currency || '₽'}
                </span>
              </div>
            </div>
          )}

          {/* Кнопка */}
          <a
            href={href}
            className={`flex-1 ${price ? '' : 'w-full'} text-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] ${
              variant === 'light'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-900'
            }`}
            style={{ minHeight: '44px' }} // Touch-friendly
          >
            {text}
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Альтернативный вариант — плавающая кнопка
 */

interface FloatingCTAProps {
  text: string;
  href: string;
  showAfterScroll?: number;
}

export function FloatingCTA({
  text,
  href,
  showAfterScroll = 600,
}: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  return (
    <a
      href={href}
      className={`fixed bottom-6 right-6 z-50 px-6 py-4 bg-slate-900 text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:bg-slate-800 hover:scale-105 active:scale-95 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ minHeight: '44px', minWidth: '44px' }}
    >
      {text}
    </a>
  );
}

/**
 * Пример использования:
 *
 * // Sticky bar внизу экрана (мобильные)
 * <StickyCTA
 *   text="Хочу на курс"
 *   href="#pricing"
 *   price={{ current: 29900, old: 39900 }}
 *   variant="dark"
 *   showAfterScroll={500}
 * />
 *
 * // Плавающая кнопка (десктоп)
 * <FloatingCTA
 *   text="Записаться"
 *   href="#pricing"
 *   showAfterScroll={800}
 * />
 *
 * Важно:
 * - Минимальный размер кнопки 44×44 px для touch
 * - Показывать после первого экрана (showAfterScroll)
 * - CTA от первого лица: "Хочу научиться" > "Записаться"
 *
 * CSS для safe-area (добавить в глобальные стили):
 *
 * .safe-area-bottom {
 *   padding-bottom: env(safe-area-inset-bottom, 0);
 * }
 */
