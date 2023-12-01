const horizontal = 0;
const vertical = 1;
let firstMove=true;

const cellSize = 1;
const gap = 0.04;
const boardWidth = 90;
const boardHeight = 40;

let cur=[];

let gameLen=0;
let currentMove=1;

const gameDataPromise = fetch("./game.json").then(r=>r.json()).then(data => {
  return data;
});

function drawToken(orientation, a, b, y, x, l){
  let token = document.createElement("div");
  let o="v";
  if(orientation==horizontal)o="h";
  if(firstMove)token.className="domino_token first_move";
  else token.className="domino_token";
  token.style.left = `${x}vw`;
  token.style.top = `${y}vw`;
  let tokenDiv1 = document.createElement("div");
  tokenDiv1.className="domino_slice";
  tokenDiv1.style.width = l + "vw";
  tokenDiv1.style.height = l + "vw";
  tokenDiv1.style.backgroundImage = `url(./images/${o}${a}.png)`;
  let tokenDiv2 = document.createElement("div");
  tokenDiv2.className="domino_slice";
  tokenDiv2.style.width = l + "vw";
  tokenDiv2.style.height = l + "vw";
  tokenDiv2.style.backgroundImage = `url(./images/${o}${b}.png)`;
  if(orientation==horizontal){
    token.style.display="flex";
  }
  else{
    token.style.display="block";
  }
  token.appendChild(tokenDiv1);
  token.appendChild(tokenDiv2);
  document.getElementById("domino_board").appendChild(token);
}

function drawToken2(orientation, a, b, y, x, l){
  let scale=14;
  x*=scale;
  y*=scale;
  l*=scale;
  let token = document.createElement("div");
  let o="v";
  if(orientation==horizontal)o="h";
  token.className="domino_token";
  token.style.left = `${x}px`;
  token.style.top = `${y}px`;
  let tokenDiv1 = document.createElement("div");
  tokenDiv1.className="domino_slice";
  tokenDiv1.style.width = l + "px";
  tokenDiv1.style.height = l + "px";
  tokenDiv1.style.backgroundImage = `url(./images/${o}${a}.png)`;
  let tokenDiv2 = document.createElement("div");
  tokenDiv2.className="domino_slice";
  tokenDiv2.style.width = l + "px";
  tokenDiv2.style.height = l + "px";
  tokenDiv2.style.backgroundImage = `url(./images/${o}${b}.png)`;
  if(orientation==horizontal){
    token.style.display="flex";
  }
  else{
    token.style.display="block";
  }
  token.appendChild(tokenDiv1);
  token.appendChild(tokenDiv2);
  document.getElementById("domino_board").appendChild(token);
}

function placeToken(orientation, a, b, i, j){
  j-=6;
  drawToken(orientation, a, b, i*(gap+cellSize), j*(gap+cellSize), cellSize*2);
}

function nextToPos(i, j, orientation, t){
  let ni,nj,no;
  if(orientation == horizontal){
    if(t == 0){
      ni=i-4;
      nj=j;
      no=vertical;
    }
    else if(t == 1){
      ni=i-4;
      nj=j+2;
      no=vertical;
    }
    else if(t == 2){
      ni=i-1;
      nj=j+4;
      no=vertical;
    }
    else if(t == 3){
      ni=i;
      nj=j+4;
      no=horizontal;
    }
    else if(t == 4){
      ni=i+2;
      nj=j+2;
      no=vertical;
    }
    else if(t == 5){
      ni=i+2;
      nj=j;
      no=vertical;
    }
    else if(t == 6){
      ni=i;
      nj=j-4;
      no=horizontal;
    }
    else if(t == 7){
      ni=i-1;
      nj=j-2;
      no=vertical;
    }
  }
  else{
    if(t == 0){
      ni=i-4;
      nj=j;
      no=vertical;
    }
    else if(t == 1){
      ni=i+1;
      nj=j+2;
      no=horizontal;
    }
    else if(t == 2){
      ni=i+4;
      nj=j;
      no=horizontal;
    }
    else if(t == 3){
      ni=i+4;
      nj=j;
      no=vertical;
    }
    else if(t == 4){
      ni=i+4;
      nj=j-2;
      no=horizontal;
    }
    else if(t == 5){
      ni=i+1;
      nj=j-4;
      no=horizontal;
    }
    else if(t == 6){
      ni=i-2;
      nj=j-2;
      no=horizontal;
    }
    else if(t == 7){
      ni=i-2;
      nj=j;
      no=horizontal;
    }
  }
  return {
    "i" : ni,
    "j" : nj,
    "o" : no,
  }
}

