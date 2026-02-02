/**
 * Блок эксперта
 *
 * Цель: Доверие через экспертность и личность
 * Элементы: живое фото, цифры достижений, история, регалии
 */

interface Achievement {
  // Цифра
  value: string;
  // Описание
  label: string;
}

interface ExpertSectionProps {
  // Имя эксперта
  name: string;
  // Роль/титул
  role: string;
  // Фото (живое, не студийный глянец)
  photo: string;
  // Краткая история (2-3 предложения — путь)
  story: string;
  // Достижения с цифрами
  achievements: Achievement[];
  // Регалии (опционально)
  credentials?: string[];
  // Социальные сети (опционально)
  socials?: {
    platform: 'telegram' | 'instagram' | 'youtube' | 'linkedin';
    url: string;
    followers?: string;
  }[];
  // Цитата эксперта (опционально)
  quote?: string;
}

export function ExpertSection({
  name,
  role,
  photo,
  story,
  achievements,
  credentials,
  socials,
  quote,
}: ExpertSectionProps) {
  const socialIcons = {
    telegram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.07-.78 4.18-1.82 6.97-3.02 8.38-3.61 3.99-1.66 4.82-1.95 5.36-1.96.12 0 .38.03.55.18.14.12.18.28.2.45-.01.06.01.24 0 .38z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Фото */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={photo}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Декоративный элемент */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-900 rounded-2xl -z-10" />
            </div>

            {/* Контент */}
            <div className="space-y-6">
              {/* Имя и роль */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {name}
                </h2>
                <p className="text-lg text-slate-600">{role}</p>
              </div>

              {/* История */}
              <p className="text-lg text-slate-700 leading-relaxed">
                {story}
              </p>

              {/* Достижения */}
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl md:text-3xl font-bold text-slate-900">
                      {achievement.value}
                    </div>
                    <div className="text-sm text-slate-500">
                      {achievement.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Регалии */}
              {credentials && credentials.length > 0 && (
                <ul className="space-y-2">
                  {credentials.map((credential, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span>{credential}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Социальные сети */}
              {socials && socials.length > 0 && (
                <div className="flex gap-3">
                  {socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      {socialIcons[social.platform]}
                      {social.followers && (
                        <span className="text-sm text-slate-600">{social.followers}</span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Цитата */}
          {quote && (
            <blockquote className="mt-12 p-8 bg-slate-50 rounded-2xl border-l-4 border-slate-900">
              <p className="text-xl md:text-2xl text-slate-700 italic leading-relaxed">
                "{quote}"
              </p>
              <footer className="mt-4 text-slate-500">— {name}</footer>
            </blockquote>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Пример использования:
 *
 * <ExpertSection
 *   name="Анна Петрова"
 *   role="Маркетолог, основатель агентства Digital Growth"
 *   photo="/images/expert-anna.jpg"
 *   story="Начинала как SMM-щик за 30К. Через 3 года запустила агентство с оборотом 5 млн/мес. Теперь помогаю маркетологам выстроить систему, которая работает без выгорания."
 *   achievements={[
 *     { value: "50+", label: "онлайн-школ запущено" },
 *     { value: "10 млн+", label: "оборот клиентов/мес" },
 *     { value: "2000+", label: "выпускников" },
 *     { value: "8 лет", label: "в маркетинге" },
 *   ]}
 *   credentials={[
 *     "Сертифицированный специалист Google Ads",
 *     "Спикер конференции Marketing Week 2024",
 *     "Автор курса-бестселлера на Skillbox",
 *   ]}
 *   socials={[
 *     { platform: 'telegram', url: 'https://t.me/anna_marketing', followers: '15K' },
 *     { platform: 'instagram', url: 'https://instagram.com/anna_marketing', followers: '50K' },
 *   ]}
 *   quote="Маркетинг — это не про креатив. Это про систему, которая приносит деньги предсказуемо."
 * />
 *
 * Анти-паттерны:
 * ❌ "Эксперт в области маркетинга" — пусто
 * ❌ Глянцевое студийное фото — не вызывает доверия
 * ❌ Без цифр и конкретики
 *
 * Правильно:
 * ✅ Конкретные цифры достижений
 * ✅ Живое фото (не сток)
 * ✅ История пути (было → стало)
 */
