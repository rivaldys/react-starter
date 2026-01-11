@echo off
REM =============================================================================
REM Docker Image Build Script for React Starter (Windows)
REM =============================================================================
REM This script builds a Docker image for the React Starter application.
REM
REM Usage:
REM   scripts\build-image.bat [options]
REM
REM Options:
REM   --tag       Image tag (default: react-starter:latest)
REM   --mode      Build mode: ssr or csr (default: csr)
REM   --no-cache  Build without cache
REM =============================================================================

setlocal enabledelayedexpansion

REM Default values
set "IMAGE_TAG=react-starter:latest"
set "BUILD_MODE=csr"
set "NO_CACHE="
set "DOCKER_DIR=deploy"

REM Parse arguments
:parse_args
if "%~1"=="" goto :validate
if /i "%~1"=="--tag" (
    set "IMAGE_TAG=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--mode" (
    set "BUILD_MODE=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--no-cache" (
    set "NO_CACHE=--no-cache"
    shift
    goto :parse_args
)
if /i "%~1"=="--help" goto :show_help
if /i "%~1"=="-h" goto :show_help

echo [ERROR] Unknown option: %~1
goto :show_help

:validate
REM Validate build mode
if /i not "%BUILD_MODE%"=="ssr" if /i not "%BUILD_MODE%"=="csr" (
    echo [ERROR] Invalid build mode: %BUILD_MODE%. Use 'ssr' or 'csr'.
    exit /b 1
)

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Dockerfile exists
if not exist "%DOCKER_DIR%\Dockerfile" (
    echo [ERROR] Dockerfile not found in %DOCKER_DIR% directory.
    exit /b 1
)

echo [INFO] Building Docker image...
echo [INFO]   Tag: %IMAGE_TAG%
echo [INFO]   Mode: %BUILD_MODE%
echo [INFO]   Docker context: %DOCKER_DIR%

REM Build the image (context is root, dockerfile in docker folder)
docker build %NO_CACHE% --build-arg BUILD_MODE=%BUILD_MODE% -f %DOCKER_DIR%\Dockerfile -t %IMAGE_TAG% .

if %errorlevel% equ 0 (
    echo [SUCCESS] Docker image built successfully!
    echo [INFO] Run with: docker run -p 3000:3000 %IMAGE_TAG%
) else (
    echo [ERROR] Failed to build Docker image.
    exit /b 1
)

goto :eof

:show_help
echo Usage: scripts\build-image.bat [options]
echo.
echo Options:
echo   --tag       Image tag (default: react-starter:latest)
echo   --mode      Build mode: ssr or csr (default: ssr)
echo   --no-cache  Build without cache
echo   --help, -h  Show this help message
echo.
echo Examples:
echo   scripts\build-image.bat
echo   scripts\build-image.bat --tag myapp:v1.0.0
echo   scripts\build-image.bat --mode csr --tag myapp:csr
exit /b 0
