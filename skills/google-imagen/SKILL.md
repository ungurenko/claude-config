---
name: google-imagen
description: >
  Use when generating images with Google Gemini model.
  Triggers on: "gemini image", "google image", "gemini картинка",
  "сгенерируй через gemini", "google сгенерируй", "nano banana",
  "gemini generate image", "gemini нарисуй".
  Uses Google Gemini API via google-imagen MCP server.
---

# Image Generation (Google Gemini)

Генерация изображений через Google Gemini API (модель gemini-2.0-flash-preview-image-generation). Синхронный API — результат за 10-30 секунд.

## Workflow

### Шаг 1: Улучшить промпт

Перед генерацией улучши промпт:

1. **Перевести на английский** (если на русском или другом языке)
2. **Применить шаблон:** полные предложения (Natural Language), НЕ теги через запятую
3. **Шаблон:**
```
Create a [type: photo/illustration/painting] of [subject with details], [doing what/action],
in/on [setting/location], shot from [camera angle]. The style is [style], with [lighting].
[Constraints: no text, no watermark, etc.]
```
4. **Добавить недостающие детали:** стиль, освещение, композиция, цвета, качество
5. **Aspect ratio / resolution** — указывай прямо в промпте (напр. "wide landscape 16:9", "square format", "vertical portrait 9:16")
6. **Сохранить исходный смысл** — не менять идею пользователя, только обогащать

**Покажи пользователю улучшенный промпт перед генерацией:**

```
Исходный промпт: [оригинал]
Улучшенный промпт: [enhanced version]

Генерирую через Google Gemini...
```

### Шаг 2: Сгенерировать изображение

Вызови `mcp__google-imagen__generate_image_google` с параметром:

```
prompt: [улучшенный промпт на английском]
```

Параметров aspect_ratio, resolution, model **нет** — всё указывается в тексте промпта.

### Шаг 3: Показать результат

После генерации:

1. Картинка отобразится inline (если < 700KB) — Claude увидит её
2. Файл сохранён в `/tmp/claude-images/UUID.png`
3. Предложи следующие действия:
   - Сгенерировать ещё один вариант
   - Изменить промпт и сгенерировать заново
   - Использовать изображение в проекте (указать путь)

## Особенности

| Параметр | Значение |
|----------|----------|
| Модель | gemini-2.0-flash-preview-image-generation |
| Стоимость | ~$0.13 за изображение |
| Скорость | 10-30 сек (синхронный) |
| Rate limit | 10 запросов/минуту |
| Формат | PNG |
| Aspect ratio | Указывать в промпте |
| Resolution | Указывать в промпте |

## Обработка ошибок

| Код | Причина | Решение |
|-----|---------|---------|
| 400 | Prompt нарушает content policy | Переформулировать промпт |
| 401 | Невалидный API ключ | Проверить GOOGLE_API_KEY |
| 403 | Нет доступа к модели | Включить Gemini API в Google AI Studio |
| 429 | Rate limit (10 req/min) | Подождать минуту |
| No image in response | Модель вернула текст вместо картинки | Сделать промпт более визуальным |

## Гайд по промптам

### Принципы (аналогично nano-banana-pro через kie.ai)

- **Каждое слово = что-то видимое.** "beautiful" и "interesting" модели не понимают — заменяй на конкретику
- **Формула:** Subject + Scene/Setting + Composition + Lighting + Style + Constraints
- **Длина:** оптимально 30-75 слов
- **Негативные ограничения:** "no watermark", "no text", "no blurry elements"

### 5 основ промпта

1. Subject — кто/что (с деталями внешности, одежды, материалов)
2. Composition — ракурс, кадрирование (close-up, wide shot, overhead)
3. Action — что происходит (standing, running, floating)
4. Location — где (конкретное место, не "красивый фон")
5. Visual style — стиль (photorealistic, cel-shaded, oil painting)

### Пример

```
Create a photorealistic image of a Japanese ramen shop at night, seen through a rain-covered
window. Inside, a chef in white uniform prepares noodles under warm pendant lights. Steam rises
from bowls on the counter. The street outside reflects neon signs in puddles. Shot from street
level, shallow depth of field. No text, no watermark.
```
