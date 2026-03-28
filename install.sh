#!/usr/bin/env sh
# install.sh — pm-kit installer
# Installs pm-kit Claude Code commands and templates into the current directory.
#
# Usage:
#   curl -sSL https://raw.githubusercontent.com/ehud-am/pm-kit/main/install.sh | sh
#   sh install.sh
#   ./install.sh

set -e

BASE_URL="https://raw.githubusercontent.com/ehud-am/pm-kit/main"

# --help
if [ "${1}" = "--help" ]; then
  printf "pm-kit installer\n\n"
  printf "Installs pm-kit Claude Code commands and templates into the current directory.\n\n"
  printf "Usage:\n"
  printf "  curl -sSL https://raw.githubusercontent.com/ehud-am/pm-kit/main/install.sh | sh\n"
  printf "  sh install.sh\n\n"
  printf "What it installs:\n"
  printf "  .claude/commands/pm-domain.md\n"
  printf "  .claude/commands/pm-press.md\n"
  printf "  .claude/commands/pm-faq.md\n"
  printf "  .claude/commands/pm-align.md\n"
  printf "  .product/templates/domain-template.md\n"
  printf "  .product/templates/press-template.md\n"
  printf "  .product/templates/faq-template.md\n"
  printf "  .product/templates/requirements-template.md\n"
  exit 0
fi

# Detect download tool
if command -v curl > /dev/null 2>&1; then
  DOWNLOAD_CMD="curl -sSL"
elif command -v wget > /dev/null 2>&1; then
  DOWNLOAD_CMD="wget -qO-"
else
  printf "Error: curl and wget are both unavailable. Install curl and try again.\n" >&2
  exit 1
fi

# download_file <url> <dest>
download_file() {
  url="$1"
  dest="$2"
  if ! $DOWNLOAD_CMD "$url" > "$dest"; then
    printf "Error: failed to download %s\n" "$url" >&2
    exit 1
  fi
  printf "  \342\234\223 %s\n" "$dest"
}

# Create directories
mkdir -p .claude/commands
mkdir -p .product/templates

# Install commands
printf "Installing pm-kit commands...\n\n"
download_file "$BASE_URL/.claude/commands/pm-domain.md"              ".claude/commands/pm-domain.md"
download_file "$BASE_URL/.claude/commands/pm-press.md"               ".claude/commands/pm-press.md"
download_file "$BASE_URL/.claude/commands/pm-faq.md"                 ".claude/commands/pm-faq.md"
download_file "$BASE_URL/.claude/commands/pm-align.md"               ".claude/commands/pm-align.md"

# Install templates
printf "\nInstalling pm-kit templates...\n\n"
download_file "$BASE_URL/.product/templates/domain-template.md"      ".product/templates/domain-template.md"
download_file "$BASE_URL/.product/templates/press-template.md"       ".product/templates/press-template.md"
download_file "$BASE_URL/.product/templates/faq-template.md"         ".product/templates/faq-template.md"
download_file "$BASE_URL/.product/templates/requirements-template.md" ".product/templates/requirements-template.md"

# Success summary
printf "\npm-kit installed successfully!\n\n"
printf "Commands available in Claude Code:\n"
printf "  /pm-domain   — Define domain context (users, problem, competitors)\n"
printf "  /pm-press    — Write Working Backwards press releases\n"
printf "  /pm-faq      — Generate FAQs that challenge the press release\n"
printf "  /pm-align    — Reconcile product docs with engineering specs\n"
printf "\nStart with: /pm-domain <describe your project>\n"