function move(a, b, p){
  if(firstMove){
    let o=horizontal;
    if(a==b)o=vertical;
    let d=false;
    if(a==b)d=true;
    cur[0]={
      "x" : a,
      "d" : d,
      "o" : o,
      "i" : (boardHeight/cellSize)/2-2,
      "j" : (boardWidth/cellSize)/2-2,
      "dir" : 3
    }
    cur[1]={
      "x" : b,
      "d" : d,
      "o" : o,
      "i" : (boardHeight/cellSize)/2-2,
      "j" : (boardWidth/cellSize)/2-2,
      "dir" : 1
    }
    placeToken(o, a, b, cur[0].i, cur[0].j);
    firstMove=false;
  }
  else{
    let prev=cur[p];
    let token;
    let x,dir,t,xd;
    if(prev.dir==0){
      if(prev.j<50){
        t=7;
        dir=1;
      }
      else{
        t=6;
        dir=3;
      }
    }
    else if(prev.dir==1){
      if(prev.j>=69){
        if(p==0){
          t=4;
          dir=2;
        }
        else{
          t=1;
          dir=0;
        }
      }
      else{
        if(a==b)t=2;
        else if(prev.o==vertical)t=1;
        else t=3;
        dir=1;
      }
    }
    else if(prev.dir==2){
      if(prev.j<50){
        t=2;
        dir=1;
      }
      else{
        t=4;
        dir=3;
      }
    }
    else{
      if(prev.j<=13){
        if(p==0){
          t=5;
          dir=2;
        }
        else{
          t=0;
          dir=0;
        }
      }
      else{
        if(a==b)t=7;
        else if(prev.o==vertical)t=5;
        else t=6;
        dir=3;
      }
    }

    if((dir==0 && a==prev.x) || (dir==1 && b==prev.x) || (dir==2 && b==prev.x)|| (dir==3 && a==prev.x)){
      a^=b;
      b^=a;
      a^=b;
    }
    if(dir==0 || dir==3)x=a;
    else x=b;

    token=nextToPos(prev.i,prev.j,prev.o,t);
    placeToken(token.o,a,b,token.i,token.j);
    cur[p]={
      "x" : x,
      "d" : (a==b),
      "o" : token.o,
      "i" : token.i,
      "j" : token.j,
      "dir" : dir
    }
  }
}

function simulateGame(limit){
  limit+=4;
  for(const e of gameData["0"]){
    if(limit==0 && e[0]!="WIN" && e[0]!="OVER")break;
    limit--;
    if(e[0]=="NEW_GAME"){
      document.getElementById("domino_board").innerHTML="";
      firstMove=true;
    }
    else if(e[0]=="MOVE"){
      let a=e[2][0],b=e[2][1],p=e[3];
      move(a,b,p);
    }
    else if(e[0]=="WIN"){
      let result = document.createElement("h1");
      result.className=("result_text");
      result.innerHTML=`Player ${e[1]+1} wins!`;
      document.getElementById("domino_board").appendChild(result);
    }
  }
}

function initGame(){
  gameLen=gameData[0].length-7;
  let gameTableBody=document.getElementById("game_table_body");
  for(const e of gameData["0"]){
    if(e[0]=="MOVE"){
      let a=e[2][0],b=e[2][1],p=e[3];
      gameTableBody.innerHTML+=`<tr>
        <th scope="row">a</th>
        <td>asd</td>
        <td>asd</td>
        <td>asd</td>
        <td>asd</td>
      </tr>`;
    }
    else if(e[0]=="WIN"){
      
    }
  }
}

window.onload = async () =>{ 
  gameData = await gameDataPromise;
  initGame();

  let nextBtn=document.getElementById("next_move_btn");
  nextBtn.onclick = function(){
    if(currentMove<=gameLen)currentMove++;
    simulateGame(currentMove);
    document.getElementById("move_count").innerHTML=`Move #${currentMove-1}`;
  };

  let prevBtn=document.getElementById("prev_move_btn");
  prevBtn.onclick = function(){
    currentMove--;
    if(currentMove==0)currentMove=1;
    simulateGame(currentMove);
    document.getElementById("move_count").innerHTML=`Move #${currentMove-1}`;
  };

  let fullNextBtn=document.getElementById("full_next_move_btn");
  fullNextBtn.onclick = function(){
    currentMove=gameLen+1;
    simulateGame(currentMove);
    document.getElementById("move_count").innerHTML=`Move #${currentMove-1}`;
  };

  let fullPrevBtn=document.getElementById("full_prev_move_btn");
  fullPrevBtn.onclick = function(){
    currentMove=1;
    simulateGame(currentMove);
    document.getElementById("move_count").innerHTML=`Move #${currentMove-1}`;
  };
}