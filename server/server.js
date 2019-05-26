const http = require('http');
const static = require('node-static');
const file = new static.Server('./');
const WebSocket = require('ws');

class GameState {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.food = [];
    this.players = {};
  }
}

const FREE = 0;
const FOOD = -1;
const PLAYER = 1;

class GameBoard {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = [];
    this.map.length = width;

    for (var i = 0; i < width; i++) {
      this.map[i] = [];
      this.map[i].length = height;
      for (var j = 0; j < height; j++) {
        this.map[i][j] = FREE;
      }
    }
  }

  occupied(pos) {
    // unchecked if outside map
    return this.map[pos[0]][pos[1]] !== FREE;
  }

  illegal(pos) {
    return (
      pos[0] < 0 ||
      pos[0] >= this.width ||
      pos[1] < 0 ||
      pos[1] >= this.height ||
      this.map[pos[0]][pos[1]] === PLAYER
    );
  }

  randomFreePosition() {
    let pos = [0, 0];
    do {
      pos = [
        Math.floor(Math.random() * gameState.width),
        Math.floor(Math.random() * gameState.height)
      ];
    } while (this.occupied(pos));
    return pos;
  }
}

const server = http.createServer((req, res) => {
  req.addListener('end', () => file.serve(req, res)).resume();
});

const port = 6969;
// ip 192.168.0.108

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

let gameState = new GameState(100, 100);
let gameBoard = new GameBoard(100, 100);

const wss = new WebSocket.Server({ server });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log('sending: ' + data);
      client.send(data);
    }
  });
};

function broadcastState() {
  wss.broadcast(
    JSON.stringify({
      type: 'state',
      state: gameState
    })
  );
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    const msg = JSON.parse(message);

    switch (msg.type) {
      case 'start':
        let playerPos = gameBoard.randomFreePosition();

        gameState.players[msg.name] = {
          parts: [playerPos]
        };

        gameBoard.map[playerPos[0]][playerPos[1]] = PLAYER;
        broadcastState();
        break;

      case 'move':
        let p = gameState.players[msg.name];
        // distance
        let d =
          Math.abs(msg.pos[0] - p.parts[p.parts.length - 1][0]) +
          Math.abs(msg.pos[1] - p.parts[p.parts.length - 1][1]);
        if (gameBoard.illegal(msg.pos) || d > 1) {
          ws.send(
            JSON.stringify({
              type: 'gameOver'
            })
          );

          p.parts.forEach(pos => {
            gameBoard.map[pos[0]][pos[1]] = FREE;
          });

          delete gameState.players[p.name];
          broadcastState();
          break;
        }

        p.parts.push(msg.pos);
        gameBoard.map[msg.pos[0]][msg.pos[1]] = PLAYER;

        let foodIndex = gameState.food.indexOf(msg.pos);
        if (foodIndex > -1) {
          gameState.food.splice(foodIndex, 1);

          let newFoodPos = gameState.randomFreePosition();
          gameState.food.push(newFoodPos);
          gameBoard.map[newFoodPos[0]][newFoodPos[1]] = FOOD;
        } else {
          let oldPlayerPos = p.parts.shift();
          gameBoard.map[oldPlayerPos[0]][oldPlayerPos[1]] = FREE;
        }

        broadcastState();
        break;
    }
  });
});
