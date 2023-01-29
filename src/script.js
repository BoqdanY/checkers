'use strict';
class Area {
    static area = [];

    static clearArea() {
        for (const row of Area.area) {
            for (const col of row) {
                col.classList.remove('available');
            }
        }
    }

    static clearEvent() {
        for (const row of this.area) {
            for (const col of row) {
                col.onclick = '';
            }
        }
    }
    constructor() {
        for (let i = 0; i < 8; i++) {
            const arr = [];
            for (let j = 0; j < 8; j++) {
                const one = document.createElement('div');
                one.id = `${i} ${j}`;
                one.classList.add('col');
                if ((j + 1 + i) % 2 === 0) {
                    one.classList.add('black');
                } else {
                    one.classList.add('white');
                }
                arr.push(one);
            }
            Area.area.push(arr);
        }
    }
    draw() {
        const baza = document.getElementById('baza');
        for (const cols of Area.area) {
            const row = document.createElement('div');
            row.id = 'row';
            for(const col of cols) {
                row.append(col);
            }
            baza.append(row);
        }
    }
}

class Checker {
    static #checkers = [];
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.available = [];
        this.body = document.createElement('div');
        this.body.classList.add('chest');
        this.body.classList.add(color);
        Checker.#checkers.push(this);
    }
    activate() {
        this.body.onclick = () => {
            this.addActiveStyle();
            this.showAvailable();
        };
    }

    deactivate() {
        this.body.onclick = '';
    }

    showAvailable() {
        Area.clearArea();
        Area.clearEvent();
        this.available = this.getAvailable();
        for (const elem of this.available) {
            elem.classList.add('available');
            elem.onclick = () => this.move(elem);
        }
    }

    move(elem) {
        console.log(elem); // console
        elem.append(this.body);
        this.body.classList.remove('active');
        [this.y, this.x] = elem.id.split(' ').map(x => Number(x));
        Area.clearEvent();
        Area.clearArea();
        Listener.nextMove();
    }

    getAvailable() {
        const availableMoves = [];
        const firstPlayerMoves = [`${this.y + 1} ${this.x + 1}`, `${this.y + 1} ${this.x - 1}`];
        const secondPlayersMove = [`${this.y - 1} ${this.x - 1}`, `${this.y - 1} ${this.x + 1}`];
        const moves = this.color === 'firstPlayer' ? firstPlayerMoves : secondPlayersMove;
        for (const move of moves) {
            const elem = document.getElementById(move);
            if (elem === null) continue;
            if (!elem.innerHTML) availableMoves.push(elem);
        }
        return availableMoves;
    }

    addActiveStyle() {
        for (const elem of Checker.#checkers) {
            elem.body.classList.remove('active');
        }
        this.body.classList.add('active');
    }
    static drawOnePlayer(x, y, color, start) {
        for (let i = 0; i < 12; i++) {
            const col = document.getElementById(`${y} ${x + start}`);
            const checker = new Checker(x + start, y, color);
            col.append(checker.body);
            x += 2;
            if (x > 7) {
                y++;
                x = 0;
                start = start === 1 ? 0: 1;
            }
        }
    }
    static draw() {
        Checker.drawOnePlayer(0, 0, 'firstPlayer', 1);
        Checker.drawOnePlayer(0, 5, 'secondPlayer', 0);
    }

    static defineMove(player) {
        for (const elem of this.#checkers) {
            if (elem.body.classList.contains(player)) {
                elem.activate();
            }
            else {
                elem.deactivate()
            }
        }
    }
}

class Listener {
    static #move = Math.round(Math.random());

    static nextMove() {
        console.log(this.#move); // console
        const player = this.#move === 1 ? 'firstPlayer' : 'secondPlayer';
        Checker.defineMove(player);
        this.#move = this.#move === 1 ? 0 : 1;
    }
}

new Area().draw();
Checker.draw();
Listener.nextMove();