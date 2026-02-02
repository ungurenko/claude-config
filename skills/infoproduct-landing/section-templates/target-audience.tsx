/**
 * Секция "Для кого продукт"
 *
 * Цель: Посетитель должен узнать себя в одном из портретов
 * Формат: 3-4 портрета ЦА с конкретикой
 */

interface AudiencePortrait {
  // Название портрета (короткое)
  title: string;
  // Описание (конкретное, с цифрами если возможно)
  description: string;
  // Иконка или эмодзи
  icon?: React.ReactNode | string;
  // Дополнительные характеристики
  traits?: string[];
}

interface TargetAudienceSectionProps {
  // Заголовок секции
  title?: string;
  // Подзаголовок
  subtitle?: string;
  // Портреты ЦА (3-4 штуки)
  portraits: AudiencePortrait[];
  // "Не подойдёт если..." (опционально)
  notFor?: string[];
}

export function TargetAudienceSection({
  title = "Кому подойдёт программа",
  subtitle,
  portraits,
  notFor,
}: TargetAudienceSectionProps) {
  return (
    <section className="py-16 md:py-24">
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

        {/* Портреты ЦА */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {portraits.map((portrait, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Иконка */}
              {portrait.icon && (
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-2xl">
                  {typeof portrait.icon === 'string' ? portrait.icon : portrait.icon}
                </div>
              )}

              {/* Заголовок портрета */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {portrait.title}
              </h3>

              {/* Описание */}
              <p className="text-slate-600 mb-4">
                {portrait.description}
              </p>

              {/* Характеристики */}
              {portrait.traits && portrait.traits.length > 0 && (
                <ul className="space-y-2">
                  {portrait.traits.map((trait, traitIndex) => (
                    <li key={traitIndex} className="flex items-start gap-2 text-sm text-slate-500">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Не подойдёт если... */}
        {notFor && notFor.length > 0 && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
              Не подойдёт, если вы:
            </h3>
            <ul className="space-y-2">
              {notFor.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-500">
                  <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Пример использования:
 *
 * <TargetAudienceSection
 *   title="Для кого эта программа"
 *   subtitle="Узнай себя в одном из портретов"
 *   portraits={[
 *     {
 *       icon: "💼",
 *       title: "Маркетолог в найме",
 *       description: "Опыт 1-3 года, застрял на 80К/мес, хочешь вырасти до 150К+",
 *       traits: ["Уже работаешь в маркетинге", "Хочешь повысить доход", "Готов учиться"]
 *     },
 *     {
 *       icon: "🚀",
 *       title: "Фрилансер",
 *       description: "Есть клиенты, но нет системы. Доход нестабильный",
 *       traits: ["Работаешь на себя", "Хочешь масштабироваться", "Нужна система"]
 *     },
 *     {
 *       icon: "🏢",
 *       title: "Предприниматель",
 *       description: "Делаешь маркетинг сам, нет времени разбираться глубоко",
 *       traits: ["Свой бизнес", "Хочешь делегировать", "Нужны результаты"]
 *     },
 *     {
 *       icon: "🔄",
 *       title: "Меняешь профессию",
 *       description: "Хочешь войти в маркетинг с нуля и быстро начать зарабатывать",
 *       traits: ["Новичок в маркетинге", "Мотивирован учиться", "Готов к переменам"]
 *     }
 *   ]}
 *   notFor={[
 *     "Ищете волшебную таблетку без усилий",
 *     "Не готовы уделять 5-7 часов в неделю на обучение",
 *     "Хотите теорию без практики"
 *   ]}
 * />
 *
 * Анти-паттерны:
 * ❌ "Для всех, кто хочет развиваться" — слишком размыто
 * ❌ "Для людей" — бессмысленно
 *
 * Правильно:
 * ✅ Конкретная профессия/роль
 * ✅ Цифры (опыт, доход)
 * ✅ Конкретная ситуация
 */
