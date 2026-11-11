@echo off
title Push QubitLab to GitHub
echo =======================================================
echo          Pushing QubitLab to GitHub (Jay1508-web/QLabs)
echo =======================================================
echo.
echo If prompted, click "Sign in with your browser" to authorize.
echo.

cd /d "%~dp0"
set "PATH=%PATH%;%LOCALAPPDATA%\Programs\Git\cmd"

git push -u origin main

echo.
echo =======================================================
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Your code has been uploaded to GitHub!
    echo Visit: https://github.com/Jay1508-web/QLabs
) else (
    echo [NOTE] If sign-in was cancelled, you can run this script again.
)
echo =======================================================
echo.
pause
