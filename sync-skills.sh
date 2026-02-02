#!/bin/bash
# Sync skills from claude-config to ~/.claude/skills/
# Creates symlinks for any skills that don't exist yet

SOURCE_DIR="$HOME/claude-config/skills"
TARGET_DIR="$HOME/.claude/skills"

# Ensure target directory exists
mkdir -p "$TARGET_DIR"

# Count for reporting
created=0
skipped=0

# Iterate through all directories in source
for skill_path in "$SOURCE_DIR"/*/; do
    # Get skill name (directory name)
    skill_name=$(basename "$skill_path")

    # Skip if not a directory
    [ ! -d "$skill_path" ] && continue

    # Check if symlink or directory already exists in target
    if [ -e "$TARGET_DIR/$skill_name" ] || [ -L "$TARGET_DIR/$skill_name" ]; then
        ((skipped++))
    else
        # Create symlink
        ln -s "$skill_path" "$TARGET_DIR/$skill_name"
        echo "Created symlink: $skill_name"
        ((created++))
    fi
done

# Report
if [ $created -gt 0 ]; then
    echo "Synced $created new skill(s)"
else
    echo "All skills already synced ($skipped existing)"
fi
