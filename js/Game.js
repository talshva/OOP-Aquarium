"use strict";

const MAX_ANIMAL_HEIGHT = 8
const MAX_ANIMAL_WIDTH = 8
const MAX_CRAB_HEIGHT = 4
const MAX_CRAB_WIDTH = 7
const MAX_FISH_HEIGHT = 5
const MAX_FISH_WIDTH = 8
const WATERLINE = 3
const FEED_AMOUNT = 10
const MAX_AGE = 120
const Moly = '🐠'
const Scalar = '🐟'
const Shrimp = '🦐'
const Ocypode = '🦀'
const Wall = ' '
const WaterLevel = ' ' 
var slider = document.getElementById("slider");
var gSpeed = 500 - slider.value;
var gameIsOn = false;
var  gInterval;
var gSize = {
  height: 15,
  width: 25,
};
var animal = {
  isAlive: 0,
  type: false,
  isShown: false,
  food: 0,
  directionH: -1,
  directionV: -1,
};
var Aqua = {
  turn: 0,
  aqua_height: gSize.height,
  aqua_width: gSize.width,
  gBoard: [],
  anim: []
};

function init() {
  // מאתחלת את המשחק אחרי כל סיום משחק
  Aqua.turn = 0;
  var elturns = document.querySelector(".turns");
  elturns.innerText = "turn: " + Aqua.turn;
  Aqua.turn++;
  Aqua.gBoard = build_tank();
  Aqua.anim = [];
  renderBoard();
  }

function build_tank() {
  // בונה את הלוח במודל
  var board = [];
  for (var i = 0; i<gSize.height; i++){
    board[i] = [];
    for (var j = 0; j<gSize.width; j++){
      if (i == gSize.height - 1 && j == 0){
          board[i][j] = {
            visual: Wall  
            };;
      }else if  (i == gSize.height - 1 && j == gSize.width - 1){
          board[i][j] = {
            visual: Wall  
            };;
      }else if (j == 0 || j == gSize.width - 1){
          board[i][j] = {
            visual: Wall  
            };
      }else if (i == WATERLINE - 1){
          board[i][j] = board[i][j] = {
            visual: WaterLevel 
            };
      }else if (i == gSize.height - 1){
        board[i][j] ={
          visual: Wall  
          };
      }else{
          board[i][j] = {
            visual: ' '  
            };
      }
    }
  }
  return board
  // console.table(board);
}

function renderBoard() {
   // מרנדרת את הלוח בדום
  // console.table(board);
  var elBoard = document.querySelector(".board");
  var strHTML = "";
  var image = ' ';
  for (var i = 0; i < gSize.height; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < gSize.width; j++) {
      var currCell = Aqua.gBoard[i][j];
      if (currCell != ' ') image = currCell.visual;
      else image = ' ';
      var cellClass = getClassName({ i: i, j: j });
      strHTML += `\t<td class="`;
      if (currCell.directionH == "1") strHTML += "cellfliped";
      if (j==0 || j==gSize.width-1 || i == gSize.height-1) strHTML += "walls";
      if (j!=0 && j!=gSize.width-1 && i < 3) strHTML += "air";
      strHTML += ` cell ${cellClass}" onclick="cellClicked(${i},${j})" 
      oncontextmenu = "cellMarked(this, ${i},${j})"> \n${image} </td>`;
    }
    strHTML += "\n</tr>\n";
    elBoard.innerHTML = strHTML;
  }
}

function cellClicked(i, j) {
  choice = -1
  if (i>2 && i<gSize.height-1 && j!=0 && j!=gSize.width-1 && Aqua.gBoard[i][j].visual == ' '){
    let confirmAction = confirm("Do you want to add an animal to the board?");
    if (confirmAction) {
      if (i==gSize.height-2){
        while (choice != '1' && choice != '2'){
          var choice = prompt("for Ocypode press 1, for Shrimp press 2");
          var dirx = prompt("for Right press 1, for Left press 2");
          if (choice == '1'){
            Aqua.gBoard[i][j] = {
              isAlive: 1,
              isShown: true,
              food: 0,
              directionH: dirx,
              visual:Ocypode,
              x: j,
              y:i,
              type: 'Crab'
            };
          }
          else if (choice == '2'){
            Aqua.gBoard[i][j] =  {
              isAlive: 1,
              isShown: true,
              food: 0,
              directionH: dirx,
              visual:Shrimp,
              x: j,
              y:i,
              type: 'Crab'
            };
          } 
        }
      }else{
        while (choice != '1' && choice != '2'){
          var choice = prompt("for Scalar press 1, for Moly press 2");
          var dirx = prompt("for Right press 1, for Left press 2");
          var diry = prompt("for Up press 1, for Down press 2");
          if (choice == '1'){
            Aqua.gBoard[i][j] = {
              isAlive: 1,
              isShown: true,
              food: 0,
              directionH: dirx,
              directionV: diry,
              visual:Scalar,
              x: j,
              y:i,
              type: 'Fish'
            };
          }
          else if (choice == '2'){
            Aqua.gBoard[i][j] =  {
              isAlive: 1,
              isShown: true,
              food: 0,
              directionH: dirx,
              directionV: diry,
              visual:Moly,
              x: j,
              y:i,
              type: 'Fish'
            };
          } 
        }
      }
    }else{
      alert("Your problem");
    }
  Aqua.anim.push(Aqua.gBoard[i][j])
  renderBoard()
  console.log(Aqua.gBoard);
  }
}

