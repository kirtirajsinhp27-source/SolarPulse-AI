$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $repoRoot "frontend"
$backendDir = Join-Path $repoRoot "backend"
$pythonExe = 'C:\Users\JADEJA PRATIKRAJ\AppData\Local\Programs\Python\Python312\python.exe'
$npmExe = 'C:\Program Files\nodejs\npm.cmd'

function Test-PortOpen($port) {
    try {
        $conn = Test-NetConnection -ComputerName 127.0.0.1 -Port $port -WarningAction SilentlyContinue
        return $conn.TcpTestSucceeded
    }
    catch {
        return $false
    }
}

function Start-IfNeeded($label, $port, $filePath, $arguments, $workingDir) {
    if (Test-PortOpen $port) {
        Write-Host "$label is already running on port $port."
        return
    }

    Write-Host "Starting $label on port $port..."
    Start-Process -FilePath $filePath -ArgumentList $arguments -WorkingDirectory $workingDir -WindowStyle Minimized
}

Write-Host "Starting SolarPulse-AI hybrid monitoring stack..."

if (-not (Test-PortOpen 3001)) {
    Start-IfNeeded "Frontend" 3001 $npmExe "run dev -- --hostname 0.0.0.0 --port 3001" $frontendDir
}

if (-not (Test-PortOpen 8001)) {
    $env:PYTHONPATH = $backendDir
    Start-IfNeeded "Backend" 8001 $pythonExe "-m uvicorn app.main:app --host 0.0.0.0 --port 8001" $backendDir
}

if (-not (Test-PortOpen 8503)) {
    Start-IfNeeded "Streamlit Demo Dashboard" 8503 $pythonExe "-m streamlit run dashboard.py --server.port 8503 --server.address 0.0.0.0" $frontendDir
}

Write-Host ""
Write-Host "SolarPulse-AI stack ready."
Write-Host "Frontend (main app): http://localhost:3001"
Write-Host "Backend API: http://localhost:8001/api/v1/dashboard/overview"
Write-Host "Standalone demo dashboard: http://localhost:8503"
Write-Host ""
Write-Host "Architecture summary: Monitoring page = live operations, Dashboard page = summary view, Panels page = 48-panel health grid."
Write-Host "If real database-backed mode is required later, install/configure PostgreSQL and switch from showcase mode to persistent telemetry storage."
