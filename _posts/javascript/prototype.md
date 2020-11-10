---
title: 자바스크립트 protortype 이해하기
date:  2018-02-01
tags: [javascript]

---

# 나의 이해를 위해서
이 글은 본인의 이해를 위해 작성된 글이므로 단어나 설명이 이상할 수 있습니다.

지적은 언제나 환영입니다. :)

# 프로토타입, 천천히 보자
```js
function Person(){} // 1번

var korName = new Person(); // 5번
var usName = new Person();

Person.prototype.setName = function(){
  return "Kim"
};
console.log (korName.setName); // f(){ return 'Kim' }
console.log (usName.setName); // f(){ return 'Kim' }
```


1. 함수를 선언하면 생성자함수가 생기며, 생성된 함수에안에 prototype프로퍼티가 존재하고, 그와 별개로 프로토타입객체가 생긴다.

<img src="https://padawanr0k.github.io/img/prototype01.png" width="500" style="display:block;margin:50px auto;">


2. 프로토타입객체 안에는 constructor속성이 있으며 프로토타입객체가 어떤 객체에서 상속되었는지 가르키고있다.
<img src="https://padawanr0k.github.io/img/prototype03.png" width="300" style="display:block;margin:50px auto;">

3. prototype 프로퍼티는 선언된 함수에 있다.


4. prototype 프로퍼티는 그 함수의 프로토타입객체를 가르킨다.
<img src="https://padawanr0k.github.io/img/prototype02.png" width="300" style="display:block;margin:50px auto;">

<img src="https://padawanr0k.github.io/img/prototype04.png" width="500" style="display:block;margin:50px auto;">

5. 이때 새로운 인스턴스를 생성하면 그 인스턴스에  \__proto__ 속성이 생긴다.

<img src="https://padawanr0k.github.io/img/prototype05.png" width="200" style="display:block;margin:50px auto;">

6. \__proto__ 속성은 생성자 함수를 가르키지 않고 프로토타입객체를 가르킨다. 4번처럼.
<img src="https://padawanr0k.github.io/img/prototype06.png" width="500" style="display:block;margin:50px auto;">

7. 그래서 인스턴스는 생성자 함수와 똑같이 프로토타입객체를 바라 보게된다. (같은 address를 참조하게 된다.)
<img src="https://padawanr0k.github.io/img/prototype07.png" width="250" style="display:block;margin:50px auto;">

8. 그러므로 프로토타입객체의 속성을 변경하면 변경사항이 인스턴스의 속성에도 적용된다. (참조에 의한 호출로 동작한다.)
<img src="https://padawanr0k.github.io/img/prototype08.png" width="400" style="display:block;margin:50px auto;">
```js
Person.prototype.setName = function(){
  return "Kim"
};

console.log (korName.setName); // f(){ return 'Kim' }
console.log (usName.setName); // f(){ return 'Kim' }
```

# 참고
- [프로토타입 이해하기](https://medium.com/@bluesh55/javascript-prototype-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-f8e67c286b67)

- [기발자의 한 놈만 패는 JavaScript 7교시 - 프로토타입 편](https://www.youtube.com/watch?v=zbgKZVMzdfk)