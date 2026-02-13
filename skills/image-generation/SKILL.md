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
  - label: "Gemini (Google) (Recommended)"
    description: "Прямой доступ через Google API. Быстро (~10-30 сек), ~$0.13/img. Без посредника."
  - label: "nano-banana-pro (Kie.ai)"
    description: "Лучшее качество, 2K/4K. ~18-24 кредита. Через Kie.ai."
  - label: "gpt-image (Kie.ai)"
    description: "Быстрая генерация, хорошее качество. ~10 кредитов."
  - label: "z-image (Kie.ai)"
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

Перед генерацией улучши промпт, учитывая особенности выбранной модели (см. "Гайд по промптам" ниже).

1. **Перевести на английский** (если на русском или другом языке)
2. **Применить модель-специфичный шаблон:**
   - **nano-banana-pro:** полные предложения, не теги. Шаблон: `"Create a [type] of [subject], [doing what], in [setting], shot from [camera angle]. The style is [style], with [lighting]. [Constraints]"`
   - **gpt-image:** формула subject + scene + style + camera + lighting + constraints. Обязательно добавляй негативные ограничения (no extra fingers, no blurry text)
   - **z-image:** NLP-стиль, каждое слово должно описывать что-то видимое. Шаблон: `"[Subject + Details] + [Action/Pose] + [Setting] + [Lighting] + [Style] + [Technical specs]"`
3. **Добавить недостающие детали** из чеклиста: стиль, освещение, композиция, цвета, качество
4. **Сохранить исходный смысл** — не менять идею пользователя, только обогащать

**Покажи пользователю улучшенный промпт перед генерацией:**

```
Исходный промпт: [оригинал]
Улучшенный промпт: [enhanced version]

Генерирую с параметрами: модель X, aspect_ratio Y, ...
```

### Шаг 3: Сгенерировать изображение

**Если выбран Gemini (Google):**

Вызови `mcp__google-imagen__generate_image_google` с параметром:

```
prompt: [улучшенный промпт на английском]
```

Aspect ratio и resolution указываются прямо в тексте промпта (напр. "wide landscape 16:9").

**Если выбрана модель Kie.ai (nano-banana-pro / gpt-image / z-image):**

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

| Модель | MCP инструмент | Стоимость | Скорость | Особенности |
|--------|---------------|-----------|----------|-------------|
| **Gemini (Google)** | `mcp__google-imagen__generate_image_google` | ~$0.13 | 10-30 сек | Прямой API, без посредника, inline результат |
| nano-banana-pro | `mcp__kie-ai__generate_image` | 18-24 кр | Средняя | 2K/4K, лучшее качество (через Kie.ai) |
| gpt-image | `mcp__kie-ai__generate_image` | ~10 кр | Быстрая | medium/high quality (через Kie.ai) |
| z-image | `mcp__kie-ai__generate_image` | ~5 кр | Быстрая | Минимальная цена (через Kie.ai) |

## Гайд по промптам

### Общие принципы (все модели)

- **Каждое слово = что-то видимое.** "beautiful" и "interesting" модели не понимают — заменяй на конкретику
- **Формула:** Subject + Scene/Setting + Composition + Lighting + Style + Constraints
- **Чеклист обогащения:** стиль, освещение, ракурс, цветовая палитра, материалы/текстуры, время суток, настроение
- **Негативные ограничения:** всегда указывай, чего НЕ должно быть — "no watermark", "no text", "no blurry elements"
- **Длина:** оптимально 30–75 слов. Слишком короткий → модель додумает. Слишком длинный → модель потеряет фокус

### nano-banana-pro

**Стиль промпта:** полные предложения (Natural Language), НЕ теги через запятую.

**Шаблон:**
```
Create a [type: photo/illustration/painting] of [subject with details], [doing what/action],
in/on [setting/location], shot from [camera angle]. The style is [style], with [lighting].
[Constraints: no text, no watermark, etc.]
```

**5 основ промпта:**
1. Subject — кто/что (с деталями внешности, одежды, материалов)
2. Composition — ракурс, кадрирование (close-up, wide shot, overhead)
3. Action — что происходит (standing, running, floating)
4. Location — где (конкретное место, не "красивый фон")
5. Visual style — стиль (photorealistic, cel-shaded, oil painting)

