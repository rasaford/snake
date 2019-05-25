const http = require('http');
const static = require('node-static');
const file = new static.Server('./');
const WebSocket = require('ws');

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
      client.send(data);
    }
  });
};

function broadcastState() {
  wss.broadcast(JSON.stringify({
    type: 'state',
    state: gameState
  }));
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {

    console.log('received: %s', message);

    switch (message.type) {
      case 'start':
        let playerPos = gameBoard.randomFreePosition();

        gameState.players[message.name] = {
          parts: [playerPos]
        }

        gameBoard.map[playerPos[0]][playerPos[1]] = PLAYER;

        broadcastState();
        break;

      case 'move':
        let p = gameState.players[message.name];
        // distance
        let d = (abs(message.pos[0]-p.parts[p.parts.length-1][0])) + abs(message.pos[1] - p.parts[p.parts.length-1][1]);
        if (gameBoard.illegal(message.pos) || d > 1) {
          ws.send(JSON.stringify({
            type: 'gameOver'
          }));
          
          p.parts.forEach(pos => {
            gameBoard.map[pos[0]][pos[1]] = FREE;
          });
          
          delete gameState.players[p.name];
          broadcastState();
          break;
        }

        p.parts.push(message.pos);
        gameBoard.map[message.pos[0]][message.pos[1]] = PLAYER;

        let foodIndex = gameState.food.indexOf(message.pos);
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
