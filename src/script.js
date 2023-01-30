'use strict';
class Area {
    static area = [];

    static clearArea() {
        for (const row of Area.area) {
            for (const col of row) {
                col.classList.remove('available');
                col.classList.remove('beat');
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
    constructor(x, y, color, enemy) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.enemy = enemy;
        this.body = document.createElement('div');
        this.body.classList.add('chest');
        this.body.classList.add(color);
        Checker.#checkers.push(this);
    }
    activate() {
        this.body.onclick = () => {
            this.addActiveStyle();
            this.showAvailableMoves();
        };
    }

    deactivate() {
        this.body.onclick = '';
    }

    showAvailableMoves() {
        Area.clearArea();
        Area.clearEvent();
        this.addAvailableStyle();
        this.addBeatStyle();
    }

    checkCheckersForBeat() {
        const obj = new Map();
        for (const elem of this.getCheckersForBeat()) {
            const [elemY, elemX] = elem.id.split(' ');
            const y = this.y - elemY === 1 ? +elemY - 1 : +elemY + 1;
            const x = this.x - elemX === 1 ? +elemX - 1 : +elemX + 1;
            const cell = document.getElementById(`${y} ${x}`);
            if (cell === null) continue;
            if (!cell.innerHTML) {
                // array.push(cell); old version
                obj.set(elem, cell);
            }
        }
        return obj;
    }

    move(elem) {
        elem.append(this.body);
        this.body.classList.remove('active');
        [this.y, this.x] = elem.id.split(' ').map(x => Number(x));
        Area.clearEvent();
        Area.clearArea();
        Listener.nextMove();
    }

    moveBeat(elem, deleteElem) {
        elem.append(this.body);
        [this.y, this.x] = elem.id.split(' ').map(x => Number(x));
        Area.clearEvent();
        Area.clearArea();
        deleteElem.innerHTML = '';
        if (this.checkCheckersForBeat().size === 0) {
            this.body.classList.remove('active');
            Listener.nextMove();
        } else {
            this.addBeatStyle();
        }
    }

    defineAvailablePositionForMove() {
        if (this.color === 'firstPlayer') {
            return [`${this.y + 1} ${this.x + 1}`, `${this.y + 1} ${this.x - 1}`];
        } else {
            return [`${this.y - 1} ${this.x - 1}`, `${this.y - 1} ${this.x + 1}`];
        }
    }

    defineAvailablePositionForBeat() {
        return [
            `${this.y + 1} ${this.x + 1}`,
            `${this.y + 1} ${this.x - 1}`,
            `${this.y - 1} ${this.x - 1}`,
            `${this.y - 1} ${this.x + 1}`
        ];
    }

    getAvailable() {
        const availableMoves = [];
        for (const move of this.defineAvailablePositionForMove()) {
            const elem = document.getElementById(move);
            if (elem === null) continue;
            if (!elem.innerHTML) availableMoves.push(elem);
        }
        return availableMoves;
    }

    getCheckersForBeat() {
        const array = [];
        for (const move of this.defineAvailablePositionForBeat()) {
            const elem = document.getElementById(move);
            if (elem === null) continue;
            if (elem.innerHTML) {
                if (elem.innerHTML.includes(this.enemy)) {
                    array.push(elem);
                }
            }
        }
        return array;
    }

    addAvailableStyle() {
        for (const elem of this.getAvailable()) {
            elem.classList.add('available');
            elem.onclick = () => this.move(elem);
        }
    }

    addBeatStyle() {
        for (const [deleteElem, elem] of this.checkCheckersForBeat().entries()) {
            elem.classList.add('beat');
            elem.onclick = () => this.moveBeat(elem, deleteElem);
        }
    }
    addActiveStyle() {
        for (const elem of Checker.#checkers) {
            elem.body.classList.remove('active');
        }
        this.body.classList.add('active');
    }

    check
    static drawOnePlayer(x, y, color, enemy, start) {
        for (let i = 0; i < 12; i++) {
            const col = document.getElementById(`${y} ${x + start}`);
            const checker = new Checker(x + start, y, color, enemy);
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
        Checker.drawOnePlayer(0, 0, 'firstPlayer', 'secondPlayer',1);
        Checker.drawOnePlayer(0, 5, 'secondPlayer', 'firstPlayer',0);
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
        const player = this.#move === 1 ? 'firstPlayer' : 'secondPlayer';
        Checker.defineMove(player);
        this.#move = this.#move === 1 ? 0 : 1;
    }
}

new Area().draw();
Checker.draw();
Listener.nextMove();