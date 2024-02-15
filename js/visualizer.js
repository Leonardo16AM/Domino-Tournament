const horizontal = 0;
const vertical = 1;
let firstMove=true;

const cellSize = 1;
const gap = 0.04;
const boardWidth = 90;
const boardHeight = 40;

let cur=[];

let chips=new Map();
const ply_hands=[];

let gameLen=0;
let currentMove=1;

// Get the URL parameters
var urlParams = new URLSearchParams(window.location.search);
// Get the match ID from the URL parameters
var matchId = urlParams.get('matchId');

const gameDataPromise = fetch(`./games/${matchId}.json`).then(r=>r.json()).then(data => {
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
      "j" : (boardWidth/cellSize)/2-7,
      "dir" : 3
    }
    cur[1]={
      "x" : b,
      "d" : d,
      "o" : o,
      "i" : (boardHeight/cellSize)/2-2,
      "j" : (boardWidth/cellSize)/2-7,
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
      if(prev.j>=63){
        if(p==0){
          t=2;
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
      if(prev.j<=16){
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

function print_hands(){
  let temp=firstMove;
  firstMove=0;
  const ni=[1,boardHeight/2-cellSize*10,boardHeight-5,boardHeight/2-cellSize*10];
  // const nj=[boardWidth/2-cellSize*10,boardWidth,boardWidth/2-cellSize*10 ,8];
  const nj=[boardWidth/2-cellSize*14,72,boardWidth/2-cellSize*14 ,8];
  for(let i=0 ; i<4;  i++){
    let ii=0,ij=i!=2?0:-1;
    for(const e of ply_hands[i]){
      let temp_chip=e[0]+''+e[1];
      if(!chips.has(temp_chip)){
        placeToken((!(i%2)),e[0],e[1],ni[i]+ii*2,nj[i]+ij*2);
        ii+=((i%2));
        ij+=(!(i%2));
      }
    }
  }
  firstMove=temp;
}

function simulateGame(limit){
  chips.clear();
  let result = document.getElementById("result_text");
  result.style.visibility="hidden";

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
      let key=e[2].join('');
      chips.set(key,1);
      move(a,b,p);
    }
    else if(e[0]=="WIN"){
      result.style.visibility="visible";
    }
  }
  document.getElementById("move_count").innerHTML=`Move #${currentMove-1}`;
  let moveTexts=document.getElementsByClassName("move_text");
  let i=1;
  for(e of moveTexts){
    if(i<=currentMove-1)e.className="move_text player_move_text";
    else e.className="move_text";
    i++;
  }
  print_hands();
}

function initGame(){
  for(const e of gameData["0"]){      // guardar las manos  d los players en ply_hands
    if(e[0]=="HAND"){
      ply_hands.push(e[1]);
    }
  }
  print_hands();

  gameLen=gameData[0].length-7;
  let c=0,i=0,row=``;
  let gameTableBody=document.getElementById("game_table_body");
  for(const e of gameData["0"]){
    if(e[0]=="MOVE" || e[0]=="PASS"){
      if(c==0)row=`<tr><th scope="row">${++i}</th>`;
      c++;
      if(e[0]=="MOVE"){
        let a=e[2][0],b=e[2][1],p=e[3];
        let pc=`▼`;
        if(p)pc=`▲`;
        row+=`<td class="move_text">[${a} | ${b}]${pc}</td>`;
      }
      else{
        row+=`<td class="move_text">---------</td>`;
      }

      if(c==4){
        gameTableBody.innerHTML+=row+`</tr>`;
        c=0;
      }
    }
    else if(e[0]=="WIN"){
      let result = document.createElement("h1");
      result.id=("result_text");
      result.innerHTML=`Player ${e[1]+1} wins!`;
      result.style.visibility="hidden";
      document.getElementById("gamelog").appendChild(result);
    }
  }
  if(c!=0){
    gameTableBody.innerHTML+=row+`</tr>`;
  }

  let moveTexts=document.getElementsByClassName("move_text");
  i=1;
  for(e of moveTexts){
    i++;
    const a=i;
    e.onclick = function(){
      currentMove=a;
      simulateGame(currentMove);
    };
  }
}


window.onload = async () =>{ 
  gameData = await gameDataPromise;
  initGame();

  let nextBtn=document.getElementById("next_move_btn");
  nextBtn.onclick = function(){
    if(currentMove<=gameLen)currentMove++;
    simulateGame(currentMove);
  };

  let prevBtn=document.getElementById("prev_move_btn");
  prevBtn.onclick = function(){
    currentMove--;
    if(currentMove==0)currentMove=1;
    simulateGame(currentMove);
  };

  let fullNextBtn=document.getElementById("full_next_move_btn");
  fullNextBtn.onclick = function(){
    currentMove=gameLen+1;
    simulateGame(currentMove);
  };

  let fullPrevBtn=document.getElementById("full_prev_move_btn");
  fullPrevBtn.onclick = function(){
    currentMove=1;
    simulateGame(currentMove);
  };
}

document.addEventListener("keypress", function(e) {
  if (e.key=="a" || e.key=="A") {
    currentMove--;
    if(currentMove==0)currentMove=1;
    simulateGame(currentMove);
  }
  if (e.key=="d" || e.key=="D") {
    if(currentMove<=gameLen)currentMove++;
    simulateGame(currentMove);
  }
});