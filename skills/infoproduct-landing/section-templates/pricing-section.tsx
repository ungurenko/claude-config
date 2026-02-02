/**
 * Секция тарифов и цен
 *
 * Прозрачность = доверие
 * Рассрочки увеличивают продажи в 3-5 раз
 */

interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingTier {
  // Название тарифа (ценностное, не "Базовый")
  name: string;
  // Подзаголовок
  subtitle?: string;
  // Цена
  price: number;
  // Старая цена (если скидка)
  oldPrice?: number;
  // Валюта
  currency?: string;
  // Период (если подписка)
  period?: string;
  // Рассрочка
  installment?: {
    price: number;
    months: number;
    provider?: string; // "Тинькофф", "Долями"
  };
  // Что входит
  features: PricingFeature[];
  // CTA
  cta: {
    text: string;
    href: string;
  };
  // Популярный?
  popular?: boolean;
  // Бонусы
  bonuses?: string[];
  // Ограничение мест (реальное!)
  spotsLeft?: number;
}

interface PricingSectionProps {
  // Заголовок
  title?: string;
  // Подзаголовок
  subtitle?: string;
  // Тарифы
  tiers: PricingTier[];
  // Дедлайн (только реальный!)
  deadline?: {
    text: string;
    date: Date;
  };
  // Гарантия
  guarantee?: {
    text: string;
    details?: string;
  };
  // Способы оплаты
  paymentMethods?: string[];
}

