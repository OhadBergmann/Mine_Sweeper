'use strict'

var gGameRenderer;

function generateEmptyBorad (){
    var strHTML = '';
    setGameRenderer ();
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

function coverBoard(){
    var currCell;
    var elCell;
    var posStr = '';
    for (let i = 0; i < gGameModle.board.length; i++) {
        for (let j = 0; j < gGameModle.board[i].length; j++) {
            currCell = gGameModle.board[i][j];
            posStr =  i + '-' + j;
            currCell.isVisible = false;
            elCell = document.querySelector('[data-pos="' + posStr + '"]');
            elCell.innerHTML = '<img src="img/cell-covered.png">';
        }
    }
}

function setGameRenderer (){
    gGameRenderer = {};
    gGameRenderer.selectors = {};
    gGameRenderer.selectors.mTableEl = document.querySelector('.table-area table');
    gGameRenderer.selectors.mineBankEl = document.querySelector('.mine-bank');
    gGameRenderer.selectors.mineNumEl = document.querySelector('.mine-bank .mine-counter');
    gGameRenderer.selectors.flagsNumEl = document.querySelector('.flags-bank .flags-counter');
    gGameRenderer.selectors.gameBoardEl = document.querySelector('.gameboard');
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
                    randerCell(currPos);
            }
        }
    }
}


function randerCell (pos){
    var currCell = gGameModle.board[pos.i][pos.j];
    var posStr = '';
    var elCell;

    if (!currCell.isVisible) {return;}

    posStr =  pos.i + '-' + pos.j;
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





/*
function randerBoard (){
    var currCell;
    var elCell;
    for (let i = 0; i < gGameModle.board.length; i++) {
        for (let j = 0; j < gGameModle.board[i].length; j++) {
            if (currCell.isVisible){
                currCell = gGameModle.board[i][j];
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
}

*/
