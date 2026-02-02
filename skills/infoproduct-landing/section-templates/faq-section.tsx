/**
 * Секция FAQ
 *
 * Цель: Снять страхи и возражения
 * Формат: Accordion (раскрывающиеся ответы)
 */

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  // Категория для группировки (опционально)
  category?: string;
}

interface FAQSectionProps {
  // Заголовок
  title?: string;
  // Подзаголовок
  subtitle?: string;
  // Вопросы
  items: FAQItem[];
  // Контакт для дополнительных вопросов
  contact?: {
    text: string;
    link: string;
    linkText: string;
  };
}

export function FAQSection({
  title = "Часто задаваемые вопросы",
  subtitle,
  items,
  contact,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

        {/* Вопросы */}
        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-slate-900 pr-4">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-slate-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Контакт для доп. вопросов */}
        {contact && (
          <div className="mt-12 text-center">
            <p className="text-slate-600">
              {contact.text}{' '}
              <a
                href={contact.link}
                className="text-slate-900 font-medium underline hover:no-underline"
              >
                {contact.linkText}
              </a>
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
 * <FAQSection
 *   title="Ответы на частые вопросы"
 *   subtitle="Не нашли ответ? Напишите нам"
 *   contact={{
 *     text: "Остались вопросы?",
 *     link: "https://t.me/support",
 *     linkText: "Напишите в Telegram"
 *   }}
 *   items={[
 *     {
 *       question: "Подойдёт ли мне, если я новичок?",
 *       answer: "Да, программа подходит для начинающих. Мы начинаем с базовых понятий и постепенно переходим к продвинутым техникам. Главное — выделять время на обучение и выполнять практические задания."
 *     },
 *     {
 *       question: "Сколько времени нужно уделять обучению?",
 *       answer: "Рекомендуем выделять 5-7 часов в неделю: 2-3 часа на просмотр уроков и 3-4 часа на практику. При таком темпе вы пройдёте программу за 3 месяца и получите результат."
 *     },
 *     {
 *       question: "Что если не получится или не понравится?",
 *       answer: "Мы даём гарантию возврата 14 дней. Если в течение 2 недель вы поймёте, что программа вам не подходит — вернём 100% оплаты без вопросов."
 *     },
 *     {
 *       question: "Как проходит обучение?",
 *       answer: "Обучение проходит на онлайн-платформе. Вы получаете доступ к видеоурокам, рабочим материалам и чату с участниками. Уроки открываются по расписанию или все сразу (зависит от тарифа). Смотреть можно в любое удобное время."
 *     },
 *     {
 *       question: "Есть ли рассрочка?",
 *       answer: "Да, вы можете оплатить в рассрочку через Тинькофф или Долями. Рассрочка без переплаты на 3, 6 или 12 месяцев. Также можно разбить оплату на 2-3 платежа напрямую."
 *     },
 *     {
 *       question: "Как долго будет доступ к материалам?",
 *       answer: "Доступ к материалам курса остаётся навсегда. Вы сможете пересматривать уроки, возвращаться к практическим заданиям и использовать шаблоны в любое время."
 *     },
 *     {
 *       question: "Выдаётся ли сертификат?",
 *       answer: "Да, после успешного прохождения программы и выполнения всех практических заданий вы получите именной сертификат, который можно добавить в портфолио и LinkedIn."
 *     }
 *   ]}
 * />
 *
 * Обязательные вопросы для FAQ инфопродукта:
 * 1. "Подойдёт ли мне, если я новичок/опытный?"
 * 2. "Сколько времени нужно уделять?"
 * 3. "Что если не получится?"
 * 4. "Как проходит обучение?"
 * 5. "Есть ли рассрочка?"
 */
