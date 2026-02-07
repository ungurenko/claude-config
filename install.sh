#!/bin/bash
# install.sh - создаёт симлинки для Claude Code настроек

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "📁 Claude Config Installer"
echo "=========================="
echo "Source: $SCRIPT_DIR"
echo "Target: $CLAUDE_DIR"
echo ""

# Создать ~/.claude если не существует
mkdir -p "$CLAUDE_DIR/skills" "$CLAUDE_DIR/agents"

# Функция для создания симлинка с бэкапом
link_file() {
    local src="$1"
    local dest="$2"

    if [ -L "$dest" ]; then
        rm "$dest"
        echo "♻️  Replaced symlink: $dest"
    elif [ -e "$dest" ]; then
        mv "$dest" "$dest.backup"
        echo "💾 Backup: $dest → $dest.backup"
    fi

    ln -s "$src" "$dest"
    echo "🔗 Linked: $(basename "$dest") → $src"
}

echo "Creating symlinks..."
echo ""

# Симлинки для файлов
link_file "$SCRIPT_DIR/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
link_file "$SCRIPT_DIR/agent.md" "$CLAUDE_DIR/agent.md"
link_file "$SCRIPT_DIR/technical-rules.md" "$CLAUDE_DIR/technical-rules.md"

# Симлинки для skills (целые директории)
link_file "$SCRIPT_DIR/skills/kie-ai" "$CLAUDE_DIR/skills/kie-ai"
link_file "$SCRIPT_DIR/skills/polza-ai" "$CLAUDE_DIR/skills/polza-ai"

# Симлинки для agents
link_file "$SCRIPT_DIR/agents/backend-architect.md" "$CLAUDE_DIR/agents/backend-architect.md"
link_file "$SCRIPT_DIR/agents/database-optimization.md" "$CLAUDE_DIR/agents/database-optimization.md"
link_file "$SCRIPT_DIR/agents/debugger.md" "$CLAUDE_DIR/agents/debugger.md"

echo ""
echo "✅ Установка завершена!"
echo ""
echo "Перезапустите Claude Code для применения настроек."
echo "Проверка: ls -la ~/.claude/CLAUDE.md"
