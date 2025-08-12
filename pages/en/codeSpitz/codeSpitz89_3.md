# [EN Translation Placeholder] ## 각 제어문은 어떤 상황에 사용되어야 하는가?

---
author: [padawanr0k]
title: 코드스피츠89 - Programming 101 3회차
series: "codespitz89"
order: 3
draft: false
date: 2021-04-13
tags: [javascript]
keywords: [코드스피츠, javascript, 프로그래밍 기초]

---

<!-- toc -->

<iframe width="560" height="315" src="https://www.youtube.com/embed/v5Dl1C-5uRY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

>  변수, 제어문, 함수, 클래스 등 언어의 기초를 이루는 구성과 상세하고 미묘한 사용법을 배웁니다.

---

### 각 제어문은 어떤 상황에 사용되어야 하는가?
- `if`
	- optional
		- 선택사항으로 특정 코드를 실행시킬 때
	- shield
		- 특정 조건을 만족하게되어 이후 코드를 실행시키는걸 막을 때
- `if else`
	- binary mandatory (2가지 병렬조건인 경우)
- `switch`
	- multiple mandatory (3가지 이상 병렬조건인 경우)
	- mandatory이기 때문에 default case를 항상 써라
- `while`
	- 사전에 횟수가 계획되지 않은 반복에 사용해라 (재귀)
	- 매번 코드조각을 반복할때마다 다음 반복을 진행할지 결정한다.
- `for`
	- 사전에 횟수가 계힉된 반복에 사용해라 (순회)

