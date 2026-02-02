/**
 * Секция программы курса
 *
 * Цель: Показать системность и путь к результату
 * Формат: Интерактивные раскрывающиеся списки (accordion)
 */

import { useState } from 'react';

interface ProgramModule {
  // Название модуля (результат, не процесс)
  title: string;
  // Результат модуля
  result: string;
  // Темы внутри модуля (3-5)
  topics: string[];
  // Длительность (опционально)
  duration?: string;
  // Бонусы модуля (опционально)
  bonus?: string;
}

interface ProgramSectionProps {
  // Заголовок секции
  title?: string;
  // Подзаголовок
  subtitle?: string;
  // Модули программы
  modules: ProgramModule[];
  // Общая длительность
  totalDuration?: string;
  // Количество уроков
  lessonsCount?: number;
  // Практических заданий
  practiceCount?: number;
}

export function ProgramSection({
  title = "Программа курса",
  subtitle,
  modules,
  totalDuration,
  lessonsCount,
  practiceCount,
}: ProgramSectionProps) {
  const [openModule, setOpenModule] = useState<number | null>(0);

  return (
    <section id="program" className="py-16 md:py-24 bg-slate-50">
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
          {(totalDuration || lessonsCount || practiceCount) && (
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {totalDuration && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{totalDuration}</div>
                  <div className="text-sm text-slate-500">длительность</div>
                </div>
              )}
              {lessonsCount && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{lessonsCount}+</div>
                  <div className="text-sm text-slate-500">уроков</div>
                </div>
              )}
              {practiceCount && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{practiceCount}</div>
                  <div className="text-sm text-slate-500">практических заданий</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accordion с модулями */}
        <div className="max-w-3xl mx-auto space-y-4">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              {/* Заголовок модуля */}
              <button
                onClick={() => setOpenModule(openModule === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {module.title}
                    </h3>
                    {module.duration && (
                      <span className="text-sm text-slate-500">{module.duration}</span>
                    )}
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${openModule === index ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Содержимое модуля */}
              {openModule === index && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                  {/* Результат модуля */}
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">
                      Результат: {module.result}
                    </span>
                  </div>

                  {/* Темы */}
                  <ul className="space-y-2">
                    {module.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start gap-3 text-slate-600">
                        <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Бонус */}
                  {module.bonus && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                      <span className="text-sm text-amber-800">
                        🎁 Бонус: {module.bonus}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Пример использования:
 *
 * <ProgramSection
 *   title="Программа курса"
 *   subtitle="8 модулей, которые проведут вас от точки А к результату"
 *   totalDuration="3 месяца"
 *   lessonsCount={45}
 *   practiceCount={20}
 *   modules={[
 *     {
 *       title: "Модуль 1: Фундамент системного маркетинга",
 *       result: "Понимание, как работает система привлечения клиентов",
 *       duration: "1 неделя",
 *       topics: [
 *         "Воронка продаж: как работает и как строить",
 *         "Анализ целевой аудитории: от портрета к инсайтам",
 *         "Конкурентный анализ: найти своё позиционирование",
 *         "Составление маркетинговой стратегии",
 *       ],
 *       bonus: "Шаблон маркетинговой стратегии"
 *     },
 *     {
 *       title: "Модуль 2: Первые клиенты за 2 недели",
 *       result: "Получите первых 3-5 клиентов по новой системе",
 *       duration: "2 недели",
 *       topics: [
 *         "Быстрый запуск: минимальный жизнеспособный маркетинг",
 *         "Лид-магниты, которые работают",
 *         "Простая воронка для быстрого старта",
 *         "Первые продажи без бюджета на рекламу",
 *       ]
 *     }
 *   ]}
 * />
 *
 * Анти-паттерны в названиях модулей:
 * ❌ "Модуль 3: Продажи" — непонятно что внутри
 * ❌ "Урок про контент" — процесс, не результат
 *
 * Правильно:
 * ✅ "Модуль 3: Первые клиенты за 2 недели" — результат
 * ✅ "Модуль 5: Автоматизация, которая работает 24/7" — выгода
 */
