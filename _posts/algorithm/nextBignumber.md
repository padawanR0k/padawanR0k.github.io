---
title: 알고리즘 문제 풀이 - 다음 큰  숫자
date:  2018-03-07
tags: [algorithm]

---
https://programmers.co.kr/learn/challenge_codes/174

## 문제
어떤 수 N(1≤N≤1,000,000) 이 주어졌을 때, N의 다음 큰 숫자는 다음과 같습니다.

N의 다음 큰 숫자는 N을 2진수로 바꾸었을 때의 1의 개수와 같은 개수로 이루어진 수입니다.
1번째 조건을 만족하는 숫자들 중 N보다 큰 수 중에서 가장 작은 숫자를 찾아야 합니다.
예를 들어, 78을 2진수로 바꾸면 1001110 이며, 78의 다음 큰 숫자는 83으로 2진수는 1010011 입니다.
N이 주어질 때, N의 다음 큰 숫자를 찾는 nextBigNumber 함수를 완성하세요.

## 풀이

```javascript
function nextBigNumber(n) {
  var answer = 0;
  const nBinary = n.toString(2);
  const regExp = /1/g;
  let nextBigNum = n;
  let flag = 10;
  while (flag){
    nextBigNum++;
    if (nBinary.match(regExp).length === nextBigNum.toString(2).match(regExp).length) {
      answer = nextBigNum;
        flag = !flag;
    }
  }
  return answer;
}
```

## 다른사람 풀이
```js
function nextBigNumber(n) {
    var size = n.toString(2).match(/1/g).length
    while(n++) {
        if(size === n.toString(2).match(/1/g).length) return n
    }
}
```

## 느낀점
굳이 쓸모없는 변수를 많이 선언한거같다. 필요하지않은 변수를 지정하는 습관을 줄이자