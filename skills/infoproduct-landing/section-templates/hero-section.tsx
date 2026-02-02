/**
 * Hero-секция для лендинга инфопродукта
 *
 * Цель: За 3 секунды показать ЧТО, ДЛЯ КОГО, КАКОЙ РЕЗУЛЬТАТ
 * Формула заголовка: [Результат] + [для кого] + [за счёт чего]
 */

interface HeroSectionProps {
  // Заголовок по формуле: результат + для кого + за счёт чего
  headline: string;
  // Подзаголовок: 1-2 предложения усиления
  subheadline: string;
  // CTA текст (от первого лица: "Хочу научиться")
  ctaText: string;
  ctaHref: string;
  // Мини социальное доказательство
  socialProof?: {
    text: string; // "2000+ выпускников"
    icon?: React.ReactNode;
  };
  // Медиа: видео или изображение
  media?: {
    type: 'video' | 'image';
    src: string;
    alt?: string;
    poster?: string; // для видео
  };
  // Дополнительный CTA (вторичный)
  secondaryCta?: {
    text: string;
    href: string;
  };
}

export function HeroSection({
  headline,
  subheadline,
  ctaText,
  ctaHref,
  socialProof,
  media,
  secondaryCta,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Фоновый градиент или изображение */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 -z-10" />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Контент */}
          <div className="space-y-8">
            {/* Социальное доказательство (мини) */}
            {socialProof && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-slate-200 text-sm text-slate-600">
                {socialProof.icon}
                <span>{socialProof.text}</span>
              </div>
            )}

            {/* Заголовок */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              {headline}
            </h1>

            {/* Подзаголовок */}
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-xl">
              {subheadline}
            </p>

            {/* CTA кнопки */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {ctaText}
              </a>

              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-900 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-200"
                >
                  {secondaryCta.text}
                </a>
              )}
            </div>
          </div>

          {/* Медиа */}
          {media && (
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl">
              {media.type === 'video' ? (
                <video
                  src={media.src}
                  poster={media.poster}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={media.src}
                  alt={media.alt || ''}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Пример использования:
 *
 * <HeroSection
 *   headline="Выйди на доход 150К+/мес в маркетинге за 3 месяца через системный подход к клиентам"
 *   subheadline="Пошаговая программа для маркетологов, которые хотят вырасти в доходе, но не знают как выстроить систему привлечения клиентов"
 *   ctaText="Хочу научиться"
 *   ctaHref="#pricing"
 *   socialProof={{
 *     text: "2000+ выпускников",
 *     icon: <UsersIcon className="w-4 h-4" />
 *   }}
 *   media={{
 *     type: 'image',
 *     src: '/images/hero-expert.jpg',
 *     alt: 'Эксперт курса'
 *   }}
 *   secondaryCta={{
 *     text: "Смотреть программу",
 *     href: "#program"
 *   }}
 * />
 */
