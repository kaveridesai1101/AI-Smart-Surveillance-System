@echo off
echo ========================================================
echo      IntentSentinel - GitHub Setup Assistant
echo ========================================================
echo.
echo We need to set the correct User Name and Email for this project.
echo This ensures the code is uploaded to the correct GitHub account.
echo.

set /p GIT_NAME="Enter your GitHub User Name (e.g. John Doe): "
set /p GIT_EMAIL="Enter your GitHub Email: "

echo.
echo 1. Please go to https://github.com/new in your browser.
echo 2. Make sure you are signed into the account for %GIT_EMAIL%.
echo 3. Create a new repository named "AI-Smart-Surveillance-System".
echo    (GitHub will automatically change spaces to hyphens)
echo 4. DO NOT add a README, .gitignore, or License (uncheck them).
echo 5. Click "Create repository".
echo.
echo ========================================================
set /p NOTICE="When you have created the repo, press ENTER to continue..."
echo.

echo Initializing Git...
git init

echo Configuring User identity for this project...
git config user.name "%GIT_NAME%"
git config user.email "%GIT_EMAIL%"

echo Adding files...
git add .
git commit -m "Initial release of AI Smart Surveillance System"

echo.
echo ========================================================
echo Paste your GitHub Repository URL below
echo (e.g. https://github.com/YourUser/AI-Smart-Surveillance-System.git)
echo Use Right-Click to paste if Ctrl+V doesn't work.
echo ========================================================
set /p REPO_URL="Repo URL: "

echo.
echo Linking to %REPO_URL%...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Pushing code to GitHub...
echo (A popup might appear asking you to sign in. Sign in with %GIT_EMAIL%)
git push -u origin main

echo.
echo ========================================================
echo                   DONE! 
echo ========================================================
pause
