const host = '192.168.0.108';
const port = 6969;

const ws = new WebSocket(`ws://${host}:${port}`);

ws.onopen(ev => {
  ws.send('test');
});

ws.onmessage(ev => {
  console.log(ev);
});
