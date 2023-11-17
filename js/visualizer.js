const horizontal = 0;
const vertical = 1;
let firsMove=true;

function drawToken(orientation, a, b, y, x, l){
  let token = document.createElement("div");
  let o="v";
  if(orientation==horizontal)o="h";
  if(firsMove)token.className="domino_token first_move";
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

const cellSize = 1;
const gap = 0.04;
const boardWidth = 100;
const boardHeight = 40;

function placeToken(orientation, a, b, i, j){
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
      nj=j+1;
      no=vertical;
    }
    else if(t == 2){
      ni=i-4;
      nj=j+2;
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
      nj=j+1;
      no=vertical;
    }
    else if(t == 6){
      ni=i+2;
      nj=j;
      no=vertical;
    }
    else if(t == 7){
      ni=i;
      nj=j-4;
      no=horizontal;
    }
    else if(t == 8){
      ni=i-1;
      nj=j-2;
      no=vertical;
    }
    else if(t == 9){
      ni=i-1;
      nj=j+4;
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
      ni=i;
      nj=j+2;
      no=horizontal;
    }
    else if(t == 2){
      ni=i+1;
      nj=j+2;
      no=horizontal;
    }
    else if(t == 3){
      ni=i+2;
      nj=j+2;
      no=horizontal;
    }
    else if(t == 4){
      ni=i+4;
      nj=j;
      no=vertical;
    }
    else if(t == 5){
      ni=i+2;
      nj=j-4;
      no=horizontal;
    }
    else if(t == 6){
      ni=i+1;
      nj=j-4;
      no=horizontal;
    }
    else if(t == 7){
      ni=i;
      nj=j-4;
      no=horizontal;
    }
    else if(t == 8){
      ni=i-2;
      nj=j-1;
      no=horizontal;
    }
    else if(t == 9){
      ni=i+4;
      nj=j-1;
      no=vertical;
    }
  }
  return {
    "i" : ni,
    "j" : nj,
    "o" : no,
  }
}

let cur=[];

function move(a, b, p){
  if(firsMove){
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
    }
    cur[1]={
      "x" : b,
      "d" : d,
      "o" : o,
      "i" : (boardHeight/cellSize)/2-2,
      "j" : (boardWidth/cellSize)/2-2,
    }
    placeToken(o, a, b, cur[0].i, cur[0].j);
    firsMove=false;
  }
  else{
    if(p==0){
      if(a==cur[0].x){
        a^=b;
        b^=a;
        a^=b;
      }
      let token;
      if(a==b)token=nextToPos(cur[0].i,cur[0].j,cur[0].o,8);
      else {
        if(cur[0].d)token=nextToPos(cur[0].i,cur[0].j,cur[0].o,6);
        else token=nextToPos(cur[0].i,cur[0].j,cur[0].o,7);
      }
      placeToken(token.o,a,b,token.i,token.j);
      cur[0]={
        "x" : a,
        "d" : (a==b),
        "o" : token.o,
        "i" : token.i,
        "j" : token.j,
      }
    }
    else{
      if(b==cur[1].x){
        a^=b;
        b^=a;
        a^=b;
      }
      let token;
      if(a==b)token=nextToPos(cur[1].i,cur[1].j,cur[1].o,9);
      else {
        if(cur[1].d)token=nextToPos(cur[1].i,cur[1].j,cur[1].o,2);
        else token=nextToPos(cur[1].i,cur[1].j,cur[1].o,3);
      }
      placeToken(token.o,a,b,token.i,token.j);
      cur[1]={
        "x" : a,
        "d" : (a==b),
        "o" : token.o,
        "i" : token.i,
        "j" : token.j,
      }
    }
  }
}
/*move(4,2,0);
move(4,3,0);
move(3,3,0);
move(2,5,1);
move(5,5,1);
move(5,6,1);
move(3,6,0);*/

function simulateGame(){
  fetch('./game.json')
  .then(response => response.json())
  .then(data => {
    for(const e of data["0"]){
      if(e[0]=="NEW_GAME"){
        document.getElementById("domino_board").innerHTML="";
        firsMove=true;
      }
      else if(e[0]=="MOVE"){
        let a=e[2][0],b=e[2][1],p=e[3];
        move(a,b,p);
        console.log(a,b,p);
      }
      else if(e[0]=="WIN"){
        let result = document.createElement("h1");
        result.className=("result_text");
        result.innerHTML=`Player ${e[1]} wins!`;
        document.getElementById("domino_board").appendChild(result);
      }
    }
  })
  .catch(error => {
    console.error('Error reading the JSON file: ', error);
  });
}

simulateGame();