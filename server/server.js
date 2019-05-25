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

let players = [];

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send(`echo: ${message}`);
  });

  ws.send('something');
});
