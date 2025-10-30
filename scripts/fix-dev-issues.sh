#!/bin/bash

# Development Fix Script for ChunkLoadError
echo "🔧 Fixing ChunkLoadError and development issues..."

# Stop any running processes
echo "🛑 Stopping any running development servers..."
pkill -f "next dev" || true

# Clean build cache
echo "🧹 Cleaning build cache..."
rm -rf .next
rm -rf node_modules/.cache

# Clear npm cache
echo "🗑️ Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Start development server
echo "🚀 Starting development server..."
npm run dev