**Дополнительно:** camera angle, lighting type, materials/textures, level of realism.

**Сильные стороны:** сложные сцены с множеством объектов, текст на изображениях, инфографики, визуальные рассуждения.

**Пример:**
```
Create a photorealistic image of a Japanese ramen shop at night, seen through a rain-covered
window. Inside, a chef in white uniform prepares noodles under warm pendant lights. Steam rises
from bowls on the counter. The street outside reflects neon signs in puddles. Shot from street
level, shallow depth of field. No text, no watermark.
```

### gpt-image

**Стиль промпта:** формула subject + scene + style + camera + lighting + output specs.

**Шаблон:**
```
[Subject with details] + [scene/environment] + [artistic style] + [camera/composition] +
[lighting] + [output constraints]
```

**Обязательно добавляй негативы** — блокируй типичные артефакты:
- Анатомия: "no extra fingers, no distorted hands, correct human proportions"
- Текст: "no blurry text, sharp readable typography" (если есть текст)
- Края: "clean edges, no artifacts, no warped shapes"

**Consistency для серий:** добавляй style block — "consistent flat illustration style, same color palette across images, unified line weight".

**Сильные стороны:** маркетинговые материалы, продуктовые фото, иллюстрации, редактирование существующих изображений.

**Checklist после генерации:** проверь анатомию, типографику, края объектов, компрессию.

**Пример:**
```
A flat vector illustration of a young woman working at a standing desk in a modern home office.
Minimalist Scandinavian interior with plants and warm wood tones. Soft diffused natural light
from a large window. Clean graphic style with limited color palette: white, sage green, warm
beige. No extra fingers, correct proportions, clean edges, no watermark.
```

### z-image

**Стиль промпта:** NLP (Natural Language Processing), НЕ tag soup. Каждое слово должно описывать что-то видимое.

**Шаблон:**
```
[Subject + физические детали] + [Action/Pose] + [Setting/Environment] +
[Lighting] + [Style] + [Technical specs]
```

**Принцип конкретности:**
- "beautiful woman" → "woman with high cheekbones, full lips, dark curly hair past shoulders"
- "nice clothes" → "tailored navy wool peacoat with brass buttons, white silk blouse"
- "good lighting" → "golden hour side lighting with long shadows"

**Технические детали** усиливают реализм: "shot on Sony A7IV, 35mm lens, f/1.8, shallow depth of field".

**Сильные стороны:** фотореализм, высокая скорость, минимальная цена. Лучший выбор для быстрых тестов и черновиков.

**Constraints:** "no watermark, no humans, centered composition, white background".

**Пример:**
```
A weathered fisherman in his 60s with deep sun lines and a grey wool beanie, mending a net
on a wooden dock. Early morning fog over a calm harbor, fishing boats in background. Cool
blue-grey tones with warm highlights on hands and face. Shot on medium format camera, 80mm
lens, shallow depth of field. No watermark, no text.
```

### Визуальный словарь (быстрые подсказки)

| Категория | Варианты |
|-----------|----------|
| **Стили** | photorealistic, digital art, oil painting, watercolor, 3D render, flat vector, cel-shaded, pencil sketch, pixel art, anime |
| **Освещение** | golden hour, blue hour, studio softbox, dramatic side light, neon glow, candlelight, overcast diffused, backlit silhouette |
| **Композиция** | close-up, medium shot, wide angle, bird's eye view, worm's eye view, rule of thirds, centered, over-the-shoulder |
| **Цвета** | warm earth tones, cool blue palette, vibrant saturated, pastel muted, monochrome, complementary contrast, analogous harmony |
| **Настроение** | serene, dramatic, mysterious, playful, melancholic, energetic, cozy, ethereal |

## Проверка баланса

Если генерация не удалась или нужно проверить остаток:

1. Вызови `mcp__kie-ai__check_credits`
2. Ответ содержит число кредитов напрямую (поле `data` — это число, не объект)
3. 1 кредит ~ $0.005
4. Сообщи пользователю остаток и сколько примерно генераций доступно

Если ошибка 402 — кредиты закончились, нужно пополнить на [kie.ai](https://kie.ai).
