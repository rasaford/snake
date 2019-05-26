const host = 'localhost';
const port = 6969;

class WsClient {
  constructor(board) {
    this.board = board;
    this.ws = new WebSocket(`ws://${host}:${port}`);
    this.ws.onopen = () => {
      console.log('connected to server');
    };

    this.ws.onmessage = e => {
      const msg = JSON.parse(e.data);
      switch (msg.type) {
        case 'state':
          this.board.update(msg.state);
          break;
        case 'gameOver':
          alert('GAME OVER!!!');
          break;
        default:
          alert(`unknown type ${msg.type}`);
      }
    };
  }
  _send(data) {
    this.ws.send(JSON.stringify(data));
  }

  sendName(name) {
    this._send({
      type: 'start',
      name: name
    });
  }

  sendNewPos(name, newPos) {
    this._send({
      type: 'move',
      name: name,
      pos: newPos
    });
  }
}

export default WsClient;
