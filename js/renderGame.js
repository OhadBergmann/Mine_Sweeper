'use strict'

function randerBoard(){
    var currCell;
    var elCell;
    var posStr = '';
    var strHTML = '';

    if(gModel.isManual)
    {
        for (let i = 0; i < gModel.board.length; i++) {
            for (let j = 0; j < gModel.board[i].length; j++) {
                posStr =  i + '-' + j;
                currCell = gModel.board[i][j];
                currCell.isVisible = false;

                elCell = document.querySelector('[data-pos="' + posStr + '"]');
                elCell.innerHTML = '<img src="img/cell-covered.png">';
            }
        }
    } else {
        gModel.selectors.gameBoardEl.style.backgroundColor = 'rgb(184, 184, 184)';
        for (let i = 0; i < gModel.level.size; i++) {
                strHTML += '<tr class="row">';
            for (let j = 0; j < gModel.level.size; j++) {
                posStr =  i + '-' + j;
                currCell = gModel.board[i][j];
                currCell.isVisible = false;
                strHTML += '<td class="cell" data-pos="'+ posStr +'" onmousedown="mouseClicked(event,this)">' 
                + '<img src="img/cell-covered.png"></td>';
            }
            strHTML += '</tr>';
        }
    
        gModel.selectors.mTableEl.innerHTML = strHTML;
    }
}



function generateEmptyBorad (){
    var strHTML = '';

    gModel.selectors.gameBoardEl.style.backgroundColor = 'rgb(184, 184, 184)';
    for (let i = 0; i < gModel.level.size; i++) {
            strHTML += '<tr class="row">';
        for (let j = 0; j < gModel.level.size; j++) {
            strHTML += '<td class="cell" data-pos="'+ i + '-' + j +'" onmousedown="mouseClicked(event,this)">' 
            + '<img src="img/cell-empty.png"></td>';
        }
        strHTML += '</tr>';
    }

    gModel.selectors.mTableEl.innerHTML = strHTML;
}



function randerCell (pos){
    var currCell = gModel.board[pos.i][pos.j];
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



function resetSelectors (){

    if(gModel.selectors === undefined) gModel.selectors = {};

    gModel.selectors.mTableEl = document.querySelector('.table-area table');
    gModel.selectors.gameBoardEl = document.querySelector('.gameboard');
    gModel.selectors.timerEl = document.querySelector('.timer .seconds');
    gModel.selectors.diffStrEl = document.querySelector('.difficulty-str');

     /* Debug setGameRenderer => */// console.log(gModel.selectors);
}



function handdleGameMode (){
    
    gModel.selectors = {};
    gModel.selectors.mineBankEl = document.querySelector('.mine-bank');
    gModel.selectors.mineNumEl = document.querySelector('.mine-bank .mine-counter');
    gModel.selectors.flagsNumEl = document.querySelector('.flags-bank .flags-counter');
            
    gModel.selectors.mineNumEl.innerHTML = gModel.level.minesNum;
    gModel.selectors.flagsNumEl.innerHTML = gModel.flagsCount;  

    switch (gModel.gameMode) { 
        case 'Easy':
            gModel.selectors.mineBankEl.style.display = 'none'
            break;
        case 'Medium':
            gModel.selectors.mineBankEl.style.display = 'none'
            break;
        case 'Hard':
            gModel.selectors.mineBankEl.style.display = 'none'
            break;
        case 'Manual':
            gModel.selectors.mineBankEl.style.display = 'block'

        break;
    
        default:
            gModel.gameMode = 'Manual';
            handdleGameMode ();
            break;
    }
}



function changeDiff(bool){

    if(bool){
        switch(gModel.gameMode){
            case 'Manual':
                gModel.gameMode ='Easy';
                gModel.isManual = false;
                break;
            case 'Easy':
                gModel.gameMode ='Medium';
                gModel.level.size = 8;
                gModel.level.minesNum = 14;
                break;
            case 'Medium':
                gModel.level.size = 12;
                gModel.level.minesNum = 32;
                gModel.gameMode ='Hard';
                break;
            case 'Hard':
                return;
        }
        gModel.selectors.diffStrEl.innerText = gModel.gameMode;
    } else {
        switch(gModel.gameMode){
            case 'Manual':
                return;
            case 'Easy':
                gModel.isManual = true;
                gModel.gameMode ='Manual';
                break;
            case 'Medium':
                gModel.level.size = 4;
                gModel.level.minesNum = 2;
                gModel.gameMode ='Easy';
                break;
            case 'Hard':
                gModel.level.size = 8;
                gModel.level.minesNum = 14;
                gModel.gameMode ='Medium';
                break;
        }
        gModel.selectors.diffStrEl.innerText = gModel.gameMode;
    }
}