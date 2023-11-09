import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sqlcommands from './sql-commands.json' assert { type: "json" };
import {createRandomCasinoData, getRandomMilisecconds} from './data-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (cluster.isPrimary) {
  for (let i = 0; i < 1; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }
  setupPrimary();
} else {
  const db = await open({
    filename: 'boards.db',
    driver: sqlite3.Database
  });

  await db.exec(sqlcommands.CREATE_BOARDSTABLE);
  await db.exec(sqlcommands.INSERT_DATA.replace("%INSERTDATA%", sqlcommands.CASINO_DATA.join(',')))

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    adapter: createAdapter()
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
  });

  io.on('connection', async (socket) => {
    if (!socket.recovered) {
      try {
        await db.each(sqlcommands.CASINO_RECORDS,
          [socket.handshake.auth.serverOffset || 0],
          (_err, row) => {
            console.log('RECORDS', _err, row)
            socket.emit('casino-data', JSON.stringify(row), row.id);
          }
        )
      } catch (e) {
        console.log('CATCH ERROR', e)
        // something went wrong
      }
    }

    const interval = setInterval(function() {
      setTimeout(() => {
        socket.emit('casino-data', JSON.stringify(createRandomCasinoData()));
      }, getRandomMilisecconds());
    }, 2500);
  });

  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
}
