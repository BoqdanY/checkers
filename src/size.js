'use strict';

window.addEventListener('resize', (e) => {
    resize();
});

function resize() {
    const pageWidth = document.documentElement.scrollWidth;
    const pageHeight = document.documentElement.scrollHeight;
    const oneColSize = pageWidth >= pageHeight ? (pageHeight - 100) / 8 : (pageWidth - 100) / 8;
    document.getElementById('color').style.height = `${oneColSize}px`;
    document.getElementById('color').style.width = `${oneColSize}px`;
    document.getElementById('firstPlayer').style.width = `${oneColSize - 20}px`;
    document.getElementById('firstPlayer').style.height = `${oneColSize - 20}px`;
    document.getElementById('secondPlayer').style.width = `${oneColSize - 20}px`;
    document.getElementById('secondPlayer').style.height = `${oneColSize - 20}px`;
    for (const elem of document.getElementsByClassName('col')) {
        elem.style.width = `${oneColSize}px`;
        elem.style.height = `${oneColSize}px`;
    }
}

resize();