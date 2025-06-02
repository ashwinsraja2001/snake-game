let snake = document.getElementsByClassName('block');
let playArea = document.getElementById('playArea');
let movSpeed = 10;
let upperWall = playArea.offsetTop;
let leftWall = playArea.offsetLeft; 
let lowerWall = upperWall + playArea.clientHeight;
let rightWall = leftWall + playArea.clientWidth;
let x=leftWall;
let y=upperWall;
let direction = 'down';
let button = document.getElementById('button');
let play = false;
let intervalId = '';
let refreshRate = 100;
let foodLoc=null;
let playAreaDefault = playArea.innerHTML;


window.addEventListener('resize', ()=>{
  location.reload();
})

button.onclick = ()=>{
  play = play==true? false : true;
  button.className = button.className == 'game-play-start'? 'game-play-stop':'game-play-start';
  button.innerText = button.innerText == 'Stop'? 'Start':'Stop';
  if(play==true){
    (()=>{
      for(let i=0;i<2500;i++){
        let node = document.createElement("div");
        node.id = `grid${i}`;
        node.className = "grid";
        playArea.append(node);
      }
    })();

    foodLoc = foodGenerator();
    snake = document.getElementsByClassName('block');
    x = leftWall;
    y = upperWall;
    direction = 'down';
    playGame();
  }
  else{
    clearInterval(intervalId);
    foodLoc.removeChild(foodLoc.firstChild);
    playArea.innerHTML = playAreaDefault;
  }
}

function addElement(){
    let newBlock = document.createElement('div');
    newBlock.className = 'block';
    newBlock.id = `block${snake.length+1}`;
    newBlock.style.top = `${snake[snake.length-1].style.top}`;
    newBlock.style.left = `${snake[snake.length-1].style.left}`;
    snake[snake.length-1].after(newBlock);
}

function foodGenerator(){
    let food = document.createElement('div');
    food.className = 'food';
    let gridNum = Math.floor(Math.random()*99);
    console.log(gridNum);
    let gridNode = document.getElementById(`grid${gridNum}`);
    gridNode.append(food);
    return gridNode;
}

function wallDetection(posX,posY){
    if(posY < upperWall){
      posY = lowerWall - movSpeed;
    }
    else if( posY + movSpeed > lowerWall){
      posY = upperWall
    }

    if(posX < leftWall){
      posX = rightWall - movSpeed;
    }
    else if( posX >= rightWall){
      posX = leftWall;
    }

    return {
      'i':posX,
      'j':posY,
    }
}

function foodConsumed(){
  if(snake[0].offsetTop == foodLoc.offsetTop &&  snake[0].offsetLeft == foodLoc.offsetLeft){
    console.log('in food consumed');
    addElement();
    foodLoc.removeChild(foodLoc.firstChild);
    return true;
  }
  //console.log(block.offsetTop, block.offsetLeft, foodLoc.offsetTop, foodLoc.offsetLeft);
  //console.log(x, ' ' ,y);
  return false;
}

function collisionDetection(){
  for(let i=1; i<snake.length;i++){
    if(snake[0].offsetLeft == snake[i].offsetLeft && snake[0].offsetTop == snake[i].offsetTop){
      return true;
    }
  }
  return false;
}

function gameOver(){
  button.innerText = 'GAME OVER';
  clearInterval(intervalId);
  setTimeout(()=>{
    button.innerText = 'Start';
    button.className = 'game-play-start';
    foodLoc.removeChild(foodLoc.firstChild);
    playArea.innerHTML = playAreaDefault;
    play = false;
  },3000);
}

document.addEventListener('keydown',(e)=>{
    if(e.key.match('ArrowUp')){
      direction = 'up';
    }
    if(e.key.match('ArrowDown')){
      direction = 'down';
    }
    if(e.key.match('ArrowLeft')){
      direction = 'left';
    }
    if(e.key.match('ArrowRight')){
      direction = 'right';
    }
});

function playGame(){
    intervalId = setInterval(()=>{
      if(direction == 'down'){
        y+=movSpeed;
      }
      else if(direction == 'up'){
        y-=movSpeed;
      }
      else if(direction == 'left'){
        x-=movSpeed;
      }
      else if(direction == 'right'){
        x+=movSpeed;
      }
      let position = wallDetection(x,y);
      x = position.i;
      y = position.j;
      
      for(let i = snake.length-1; i>=0; i--){
        if(i == 0){
          snake[i].style.top = `${y}px`;
          snake[i].style.left = `${x}px`;
        }
        if(i>0){
          snake[i].style.top = `${snake[i-1].style.top}`;
          snake[i].style.left = `${snake[i-1].style.left}`;
        }
      }

      if(collisionDetection()){
        gameOver();
      }

      if(foodConsumed()){
        foodLoc = foodGenerator();
      }
      
    }, refreshRate);
}

