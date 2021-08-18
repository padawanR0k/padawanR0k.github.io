---
author: [padawanr0k]
title: 코드스피츠89 - Programming 101 1회차
series: "codespitz89"
order: 1
draft: false
date: 2021-03-29
tags: [javascript]
keywords: [코드스피츠, javascript, 프로그래밍 기초]
---

<!-- toc -->

<iframe width="560" height="315" src="https://www.youtube.com/embed/0lAsf19iE2g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

>  변수, 제어문, 함수, 클래스 등 언어의 기초를 이루는 구성과 상세하고 미묘한 사용법을 배웁니다.


### 프로그램이란?

- 실행코드 자체가 프로그램이 아니라. OS가 코드를 실행하면서 CPU와 메모리에 명령과 변수들로 변한 코드들이 적재되어있는 것이 프로그램이다.
- ex) 계산기 프로그램 수식을 입력한 후 처리과정
	1. 사칙연산에 대한 함수가 메모리에 명령으로 적재된다.
	2. 유저가 입력한 숫자값이 메모리에 값으로 잭재된다.
	3. 디코더(제어유닛)가 사칙연산에 대한 명령을 메모리에서 가져온다.
	4. 데이터 유닛이 메모리에 적재된 값을 가져온다.
	5. 연산유닛이 디코더로 부터 사칙연산에 대한 명령가져오고, 데이터유닛으로 부터 값들을 가져와 연산을 한다. 그 결과를 다시 유닛으로 전달하고 유닛은 다시 메모리에 전달하게된다.
- 디코더는 명령문을 패치(해석)해서 CPU로 가져오게된다.
- 이런식으로 코드를 해석해서 메모리와 CPU에 적재하는것을 로딩이라고 부른다.

### 런타임

- 컴파일 언어
	1. Essential Definition Loading
		- 프로그램이 실행하기 위한 정의나 함수를 로딩하는 과정
	2. Vtable Mapping
		- 코드에서 사용되는 변수명이 실제 물리적인 메모리와 매핑되는 과정
	3. Run
		- 실행
	4. Runtime Definition Loading
		- 런타임중 함수나 클래스를 새로 정의하거나 불러오는 것
			- 스크립트 언어들은 모두 가능
			- 자바는 컴파일 언어지만 가능(이 때문에 널리 쓰이게되었다는 썰이 있다.)
- 스크립트 언어 (인터프리터 언어)
	- 실행 과정에서 프로그램이 실행되기 위한 정의나 함수를 로딩함 (반복..)
		- ex) react로 만들어진 사이트는 react 런타임 코드를 불러오기 전까지 react 컴포넌트들을 사용할 수 없다. 여기서 react 코드를 불러오기 전까지가 Static time, 불러온 후를 Run time이라고 부른다.
		- svelte는 react, anguler, vue와 다르게 따로 svelte 런타임을 가지고 있지않고, 빌드하게되면 코드가 js자체의 런타임을 가지고 있다.



### Lexical grammer

컴퓨터 언어의 문법은 다음과 같은 구조로 이루어져있다.
- Control character (제어 문자)
- White space (공백 문자)
	- js는 유니코드에 존재하는 60개의 공백문자중 16개의 공백문자를 정의하고 있다!
- Line terminators (개행 문자)
	- 개행문자도 6가지 이상이 존재한다.
- Comments (주석 문자)
- Keyword (예약어 문자)
- Literals (리터럴 문자)
	- 언어에서 인정하고 있는 더 이상 나눌수 없는 표현
		- 소수점을 가진언어를 표시할 때 `.`을 쓴다.
		- 특정 언어에서는 숫자타입에 따라 숫자 제일 뒤에 `l` 이나 `f`를 붙이기도 한다.
	- 언어가 업데이트될때마다 바뀔수도 있다
		- ex) 최신 js는 `1_0_0`을 `100`으로 인식한다.

### Language element

a언어는 1960년대에 만들어진 언어로 매우 난해하다. b언어는 a언어를 개선하여 bell연구소에서 만든언어이다. 그 b언어를 개선한것이 **c**언어이다. abc언어들은 상호보환적으로 개선되어 왔으며 비슷한 철학을 공유한다.
함수형 언어를 제외하고 대부분의 언어는 abc언어들과 비슷한 구조로 이루어저 있다.

- Statments (문)
	- 컴파일러 or 인터프리터가 해석한 뒤 명령어로 바뀌어 메모리에 적재된다.
- Expressions (표현식)
	- 컴파일러 or 인터프리터가 해석한 뒤 값으로 바뀌어 메모리에 적재된다.
- Identifier (식별자)
	- 컴파일러 or 인터프리터가 값이 특정 메모리주소에 적재된걸 인간이 식별하기 쉽게 별명이 매겨져 있는 것

### Flow control (if, while, for 등)

- Flow
	- 명령이 실행되는 흐름
- 메모리에 적재된 루틴(명령)을 특정 순서로 실행되게끔 제어하는 것
	- 우리는 제어문을 사용하여 명령 실행순서를 제어한다.
- Sub Flow (함수) == Sub Routine
	- 기존 Flow에서 반복될 수 있는 특정 행위를 실행하는 Flow로 이동한 후 행위를 마치고 다시 기존 Flow로 되돌아가는것
	- 서브루틴은 실행이 끝난 후 다시 되돌아 갈 위치를 알고있는 채로 실행이 된다.
- 루틴은 서브루틴을 가질 수 있으며, 서브루틴이 있는 루틴은 서브루틴이 종료될 때까지 스택메모리에서 해제되지않는다. 이때문에 간단한 코드일지라도 많은 서브루틴을 가진 실행은 스택오버플로우가 발생한다.
	```javascript
	const sum = v => v === 1 ? 1 : v + sum(v - 1);
	sum(100000) // Uncaught RangeError: Maximum call stack size exceeded
	```
- 그래서 재귀를 사용하여 간단하게 풀 수 있는 문제여도, for문으로 바꾸라고 조언한다. 코드가 문제가 없어도 코드를 실행시키는 환경이 받쳐주지 못하면 그 코드는 에러를 발생시키기 때문이다.
- 재귀로 해결 -> 꼬리물기 재귀 -> for으로 번역
	- for문으로 작성하면 끝이 있는 루틴임을 알기에 스택메모리 오버플로우가 발생할 일이 없다.

###  ETC

- 프로그래밍은 문제를 해결할 때 문제의 패턴을 인식하는 것부터 시작한다. 패턴을 발견하는 힘은 일반적으로 추론이라고 불린다. 추론이란 법칙을 발견하는 힘이고. 수학으로 따지면 증명을 해내는 과정이라고도 할 수있다.능력과 직결된다. 추론능력을 기르는데 좋은 도구는 수학과 프로그래밍이다. 추론능력은 후천적으로 훈련으로 개발이 가능하다. 그러니 열심히 해라
- 수학과 프로그래밍은 추론능력을 기를떄 사용할수있는 훌륭한 도구다.
- 수학을 잘한다고 프로그래밍을 다 잘하는건 아니다. 프로그래밍을 잘한다고 다 수학을 잘하는건 아니다. 하지만 추론능력이 사람은 수학도 프로그래밍도 잘할수있다.