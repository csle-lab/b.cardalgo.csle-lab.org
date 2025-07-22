import Canvas from './canvas.js';

var canvas, logData;

window.onload = function () {
    canvas = new Canvas(document.getElementById('analytics_view_canvas'));

    document.getElementById('log_file').addEventListener('change', function (e) {
        var file_reader = new FileReader();
        file_reader.addEventListener('load', updateLog);
        file_reader.readAsText(e.target.files[0]);
    });
    document.getElementById('tl_canvas').addEventListener('mouseover', mouseOverCanvasLog);
}

function updateLog(e) {
    var str = e.target.result;
    logData = JSON.parse(`[${str.substr(0, str.length - 2)}]`);
    logData.sort(function (a, b) {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
    });
    var canvasBox = document.getElementById('tl_canvas');
    canvasBox.innerHTML = '';
    var operationBox = document.getElementById('tl_operation');
    operationBox.innerHTML = '';

    var previousPos = 100;
    var previousTime = Date.parse(logData[0]['time']);
    for (var f of logData) {
        var pos = previousPos + (Date.parse(f['time']) - previousTime) / 10;
        if (pos > previousPos + 1000) {
            pos = previousPos + 1000;
            operationBox.innerHTML += `<span class="line" style="top: ${previousPos + 500}px;"></span>`;
        }
        if (f['canvas']) {
            canvasBox.innerHTML += `<span style="top: ${pos}px;">${f['time']}</span>`;
        }
        else {
            operationBox.innerHTML += `<span class="${f['short']}" style="top: ${pos}px;">${f['long']}</span>`;
        }
        previousPos = pos;
        previousTime = Date.parse(f['time']);
    }
}

function mouseOverCanvasLog(e) {
    for (var f of logData) {
        if (f['time'] == e.target.innerHTML && f['canvas']) {
            canvas.importJSON(f['canvas']);
            break;
        }
    }
}