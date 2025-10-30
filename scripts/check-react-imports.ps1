# React Import Check Script (PowerShell)
Write-Host "🔍 Checking for common React import issues..." -ForegroundColor Green

# Check for missing useEffect imports
Write-Host "Checking for useEffect usage without import..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Include "*.tsx", "*.ts" | Select-String "useEffect" | Where-Object { $_.Line -notmatch "import.*useEffect" } | Select-Object -First 5

# Check for missing useState imports
Write-Host "Checking for useState usage without import..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Include "*.tsx", "*.ts" | Select-String "useState" | Where-Object { $_.Line -notmatch "import.*useState" } | Select-Object -First 5

# Check for missing React imports
Write-Host "Checking for React usage without import..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Include "*.tsx", "*.ts" | Select-String "React\." | Where-Object { $_.Line -notmatch "import.*React" } | Select-Object -First 5

Write-Host "✅ Import check complete!" -ForegroundColor Green
