// Канвас
let WIDTH;
let HEIGHT;
let canvas = document.getElementById('canvas');
let ctx;

// Блоки
let bricks;
let NROWS;
let NCOLS;
let BRICKWIDTH;
let BRICKHEIGHT;
let PADDING;

// Пустой блок
let indexEmpty; //координаты пустого блока в матрице
let row; // координата в строке матрицы движ. блока
let col; // координата в колонке матрицы движ. блока
let directMove; //координаты направления движения
let startPosX;
let startPosY;

//Рузультат
let shuffle = 0;
let resultGame;
let timeGame;

// Мышка
let canvasMinX;
let canvasMaxX;

//Кнопки
let buttonStart = document.querySelector('#start');
let buttonResult = document.querySelector('#result');
let buttonPause = document.querySelector('#pause');
let buttonSave = document.querySelector('#save');
let countMoves = document.querySelector('#countMoves');


//----------------------------------------------------------------------
// ФУНКЦИИ РИСОВАНИЯ
//рис. одного блока
function brick(x,y,width,height,content) {
    let radius = 15

    roundedRect(x, y, width, height, radius);
    ctx.fillStyle = 'rgba(203,134,44,0.88)';
    ctx.fill();
    let x1 = x + (width*0.1);
    let y1 = y + (height*0.1);
    let w1 = width * 0.8;
    let h1 = height * 0.8;
    let r1 = radius * 0.8;
    roundedRect(x1, y1, w1, h1, r1);
    ctx.fillStyle = 'rgb(235,210,157)';
    ctx.fill();

    let diffX = 0.35;
    let diffY = 0.69;
    if (content > 9) {
        diffX = 0.2;
    }
    let fontSize = height * 0.6;
    let textX = width * diffX + x;
    let textY = height * diffY + y;
    ctx.fillStyle = "#000";
    ctx.font = `${fontSize}px Georgia`;
    ctx.fillText(content, textX, textY);
}

function roundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.stroke();
}

