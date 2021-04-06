---
title: mobx 6 - react 정리
date:  2021-01-30
tags: [javascript, mobx]
keywords: [mobx, react, 리액트]
---
> 리액트에서 사용하는 경우에 초점을 맞춰 작성

# react에서 mobx 사용
- `yarn add mobx  mobx-react`

## 개념
- `action` 데코레이터는 observerble한 변수를 변화시키는 함수에 어노테이션할 때 사용한다. 만약 1개에 함수에서 3개의 observable한 변수를 수정하는 경우, `action`어노테이션 유무에 따라 1번 렌더링이 되거나 3번렌더링이 된다. 이를 mobx에서는 트랜잭션 개념이라고한다.
- `computed` 데코레이터는 getter에 사용하는 어노테이션이다. getter에서 발생하는 계산에 대한 동일한 입력에 대한 결과값을 캐싱하고 여러번 호출하지 않게 도와준다.
    - `Box`라는 클래스가 존재하고, 내부에 너비를 구하는 getter가 있다고 생각해보자.
    ```js
    class Box {
        x;
        y;
        constructor(x,y) {
            makeAutoObservable(this)
            this.x = x;
            this.y = y;

        }

        // makeAutoObservable가 암묵적으로 computed를 어노테이션 해줌
        get area(){
            return this.x * this.y;
        }
    }

    ...

    const myBox = new Box(5, 10);
    console.log(myBox.area); // 50
    console.log(myBox.area); // 50
    console.log(myBox.area); // 50
    ```
    - 이때, `computed` 어노테이션이 처음에 계산한 값을 캐싱하여 나머지 2번에 호출에 대해서는 계산이 발생하지 않는다.
## 참고

- [공식문서](https://mobx.js.org/observable-state.html)
- [https://jaeheon.kr/174](https://jaeheon.kr/174)
- [자바스크립트에서 팩토리 함수란 무엇인가?](https://ui.toast.com/weekly-pick/ko_20160905)
- [Proxy와 Reflect](https://ko.javascript.info/proxy)