function randomIntFromInterval (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function circlesOverlap(x1, y1, r1, x2, y2, r2) {
    var answer = false;
    console.log("----------------------------------------");
    console.log(x1, y1, r1, x2, y2, r2);
    var a = x1 - x2
    var b = y1 - y2
    var distance = Math.sqrt( a*a + b*b );
    console.log(distance);
    console.log(r1+r2);
    if (distance < (r1 + r2)) {
        answer = true;
        console.log("It's true");
    }
    console.log(answer);
    return answer;
}