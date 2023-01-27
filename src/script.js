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

