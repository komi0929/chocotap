---
description: Start local development server for chocotap
---

# Start Local Dev Server

// turbo-all

1. Start the HTTP server with no caching:
```
npx -y http-server . -p 8080 -c-1 --cors
```

## Notes
- Runs at http://localhost:8080
- `-c-1` disables caching for development
- The server must be running for local preview
