const http = require('http');
const static = require('node-static');
const file = new static.Server('./');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  req.addListener('end', () => file.serve(req, res)).resume();
});

const port = 6969;
// ip 192.168.0.108

server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

let gameState = {
  width: 100,
  height: 100,
  players: {
    'Oli': {
      parts: [[0, 0], [1, 0]],
    }
  },
  food: [[1, 1]]
}

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    if (message.type == 'move') {
      let p = gameState.players[message.name];
      p.parts.push()
    }
    
    
    ws.send(JSON.stringify(gameState));
  });

  ws.send('something');
});
