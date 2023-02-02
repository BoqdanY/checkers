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

    static createArea() {
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

    static draw() {
        this.createArea();
        const baza = document.getElementById('baza');
        for (const cols of Area.area) {
            const row = document.createElement('div');
            row.id = 'row';
            for (const col of cols) {
                row.append(col);
            }
            baza.append(row);
        }
    }
}

class Checker {
    static checkers = [];
    static checkersNumber = 12;

    constructor(x, y, color, enemy) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.enemy = enemy;
        this.body = document.createElement('div');
        this.body.classList.add('checker');
        this.body.classList.add(color);
        Checker.checkers.push(this);
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
                obj.set(elem, cell);
            }
        }
        return obj;
    }

    checkKing() {
        if (this.color === 'firstPlayer') {
            if (this.y === 7) {
                this.body.remove();
                new King(this.x, this.y, this.color, this.enemy);
            }
        } else {
            if (this.y === 0) {
                this.body.remove();
                new King(this.x, this.y, this.color, this.enemy);
            }
        }
    }

    move(elem) {
        elem.append(this.body);
        this.body.classList.remove('active');
        [this.y, this.x] = elem.id.split(' ').map(x => Number(x));
        Area.clearEvent();
        Area.clearArea();
        this.checkKing();
        Listener.nextMove();
    }

    moveBeat(elem, deleteElem) {
        elem.append(this.body);
        [this.y, this.x] = elem.id.split(' ').map(x => Number(x));
        Area.clearEvent();
        Area.clearArea();
        Panel.changeScore(this.color);
        deleteElem.innerHTML = '';
        if (this.checkCheckersForBeat().size === 0) {
            this.body.classList.remove('active');
            this.checkKing();
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
        for (const elem of Checker.checkers) {
            elem.body.classList.remove('active');
        }
        for (const elem of King.kings) {
            elem.body.classList.remove('active');
        }
        this.body.classList.add('active');
    }

    static drawOnePlayer(x, y, color, enemy, start) {
        for (let i = 0; i < Checker.checkersNumber; i++) {
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
        for (const elem of this.checkers) {
            if (elem.body.classList.contains(player)) {
                elem.activate();
            }
            else {
                elem.deactivate()
            }
        }
    }
}

class King {
    static kings = [];

    constructor(x, y, color, enemy) {
        this.x = x;
        this.y = y;
        this.enemy = enemy;
        this.color = color;
        this.body = document.createElement('div');
        this.body.id = `${y} ${x}`;
        this.body.classList.add('checker');
        this.body.classList.add(`king${color}`);
        King.kings.push(this);
        this.drawKing();
    }

    drawKing() {
        document.getElementById(`${this.y} ${this.x}`).append(this.body);
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
        Area.clearArea()
        Area.clearEvent()
        this.addAvailableStyle();
        this.addBeatStyle();
    }

    checkMovesForBeat() {
        const obj = new Map();
        for (const elem of this.getMovesForBeat()) {
            const array = [];
            const [elemY, elemX] = elem.id.split(' ');
            let i = 1;
            while(true) {
                const y = this.y - elemY >= 1 ? +elemY - i : +elemY + i;
                const x = this.x - elemX >= 1 ? +elemX - i : +elemX + i;
                const cell = document.getElementById(`${y} ${x}`);
                if (cell === null) break;
                if (!cell.innerHTML) {
                    array.push(cell);
                }
                i++;
            }
            if (array.length !== 0) obj.set(elem, array);
        }
        return obj;
    }

    getAvailableMoves() {
        const array = [];
        this.defineMoves(1, 1, array);
        this.defineMoves(-1, -1, array);
        this.defineMoves(1, -1, array);
        this.defineMoves(-1, 1, array);
        return array;
    }

    getMovesForBeat() {
        const array = [];
        this.defineMovesForBeat(1, 1, array);
        this.defineMovesForBeat(-1, -1, array);
        this.defineMovesForBeat(1, -1, array);
        this.defineMovesForBeat(-1, 1, array);
        return array;
    }

    defineMoves (y, x, array) {
        for (let i = 1; i < 8; i++) {
            const elem = document.getElementById(`${this.y + i * y} ${this.x + i * x}`);
            if (elem) {
                if (elem.innerHTML === '') {
                    array.push(elem);
                } else break;
            } else break;
        }
    }

    defineMovesForBeat(y, x, array) {
        for (let i = 1; i < 8; i++) {
            const elem = document.getElementById(`${this.y + i * y} ${this.x + i * x}`);
            if (elem) {
                if (elem.innerHTML.includes(this.enemy)) {
                    array.push(elem);
                    break;
                }
            }
        }
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
        Panel.changeScore(this.color);
        deleteElem.innerHTML = '';
        console.log(this.checkMovesForBeat());
        if (this.checkMovesForBeat().size === 0) {
            this.body.classList.remove('active');
            Listener.nextMove();
        } else {
            this.addBeatStyle();
        }
    }

    addAvailableStyle() {
        for (const elem of this.getAvailableMoves()) {
            elem.classList.add('available');
            elem.onclick = () => this.move(elem);
        }
    }

    addActiveStyle() {
        for (const elem of King.kings) {
            elem.body.classList.remove('active');
        }
        for (const elem of Checker.checkers) {
            elem.body.classList.remove('active');
        }
        this.body.classList.add('active');
    }

    addBeatStyle() {
        for (const [deleteElem, array] of this.checkMovesForBeat().entries()) {
            for (const elem of array) {
                elem.classList.add('beat');
                elem.onclick = () => this.moveBeat(elem, deleteElem);
            }
        }
    }

    static defineMove(player) {
        for (const elem of this.kings) {
            if (elem.body.classList.contains(`king${player}`)) {
                elem.activate();
            }
            else {
                elem.deactivate()
            }
        }
    }
}

class Listener {
    static move = Math.round(Math.random());

    static nextMove() {
        const player = this.move === 1 ? 'firstPlayer' : 'secondPlayer';
        this.changeColor(player);
        Checker.defineMove(player);
        King.defineMove(player);
        this.move = this.move === 1 ? 0 : 1;
    }

    static changeColor(player) {
        const color = document.getElementById('color');
        color.className = '';
        color.classList.add(player);
    }
}

class Panel {
    static changeScore(player) {
        const elem = document.getElementById(`${player}Score`);
        elem.innerHTML = +elem.innerHTML + 1;
        this.checkWin(elem, player);
    }

    static checkWin(elem, player) {
        if (+elem.innerHTML === Checker.checkersNumber) {
            document.getElementById('win').innerHTML = `${player} won!`;
            setTimeout(() => Listener.changeColor(player));
        }
    }
}

Area.draw();
Checker.draw();
Listener.nextMove();