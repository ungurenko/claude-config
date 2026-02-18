---
name: publish-news
description: Генерирует новость для ленты студентов из git-истории и публикует в БД. Используй когда пользователь говорит "/publish-news", "опубликовать новость", "новость для студентов".
---

# Publish News — Публикация новости из git-истории

## Алгоритм

### 1. Собрать git-историю

```bash
git log --oneline --since="7 days ago"
git log --stat -10 --no-merges
```

### 2. Проверить последние новости в БД (чтобы не дублировать)

```bash
node -e "
const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: 'postgresql://gen_user:MkKoNHutAX2Y%40E@5536e7cf4e31035978aa2f37.twc1.net:5432/vibes_platform' });
  await c.connect();
  const { rows } = await c.query('SELECT id, title, description, created_at FROM platform_updates WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 3');
  console.log(JSON.stringify(rows, null, 2));
  await c.end();
})().catch(console.error);
"
```

### 3. Сгруппировать изменения по категориям

| Паттерн файлов | Категория |
|----------------|-----------|
| `views/`, `components/` | UI-изменения для студентов |
| `api/content.ts` | Новый контент |
| `api/tools.ts` | AI-инструменты |
| `database/migrations/` | Структурные изменения |

### 4. Сгенерировать черновик

- **Заголовок:** до 80 символов
- **Описание:** 2-5 предложений
- **Тон:** дружелюбный, живой, для начинающих разработчиков
- **Фокус:** польза для студента, не технические детали

**Шаблоны:**
- «Добавлены новые...»
- «Теперь вы можете...»
- «Стало удобнее...»

**Запрещено:**
- Технические термины (файлы, SQL, архитектура)
- Баги — пиши «улучшили стабильность», не «исправили баг в X»

### 5. Показать пользователю для одобрения

Используй `AskUserQuestion`:
- **Опубликовать** — вставить в БД как есть
- **Изменить** — пользователь вводит правки, повторяешь
- **Отмена** — не публиковать

### 6. Опубликовать в БД

```bash
node -e "
const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: 'postgresql://gen_user:MkKoNHutAX2Y%40E@5536e7cf4e31035978aa2f37.twc1.net:5432/vibes_platform' });
  await c.connect();
  const { rows } = await c.query(
    'INSERT INTO platform_updates (title, description) VALUES (\$1, \$2) RETURNING id, title, created_at',
    ['ЗАГОЛОВОК', 'ОПИСАНИЕ']
  );
  console.log('Published:', JSON.stringify(rows[0]));
  await c.end();
})().catch(console.error);
"
```

Замени `ЗАГОЛОВОК` и `ОПИСАНИЕ` на одобренный текст.

### 7. Подтвердить

Покажи пользователю:
- ID записи
- Заголовок
- Сообщение: «Новость опубликована и появится в ленте студентов»
