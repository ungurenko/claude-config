---
name: timeweb-deploy
description: Use when deploying to TimeWeb App Platform - analyzes project stack, prepares configuration, guides through deployment with step-by-step instructions
---

# TimeWeb Deploy

## Триггеры
- "деплой на timeweb", "развернуть на таймвеб"
- "timeweb app platform", "подготовить к деплою"
- Любое упоминание timeweb + deploy/деплой

## Quick Reference

| Параметр | Значение |
|----------|----------|
| **Панель** | timeweb.cloud → Apps |
| **Репозитории** | GitHub, GitLab, Bitbucket, любой Git URL |
| **Тарифы** | От 100 ₽/мес |
| **Автодеплой** | По коммиту в выбранную ветку |

---

## Stack Detection

### Приоритет файлов
1. `package.json` → Node.js/Frontend
2. `requirements.txt` / `pyproject.toml` → Python
3. `composer.json` → PHP
4. `go.mod` → Go
5. `pom.xml` / `build.gradle` → Java
6. `*.csproj` → .NET
7. `mix.exs` → Elixir
8. `Dockerfile` → Docker (fallback)

### Node.js — Определение фреймворка

| Зависимость | Фреймворк | Тип |
|-------------|-----------|-----|
| `next` | Next.js | Frontend (SSR) |
| `nuxt` | Nuxt | Frontend (SSR) |
| `react` (без next) | React | Frontend (SPA) |
| `vue` (без nuxt) | Vue | Frontend (SPA) |
| `@angular/core` | Angular | Frontend (SPA) |
| `express` | Express | Backend |
| `fastify` | Fastify | Backend |
| `@nestjs/core` | Nest | Backend |
| `hapi` | Hapi | Backend |

### Python — Определение фреймворка

| Зависимость | Фреймворк |
|-------------|-----------|
| `django` | Django |
| `fastapi` | FastAPI |
| `flask` | Flask |
| `celery` | Celery (worker) |

---

## Configuration Templates

### Next.js

**package.json:**
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p ${PORT:-3000}"
  },
  "engines": { "node": ">=18" }
}
```

**next.config.js (для standalone):**
```javascript
module.exports = {
  output: 'standalone'
}
```

**Настройки TimeWeb:**
- Фреймворк: Next.js
- Build command: `npm run build`
- Start command: `npm start`
- Port: 3000

---

### React (Create React App / Vite)

**package.json:**
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview --port ${PORT:-3000}"
  }
}
```

**Настройки TimeWeb:**
- Фреймворк: React
- Build command: `npm run build`
- Output directory: `dist` или `build`

---

### Express / Node.js Backend

**package.json:**
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": { "node": ">=18" }
}
```

**Код — обязательно использовать PORT:**
```javascript
const port = process.env.PORT || 3000;
app.listen(port);
```

**Настройки TimeWeb:**
- Фреймворк: Express
- Start command: `npm start`
- Port: из process.env.PORT

---

### Django

**requirements.txt:**
```
Django>=4.2
gunicorn>=21.0.0
whitenoise>=6.0.0
psycopg2-binary>=2.9
```

**Procfile или Start command:**
```
gunicorn project_name.wsgi:application --bind 0.0.0.0:$PORT
```

**settings.py:**
```python
ALLOWED_HOSTS = ['*']  # или конкретный домен
STATIC_ROOT = BASE_DIR / 'staticfiles'
```

---

### FastAPI

**requirements.txt:**
```
fastapi>=0.100.0
uvicorn[standard]>=0.23.0
```

**Start command:**
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

### Docker (Universal Fallback)

**Dockerfile:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
```

**Требования:**
- EXPOSE указывает порт
- CMD запускает приложение
- Приложение слушает $PORT

---

## Pre-Deploy Checklist

### Обязательно
- [ ] Приложение слушает `process.env.PORT` (не hardcoded порт!)
- [ ] Build script работает локально: `npm run build`
- [ ] Start script запускает production-сервер
- [ ] `.gitignore` включает `node_modules`, `.env`, build артефакты
- [ ] Нет secrets в коде (используй env variables)

### Рекомендовано
- [ ] Healthcheck endpoint: `GET /health` → 200 OK
- [ ] `engines.node` в package.json указывает версию Node.js
- [ ] `.nvmrc` с версией Node.js
- [ ] Логирование ошибок (console.error в production)

### Для баз данных
- [ ] DATABASE_URL в переменных окружения
- [ ] Миграции запускаются при деплое или вручную
- [ ] Connection pooling настроен

---

## TimeWeb Panel: Пошаговый деплой

