'use strict'

function IntTo4DigitsStr(num){
    var str = num + '';
    if(str.length >= 4) return str;

    while(str.length < 4){
        str = '0' + str
    }
    return str;
}


function cellPosFromElement (element){
    var dataStr = element.dataset.pos.split('-');
    return{i: +dataStr[0],j: +dataStr[1]}
}

function elementFromPos (pos){
    var dataStr = '[data-pos="' + pos.i + '-' + pos.j + '"]';
    return document.querySelector(dataStr);
}

function disableContextMenu(){
    window.addEventListener('contextmenu', function (e) { 
        e.preventDefault(); 
      }, false);
    
}

//NOTE: The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }