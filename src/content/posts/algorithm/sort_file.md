---
author: [padawanr0k]
title: 알고리즘 문제 풀이 - 파일명 정렬
date:  2021-04-23
tags: [algorithm]
keywords: [메뉴 리뉴얼, 프로그래머스]
---

## 파일명 정렬
- [문제 링크](https://programmers.co.kr/learn/courses/30/lessons/17686)

### 문제 풀이
- 각 파일명이 문자열로 주어지며, 주어진 조건으로 파일명을 정렬하는 문제이다.
- 풀이 순서는 다음과 같다.
	1. Array.sort함수에 조건을 만족하는 익명함수(`customSort(a, b)`)를 전달하여 해결
	2. 주어진 조건에 대해 비교하기 위해 정규표현식을 사용해 HEAD, NUMBER로 구분한다 (TAIL은 정렬에 쓰이지 않음)
	3. HEAD에는 알파벳, `-`, ` `이 포함될 수 있다.


## 코드
```javascript
const splitFileName = (filename) => {
    const [front, ext] = filename.split(".");
    const number = Number(front.match(/[0-9]{1,}/)[0]);
    const head = front.match(/[a-zA-z\s\-]{1,}/)[0].toLowerCase();
    return {number, head};
};

const customSort = (a, b) => {
    const a_info = splitFileName(a);
    const b_info = splitFileName(b);

    if (a_info.head === b_info.head) {
        if (a_info.number === b_info.number) {
            return 0;
        } else {
            return a_info.number - b_info.number;
        }
    } else {
        return a_info.head > b_info.head ? 1 : -1
    }
};

function solution(files) {
    var answer = files.sort(customSort);
    return answer;
}
```
