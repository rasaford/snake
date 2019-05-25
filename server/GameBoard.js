const FREE = 0;
const FOOD = -1;
const PLAYER = 1;

class GameBoard {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.map = [];
        this.map.length = width;

        for (var i = 0; i < width; i++) {
            this.map[i] = [];
            this.map[i].length = height;
            for (var j = 0; j < height; j++) {
                this.map[i][j] = FREE;
            }
        }
    }

    randomFreePosition() {
        let pos = [0, 0];

        do {
            pos = [(int) (Math.random() * gameState.width), (int) (Math.random() * gameState.height)];
        } while (illegal(pos) || occupied(pos));

        return pos;
    }

    occupied(pos) {
        // unchecked if outside map
        return this.map[pos[0]][pos[1]] != FREE;
    }

    illegal(pos) {
        return pos[0] < this.width || pos[0] >= this.width
            || pos[1] < this.height || pos[1] >= this.height
            || this.map[pos[0]][pos[1]] != PLAYER;
    }
}