function changeSize(width, height) {
  // משנה את גודל הטבלה
  gSize.height = height;
  gSize.width = width;
  init();
}

function playGen() {
  if (gameIsOn) {
    clearInterval(gInterval);
  }
  gameIsOn = true;
  gInterval = setInterval(function(){
    gSpeed = 500 - slider.value;
    nextTurn();
  }, gSpeed);
}

function stopGen() {
  clearInterval(gInterval);
  gameIsOn = false;
}

function nextTurn(){
  var  coll_index = [];     // making a list that contains all of the collision spots in the current step
  var elturns = document.querySelector(".turns");
  elturns.innerText = "turn: " + Aqua.turn;
  Aqua.turn++;
  for(var i = 0; i<Aqua.anim.length; i++){
    var animal = Aqua.anim[i];
    Aqua.gBoard[animal.y][animal.x] = {
      visual: ' '  
      };

    if (animal.type == "Crab"){
      if (animal.directionH == '1'){ // going right
        if (isCollision(animal) || ((coll_index.includes(animal.x+1)))){
          coll_index.push((animal.x)+1);
          animal.directionH = '2';
          left(animal);
        }else{
          right(animal);
        }

      }else{// going left
        if (isCollision(animal) || (coll_index.includes(animal.x))){
          coll_index.push(animal.x);
          animal.directionH = '1';
          right(animal);
        }else{
          left(animal);
        }
      }
    }

    else{ // if fish
      if (animal.directionH == '1'){ // going right
        right(animal)
      }else{
        left(animal)
      }

      if (animal.directionV == '1'){ // going up
        up(animal)
      }else{
        down(animal)
      }
    }

    Aqua.gBoard[animal.y][animal.x] = animal;
    renderBoard();
  }
}

function isCollision(animal){
  var a = Aqua.gBoard[animal.y][animal.x+1].visual;   
 if (animal.directionH == '1' && !([' ', Wall].includes(Aqua.gBoard[animal.y][animal.x+1].visual))){
  return true;    
 }else if (animal.directionH == '2' &&  !([' ', Wall].includes(Aqua.gBoard[animal.y][animal.x-1].visual))){
    return true;
  }else{
   return false;
  }
}

function left(a){
  if (a.x == 1){
    a.directionH = '1';
  }else{
    a.x -= 1;
  }
}

function right(a){
  if (a.x == gSize.width-2){
    a.directionH = '2';
  }else{
    a.x += 1;
  }
}

function up(a){
  if(a.y == 3){
    a.directionV = '0';
  }else{
    a.y -= 1;
  }
}

function down(a){
  if(a.y == gSize.height-3){
    a.directionV = '1';
  }else{
    a.y += 1;
  }
}

function addAnimal(animal){
  if (animal == 1){
    var x = Math.floor(gSize.width/2);
    var y = Math.floor(gSize.height/2);
    Aqua.gBoard[y][x] = {
      isAlive: 1,
      isShown: true,
      food: 0,
      directionH: 1+Math.floor(Math.random() * 2),  
      directionV: 1+Math.floor(Math.random() * 2),
      visual:Scalar,
      x:  x,
      y:  y,
      type: 'Fish'
    };
  }
  else if (animal == 2){
    var x = Math.floor(gSize.width/2);
    var y = Math.floor(gSize.height/2);
    Aqua.gBoard[y][x] =  {
      isAlive: 1,
      isShown: true,
      food: 0,
      directionH: 1+Math.floor(Math.random() * 2),
      directionV: 1+Math.floor(Math.random() * 2),
      visual:Moly,
      x:  x,
      y:  y,
      type: 'Fish'
    };
  }
  else if (animal == 3){
    var x = Math.floor(gSize.width/2);
    var y = gSize.height-2
    Aqua.gBoard[y][x] =  {
      isAlive: 1,
      isShown: true,
      food: 0,
      directionH: 1+Math.floor(Math.random() * 2),
      visual:Shrimp,
      x: x,
      y: y,
      type: 'Crab'
    }
  }
  else{
    var x = Math.floor(gSize.width/2);
    var y = gSize.height-2
    Aqua.gBoard[y][x] = {
      isAlive: 1,
      isShown: true,
      food: 0,
      directionH: 1+Math.floor(Math.random() * 1),
      visual:Ocypode,
      x: x,
      y: y,
      type: 'Crab'
    }
  }
  Aqua.anim.push(Aqua.gBoard[y][x])
  renderBoard();
}

function setTime() {
  var minutesLabel = document.getElementById('minutes');
  var secondsLabel = document.getElementById('seconds');
  gTotalSeconds++;
  secondsLabel.innerHTML = pad(gTotalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(gTotalSeconds / 60));
}

function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}