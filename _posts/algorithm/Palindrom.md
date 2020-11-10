---
title: 알고리즘 문제 풀이 - 팰린드롬(회문)
date:  2018-02-12
tags: [알고리즘 문제 풀이]

---

## 문제
palindrome(팰린드롬/회문)은 왼쪽에서 오른쪽으로 읽은 다음, 오른쪽부터 왼쪽으로 다시 읽어도 똑같은 형태와 의미를 유지하는 문장이나 단어를 지칭한다.
인자로 전달한 문자열이 palindrome인지 검사하여 Boolean값을 반환하는 함수를 완성하라.
단, 반드시 1자 이상의 문자열을 인자로 전달한다.


## 풀이

```javascript
function checkPalindrom(str) {
  var length = str.length;
  if (length <= 1 ) {
    return false;
  }else{
    for (var i = 0; i < length; i++, length--) {
       if (str[i] === str[length - 1] ) {
       }else{
         return false;
       }
    }
    return true;
  }
}
console.log(checkPalindrom('dad')); // true
console.log(checkPalindrom('mom')); // true
console.log(checkPalindrom('palindrom')); // false
```

## 다른사람 풀이
```js
function isPalindrome(string){
    if( string ){
        str = string.toString().replace(" ","").toLocaleLowerCase();
        if( str.length>1 ){
            for(i=0; i<(str.length/2); i++){
                if( str.charAt(i)!=str.charAt((str.length-1)-i) ){
                    return false;
                }
            }
            return true
        }
    }
    return false;
}
console.log("[] : "+isPalindrome(""));
console.log("[A] : "+isPalindrome("A"));
console.log("[기러기] : "+isPalindrome("기러기"));
console.log("[다리 저리다] : "+isPalindrome("다리 저리다"));
console.log("[rotator] : "+isPalindrome("rotator"));
console.log("[releasenote.kr] : "+isPalindrome("releasenote.kr"));
console.log("[장난감 기차] : "+isPalindrome("장난감 기차 "));
console.log("[Madam] : "+isPalindrome("Madam"));
console.log("[race car] : "+isPalindrome("race car"));
console.log("[123321] : "+isPalindrome(123321));
// 출처: http://releasenote.tistory.com/22 [Release Note]
```

## 알게된 것
내 알고리즘은 띄어쓰기가 있는 회문을 false로 반환한다. 다양한 경우를 생각하지 않았던거같다. 앞으로는 유의해야겠다.