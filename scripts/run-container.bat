@echo off
REM =============================================================================
REM Docker Container Run Script for React Starter (Windows)
REM =============================================================================
REM This script runs a Docker container for the React Starter application.
REM
REM Usage:
REM   scripts\run-container.bat [options]
REM
REM Options:
REM   --name      Container name (default: react-starter-app)
REM   --tag       Image tag (default: react-starter:latest)
REM   --port      Host port (default: 3000)
REM   --env       Environment file (default: .env)
REM   --detach    Run in detached mode
REM   --rm        Remove container when stopped
REM =============================================================================

setlocal enabledelayedexpansion

REM Default values
set "CONTAINER_NAME=react-starter-app"
set "IMAGE_TAG=react-starter:latest"
set "HOST_PORT=3000"
set "CONTAINER_PORT=3000"
set "ENV_FILE=.env"
set "DETACH="
set "REMOVE="

REM Parse arguments
:parse_args
if "%~1"=="" goto :run
if /i "%~1"=="--name" (
    set "CONTAINER_NAME=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--tag" (
    set "IMAGE_TAG=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--port" (
    set "HOST_PORT=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--env" (
    set "ENV_FILE=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--detach" (
    set "DETACH=-d"
    shift
    goto :parse_args
)
if /i "%~1"=="--rm" (
    set "REMOVE=--rm"
    shift
    goto :parse_args
)
if /i "%~1"=="--help" goto :show_help
if /i "%~1"=="-h" goto :show_help

echo [ERROR] Unknown option: %~1
goto :show_help

:run
REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if image exists
docker image inspect %IMAGE_TAG% >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Image '%IMAGE_TAG%' not found. Build it first with: pnpm build:image
    exit /b 1
)

REM Check if container is already running
for /f %%i in ('docker ps -q -f name^=%CONTAINER_NAME%') do (
    echo [WARNING] Container '%CONTAINER_NAME%' is already running.
    set /p "REPLY=Do you want to stop and remove it? (y/N) "
    if /i "!REPLY!"=="y" (
        echo [INFO] Stopping and removing existing container...
        docker stop %CONTAINER_NAME% >nul
        docker rm %CONTAINER_NAME% >nul
    ) else (
        echo [INFO] Aborted.
        exit /b 0
    )
)

REM Check if container exists but stopped
for /f %%i in ('docker ps -aq -f name^=%CONTAINER_NAME%') do (
    echo [INFO] Removing stopped container '%CONTAINER_NAME%'...
    docker rm %CONTAINER_NAME% >nul
)

REM Build docker run command
set "DOCKER_CMD=docker run"

if defined DETACH set "DOCKER_CMD=%DOCKER_CMD% %DETACH%"
if defined REMOVE set "DOCKER_CMD=%DOCKER_CMD% %REMOVE%"

set "DOCKER_CMD=%DOCKER_CMD% -p %HOST_PORT%:%CONTAINER_PORT%"

if exist "%ENV_FILE%" (
    set "DOCKER_CMD=%DOCKER_CMD% --env-file %ENV_FILE%"
    echo [INFO] Using environment file: %ENV_FILE%
) else (
    echo [WARNING] Environment file '%ENV_FILE%' not found. Running without it.
)

set "DOCKER_CMD=%DOCKER_CMD% --name %CONTAINER_NAME% %IMAGE_TAG%"

echo [INFO] Starting container...
echo [INFO]   Name: %CONTAINER_NAME%
echo [INFO]   Image: %IMAGE_TAG%
echo [INFO]   Port: %HOST_PORT%:%CONTAINER_PORT%

%DOCKER_CMD%

if %errorlevel% equ 0 (
    if defined DETACH (
        echo [SUCCESS] Container started in background!
        echo [INFO] View logs: docker logs -f %CONTAINER_NAME%
        echo [INFO] Stop container: docker stop %CONTAINER_NAME%
    ) else (
        echo [SUCCESS] Container stopped.
    )
    echo [INFO] Access app at: http://localhost:%HOST_PORT%
) else (
    echo [ERROR] Failed to start container.
    exit /b 1
)

goto :eof

:show_help
echo Usage: scripts\run-container.bat [options]
echo.
echo Options:
echo   --name      Container name (default: react-starter-app)
echo   --tag       Image tag (default: react-starter:latest)
echo   --port      Host port (default: 3000)
echo   --env       Environment file (default: .env)
echo   --detach    Run in detached mode
echo   --rm        Remove container when stopped
echo   --help, -h  Show this help message
echo.
echo Examples:
echo   scripts\run-container.bat
echo   scripts\run-container.bat --port 8080 --detach
echo   scripts\run-container.bat --name myapp --tag myapp:v1.0.0
exit /b 0
