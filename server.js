// ─── Care Network · Multiplayer Server ───────────────────────────────────────
// Run: node server.js
// Then open: http://localhost:3000  (share your IP on LAN, or deploy to Railway/Render)

const express   = require('express');
const http      = require('http');
const { Server } = require('socket.io');
const path      = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*' }
});

// ─── State ────────────────────────────────────────────────────────────────────
// We keep an ordered list of every tap that has ever happened.
// New clients receive the full history so they render everything immediately.
const taps = []; // { id, lat, lon, colorIdx, ts }
let globalColorIdx = 0;

// ─── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Socket events ────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[+] ${socket.id} connected  (total: ${io.engine.clientsCount})`);

  // 1. Send full history to the new client so they sync instantly
  socket.emit('init', { taps, totalClients: io.engine.clientsCount });

  // 2. Tell everyone else about the new viewer count
  io.emit('viewers', io.engine.clientsCount);

  // 3. Client tapped the globe
  socket.on('tap', ({ lat, lon }) => {
    const tap = {
      id:       socket.id + '_' + Date.now(),
      lat:      parseFloat(lat.toFixed(4)),
      lon:      parseFloat(lon.toFixed(4)),
      colorIdx: globalColorIdx++,
      ts:       Date.now(),
    };
    taps.push(tap);

    // Broadcast to ALL clients (including sender) so everyone renders it
    io.emit('tap', tap);
    console.log(`  tap from ${socket.id.slice(0,6)}  lat=${tap.lat} lon=${tap.lon}  total=${taps.length}`);
  });

  // 4. Client disconnected
  socket.on('disconnect', () => {
    console.log(`[-] ${socket.id} left  (total: ${io.engine.clientsCount})`);
    io.emit('viewers', io.engine.clientsCount);
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n✦  Care Network server running`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Share:   http://<your-ip>:${PORT}\n`);
});