//рис. всех блоков
function drawbricks(moveX = 0,moveY = 0) {
  // debugger
    for (let i=0; i < NROWS; i++) {
        for (let j=0; j < NCOLS; j++) {
            if (bricks[i][j]) {
                if(moveX !== 0 || moveY !== 0) {
                    if(bricks[i][j] === bricks[row][col]){
                        brick((j * (BRICKWIDTH + PADDING)) + PADDING + moveX,
                            (i * (BRICKHEIGHT + PADDING)) + PADDING + moveY,
                            BRICKWIDTH - PADDING, BRICKHEIGHT - PADDING, bricks[i][j]);
                        continue
                    }
                }
                brick((j * (BRICKWIDTH + PADDING)) + PADDING,
                    (i * (BRICKHEIGHT + PADDING)) + PADDING,
                    BRICKWIDTH - PADDING, BRICKHEIGHT - PADDING, bricks[i][j]);

            }
        }
    }
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

//Рисование всего холста
function draw(x,y) {
    clear();
    drawbricks(x,y);
}

//----------------------------------------------------------------------
// ФУНКЦИИ ПОСТРОЕНИЯ МАТРИЦЫ
function initbricks(props) {
    NROWS = 4;
    NCOLS = 4;
    PADDING = 2;
    BRICKWIDTH = (WIDTH/NCOLS) - PADDING;
    BRICKHEIGHT = (HEIGHT/NROWS) - PADDING;
    if(props?.matrix) {
      return
    }
    const generateArray =  [...new Array(NROWS*NCOLS)].map((el, i) => i ? i : null).sort(() => .5 - Math.random())
    bricks =  new Array(NROWS);
    for (let i=0; i < NROWS; i++) {
       bricks[i] = new Array(NCOLS);
       for (let j=0; j < NCOLS; j++) {
           let current = generateArray.shift()
           if (!current) indexEmpty = [i,j]
           bricks[i][j] = current
       }
    }
    // bricks = [
    //     [1,2,3,4],
    //     [5,6,7,8],
    //     [9,10,11,12],
    //     [null,13,14,15],
    // ]
}

// Замена мест пустого блока и движущегося
function setNewEmpty(){
    bricks[indexEmpty[0]][indexEmpty[1]] = bricks[row][col]
    bricks[row][col] = null
    indexEmpty = [row,col]
}

// Проверка блока на возможность движения и возврат его направления
function checkMove(indexEmpty,row,col) {
    let touchEl = `${row},${col}`
    let up = `${indexEmpty[0] - 1},${indexEmpty[1]}`;
    let left = `${indexEmpty[0]},${indexEmpty[1] - 1}`;
    let right = `${indexEmpty[0]},${indexEmpty[1] + 1}`;
    let down = `${indexEmpty[0] + 1},${indexEmpty[1]}`;
    if(touchEl === up) return directMove = [0, -1]
    if(touchEl === left) return directMove = [1, 0]
    if(touchEl === right) return directMove = [-1, 0]
    if(touchEl === down) return directMove = [0, 1]
    return false;
}
// Получение координат блока
function getTouchBrick(x,y, brickwidth, brickheight, padding){
    let rowheight = brickheight + padding;
    let colwidth = brickwidth + padding;
    return [Math.floor(y/rowheight), Math.floor(x/colwidth)]
}

function init() {
  // debugger
    ctx = canvas.getContext('2d');
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    canvasMinX = canvas.offsetLeft;
    canvasMaxX = canvasMinX + WIDTH;
    let {matrix, empty, moves} = loadGame()
    if(matrix && empty && moves){
      bricks = matrix
      indexEmpty = empty
      shuffle = moves
      // timeGame = time
      initbricks({matrix, empty, moves});
    } else {
      initbricks();
    }
    setShuffle(shuffle)
    draw();
}
init();

//----------------------------------------------------------------------
//ФУНКЦИИ игрового процесса
function checkFinish() {
    let num = 1
    for (let i=0; i < NROWS; i++) {
        for (let j=0; j < NCOLS; j++) {
            if (bricks[i][j] !== num) return

            if(num === (NROWS*NCOLS - 1)) break
            num++
        }
    }
    alert(`игра окончена! Количество ходов: ${shuffle}`)
    resultGame = {shuffle, time}
    saveResult();
}

function setShuffle(count) {
  shuffle = count
  countMoves.innerHTML = `${shuffle}`
}

function saveResult() {
    let data = loadRes()
    if(data.length === 0) {
        localStorage.result = JSON.stringify({results: [{...resultGame, id: 0}]})
        return
    }
    let newData = [];
    for(let i=0; i < data.length; i++){
        if(resultGame.shuffle > data[i].shuffle){
            newData.push({ ...data[i], id: newData.length})
            continue
        }
        newData.push({ ...resultGame, id: data[i].id}, { ...data[i], id: data[i].id + 1})
        resultGame.shuffle = Infinity
    }
    newData  = newData.length > 10 ? newData.slice(0, newData.length - 1) : newData
    localStorage.result = JSON.stringify({results: newData})
}

function saveGame() {
    localStorage.game = JSON.stringify({matrix: bricks, empty: indexEmpty, moves: shuffle, time: timeGame})
}

function resetGame() {
    localStorage.game = JSON.stringify({})
    setShuffle(0)
    init()
}

function loadGame() {
    let res = localStorage.game ? JSON.parse( localStorage.game ) : null
    if(res?.matrix && Array.isArray(res.matrix) && Array.isArray(res.empty)) return res
    return {}
}

function loadRes() {
    let res = localStorage.result ? JSON.parse( localStorage.result ) : null
    if(res?.results && Array.isArray(res.results)) return res.results
    return []
}

buttonStart.addEventListener("pointerdown", resetGame)
// buttonResult.addEventListener("pointerdown", onMouseDown)
// buttonPause.addEventListener("pointerdown", onMouseDown)
buttonSave.addEventListener("pointerdown", saveGame)


//----------------------------------------------------------------------
//ФУНКЦИИ ВЗАИМОДЕЙСВИЯ УКАЗАТЕЛЯ

function onMouseDown(evt) {
    if (evt.offsetX > canvasMinX && evt.offsetX < canvasMaxX) {
        startPosX = evt.offsetX;
        startPosY = evt.offsetY;
        [row, col] = getTouchBrick(evt.offsetX, evt.offsetY, BRICKHEIGHT, BRICKWIDTH, PADDING)
        directMove = checkMove(indexEmpty, row, col)
        if (directMove) {
            canvas.addEventListener("pointermove", onMouseMoveMarker)
            document.addEventListener("pointerup", onMouseUpMarker)
        }
    }
}

function onMouseMoveMarker(evt) {
    let [x,y] = directMove
    if (x !== 0) {
        let newPosX = evt.offsetX - startPosX
        if ((x > 0 && newPosX >= 0 && newPosX < 76) || (x < 0 && newPosX <= 0 && newPosX > -76))
            draw(newPosX, 0)
    }
    if (y !== 0) {
        let newPosY = evt.offsetY - startPosY
        if ((y > 0 && newPosY <= 0 && newPosY > -76) || (y < 0 && newPosY >= 0 && newPosY < 76))
            draw(0, newPosY)
    }
}

function onMouseUpMarker(evt) {

    let newPosX = evt.offsetX - startPosX
    let newPosY = evt.offsetY - startPosY

    if ((newPosX > 20 || newPosX < -20) || (newPosY > 20 || newPosY < -20)){
        setNewEmpty()
        checkFinish()
        setShuffle(shuffle+1)
    }
    draw()
    canvas.removeEventListener("pointermove", onMouseMoveMarker)
    document.removeEventListener("pointerup", onMouseUpMarker)
}
canvas.addEventListener("pointerdown", onMouseDown)
canvas.ondragstart = () => false
