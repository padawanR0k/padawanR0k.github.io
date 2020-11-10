---
title: 알고리즘 문제 풀이 - 두 정수 사이의 합
date:  2018-02-12
tags: [알고리즘 문제 풀이]

---

## 문제
함수는 정수 x, y를 매개변수로 입력받는다. 두 수와 두 수 사이에 있는 모든 정수를 더해서 리턴하도록 함수를 완성하라. x와 y가 같은 경우는 둘 중 아무 수나 리턴한다. x, y는 음수나 0, 양수일 수 있으며 둘의 대소 관계도 정해져 있지 않다. 예를들어 x가 3, y가 5이면 12를 리턴한다.


## 풀이

```javascript
function adder(x, y){
  var sum = 0;
  for (var i = (x < y ? x : y); i <= (x < y ? y : x); i++) {
    sum += i;
  }
  return sum;
}
console.log(adder(3, 5)); // 12
```

## 다른사람 풀이
```js
function adder(a, b, s = 0){ for (var i = Math.min(a, b); i <= Math.max(a, b); i++) s += i; return s; }
```

## 알게된 것
Min, Max가 있엇구나.... 알면서도 활용을 못했다...