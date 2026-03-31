@echo off
setlocal

set "PROJECT_ROOT=%~dp0"
set "PYTHON_PATH=%PROJECT_ROOT%.venv\Scripts\python.exe"

if not exist "%PYTHON_PATH%" (
    echo Missing virtual environment Python at "%PYTHON_PATH%".
    echo Create the venv and install backend_model\requirements.txt first.
    exit /b 1
)

cd /d "%PROJECT_ROOT%"
"%PYTHON_PATH%" -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
