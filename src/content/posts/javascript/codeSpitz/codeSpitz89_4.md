---
author: [padawanr0k]
title: 코드스피츠89 - Programming 101 4회차
series: "codespitz89"
order: 4
draft: true
date: 2021-04-21
tags: [javascript]
keywords: [코드스피츠, javascript, 프로그래밍 기초]
---

<!-- toc -->

<iframe width="560" height="315" src="https://www.youtube.com/embed/A2aOqhZKZHU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

>  변수, 제어문, 함수, 클래스 등 언어의 기초를 이루는 구성과 상세하고 미묘한 사용법을 배웁니다.

---

### 알고리즘과 순수 데이터를 분리해라
- 내가 갖고 있는 데이터의 구조가 로직을 너무 많이 가지고 있으면 코드를  분리해라.
- 순수하게 데이터만 다루는 알고리즘과 부가적인 일을 하는 알고리즘을 나누어라
	- N차원 배열을 스택 형태로 저장하는 알고리즘
	- 배열의 원소들을 문자열로 변환하는 알고리즘

### 변수의 라이프 사이클은 코드의 형태와 일치하는 것은 아니다
- 매개변수로 객체를 전달하는 경우 해당 객체는 함수내부에서 참조하여 변경할 수 있게 된다.
- 함수내부에서 객체를 변경할 수 있다보니, 처음에 설계했던것고 다르게 객체를 조작하게 될 수도 있다.
- 원하는 의도에 맞게 매개변수를 설정해야한다. -> 함수를 재귀적으로 호출할 때 매번 얕은복사를 해서 전달할것이냐, 아니면 같은 객체를 전달할것이냐?

### if else의 일반화
- if else 제어문 내부에는 같은 제어레벨을 가진 코드를 작성해야하고, 그게 가능해지면 일반화된 라우팅 테이블을 작성할 수 있게된다. [`56:30`]
- 원래 분기해야할 경우의 수만큼 전략객체를 만들고, 기준 상태를 판정하여 적합한 전략객체를 매핑하는 매퍼 == 라우터

### 과제 구현 코드
- [diff 보기](https://gist.github.com/padawanR0k/1a24d1bdbd2cc62edf53ae7d0d44397b/revisions#diff-cbe5407e96f12351ec3107f8b59c678b5f134ebd63dfdebd93f92300a4d56674)
- 중첩된 배열과 객체를 파싱하는 부분을 수정했다. 하지만 여기서 권장하는 재귀->while변환하는 부분을 구현하지 못했다...

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
		// 재귀를 while문으로 변경해야함..
		let _str = "";
		let acc = "";
		if (arr.length) {
			for (let item of arr) {
				const parsed = myJSON.valueToString(item, valueOwnerConstructor);
				_str += "," + parsed;
			}
			acc = _str.substr(1);
		}
		return `[${acc}]`
	},
	'object': (obj, valueOwnerConstructor) => {
		let _str = "";
		let acc = "";
		if (Object.keys(obj).length) {
			for (let item in obj) {
				const parsedValue = myJSON.valueToString(obj[item], valueOwnerConstructor);
				const parsedKey = myJSON.valueToString(item, valueOwnerConstructor);
				_str += "," + `${parsedKey}:${parsedValue}`;
			}
			acc = _str.substr(1);
		}
		return `{${acc}}`
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
			let jsType = typeof value;
			return (jsType === 'object'
				? Array.isArray(value)
					? 'array'
					: 'object'
				: jsType);
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
tests.push([1, 2, [], 3, ["b", "c", [1, 2]]])
tests.push({a: 1, b:2, c:[], d:3, e:{b: "b", c:"c", d:[1, 2]}, f: {}})
tests.push([[[]]])
tests.push({a:{b:{c:{}}}})
// tests.push([{}])
// tests.push({a: {}})

function testMyJSON(v) {
	try {
		console.log(`==== real value ====`);
		console.log(v)
		console.log(`==== myJSON() ====`)
		console.log(myJSON.stringify(v))
		console.log(`==== JSON() ====`)
		console.log(JSON.stringify(v))
		console.log(`==== RESULT ====`)
		console.log(myJSON.stringify(v) === JSON.stringify(v))
		console.log("\n")
	} catch (e) {
		console.error(e)
	}

}

tests.map(test => testMyJSON(test))

```
