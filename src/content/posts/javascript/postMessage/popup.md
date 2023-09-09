---
author: [padawanr0k]
title: NICE 본인인증 구현시 프론트엔드에서 postMessage 활용방안
date: 2023-09-09
updated: 2023-09-09T11:28:03+09:00
tags: ["javascript"]
created: 2023-09-09T11:28:03+09:00
---

## 상황
NICE 본인인증 팝업을 통해 인증이 완료된 유저만 접근가능하도록 하는 기능이 필요했다.
백엔드 개발자분께서 [NICE측 API](https://www.niceapi.co.kr/#/apis/guide?ctgrCd=0100&prdId=31&prdNm=%EB%B3%B8%EC%9D%B8%ED%99%95%EC%9D%B8%28%ED%86%B5%ED%95%A9%ED%98%95%29)을 활용해 백엔드 로직은 완료해주셨고, 내가 해야할 일은 다음과 같았다.
- 공식문서에서 제공해주는 form 코드를 통해 인증 팝업을 연다.
- 팝업이 닫히는 이벤트를 감지하고, 인증 이후 분기처리를 실행한다.

## 문제

### NICE인증 팝업을 사용하는 측에서 어떻게 인증이 완료됨을 알 수 있을까?

#### beforeunload - window가 닫힐 때 발생하는 이벤트

해당 이벤트를 사용해서 인증 성공 여부와 상관없이 팝업이 닫히면 현재 계정의 인증 여부를 조회하는 API를 호출하려고 했음.


```typescript
popUpRef.current = window.open(...)
popUpRef.current?.addEventListener('beforeunload', () => {
  ...
});
```
왜 인지 이벤트가 팝업이이 닫힐 때가 아니라, 팝업이 열릴 때 바로 트리거됐다.

확인해보니 window.open 해서 열었던 주소가 same site policy를 만족하지 못해서였다. 같은 호스트거나 서브 도메인이면 가능하다.

#### window.postMessage - window 오브젝트 간 cross-origin 통신을 안전하게 할 수 있게해주는 메소드

한 쪽 window에서 해당 메서드를 통해 메시지를 발신하면 다른쪽에선 이벤트 리스너로 수신할 수 있게해준다. 이를 활용해서 사용하는 곳에서 message를 받으면 인증에 성공한 것으로 간주, 인증여부를 조회하는 API를 invalidation하려했다.


```typescript
/*
 * <http://example.com:8080>에 있는 윈도우 A의 스크립트:
 */

var popup = window.open(...popup details...);

// 팝업이 완전히 로드되었을 때:
popup.parent.postMessage("hello there!", "http://example.com");

function receiveMessage(event)
{

  if (event.origin !== "http://example.com")
    return;

  // console.log(event.data); "hello there!"
}
window.addEventListener("message", receiveMessage, false);
```

역시나 한번에 동작하지 않았다...

###### window.parent vs window.opener
> window.opener refers to the window that called window.open( ... ) to open the window from which it's called
> window.parent refers to the parent of a window in a \<frame\> or \<iframe\>
>
> [\[출처\]](https://stackoverflow.com/questions/11313045/what-are-window-opener-window-parent-window-top/11313219#11313219)


window.opener를 사용했어야했는데 parent를 사용했기 때문에 메시지를 수신할 수 없었다.
근데 window.opener로 변경해도 메시지가 수신되지 않았다..

- [How do I use Window.postMessage() cross domain?](https://stackoverflow.com/questions/76024047/how-do-i-use-window-postmessage-cross-domain/76024048#76024048)

cross domain 간 postMessage로 통신할 때 두번째 파라미터인 targetOrigin을 설정해주지 않아 수신할 수 없었던 것이다. 위 예시처럼 `postMessage` 두번째 매개변수에 호스트를 추가해서 해결했다.

`*` 로 설정하면 모든 호스트에 대해 허용인데, 이는 보안상 쓸모없는 설정이다. 다만 개발 환경에선 localhost, 개발서버 URL 모두 허용해줘야하기 때문에 `*` 설정하고 운영에선 정상적인 origin을 설정했다.