export function PricingSection({
  title = "Выберите тариф",
  subtitle,
  tiers,
  deadline,
  guarantee,
  paymentMethods,
}: PricingSectionProps) {
  return (
    <section id="pricing" className="py-16 md:py-24">
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

          {/* Дедлайн (только реальный!) */}
          {deadline && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-800 rounded-full text-sm font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {deadline.text}
            </div>
          )}
        </div>

        {/* Тарифы */}
        <div className={`grid gap-6 max-w-5xl mx-auto ${
          tiers.length === 1 ? 'max-w-md' :
          tiers.length === 2 ? 'md:grid-cols-2 max-w-3xl' :
          'md:grid-cols-3'
        }`}>
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border-2 overflow-hidden ${
                tier.popular
                  ? 'border-slate-900 shadow-xl scale-105'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              {/* Популярный бейдж */}
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Популярный
                </div>
              )}

              <div className="p-6">
                {/* Название и описание */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                  {tier.subtitle && (
                    <p className="text-slate-500 text-sm mt-1">{tier.subtitle}</p>
                  )}
                </div>

                {/* Цена */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    {tier.oldPrice && (
                      <span className="text-lg text-slate-400 line-through">
                        {tier.oldPrice.toLocaleString()} {tier.currency || '₽'}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-slate-900">
                      {tier.price.toLocaleString()}
                    </span>
                    <span className="text-slate-500">
                      {tier.currency || '₽'}
                      {tier.period && `/${tier.period}`}
                    </span>
                  </div>

                  {/* Рассрочка */}
                  {tier.installment && (
                    <div className="mt-2 text-sm text-slate-600">
                      или{' '}
                      <span className="font-semibold text-slate-900">
                        {tier.installment.price.toLocaleString()} ₽/мес
                      </span>
                      {' '}× {tier.installment.months} мес
                      {tier.installment.provider && (
                        <span className="text-slate-400"> ({tier.installment.provider})</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Ограничение мест */}
                {tier.spotsLeft !== undefined && tier.spotsLeft > 0 && tier.spotsLeft <= 10 && (
                  <div className="mb-4 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                    Осталось {tier.spotsLeft} {pluralize(tier.spotsLeft, 'место', 'места', 'мест')}
                  </div>
                )}

                {/* Что входит */}
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className={`flex items-start gap-3 ${
                        feature.included ? 'text-slate-700' : 'text-slate-400'
                      } ${feature.highlight ? 'font-medium' : ''}`}
                    >
                      {feature.included ? (
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Бонусы */}
                {tier.bonuses && tier.bonuses.length > 0 && (
                  <div className="mb-6 p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm font-medium text-amber-800 mb-2">🎁 Бонусы:</div>
                    <ul className="space-y-1">
                      {tier.bonuses.map((bonus, bonusIndex) => (
                        <li key={bonusIndex} className="text-sm text-amber-700">
                          + {bonus}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <a
                  href={tier.cta.href}
                  className={`block w-full text-center px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                    tier.popular
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {tier.cta.text}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Гарантия */}
        {guarantee && (
          <div className="mt-12 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-green-50 rounded-xl">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="text-left">
                <div className="font-semibold text-green-800">{guarantee.text}</div>
                {guarantee.details && (
                  <div className="text-sm text-green-600">{guarantee.details}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Способы оплаты */}
        {paymentMethods && paymentMethods.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-500">
            Способы оплаты: {paymentMethods.join(' • ')}
          </div>
        )}
      </div>
    </section>
  );
}

// Склонение числительных
function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

/**
 * Пример использования:
 *
 * <PricingSection
 *   title="Выберите подходящий тариф"
 *   subtitle="Все тарифы включают доступ к материалам навсегда"
 *   deadline={{
 *     text: "Цены действуют до 15 февраля",
 *     date: new Date('2026-02-15')
 *   }}
 *   guarantee={{
 *     text: "Гарантия возврата 14 дней",
 *     details: "Если программа не подойдёт — вернём 100% оплаты"
 *   }}
 *   paymentMethods={["Карта", "СБП", "Тинькофф Рассрочка", "Долями"]}
 *   tiers={[
 *     {
 *       name: "Самостоятельный",
 *       subtitle: "Для тех, кто готов учиться сам",
 *       price: 29900,
 *       oldPrice: 39900,
 *       installment: { price: 2492, months: 12 },
 *       features: [
 *         { text: "Доступ ко всем урокам", included: true },
 *         { text: "Рабочие материалы и шаблоны", included: true },
 *         { text: "Чат с участниками", included: true },
 *         { text: "Проверка домашних заданий", included: false },
 *         { text: "Личные консультации", included: false },
 *       ],
 *       cta: { text: "Выбрать тариф", href: "/checkout/self" }
 *     },
 *     {
 *       name: "С куратором",
 *       subtitle: "Обратная связь и поддержка",
 *       price: 49900,
 *       oldPrice: 69900,
 *       installment: { price: 4158, months: 12, provider: "Тинькофф" },
 *       popular: true,
 *       features: [
 *         { text: "Всё из тарифа 'Самостоятельный'", included: true, highlight: true },
 *         { text: "Проверка домашних заданий", included: true },
 *         { text: "Еженедельные Q&A сессии", included: true },
 *         { text: "Личные консультации", included: false },
 *       ],
 *       bonuses: ["Разбор вашего проекта на вебинаре"],
 *       cta: { text: "Выбрать тариф", href: "/checkout/curator" }
 *     },
 *     {
 *       name: "VIP",
 *       subtitle: "Максимум внимания и результат",
 *       price: 99900,
 *       installment: { price: 8325, months: 12 },
 *       spotsLeft: 5,
 *       features: [
 *         { text: "Всё из тарифа 'С куратором'", included: true, highlight: true },
 *         { text: "3 личные консультации с экспертом", included: true },
 *         { text: "Приоритетная поддержка", included: true },
 *         { text: "Доступ к закрытому клубу выпускников", included: true },
 *       ],
 *       bonuses: ["Аудит вашего проекта", "Годовой доступ к обновлениям"],
 *       cta: { text: "Забронировать место", href: "/checkout/vip" }
 *     }
 *   ]}
 * />
 *
 * ВАЖНО:
 * - spotsLeft показывать только если реально ограничено
 * - deadline только с реальной датой
 * - Фейковые ограничения убивают доверие НАВСЕГДА
 */
