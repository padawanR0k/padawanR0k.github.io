---
author: [padawanr0k]
title: 웹 브라우저 Cookie에 대해 알아보자
date: 2021-07-12
tags: ["web"]
layout: post
image: ../../img/web_cookie.jpeg
keywords: [웹쿠키, cookie]
---

## Cookie란?

- `Cookie`는 브라우저에 저장되는 작은 크기의 문자열로, [RFC 6265](https://tools.ietf.org/html/rfc6265) 명세에서 정의한 HTTP 프로토콜의 일부이다. 브라우저는 작은 데이터조각을 저장해놨다가 동일한 서버에 요청을 보낼 때, 해당 쿠키를 같이 전달한다. 이로써 [stateless](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#http_is_stateless_but_not_sessionless)한 HTTP 프로토콜에서 상태 정보를 기억해주게끔 해준다. (쿠키는 쇼핑몰서비스에서 [장바구니 기능을 구현하기 위해](https://ko.wikipedia.org/wiki/HTTP_%EC%BF%A0%ED%82%A4#cite_ref-ks_6-0) 도입되었다.)
- 주로 웹서버에 의해 생성되며 HTTP 응답의 `Set-Cookie` 헤더에 값을 지정하여 전달한다. 브라우저는 전달받은 `Set-Cookie` 값을 분석하여 사용자가 접속한 브라우저에 저장한다. (chrome을 사용하는 경우 개발자도구의 Application 탭에서 확인가능하다)
    - 브라우저별로 저장되기 때문에 크롬으로 특정 사이트에 접속하여 `Cookie` 를 발급받아도, safari에는 같은 사이트에 대한 `Cookie`가 존재하지 않는다.
- `Cookie` 발급에는 다양한 옵션이 존재한다.
    - **Expires=\<date\>**
        - HTTP 타임스탬프로 기록된 쿠키의 유효기간을 지정하고 해당 기간을 지나면 쿠키는 만료된다.
        - ex)
            - 팝업UI 기능중 “오늘 하루 보지 않기”를 구현해야하는 경우, 버튼 클릭시 `Cookie` 의 `Expires` 값을 금일 23:59:59로 지정한 후, 유저의 쿠키보유 여부로 분기처리를 하여 구현하면된다.
    - **Max-Age=\<number\>**
        - `Cookie` 만료될 때 까지의 시간을 초단위로 지정한다. 만약 이 값을 0보다 같거나 작은 값으로 지정하면 해당 쿠키는 즉시 만료된다.
        - ex)
            - 만약 채팅을 구현한 웹앱에서 “N시간동안 알림받지 않기” 기능을 구현해야하는 경우 사용할 수 있을듯하다.
    - **Domain=\<domain-value\>**
        - 쿠키가 적용되어야 하는 호스트를 지정한다. 값을 따로 지정하지 않으면, 유저가 현재 접속한 URI를 기준으로 값이 지정된다. [과거 Cookie 설계](https://datatracker.ietf.org/doc/html/rfc2109)와 달리 도메인 선두에 존재하는 `.` 은 무시된다. 현재 버전의 쿠키는 도메인이 지정되면, 서브도메인은 항상 포함되어 허용된다.
            - ex)
                - google.com에서 `Domain=goole.com`으로 발급한 쿠키는 map.google.com 이나 mail.google.com에서 접근가능하다. 하지만 mail.google.com에서 `Domain=mail.google.com` 으로 발급된 쿠키는 google.com에서 접근할 수 없다.
        - 또한 보안상의 이유로 현재 리소스의 최상위 도메인과 하위 도메인만 설정이 가능하다. hangame.com은 payco.com 도메인을 가진 쿠키를 생성할 수 없다는 말이다.
        - ex)
            - 특정 플랫폼에서 로그인한 유저는 프로필정보를 노출시켜주고 싶을 경우, 로그인시 어떤 유저인지 정보를 담은 `Cookie`를 발급하면된다. 이후에 유저가 또 서버에 요청을 헤더에 `Cookie` 가 전달되게 되고, 어떤 유저인지 특정가능해진다.
    - **Path=\<path-value\>**
        - 이 쿠키에 접근할 수 있는 경로를 제한한다. 만약 `/docs` 라는 경로를 지정하면 그 하위인 `/docs/1` 이나 `/docs/js/1`등이 모두 해당된다. 특별한 경우가 아닌 경우 따로 지정하지 않으며 기본값은 `/`이다.
        - ex)
            - 유저 마이페이지의 url이 `/mypage`이며, 마이페이지에서만 필요한 `Cookie`를 생성해야할 경우
    - **Secure**
        - 해당 옵션이 적용된 쿠키는 HTTPS 프로토콜을 사용해 암호화된 요청에서만 사용가능하다. 하지만 이 경우에서도 보안에 민감한 정보는 저장하면 안된다.
    - **HttpOnly**
        - 해당 옵션이 적용된 쿠키는 브라우저에서 접근할 수 없다. `document.cookie` 로 쿠키 접근시 해당 쿠키가 보여지지 않으며 서버와 통신하는 경우에는 쿠키가 정상적으로 전달된다.
    - **SameSite=Lax|Strict**
        - cross-site 요청 위조 공격 (CSRF)에 대해 보호 방법을 제공해준다.
        - **오래된 브라우저에서는 지원하지 않는다.** ([caniuse](https://caniuse.com/?search=samesite))
        - **CSRF**이란?
            - 은행사이트(**bank.com**)와 은행사이트를 접근해 **CSRF**를 통해 정보를 탈취하려는 **evil.com**이 있다고 생각해보자
            - `evil.com`사이트내부에는 악위적으로 `bank.com`에 자동요청을 보내는 폼(form)이 있다. 폼이 `evil.com`에서 은행 사이트로 요청을 전송할 때 `bank.com`의 인증 쿠키도 함께 전송된다. `bank.com`에서 전달받은 쿠키는 해당 url에 요청할 때 같이 전송되기 때문이다.
            - 이를 막기위해 `SameSite` 를 `Lax` 또는 `Strict(기본값)` 로 지정할 수 있다.
            - `Strict`
                - 사용자가 외부로 요청을 보낼 때 해당 옵션이 적용된 쿠키를 보내지 않는다. (위같은 상황)
            - `Lax`
                - `Strict` 옵션과 비슷하나 좀 더 느슨한 방식을 제안하여 특정한 조건을 만족하는 경우에는 쿠키를 보낸다.
                - “안전한” HTTP 메서드인 경우 - [RFC7231 명세](https://datatracker.ietf.org/doc/html/rfc7231#section-4.2.1) (예: GET 방식. POST 방식은 해당하지 않음).
                - 작업이 최상위 레벨 탐색에서 이루어질 때
                    - 브라우저 주소창에서 URL을 변경하는 경우 - O
                    - `<iframe>`안에서 탐색이 일어나는 경우 - X

## 왜 사용하는가?

- 세션 관리(Session management)
    - 서버에 저장해야 할 로그인, 장바구니, 게임 스코어 등의 정보 관리를 위해 사용한다.
- 개인화(Personalization)
    - 사용자 선호, 테마 등의 세팅등을 저장하여, 다음에 유저가 접속했을 때에도 동일한 설정을 유저에게 제공할 수 있게해준다.
- 트래킹(Tracking)
    - 주로 사용자를 식별하고 정보를 수집하여 분석하기 위해 사용한다. 유저가 로그인하였는지 확인하는데 사용하기도 하며, 특정 URL에 방문했는지 확인하는데 사용하기도 한다.
    - 쇼핑몰 사이트에서 특정 상품을 보고 난 후, 웹서핑을 하다보면 구글광고에 동일한 제품이나 관련 제품광고가 뜨는 것을 본적이 있을 것이다. 이는 `third-party cookie`를 사용한 것이다. (접속한 사이트 도메인에서 발행되지 않은 쿠키는 모두 `third-party cookie`이다)
        - 상품 상세페이지에 구글광고서버로 요청을 보내는 스크립트가 있으면, 해당 쇼핑몰 사용내역을 빼올 수 있게된다. 이후 유저가 다른 사이트로 접속했는데 해당 페이지에도 구글광고가 있다면, 이전에 가져왔던 정보로 광고를 추려 보여주는것이다.

## 어떻게 사용하는가?

### **프론트엔드에서 `Cookie` 다루기**

- 브라우저에서 `Cookie`를 읽고 쓸 때는 [document.cookie](https://developer.mozilla.org/ko/docs/Web/API/Document/cookie) Web API를 사용합니다. 이 때 document.cookie는 접근자 프로퍼티로서 getter와 setter로 작동합니다.

#### **`Cookie` 읽기**

다음과 같이 getter를 통해 현재 접속한 URL에서 확인가능한 `Cookie`를 문자열로서 확인할 수 있습니다.

```javascript
console.log(document.cookie);
// cookie1=value1; cookie2=value2;...
```

- 문자열은 `key=value` 형태로 구성되어 있고 `;`로 분리됩니다. 만약 특정한 이름을 가진 `Cookie`를 가져오고 싶은 경우 직접 함수를 구현해야합니다. ([getCookie() 예시](https://ko.javascript.info/cookie#ref-250))
- `Cookie`에 대한 옵션은 확인할 수 없습니다. (`Domain`, `expires`, `Max-Age` 등)

#### **`Cookie` 쓰기**

다음과 같이 setter를 통해 `Cookie`를 생성할 수  있습니다.

```javascript
document.cookie="mycookie=123";
```

- `Cookie` 에 대한 옵션을 지정하는것도 가능하며 `;` 으로 옵션을 구분합니다. (내부 native코드에서 문자열을 분석하여 적용시킵니다.)
    - `1document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";
    2document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";`

### **백엔드에서 쿠키 다루기**

> express.js를 사용하는 경우

#### **Cookie 읽기**

- [cookie-parser](https://github.com/expressjs/cookie-parser) 미들웨어를 사용하면 쉽게 요청(request) 객체에서 `Cookie` 확인 할 수 있습니다.

```javascript
var express = require('express')
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser())// cookie-parser 미들웨어를 사용합니다.

app.get('/', function (req, res) {
  // req.cookies는 key-value인 object이다.
  console.log('Cookies: ', req.cookies);
  console.log('mycookie: ', req.cookies.mycookie);
})

app.listen(8080)
```

#### **Cookie 쓰기**

- [res.cookie(name, value [, options])](https://expressjs.com/ko/api.html#res.cookie)
- 응답을 유저에게 전달하기전 값을 지정할 수 있습니다.

```javascript
res.cookie('name', 'tobi') // 옵션은 선택사항입니다.

const cookieOption = {
  expires: new Date(Date.now() + 900000),
  httpOnly: true
};
res.cookie('rememberme', '1', cookieOption);

```

## 참고링크

- [Set-Cookie - HTTP | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Set-Cookie)
- [쿠키와 document.cookie](https://ko.javascript.info/cookie#ref-666)
- [쿠키(Cookie)에 대해 알아보자](https://sy34.net/what-is-cookie/)
- [HTTP 쿠키와 톰캣 버전별 이슈 : NHN Cloud Meetup](https://meetup.toast.com/posts/172)
