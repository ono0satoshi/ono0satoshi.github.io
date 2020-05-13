
let pair = [];
let height = 9;
let width = 9;
let dead_td_count = 0;
let score = 0;

document.body.onload = makeTable();

function makeTable(){

  var table = document.createElement("table");

  for (let h = 0; h < height; h++) {
    var tr = document.createElement("tr");
    for (let w = 0; w < width; w++) {
      var td = createEventTd();
      td.textContent = Math.floor(Math.random() * 9 + 1);
      td.id = h*height + w;
      
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  let board = document.getElementById("table");
  board.appendChild(table);
}

function createEventTd(){
  var td = document.createElement("td");
  td.onclick=function(){
    if(td.className === "hold"){

      td.className = "";
      pair = [];

    }else{

      pair.push(td.id);

      if(pair.length === 2){
        
        swapAndCalc(pair);
        pair = [];
        
      }else{
        td.className = "hold";
      }
    }
    emptyChecker();
    gameJudge();
  };
  return td;
}

function swapAndCalc(pair){
  let td1 = document.getElementById(`${pair[0]}`);
  let td2 = document.getElementById(`${pair[1]}`);
  let td1_value = td1.textContent;
  let td2_value = td2.textContent;

  td1.textContent = td2.textContent;
  td2.textContent = td1_value;

  td1.className = "";
  
  calculation(td1,td2.id);
  calculation(td2,td1.id);
  
  td1.textContent = td2_value;
  td2.textContent = td1_value;
}

function kill_td(td){
  td.textContent = "";
  td.onclick = "";
  if(td.className != "dead"){dead_td_count +=1; td.className = "dead";}
}

function calculation(td,pair_id){
  let td_value = td.textContent -0;
  let td_id = td.id -0;
  let count_empty = 0;

  //kill up td
  if(!(td_id - height < 0)){ 
    let up_td = document.getElementById(`${td_id-height}`);
    let up_td_value = up_td.textContent -0;

    if(!(up_td.id-0===pair_id-0)){
      if(up_td_value - td_value <= 0){
        kill_td(up_td);
        count_empty += 1;
      }else{ up_td.textContent = up_td_value - td_value; }
    }
   }else{ count_empty += 1; }

   //kill down td
  if(!( td_id + height > height*width -1 )) { 
    let down_td = document.getElementById(`${td_id + height}`);
    let down_td_value = down_td.textContent -0;

    if(!(down_td.id-0===pair_id-0)){
      if(down_td_value - td_value <= 0){
        kill_td(down_td);
        count_empty += 1;
      }else{ down_td.textContent = down_td_value - td_value; }
    }
  }else{ count_empty += 1; }

  //kill left td
  if(!( td_id % height === 0 )){ 
    let left_td = document.getElementById(`${td_id-1}`);
    let left_td_value = left_td.textContent -0;

    if(!(left_td.id-0===pair_id-0)){
      if(left_td_value - td_value <= 0){
        kill_td(left_td);
        count_empty += 1;
      }else{ left_td.textContent = left_td_value - td_value; }
    }
  }else{ count_empty += 1; }

  //kill right td
  if(!( td_id % height === height-1 )){ 
    let right_td = document.getElementById(`${td_id+1}`);
    let right_td_value = right_td.textContent -0;

    if(!( right_td.id-0===pair_id-0)){
      if(right_td_value - td_value <= 0){
        kill_td(right_td);
        count_empty += 1;
        
      }else{ right_td.textContent = right_td_value - td_value; }
    }
  }else{ count_empty += 1; }

  if(count_empty === 4){ td.onclick = ""; td.className = "dead"; dead_td_count +=1; score+=td.textContent-0; }
}

//二つ以下のマスが生存、周囲に交換した数字よりも大きい数字があると終われない
//３つ以上マスが残っていない事を確かめる

//killし損ねたtdをkillする
function emptyChecker(){
  var alive_pair = {
    pair_id: [],
    add: function(obj){
      if(this.pair_id.length === 3){ this.pair_id.shift(); }
      this.pair_id.push(obj);
    },
    is_game_set: function(){
      if(this.pair_id.length < 3){ return true; }
      else{ return false; }
    },
    kill_all: function(){
      for(let i=0; i< this.pair_id.length; i++){
        kill_td(document.getElementById(this.pair_id[i]));
      }
    }
  };

  for(let h=0; h<height; h++){
    for(let w=0; w<width; w++){
      let td = document.getElementById(`${h*height + w}`);
      let td_id = td.id-0;
      let count_empty=0;

      if(td.className != "dead"){

        if(!(td_id - height <0)){
          let up_td_value = document.getElementById(`${td_id-height}`).textContent;
          if(up_td_value === ""){count_empty +=1;}
        }else{count_empty +=1;
        }
    
        if(!(td_id + height > height*width-1)){
          let down_td_value = document.getElementById(`${td_id + height}`).textContent;
          if(down_td_value === ""){count_empty +=1;}
        }else{count_empty +=1;
        }
      
        if(!( td_id % height === 0 )){
          let left_td_value = document.getElementById(`${td_id-1}`).textContent;
          if(left_td_value === ""){count_empty +=1;}
        }else{count_empty +=1;
        }
    
        if(!(td_id % height === height-1)){
          let right_td_value = document.getElementById(`${td_id+1}`).textContent;
          if(right_td_value === ""){count_empty +=1;}
        }else{count_empty +=1;
        }
      
        if(count_empty === 4){ td.onclick = ""; td.className = "dead"; dead_td_count +=1; score+=td.textContent-0; }
        else{ alive_pair.add(td_id); }

      }
    }
  }
  if(alive_pair.is_game_set()){ alive_pair.kill_all(); }
}

function gameJudge(){
  if(dead_td_count === height*width){ 
    var fin = document.createElement("p");
    fin.innerText =
     `Game Over!!
    score: ${score}`;
    document.getElementById("table").appendChild(fin);
  }
}