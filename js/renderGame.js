'use strict'

var gGameRenderer;

function generateEmptyBorad (){
    var strHTML = '';

    gGameRenderer.selectors.gameBoardEl.style.backgroundColor = 'rgb(184, 184, 184)';
    for (let i = 0; i < gGameModle.level.size; i++) {
            strHTML += '<tr class="row">';
        for (let j = 0; j < gGameModle.level.size; j++) {
            strHTML += '<td class="cell" data-pos="'+ i + '-' + j +'" onmousedown="mouseClicked(event,this)">' 
            + '<img src="img/cell-empty.png"></td>';
        }
        strHTML += '</tr>';
    }

    gGameRenderer.selectors.mTableEl.innerHTML = strHTML;
}

function randerBoard(){
    var currCell;
    var elCell;
    var posStr = '';
    var strHTML = '';

    if(gGameModle.isManual)
    {
        for (let i = 0; i < gGameModle.board.length; i++) {
            for (let j = 0; j < gGameModle.board[i].length; j++) {
                posStr =  i + '-' + j;
                currCell = gGameModle.board[i][j];
                currCell.isVisible = false;

                elCell = document.querySelector('[data-pos="' + posStr + '"]');
                elCell.innerHTML = '<img src="img/cell-covered.png">';
            }
        }
    } else {
        gGameRenderer.selectors.gameBoardEl.style.backgroundColor = 'rgb(184, 184, 184)';
        for (let i = 0; i < gGameModle.level.size; i++) {
                strHTML += '<tr class="row">';
            for (let j = 0; j < gGameModle.level.size; j++) {
                posStr =  i + '-' + j;
                currCell = gGameModle.board[i][j];
                currCell.isVisible = false;
                strHTML += '<td class="cell" data-pos="'+ posStr +'" onmousedown="mouseClicked(event,this)">' 
                + '<img src="img/cell-covered.png"></td>';
            }
            strHTML += '</tr>';
        }
    
        gGameRenderer.selectors.mTableEl.innerHTML = strHTML;
    }
   


}

function setGameRenderer (){
    if(gGameRenderer === undefined) gGameRenderer = {};
    if(gGameRenderer.selectors === undefined) gGameRenderer.selectors = {};

    gGameRenderer.selectors.mTableEl = document.querySelector('.table-area table');
    gGameRenderer.selectors.gameBoardEl = document.querySelector('.gameboard');
    gGameRenderer.selectors.timerEl = document.querySelector('.timer .seconds');
    gGameRenderer.selectors.diffStrEl = document.querySelector('.difficulty-str');

     /* Debug setGameRenderer => */// console.log(gGameRenderer);
}


function uncoverdNegs (pos){
    var currPos;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            currPos = {i: pos.i + i,j: pos.j + j};
    
            if(currPos.i >= 0 && currPos.i < gGameModle.level.size && currPos.j >= 0 && currPos.j < gGameModle.level.size 
                && !gGameModle.board[currPos.i][currPos.j].isMine){
                   
                    gGameModle.board[currPos.i][currPos.j].isVisible = true;
                    gGameModle.safeCells.splice(gGameModle.safeCells.indexOf(currPos));
                    randerCell(currPos);

                    
            }
        }
    }

    if(gGameModle.safeCells.length === 0){
        //victorious ();
    }
}


function randerCell (pos){
    var currCell = gGameModle.board[pos.i][pos.j];
    var posStr = '';
    var elCell;

    if (!currCell.isVisible) return;

    posStr =  pos.i + '-' + pos.j;
    elCell = document.querySelector('[data-pos="' + posStr + '"]');

    if (currCell.isMine) {
        elCell.innerHTML = '<img src="img/cell-mine.png">';
        return;
    }
    
    switch (currCell.negsMinesCount) {
        case 0:
            elCell.innerHTML = '<img src="img/cell-empty.png">';
            break;
        case 1:
            elCell.innerHTML = '<img src="img/cell-one-neg.png">';
            break;
        case 2:
            elCell.innerHTML = '<img src="img/cell-two-neg.png">';
            break;
        case 3:
            elCell.innerHTML = '<img src="img/cell-three-neg.png">';
            break;
        case 4:
            elCell.innerHTML = '<img src="img/cell-four-neg.png">';
            break;
        case 5:
            elCell.innerHTML = '<img src="img/cell-five-neg.png">';
            break;
        case 6:
            elCell.innerHTML = '<img src="img/cell-six-neg.png">';
            break;
        case 7:
            elCell.innerHTML = '<img src="img/cell-seven-neg.png">';
             break;
        case 8:
            elCell.innerHTML = '<img src="img/cell-eight-neg.png">';
             break;
        default:
            break;
    }
}

