@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Stop-Returnlane.ps1"
if errorlevel 1 pause
