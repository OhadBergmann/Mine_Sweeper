'use strict'

var gModel = {};
gModel.gameMode = 'Easy';

function initGame (){
    resetVariables(gModel.gameMode);
    gModel.board = buildBoard();
    handdleGameMode();
    resetSelectors ()

    if(!gModel.isManual){
        randerBoard();
        layMines ( gModel.level.minesNum);
        }
    else {
        generateEmptyBorad ();
    }
    gModel.selectors.elStatus.innerHTML = '';
    disableContextMenu();     
}



function resetVariables(mode) {
    gModel = {};
    var size = 4;
    var amount = 2;

    switch (mode) {
        case 'Manual':
            gModel.isManual = true;
            break;
        case 'Easy':
            size = 4;
            amount = 2;
            break;
        case 'Medium':
            size = 8;
            amount = 14;
            break;
        case 'Hard':
            size = 12;
            amount = 32;
            break;
        default:
            gModel.gameMode = 'Manual';
            gModel.isManual = true;
            break;
    }

    gModel.isRunningGame = true;
    gModel.visiblesCounter = 0;
    gModel.flagsCount = amount;
    gModel.selectors = {};

    gModel.secPassed = 0;
    gModel.gameMode = mode;
    gModel.level = {
        size: size, 
        minesNum: amount
    };
    gModel.ManualMinesNum = amount;
    gModel.safecellsCount = size*size - amount;
}



function buildBoard() {
    var currBoard = [];
    for (let i = 0; i < gModel.level.size; i++) {
        currBoard[i] = [];
        for (let j = 0; j < gModel.level.size; j++) {
            if(gModel.isManual){
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



function mouseClicked(event, element){
    if(!gModel.isRunningGame) return;
    switch(event.which){
        case 1: 
            cellClicked(element);
            break;
        case 3:
            toggleCellFlag(element);
            break;
    } 
    var currPos = cellPosFromElement(element);
}



function cellClicked(element){

    var currPos = cellPosFromElement(element);
    var currCell = gModel.board[currPos.i][currPos.j];
    if(currCell.hasFlag) return;

    if(gModel.isManual){

        if(gModel.ManualMinesNum > 1){
            element.innerHTML = '<img src="img/cell-mine.png">';
            gModel.ManualMinesNum--;
            gModel.selectors.mineNumEl.innerText = +gModel.selectors.mineNumEl.innerText -1;
            gModel.board[currPos.i][currPos.j].isMine = true;
            updateCellNegs (currPos);
            return;

        }else if(gModel.ManualMinesNum === 1 ){
            element.innerHTML = '<img src="img/cell-mine.png">';
            gModel.ManualMinesNum--;
            gModel.selectors.mineNumEl.innerText = +gModel.selectors.mineNumEl.innerText -1;
            gModel.board[currPos.i][currPos.j].isMine = true;
            updateCellNegs (currPos);
            setTimeout(randerBoard,150);
            return;
        }
    }

    if(currCell.isVisible) return;

    updateCell(element);
    if(isCellEmpty(currPos)) uncoverdNegs(cellPosFromElement(element));
    checkGameOver(element);

    console.log('gModel.visiblesCounter: ',gModel.visiblesCounter)
}



function toggleCellFlag (element){
    var currPos = cellPosFromElement(element);
    var currCell = gModel.board[currPos.i][currPos.j];

    if(currCell.isVisible) {return;}

    if(currCell.hasFlag){
        currCell.hasFlag = false;
        element.innerHTML = '<img src="img/cell-covered.png">';
        gModel.flagsCount++;
        gModel.selectors.flagsNumEl.innerText = gModel.flagsCount; 

    } else {
        currCell.hasFlag = true;
        element.innerHTML = '<img src="img/cell-covered-n-flaged.png">';
        gModel.flagsCount--;
        gModel.selectors.flagsNumEl.innerText = gModel.flagsCount; 
        if(gModel.flagsCount <= 0){ playerIsVictorious()}
    }
}



function updateCell(element) {
    var currPos = cellPosFromElement(element);
    var currCell = gModel.board[currPos.i][currPos.j];
    currCell.isVisible = true;
    gModel.visiblesCounter++;
    randerCell(currPos);
    checkGameOver(element);
    playerIsVictorious ();
}



function updateCellNegs (pos){
    var currPos;
    
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            currPos = {i: pos.i + i, j: pos.j + j}

            if(currPos.i >= 0 && currPos.i < gModel.level.size && currPos.j >= 0 && currPos.j  < gModel.level.size 
                && !gModel.board[currPos.i][currPos.j].isMine){
                gModel.board[currPos.i][currPos.j].negsMinesCount++;
            }
        }
    }
}



function uncoverdNegs (pos){
    var currPos;
    var currCell;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            currPos = {i: pos.i + i,j: pos.j + j};

             if (currPos.i < 0 || currPos.i >= gModel.level.size || currPos.j < 0 || currPos.j >= gModel.level.size 
                || (Math.abs(i) + Math.abs(j)) === 0) continue;
            currCell = gModel.board[currPos.i][currPos.j];

            if(!currCell.isMine && !currCell.hasFlag && !currCell.isVisible) {
                currCell.isVisible = true;
                updateCell(elementFromPos(currPos));
                if(isCellEmpty(currPos)) uncoverdNegs(currPos);
            }
        }
    }  
}



