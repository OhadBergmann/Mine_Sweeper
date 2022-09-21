'use strict'

var gGameModle = {};
gGameModle.gameMode = 'Manual';

function initGame (){
    resetVariables(gGameModle.gameMode);
    handdleGameMode();
    gGameModle.board = buildBoard();
    setGameRenderer();
    if(!gGameModle.isManual){
        createSafeCells();
        randerBoard();
        layMines ( gGameModle.level.minesNum);

        }
    else {
        createSafeCells(); 
        generateEmptyBorad ();
    }
    disableContextMenu();     
}



function buildBoard() {
    var currBoard = [];
    for (let i = 0; i < gGameModle.level.size; i++) {
        currBoard[i] = [];
        for (let j = 0; j < gGameModle.level.size; j++) {
            if(gGameModle.isManual){
                currBoard[i][j] = { 
                    negsMinesCount: 0,
                    isVisible: true,
                    isMine: false,
                    hasFlag: false
                };
            } else {
                currBoard[i][j] = { 
                    negsMinesCount: 0,
                    isVisible: false,
                    isMine: false,
                    hasFlag: false
                };
            }
            
            
        }
    }

    return currBoard;
}

/* Debug buildBoard => */// console.log(currBoard);


function cellClicked(element){
    var currPos = cellPosFromElement(element);

    if(gGameModle.gameMode === 'Manual'){

        if(gGameModle.level.minesNum > 1){
            element.innerHTML = '<img src="img/cell-mine.png">';
            gGameModle.level.minesNum--;
            gGameRenderer.selectors.mineNumEl.innerText = +gGameRenderer.selectors.mineNumEl.innerText -1;
            gGameModle.board[currPos.i][currPos.j].isMine = true;
            gGameModle.safeCells.splice(gGameModle.safeCells.indexOf(currPos),1);
           

            updateCellNegs (currPos);

        }else if(gGameModle.level.minesNum === 1 ){
            element.innerHTML = '<img src="img/cell-mine.png">';
            gGameModle.level.minesNum--;
            gGameRenderer.selectors.mineNumEl.innerText = +gGameRenderer.selectors.mineNumEl.innerText -1;
            gGameModle.board[currPos.i][currPos.j].isMine = true;
            updateCellNegs (currPos);
            gGameModle.safeCells.splice(gGameModle.safeCells.indexOf(currPos),1);
            setTimeout(randerBoard,50);
        } else {
            checkGameOver(element);
            revealCell(element);
            uncoverdNegs(cellPosFromElement(element));
        }

    } else {
        checkGameOver(element);
        revealCell(element);
        uncoverdNegs(cellPosFromElement(element));
    }

    /* Debug cellClicked => */// console.log(cell);
}

/// NOTE: ths function is call when a MIDE cell is update his neighbors  
function updateCellNegs (pos){
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if(pos.i + i >= 0 && pos.i + i < gGameModle.level.size && pos.j + j >= 0 && pos.j + j < gGameModle.level.size 
                && !gGameModle.board[pos.i + i][pos.j + j].isMine){
                gGameModle.board[pos.i + i][pos.j + j].negsMinesCount++;
            }
        }
    }
}
// NOTE: i didnt added the "self" condition (i === 0 & j === 0) to the if because we are a mine
// => !gGameModle.board[i][j].isMine return false
// 

function checkGameOver(element) {
    var currPos = cellPosFromElement(element);
    var currCell = gGameModle.board[currPos.i][currPos.j];

    if(!gGameModle.timerIntervalID) startTimer(); 
    if(currCell.isMine){
        gGameModle.isGameOn = false;
        element.innerHTML = '<img src="img/cell-mine.png">';
        gGameRenderer.selectors.gameBoardEl.style.backgroundColor = 'red';
        clearInterval(gGameModle.timerIntervalID); 
        console.log('GAME OVER');
    }
}

