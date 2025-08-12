# [EN Translation Placeholder] 유저가 선택한 시스템 테마에 따른 css 분기처리하기

---
author: [padawanr0k]
title: 유저가 선택한 시스템 테마에 따른 css 분기처리
date:  2021-05-21
tags: [css]
draft: false
keywords: [다크테마, 테마]
---
# 유저가 선택한 시스템 테마에 따른 css 분기처리하기

## `prefers-color-scheme` 미디어쿼리

- 최신 운영체제나 브라우저는 다크모드 테마를 지원한다. `macOS의 경우 설정-일반-화면모드`에서 바꿀수있다. (어플 또한 설정메뉴에서 찾을 수 있다
- )
- css나 javascript에서는 유저가 어떤 테마를 사용중인지 확인할 수 있는 방법이 있다.
- 이 블로그를 커스텀하면서 해당 속성이 있다는 걸 알게되었다...

## javascript로 브라우저가 다크모드를 대응하기

### `window.matchMedia()`
- css에서 미디어쿼리를 사용하여 특정 미디어쿼리를 충족하는 경우 분기처리를 하듯이, javascript에서도 비슷한 기능을 지원한다.
	- `MediaQueryList.matches`
		- 해당 document 가 주어진 미디어 쿼리를 만족하는지 여부로, boolean 값이다.
	- `MediaQueryList.media`
		- 주어진 미디어 쿼리를 string 으로 serialize 한 값이다.

```javascript
const darkModeMediaQuery = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
const getEl = (selector) => document.querySelector(selector);
const setText = (isSupport) => {
    const el = getEl(".is_darkmode");
	if (isSupport) {
		el.innerText = "다크모드 ON";
	} else {
		el.innerText = "다크모드 OFF";
	}
}

if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
  	const elem = getEl(".is_support")
  	elem.innerText = '🎉 다크 모드를 지원하는 브라우저 입니다.';

  	const darkModeOn = darkModeMediaQuery();
  	setText(darkModeOn);

  	window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
		const darkModeOn = darkModeMediaQuery();
		setText(darkModeOn);
	});
} else {
  const elem = getEl(".is_support")
  elem.innerText = '🎉 다크 모드를 지원하지 않는 브라우저 입니다.';
}
```


## css로 다크모드 대응하기

```css

/* 다크모드를 지원하고, 현재 다크모드 사용중인 경우 해당 css가 적용됨 */
@media (prefers-color-scheme: dark) {
	body {
		background-color: #bbb;
	}

}

/* 다크모드를 지원하고, 현재 라이트모드 사용중인 경우 해당 css가 적용됨 */
@media (prefers-color-scheme: light) {
	body {
		background-color: #fff;
	}
}
```

## 참고

- [MDN](https://developer.mozilla.org/ko/docs/Web/CSS/@media/prefers-color-scheme)
- [prefers-color-scheme: Hello darkness, my old friend](https://web.dev/prefers-color-scheme/)
- [Javascript 로 미디어 쿼리를 쓰는 방법, window.matchMedia](https://eunsukim.me/posts/how-to-use-media-query-with-javascript-matchmedia)
