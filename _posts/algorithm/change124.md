---
title: 알고리즘 문제 풀이 - 124나라의 숫자
date:  2018-05-08
tags: [algorithm]

---
https://programmers.co.kr/learn/challenge_codes/48/

## 문제
1,2,4 세 개의 숫자만 쓰는 124나라가 있습니다.

124나라에서 사용하는 숫자는 다음과 같이 변환됩니다.

10진법의 1 → 1
10진법의 2 → 2
10진법의 3 → 4
10진법의 4 → 11
10진법의 5 → 12
10진법의 6 → 14
10진법의 7 → 21
10진법의 수 N이 입력될 때, 124나라에서 쓰는 숫자로 변환하여 반환해주는 change124 함수를 완성해 보세요. 예를 들어 N = 10이면 “41”를 반환해주면 됩니다.

리턴 타입은 문자열입니다.

## 풀이

```javascript
function change124(n) {
	var answer = "";
  while (n >0) {
    var remainder = n % 3;
    n = Math.floor(n / 3);
    if (remainder === 0) n = n-1;
    answer += remainder.toString();
  }
  answer = answer.split('').reverse().join('').replace( /0/gi , '4');
	return answer;
}

```
![](http://www.a24s.com/data/jeongbotongsinhakseub/junja/junja_8/ee8-2-1.jpg)

2진수로 변환했을 때처럼 노트에 그려가면서 하니 n%3이 0일 때에는 자리수를 나타내줄 0이 없기때문에 n을 1씩 뺴줘야한다는걸 알게 됬다.

## 다른사람 풀이
```js
function change124(n) {
  return n === 0 ? '' : change124(parseInt((n - 1) / 3)) + [1, 2, 4][(n - 1) % 3];
}
// 와.......
```