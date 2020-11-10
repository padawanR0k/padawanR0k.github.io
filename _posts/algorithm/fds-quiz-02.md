---
title: 알고리즘 문제 풀이 (1)
date:  2018-02-06
tags: [알고리즘 문제 풀이]

---




# 문제 1
이상한 문자만들기
toWeirdCase함수는 문자열 s를 매개변수로 입력받는다. 문자열 s에 각 단어의 짝수번째 인덱스 문자는 대문자로, 홀수번째 인덱스 문자는 소문자로 바꾼 문자열을 리턴하도록 함수를 완성하라.
> 주의) 문자열 전체의 짝/홀수 인덱스가 아니라 단어(공백을 기준)별로 짝/홀수 인덱스를 판단한다.

## 풀이

```javascript
function toWeirdCase(s) {
  var splited =  s.split(' ');
  var result = '';

  for (var i = 0; i < splited.length; i++) {

    for(var j = 0; j < splited[i].length; j++) {
      if ( (j+1)%2 == 0) {
      result +=  splited[i][j].toUpperCase();
      }else{
      result +=  splited[i][j].toLowerCase();
      }
    }
    if (i+1 !== splited.length) result += ' ';
  }
  return result;
}

console.log(toWeirdCase('hello world'));    // 'HeLlO WoRlD'
console.log(toWeirdCase('my name is lee')); // 'My NaMe Is LeE'
```

---

# 문제 2
1 ~ 10,000의 숫자 중 8이 등장하는 횟수 구하기 (Google)
1부터 10,000까지 8이라는 숫자가 총 몇번 나오는가? 이를 구하는 함수를 완성하라.
단, 8이 포함되어 있는 숫자의 갯수를 카운팅 하는 것이 아니라 8이라는 숫자를 모두 카운팅 해야 한다. 예를들어 8808은 3, 8888은 4로 카운팅 해야 한다.
(hint) 문자열 중 n번째에 있는 문자 : str.charAt(n) or str[n]




## 풀이

```javascript
function getCount8() {
 var all = '';
 var count = 0;
 for(var i = 1; i<10001; i++){
   all += i;
 }
 for (var j = 0; j < all.length; j++){
   if (all.charAt(j) === '8') count++;
 }
 return count;
}

console.log('1번 문제')
console.log(getCount8()); // 4000
```

---

# 문제 3

evenOrOdd 함수는 정수 num을 매개변수로 받는다. num은 1이상의 정수이며, num이 음수인 경우는 없다. num이 짝수일 경우 ‘Even’을 반환하고 홀수인 경우 ‘Odd’를 반환하도록 evenOrOdd에 코드를 작성하라.
단, if문을 사용한 답과 3항 연산자를 사용하는 답 두가지를 제시하여야 한다.



## 풀이


```javascript

function evenOrOdd(num) {
return num % 2 === 0 ?  'Even' : 'Odd' ;
}

console.log(evenOrOdd(2)); // Even
console.log(evenOrOdd(3)); // Odd
console.log(evenOrOdd(1000)); // Even

```

---

# 문제 4
alphaString46 함수는 문자열 s를 매개변수로 입력받는다. s의 길이가 4 ~ 6이고, 숫자로만 구성되어 있는지 확인하는 함수를 완성하라. 예를들어 s가 ‘a234’이면 false를 리턴하고 ‘1234’라면 true를 리턴한다



## 풀이

```javascript
function alphaString46(s) {
 if (s === undefined) return false;
 if( s.length >= 4 && s.length <= 6 ) {
   if( isNaN(s) === true) {
     return false;
   }else{
     return true;
   }
 }else{
   return false;
 }
}
console.log("\n3번문제");
console.log(alphaString46('1234'));
console.log(alphaString46('9014'));
console.log(alphaString46('723'));
console.log(alphaString46('a234'));
console.log(alphaString46(''));
console.log(alphaString46());
```



---

# 문제 5
numPY함수는 대문자와 소문자가 섞여있는 문자열 s를 매개변수로 입력받는다.
대소문자를 구별하지 않으며 s에 ‘p’의 개수와 ‘y’의 갯수를 비교해 같으면 true,
다르면 false를 리턴하도록 함수를 완성하라. ‘p’, ‘y’ 모두 하나도 없는 경우는 항상 true를 리턴한다.
예를들어 s가 ‘pPoooyY’면 true를 리턴하고 ‘Pyy’라면 false를 리턴한다.


## 풀이

```javascript
function numPY(s) {
 // 인수값이 없으면 true를 반환한다.
 if (s === undefined) return true;
 // 하나도없으면 true 리턴한다.
 // p,y를 대소문자 상관없이 찾아낸다.
 var findP = /p/ig;
 var findY = /y/ig;
 // 배열화한다.
 var P = (s.match(findP) || []).length;
 var Y = (s.match(findY) || []).length;
 return  P === Y ? true : false ;
 // return P.length === Y.length ? true : false ;

}
console.log('\n4번문제')
console.log(numPY('pPoooyY')); // true
console.log(numPY('Pyy'));     // false
console.log(numPY('ab'));      // true
console.log(numPY(''));        // true
console.log(numPY());          // true
```


---
