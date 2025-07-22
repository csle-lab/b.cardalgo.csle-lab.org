import Utility from './utility.js';
import Config from './config.js';
import Network from './network.js';

import BubbleSortAnimation from './bubble_sort_animation.js';
import SelectionSortAnimation from './selection_sort_animation.js';

import ArraySortPractice from './array_sort_practice.js';
import BubbleSortPractice from './bubble_sort_practice.js';
import SelectionSortPractice from './selection_sort_practice.js';

var animation, practice;

window.onload = function () {
    var algorithmName = Utility.getQuery('algorithm');

    if (algorithmName !== null && algorithmName in Config.algorithmToTitle) {
        for (var ele of document.getElementsByClassName('algorithmName')) {
            ele.innerHTML = Config.algorithmToTitle[algorithmName];
        }
    }

    if (document.getElementById('animation_canvas')) {
        Network.uploadOperationLog('onload', `onload ${algorithmName}`, 'animation');

        var algorithm = null;
        switch (algorithmName) {
            case 'bubble_sort':
                algorithm = BubbleSortAnimation;
                break;
            case 'selection_sort':
                algorithm = SelectionSortAnimation;
                break;
        }
        animation = new algorithm(document.getElementById('animation_canvas'));

        window.animationShuffle = shuffle;
        window.animationBegin = animationBegin;
        window.animationBack = animationBack;
        window.animationPlay = animationPlay;
        window.animationAdvance = animationAdvance;
        window.animationMakeAllTransparent = makeAllTransparent;
        window.animationSet = set;

        var canvas = document.getElementById('animation_canvas');
        canvas.addEventListener('mousemove', animationMouseMove, false);
        canvas.addEventListener('mouseleave', animationMouseMove, false);

        document.onkeydown = function (event) {
            if (event.key == 'ArrowLeft') {
                animationBack();
            }
            if (event.key == 'ArrowRight') {
                animationAdvance();
            }
        };
    }

    if (document.getElementById('practice_canvas')) {
        Network.uploadOperationLog('onload', `onload ${algorithmName}`, 'practice', Utility.getQuery('username'));

        var algorithm = null;
        switch (algorithmName) {
            case 'array_sort':
                algorithm = ArraySortPractice;
                break;
            case 'tree_sort':
                algorithm = TreeSortPractice;
                break;
            case 'bubble_sort':
                algorithm = BubbleSortPractice;
                break;
            case 'selection_sort':
                algorithm = SelectionSortPractice;
                break;
            case 'selection_sort_slow':
                algorithm = SelectionSortSlowPractice;
                break;
            case 'heap_sort':
                algorithm = HeapSortPractice;
                break;
        }
        practice = new algorithm(document.getElementById('practice_canvas'));

        window.practiceShuffle = shuffle;
        window.practiceBegin = practiceBegin;
        window.practiceBack = practiceBack;
        window.practiceSet = set;

        var canvas = document.getElementById('practice_canvas');
        if ('ontouchstart' in window) {
            canvas.addEventListener('touchstart', practiceTouchDown, false);
            canvas.addEventListener('touchmove', practiceTouchMove, false);
            canvas.addEventListener('touchend', practiceTouchUp, false);
            canvas.addEventListener('touchcancel', practiceTouchUp, false);
        }
        else {
            canvas.addEventListener('mousedown', practiceMouseDown, false);
            canvas.addEventListener('mousemove', practiceMouseMove, false);
            canvas.addEventListener('mouseup', practiceMouseUp, false);
            canvas.addEventListener('mouseleave', practiceMouseUp, false);
        }
    }

    //window.shuffle = shuffle;
    //window.set = set;
    //shuffle();

    var array = [5, 4, 3, 2, 1];
    switch (Utility.getQuery('pattern')) {
        case '1':
            array = [60, 44, 98, 72, 19];
            if (algorithmName !== null && algorithmName in Config.algorithmToTitle) {
                document.getElementById('title').innerHTML = document.getElementsByTagName('title')[0].innerHTML =`カードを並び替えて確認！ (${Config.algorithmToTitle[algorithmName]})`;
            }
            break;
        case '2':
            array = [76, 37, 85, 51, 23];
            if (algorithmName !== null && algorithmName in Config.algorithmToTitle) {
                document.getElementById('title').innerHTML = document.getElementsByTagName('title')[0].innerHTML =`自力でカードの並び替えに挑戦！ (${Config.algorithmToTitle[algorithmName]})`;
            }
            Config.guideDelay = 1000000000;
            break;
        case '3':
            array = [55, 80, 12, 43, 71];
            if (algorithmName !== null && algorithmName in Config.algorithmToTitle) {
                document.getElementById('title').innerHTML = document.getElementsByTagName('title')[0].innerHTML =`カードを並び替えて確認！ (${Config.algorithmToTitle[algorithmName]})`;
            }
            break;
        case '4':
            array = [40, 22, 18, 93, 51];
            if (algorithmName !== null && algorithmName in Config.algorithmToTitle) {
                document.getElementById('title').innerHTML = document.getElementsByTagName('title')[0].innerHTML =`自力でカードの並び替えに挑戦！ (${Config.algorithmToTitle[algorithmName]})`;
            }
            Config.guideDelay = 1000000000;
            break;
    }

    if (animation) {
        animation.set(array);
    }
    if (practice) {
        practice.set(array);
    }
}

