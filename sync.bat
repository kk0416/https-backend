@echo off
echo "Pushing full project to GitHub..."
git push origin main

echo "Pushing backend subdir to CNB..."
git subtree push --prefix=backend cnb-backend main

echo "✅ All sync done!"