function handdleGameMode (){
    
    gGameRenderer = {};
    gGameRenderer.selectors = {};
    gGameRenderer.selectors.mineBankEl = document.querySelector('.mine-bank');
    gGameRenderer.selectors.mineNumEl = document.querySelector('.mine-bank .mine-counter');
    gGameRenderer.selectors.flagsNumEl = document.querySelector('.flags-bank .flags-counter');
            
    gGameRenderer.selectors.mineNumEl.innerHTML = gGameModle.level.minesNum;
    gGameRenderer.selectors.flagsNumEl.innerHTML = gGameModle.flagsCount;  

    switch (gGameModle.gameMode) { 
        case 'Easy':
            gGameRenderer.selectors.mineBankEl.style.display = 'none'
            break;
        case 'Medium':
            gGameRenderer.selectors.mineBankEl.style.display = 'none'
            break;
        case 'Hard':
            gGameRenderer.selectors.mineBankEl.style.display = 'none'
            break;
        case 'Manual':
            gGameRenderer.selectors.mineBankEl.style.display = 'block'

        break;
    
        default:
            gGameModle.gameMode = 'Manual';
            handdleGameMode ();
            break;
    }
}

function changeDiff(bool){

    if(bool){
        switch(gGameModle.gameMode){
            case 'Manual':
                gGameModle.gameMode ='Easy';
                gGameModle.isManual = false;
                break;
            case 'Easy':
                gGameModle.gameMode ='Medium';
                gGameModle.level.size = 8;
                gGameModle.level.minesNum = 14;
                break;
            case 'Medium':
                gGameModle.level.size = 12;
                gGameModle.level.minesNum = 32;
                gGameModle.gameMode ='Hard';
                break;
            case 'Hard':
                return;
        }
        gGameRenderer.selectors.diffStrEl.innerText = gGameModle.gameMode;
    } else {
        switch(gGameModle.gameMode){
            case 'Manual':
                return;
            case 'Easy':
                gGameModle.isManual = true;
                gGameModle.gameMode ='Manual';
                break;
            case 'Medium':
                gGameModle.level.size = 4;
                gGameModle.level.minesNum = 2;
                gGameModle.gameMode ='Easy';
                break;
            case 'Hard':
                gGameModle.level.size = 8;
                gGameModle.level.minesNum = 14;
                gGameModle.gameMode ='Medium';
                break;
        }
        gGameRenderer.selectors.diffStrEl.innerText = gGameModle.gameMode;
    }
}

/*
function oldRanderBoard (){
    var currCell;
    var elCell;
    var posStr = '';
    for (let i = 0; i < gGameModle.levle.size; i++) {
        for (let j = 0; j < gGameModle.levle.size; j++) {
            currCell = gGameModle.board[i][j];
            if (currCell.isVisible){
        
                posStr =  i + '-' + j;
                elCell = document.querySelector('[data-pos="' + posStr + '"]');

                switch (currCell.negsMinesCount) {
                    case 0:
                        elCell.innerHTML = '<img src="img/cell-empty.png">';
                        break;
                    case 1:
                        elCell.innerHTML = '<img src="img/cell-one-neg.png">';

                        break;
                    case 2:
                        elCell.innerHTML = '<img src="img/cell-two-neg.png">';
                        break;
                    case 3:
                        elCell.innerHTML = '<img src="img/cell-three-neg.png">';
                        break;
                    case 4:
                        elCell.innerHTML = '<img src="img/cell-four-neg.png">';
                        break;
                    case 5:
                        elCell.innerHTML = '<img src="img/cell-five-neg.png">';
                        break;
                    case 6:
                        elCell.innerHTML = '<img src="img/cell-six-neg.png">';
                        break;
                    case 7:
                        elCell.innerHTML = '<img src="img/cell-seven-neg.png">';
                         break;
                    case 8:
                        elCell.innerHTML = '<img src="img/cell-eight-neg.png">';
                         break;
                
                    default:
                        break;
                }
            }
        }
    }
}*/
