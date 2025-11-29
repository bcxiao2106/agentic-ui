#!/bin/bash

# Agentic UI Studio Server Setup Script
set -e

echo "🚀 Setting up Agentic UI Studio Server..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${BLUE}✓ Node.js $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm not found. Please install npm first.${NC}"
    exit 1
fi

echo -e "${BLUE}✓ npm $(npm --version)${NC}"

# Check if PostgreSQL is accessible
echo -e "${BLUE}Checking PostgreSQL connection...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}Note: psql not found. Make sure PostgreSQL is running and accessible.${NC}"
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update .env with your database credentials${NC}"
fi

# Build TypeScript
echo -e "${BLUE}Building TypeScript...${NC}"
npm run build

# Initialize database
echo -e "${BLUE}Initializing database...${NC}"
npm run db:init

echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Edit .env with your database credentials if needed"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3001"
echo ""
