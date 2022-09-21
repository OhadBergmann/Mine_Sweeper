'use strict'

var gGameModle;

function initGame (){
    resetVariables(4,2,'manual');
    gGameModle.board = buildBoard();
    generateEmptyBorad ();
    handdleGameMode();
    disableContextMenu()
}

function resetVariables(size, minesamount, gameMode) {
    gGameModle = {};
    gGameModle.isOn = true;
    gGameModle.visiblesCounter = 0;
    gGameModle.flagsCount = minesamount;
    gGameModle.secPassed = 0;
    gGameModle.gameMode = gameMode;

    gGameModle.level = {
        size: size, 
        minesNum: minesamount
    } 

    /* Debug resetVariables => */// console.log(gGameModle);

}

function buildBoard() {

    var currBoard = [];
    for (let i = 0; i < gGameModle.level.size; i++) {
        currBoard[i] = [];
        for (let j = 0; j < gGameModle.level.size; j++) {
            currBoard[i][j] = { 
                negsMinesCount: 0,
                isVisible: false,
                isMine: false,
                hasFlag: false
            };
            
        }
    }
    /* Debug buildBoard => */// console.log(currBoard);
    return currBoard;
}

function cellClicked(element){
    var currPos = cellPosFromElement(element);

    if(gGameModle.gameMode === 'manual'){

        if(gGameModle.level.minesNum > 1){
            element.innerHTML = '<img src="img/cell-mine.png">';
            gGameModle.level.minesNum--;
            gGameRenderer.selectors.mineNumEl.innerText = +gGameRenderer.selectors.mineNumEl.innerText -1;
            gGameModle.board[currPos.i][currPos.j].isMine = true;
            updateCellNegs (currPos);

        }else if(gGameModle.level.minesNum === 1 ){
            element.innerHTML = '<img src="img/cell-mine.png">';
            gGameModle.level.minesNum--;
            gGameRenderer.selectors.mineNumEl.innerText = +gGameRenderer.selectors.mineNumEl.innerText -1;
            gGameModle.board[currPos.i][currPos.j].isMine = true;
            updateCellNegs (currPos);
            coverBoard();
        } else {
            checkGameOver(element);
            revealCell(element);
            uncoverdNegs(cellPosFromElement(element));
        }
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

    if(currCell.isMine){
        element.innerHTML = '<img src="img/cell-mine.png">';
        gGameRenderer.selectors.gameBoardEl.style.backgroundColor = 'red';
        console.log('GAME OVER');
    }
}

function revealCell(element) {
    var currPos = cellPosFromElement(element);
    var currCell = gGameModle.board[currPos.i][currPos.j];
    
    currCell.isVisible = true;

    randerCell(currPos);
}

function expandVisible(board, elCell, pos){

}

function handdleGameMode (){
    switch (gGameModle.gameMode) { 
        case 'basic':
            
            break;
            case 'manual':
                for (let i = 0; i < gGameModle.level.size; i++) {
                    for (let j = 0; j < gGameModle.level.size; j++) {
                        gGameModle.board[i][j].isVisible = true; 
                    }
                }
                gGameRenderer.selectors.mineBankEl.style.display = 'block'
                gGameRenderer.selectors.mineNumEl.innerHTML = gGameModle.level.minesNum;
                gGameRenderer.selectors.flagsNumEl.innerHTML = gGameModle.flagsCount;  
            break;
    
        default:
            gGameModle.gameMode = 'manual';
            handdleGameMode ();
            break;
    }
}
    
function cellPosFromElement (element){
    var dataStr = element.dataset.pos.split('-');
    return{i: +dataStr[0],j: +dataStr[1]}

    // TODO: Use befor the return statement
    /* Debug setGameRenderer => */// console.log(cellPosFromElement(document.querySelector('.cell')));
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
    switch(event.which){
        case 1: 
            cellClicked(element);
            break;
        case 3:
            toggleCellFlag(element);
            break;
    } 
}



