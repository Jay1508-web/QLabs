@echo off
title QubitLab - Interactive Quantum Superposition Simulator
echo =====================================================================
echo           QubitLab - Interactive Quantum Superposition Simulator
echo       B.Tech VLSI Quantum Technology Microproject (BQT Module 1 & 2)
echo =====================================================================
echo.
echo Starting local development server...
echo.

cd /d "%~dp0"
call npm run dev -- --open

pause
