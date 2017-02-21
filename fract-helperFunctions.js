function randomIntFromInterval (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function do2circlesOverlap(x1, y1, r1, x2, y2, r2) {
    var answer = false;
    var distance = Math.sqrt((Math.pow(x1-x2, 2) + Math.pow(y1-y2), 2));
    if (distance < (r1 + r2)) {
        answer = true;
    }
    return answer;
}