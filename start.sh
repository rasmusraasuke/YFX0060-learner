#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Setting up YFX0060 Learner..."
echo ""

# Step 1: Check for .env file
echo "📝 Step 1: Checking for .env file..."
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo ""
    echo "Creating .env file template..."
    cat > .env << EOL
ANTHROPIC_API_KEY=your_api_key_here
EOL
    echo -e "${YELLOW}⚠️  Please edit .env file and add your Anthropic API key${NC}"
    echo "   Get your API key from: https://console.anthropic.com/"
    echo ""
    echo "   After adding your API key, run this script again:"
    echo "   ./setup.sh"
    exit 1
fi

# Check if API key is set
if grep -q "your_api_key_here" .env || grep -q "ANTHROPIC_API_KEY=$" .env; then
    echo -e "${RED}❌ Error: ANTHROPIC_API_KEY is not set in .env file!${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Please edit .env file and add your actual Anthropic API key${NC}"
    echo "   Get your API key from: https://console.anthropic.com/"
    echo ""
    echo "   Current .env file:"
    cat .env
    exit 1
fi

echo -e "${GREEN}✓ .env file found with API key${NC}"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: npm install failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Build the project
echo "🔨 Step 3: Building the project..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Project built successfully${NC}"
echo ""

# Step 4: Start the development server
echo "🎉 Setup complete! Starting development server..."
echo ""
echo -e "${GREEN}Your flashcard app will be available at: http://localhost:3000${NC}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
sleep 2

npm run dev
