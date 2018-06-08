var dx = [-1, 1, 0, 0];
var dy = [ 0, 0,-1, 1];

var INF = 1e8;
var H, W; // 高さ, 幅

// 表のデータ
var B = new Array(); // 表の文字列データ
var data; // 表のコストデータ

var list = new Array(); // 2次元座標のデータを格納してある3次元配列
var idx = 0; // list[idx]: list
var maxNum = 0; // 最大操作回数

// 経路探索に使うアルゴリズムを決める
var algorithmToUse = 'DFS';

// 表の動的作成
function makeTable(data, tableId) {
   // 表の作成開始
   var rows = [];
   var table = document.createElement("table");

   // 表に2次元配列の要素を格納
   for (var i = 0; i < data.length; i++) {
      rows.push(table.insertRow(-1)); // 行の追加
      for (var j = 0; j < data[0].length; j++) {
         cell = rows[i].insertCell(-1);
         var add = (data[i][j]==INF ? "∞" : data[i][j]);
         cell.appendChild(document.createTextNode(add));
         // 背景色の設定
         cell.style.backgroundColor = "#ddd";
      }
   }
   // 指定したdiv要素に表を加える
   document.getElementById(tableId).appendChild(table);
}

// 距離データの初期化
function initData() {
   data = [];
   for (var i = 0; i < H; i++) { 
      data[i] = []; 
   }
   for (var i = 0; i < H; i++) {
      for (var j = 0; j < W; j++) {
         data[i][j] = INF;
      }
   }
}

// dfsで経路探索のデータを作る
function dfs(y, x, cost, lim) {
   if (maxNum > lim) { return; }
   maxNum++;

   data[y][x] = Math.min(data[y][x], cost);
   B[y][x] = '*';
   for (var i = 0; i < 4; i++) {
      var ny = y + dy[i], nx = x + dx[i];
      if (ny < 0 || ny >= H || nx < 0 || nx >= W) continue;
      if (B[ny][nx] == '*') continue;
      dfs(ny, nx, cost+1, lim);
   }
   B[y][x] = '.';
}

// bfsのデータを作る
function bfs(sy, sx, lim) {
   var queue = [[sy, sx]]; // [y, x]
   data[sy][sx] = 0;

   while (queue.length) {
      var q = queue.shift();
      var y = q[0], x = q[1];
      for (var i = 0; i < 4; i++) {
         var ny = y + dy[i], nx = x + dx[i];
         if (ny < 0 || ny >= H || nx < 0 || nx >= W) { continue; }
         if (data[ny][nx] != INF || B[ny][nx] == '*') { continue; }
         data[ny][nx] = data[y][x] + 1;
         queue.push([ny, nx]);
         if (maxNum > lim) {
            console.log("(%d, %d, %d)", ny, nx, lim);
            maxNum++;
            return;
         }
         maxNum++;
      }
   }
}

function initDisplay() {
   // 最初に表示させる
   initData();
   list.push(data);
   var tmpTable = document.getElementById('table');
   if (tmpTable.hasChildNodes()) { tmpTable.removeChild(tmpTable.firstChild); }
   makeTable(data, "table");
}

// getValueの次に実行される
function execute() {
   initDisplay(); // 画面を動的に変える
   var num = 10000; // とりあえずの探索回数
   for (var i = 0; i < num; i++) {
      initData();
      maxNum = 0;
      if (algorithmToUse == 'DFS') {
         dfs(0, 0, 0, i);
      } else if (algorithmToUse == 'BFS') {
         bfs(0, 0, i);
      }
      list.push(data);
   }
   list = list.slice(0, maxNum);
   console.log("初期化終了.(%d)", list.length);
}

// ステップ数を変更する
function step(stepNum) {
   var text = "step: " + stepNum;
   if (stepNum == maxNum-1) text += "(End)";
   document.getElementById("step").innerText = text;
}

// 移動
function act(hoge) {
   if (idx >= list.length) { return; }

   // HTML上のテーブルを削除
   var tmpTable = document.getElementById('table');
   if (tmpTable.hasChildNodes()) { tmpTable.removeChild(tmpTable.firstChild); }

   // 進む
   if (hoge == 'go') {
      if (idx < list.length) {
         idx++;
      }
   } else if (hoge == 'gogo') {
      if (idx+10 < list.length) {
         idx += 10;
      } else {
         idx++;
      }
   }
   // 戻る
   if (hoge == 'back') {
      if (idx > 0) {
         idx--;
      }
   } else if (hoge == 'backback') {
      if (idx-10 >= 0) {
         idx -=10;
      } else {
         idx--;
      }
   }

   if (idx >= list.length) {
      makeTable(list[maxNum-1], "table");
      idx--;
      step(idx);
      return;
   } else if (idx < 0) {
      makeTable(list[0], "table");
      idx++;
      step(idx);
      return;
   }

   step(idx);
   makeTable(list[idx], "table");

   console.log(idx+", "+maxNum);
}

// 入力
function getValue(idname) {
   var text = document.getElementById(idname).value.replace(/\r\n|\r/g, "\n");
   var lines = text.split('\n');
   for (var i = 0; i < lines.length; i++) {
      if (lines[i] == '') { continue; }
      B.push(lines[i].split('')); // 分けないとうまくいかない
   }
   H = B.length, W = B[0].length;
   console.log("H: "+H+", W: "+W);
   console.log(B);
   execute();
}

// アルゴリズムを決定する
function selectAlgorithm() {
   var element = document.getElementById("selectAlgo");
   algorithmToUse = element.value;
   console.log("algo: "+algorithmToUse);
}