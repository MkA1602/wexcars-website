# Development Fix Script for ChunkLoadError (PowerShell)
Write-Host "🔧 Fixing ChunkLoadError and development issues..." -ForegroundColor Green

# Stop any running processes
Write-Host "🛑 Stopping any running development servers..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next dev*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Clean build cache
Write-Host "🧹 Cleaning build cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# Clear npm cache
Write-Host "🗑️ Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Reinstall dependencies
Write-Host "📦 Reinstalling dependencies..." -ForegroundColor Yellow
npm install

# Start development server
Write-Host "🚀 Starting development server..." -ForegroundColor Green
npm run dev
