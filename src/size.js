'use strict';

window.addEventListener('resize', (e) => {
    resize();
});

function resize() {
    const pageWidth = document.documentElement.scrollWidth;
    const pageHeight = document.documentElement.scrollHeight;
    const oneColSize = pageWidth <= pageHeight ? (pageWidth - 100) / 8 : (pageHeight - 100) / 8;
    for (const elem of document.getElementsByClassName('col')) {
        elem.style.width = `${oneColSize}px`;
        elem.style.height = `${oneColSize}px`;
    }
    console.log(pageWidth, pageHeight);
}

resize();