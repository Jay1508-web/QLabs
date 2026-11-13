@echo off
title QubitLab - Interactive Quantum Superposition Simulator
echo =====================================================================
echo           QubitLab - Interactive Quantum Superposition Simulator
echo       B.Tech VLSI Quantum Technology Microproject (BQT Module 1 ^& 2)
echo =====================================================================
echo.
echo Starting local development server and opening browser...
echo.

cd /d "%~dp0"
call npm.cmd run dev -- --open

pause
