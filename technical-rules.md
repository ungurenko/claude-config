# Технические правила (справочник)

Этот файл содержит подробные технические правила и примеры кода.
Обращайся к нему при работе с соответствующими технологиями.

---

## Vercel + Vite: Избегай bracket-синтаксис

При `framework: "vite"` роуты `[param].ts` могут не работать (405).

**Решение — URL parsing:**
```typescript
// api/auth.ts (без brackets)
const endpoint = url.pathname.split('/').filter(Boolean).pop();
switch (endpoint) {
  case 'login': return handleLogin(req, res);
  case 'register': return handleRegister(req, res);
}
```

```json
// vercel.json
{ "rewrites": [{ "source": "/api/auth/:path*", "destination": "/api/auth" }] }
```

---

## Express.js: req.query read-only

```javascript
// ❌ Object.assign(req.query, params) — не работает
// ✅ Object.defineProperty(req, 'query', { value: {...req.query, ...params} })
```

---

## Лимиты платформ

- **Vercel Hobby:** 12 serverless функций
- **Vercel Pro:** без лимита
- **Netlify Free:** 125k функций/месяц

---

## HTTP заголовки: только ASCII

```typescript
// ❌ headers: { 'X-Title': 'Суть.' }  — crash на сервере (код символа > 255)
// ✅ headers: { 'X-Title': 'Sut App' }  — только ASCII
```

---

## LLM JSON ответы: очищай markdown

LLM часто возвращают JSON в markdown-обёртке: ` ```json {...} ``` `

```typescript
let clean = content.trim();
if (clean.startsWith('```json')) clean = clean.slice(7);
if (clean.startsWith('```')) clean = clean.slice(3);
if (clean.endsWith('```')) clean = clean.slice(0, -3);
const result = JSON.parse(clean.trim());
```

---

## LLM инструкции: не позволяй клиенту переопределять формат

Клиентский config не должен полностью заменять системные инструкции — критические части (формат JSON ответа) должны быть обязательными.

```typescript
// ❌ const instruction = config?.instruction || defaultInstruction;
// ✅ const instruction = `${config?.instruction || baseInstruction}\n\n${REQUIRED_FORMAT}`;
```

---

## Авторизация: fetchWithAuth

Передавай токены во ВСЕХ компонентах (админ, пользователь, публичные).

```typescript
// fetchWithAuth.ts
export async function fetchWithAuthGet(url: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (res.status === 401) window.dispatchEvent(new CustomEvent('auth:expired'));
  return res.json();
}
```

---

## Интеграция с внешними сервисами

**Чеклист ДО деплоя:**
- [ ] Проверил типы через Context7
- [ ] Добавил env variables (локально + production)
- [ ] Добавил логирование ошибок

```typescript
try {
  const result = await externalAPI.call();
} catch (error) {
  console.error('API error:', { service: 'X', error: error.message });
  return res.status(500).json({ error: error.message });
}
```
