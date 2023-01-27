'use strict';
class Area {
    constructor() {
        this.array = [];
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
            this.array.push(arr);
        }
    }
    draw() {
        const baza = document.getElementById('baza');
        for (const cols of this.array) {
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
    constructor(color) {
        this.body = document.createElement('div');
        if (color === 'green') {
            this.body.classList.add('chest');
            this.body.classList.add('chestGreen');
        } else {
            this.body.classList.add('chest');
            this.body.classList.add('chestRed');
        }
    }
    static drawOnePlayer(x, y, color, start) {
        for (let i = 0; i < 12; i++) {
            const col = document.getElementById(`${y} ${x + start}`);
            const checker = new Checker(color);
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
        Checker.drawOnePlayer(0, 0, 'green', 1);
        Checker.drawOnePlayer(0, 5, 'chestRed', 0);
    }
}

new Area().draw();
Checker.draw();
