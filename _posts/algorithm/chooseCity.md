---
title: 알고리즘 문제 풀이 - 공항 건설하기
date:  2018-03-13
tags: [알고리즘 문제 풀이]

---
https://programmers.co.kr/learn/challenge_codes/186

## 문제
1보다 큰 N개의 도시 중 한 곳에 공항을 지을 예정입니다. 사람들의 편의를 위해 공항으로부터 각 사람들까지의 도시간 이동 거리가 최소가 되는 도시에 짓기로 하였습니다. 편의상 도시는 일직선상에 놓여있다고 가정하며 좌표의 범위는 음수가 포함됩니다. 또한 좌표는 정렬되어 있지 않습니다. 직선상의 위치와 그 도시에 사는 사람들의 수가 주어질 때, 공항을 지을 도시의 위치를 반환해주는 함수 chooseCity 함수를 완성하세요. 거리가 같은 도시가 2개 이상일 경우 위치가 더 작은 쪽의 도시를 선택하면 됩니다. 예를 들어 다음과 같은 정보의 도시가 있다고 가정해 봅시다.

위치	1	2	3
인구수	5	2	3
이 살 경우, 각각의 도시에 공항을 지었을 때의 사람들의 이동 거리는 8, 8, 12 이므로 1번 또는 2번에 지을 수 있지만, 1의 위치가 더 작으므로 1을 반환해주면 됩니다.

## 풀이

```javascript
  function chooseCity(n, city) {
  var answer = 0;
  const arr = new Array(n);
  for (let i = 0; i < n; i++) {
    let population = city[i][1];
    let location = city[i][0];
    let sum = 0;
    for (let j = 0; j < n && j !== n; j++) {
      sum += (city[j][1] * Math.abs(location - city[j][0]));
    }
    arr[i] = sum
  }
  answer = arr.indexOf(Math.min(...arr)) + 1
  return answer;
}
//아래 코드는 테스트를 위한 출력 코드 입니다.
var tA = 3,
  tCity = [[1, 5], [2, 2], [3, 3]];

console.log(chooseCity(tA, tCity));
```

## 다른사람 풀이
```js
function chooseCity(n, city) {
    var sum = 0, x;
    city.sort(function (a, b) {return a[0] - b[0]; });
    while (n--) {sum += city[n][1]; }
    for (n = x = 0, sum /= 2; n < city.length; n++) {
        x += city[n][1];
        if (x >= sum) {return city[n][0]; }
    }
}
```

## 느낀점
시간이 10초 경과했다고 통과가 안된줄 알았는데, 다른 사람의 풀이를 볼 수 있는거보면 통과가 됐긴 됏나보다...
짧게쓴 다른사람의 풀이가 이해가 안된다.. 나중에 한번 분석해봐야겠다.