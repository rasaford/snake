const http = require('http');
const static = require('node-static');
const file = new static.Server('./');

const server = http.createServer((req, res) => {
  req.addListener('end', () => file.serve(req, res)).resume();
});

const port = 6969;

server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

const WebSocket = require('ws');
 
const wss = new WebSocket.Server({
});