---
title: 알고리즘 문제 풀이 - 괄호 확인하기
date:  2018-02-22
tags: [algorithm]

---

## 문제
is_pair함수는 문자열 s를 매개변수로 입력받습니다.
s에 괄호가 알맞게 짝지어져 있으면 True를 아니면 False를 리턴하는 함수를 완성하세요.
예를들어 s가 (hello)()면 True이고, )(이면 False입니다.
s가 빈 문자열("")인 경우는 없습니다.

## 접근방법
`(` = +1, `)` = -1 로 생각함
`(`없이 `)`가 먼저나오면 음수가 되며 그 경우는 false 처리
문자열을 순회하며 괄호를 찾고, 여는괄호, 닫는괄호에따라 `num`에 1을 더하거나 뺀다.
순회가 끝나면
1. `num`이 0보다큰지확인 == 닫는괄호가 더 많을 경우 음수값이니까
2. `num`을 2로 나누었을때 나머지가 없는지 확인 == 나머지가 있다면 `(`, `)` 짝이 맞지 않는다는것

## 풀이

```javascript
function is_pair(s){
  var result = true;

  var srtLength = s.length;
  var num = 0;
  for ( var i = 0; i < s.length; i++) {
    if (num < 0 ) {
    	result = false;
    }else if (s[i] === '('){
      ++num;
    }else if ( s[i] === ')'){
    	--num;
    }
  }
  if (num < 0 || num % 2 !== 0) result = false;
  return result;
}

// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log( is_pair("(hello)()") )
console.log( is_pair(")(") )
```

## 다른사람 풀이
```js
function is_pair(s){
  var result = true;
  s = s.replace(/[^\(^\)]/g,"");
  while(true){
    if(s.indexOf("()")>-1) s = s.replace(/\(\)/g,"");
    else break;
  }
  if(s.length>0) result=false;
  return result;
}

// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log( is_pair("(hello)()") )
console.log( is_pair(")(") )
```


도대체 정규표현식으로 못하는게 뭐지??