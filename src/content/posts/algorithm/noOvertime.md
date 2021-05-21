---
author: [padawanr0k]
title: 알고리즘 문제 풀이 - 야근 지수
date:  2018-03-06
tags: [algorithm]

---
https://programmers.co.kr/learn/challenge_codes/27

## 문제
야근 지수
회사원인 수민이는 많은 일이 쌓여 있습니다. 수민이는 야근을 최소화하기 위해 남은 일의 작업량을 숫자로 메기고, 일에 대한 야근 지수를 줄이기로 결정했습니다. 야근 지수는 남은 일의 작업량을 제곱하여 더한 값을 의미합니다. 수민이는 1시간 동안 남은 일 중 하나를 골라 작업량 1만큼 처리할 수 있습니다. 수민이의 퇴근까지 남은 N 시간과 각 일에 대한 작업량이 있을 때, noOvertime 함수를 제작하여 수민이의 야근 지수를 최소화 한 결과를 출력해 주세요. 예를 들어, N=4 일 때, 남은 일의 작업량이 [4, 3, 3] 이라면 야근 지수를 최소화하기 위해 일을 한 결과는 [2, 2, 2]가 되고 야근 지수는 22 + 22 + 22 = 12가 되어 12를 반환해 줍니다.

## 풀이

```javascript
  function noOvertime(no, works) {
	var result = 0;
	// 야근 지수를 최소화 하였을 때의 야근 지수는 몇일까요?
  let max = 0;
	const arr = works;
  for ( let i = 0; i < no; i++ ) {
  	max = Math.max(...arr);
    arr[arr.indexOf(max)] = arr[arr.indexOf(max)] - 1;
  }
  arr.map(item => result += Math.pow(item, 2));
	return result;
}
console.log(noOvertime(4, [3,4,3])) // 12
```

## 다른사람 풀이
```js
function noOvertime(no, works) {
  if (no) {
    works.sort((a, b) => a < b)
    works[0]--
    return noOvertime(no - 1, works)
  } else {
    return works.reduce((acc, n) => acc + n * n, 0)
  }
}

console.log(noOvertime(4, [4, 3, 3]));
```

## 느낀점
reduce를 써서 해결한 사람들이 많았다. reduce를 사용하는 법이 아직 익숙지않아서 그런가 아예 생각도 안났었다...