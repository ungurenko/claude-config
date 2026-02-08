#!/bin/bash
REPO="$HOME/claude-config"
SKILLS_LOCAL="$HOME/.claude/skills"
SKILLS_REPO="$REPO/skills"

cd "$REPO" || exit 1

# 1. Найти реальные директории (не симлинки) в ~/.claude/skills/
for skill_dir in "$SKILLS_LOCAL"/*/; do
  skill_name=$(basename "$skill_dir")

  # Пропустить симлинки — они уже синхронизированы
  [ -L "${skill_dir%/}" ] && continue

  # Пропустить если это не директория со скиллом (нет .md файлов)
  ls "$skill_dir"/*.md >/dev/null 2>&1 || continue

  # Скопировать в репо (с обновлением)
  mkdir -p "$SKILLS_REPO/$skill_name"
  cp -R "$skill_dir"* "$SKILLS_REPO/$skill_name/"

  # Заменить реальную директорию на симлинк
  rm -rf "$skill_dir"
  ln -s "$SKILLS_REPO/$skill_name" "${skill_dir%/}"
done

# 2. Коммит и пуш если есть изменения
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "Auto-sync: обновление скиллов"
  git push origin main 2>/dev/null
fi

# 3. Пулл удалённых изменений
git pull --ff-only origin main 2>/dev/null
