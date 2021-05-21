---
author: [padawanr0k]
title: 알고리즘 문제 풀이 - 땅따먹기 게임
date:  2018-03-20
tags: [algorithm]

---

## 문제
영희는 땅따먹기 게임에 푹 빠졌습니다. 땅따먹기 게임의 땅은 총 N행 4열로 나누어져 있고, 모든 칸에는 점수가 쓰여 있습니다. 땅을 밟으면서 한 행씩 내려올 때, 영희는 각 행의 4칸 중 1칸만 밟으면서 내려올 수 있습니다. 땅따먹기 게임에는 같은 열을 연속해서 밟을 수가 없는 특수 규칙이 있습니다. 즉, 1행에서 (5)를 밟았다면, 2행의 (8)은 밟을 수가 없게 됩니다. 마지막 행까지 모두 내려왔을 때, 점수가 가장 높은 사람이 게임의 승자가 됩니다. 여러분이 hopscotch 함수를 제작하여 영희가 최대 몇 점을 얻을 수 있는지 알려주세요. 예를 들어

1 2 3 5
5 6 7 8
4 3 2 1

의 땅이 있다면, 영희는 각 줄에서 (5), (7), (4) 땅을 밟아 16점을 최고점으로 받을 수 있으며, hopscotch 함수에서는 16을 반환해주면 됩니다.



## 포기
학원에서 배운걸 복습해야할 시간에 이 문제가 계속 생각나는 바람에 너무 많은 시간을 이 문제를 풀려는데 써버렷고 더 이상 매달리는건 무리인거같아서 포기...
근데 답이 너무 궁금해서 java로 풀어진 답안을 가져와 복붙했음


## 다른사람의 풀이

```javascript
function hopscotch(board, size) {
var result = 0;
// 함수를 완성하세요. 첫번째 정답
  for (let i = 1; i < size; i++) {
    board[i][0] += Math.max(board[i - 1][1], Math.max(board[i - 1][2], board[i - 1][3]));
    board[i][1] += Math.max(board[i - 1][0], Math.max(board[i - 1][2], board[i - 1][3]));
    board[i][2] += Math.max(board[i - 1][0], Math.max(board[i - 1][1], board[i - 1][3]));
    board[i][3] += Math.max(board[i - 1][0], Math.max(board[i - 1][1], board[i - 1][2]));
  }
  return Math.max(board[size - 1][0], Math.max(board[size - 1][1], Math.max(board[size - 1][2], board[size - 1][3])));
}
```
굉장히 직관적이다. 접근하는 방법이 나와 180도 달라서 짧으면서도 보기쉬운 코드가 나온거 같다.

## 또 다른 풀이
```javascript
function hopscotch(board, size) {
  var result = 0;
  // 함수를 완성하세요.
  var temp;
  for ( var i= 1; i<board.length; i++){
    for( var j=0; j<board[0].length; j++){
      temp = board[i-1].slice();
      temp[j] = 0;
      board[i][j] += Math.max.apply(null,temp);
    }
  }
  result = Math.max.apply(null,board[board.length-1]);
  return result;
}

 //아래는 테스트로 출력해 보기 위한 코드입니다.
var board = [[ 1, 2, 3, 5 ], [ 5, 6, 7, 8 ], [ 4, 3, 2, 1]];
console.log(hopscotch(board, 3));
```
나도 이런식으로 생각했는데, 내 접근은 [1]번째열에서 시작하지않고 [0]번째열부터 시작하려고해서 안풀렸다. 다음부터는 문제가 안풀릴때 접근방법을 바꾸려는 시도를 해야겠다.
