$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pythonPath = Join-Path $projectRoot ".venv\Scripts\python.exe"

if (-not (Test-Path $pythonPath)) {
    Write-Error "Missing virtual environment Python at '$pythonPath'. Create the venv and install backend_model\\requirements.txt first."
}

Set-Location $projectRoot
& $pythonPath -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
