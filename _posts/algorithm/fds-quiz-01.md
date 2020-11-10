---
title: 알고리즘 문제 풀이 - 반복문 연습
date:  2018-01-31
tags: [알고리즘 문제 풀이]

---


# 문제 1
for문을 사용하여 0부터 10미만의 정수 중에서 짝수만을 작은 수부터 출력하시오.

## 풀이

```javascript
for (var i = 0; i < 10; i++) {
  if (i % 2 == 0) {
    console.log(i);
  }
}
```



---

# 문제 2
for문을 사용하여 0부터 10미만의 정수 중에서 홀수만을 작은 수부터 문자열로 출력하시오.



## 풀이

```javascript
output = "";
for (var i = 0; i < 10; i++) {
  if (i % 2 == 1) {
    output += i;
  }
}
console.log(output);

```



---

# 문제 3
for문을 사용하여 0부터 10미만의 정수 중에서 홀수만을 큰수부터 출력하시오.



## 풀이

```javascript
for (var i = 10; i > 0; i--) {
  if (i % 2 == 1) {
    console.log(i);
  }
}
```



---

# 문제 4
while문을 사용하여 0부터 10까지 정수 중에서 짝수만을 작은 수부터 출력하시오.



## 풀이

```javascript
var n = 0;
while (n < 10) {
  if (n % 2 == 0) {
    console.log(n)
  }
  ++n;
}
```



---

# 문제 5
while문을 사용하여 0부터 10미만의 정수 중에서 홀수만을 큰수부터 출력하시오.



## 풀이

```javascript
var n = 10;
while (n > 0) {
  if ( n % 2 === 1){
    console.log(i);
  }
  n--;
}
```



---

# 문제 6
 for 문을 사용하여 0부터 10미만의 정수의 합을 출력하시오



## 풀이

```javascript
sum = 0;
for (var i = 0; i < 10 ; i++){
  sum += i;
}
console.log(sum)
```



---

# 문제 7
1부터 20까지의 정수 중에서 2 또는 3의 배수가 아닌 수의 총합을 구하시오.



## 풀이

```javascript
sum = 0;
for (var i = 0; i < 20; i++) {
  if (!(i % 2 == 0) && !(i % 3 == 0)) {
    sum += i;
  }
}
console.log(sum)
```



## 다른사람의 풀이

```javascript
sum = 0;
for (var i = 1; i <= 20; i++) {
  if (i % 2 !== 0 && i % 3 !== 0)) {
    sum += i;
  }
}
console.log(sum)
```


## 배운점

`!( i % 2 == 0 )` 와 `i % 2 !== 0` 의 차이



---

# 문제 8
1부터 20까지의 정수 중에서 2 또는 3의 배수인 수의 총합을 구하시오.
  2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16,18, 20 => 137



## 풀이

```javascript
sum = 0;
for (var i = 0; i < 21; i++) {
  if (i % 2 == 0 || i % 3 == 0) {
    sum += i;
  }
}
console.log(sum)
```





---

# 문제 9
두 개의 주사위를 던졌을 때, 눈의 합이 6이 되는 모든 경우의 수를 출력하는 코드를 작성하시오.



## 풀이

```javascript
for (var i = 6; i > 0; i--) {
  for (var m = 1; m < 6; m++) {
    if (i + m === 6) {
      console.log([i, m]);
    }
  }
}
```





---

# 문제 10


다음을 참고하여 *(별)로 높이가 5인(var line = 5) 삼각형을 문자열로 완성하라.
개행문자(‘\n’)를 사용하여 개행한다. 완성된 문자열의 마지막은 개행문자(‘\n’)로 끝나도 관게없다.

```
*
**
***
****
*****
```



## 풀이

```javascript
var output = '';
for ( var line = 0; line < 5; line++){
  for(var i = 0; i <= line; i++ ){
    output += '*';
  }
  output += '\n';
}
console.log(output);
```



## 다른사람의 풀이

```javascript
var output = '';
var star = '';
for ( var line = 0; line < 5; line++){
  star += "*";
  output += star + '\n';
}
console.log(output);
```



## 배운점

for문을 중첩안하고 변수를 생성하는 방법. 시간복잡도를 줄여준다.

n^2의 시간복잡도에서 2n으로



# 문제 11


다음을 참고하여 *(별)로 트리를 문자열로 완성하라.
개행문자(‘\n’)를 사용하여 개행한다. 완성된 문자열의 마지막은 개행문자(‘\n’)로 끝나도 관게없다.

```
*
**
***
*
**
***
****
*****
```



## 풀이

```javascript
var output = '';
for (var line = 0; line < 8; line++) {
  if (line < 3 ){
    for (var i = 0; i <= line; i++) {
      output += '*';
    }
  }else if(line >= 3){
    for (var i = 3; i <= line; i++) {
      output += '*';
    }
  }
  output += '\n';
}
console.log(output);
```



## 다른사람의 풀이

```javascript
var output = '';
var star1 = '';
var star2 = '';
for (var line = 0; line < 8; line++) {
  if (line < 3) {
    star1 += '*';
    output += star1 + '\n';

  } else {
    star2 += '*';
    output += star2 + '\n';
  }
}
console.log(output);
```


## 배운점

[문제 10]과 마찬가지로 이중중첩을 없에는 방법



---
