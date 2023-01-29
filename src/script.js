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
        this.body.addEventListener('click', () => { // here must be something
            this.addActiveStyle();
            this.showAvailable();
        });
        this.body.classList.add('chest');
        this.body.classList.add(color);
        Checker.#checkers.push(this.body);
    }

    showAvailable() {
        Area.clearArea();
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
        Area.clearArea();
        console.log(elem.id.split(' '));
        for (const elem of this.available) {
            elem.onclick = '';
        }
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
            elem.classList.remove('active');
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
}

new Area().draw();
Checker.draw();