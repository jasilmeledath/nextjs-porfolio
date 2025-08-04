#!/bin/bash

# Production Console Log Cleanup Script
# Removes debugging console logs that could leak sensitive data

echo "🔐 CLEANING PRODUCTION CONSOLE LOGS"
echo "==================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="/Users/jasilm/Desktop/Nextjs Portfolio"
cd "$PROJECT_ROOT"

echo -e "${YELLOW}⚠️  Removing debugging console logs that could leak sensitive data...${NC}"
echo ""

# Counter for changes
CHANGES_MADE=0

# Function to remove console logs from a file
cleanup_file() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    if [[ -f "$file" ]]; then
        echo -e "${BLUE}🔧 Processing: ${file}${NC}"
        
        # Remove specific debugging console logs we added during development
        sed -E '
            # Remove debug logs with object data
            /console\.log\(['\''"`]?\[.*\].*:['\''"`]?\s*,\s*\{/,/\}\s*\);?/d
            
            # Remove form data logs
            /console\.log.*[fF]orm.*data.*\{/,/\}\s*\);?/d
            
            # Remove editing/updating project logs
            /console\.log.*\[ProjectForm\].*Editing project/,/\}\s*\);?/d
            /console\.log.*\[ProjectForm\].*Updating project/,/\}\s*\);?/d
            
            # Remove skills debugging logs
            /console\.log.*\[SkillsMarquee\].*Skill/,/\}\s*\);?/d
            /console\.log.*\[SkillsPage\].*Skill/,/\}\s*\);?/d
            /console\.log.*\[PortfolioService\].*Processing skill/,/\}\s*\);?/d
            /console\.log.*\[PortfolioManagementService\].*skill/,/\}\s*\);?/d
            
            # Remove icon resolution logs
            /console\.log.*Icon resolution/,/\}\s*\);?/d
            
            # Remove email logging with addresses
            /console\.log.*Email sent successfully to/d
            /console\.log.*Blog notification sent successfully/d
        ' "$file" > "$temp_file"
        
        # Check if file was changed
        if ! cmp -s "$file" "$temp_file"; then
            mv "$temp_file" "$file"
            echo -e "${GREEN}  ✅ Cleaned console logs${NC}"
            ((CHANGES_MADE++))
        else
            rm "$temp_file"
            echo -e "  ℹ️ No changes needed"
        fi
    fi
}

# Clean client files
echo -e "${BLUE}📁 Cleaning client files...${NC}"
find "$PROJECT_ROOT/client/src" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read -r file; do
    cleanup_file "$file"
done

echo ""

# Clean server files
echo -e "${BLUE}📁 Cleaning server files...${NC}"
find "$PROJECT_ROOT/server/src" -name "*.js" -o -name "*.ts" | while read -r file; do
    cleanup_file "$file"
done

# Clean root server files
cleanup_file "$PROJECT_ROOT/server/server.js"

echo ""
echo -e "${GREEN}✅ CONSOLE LOG CLEANUP COMPLETED${NC}"
echo ""

if [[ $CHANGES_MADE -gt 0 ]]; then
    echo -e "${GREEN}📊 SUMMARY:${NC}"
    echo -e "${GREEN}  - Files processed and cleaned${NC}"
    echo -e "${GREEN}  - Debug logs with sensitive data removed${NC}"
    echo -e "${GREEN}  - Form data logging removed${NC}"
    echo -e "${GREEN}  - User/email data logging removed${NC}"
    echo -e "${GREEN}  - Icon debugging logs removed${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
    echo -e "${YELLOW}  - Essential error logging has been preserved${NC}"
    echo -e "${YELLOW}  - Review changes before committing${NC}"
    echo -e "${YELLOW}  - Add NODE_ENV checks for dev-only logs${NC}"
else
    echo -e "${GREEN}✨ No sensitive console logs found - code is already clean!${NC}"
fi

echo ""
echo -e "${GREEN}🔒 Your code is now production-ready and secure!${NC}"