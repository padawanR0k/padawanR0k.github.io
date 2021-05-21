---
author: [padawanr0k]
title: 코드스피츠89 - Programming 101 2회차
series: "codespitz89"
order: 2
draft: true
date: 2021-04-06
tags: [javascript]
keywords: [코드스피츠, javascript, 프로그래밍 기초]

---

<!-- toc -->

<iframe width="560" height="315" src="https://www.youtube.com/embed/rQOpmgo99BQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

>  변수, 제어문, 함수, 클래스 등 언어의 기초를 이루는 구성과 상세하고 미묘한 사용법을 배웁니다.

---


### 오류와 실패의 관계
함수 내부의 오류는 내부에서 처리하지 말고, 외부에서 처리할 수 있게 throw문을 사용해서 외부에 오류를 전가하자
```javascript
const sum = (arr) => {
	let total = 0;
	for (let i = 0; i < arr.length; i++) {
		if (typeof arr[i] !== 'number') {
			throw `invalid element ${i}: ${arr[i]}`;
		}
		total += arr[i];
	}
	...
}

try {
	sum([1,2,null])
} catch (e) {
	console.error(e);
}
```
- 안정성도 중요하지만 신뢰성이 더 중요하다! 오류가 발생했을 때 최대한 빨리 실행의 실패로 이어지가 짜라. 특정 오류때문에 프로그램이 아예 멈추거나 하면 그 오류를 찾고, 수정하는게 더 쉽다. 만약 잘못된 처리가 이뤄졌는데 정상적으로 작동하게되면 찾기도 더 힘들고 발견하는데 시간이 오래걸린다. (컨텍스트 에러가 더 위험하다)
	- ex) 월급 지급 프로그램
		- 특정 직원에게 잘못된 금액이 지급되는것 보다 아예 오류를 발생시켜 지급자체가 안되게끔하는게 더 낫다.
	- 신뢰성
		- 코드의 실행결과가 실제 예측한대로 잘 작동하는 것
	- 안정성
		- 코드가 멈추지 않고 작동하게끔하는 것
- 유지보수시에는 코드를 수정하는 이유를 충분히 고민하고 수정해라.
- 역할에 따라 코드를 나누고 코드들을 합리적인 구조로 변경하면서 중복을 제거하자.
- 자바스크립트에서는 함수의 인터페이스(매개변수의 모양과 타입)가 일치하면 그 함수들을 하나의 함수로 정리할수도 있다. (해당 동영상에서는 배열의 총 합을 구하는 함수를 수정해가면서 예를 들고 있다. 한곳에 뭉쳐져있던 코드를 설명을 해주며 분리해간다.)
- 데이터와 데이터를 이용한 알고리즘이 이원화 되면 관리가 어려워진다 -> 데이터를 소유한 객체쪽에서 데이터를 활용하는 알고리즘을 제공해라

### 메모리와 연산의 관계
- 메모리(변수)를 많이 쓰면 연산을 덜 할 수 있다.
	- ex) 피보나치 함수 구현시 메모이제이션을 하는 경우, fibo(N) 의 결과를 얻기 위해 N이전까지의 결과를 메모리에 저장하면 연산을 덜 할수있자.
- 라이프사이클과 스코프를 잘 이해하고 코드를 짜면 메모리를 덜 쓰게하거나 연산을 덜하게 하는 방법을 선택할 수 있다.

```javascript
// elementSum이 arraySum이 실행할때마다 생겼다가 사라짐 -> 메모리를 덜 점유함
const arraySum = arr => {
	const elementSum = (arr, i, acc) => {
		if (arr.length === i) return acc;
		return elementSum(arr, acc + arr[i], i + 1);
	};
	return elementSum(arr, 0, 0);
}

// arraySum이 실행시 클로져로 저장되어 생겼다가 사라지지 않음 -> 메모리를 더 점유하지만 함수가 여러번 생성되지않음
const arraySum = arr => {
	const elementSum = (arr, i, acc) => {
		if (arr.length === i) return acc;
		return elementSum(arr, acc + arr[i], i + 1);
	};
	const arraySum = (arr) => elementSum(arr, 0, 0)
	return arraySum;
}
```

### 재귀함수를 for문으로
```javascript
const err = msg => {throw msg};
const _tailRecursiveSum = (array, i, acc) => i > 0 ? _tailRecursiveSum(array, i - 1, array[i] + acc) : (array[0] ?? err("invalid element index 0")) + acc;
const tailRecursiveSum = (array) => _tailRecursiveSum(array, array.length - 1, 0);
```

```javascript
const iterateSum = (array) => {
	let acc = 0;
	for (let i = array.length - 1; i > 0; i = i - 1) {
		acc = array[i] + acc; // 재귀함수에서는 함수를 호출하면서 매개변수에 값을 하나씩 추가했지만, for문을 활용함 함수는 1번만 실행되기때문에 훨씬 빠르다.
	}

	acc += (array[0] ?? err("invalid element index 0")) + acc;
	return acc;
};
```

### 과제 구현 코드

```javascript
// JSON.stringify를 구현하시오
// https://www.youtube.com/watch?v=rQOpmgo99BQ

/**
 * 자료
 * https://reference.codeproject.com/Book/javascript/reference/global_objects/json/stringify
 * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 */
class myJSON {
  constructor() {

  }

  static get_type(data) {
    if (data === null) {
      return ('null');
    } else if (data === undefined) {
      return ('undefined');
    } else {
      return (typeof data);
    }
  }

  static valueToString(value, valueOwnerConstructor) {
    let str = '';
    switch(myJSON.get_type(value)) {
      case 'string':
        str = `"${value.toString()}"`;
        break;
      case 'number':
        str = value.toString();
        break;
      case 'null':
        str = 'null';
        break;
      case 'undefined':
        str = valueOwnerConstructor === Array ? 'null' : undefined;
        break;
      case 'function':
        str = 'null';
        break;
      case 'symbol':
        str = valueOwnerConstructor === Array ? 'null' : undefined;
        break;
      case 'boolean':
        str = value.toString();
        break;
    }
    return str;
  }
  static wrapStr(start, end, str) {
    return `${start}${str.join(',')}${end}`;
  }

  static stringify(value) {
    let str = '';
    const valueType = myJSON.get_type(value);


    if (valueType === 'null') {
      str = 'null';
    } else if (valueType === 'undefined') {
      str = undefined;
    } else if (value.constructor === Object) {
      const strs = [];
      for (let key in value) {
        const v = myJSON.valueToString(value[key], value.constructor);
        if (v) strs.push(`"${key}":${v}`);
      }
      str = myJSON.wrapStr('{', '}', strs);
    } else if (value.constructor === Array) {
      const strs = [];
      for (let item of value) {
        const v = myJSON.valueToString(item, value.constructor);
        if (v) strs.push(`${v}`);
      }
      str = myJSON.wrapStr('[', ']', strs);
    } else {
      str += myJSON.valueToString(value, null);
    }

    return str;
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

const test02 = {};
const test07 = [];
const test03 = 1;
const test04 = null;
const test05 = 'foo';
const test06 = [1, '1', true, null, undefined, Symbol(''), () => ''];
const tests = [test01, test02, test07, test03,test04,test05, test06];

function testMyJSON(v) {
  try {
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