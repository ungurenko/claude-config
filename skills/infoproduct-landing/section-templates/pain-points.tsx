/**
 * Секция актуализации боли
 *
 * Цель: Эмпатия, не давление. Показать, что понимаешь ситуацию.
 * Формат: 3-5 пунктов "Знакомо?"
 */

interface PainPoint {
  // Текст боли от первого лица клиента
  text: string;
  // Опциональная иконка
  icon?: React.ReactNode;
}

interface PainPointsSectionProps {
  // Заголовок секции
  title?: string;
  // Подзаголовок
  subtitle?: string;
  // Список болей (3-5 штук)
  painPoints: PainPoint[];
  // Переход к решению
  transitionText?: string;
}

export function PainPointsSection({
  title = "Знакомо?",
  subtitle,
  painPoints,
  transitionText,
}: PainPointsSectionProps) {
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
        </div>

        {/* Список болей */}
        <div className="max-w-3xl mx-auto space-y-4">
          {painPoints.map((pain, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Иконка или чекбокс */}
              <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center mt-0.5">
                {pain.icon || (
                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Текст боли */}
              <p className="text-lg text-slate-700 leading-relaxed">
                {pain.text}
              </p>
            </div>
          ))}
        </div>

        {/* Переход к решению */}
        {transitionText && (
          <div className="mt-12 text-center">
            <p className="text-xl md:text-2xl font-medium text-slate-900">
              {transitionText}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Пример использования:
 *
 * <PainPointsSection
 *   title="Знакомо?"
 *   subtitle="Если хотя бы 2 пункта про вас — эта программа поможет"
 *   painPoints={[
 *     { text: "Вы проходите курсы, но не можете применить знания на практике" },
 *     { text: "Клиенты есть, но доход не растёт — не понимаете, что делать" },
 *     { text: "Работаете много, но результат не соответствует усилиям" },
 *     { text: "Не знаете, как выйти на следующий уровень дохода" },
 *     { text: "Устали от хаотичных действий без системы" },
 *   ]}
 *   transitionText="Всё это можно изменить за 3 месяца"
 * />
 *
 * Анти-паттерны (НЕ ДЕЛАТЬ):
 * ❌ "Вы неудачник без нашего курса" — давление
 * ❌ "Ваша жизнь ужасна" — негатив
 * ❌ "Вы ничего не умеете" — унижение
 *
 * Правильный тон:
 * ✅ Эмпатия: "Знакомо? Я тоже через это проходил"
 * ✅ Понимание: "Это нормально, когда..."
 * ✅ Надежда: "Это можно изменить"
 */
