---
title: 알고리즘 문제 풀이 - 행렬의 곱셈
date:  2018-03-04
tags: [알고리즘 문제 풀이]

---
https://programmers.co.kr/learn/challenge_codes/39

## 문제
자연수 N개로 이루어진 집합 중에, 각 원소의 합이 S가 되는 수의 집합은 여러 가지가 존재합니다. 최고의 집합은, 위의 조건을 만족하는 집합 중 각 원소의 곱이 최대가 되는 집합을 의미합니다. 집합 원소의 개수 n과 원소들의 합 s가 주어지면, 최고의 집합을 찾아 원소를 오름차순으로 반환해주는 bestSet 함수를 만들어 보세요. 만약 조건을 만족하는 집합이 없을 때는 배열 맨 앞에 –1을 담아 반환하면 됩니다. 예를 들어 n=3, s=13이면 [4,4,5]가 반환됩니다.
(자바는 집합이 없는 경우 크기가 1인 배열에 -1을 담아 반환해주세요.)


## 풀이

```javascript
  function bestSet(n, s) {
  let answer = [];
  if (!s) answer[0] = -1;
  let quotient = Math.floor(s / n);
  let Remainder = s % n;

  for (let i = 0; i < n; i++) {
    answer.push(quotient);
  }
  answer = answer.map((item) => {
    if (Remainder) {
      Remainder--;
      return item + 1;
    } else {
      return item;
    }
  })
  answer.sort((a, b) => a - b)
  return answer;
}

// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log(bestSet(3, 13)); // 4 4 5
```
## 접근법
나눈다 -> 몫에다가 1씩 더하면서 나머지를 1씩 줄인다 -> 나머지가 0이 되면 끝!

## 다른사람 풀이
```js
function bestSet(n, s) {
    var answer = [];
  //n값이 3이고 s값이 13인 경우
  //첫번째 13 / 3 이므로 첫번째 원소는 4
  //두번째는 첫번째 원소를 뺀 s값 (13 - 4) / 2 이므로 9 / 2 두번째 원소는 4
  //세번째는 첫번째 두번째 원소를 뺀 s값(13 - 4 - 4) / 1 이므로 5 / 1 세번째 원소는 5
  //결론 전체 원소는 4, 4, 5
  for(var i = n; i >= 1; i--){
    answer.push(parseInt(s/i));
    s = s - (parseInt(s/i));
  }
    return answer;
}

// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log(bestSet(19,24));
```

## 느낀점
접근 하는 방법이 다르니까 코드가 확 줄어든다 ㄷㄷ