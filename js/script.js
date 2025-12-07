//run 
var runSound = new Audio("../sound/run.mp3");
runSound.loop = true;
//jump
var jumpSound = new Audio("../sound/jump.mp3");
//dead
var deadSound = new Audio("../sound/dead.mp3");

//Key Event
function keyCheck(event){
    //Enter Key
    if(event.which ==13){
        if(runWorkerId ==0){
        runWorkerId = setInterval(run,100);
        runSound.play();
        backgroundWorkerId = setInterval(moveBackground,100);
        scoreWorkerId = setInterval(updateScore,100);
        createBlockWorkerId = setInterval(createBlock,100);
        moveBlockWorkerId = setInterval(moveBlock,100);
        }
    }
       
    //Space Key
    if(event.which==32){
        if(jumpWorkerId==0){
            clearInterval(runWorkerId);
            runWorkerId = -1;
            runSound.pause();
            jumpWorkerId  = setInterval(jump,100);
            jumpSound.play(); 
        }
    }
}

//boy
var boy = document.getElementById("boy");

//boy Run
var runWorkerId = 0 ;
var runImageNumber = 1;
function run() {
    runImageNumber++;
    if (runImageNumber == 9) {
        runImageNumber = 1 ;  
    }
    boy.src = "../image/Run ("+ runImageNumber +").png";
}

//boy jump
var jumpWorkerId = 0 ;
var jumpImageNumber = 1;
var boyMarginTop = 300;

function jump() {
    jumpImageNumber++;
    
    //jump fly
    if(jumpImageNumber <= 7){
        boyMarginTop = boyMarginTop - 20 ; 
        boy.style.marginTop = boyMarginTop + "px";
    }
    //jump land
    if(jumpImageNumber >=8){
        boyMarginTop = boyMarginTop + 20 ; 
        boy.style.marginTop = boyMarginTop + "px";
    }
    
    if (jumpImageNumber == 13) {
        jumpImageNumber = 1 ;
        
        clearInterval(jumpWorkerId);
        runWorkerId = setInterval(run,100);
        runSound.play();
        jumpWorkerId = 0;
        
        // starting a jump
        if(scoreWorkerId == 0){
            scoreWorkerId = setInterval(updateScore,100);
        }
        // starting a background run
        if(backgroundWorkerId == 0){
            backgroundWorkerId = setInterval(moveBackground,100);
        }
        //starting a block
        if(createBlockWorkerId == 0){
            createBlockWorkerId = setInterval(createBlock,100);
        }
        //starting a move block
        if(moveBlockWorkerId == 0){
            moveBlockWorkerId = setInterval(moveBlock,100);
        }   
    }
    boy.src = "../image/Jump ("+ jumpImageNumber +").png";
}

//background
var background = document.getElementById("background");

//move background
var backgroundWorkerId = 0 ;
var positionX = 0;

function moveBackground() {
    positionX = positionX - 20 ; 
    background.style.backgroundPositionX = positionX + "px";
}

//score
var scoreId = document.getElementById("score");
var scoreWorkerId = 0 ;
var newScore = 0;

function updateScore(){
    newScore++;
    scoreId.innerHTML = newScore;
}

//create block
var blockNumber = 1;
var blockMarginLeft = 1000; // Start blocks outside the visible area
var createBlockWorkerId = 0;

function createBlock(){
    var block = document.createElement("div");
    block.className = "block";
    block.id = "block" + blockNumber ;
    blockNumber++;
    
    var gap = Math.random()*(1000-400)+400;
    
    blockMarginLeft = blockMarginLeft + gap ;
    block.style.marginLeft = blockMarginLeft + "px";
    
    document.getElementById("background").appendChild(block);
}

//move block
var moveBlockWorkerId = 0;

function moveBlock(){
    for (var i = 1; i <=blockNumber; i++) {
        var currentBlock = document.getElementById("block" + i);
        // Check if block exists before accessing its properties
        if(currentBlock != null){
            var currentMarginLeft = currentBlock.style.marginLeft;
            var newBlockMarginLeft = parseInt(currentMarginLeft) - 20 ;
            
            currentBlock.style.marginLeft = newBlockMarginLeft + "px" ; 
            
            // Remove blocks that have moved off-screen to the left
            if (newBlockMarginLeft < -100){
                currentBlock.remove();
                continue;
            }
            
            // Collision detection - adjusted for the fixed container
            // Block position: margin-top 400px, height 150px (ground level 400-550px)
            // Boy position: margin-top 300px, height approx. 250px (ground level 300-550px)
            // Collision occurs when boy is low (near 300px) and block is at same horizontal position
            if (newBlockMarginLeft < 200 & newBlockMarginLeft > 100){
                // Check if boy is low enough to collide (at ground level)
                if(boyMarginTop > 240){
                    clearInterval(runWorkerId);
                    runSound.pause();
                    clearInterval(jumpWorkerId);
                    jumpWorkerId = -1;
                    clearInterval(scoreWorkerId);
                    clearInterval(createBlockWorkerId);
                    clearInterval(backgroundWorkerId);
                    clearInterval(moveBlockWorkerId);
                    moveBlockWorkerId = -1;
                    deadWorkerId = setInterval(dead,100);
                    deadSound.play();
                }
            }
        }
    }
}

//page Reload
function reload(){
    location.reload();
}

//boy dead
var deadWorkerId = 0;
var deadImageNumber = 1;

function dead (){
    deadImageNumber++;
    if(deadImageNumber == 11){
        deadImageNumber = 10;
        boy.style.marginTop = "300px";
        document.getElementById("endScreen").style.visibility ="visible";
        document.getElementById("endScore").innerHTML = newScore;
    }
    boy.src = "../image/Dead (" +deadImageNumber+").png";
}