---
title: 알고리즘 문제 풀이 - 가장 긴 팰린드롬
date:  2018-02-27
tags: [algorithm]

---
https://programmers.co.kr/learn/challenge_codes/84

## 문제
앞뒤를 뒤집어도 똑같은 문자열을 palindrome이라고 합니다.
longest_palindrom함수는 문자열 s를 매개변수로 입력받습니다.
s의 부분문자열중 가장 긴 palindrom의 길이를 리턴하는 함수를 완성하세요.
예를들어 s가 토마토맛토마토이면 7을 리턴하고 토마토맛있어이면 3을 리턴하고 s가 zzbaabcd 이면 4를 리턴합니다.

## 풀이

만약 받은 문자열 s가 '토마토'라면
토마토를 i씩 묶어서 비교

i = 2 기본값

1. 토마 = 마토 ?
2. 마토 = 토마 ?

i 증가

i = 3
1. 토마토 = 토마토 ? 찾았으니 s.length 저장


```javascript
function longest_palindrom(s){
  var result = 0;
  // 함수를 완성하세요
	var stringLength = s.length;
  var reversedStr = '';
  var splicedStr = '';
  for ( var i = 2; i <= stringLength; i++) {
    for ( var j = 0; j < stringLength && i + j <= stringLength; j++) {
			splicedStr = s.substr(j,i);
	  	reversedStr = splicedStr.split('').reverse().join('');
      if( splicedStr === reversedStr) result = splicedStr.length > result && splicedStr.length > 1  ?  splicedStr.length   : result
    }
  }
  if(result === 0) result = 1
  return result;
}


// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log( longest_palindrom("토마토맛토마토") ) // 7
console.log( longest_palindrom("토마토맛있어") ) // 3
console.log( longest_palindrom("나에게소주만병만주소") ) // 7
console.log( longest_palindrom("zzbaabcd") ) // 4

```

## 다른사람 풀이
```js
function longest_palindrom(s){
  // 함수를 완성하세요
  if (s === s.split("").reverse().join("")) {
    return s.length;
  } else {
    var A = longest_palindrom(s.substring(0, s.length-1));
    var B = longest_palindrom(s.substring(1, s.length));
    return Math.max(A, B);
  }
}

// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log( longest_palindrom("토마토맛토마토") ) // 7
console.log( longest_palindrom("토마토맛있어") ) // 3
console.log( longest_palindrom("나에게소주만병만주소") ) // 7
console.log( longest_palindrom("zzbaabcd") ) // 4

```

## 느낀점
코드를 짧게 만들때 재귀함수가 짱이구나....
그런데 가독성은 그렇게 좋지않은것 같다.