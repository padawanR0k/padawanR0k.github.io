---
title: 알고리즘 문제 풀이 - 메뉴 리뉴얼
date:  2021-04-22
tags: [알고리즘 문제 풀이]
keywords: [메뉴 리뉴얼, 프로그래머스, "2021 KAKAO BLIND RECRUITMENT"]
---

## 메뉴 리뉴얼
- [문제 링크](https://programmers.co.kr/learn/courses/30/lessons/72411)

### 문제 풀이
- 문자열이 주어지며, 그 문자열들로 만들수있는 조합에 대해 가장 많이 등장한 문자조합을 찾아내는 문제이다.
- 문제설명 해석하는게 어려워서 처음에 좀 애를 먹었다...
- 풀이 순서는 다음과 같다.
	1. 각 주문에 대해 가능한 모든 조합 만들기
	2. 모든 조합에 대해 1번 등장한 주문은 삭제하기
	3. 새로 만드려는 코스의 길이와 똑같은 길이를 가진 조합들을 찾기
	4. 그중 최대값을 가진 모든 조합들을 가져오기
	5. 알파벳순으로 정렬


## 코드
```javascript
const recursive = (origin, str, comb, size, course) => {
	if (str.length > origin.length) {
		return false;
	}
	if (str.length > 1) {
		comb.add(str);
	}

	let i = 0;
	while (i < origin.length) {
		if (str.indexOf(origin[i]) === -1 && i > origin.indexOf(str.substr(-1))) {
			const newStr = str + origin[i];
			recursive(origin, newStr, comb, size + 1, course);
		}
		i++;
	}
}

const make_comb = (origin, course) => {
	const comb = new Set();
	recursive(origin, "", comb, 2, course)
	return comb;
}

const getCnts = (orders, course) => {
	const ctns = orders.reduce((acc, curr) => {
		const comb = make_comb(curr, course);
		comb.forEach(key => {
			acc[key] = (acc[key] || 0) + 1;
		});
		return acc;
	}, {});

	return ctns;
}

const removeOrders = (cnts, minCnt) => {
	Object.keys(cnts).map(key => {
		if (cnts[key] < minCnt) {
			delete cnts[key];
		}
	});
}

const getBestOrders = (course, orderCnts) => {
	const bests = course.map(size => {
		let arr = [];
		Object.keys(orderCnts).filter(key => key.length === size).map(key => {
			const cnt = orderCnts[key];
			if (arr[cnt]) {
				arr[cnt].push([key, cnt])
			} else {
				arr[cnt] = [[key, cnt]];
			}
		});
		if (arr.length) {
			return arr[arr.length - 1].map(item => item[0]);
		}
	});

	return bests;
}

function solution(orders, course) {
	var answer = [];
	orders = orders.map(str => str.split("").sort())
	const orderCnts = getCnts(orders, course);
	removeOrders(orderCnts, 2);
	const bests = getBestOrders(course, orderCnts);

	answer = bests.flat().sort().filter(item => item)
	return answer;
}
```