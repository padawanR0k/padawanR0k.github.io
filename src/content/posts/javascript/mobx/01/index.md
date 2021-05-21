---
author: [padawanr0k]
title: mobx 6 정리
date:  2021-01-30
tags: [javascript]
series: "mobx6"
order: 1
keywords: [mobx, react, 리액트]
---
> 리액트에서 사용하는 경우에 초점을 맞춰 작성

# mobx 란?
- 클라이언트 사이드에서 사용하는 상태관리 라이브러리
- state를 컴포넌트와 별개로 관리가능
- redux는 flux아키텍쳐를 리액트에서만 사용할수있게 구현한것이다. mobx는 이와 다르게 UI 프레임워크에 관계없이 모든곳에서 사용가능한 상태관리 라이브러리다.
- 컴포넌트는 다수의 mobx store에 접근가능하며, mobx의 데이터는 구독가능한 observable 형태로 관리된다.
	- 5버전에서는 데코레이터(`@`)문법을 지원했었지만, 최신 문법이 아니였다. 이 때문에 프로젝트에 적용하려면 부가적인 환경설정이 필요했다. (구버전 브라우저 지원)

## MobX core
- 핵심 개념들은 다음과 같다.
	- observable
		- 구독가능한 형태로 상태를 관리할수 있게한다.
	- action
		- 구독가능해진 상태를 수정하는 메서드임을 나타낸다.
	- computed
		- 상태와 캐시로부터 새로운 값을 가지는 게터를 반환한다.
- mobx6 에서는 객체를 구독가능하게 만드는 함수를 제공하는데, 이는 다음과 같다.
	- makeObservable
	- makeAutoObservable
	- observable
- 주로 class 문법과 같이 쓰인다.

### `makeObservable(target, annotations?, options?)`
- target
	- Object 타입을 가진 모든 변수가 올 수 있다. class의 constructor에서 this를 넘겨줌으로써 class를 observable하게 만든다.
- annotations
	- mobx5에서 데코레이터 문법으로 처리했던것을 객체로 표현하여 전달한다.
	- key에는 method명이 value에는 이 method가 어떻게 사용될것인지를 mobx 함수로 전달한다.
- options
	- makeObservable, makeAutoObservable, observable 에서 모두 사용되는 매개변수이다. 디버깅을 더 쉽게하거나 proxy 자동생성을 비활성화하는 등에 사용된다.

#### class에서 사용

```js
import { makeObservable, observable, computed, action } from "mobx"

class Doubler {
    value

    constructor(value) {
				// 클래스 내부에는 value라는 프로퍼티가 있고, 이값을 구독가능하게 만듦

        makeObservable(this, {
            value: observable,

						// double은 값을 변경하진 않는다. 하지만 값에 특정 computing을 하여 새로운 값을 만들어내고 그 값을 변수처럼 사용하게 해준다. -> computed를 매핑해줌
            double: computed,

						// increment 메서드는 value값을 변화 시킨다. -> action 매핑해줌
            increment: action
        })
        this.value = value
    }

    get double() {
        return this.value * 2
    }

    increment() {
        this.value++
    }
}
```


<br/>

#### 중첩된 class에서 둘다 mobx 사용

```js
import { makeObservable, observable, computed, action } from "mobx"

class Parent {
    // not overridable
    observable1 = 0

    constructor(value) {
        makeObservable(this, {
            observable1: observable,
            computed1: computed,
            action1: action,
            arrowAction1: action
        })
    }

    // overridable
    get computed1() {
        return this.observable * 2
    }

    // overridable
    action1() {
        this.observable++
    }

    // not overridable
    arrowAction1 = () => {}

    // workaround - not annotated - overridable
    overridableArrowAction1 = action(() => {})
}


// 부모를 확장했기때문에, 기존 메서드를 상속받는다.
class Child extends Parent {
    // new
    observable2 = 0

    constructor(value) {
        makeObservable(this, {
						// 상속받았지만, 이 자식 클래스에서 새로 선언하고 싶다! -> override 매핑하고, 이 클래스에서 다시 선언
            action1: override,
            computed1: override,
            // new fields
            observable2: observable,
            computed2: computed,
            action2: action,
            arrowAction2: action
        })
    }

    // overrides
    get computed1() {
        return super.computed1 * 2
    }

    // overrides
    action1() {
        super.action1()
    }

    // workaround - not annotated - overrides
    overridableArrowAction1 = action(() => {})

    // new
    get computed2() {
        return super.computed1 * 2
    }

    // new
    action2() {
        super.action1()
    }

    // new
    arrowAction2 = () => {}
}
```


