---
title: 자바스크립트 - 날짜 YYYY-MM-DD 형식으로 가져오기
date:  2018-06-15
tags: [javascript]

---

```javascript
let today = new Date();
// Fri Jun 15 2018 14:33:33 GMT+0900 (한국 표준시)

today.toISOString();
// 2018-06-15T05:33:33.222Z

let YYYYMMDD = today.toISOString().slice(0, 10);
// 2018-06-15

```

## 지원
크롬, 파이어폭스, 사파리, 오페라 모두지원
단, IE 9 버전부터

[MDN 링크](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)