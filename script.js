let o_ani = `<svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30"
        fill="transparent"
        stroke-linecap="round"
        stroke="#1EA0CF"
        stroke-width="5"
        stroke-dasharray="250"
        stroke-dashoffset="0">
        <animate
          attributeName="stroke-dashoffset"
          from="250" to="0"
          dur="500ms"
          rotate="clockwise"
          begin="0"
          repeatCount="1"/>
      </circle>
    </svg>`;

let o = `<svg width="100px" height="100px" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="30"
            fill="transparent"
            stroke-linecap="round"
            stroke="#1EA0CF"
            stroke-width="5"
            stroke-dasharray="250"
            stroke-dashoffset="0">
          </circle>
        </svg>`;

let x_ani = `<svg width="100" height="100" viewBox="0 0 100 100">
<line x1="70" y1="30" x2="70" y2="30" stroke="#FFBF00" stroke-width="20">
    <animate attributeName="x2" from="70" to="30" dur="250ms" fill="freeze"/>
    <animate attributeName="y2" from="30" to="70" dur="250ms" fill="freeze"/>
</line>
<line x1="30" y1="30" x2="30" y2="30" stroke="#FFBF00" stroke-width="20">
    <animate attributeName="x2" from="30" to="70" begin="250ms" dur="250ms" fill="freeze"/>
    <animate attributeName="y2" from="30" to="70" begin="250ms" dur="250ms" fill="freeze"/>
</line>
</svg>`;

let x = `<svg width="100px" height="100px" viewBox="0 0 100 100">
<line x1="70" y1="30" x2="30" y2="70" stroke="#FFBF00" stroke-width="20">
</line>
<line x1="30" y1="30" x2="70" y2="70" stroke="#FFBF00" stroke-width="20">
</line>
</svg>`;

let empty = `<svg width="100" height="100"></svg>`;

let X = "X";
let O = "O";
let last = null;

let board = Array(9).fill(null);
let currentplayer = X;

function start() {
    activePlayer();
    renderBoard(board);
}

function renderBoard(board) {
    let html = "<table>";
    for (let i = 0; i < 3; i++) {
        html += "<tr>";
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let value = "";
            if (index == last) {
                value = renderActiveCell(board[index]);
            } else {
                value = renderCell(board[index]);
            }
            html += `<td onclick="handleClick(${index})">${value || ""}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("board").innerHTML = html;
}

function renderCell(value) {
    let output = "";
    if (value == "X") {
        output = o;
    }
    else if (value == "O") {
        output = x;
    }
    else {
        output = empty;
    }
    return output;
}

function renderActiveCell(value) {
    let output = "";
    if (value == "X") {
        output = o_ani;
    }
    else if (value == "O") {
        output = x_ani;
    }
    else {
        output = empty;
    }
    return output;
}

function checkGameStatus(board) {
    let winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        let a = board[pattern[0]];
        let b = board[pattern[1]];
        let c = board[pattern[2]];
        if (a && a == b && a == c) {
            // Speichern Sie die Koordinaten der Gewinnzeile oder -spalte
            let winLine = pattern;
            // Zeichnen Sie eine Linie über die Gewinnzeile oder -spalte
            drawLine(winLine);
            return a;
        }
    }
    if (board.every(value => value)) {
        return "Unentschieden";
    }
    return null;
}

function handleClick(index) {
    if (board[index] || checkGameStatus(board)) {
        return;
    }
    last = index;
    board[index] = currentplayer;
    let status = checkGameStatus(board);
    if (status) {
        if (status == "Unentschieden") {
            document.getElementById("result").innerHTML = status;
        } else {
            document.getElementById("result").innerHTML = `${renderActiveCell(status)} hat gewonnen!`;   
        }
        document.getElementById("player").style.visibility = 'hidden';
        document.getElementById("again").style.visibility = 'visible';
    } else {
        switchPlayer();
    }
    start();
}

function activePlayer() {
    let player = renderCell(currentplayer);
    let html = `Am Zug: ${player}`;
    document.getElementById("player").innerHTML = html;
}

function switchPlayer() {
    if (currentplayer == X) {
        currentplayer = O;
    } else {
        currentplayer = X;
    }
}

function drawLine(winLine) {
    let x1 = calcX(winLine[0]);
    let x2 = calcX(winLine[2]);
    let y1 = calcY(winLine[0]);
    let y2 = calcY(winLine[2]);
    let canvas = document.getElementById("mycanvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = "5";
    ctx.strokeStyle = "#c00";
    ctx.stroke();
    document.getElementById("mycanvas").style.visibility = "visible";
}

function calcX(winvar) {
    let x = 105;
    let offset = -53;
    let row_offset = 0;
    if (winvar <= 2) {
        row_offset = 0;
    }
    else if (winvar > 2 && winvar <= 5) {
        row_offset = -x * 3;
    }
    else {
        row_offset = -x * 6;
    }
    let output = (winvar * x + row_offset) - offset;
    return output;
}

function calcY(winvar) {
    let y = 110;
    let offset = 53;
    let y_offset = 0;
    if (winvar <= 2) {
        y_offset = 0;
    }
    else if (winvar > 2 && winvar <= 5) {
        y_offset = y;
    }
    else {
        y_offset = y * 2;
    }
    let output = y_offset + offset;
    return output;
}

function startAgain() {
    last = null;
    board = Array(9).fill(null);
    document.getElementById("mycanvas").style.visibility = "hidden";
    document.getElementById("again").style.visibility = "hidden";
    document.getElementById("result").innerHTML = '';
    currentplayer = X;
    start();
}