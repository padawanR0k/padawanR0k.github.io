---
title: 알고리즘 문제 풀이 - 최솟값 만들기
date:  2018-02-07
tags: [algorithm]

---

## 문제
자연수로 이루어진 길이가 같은 수열 A,B가 있습니다. 최솟값 만들기는 A, B에서 각각 한 개의 숫자를 뽑아 두 수를 곱한 값을 누적하여 더합니다. 이러한 과정을 수열의 길이만큼 반복하여 최종적으로 누적된 값이 최소가 되도록 만드는 것이 목표입니다.

예를 들어 A = [1, 2] , B = [3, 4] 라면

A에서 1, B에서 4를 뽑아 곱하여 더합니다.
A에서 2, B에서 3을 뽑아 곱하여 더합니다.
수열의 길이만큼 반복하여 최솟값 10을 얻을 수 있으며, 이 10이 최솟값이 됩니다.
수열 A,B가 주어질 때, 최솟값을 반환해주는 getMinSum 함수를 완성하세요.
> 출처 : [프로그래머스 알고리즘 연습 level 2](https://programmers.co.kr/learn/challenge_codes/181)

## 풀이

```javascript
function getMinSum(A,B){
    var answer = 0;
    A.sort(function (a, b) {
        return a - b;
    });
    B.sort(function (a, b) {
        return b - a;
    });
    for(var i = 0; i < A.length; i++ ){
    answer += A[i]*B[i];
  }
    return answer;
}

//아래 코드는 테스트를 위한 출력 코드 입니다.
var tA = [1,2],
    tB = [3,4];

console.log(getMinSum(tA,tB));
```

## 다른사람의 풀이
```javascript
function getMinSum(A,B){
    var answer = 0;

  A.sort((a, b) => { return a - b })
  B.sort((a, b) => { return b - a })
  for (var i = 0; i < A.length; i++) {
    answer += A[i] * B[i]
  }
    return answer;
}

//아래 코드는 테스트를 위한 출력 코드 입니다.
var tA = [2, 1],
    tB = [3,4];

console.log(getMinSum(tA,tB));
```

## 알게된 것
화살표함수라는것을 알게되었다.
- (param1, param2, …, paramN) => { statements }
(param1, param2, …, paramN) => expression
          // 다음과 동일함:  => { return expression; }
- 화살표 함수는 자신만의 this를 생성하지 않아서 this가 정확히 자신을 포함하고있는 객체를 참조한다.
- ```js
    function Person(){
    this.age = 0;

    setInterval(() => {
      this.age++; // |this| 는 정확히 person 객체를 참조
      }, 1000);
    }

    var p = new Person();
  ```
- 참조 : [애로우 펑션](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/%EC%95%A0%EB%A1%9C%EC%9A%B0_%ED%8E%91%EC%85%98)