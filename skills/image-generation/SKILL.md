---
name: image-generation
description: >
  Use when generating, creating, or drawing images and illustrations.
  Triggers on: "сгенерируй картинку", "нарисуй", "создай изображение",
  "сделай картинку", "generate image", "create image", "draw",
  "make a picture", "сгенерируй фото", "нарисуй мне",
  "generate a picture", "создай иллюстрацию", "make an illustration".
  Uses Kie.ai MCP tools for image generation.
---

# Image Generation (Kie.ai)

Генерация изображений через Kie.ai MCP. Следуй шагам последовательно.

## Workflow

### Шаг 1: Спросить параметры

Используй `AskUserQuestion` с вопросами:

**Вопрос 1 — Модель:**

```
question: "Какую модель использовать?"
header: "Model"
options:
  - label: "nano-banana-pro (Recommended)"
    description: "Лучшее качество, 2K/4K. ~18-24 кредита. Для серьёзных задач."
  - label: "gpt-image"
    description: "Быстрая генерация, хорошее качество. ~10 кредитов."
  - label: "z-image"
    description: "Самая дешёвая и быстрая. ~5 кредитов. Для тестов и черновиков."
```

**Вопрос 2 — Соотношение сторон:**

```
question: "Какое соотношение сторон?"
header: "Aspect ratio"
options:
  - label: "1:1 (Recommended)"
    description: "Квадрат. Аватарки, иконки, посты в соцсетях."
  - label: "16:9"
    description: "Горизонтальный. Баннеры, обложки, десктоп."
  - label: "9:16"
    description: "Вертикальный. Stories, Reels, мобильный контент."
  - label: "4:3"
    description: "Классический горизонтальный. Презентации, фото."
```

**Вопрос 3 — Дополнительные настройки (зависит от модели):**

- Если `nano-banana-pro`: спроси resolution — `2K` (default) или `4K`
- Если `gpt-image`: спроси quality — `medium` (default) или `high`
- Если `z-image`: дополнительных настроек нет, пропусти этот вопрос

### Шаг 2: Улучшить промпт

Перед генерацией улучши промпт пользователя:

1. **Перевести на английский** (если на русском или другом языке)
2. **Добавить детали**, которых не хватает:
   - Стиль (photorealistic, digital art, oil painting, watercolor, 3D render...)
   - Освещение (soft natural light, dramatic lighting, golden hour, studio lighting...)
   - Композиция (close-up, wide angle, bird's eye view, centered...)
   - Цветовая палитра (warm tones, cool blue palette, vibrant colors...)
   - Качество (highly detailed, 8K, professional photography, masterpiece...)
3. **Сохранить исходный смысл** — не менять идею пользователя, только обогащать

**Покажи пользователю улучшенный промпт перед генерацией:**

```
Исходный промпт: [оригинал]
Улучшенный промпт: [enhanced version]

Генерирую с параметрами: модель X, aspect_ratio Y, ...
```

### Шаг 3: Сгенерировать изображение

Вызови `mcp__kie-ai__generate_image` с параметрами:

```
prompt: [улучшенный промпт]
model: [выбранная модель]
aspect_ratio: [выбранное соотношение]
resolution: [только для nano-banana-pro: "2K" или "4K"]
quality: [только для gpt-image: "medium" или "high"]
```

Соответствие имён моделей для MCP:
- "nano-banana-pro" → `nano-banana-pro`
- "gpt-image" → `gpt-image/1.5-text-to-image`
- "z-image" → `z-image`

### Шаг 4: Показать результат

После генерации:

1. Покажи URL изображения (MCP возвращает ссылки)
2. Предложи следующие действия:
   - Сгенерировать ещё один вариант с тем же промптом
   - Изменить промпт и сгенерировать заново
   - Изменить модель или параметры

## Справочная таблица моделей

| Модель | MCP model ID | Кредиты | Скорость | Особенности |
|--------|-------------|---------|----------|-------------|
| nano-banana-pro | `nano-banana-pro` | 18-24 | Средняя | 2K/4K, лучшее качество |
| gpt-image | `gpt-image/1.5-text-to-image` | ~10 | Быстрая | medium/high quality |
| z-image | `z-image` | ~5 | Быстрая | Минимальная цена |

## Советы по промптам

**Хорошие промпты (конкретные, с деталями):**
- "A cozy coffee shop interior with warm lighting, wooden furniture, plants on shelves, morning sunlight through large windows, photorealistic"
- "Cyberpunk cityscape at night, neon signs reflecting on wet streets, flying cars, purple and blue color palette, cinematic wide angle"

**Плохие промпты (слишком общие):**
- "cat" — добавь стиль, позу, фон, освещение
- "beautiful landscape" — уточни место, время суток, погоду, стиль

**Формула:** `[subject] + [action/pose] + [environment] + [style] + [lighting] + [quality keywords]`

## Проверка баланса

Если генерация не удалась или нужно проверить остаток:

1. Вызови `mcp__kie-ai__check_credits`
2. Ответ содержит число кредитов напрямую (поле `data` — это число, не объект)
3. 1 кредит ~ $0.005
4. Сообщи пользователю остаток и сколько примерно генераций доступно

Если ошибка 402 — кредиты закончились, нужно пополнить на [kie.ai](https://kie.ai).
