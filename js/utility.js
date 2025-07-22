export default class Utility {
    static easeInOut(t, maxT, a, b) { // a -> a + b
        if (t <= 0) return a;
        if (t >= maxT) return a + b;
        t /= maxT / 2; // 0 -> 1 -> 2
        if (t < 1)
            return a + (b / 2) * Math.pow(1.2, 30 * (t - 1));
        return a + b - (b / 2) * Math.pow(1.2, 30 * (1 - t));
    }

    static easeOut(t, maxT, a, b) {
        if (t <= 0) return a;
        if (t >= maxT) return a + b;
        t /= maxT;
        return a + b - b * Math.pow(1.2, -30 * t);
    }

    static shuffleArray(a, l, r) {
        var b = a.slice(l, r).sort(() => Math.random() - 0.5);
        for (var i = l; i < r; i++) {
            a[i] = b[i - l];
        }
    }

    static generateRandomArray(l, r, n) { // [l, r] * n
        var tmp = [];
        for (var i = l; i <= r; i++) {
            tmp.push(i);
        }
        Utility.shuffleArray(tmp, 0, r - l + 1);
        var res = [];
        for (var i = 0; i < n; i++) {
            res.push(tmp[i]);
        }
        return res;
    }

    static getTime() {
        var date = new Date();
        var y = date.getFullYear();
        var mo = ('00' + (date.getMonth() + 1)).slice(-2);
        var d = ('00' + date.getDate()).slice(-2);
        var h = ('00' + date.getHours()).slice(-2);
        var mi = ('00' + date.getMinutes()).slice(-2);
        var s = ('00' + date.getSeconds()).slice(-2);
        var ms = ('000' + date.getMilliseconds()).slice(-3);
        return y + '-' + mo + '-' + d + ' ' + h + ':' + mi + ':' + s + '.' + ms;
    }

    static getQuery(name) {
        if (1 < window.location.search.length) {
            var query = window.location.search.substring(1);
            var parameters = query.split('&');
            for (var p of parameters) {
                var element = p.split('=');
                var paramName = decodeURIComponent(element[0]);
                var paramValue = decodeURIComponent(element[1]);
                if (name == paramName) return paramValue;
            }
        }
        return null;
    }

    static compareSets(lhs, rhs) {
        if (lhs.size != rhs.size) return false;
        for (var l of lhs) {
            if (!rhs.has(l)) return false;
        }
        return true;
    }

    static compareObject(lhs, rhs) {
        return JSON.stringify(lhs) == JSON.stringify(rhs);
    }
}