### `makeAutoObservable(target, overrides?, options?)`
- target
	- Object 타입을 가진 모든 변수가 올 수 있다. class의 constructor에서 this를 넘겨줌으로써 class를 observable하게 만든다.
- overrides
	- 자동으로 추론해주는 설정대신 직접 오버라이드를 원할 경우 사용한다.

- makeObservable과 비슷하게 프로퍼티들을 구독가능한 객체로 만든다.
- makeObservable에서 일일이 매핑해줬던 부분을 알아서 추론하여 매핑 해준다.
	- 추론 규칙
		- 멤버 프로퍼티가 포함된 메서드는 모두 autoAction 어노테이션이 달림
		- 모든 getter들은 computed 어노테이션이 달림
		- 모든 다른 프로퍼티에는 observable 어노테이션이 달림
		- (해석불가..)Any (inherited) member that is a generator function will be annotated with flow. (Note that generators functions are not detectable in some transpiler configurations, if flow doesn't work as expected, make sure to specify flow explicitly.)
		- overrides 인자에서 false로 매핑된 변수는 아무 어노테이션이 달리지않음 -> 변경불가 -> readonly 프로퍼티인 경우에 사용할 것
- *makeAutoObservable를 사용한 클래스는 다른 클래스를 상속받거나 자식 클래스를 가질 수 없다.*


#### factory function에서 mobx 사용
- [factory function?](https://ui.toast.com/weekly-pick/ko_20160905)

```js
import { makeAutoObservable } from "mobx"

// 다음과 같이 class문법을 사용하지 않아도 mobx를 사용할 수 있다.
function createDoubler(value) {
    return makeAutoObservable({
        value,
        get double() {
            return this.value * 2
        },
        increment() {
            this.value++
        }
    })
}
```

### `observable(source, overrides?, options?)`

- collection 타입 오브젝트를 구독가능하게 만들어준다.
- 반환되는 객체는 [프록시](https://ko.javascript.info/proxy)된 객체이다. 이는 추가로 들어오는 데이터들도 observable하게 만들어준다. (새로들어온 데이터도 수정하려고하면 mobx가 구현한 observerble proxy를 거친다는 뜻?)
- source
	- 클론될 오브젝트이며, 모든 프로퍼티들은 makeAutoObservable 처럼 자동으로 추론되어 어노테이션된다.
- overrides
	- makeAutoObservable와 동일하다.

#### 일반 객체에서 mobx 사용

```js
import { observable } from "mobx"


// object, array, map, set에서도 사용가능하다. 결국 조상이 object여서 가능한건가?
const todosById = observable({
    "TODO-123": {
        author: [padawanr0k]
title: "find a decent task management system",
        done: false
    }
})

todosById["TODO-456"] = {
    author: [padawanr0k]
title: "close all tickets older than two weeks",
    done: true
}

const tags = observable(["high prio", "medium prio", "low prio"])
tags.push("prio: for fun")
```

<br/>

### Observable을 다시 바닐라 JavaScript 컬렉션으로 변환

- api로 값을 보내거나, js기본 데이터형태가 필요할 때

```js
// 객체면 ...연산자로 복사
const plainObject = { ...observableObject }

// 배열이면 ...slice() 연산자로 복사
const plainArray = observableArray.slice()

// Map이면 새로운 Map을 다시 생성
const plainMap = new Map(observableMap)

// class일 경우는 toJSON() 메서드를 직접 구현하는것이 좋다고한다.
const plainClass = new Example(observableMap.toJSON())
```

## 참고

- [공식문서](https://mobx.js.org/observable-state.html)
- [https://jaeheon.kr/174](https://jaeheon.kr/174)
- [자바스크립트에서 팩토리 함수란 무엇인가?](https://ui.toast.com/weekly-pick/ko_20160905)
- [Proxy와 Reflect](https://ko.javascript.info/proxy)