export function shuffle() {
    var array = Utility.generateRandomArray(10, 98, 7);

    if (animation) Network.uploadOperationLog('shuffle', `shuffle ${array}`, 'animation');
    if (practice) Network.uploadOperationLog('shuffle', `shuffle ${array}`, 'practice');

    if (animation) animation.set(array);
    if (practice) practice.set(array);
}

export function set(id) {
    var input = document.getElementById(id).value;
    
    if (input in Config.pattern) {
        if (animation) {
            animation.set(Config.pattern[input]);
            animation.addMessage('現在の入力: ' + input);
            if (Config.patternOnTheWay.includes(input) && animation.skipFirstHalf) {
                animation.skipFirstHalf();
            }
        }
        if (practice) {
            practice.set(Config.pattern[input]);
            practice.addMessage('現在の入力: ' + input);
            if (Config.patternOnTheWay.includes(input) && practice.skipFirstHalf) {
                practice.skipFirstHalf();
            }
        }
        document.getElementById(id).value = '';
        return;
    }

    if (input == '') {
        alert('入力を選んでから「入力セット」ボタンを押してください');
        return;
    }
    var splits = input.split(',');
    if (splits.length > 7) {
        alert('入力は 7 個までです');
        return;
    }
    var array = [];
    for (var s of splits) {
        var int = parseInt(s);
        if (isNaN(int)) {
            alert('入力のフォーマットが間違っています');
            return;
        }
        if (int > 999) {
            alert('入力された数が大きすぎます');
            return;
        }
        array.push(parseInt(s));
    }
    if (animation) {
        animation.set(array);
        animation.addMessage('現在の入力: ' + input);
    }
    if (practice) {
        practice.set(array);
        practice.addMessage('現在の入力: ' + input);
    }
    document.getElementById(id).value = '';
}

/* animation */

export function animationBegin() {
    Network.uploadOperationLog('begin', 'begin', 'animation');
    animation.begin();
}

export function animationBack() {
    Network.uploadOperationLog('back', 'back', 'animation');
    animation.back();
}

var timeoutID = -1;
export function animationPlay() {
    Network.uploadOperationLog('play', 'play', 'animation');
    if (timeoutID == -1) {
        document.getElementById('btn_play').value = '■';
        var func = function () {
            if (animation.advance() == 1) {
                document.getElementById('btn_play').value = '▶';
                timeoutID = -1;
                return;
            }
            timeoutID = setTimeout(func, getAnimationInterval());
        };
        func();
    }
    else {
        document.getElementById('btn_play').value = '▶';
        clearTimeout(timeoutID);
        timeoutID = -1;
    }
}

export function animationAdvance() {
    Network.uploadOperationLog('advance', 'advance', 'animation');
    animation.advance();
}

