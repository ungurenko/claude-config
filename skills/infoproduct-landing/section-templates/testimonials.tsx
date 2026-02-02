/**
 * Секция отзывов и социальных доказательств
 *
 * Видеоотзывы дают +34% конверсии vs текст
 * Структура отзыва: КТО → БЫЛО → СТАЛО (результат)
 */

interface Testimonial {
  // Имя
  name: string;
  // Роль/профессия
  role?: string;
  // Фото
  photo?: string;
  // Текст отзыва
  text: string;
  // Результат (до/после)
  result?: {
    before: string;
    after: string;
  };
  // Видео (если есть)
  video?: {
    url: string;
    thumbnail: string;
  };
  // Рейтинг (1-5)
  rating?: number;
}

interface TestimonialsSectionProps {
  // Заголовок
  title?: string;
  // Подзаголовок
  subtitle?: string;
  // Отзывы
  testimonials: Testimonial[];
  // Вариант отображения
  variant?: 'grid' | 'carousel' | 'featured';
  // Общая статистика
  stats?: {
    total: string;      // "2000+"
    avgRating: string;  // "4.9"
    successRate: string; // "94%"
  };
}

export function TestimonialsSection({
  title = "Что говорят выпускники",
  subtitle,
  testimonials,
  variant = 'grid',
  stats,
}: TestimonialsSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* Статистика */}
          {stats && (
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
                <div className="text-sm text-slate-500">выпускников</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-1">
                  {stats.avgRating}
                  <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <div className="text-sm text-slate-500">средний рейтинг</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">{stats.successRate}</div>
                <div className="text-sm text-slate-500">достигают результата</div>
              </div>
            </div>
          )}
        </div>

        {/* Отзывы */}
        {variant === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        )}

        {variant === 'featured' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {testimonials.map((testimonial, index) => (
              <FeaturedTestimonial key={index} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Карточка отзыва (для grid)
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Видео превью */}
      {testimonial.video && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-4 group cursor-pointer">
          <img
            src={testimonial.video.thumbnail}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Рейтинг */}
      {testimonial.rating && (
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < testimonial.rating! ? 'text-amber-400' : 'text-slate-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
        </div>
      )}

      {/* Текст */}
      <p className="text-slate-600 mb-4 line-clamp-4">
        "{testimonial.text}"
      </p>

      {/* Результат до/после */}
      {testimonial.result && (
        <div className="flex gap-2 mb-4 text-sm">
          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full">
            Было: {testimonial.result.before}
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full">
            Стало: {testimonial.result.after}
          </span>
        </div>
      )}

      {/* Автор */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        {testimonial.photo && (
          <img
            src={testimonial.photo}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-medium text-slate-900">{testimonial.name}</div>
          {testimonial.role && (
            <div className="text-sm text-slate-500">{testimonial.role}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Развёрнутый отзыв (для featured/высокий чек)
function FeaturedTestimonial({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <div className="grid md:grid-cols-2">
        {/* Видео/фото */}
        <div className="relative aspect-video md:aspect-auto">
          {testimonial.video ? (
            <>
              <img
                src={testimonial.video.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </>
          ) : testimonial.photo ? (
            <img
              src={testimonial.photo}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        {/* Контент */}
        <div className="p-8">
          {/* Результат */}
          {testimonial.result && (
            <div className="mb-6 p-4 bg-slate-50 rounded-xl">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Было</div>
                  <div className="text-xl font-bold text-red-600">{testimonial.result.before}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Стало</div>
                  <div className="text-xl font-bold text-green-600">{testimonial.result.after}</div>
                </div>
              </div>
            </div>
          )}

          {/* Текст */}
          <blockquote className="text-lg text-slate-700 leading-relaxed mb-6">
            "{testimonial.text}"
          </blockquote>

          {/* Автор */}
          <div className="flex items-center gap-4">
            {testimonial.photo && (
              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <div className="font-semibold text-slate-900">{testimonial.name}</div>
              {testimonial.role && (
                <div className="text-slate-500">{testimonial.role}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Пример использования (средний чек — много коротких):
 *
 * <TestimonialsSection
 *   title="2000+ выпускников уже изменили свою жизнь"
 *   variant="grid"
 *   stats={{
 *     total: "2000+",
 *     avgRating: "4.9",
 *     successRate: "94%"
 *   }}
 *   testimonials={[
 *     {
 *       name: "Мария К.",
 *       role: "Маркетолог",
 *       photo: "/testimonials/maria.jpg",
 *       text: "За 2 месяца вышла на доход 120К. Главное — это система, которую дают на курсе.",
 *       result: { before: "60К/мес", after: "120К/мес" },
 *       rating: 5,
 *     },
 *     // ... больше отзывов
 *   ]}
 * />
 *
 * Пример использования (высокий чек — развёрнутые кейсы):
 *
 * <TestimonialsSection
 *   title="Кейсы участников наставничества"
 *   variant="featured"
 *   testimonials={[
 *     {
 *       name: "Алексей Иванов",
 *       role: "Владелец digital-агентства",
 *       video: {
 *         url: "https://...",
 *         thumbnail: "/thumbnails/alexey.jpg"
 *       },
 *       text: "Пришёл с оборотом 500К, за 6 месяцев вышел на 3 млн. Ключевое — это системный подход к продажам и найму, который показала Анна.",
 *       result: { before: "500К/мес оборот", after: "3 млн/мес оборот" },
 *     },
 *   ]}
 * />
 *
 * Требования к видеоотзывам:
 * - До 90 секунд
 * - Вертикальный формат (9:16) для мобильных
 * - Структура: КТО → БЫЛО → СТАЛО
 */
