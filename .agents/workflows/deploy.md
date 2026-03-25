---
description: Deploy latest changes to GitHub Pages production
---

# Deploy to Production (GitHub Pages)

After making any code changes, run these steps to deploy to https://komi0929.github.io/chocotap/

// turbo-all

1. Stage all changes:
```
git add -A
```

2. Commit with a descriptive message (replace the message as appropriate):
```
git commit -m "update: description of changes"
```

3. Push to GitHub (triggers automatic GitHub Pages rebuild):
```
git push origin main
```

4. Verify the deployment by opening the production URL in a browser:
   - URL: https://komi0929.github.io/chocotap/
   - Wait ~60 seconds for GitHub Pages to rebuild
   - Hard refresh (Ctrl+Shift+R) to see latest changes

## Notes
- GitHub Pages auto-deploys from the `main` branch, root folder
- Deployment typically takes 30-90 seconds after push
- PowerShell on Windows: do NOT use `&&` to chain commands. Use separate commands or `;`
