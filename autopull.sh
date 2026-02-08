#!/bin/bash
cd "$HOME/claude-config" || exit 1
git pull --ff-only origin main 2>/dev/null
