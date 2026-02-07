#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[ -z "$FILE_PATH" ] && exit 0
[ ! -f "$FILE_PATH" ] && exit 0

# Только веб-файлы
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.css|*.json|*.md|*.html) ;;
  *) exit 0 ;;
esac

# Ищем prettier: сначала в проекте, потом глобально
if [ -f "node_modules/.bin/prettier" ]; then
  node_modules/.bin/prettier --write "$FILE_PATH" 2>/dev/null
elif command -v prettier &>/dev/null; then
  prettier --write "$FILE_PATH" 2>/dev/null
fi

exit 0
