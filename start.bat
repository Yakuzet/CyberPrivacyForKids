@echo off
REM Starts ByteGuard Academy on http://localhost:5173 so videos and voices work.
cd /d "%~dp0"
start "" http://localhost:5173
python -m http.server 5173 --bind 127.0.0.1
