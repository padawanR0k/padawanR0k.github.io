---
author: [padawanr0k]
title: 알고리즘 문제 풀이 - 다음 큰  숫자
date:  2018-03-07
tags: [algorithm]

---
https://programmers.co.kr/learn/challenge_codes/174

## 문제
어떤 수 N(1≤N≤1,000,000) 이 주어졌을 때, N의 다음 큰 숫자는 다음과 같습니다.

N의 다음 큰 숫자는 N을 2진수로 바꾸었을 때의 1의 개수와 같은 개수로 이루어진 수입니다.
1번째 조건을 만족하는 숫자들 중 N보다 큰 수 중에서 가장 작은 숫자를 찾아야 합니다.
예를 들어, 78을 2진수로 바꾸면 1001110 이며, 78의 다음 큰 숫자는 83으로 2진수는 1010011 입니다.
N이 주어질 때, N의 다음 큰 숫자를 찾는 nextBigNumber 함수를 완성하세요.

## 풀이

```javascript
function caesar(s, n) {
  var result = "";
  // 함수를 완성하세요.
  let splited = s.split('');
  n =  n % 26;
  //96: `, 95: _, 94: ^, 93: ], 92: \, 91: [
  splited = splited.map((item) => {
    if (item.charCodeAt(0) === 32) return ' '
    if (item.charCodeAt(0) > 96){
      if(item.charCodeAt(0) + n > 122) {
        return String.fromCharCode((item.charCodeAt(0) - 26 + n ));
      } else {
        return String.fromCharCode((item.charCodeAt(0) + n));
      }
    } else {
      if (item.charCodeAt(0) + n >= 91 ){
        return String.fromCharCode(item.charCodeAt(0) - 26 + n);
      } else {
        return String.fromCharCode(item.charCodeAt(0) + n);
      }
    }
  });
  result = splited.join('');
  return result;
}
```

## 다른사람 풀이

```js
function caesar(s, n) {
    var result = "";
    // 함수를 완성하세요.
  var car = ""

  for (var i=0; i<s.length;i++)
  {
    if ( s[i] == ' ' )
      result += ' '
    else
        result += String.fromCharCode( (s.charCodeAt(i)>90)?
      (s.charCodeAt(i)+n-97)%26+97 : (s.charCodeAt(i)+n-65)%26+65 )
  }

    return result;
}

```

## 느낀점
같은 방식으로 푼건데 되게 깔끔하다...