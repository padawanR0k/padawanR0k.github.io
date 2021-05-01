---
title: 코드스피츠89 - Programming 101 5회차
date: 2021-04-23
tags: [javascript, 기초]
keywords: [코드스피츠, javascript, 프로그래밍 기초]
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/OAxr_xXT3KU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

>  변수, 제어문, 함수, 클래스 등 언어의 기초를 이루는 구성과 상세하고 미묘한 사용법을 배웁니다.

---
## 자바스크립트의 함수와 코루틴

### 함수(루틴)의 특징
- 한번 실행되면 리턴되는 것이 항상 있다. (`undefined` 포함)
- 반복적으로 사용할 수 있다.
- 중간에 멈출수 없다. == 진입과 탈출을 마음대로 할 수 없다.


### 코루틴
- 여러번 진입할 수 있고, 여러번 반환할 수 있다.
	- 특수한 반환을 통해 다음 진입을 지정할 수 있다.
	```javascript
	const gen = function *() {
		// [1] 진입 지점
		let n = 10;
		yield n; // 1 반환  지점
		// [2] 진입 지점
		n = n % 10;
		yield n; // 2 반환 지점
	};
	const result = gen();
	console.log(result.next().value); // [1] 10
	console.log(result.next().value); // [2] 0
	```

- 일반 루틴과 비교
	```javascript
	function nomal() {
		const arr = [];
		for (let i = 0; i < 1000000000; i++) if (i % 1000 === 0) arr.push(i)
		// for문이 끝까지 돌때까지 멈출 수 없다
	}

	function *gen() {
		const arr = [];
		for (let i = 0; i < 1000000000; i++) if (i % 1000 === 0) yield i
		// 한번 yield가 될때마다 중간에 멈출 수 있다. 그 이후에 또 사용이 필요한 경우 다시 진입하는 것도 가능하다.
	}
	```
### 이터레이터
- [이터레이터 프로토콜](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Iteration_protocols)을 구현한 객체
	- 데이터를 순회가능하게 해주는 인터페이스
	- `Array`나 `Map`같은 자료구조는 이터레이터가 기본적으로 내장되어있어 순회가능하다. == (디스트럭쳐링이나 rest파라미터를 사용할 수 있다.)
	- 사용자가 직접 구현하는 것도 가능하다.
		- 생성자함수 `MyClass1`로 만들어진 인스턴스에 spread 연산자를 사용하면 오류가 발생하지 않는다.
			- 이터레이터 프로토콜을 구현했기 때문에!
		- 반대로 `MyClass2`에는 이터레이터 프로토콜을 구현하지 않았기 때문에 오류가 발생한다.
		```javascript
		const MyClass1 = function(){
			this.data = [1,2,3];
			this.current = 0;
			this[Symbol.iterator]=function () {
				const that = this;
				return{
					next: function () {
						if (that.data[that.current]) {
								const value = that.data[that.current];
								that.current++;
								return {value, done: false}
						}  else {
								return {done: true}
						}
					}
				}
			}
		};
		const obj = new MyClass1();
		console.log(...obj) // 1 2 3



		const MyClass2 = function(){
			this.data = [1,2,3];
			this.current = 0;
		};
		const obj2 = new MyClass2();
		console.log(...obj2) /// Uncaught TypeError: Found non-callable @@iterator at....
		```

### [제너레이터](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Generator)
- 자바스크립트에서 코루틴을 구현한 기능, 위에서 보았듯 함수의 진입과 반환을 여러번 할 수 있게 해준다.
- 이터레이터 프로토콜을 준수한다.
- [redux-saga](https://redux-saga.js.org/docs/introduction/BeginnerTutorial/)에서 이 제네레이터 문법을 사용한다고 한다.

<!-- 1:28:33 -->

### 과제 구현 코드
- 코루틴 사용하여 배열 순회횟수 줄이기 [30:00]
```javascript
const arr = [1,2,3,4,5,6,7];
const filter = function *(arr, fns) {
    for (let item of arr) {
        console.count()
        const result = fns.every(fn => fn(item));;
        if (result) yield item
    }
};

const isOdd = n => n % 2 === 1;
const isSmallerThanTen = n => n < 10;

const [...result] = filter(arr, [isOdd, isSmallerThanTen]);
console.log(result)
```
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
