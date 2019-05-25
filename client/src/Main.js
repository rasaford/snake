import React from 'react';
// import './Main.css';
import './WsClient';
import './KeyListener';
import BoardObservable from './BoardObservable';
import WsClient from './WsClient';

const width = 800;
const height = 800;
const tileSize = 100;

class Board extends React.Component {
  componentDidMount() {
    this.resetCanvas();

    this.props.board.onUpdate(board => {
      this.resetCanvas();
      for (let player in board.players) {
        for (let part in player.parts) {
          this.drawBox('#00ff00', ...part);
        }
      }
      for (let food in board.food) {
        this.drawBox('#0000ff', ...food);
      }
    });
  }

  resetCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
  }

  drawBox(color, x, y) {
    const offset = (width / tileSize) * 0.1;
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(
      (x * width) / tileSize + offset,
      (y * height) / tileSize + offset,
      width / tileSize - offset * 2,
      height / tileSize - offset * 2
    );
  }

  render() {
    return <canvas ref="canvas" width={width} height={height} />;
  }
}

const NameInput = props => {
  return (
    <form>
      <label>Name:</label>
      <input type="text" onSubmit={e => props.wsclient.sendName(e.target)} />
    </form>
  );
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.board = null;
    this.pos = [0, 0];
    this.startGame();

    // document.onkeydown = ev => {
    //   let newPos = this.pos;
    //   switch (ev.keyCode) {
    //     case 37: // left
    //     newPos = [this.pos]
    //     case 38: // up
    //     case 39: // right
    //     case 40: // down
    //       break;
    //     default:
    //   }
    // };
  }

  startGame() {
    this.board = new BoardObservable();
    // this.ws = new WsClient();
    // this.ws.connect(this.board);
  }

  render() {
    return (
      <div className="App">
        <h1>Snake 9000</h1>
        <NameInput wsclient={this.ws} />
        <Board board={this.board} />
      </div>
    );
  }
}

export default Main;
