# Claude Code Config

Мои настройки для Claude Code: глобальные инструкции, кастомные скиллы и агенты.

## Установка

```bash
git clone https://github.com/ungurenko/claude-config.git ~/claude-config
cd ~/claude-config
chmod +x install.sh
./install.sh
```

## Обновление

```bash
cd ~/claude-config
git pull
# Симлинки автоматически используют новые версии файлов
```

## Содержимое

### Основные файлы

| Файл | Назначение |
|------|------------|
| `CLAUDE.md` | Глобальные инструкции для всех проектов |
| `agent.md` | Правила общения и поведения |

### Skills

| Скилл | Назначение |
|-------|------------|
| **kie-ai** | Интеграция с Kie.ai API (генерация изображений/видео/музыки) |
| **polza-ai** | Интеграция с Polza.ai API (OpenAI-совместимый агрегатор) |

### Agents

| Агент | Назначение |
|-------|------------|
| **backend-architect** | Проектирование API и бэкенд архитектуры |
| **database-optimization** | Оптимизация БД и запросов |
| **debugger** | Системная отладка и анализ ошибок |

## Workflow

### Изменил настройки — запушил:

```bash
cd ~/claude-config
git add .
git commit -m "Update: описание изменений"
git push
```

### На другом компьютере — подтянул:

```bash
cd ~/claude-config
git pull
# Симлинки автоматически видят новые версии
```

## Проверка установки

```bash
# Проверить что симлинки созданы
ls -la ~/.claude/CLAUDE.md
# Должно показать: CLAUDE.md -> /Users/.../claude-config/CLAUDE.md

# Запустить Claude Code и проверить что инструкции работают
claude
```
