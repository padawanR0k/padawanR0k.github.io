---
title: python에서 피보나치 수열 알고리즘 문제를 해결하는 방법들
date:  2020-12-17
tags: [python, 피보나치, lru_cache]
keyword: [python, 피보나치, lru_cache]
---

## 피보나치 수열
피보나치 수열은 첫 번째와 두 번째 숫자를 제외한 모든 숫자가 이전 두 숫자를 더한 숫자를 나열한 수열이다.
> 0, 1, 1, 2, 3, 5, 8, 13

동일한 규칙이 반복적으로 진행되는 경우, 재귀함수를 사용해서 해결 할 수 있다.
```python
def fibo(n) -> int:
  if n < 2:
    return n
  return fibo(n-2) + fibo(n-1)
```
하지만 n의 값이 커질수록 함수를 실행시키는 횟수가 기하급수적으로 늘어나기 때문에 좋지않다.

```python
memo2: Dict[int, int] = {0: 0, 1: 1}
def fibo2(n) -> int:
  if n < 2:
    return n
  if n not in memo2:
    memo2[n] = fibo2(n-1) + fibo2(n-2)
  return memo2[n]
```
위의 코드는 메모이제이션을 통해서 함수의 결과값을 `memo2` 딕셔너리에 캐싱하고 있다. 첫 함수보다 호출횟수가 확연히 줄어든다.

```python
from functools import lru_cache

@lru_cache(maxsize=None) # maxsize는 최근 호출함수를 캐싱할 수 있는 크기이다.
def fibo3(n) -> int:
  if n < 2:
    return n
	return fibo3(n-1) + fibo3(n-2)
```
기본 내장 모듈인 functools에서 제공하는 `lru_cache` 데코레이터는 함수의 결과를 자동으로 메모리에 캐싱해준다. 굳이 `memo2` 딕셔너리를 선언할 필요가 없는것이다. 캐싱된 메모리는 `fibo3.cache_clear()`로 언캐싱할 수 있다.

```python
from functools import lru_cache

def fibo4(n) -> int:
	if n == 0 return n
	last: int = 0
	next: int = 1

	for _ in range(1, n):
		last, next = next, last + next
	return next
```
고전 방식으로 푸는방법이다. 튜플언패킹을 사용해서 값을 다음 값을 next에 대입함과 동시에 기존값들도 다시 대입하고있다. (변수를 `swap`했다.)

<iframe height="400px" width="100%" src="https://repl.it/@padawanR0k/fibo?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## ref
- 고전 컴퓨터 알고리즘 인 파이썬
- [function caching](https://ddanggle.gitbooks.io/interpy-kr/content/ch23-Function-caching.html)

