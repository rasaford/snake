import React from 'react';
// import './Main.css';
import './WsClient';
import BoardObservable from './BoardObservable';
import WsClient from './WsClient';

const width = 800;
const height = 800;
const tileSize = 100;

class Board extends React.Component {
  componentDidMount() {
    this.resetCanvas();

    this.props.board.onUpdate(board => {
      console.log('drawing...', board);
      this.resetCanvas();
      for (let player in board.players) {
        for (let part of board.players[player].parts) {
          this.drawBox('#00ff00', part[0], part[1]);
        }
      }
      for (let food of board.food) {
        this.drawBox('#0000ff', food[0], food[1]);
      }
    });
  }

  resetCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
  }

  drawBox(color, x, y) {
    console.log('drawBox', color, x, y);
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

var player_name = '';
class NameInput extends React.Component {
  render() {
    return (
      <form>
        <label>
          Name:
          <input
            type="text"
            onChange={e => this.setState({ name: e.target.value })}
          />
        </label>
        <input
          type="button"
          value="Submit"
          onClick={e => {
            console.log(this.state.name);
            this.props.wsclient.sendName(this.state.name);
            player_name = this.state.name;
          }}
        />
      </form>
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.pos = [0, 0];
    this.boardObs = new BoardObservable();
    this.boardObs.onUpdate(board => {
      this.board = board;
    });

    this.ws = new WsClient(this.boardObs);

    document.onkeydown = ev => {
      console.log('key pressed', this.board)
      if (this.board) {
        let player = this.board.players[player_name];
        let newPos = player.parts.pop();
        switch (ev.keyCode) {
          case 37: // left
            newPos = [newPos[0] - 1, newPos[1]];
            break;
          case 38: // up
            newPos = [newPos[0], newPos[1] - 1];
            break;
          case 39: // right
            newPos = [newPos[0] + 1, newPos[1]];
            break;
          case 40: // down
            newPos = [newPos[0], newPos[1] + 1];
            break;
          default:
        }
        console.log('new Pos: ' + newPos);
        this.ws.sendNewPos(player_name, newPos);
      }
    };
  }

  render() {
    return (
      <div className="App">
        <h1>Snake 9000</h1>
        <NameInput wsclient={this.ws} />
        <Board board={this.boardObs} />
      </div>
    );
  }
}

export default Main;