### 좋은 코드를 위한 규칙 - OCP
> [SOLID 원칙](https://sjh836.tistory.com/159) 중 OCP(개방 폐쇄 원칙)
- 수정에는 닫혀있고, 확장에는 열려있다.
	- 첫 작성시에는 무조건 2가지의 경우만 존재한다고 생각해서 `if else`로 작성한 경우, 새로운 문제로 인해 3가지로 확장하려고할 때 기존 코드를 수정해야한다. == `if else`를 사용하는 경우는 정말 두가지 밖에 상황이 안나오는지 생각을 많이해보고 사용해라
	- 해당 동영상에서는 OCP원칙을 지키는 예시를 보여준다.
		- [`53:30`] switch문을 제거하면서 OCP를 원칙을 지키는 방법을 보여준다. 기존 코드(`stringify()`)를 수정할 필요없이 객체내부에 확장시 필요한 메서드(`symbol()`)를 추가하여 해결한다.
		- [`56:50`] `stringCheck`객체에서 정규표현식쌍을 분리함으로써 얻는 OCP
	- 대부분의 `if else`문은 `라우팅`으로 없엘수 있다. [`1:04:30`]
		- [(라우터(Router)에 대해)](https://www.bsidesoft.com/123)
		- 라우팅
			- 특정 경로를 선택하기위한 과정. 즉 선택이 일어나는 일련의 처리과정
			- 상태값마다 `if else`문으로 분기하는 부분을 라우팅 테이블로 대체할 수 있다.
			- 반복되는 제어를 없에기 위해 라우팅 함수는 제어를 갖게된다. 이후 코드에서는 제어를 사용하지 않고 제어가 필요한 경우 라우팅 함수를 사용하게된다.
				- 제어의 역전(Invasion of Control)
					- `if`는 도메인관련 코드에만 적절하게 등장해야한다.
						- ex) 보험사에서 40대 흡연가에 대한 보험료를 정할 때
		- 라우팅 테이블
			- 테이블 안에 각 규칙을 포함하고, 각 분기처리에 맞는 함수을 넘겨주는 구조
		- 역할모델 (어떻게 코드의 역할을 나눌것인가?)
			- 변화율을 생각해라. 코드가 바뀌게 된다면 그 이유를 생각해서 이유가 동일한 것들끼리 묶어라
				- [`1:27:30`] 코드가 바뀌는 이유를 js의 자료형 갯수와 js 스펙에 따라 나눔
		- 라우팅 테이블은 라우터가 변경될 때 반드시 검토해야한다 == 트랜잭션
	- 커맨트 패턴과 유사하다.
		- 제어문 -> 식(커맨드 객체)

### ETC

- 코드를 작성할 때, 설계 또는 디자인패턴 이란?
	- 유지보수, 기능 추가 등에 유리하도록 코드를 재배치하는 것
- 어려운 문제를 해결하는 방법 (2:05:00)
	0. 한번에 해결하려는 방법(전지적 알고리즘)을 생각하지말고, 이전 결과를 이용해서  어떻게 현재 값이 나왔는지를 파악하라(귀납적)
	1. 문제에서 반복적으로 나타나는 문제에 대해 패턴을 파악해라
		- 추론 능력을 기를수록 빨리 파악할 수 있다.
		- 현상을 보고 연혁적으로 일반화된 원리를 찾아라. (연혁적 사고능력 == 추론능력 == 패턴발견능력 == 아이큐와 직결)
	2. 그 문제에 대해 먼저 재귀함수로 해결해보자
	3. 재귀함수를 `while`문으로 변경해라


### 과제 구현 코드
- [diff 보기](https://gist.github.com/padawanR0k/1a24d1bdbd2cc62edf53ae7d0d44397b/revisions#diff-cbe5407e96f12351ec3107f8b59c678b5f134ebd63dfdebd93f92300a4d56674)
- 중첩된 배열을 파싱하기 위해 배열을 문자열로 바꾸는 부분을 재귀함수로 만저 만든 뒤, while문을 사용한 코드로 바꾸었다.
	- ex) `[1, 2, ["a", [1, 2], false], 3, ["b", "c", [1, 2]]]`

```javascript
// JSON.stringify를 구현하시오
// https://www.youtube.com/watch?v=rQOpmgo99BQ

/**
 * 자료
 * https://reference.codeproject.com/Book/javascript/reference/global_objects/json/stringify
 * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 */

const parsingRouter = {
	'string': (v) => `"${v.toString()}"`,
	'number': (v) => v.toString(),
	'null': () => 'null',
	'undefined': (_, valueOwnerConstructor) => valueOwnerConstructor === Array ? 'null' : undefined,
	'function': (_) => 'null',
	'symbol': (_, valueOwnerConstructor) => valueOwnerConstructor === Array ? 'null' : undefined,
	'boolean': (v) => v.toString(),
	'array': (arr, valueOwnerConstructor) => {
		const accumulator = [];
		const func = (item, valueOwnerConstructor) => {
			const arr = [];
			const v = myJSON.valueToString(item, valueOwnerConstructor);
			if (v) {
				arr.push(`${v}`);
			}
			return arr;
		}

		for (let item of arr) {
			let node = item;
			if (myJSON.getType(node) === 'array') {
				let i = 0;
				while (i < node.length) {
					accumulator.push(func(node, node.constructor));
					node = node[i];
					i++;
				}
			} else {
				accumulator.push(func(item, valueOwnerConstructor))
			}
		}

		return myJSON.wrapStr('[', ']', accumulator);
	},
	'object': (obj, valueOwnerConstructor) => {
		const accumulator = [];
		for (let key in obj) {
			const v = myJSON.valueToString(obj[key], valueOwnerConstructor);
			if (v) {
				accumulator.push(`"${key}":${v}`);
			}
		}
		return myJSON.wrapStr('{', '}', accumulator);
	},
};

const valueRouter = {
	'null': () => 'null',
	'undefined': () => undefined,
	'object': (v, valueOwnerConstructor) => myJSON.valueToString(v, valueOwnerConstructor),
	'array': (v, valueOwnerConstructor) => myJSON.valueToString(v, valueOwnerConstructor),
	'boolean': (v) => myJSON.valueToString(v, null),
	'symbol': (v) => myJSON.valueToString(v, null),
	'function': (v) => myJSON.valueToString(v, null),
	'number': (v) => myJSON.valueToString(v, null),
	'string': (v) => myJSON.valueToString(v, null),
}

class myJSON {
	constructor() {

	}

	static getType(value) {
		if (value === null) {
			return ('null');
		} else if (value === undefined) {
			return ('undefined');
		} else {
			let type = typeof value;

			return (type === 'object'
				? Array.isArray(value)
					? 'array'
					: 'object'
				: type);
		}
	}

	static valueToString(value, valueOwnerConstructor) {
		const valueType = myJSON.getType(value);
		let str = parsingRouter[valueType](value, valueOwnerConstructor);

		return str;
	}
	static wrapStr(start, end, str) {
		return `${start}${str.join(',')}${end}`;
	}

	static stringify(value) {
		const valueType = myJSON.getType(value);
		return valueRouter[valueType](value, value ? value.constructor : null);
	}
}

const test01 = {
	str: 'a',
	num: 1,
	'undefined': undefined,
	'null': null,
	symbol: Symbol('test'),
	boolean: true,
}

const tests = [];
tests.push({})
tests.push(1)
tests.push(null)
tests.push('foo')
tests.push([1, '1', true, null, undefined, Symbol(''), () => ''])
tests.push([])
tests.push([1, 2, ["a", [1, 2], false], 3, ["b", "c", [1, 2]]])

function testMyJSON(v) {
	try {
		console.log(`==== real value ====`);
		console.log(v)
		console.log(`==== myJSON() ====`)
		console.log(myJSON.stringify(v))
		console.log(`==== JSON() ====`)
		console.log(JSON.stringify(v))
		console.log("\n\n")
	} catch (e) {
		console.error(e)
	}

}

tests.map(test => testMyJSON(test))
```
