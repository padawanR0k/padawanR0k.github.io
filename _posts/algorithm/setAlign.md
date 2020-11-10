---
title: 알고리즘 문제 풀이 - 줄 서는 법
date:  2018-05-05
tags: [알고리즘 문제 풀이]

---
https://programmers.co.kr/learn/challenge_codes/51

## 문제
N명의 사람이 있을 때, N명의 사람을 서로 다른 방법으로 줄을 세우는 방법은 N!개가 존재합니다.

이 때 각각의 사람들에게 번호를 매겨서 줄을 서는 방법을 표시합니다. 예를들어 [1,2,3,4]는 1번 사람이 제일 앞에, 2번 사람이 2두번째에... 서 있는 상태를 나타냅니다.

이러한 각각의 방법을 사전순으로 정렬했을때 K번째 방법으로 줄을 세우는 방법을 찾아 보려고 합니다.

예를 들어 3명의 사람이 있다면 총 6개의 방법은 다음과 같이 정렬할 수 있습니다.

1번째 방법은 [1,2,3]
2번째 방법은 [1,3,2]
3번째 방법은 [2,1,3]
4번째 방법은 [2,3,1]
5번째 방법은 [3,1,2]
6번째 방법은 [3,2,1]
이 때 K가 5이면 [3,1,2]가 그 방법입니다.

사람의 수 N과 순서 K를 입력받아 K번째 방법으로 줄을 세우는 setAlign 함수를 완성해 보세요. 예를 들어 setAlign(3,5)를 입력받는다면 [3,1,2]를 리턴해주면 됩니다.

## 풀이

```javascript
    function setAlign(n, k) {
    var answer = [];
    let numList = new Array(n);
    function factorial(n) {
      let fac = 1;
      for (let i = 1; i <=n; i++) { fac *= i };
      return fac;
    }
    for (let i = 1; i <= n; i++) {
      numList[i-1] = i;
    }

    for (let i = numList.length; i >= 1; i--) {
      let popNumIdx = (Math.ceil(k / (factorial(i) / numList.length)) - 1) % numList.length;
      answer = answer.concat(...numList.splice(popNumIdx, 1));
    }
    return answer;
  }

  // 아래는 테스트로 출력해 보기 위한 코드입니다.
  console.log(setAlign(3, 1));
  }
```

## 다른사람 풀이
```js
function setAlign(n, k) {
    var answer = [];
    var p = [];
  var f = 1;
  for(var i=1; i<=n; i++){
    f *= i;
    p.push(i);
  }

  while(n != 0){
    var m = f / n;
    var idx = Math.floor(k / m);
    f = m;
    n = n-1;
    k = k % m;

    if(k%m == 0){
     idx = idx - 1 < 0 ? idx : idx - 1;
    }

    answer.push(p[idx]);

    p.splice(idx,1);

  }

    return answer;
}
// 변수를 써서 식을 나눠놓으니 가독성이 더 좋아보인다.
```

## 느낀점
레벨1 차이인데 갑자기 너무 어려워졌다. 2일 걸려 품...