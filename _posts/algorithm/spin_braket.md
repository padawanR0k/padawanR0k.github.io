---
title: "[프로그래머스 월간 코드챌린지2] - 괄호 회전하기"
date: 2021-04-20
tags: [프로그래머스, 알고리즘]
keywords: [괄호회전하기, 프로그래머스]
---


## 괄호 회전하기
- [문제 링크](https://programmers.co.kr/learn/courses/30/lessons/76502)
- 챌린지 하는 도중에는 어떻게 풀어야할지 감을 못잡았었다... 며칠 후에 문제들이 공개되었을 때, 다시 풀려고 하니까 어떻게 풀어야할지 바로 보이더라...
- 괄호들이 짝을 이루어야하고, 닫는 괄호가 나오는 타이밍도 맞아야한다.

### 문제 풀이
- [JSON.stringify](https://padawanr0k.github.io/code-spitz89_1/)를 구현하는 공부를 하다가 터득한 부분을 그대로 적용했다.
- 여는 괄호를 담는 자료구조를 스택으로 선택했다. 만약 스택이 비었는데 자료구조에서 데이터를 빼려고한다거나, 스택에 데이터가 남아있으면 조건에 만족못하는것으로 판단했다.
- 여는 문자열이 나온 순서대로 닫는 문자열이 나와야하기 때문에, 괄호의 종류마다 차별점을 두어야 했다. 이 부분은 각각 점수를 다르게하여 해결했다.
	- `[{()}]` - O
	- `[{(]})` - X

## 코드
```javascript
// 괄호에 대한 점수
const table = {
	"{": 1,
	"(": 2,
	"[": 3,
	"}": -1,
	")": -2,
	"]": -3,
};

// 유효한 문자열인지 확인한다.
const isValid = (str) => {
	const stack = [];
	// 각 문자열마다 점수를 부여한다.
	str = str.split("");

	let i = 0;
	while (i < str.length) {
		const num = table[str[i]];

		if (num > 0) {
			stack.push(num);
		} else {
			// 더 이상 pop될게 없거나, 스택의 최상단에 위치한 점수(여는 괄호)와 현재 빼야하는 점수(닫는 괄호)의 합이 0이 아니라면 중지한다.
			if (stack.length === 0 || stack[stack.length - 1] + num !== 0) {
				return false;
			}
			stack.pop()
		}
		i++;
	}
	return stack.length === 0;
}

function solution(s) {
	let answer = 0;

	let i = 0;
	while (i < s.length) {
		// 한칸씩 밀어준다.
		const newStr = s.split("").reduce((acc, _, index, arr) => acc + arr[(index + i) % s.length], '')
		if (isValid(newStr)) {
			answer++;
		}
		i++;
	}

	return answer;
}

```