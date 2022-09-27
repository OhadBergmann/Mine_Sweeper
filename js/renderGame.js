'use strict'

function randerBoard(){
    var currCell;
    var posStr = '';
    var strHTML = '';

    for (let i = 0; i < gModel.board.length; i++) {
        strHTML += '<div class="row">';
        
        for (let j = 0; j < gModel.board[i].length; j++) {
            posStr =  i + '-' + j;
            currCell = gModel.board[i][j];
               
                
            if(gModel.isManual){
                currCell.isVisible = true;
                strHTML += '<div class="cell" data-pos="'+ posStr +'" onmousedown="mouseClicked(event,this)">' 
                + '<img src="img/cell-empty.png"></div>';
                continue;
            }
            
            strHTML += '<div class="cell" data-pos="'+ posStr +'" onmousedown="mouseClicked(event,this)">'
            + '<img src="img/cell-covered.png"></div>';     
        }
        strHTML += '</div>';
    }

    gModel.selectors.elTableArea.innerHTML = strHTML;
    
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

function coveredAllCells(){
    var currCell;
    var posStr;
    
    for (let i = 0; i < gModel.board.length; i++) {        
        for (let j = 0; j < gModel.board[i].length; j++) {
            posStr =  i + '-' + j;
            currCell = document.querySelector('[data-pos="' + posStr + '"]');
            gModel.board[i][j].isVisible = false;
            currCell.innerHTML = '<img src="img/cell-covered.png">';
            gModel.selectors.elMineBank.style.display = 'none';
        }
    }
}

function handdleGameOptions (){
    setSelectors();
    gModel.selectors.elMainPanel.style.backgroundColor = 'rgb(184, 184, 184)';
    gModel.selectors.elMineNum.innerHTML = gModel.level.minesNum;
    gModel.selectors.elFlagsNum.innerHTML = gModel.flagsCount;  

    
    switch (gModel.gameOptions.mode) { 
        case 'Manual':
            gModel.selectors.elMineBank.style.display = 'block'
        break;
        case 'Standard':
            gModel.selectors.elMineBank.style.display = 'none'
        break;
    }

    switch(gModel.gameOptions.difficulty){
        case 'Easy':
            gModel.selectors.elTableArea.classList.add('easy');
            gModel.selectors.elTableArea.classList.remove('medium');
            gModel.selectors.elTableArea.classList.remove('hard');
            break;
        case 'Medium':
            gModel.selectors.elTableArea.classList.remove('easy');
            gModel.selectors.elTableArea.classList.add('medium');
            gModel.selectors.elTableArea.classList.remove('hard');
            break;
        case 'Hard':
            gModel.selectors.elTableArea.classList.remove('easy');
            gModel.selectors.elTableArea.classList.remove('medium');
            gModel.selectors.elTableArea.classList.add('hard');
            break;
    }
}

function visualEffects(){
    gModel.effectsIntervalID = setInterval(()=>{
        var hearts = document.querySelectorAll('.life');
        for (let i = 0; i < hearts.length; i++) {
            if(hearts[i].classList.contains('beat')){
                hearts[i].classList.remove('beat')
            } else{
                hearts[i].classList.add('beat') 
            }
        }
    },2050);

    setSounds();
}

function setSounds (){
    gModel.sounds = {};
    gModel.sounds.plop1 = new Audio('sound/plop-1.wav');
    gModel.sounds.plop2 = new Audio('sound/plop-2.wav');
    gModel.sounds.explosion = new Audio('sound/explosion.wav');
    gModel.sounds.flagIt = new Audio('sound/flag-in-out.wav');
}

function playRandomPlop (){
    var randomNum =  Math.floor(Math.random()*2);

    if(randomNum === 1){
        gModel.sounds.plop1.play();
        return;
    }

    gModel.sounds.plop2.play();
}

function changeDiff(bool){

    if(bool){
        switch(gModel.gameOptions.difficulty){
            case 'Easy':
                gModel.gameOptions.difficulty ='Medium';
                gModel.level.size = 8;
                gModel.level.minesNum = 14;
                break;
            case 'Medium':
                gModel.gameOptions.difficulty ='Hard';
                gModel.level.size = 12;
                gModel.level.minesNum = 32;
                break;
            case 'Hard':
                return;
        }
        gModel.selectors.elDiffStr.innerText = gModel.gameOptions.difficulty;
    } else {
        switch(gModel.gameOptions.difficulty){
            case 'Easy':
                return;
            case 'Medium':
                gModel.gameOptions.difficulty ='Easy';
                gModel.level.size = 4;
                gModel.level.minesNum = 2;
                break;
            case 'Hard':
                gModel.gameOptions.difficulty ='Medium';
                gModel.level.size = 8;
                gModel.level.minesNum = 14;
                break;
        }
        gModel.selectors.elDiffStr.innerText = gModel.gameOptions.difficulty;
    }
}



function changeMode(bool){

    if(bool){
        switch(gModel.gameOptions.mode){
            case 'Manual':
                gModel.isManual = false;
                gModel.gameOptions.mode = 'Standard';
                gModel.selectors.elModeStr.innerText = gModel.gameOptions.mode;
                break;
            case 'Standard':
                return;
        }
    } else {
        switch(gModel.gameOptions.mode){
            case 'Manual':
                return;
            case 'Standard':
                gModel.isManual = true;
                gModel.gameOptions.mode = 'Manual';
                gModel.selectors.elModeStr.innerText = gModel.gameOptions.mode;
                break;
        }
        
    }
}



function switchSmiley(str){
    switch (str) {
        case 'start':
            gModel.selectors.elSmiley.innerHTML = '<img onclick="initGame()" src="img/smiley-happy.png" alt=":)">';
           
        case 'enter':
            if(gModel.isRunningGame){
                gModel.selectors.elSmiley.innerHTML = '<img onclick="initGame()" src="img/smiley-fear.png" alt=":)">';
            }
                break;
        case 'exit':
            if(gModel.isRunningGame){
                gModel.selectors.elSmiley.innerHTML = '<img onclick="initGame()" src="img/smiley-happy.png" alt=":)">';
            }
                break;
        case 'lose':
            gModel.selectors.elSmiley.innerHTML = '<img onclick="initGame()" src="img/smiley-lose.png" alt=":)">';
            break;
        case 'win':
            gModel.selectors.elSmiley.innerHTML = '<img onclick="initGame()" src="img/smiley-win.png" alt=":)">';
            break;
    }
}


function removePlayerLife(){
    gModel.playerLives--;
    var hearts = document.querySelectorAll('.life');
    hearts[(hearts.length - 1)].classList.add('death');
    hearts[(hearts.length - 1)].classList.remove('life');
      hearts[(hearts.length - 1)].classList.remove('beat');
    hearts[(hearts.length - 1)].innerHTML = '<img src="img/dead-heart.png">';
}

function removePlayerdeath(){
    var hearts = document.querySelectorAll('.death');
    if(hearts.length > 0){
        for (let i = 0; i < hearts.length; i++) {
            hearts[i].classList.add('life');
            hearts[i].classList.remove('death');  
        }
    } 
}

function cleaStatusMassage (){
    if(gModel.selectors !== undefined){
        switchSmiley('happy');
        gModel.selectors.elStatus.classList.remove('over');
    }
}


function setSelectors (){
    gModel.selectors = {};
    gModel.selectors.elMineBank = document.querySelector('.mines');
    gModel.selectors.elMineNum = document.querySelector('.bank .mine.counter');
    gModel.selectors.elFlagsNum = document.querySelector('.bank .flags.counter');
    
    gModel.selectors.elSmiley = document.querySelector('.smiley'); 

    gModel.selectors.elTableArea = document.querySelector('.table-area');
    gModel.selectors.elMainPanel = document.querySelector('.main-panel');
    gModel.selectors.elTimer = document.querySelector('.timer .seconds');
    
    gModel.selectors.elDiffStr = document.querySelector('.difficulty-str');
    gModel.selectors.elModeStr = document.querySelector('.mode-str');
    
    gModel.selectors.elScore = document.querySelector('.score-board .score');
    gModel.selectors.elStatus = document.querySelector('.status');
    
   
}