function victorious (){
    gGameRenderer.selectors.gameBoardEl.style.backgroundColor = 'blue';
    clearInterval(gGameModle.timerIntervalID); 
    console.log('WIN');
}

function revealCell(element) {
    var currPos = cellPosFromElement(element);
    var currCell = gGameModle.board[currPos.i][currPos.j];
    gGameModle.safeCells.splice(gGameModle.safeCells.indexOf(currPos),1);
    currCell.isVisible = true;
    randerCell(currPos);
}

function expandVisible(board, elCell, pos){

}

function layMines (num){
    
    var i = -1;
    var j = -1;

    while(num > 0){
        i = getRandomInt(0,gGameModle.level.size);
        j = getRandomInt(0,gGameModle.level.size);
        if(!gGameModle.board[i][j].isMine){
            gGameModle.board[i][j].isMine = true;
            updateCellNegs({i,j});
        }
        num--;
    }
}
    


function toggleCellFlag (element){
    var currPos = cellPosFromElement(element);
    var currCell = gGameModle.board[currPos.i][currPos.j];

    if(currCell.isVisible) {return;}

    if(currCell.hasFlag){
        currCell.hasFlag = false;
        element.innerHTML = '<img src="img/cell-covered.png">';
        gGameModle.flagsCount++;
        gGameRenderer.selectors.flagsNumEl.innerText = gGameModle.flagsCount; 

    } else if(gGameModle.flagsCount > 0){
        currCell.hasFlag = true;
        element.innerHTML = '<img src="img/cell-covered-n-flaged.png">';
        gGameModle.flagsCount--;
        gGameRenderer.selectors.flagsNumEl.innerText = gGameModle.flagsCount; 
    }
}

function mouseClicked(event, element){
    if(!gGameModle.isGameOn) return;
    switch(event.which){
        case 1: 
            cellClicked(element);
            break;
        case 3:
            toggleCellFlag(element);
            break;
    } 
}

function resetVariables(mode) {
    gGameModle = {};
    var size = 4;
    var amount = 2;

    switch (mode) {
        case 'Manual':
            gGameModle.isManual = true;
            break;
        case 'Easy':
            break;
        case 'Medium':
            size = 8;
            amount = 14;
            break;
        case 'Hard':
            size = 8;
            amount = 32;
            break;
        default:
            gGameModle.gameMode = 'Manual';
            gGameModle.isManual = true;
            break;
    }

    if(gGameModle === undefined){
        gGameModle.isGameOn = true;
        gGameModle.visiblesCounter = 0;
        gGameModle.flagsCount = amount;

        gGameModle.secPassed = 0;
        gGameModle.gameMode = mode;
        gGameModle.level = {
            size: size, 
            minesNum: amount
        }; 
        gGameModle.safeCells = [];
    } else {
        gGameModle.isGameOn = true;
        gGameModle.visiblesCounter = 0;
        gGameModle.flagsCount = amount;
        gGameModle.secPassed = 0;

        gGameModle.gameMode = mode;
        gGameModle.level = {
                size: size, 
                minesNum: amount
            };
        gGameModle.safeCells = []; 
    } 
}

function startTimer(){
    var lastDate = new Date();
    var CurrDate;
    gGameModle.timerIntervalID = setInterval(()=>{
        CurrDate = new Date();
        if(Math.floor((CurrDate - lastDate)/1000)>= 1){
            gGameModle.secPassed++;           
            gGameRenderer.selectors.timerEl.innerText = IntTo4DigitsStr(gGameModle.secPassed);
        }
        lastDate = CurrDate;
    },1050);
}

function createSafeCells (){
    for (let i = 0; i < gGameModle.level.size; i++) {
        for (let j = 0; j < gGameModle.level.size; j++) {
            gGameModle.safeCells.push({i,j}); 
        }
    }
    console.log('safeCells', gGameModle.safeCells.length);
}

function IntTo4DigitsStr(num){
    var str = num + '';
    if(str.length >= 4) return;

    while(str.length < 4){
        str = '0' + str
    }
    return str;
}


