'use strict'

function disableContextMenu(){
    window.addEventListener('contextmenu', function (e) { 
        e.preventDefault(); 
      }, false);
    
}