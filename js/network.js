import Utility from './utility.js';
export default class Network {
    static uploadCanvas(canvas, prefix) {
        var param = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                time: Utility.getTime(),
                canvas: canvas.exportJSON(),
            })
        };
        // Network.uploadRequest('../sort/php/upload_canvas.php', param);
    }

    static downloadCanvas(prefix, username, func) {
        var param = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };
        // Network.downloadRequest(`../sort/canvas/${prefix}_canvas_${username}.json`, param, func);
    }

    static uploadOperationLog(short, long, prefix) {
        var param = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                time: Utility.getTime(),
                short: JSON.stringify(short),
                long: JSON.stringify(long),
            })
        };
        // Network.uploadRequest('../sort/php/upload_operation.php', param);
    }

    static uploadSimpleLog(step, length, error) {
        if (Utility.getQuery('algorithm') && Utility.getQuery('pattern')) {
            var type = 'default';
            if (Utility.getQuery('algorithm') == 'bubble_sort') {
                if (document.getElementById('animation_canvas')) {
                    if (Utility.getQuery('pattern') == '1') {
                        type = 'bubble1';
                    }
                }
                if (document.getElementById('practice_canvas')) {
                    if (Utility.getQuery('pattern') == '1') {
                        type = 'bubble2';
                    }
                    if (Utility.getQuery('pattern') == '2') {
                        type = 'bubble3';
                    }
                }
            }
            if (Utility.getQuery('algorithm') == 'selection_sort') {
                if (document.getElementById('animation_canvas')) {
                    if (Utility.getQuery('pattern') == '3') {
                        type = 'selection1';
                    }
                }
                if (document.getElementById('practice_canvas')) {
                    if (Utility.getQuery('pattern') == '3') {
                        type = 'selection2';
                    }
                    if (Utility.getQuery('pattern') == '4') {
                        type = 'selection3';
                    }
                }
            }
            var play;
            if (document.getElementById('btn_play') === null || document.getElementById('btn_play').value == '▶') {
                play = '0';
            }
            else {
                play = document.getElementById('animation_interval').value;
            }
            var param = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: type,
                    time: Utility.getTime(),
                    step: JSON.stringify(step),
                    length: JSON.stringify(length),
                    error: JSON.stringify(error),
                    play: play,
                })
            };
            // Network.uploadRequest('../sort/php/upload_simple.php', param);
        }
        else {
            console.log('query undefined');
        }
    }

    static downloadRequest(url, param, func) {
        fetch(url, param)
            .then(response => response.json())
            .then(json => {
                func(json);
            })
            .catch(error => {
                console.log(`[Request Error] ${error}`);
            });
    }

    static uploadRequest(url, param, func) {
        if (this.time == null) this.time = Date.now();
        if (Date.now() - this.time > 1000 * 60 * 30) {
            console.log('timeout');
            return;
        }
        fetch(url, param)
            .then(response => response.json())
            .then(json => {
                if (!json.status) {
                    console.log(`[Server Error] ${json.result}`);
                }
            })
            .catch(error => {
                console.log(`[Request Error] ${error}`);
            });
    }
}
