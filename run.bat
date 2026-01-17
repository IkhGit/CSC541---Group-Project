
@echo off
REM Study Leveling App - Launcher Script
REM This script opens the application in the default web browser

echo Starting Study Leveling Application...
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0

REM Open index.html in the default browser
start "" "%SCRIPT_DIR%index.html"

echo Application launched! Opening index.html in your default browser...
echo.
pause