export function makeAllTransparent() {
    Network.uploadOperationLog('makeAllTransparent', `makeAllTransparent ${checkbox_make_all_transparent.checked}`, 'animation');
}

function getAnimationInterval() {
    var ele = document.getElementById('animation_interval');
    return {
        '1': 3000,
        '2': 2000,
        '3': 1000,
        '4': 700,
        '5': 400,
        '6': 300,
    }[ele.value];
}

export function animationMouseMove(e) {
    var width = document.getElementById('animation_canvas').width;
    var height = document.getElementById('animation_canvas').height;
    var rect = e.target.getBoundingClientRect();
    var x = (e.clientX - rect.left) * width / (rect.right - rect.left);
    var y = (e.clientY - rect.top) * height / (rect.bottom - rect.top);
    animation.mouseMove(x, y);
}

/* practice */

export function practiceBegin() {
    Network.uploadOperationLog('begin', 'begin', 'practice');
    practice.begin();
}

export function practiceBack() {
    Network.uploadOperationLog('back', 'back', 'practice');
    practice.back();
}

export function practiceMouseDown(e) {
    var width = document.getElementById('practice_canvas').width;
    var height = document.getElementById('practice_canvas').height;
    var rect = e.target.getBoundingClientRect();
    var x = (e.clientX - rect.left) * width / (rect.right - rect.left);
    var y = (e.clientY - rect.top) * height / (rect.bottom - rect.top);

    Network.uploadOperationLog('mDown', `mDown ${Math.round(x)} ${Math.round(y)}`, 'practice');

    practice.pointerDown(-1, x, y);
}

export function practiceMouseMove(e) {
    var width = document.getElementById('practice_canvas').width;
    var height = document.getElementById('practice_canvas').height;
    var rect = e.target.getBoundingClientRect();
    var x = (e.clientX - rect.left) * width / (rect.right - rect.left);
    var y = (e.clientY - rect.top) * height / (rect.bottom - rect.top);

    practice.pointerMove(-1, x, y);
}

export function practiceMouseUp(e) {
    var width = document.getElementById('practice_canvas').width;
    var height = document.getElementById('practice_canvas').height;
    var rect = e.target.getBoundingClientRect();
    var x = (e.clientX - rect.left) * width / (rect.right - rect.left);
    var y = (e.clientY - rect.top) * height / (rect.bottom - rect.top);

    Network.uploadOperationLog('mUp', `mUp ${Math.round(x)} ${Math.round(y)}`, 'practice');

    practice.pointerUp(-1, x, y);
}

export function practiceTouchDown(e) {
    var width = document.getElementById('practice_canvas').width;
    var height = document.getElementById('practice_canvas').height;
    var rect = e.target.getBoundingClientRect();
    for (var t of e.targetTouches) {
        var x = (t.clientX - rect.left) * width / (rect.right - rect.left);
        var y = (t.clientY - rect.top) * height / (rect.bottom - rect.top);

        Network.uploadOperationLog('tDown', `tDown ${Math.round(x)} ${Math.round(y)}`, 'practice');

        practice.pointerDown(t.identifier, x, y);
    }
}

export function practiceTouchMove(e) {
    var width = document.getElementById('practice_canvas').width;
    var height = document.getElementById('practice_canvas').height;
    var rect = e.target.getBoundingClientRect();
    for (var t of e.targetTouches) {
        var x = (t.clientX - rect.left) * width / (rect.right - rect.left);
        var y = (t.clientY - rect.top) * height / (rect.bottom - rect.top);

        practice.pointerMove(t.identifier, x, y);
    }
}

export function practiceTouchUp(e) {
    var width = document.getElementById('practice_canvas').width;
    var height = document.getElementById('practice_canvas').height;
    var rect = e.target.getBoundingClientRect();
    for (var t of e.changedTouches) {
        var x = (t.clientX - rect.left) * width / (rect.right - rect.left);
        var y = (t.clientY - rect.top) * height / (rect.bottom - rect.top);

        Network.uploadOperationLog('tUp', `tUp ${Math.round(x)} ${Math.round(y)}`, 'practice');

        practice.pointerUp(t.identifier, x, y);
    }
}
