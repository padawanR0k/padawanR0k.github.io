---
title: 모바일 사파리에서 input 엘리먼트를 누르면 확대되는 현상
date:  2018-08-05
tags: [safari, error]
categories: [error]
---

# 에러 내용
모바일페이지를 테스트 하던 도중 사파리 모바일에서만 일어났던 현상
input:data 엘리먼트를 클릭하면 사이트가 확대(?)가 된다. input태그는 기기의 OS따라 ui가 달라지기 때문에 안드로이드인 내 폰에서는 확인하지 못했었다.

# 해결법
아이폰 사파리에서는 입력하는 엘리먼트(`<input>`)의 `font-size`가 16px이하면 focus시 줌이 된다.
`-webkit-overflow-scrolling: touch`속성은 모바일 사파리에서만 지원한다고 한다. 이를 이용하자.

```css
@supports (-webkit-overflow-scrolling: touch) {
  /* CSS specific to iOS devices */
  .input-group {
    .form-control {
      font-size: 16px;
    }
  }
}
```

[출처](https://stackoverflow.com/questions/30102792/css-media-query-target-only-ios-devices)