### Шаг 1: Создание приложения
1. Войдите в [timeweb.cloud](https://timeweb.cloud)
2. Перейдите: **Продукты** → **Apps**
3. Нажмите **Создать**
4. Выберите тип приложения:
   - Frontend Apps — для React, Vue, Angular, Next.js (static)
   - Backend Apps — для Express, Django, FastAPI, Next.js (SSR)
   - Docker — для кастомных решений

### Шаг 2: Подключение репозитория
1. Выберите провайдер: GitHub / GitLab / Bitbucket
2. Авторизуйтесь (при первом подключении)
3. Выберите репозиторий из списка
4. Выберите ветку для деплоя (обычно `main` или `master`)
5. **Автодеплой**: включите, если нужен деплой при каждом коммите

### Шаг 3: Настройка фреймворка
1. TimeWeb попытается определить фреймворк автоматически
2. Если определён неверно — выберите вручную:
   - Next.js / Nuxt / React / Vue / Angular (Frontend)
   - Express / Nest / Django / FastAPI (Backend)
   - Dockerfile (если нужен полный контроль)

### Шаг 4: Параметры сборки

| Поле | Описание | Пример |
|------|----------|--------|
| **Root Directory** | Папка с кодом (если не корень) | `frontend` |
| **Build Command** | Команда сборки | `npm run build` |
| **Start Command** | Команда запуска (для backend) | `npm start` |
| **Output Directory** | Папка со статикой (для frontend) | `dist`, `build`, `.next` |

### Шаг 5: Переменные окружения
1. Нажмите **Добавить переменную**
2. Добавьте все необходимые переменные:

| Переменная | Обязательность | Описание |
|------------|----------------|----------|
| `PORT` | Авто | TimeWeb устанавливает автоматически |
| `NODE_ENV` | Рекомендуется | `production` |
| `DATABASE_URL` | Если есть БД | Connection string |
| `SECRET_KEY` | Для Django | Секретный ключ |

### Шаг 6: Выбор тарифа

| Тариф | vCPU | RAM | Цена |
|-------|------|-----|------|
| Start | 1 | 512 MB | ~100 ₽/мес |
| Basic | 1 | 1 GB | ~200 ₽/мес |
| Standard | 2 | 2 GB | ~400 ₽/мес |
| Advanced | 4 | 4 GB | ~800 ₽/мес |

**Рекомендация:** Start достаточно для MVP, Basic для небольших проектов.

### Шаг 7: Запуск деплоя
1. Проверьте все настройки
2. Нажмите **Создать приложение**
3. Дождитесь завершения сборки (1-5 минут)
4. Получите URL вида: `your-app.tw1.ru`

### Шаг 8: Привязка домена (опционально)
1. В настройках приложения → **Домены**
2. Добавьте свой домен
3. Настройте DNS: CNAME → `your-app.tw1.ru`
4. SSL-сертификат выпустится автоматически

---

## Troubleshooting

| Проблема | Причина | Решение |
|----------|---------|---------|
| Build failed | Ошибка в зависимостях | Проверьте `npm ci` локально |
| App не запускается | Не слушает PORT | Используйте `process.env.PORT` |
| 502 Bad Gateway | Приложение упало | Проверьте логи, healthcheck |
| Timeout при старте | Долгая инициализация | Увеличьте startup timeout |
| Static files 404 | Неверный output dir | Проверьте путь к `dist`/`build` |
| Django static 404 | Не собрана статика | `python manage.py collectstatic` |
| CORS ошибки | Неверный origin | Добавьте домен TimeWeb в CORS |

### Просмотр логов
1. Панель TimeWeb → Приложение → **Логи**
2. Или через SSH (если включён)

---

## Workflow

При вызове скилла Claude Code выполняет:

### 1. Анализ проекта
- Читает package.json / requirements.txt / etc.
- Определяет фреймворк и тип (frontend/backend)
- Проверяет наличие Dockerfile

### 2. Проверка готовности
- Валидирует scripts в package.json
- Проверяет использование PORT
- Ищет healthcheck endpoint
- Выявляет недостающие настройки

### 3. Генерация рекомендаций
- Предлагает изменения в конфигурации
- Генерирует Dockerfile (если нужен)
- Составляет список env variables

### 4. Пошаговый гайд
- Показывает конкретные шаги в панели TimeWeb
- Указывает какие значения вводить
- Предупреждает о потенциальных проблемах

### 5. Post-deploy проверка
- Предлагает проверить URL
- Рекомендует протестировать основные endpoints
- Напоминает про мониторинг и логи

---

## Примеры использования

### Пользователь: "Деплой на TimeWeb"

**Claude Code выполняет:**

1. **Читает package.json** → определяет Next.js
2. **Проверяет:**
   - ✅ `npm run build` есть
   - ⚠️ `start` использует hardcoded port 3000
   - ❌ Нет `engines.node`
3. **Предлагает изменения:**
   ```json
   {
     "scripts": {
       "start": "next start -p ${PORT:-3000}"
     },
     "engines": { "node": ">=18" }
   }
   ```
4. **Показывает гайд** с конкретными настройками для TimeWeb
