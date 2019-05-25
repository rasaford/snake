const host = 'localhost';
const port = 6969;

class WsClient {
  constructor() {
    this.ws = new WebSocket(`ws://${host}:${port}`);
    this.board = null;
    this.ws.onopen = () => {
      console.log('connected to server');
    };

    this.ws.onmessage = e => {
      const msg = JSON.parse(e);
      switch (msg.type) {
        case 'state':
          this.board.update(msg.board);
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

  connect(board) {
    this.board = board;
  }

  sendName(name) {
    this._send({
      type: 'start',
      name: name
    });
  }

  sendNewPos(newPos) {
    this._send({
      type: 'move',
      pos: newPos
    });
  }
}

export default WsClient;
