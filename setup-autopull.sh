#!/bin/bash
# Скрипт установки автопулла claude-config на macOS
# Запусти на втором компьютере: bash ~/claude-config/setup-autopull.sh

REPO_DIR="$HOME/claude-config"
SCRIPT_PATH="$REPO_DIR/autopull.sh"
PLIST_PATH="$HOME/Library/LaunchAgents/com.claude-config.autopull.plist"

# Проверяем что репо существует
if [ ! -d "$REPO_DIR/.git" ]; then
    echo "❌ Репо не найдено. Сначала выполни:"
    echo "   git clone https://github.com/ungurenko/claude-config.git ~/claude-config"
    exit 1
fi

# Проверяем симлинк
if [ ! -L "$HOME/.claude/CLAUDE.md" ]; then
    echo "📎 Создаю симлинк ~/.claude/CLAUDE.md → ~/claude-config/CLAUDE.md"
    mkdir -p "$HOME/.claude"
    ln -sf "$REPO_DIR/CLAUDE.md" "$HOME/.claude/CLAUDE.md"
fi

# Создаём скрипт автопулла
cat > "$SCRIPT_PATH" << 'PULLSCRIPT'
#!/bin/bash
cd "$HOME/claude-config" || exit 1
git pull --ff-only origin main 2>/dev/null
PULLSCRIPT
chmod +x "$SCRIPT_PATH"

# Создаём LaunchAgent (каждые 5 минут)
cat > "$PLIST_PATH" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.claude-config.autopull</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>${REPO_DIR}/autopull.sh</string>
    </array>
    <key>StartInterval</key>
    <integer>300</integer>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/claude-config-autopull.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/claude-config-autopull.log</string>
</dict>
</plist>
PLIST

# Загружаем агент
launchctl unload "$PLIST_PATH" 2>/dev/null
launchctl load "$PLIST_PATH"

echo "✅ Автопулл настроен! claude-config будет обновляться каждые 5 минут."
echo "   Лог: /tmp/claude-config-autopull.log"
echo "   Отключить: launchctl unload $PLIST_PATH"
