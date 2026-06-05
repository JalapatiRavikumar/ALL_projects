# ------------------------------------------------------------
#  Backend launcher (Windows PowerShell)
#  Frees port 8000 from any stale instance, then starts uvicorn.
#  Usage:  cd backend ; .\run.ps1
# ------------------------------------------------------------
param(
    [int]$Port = 8000,
    [string]$AppHost = "127.0.0.1"
)

$ErrorActionPreference = "SilentlyContinue"

Write-Host "[run] Checking for stale processes on port $Port..." -ForegroundColor Cyan
$pids = Get-NetTCPConnection -LocalPort $Port |
    Where-Object { $_.OwningProcess -ne 0 } |
    Select-Object -ExpandProperty OwningProcess -Unique

if ($pids) {
    foreach ($procId in $pids) {
        $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "[run] Stopping PID $procId ($($proc.ProcessName)) holding port $Port" -ForegroundColor Yellow
            Stop-Process -Id $procId -Force
        }
    }
    Start-Sleep -Seconds 3
} else {
    Write-Host "[run] Port $Port is free." -ForegroundColor Green
}

$ErrorActionPreference = "Continue"

# Resolve the venv python relative to this script.
$python = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $python)) {
    Write-Host "[run] venv python not found at $python" -ForegroundColor Red
    Write-Host "      Create it: python -m venv .venv ; .venv\Scripts\python.exe -m pip install -r requirements.txt"
    exit 1
}

Write-Host "[run] Starting uvicorn on http://$AppHost`:$Port ..." -ForegroundColor Cyan
& $python -m uvicorn app.main:app --host $AppHost --port $Port
