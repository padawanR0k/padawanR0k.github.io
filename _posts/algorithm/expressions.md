---
title: 알고리즘 문제 풀이 - 숫자의 표현
date:  2018-03-10
tags: [알고리즘 문제 풀이]

---
https://programmers.co.kr/learn/challenge_codes/42

## 문제
수학을 공부하던 민지는 재미있는 사실을 발견하였습니다. 그 사실은 바로 연속된 자연수의 합으로 어떤 숫자를 표현하는 방법이 여러 가지라는 것입니다. 예를 들어, 15를 표현하는 방법은
(1+2+3+4+5)
(4+5+6)
(7+8)
(15)
로 총 4가지가 존재합니다. 숫자를 입력받아 연속된 수로 표현하는 방법을 반환하는 expressions 함수를 만들어 민지를 도와주세요. 예를 들어 15가 입력된다면 4를 반환해 주면 됩니다.


## 풀이

```javascript
function expressions(num) {
  var answer = 0;
  for (let i = 1; i <= num; i++) {
    let sum = 0;
    for ( let j = i; j <= num; j++) {
      sum += j;
      if ( sum === num ) {
        answer++;
        j = num;
      }
    }
  }
  return answer;
}

// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log(expressions(15));
```

## 접근한 방법

1부터 num까지 더하면서 num과 비교 후 같아지면 answer는 1증가,
더 크다면 시작하는 숫자를 1씩 증가

num = 5 라면

1. 1 -> 1,2 -> 1,2,3 (합이 num보다 더 커졋다)
2. 2 -> 2,3 (합이 num과 같아짐 answer 1증가)
3. 3 -> 3,4 (합이 num보다 더 커졋다)
4. 4 -> 4,5 (합이 num보다 더 커졋다)
5. 5 (합이 num과 같다)



## 다른사람 풀이
```js
function expressions(num) {
    var answer = 0;
  var k = 0;

    while((k*(k-1)/2)<=num){
      if(Number.isInteger((num/k)-(k-1)/2) && ((num/k)-(k-1)/2 != 0)){
        answer++;
      }
      k++;
    }

    return answer;
}

// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log(expressions(15));
```

## 느낀점
수학 공식을 사용한건가?? 내께 더 간단한거같다!