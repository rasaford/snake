class BoardObservable {
  constructor(board) {
    this.board = board;
    this.listeners = [];
  }

  update(newBoard) {
    this.board = newBoard;
    this.listeners.forEach(fn => fn(this.board));
  }

  onUpdate(fn) {
    this.listeners.push(fn);
  }
}

export default BoardObservable;
