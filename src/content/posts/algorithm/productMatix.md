---
author: [padawanr0k]
title: 알고리즘 문제 풀이 - 행렬의 곱셈
date:  2018-03-04
tags: [algorithm]

---
https://programmers.co.kr/learn/challenge_codes/142

## 문제
행렬의 곱셈은, 곱하려는 두 행렬의 어떤 행과 열을 기준으로, 좌측의 행렬은 해당되는 행, 우측의 행렬은 해당되는 열을 순서대로 곱한 값을 더한 값이 들어갑니다. 행렬을 곱하기 위해선 좌측 행렬의 열의 개수와 우측 행렬의 행의 개수가 같아야 합니다. 곱할 수 있는 두 행렬 A,B가 주어질 때, 행렬을 곱한 값을 출력하는 productMatrix 함수를 완성해 보세요.


## 풀이

```javascript
  function productMatrix(A, B) {
    if (A[0].length !== B.length) return false;
    var answer = new Array(A.length); // A의 행만큼 자리확보 [ , ]
    var sum = 0;
    for (var i = 0; i < answer.length; i++) {
      answer[i] = new Array(B[0].length); // B의 열만큼 요소안에 자리확보 [ [ , ], [ , ] ] 이 상태
      for (var j = 0; j < A.length;j++) {
        answer[i][j] = 0; // 숫자형으로 변환
        for (var k = 0; k < B.length; k++) {
          answer[i][j] +=A[i][k] * B[k][j];
        }
      }
    }
    return answer;
  }

// 아래는 테스트로 출력해 보기 위한 코드입니다.
var b = [[1, 2], [4, 5]];
var a = [[1, 2], [4, 5]];
console.log("결과 : " + productMatrix(a, b));
```

## 다른사람 풀이
```js
function productMatrix_(A, B) {
    return A.map(function (a, i) {
        return B[0].map(function (b, j) {
            return B.reduce(function (v, c, k) {
                return v + A[i][k] * B[k][j];
            }, 0);
        });
    });
}
// map과 reduce를 활용해 작성하였지만 첫번째 함수보다 2배느림
```

## 느낀점
어떻게 하는진 아는데 그걸 코드화 하려니까 정말 오래걸렷다...