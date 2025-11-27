#!/bin/bash

# Studio Setup Script
# This script installs dependencies for the Calendar Event Manager UI

echo "🚀 Setting up Calendar Event Manager Studio..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.17 or later."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Navigate to studio directory
cd "$(dirname "$0")/studio" || exit

echo "📦 Installing dependencies..."
echo ""

# Try pnpm first, then npm
if command -v pnpm &> /dev/null; then
    echo "Using pnpm..."
    pnpm install
elif command -v npm &> /dev/null; then
    echo "Using npm..."
    npm install
else
    echo "❌ Neither npm nor pnpm is available. Please install Node.js."
    exit 1
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. cd studio"
echo "   2. npm run dev (or pnpm dev)"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🎉"
