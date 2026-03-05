# ✦ Care Network — Multiplayer Globe

Real-time collaborative globe. Every device that taps adds a star and
a glowing arc — visible to everyone connected at the same time.

---

## Run locally (same WiFi, multiple devices)

```bash
# 1. Install dependencies
npm install

# 2. Start the server
node server.js

# 3. Open in browser
#    Your device:      http://localhost:3000
#    Other devices:    http://<YOUR-LOCAL-IP>:3000
#    (find your IP with `ipconfig` on Windows or `ifconfig` on Mac/Linux)
```

---

## Deploy to the internet (free, 1 minute)

### Option A — Railway (easiest)
1. Push this folder to a GitHub repo
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Select your repo — it auto-detects Node.js and deploys
4. Share the generated URL with anyone in the world

### Option B — Render
1. Push to GitHub
2. Go to https://render.com → New Web Service → Connect repo
3. Build command: `npm install`  
   Start command: `node server.js`
4. Deploy → share the URL

### Option C — run on your machine, expose with ngrok
```bash
npm install
node server.js &
npx ngrok http 3000
# Share the https://xxxx.ngrok.io URL
```

---

## How it works

- **server.js** — Express + Socket.io server that keeps a full history of
  all taps in memory. New clients receive the entire history on connect
  so they instantly see every star and arc that's ever been placed.

- **public/index.html** — Three.js globe client. When you tap:
  1. Emits `{ lat, lon }` to the server
  2. Server broadcasts it to ALL connected clients (including you)
  3. Every client renders the star + arc in sync

- **"Watching now"** counter shows live connected viewers.
- **Toast notification** appears when someone else joins.
- All sounds, stars, and arcs are synced across devices in real-time.
