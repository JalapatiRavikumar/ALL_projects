# Maven Installation Script for Windows
# Run this script in PowerShell as Administrator

Write-Host "=== Maven Installation Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if Maven is already installed
$mavenInstalled = Get-Command mvn -ErrorAction SilentlyContinue
if ($mavenInstalled) {
    Write-Host "✓ Maven is already installed!" -ForegroundColor Green
    mvn -version
    exit 0
}

Write-Host "Maven not found. Checking for Chocolatey..." -ForegroundColor Yellow

# Check if Chocolatey is installed
$chocoInstalled = Get-Command choco -ErrorAction SilentlyContinue

if ($chocoInstalled) {
    Write-Host "✓ Chocolatey found. Installing Maven..." -ForegroundColor Green
    choco install maven -y
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    Write-Host ""
    Write-Host "✓ Maven installed successfully!" -ForegroundColor Green
    mvn -version
} else {
    Write-Host ""
    Write-Host "Chocolatey is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "Option 1: Install Chocolatey (Recommended)" -ForegroundColor Cyan
    Write-Host "Run this command in PowerShell as Administrator:"
    Write-Host "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run: choco install maven -y" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Manual Installation" -ForegroundColor Cyan
    Write-Host "1. Download Maven from: https://maven.apache.org/download.cgi" -ForegroundColor White
    Write-Host "2. Extract to C:\Program Files\Apache\maven" -ForegroundColor White
    Write-Host "3. Add C:\Program Files\Apache\maven\bin to System PATH" -ForegroundColor White
    Write-Host "4. Restart PowerShell" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "After installation, verify with: mvn -version" -ForegroundColor Yellow
