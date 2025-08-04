#!/bin/bash

# =====================================================
# GIT CLEANUP SCRIPT - Remove tracked files that should be ignored
# =====================================================

echo "🧹 CLEANING UP GIT REPOSITORY"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  This script will remove sensitive files from git tracking${NC}"
echo -e "${YELLOW}   Files will remain in your local directory but won't be committed${NC}"
echo ""

# Function to safely remove from git if file exists
safe_git_rm() {
    if git ls-files --error-unmatch "$1" > /dev/null 2>&1; then
        echo -e "${BLUE}🗑️  Removing from git: $1${NC}"
        git rm --cached "$1" 2>/dev/null || true
    fi
}

# Remove environment files from git tracking
echo -e "${GREEN}🔐 Removing environment files from git tracking...${NC}"
safe_git_rm ".env"
safe_git_rm ".env.local"
safe_git_rm ".env.production"
safe_git_rm ".env.production.local"
safe_git_rm ".env.development.local"
safe_git_rm ".env.test.local"
safe_git_rm "client/.env.production"
safe_git_rm "client/.env.production.local"
safe_git_rm "client/.env.local"
safe_git_rm "server/.env"
safe_git_rm "server/.env.production"
safe_git_rm "server/.env.local"

# Remove any backup files
echo -e "${GREEN}🗃️  Removing backup files from git tracking...${NC}"
safe_git_rm "*.backup"
safe_git_rm "*.bak" 
safe_git_rm "*_backup*"

# Remove log files
echo -e "${GREEN}📝 Removing log files from git tracking...${NC}"
safe_git_rm "*.log"
safe_git_rm "logs/*"

# Remove build directories
echo -e "${GREEN}🏗️  Removing build directories from git tracking...${NC}"
safe_git_rm "client/.next/"
safe_git_rm ".next/"
safe_git_rm "build/"
safe_git_rm "dist/"

# Remove cache directories
echo -e "${GREEN}🗂️  Removing cache directories from git tracking...${NC}"
safe_git_rm ".cache/"
safe_git_rm "client/.cache/"

# Remove deployment files with secrets
echo -e "${GREEN}🚀 Removing deployment files with potential secrets...${NC}"
safe_git_rm ".vercel"

# Remove IDE files
echo -e "${GREEN}💻 Removing IDE files from git tracking...${NC}"
safe_git_rm ".vscode/"
safe_git_rm ".idea/"

# Add updated .gitignore
echo -e "${GREEN}✅ Adding updated .gitignore...${NC}"
git add .gitignore

echo ""
echo -e "${GREEN}✅ CLEANUP COMPLETED!${NC}"
echo ""
echo -e "${YELLOW}📋 NEXT STEPS:${NC}"
echo -e "${BLUE}1. Review the changes: git status${NC}"
echo -e "${BLUE}2. Commit the updated .gitignore: git commit -m \"feat: update .gitignore for production security\"${NC}"
echo -e "${BLUE}3. Push changes: git push${NC}"
echo ""
echo -e "${RED}⚠️  IMPORTANT SECURITY NOTES:${NC}"
echo -e "${RED}   - Your .env files are now ignored and won't be committed${NC}"
echo -e "${RED}   - Set environment variables directly in deployment platforms${NC}"
echo -e "${RED}   - Never commit API keys, passwords, or secrets${NC}"
echo ""
echo -e "${GREEN}🔒 Your repository is now production-ready and secure!${NC}"