function checkGameOver(element) {
    var currPos = cellPosFromElement(element);
    var currCell = gModel.board[currPos.i][currPos.j];

    if(!gModel.timerIntervalID) startTimer(); 
    
    if(currCell.isMine){
        clearInterval(gModel.timerIntervalID); 
        gModel.isRunningGame = false;
        element.innerHTML = '<img src="img/cell-mine.png">';
        gModel.selectors.gameBoardEl.style.backgroundColor = 'red';
        gModel.selectors.elStatus.innerHTML = 'GAME OVER';
        gModel.selectors.timerEl.innerText = IntTo4DigitsStr(0);
    }
}



function playerIsVictorious (){

    if(gModel.flagsCount === 0 && gModel.safecellsCount === gModel.visiblesCounter){
        clearInterval(gModel.timerIntervalID);
        gModel.isRunningGame = false;
        gModel.selectors.gameBoardEl.style.backgroundColor = 'blue';

        updateScoure(gModel.selectors.timerEl.innerText);
        gModel.selectors.elStatus.innerHTML = 'You are Victorious';
        gModel.selectors.timerEl.innerText = IntTo4DigitsStr(0); 
    }
}



function layMines (num){
    var i = -1;
    var j = -1;

    while(num > 0){
        i = getRandomInt(0,gModel.level.size);
        j = getRandomInt(0,gModel.level.size);
        if(!gModel.board[i][j].isMine){
            gModel.board[i][j].isMine = true;
            updateCellNegs({i,j});
        }
        num--;
    }
}
    


function isCellEmpty(pos){
    var currCell = gModel.board[pos.i][pos.j];
    if(currCell.negsMinesCount === 0){
        return true;
    } 
    return false;
}



function startTimer(){
    var lastDate = new Date();
    var CurrDate;

    gModel.timerIntervalID = setInterval(()=>{
        CurrDate = new Date();

        if(Math.floor((CurrDate - lastDate)/1000)>= 1){
            gModel.secPassed++;           
            gModel.selectors.timerEl.innerText = IntTo4DigitsStr(gModel.secPassed);
           
        }
        lastDate = CurrDate;
    },1040);
}



function IntTo4DigitsStr(num){
    var str = num + '';
    if(str.length >= 4) return;

    while(str.length < 4){
        str = '0' + str
    }
    return str;
}



function updateScoure (score){
    var currScore;
    var multiplier = 0;
    switch(gModel.gameMode){
        case 'Manual':
            multiplier = 0.3;
            break;
        case 'Easy':
            multiplier = 1.5;
            break;
        case 'Medium':
            multiplier = 1.5;
            break;
        case 'Hard':
            multiplier = 3;
            break;
            default:
                break;
    }
    currScore = IntTo4DigitsStr(Math.ceil(score*multiplier));
    localStorage.setItem('anonymous',currScore);
    document.querySelector('.score-board .score').innerText = currScore;
}

