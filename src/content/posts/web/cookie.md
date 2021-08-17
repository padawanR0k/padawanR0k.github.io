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
- 주로 웹서버에 의해 생성되며 HTTP 응답의 `Set-Cookie` 헤더에 값을 지정하여 전달한다. 브라우저는 전달받은 `Set-Cookie` 값을 분석하여 사용자가 접속한 브라우저에 저장한다. (크롬을 사용하는 경우 개발자도구의 Application 탭에서 확인가능하다)
    - 브라우저별로 저장되기 때문에 크롬으로 특정 사이트에 접속하여 `Cookie` 를 발급받아도, safari에는 같은 사이트에 대한 `Cookie`가 존재하지 않는다.
- `Cookie` 발급에는 다양한 옵션이 존재한다.
    - **Expires=\<date>**
        - HTTP 타임스탬프로 기록된 쿠키의 유효기간을 지정하고 해당 기간을 지나면 쿠키는 만료된다.
        - ex)
            - 팝업UI 기능중 “오늘 하루 보지 않기”를 구현해야하는 경우, 버튼 클릭시 `Cookie` 의 `Expires` 값을 금일 23:59:59로 지정한 후, 유저의 쿠키보유 여부로 분기처리를 하여 구현하면된다.
    - **Max-Age=\<number>**
        - `Cookie` 만료될 때 까지의 시간을 초단위로 지정한다. 만약 이 값을 0보다 같거나 작은 값으로 지정하면 해당 쿠키는 즉시 만료된다.
        - ex)
            - 만약 채팅을 구현한 웹앱에서 “N시간동안 알림받지 않기” 기능을 구현해야하는 경우 사용할 수 있을듯하다.
    - **Domain=\<domain-value>**
        - 쿠키가 적용되어야 하는 호스트를 지정한다. 값을 따로 지정하지 않으면, 유저가 현재 접속한 URI를 기준으로 값이 지정된다. [과거 Cookie 설계](https://datatracker.ietf.org/doc/html/rfc2109)와 달리 도메인 선두에 존재하는 `.` 은 무시된다. 현재 버전의 쿠키는 도메인이 지정되면, 서브도메인은 항상 포함되어 허용된다.
            - ex)
                - `google.com`에서 `Domain=goole.com`으로 발급한 쿠키는 `map.google.com` 이나 `mail.google.com`에서 접근가능하다. 하지만 `mail.google.com`에서 `Domain=mail.google.com` 으로 발급된 쿠키는 `google.com`에서 접근할 수 없다.
                - `Domain=y.z.com` 으로 발급받은 쿠키는 `y.z.com`, `x.y.z.com`, `a.x.y.z.com` 에서도 적용될 수 있다.
        - \<domain-value\>에대한 제한
            - 또한 보안상의 이유로 현재 리소스의 최상위 도메인과 하위 도메인만 설정이 가능하다. hangame.com은 payco.com 도메인을 가진 쿠키를 생성할 수 없다는 말이다.
            - Cookie를 발급하는 서버는 자기자신 혹은 부모 domain으로만 \<domain-value\> 값으로 사용할 수 있다. `x.y.z.com` 서버는 `x.y.z.com`, `y.z.com`, `z.com` 은 가능하나 `x.a.z.com` 은 불가능하다. ([관련글](https://stackoverflow.com/questions/1062963/how-do-browser-cookie-domains-work))
            - 도메인에 [TLD](https://library.gabia.com/contents/domain/713/)를 지정할 수 없다. (.com, .kr 같은 목적이나 종류 또는 등록자가 소속되어 있는 국가를 나타내는 도메인)
        - ex)
            - 특정 플랫폼에서 로그인한 유저는 프로필정보를 노출시켜주고 싶을 경우, 로그인시 어떤 유저인지 정보를 담은 `Cookie`를 발급하면된다. 이후에 유저가 또 서버에 요청을 헤더에 `Cookie` 가 전달되게 되고, 어떤 유저인지 특정가능해진다.
    - **Path=\<path-value>**
        - 이 쿠키에 접근할 수 있는 경로를 제한한다. 만약 `/docs` 라는 경로를 지정하면 그 하위인 `/docs/1` 이나 `/docs/js/1`등이 모두 해당된다. 특별한 경우가 아닌 경우 따로 지정하지 않으며 기본값은 `/`이다.
        - ex)
            - 유저 마이페이지의 url이 `/mypage`이며, 마이페이지에서만 필요한 `Cookie`를 생성해야할 경우
    - **Secure**
        - 해당 옵션이 적용된 쿠키는 HTTPS 프로토콜을 사용해 암호화된 요청에서만 사용가능하다. 하지만 이 경우에서도 보안에 민감한 정보는 저장하면 안된다.
    - **HttpOnly**
        - 해당 옵션이 적용된 쿠키는 브라우저에서 접근할 수 없다. `document.cookie` 로 쿠키 접근시 해당 쿠키가 보여지지 않으며 서버와 통신하는 경우에는 쿠키가 정상적으로 전달된다.
    - **SameSite=Lax|Strict|None**
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

- 브라우저에서 `Cookie`를 읽고 쓸 때는 [document.cookie](https://developer.mozilla.org/ko/docs/Web/API/Document/cookie) Web API를 사용한다. 이 때 document.cookie는 접근자 프로퍼티로서 getter와 setter로 작동한다.

### **`Cookie` 읽기**

다음과 같이 getter를 통해 현재 접속한 URL에서 확인가능한 `Cookie`를 문자열로서 확인할 수 있다.

```javascript
console.log(document.cookie);
// cookie1=value1; cookie2=value2;...
```

- 문자열은 `key=value` 형태로 구성되어 있고 `;`로 분리됩니다. 만약 특정한 이름을 가진 `Cookie`를 가져오고 싶은 경우 직접 함수를 구현해야한다. ([getCookie() 예시](https://ko.javascript.info/cookie#ref-250))
- `Cookie`에 대한 옵션은 확인할 수 없다. (`Domain`, `expires`, `Max-Age` 등)

### **`Cookie` 쓰기**

다음과 같이 setter를 통해 `Cookie`를 생성할 수  있다.

```jsx
document.cookie="mycookie=123";
```

- `Cookie` 에 대한 옵션을 지정하는것도 가능하며 `;` 으로 옵션을 구분한다. (내부 native코드에서 문자열을 분석하여 적용시킨다.)
  ```javascript
    document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";
    document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
  ```

### **백엔드에서 쿠키 다루기**

> express.js를 사용하는 경우

#### **Cookie 읽기**

- [cookie-parser](https://github.com/expressjs/cookie-parser) 미들웨어를 사용하면 쉽게 요청(request) 객체에서 `Cookie` 확인 할 수 있다.

```jsx
var express = require('express')
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser())// cookie-parser 미들웨어를 사용한다.

app.get('/', function (req, res) {
// req.cookies는 key-value인 object이다.
  console.log('Cookies: ', req.cookies);
  console.log('mycookie: ', req.cookies.mycookie);
})

app.listen(8080)
```

### **Cookie 쓰기**

- [res.cookie(name, value [, options])](https://expressjs.com/ko/api.html#res.cookie)
- 응답을 유저에게 전달하기전 값을 지정할 수 있다.

```jsx
res.cookie('name', 'tobi') // 옵션은 선택사항입니다.

const cookieOption = {
  expires: new Date(Date.now() + 900000),
  httpOnly: true
};
res.cookie('rememberme', '1', cookieOption);

```

## 마주칠 수 있는 문제들

### **서로 다른 도메인에서 쿠키를 사용하는 경우**

> 만약 cluster.42seoul.io URL을 가진 프론트엔드에서 api.checkin.42seoul.io URL을 가진 백엔드 API를 호출하여 쿠키를 발급받는다고 생각해보자. 이 경우 그냥 발급받을 수는 없고 몇가지 이슈가 존재한다.

### **CORS (Cross Origin Resource Sharing)이슈**

<img id="transparent_pic" src="../../img/CORS_principle.png">
<style>
  #transparent_pic { background: #fff; }
</style>

- CORS는 서로 다른 출처의 선택한 자원에 접근하는 것을 의미한다. 현대의 브라우저에서는 별다른 설정이 없는 CORS 요청을 제한하고 있다. CORS를 정상적으로 하기 위해서는 아래와 같은 설정이 필요하다.
- frontend에서 CORS 관련 설정하기 ([withCredential](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials))
    - 기본적으로 CORS에 해당하는 요청을 하게되면 오류가 발생하며 요청에 실패한다. `XMLHttpRequest.withCredential` 속성이 `true` 현재 요청이 cross-site요청임을 나타내며 정상적으로 진행된다.
    - axios를 사용하는 경우
        - `axios.get('https://example.com', {}, { withCredentials: true })`
- backend에서 CORS 관련 설정하기 ([Access-Control-Allow-Origin](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Access-Control-Allow-Origin))
    - 서버에서 정상적으로 CORS를 처리해주기 위해서는 `Access-Control-Allow-Origin` 헤더를 설정해 주어야한다. 요청을 받았을 때 허용할 origin을 설정해 주어야한다.
        - 만약 프론트엔드에서 `withCredential` 설정을 `true`로 한 경우에는 `Access-Control-Allow-Origin` 의 value에 모든 URL을 지칭하는 `` 는 사용할 수 없다.
    - express를 사용하는 경우
        - `npm i cors *// cors모듈을 설치한다.*`

        ```jsx
        import cors from 'cors';
        this.app.use(
        	cors({
        	origin: 'https://example.com',
        	credentials: true
        	})
        );
        ```

### **`Domain=<domain-value>` 설정에 대한 제한이슈**

- Cookie는 Set-Cookie 헤더에 의해 브라우저에 저장됩니다. 이때 쿠키를 나타내는 Key-Value값은 필수다. 추가적으로 가능한 옵션은 상단에서 확인할 수 있다. 이중 Domain 설정값은 쿠키가 적용될 호스트들을 의미한다.
- `Domain`값은 현재 도메인 혹은 부모 도메인으로만 **<domain-value>** 값으로 사용할 수 있다. `x.y.z.com` 서버는 `x.y.z.com`, `y.z.com`, `z.com` 은 가능하나 `x.a.z.com` 은 불가능하다. ([관련글](https://stackoverflow.com/questions/1062963/how-do-browser-cookie-domains-work))
- **<domain-value>** 값 선두에 `.` 이 있든 없든 그에 대한 자식 도메인은 모두 허용된다.
- 케이스 정리
    - `example.com`의 쿠키는 `www.example.com`에서 확인가능한가?
        - `Domain=.example.com`이 포함된 쿠키는 `www.example.com`에서 확인할 수 있음
    - `example.com`의 쿠키는 `example.com`에서 확인가능한가?
        - `Domain=.example.com`이 포함된 쿠키는 `example.com`에서 확인할 수 있음
    - `example.com`용 쿠키는 `www.example.com`에서 확인가능한가?
        - `Domain=example.com`을 사용하는 쿠키는 .example.com으로 변환되므로 `www.example.com`에서도 사용할 수 있음
    - `example.com`용 쿠키는 `anotherexample.com`에서 확인가능한가?
        - another`example.com`에서는 `Domain=example.com`을 사용한 쿠키를 사용할 수 없음
    - `www.example.com`에서 `example.com`의 쿠키를 설정할 수 있는가?
        - `www.example.com`은 `example.com`에 쿠키를 설정할 수 있음
    - `www.example.com`에서 `www2.example.com`의 쿠키를 설정할 수 있는가?
        - `www.example.com`은 `www2.example.com`에 대한 쿠키를 설정할 수 없음
    - `www.example.com`에서 `.com`에 쿠키를 설정할 수 있는가?
        - `www.example.com`에서는 `.com`에 쿠키를 설정할 수 없음
            - `.com`, `.org`, `.net` 같은 [TLD](https://ko.wikipedia.org/wiki/%EC%9D%B8%ED%84%B0%EB%84%B7_%EC%B5%9C%EC%83%81%EC%9C%84_%EB%8F%84%EB%A9%94%EC%9D%B8_%EB%AA%A9%EB%A1%9D) (Top Level Domain) 포함 [Public Suffix list](https://publicsuffix.org/list/)에는 불가능함

### **sameSite 이슈**

- google.com에 발급된 쿠키는 example.com에선 사용할 수 없지만 example.com에서 google.com으로 이동할 땐 쿠키가 붙어서 전송된다. 이처럼 쿠키는 대상 도메인을 기준으로 전송의 유무가 판단된다. 이를 악용한 공격이 요청 위조 공격 (CSRF)이다.
- 만약에 Cookie에 별도로 제한이 없다면, 크롬을 제외한 브라우저들은 모든 HTTP 요청에 대해서 쿠키를 전송하게 된다. 그 요청에는 HTML 문서 요청, HTML 문서에 포함된 이미지 요청, XHR 혹은 Form을 이용한 HTTP 요청등 모든 요청이 포함된다. [CSRF(Cross Site Request Forgery)](https://ko.wikipedia.org/wiki/%EC%82%AC%EC%9D%B4%ED%8A%B8_%EA%B0%84_%EC%9A%94%EC%B2%AD_%EC%9C%84%EC%A1%B0)는 이 문제를 노린 공격이다. 간단히 소개해보자면 아래와 같은 방식이다.
    1. 공격대상 사이트는 쿠키로 사용자 인증을 수행함.
    2. 피해자는 공격 대상 사이트에 이미 로그인 되어있어서 브라우저에 쿠키가 있는 상태.
    3. 공격자는 피해자에게 그럴듯한 사이트 링크를 전송하고 누르게 함. (공격대상 사이트와 다른 도메인)
    4. 링크를 누르면 HTML 문서가 열리는데, 이 문서는 공격 대상 사이트에 HTTP 요청을 보냄.
    5. 이 요청에는 쿠키가 포함(서드 파티 쿠키)되어 있으므로 공격자가 유도한 동작을 실행할 수 있음.
- sameSite에 설정할 수 있는 값은 다음과 같다.
    - `Strict`
        - 강하게 제한하는 정책으로 SameSite가 아니면 쿠키의 생성과 전달을 금지한다.
        - Set-Cookie Domain 의 registrable domain 과 브라우저 주소창 URI 의 registrable domain 이 정확하게 일치하고 scheme까지(https ==> https) 동일할 경우 SameSite 이다.
            - **registrable domain** 은 **TLD + 1 레벨**의 도메인이다. (public suffix list에 포함되면 TLD이다)
            - google.**com** => google.**com** 가능
            - example.**com** => google.**com** 불가능
            - me.**github.io** => you.**github.io** 불가능
                - sameSite를 판단할 때 [public Suffix list](https://publicsuffix.org/list/public_suffix_list.dat)들에 포함된 부분들은 제외함. `github.io` 는 리스트에 포함된다. ([관련링크](https://security.stackexchange.com/questions/223473/for-samesite-cookie-with-subdomains-what-are-considered-the-same-site))
    - `Lax`
        - 2020년 2월 기준 크롬 브라우저 기준으로 Default 값
        - `Strict` 설정에서 조금 완화된 설정이라고 보면된다.
        - Top Level Navigation(웹 페이지 이동)과 "안전한" HTTP 메서드 요청의 경우 쿠키가 보내지는 옵션이다.
        - Top Level Navigation
            - `<a>`태그를 이용한 이동
            - `window.location.replace`으로 인해 자동으로 이동
            - 302 redirect
            - `<iframe>` *,* `<img>`*에 의한 요청은 Navigation이라고 할 수 없으니 **포함안됨***
            - `<iframe>`내부에서의 이동도 Top Level이 아니 **포함안됨**
        - "안전한" HTTP 메서드 요청
            - 서버의 상태를 바꾸지 않는 `"GET"`, `"HEAD"`, `"OPTIONS"`, `"TRACE"` 이다(RFC7231).
            - 서버의 상태를 바꾸는 `POST`나 `DELETE` 같은 요청의 경우 **포함안됨**
    - `None`
        - Cookie 사용에 있어서 소스가 되는 주소를 검증하지 않는다. `SameSite`가 탄생하기 전 쿠키와 동작하는 방식이 같다. (권장하지 않는 옵션)
        - `Secure` 옵션이 강제됨

### **예시에 대한 해결방법**

> 만약 cluster.42seoul.io URL을 가진 프론트엔드에서 api.checkin.42seoul.io URL을 가진 백엔드 API를 호출하여 쿠키를 발급받는다고 생각해보자. 이 경우 그냥 발급받을 수는 없고 몇가지 이슈가 존재한다.

1. API 서버에서 CORS 설정을 해주고 프론트엔드의 URL을 허용
2. 프론트엔드에서는 requst를 보낼 때, `withCredential`옵션을 `true` 로 전달
3. `Domain` 설정은 둘이 공유하는 가장 높은 부모레벨인 `42seou.io` 설정
4. 보안을 위해 `SameSite`는 `Lax` 로 설정

## 테스트해보기

- Cookie를 발급받을 때 옵션을 원하는대로 설정할 수 있는 [간단한 프로젝트](https://github.com/padawanR0k/cookie-tester)를 구성했다. 해당 프로젝트는 각각 [checkintest.42cadet.kr](http://checkintest.42cadet.kr/)(client), [api.checkintest.42cadet.kr](http://api.checkintest.42cadet.kr/)(server)에 배포했다.
- 테스트
    - `POST - api.checkintest.42cadet.kr/getCookie` 로 요청을 보내 Cookie를 발급받는다.
    - key, value는 `mycookie`, `42`로 통일했다.
    - `Set-Cookie` 헤더 실험결과
        1. `set-cookie: mycookie=42; Path=/; SameSite=Lax;`
            1. `Lax`의 경우 안전한 요청만 허용
            2. `Domain` 을 명시하지 않았음. 명시하지 않으면 Cookie가 만들어진 곳의 origin이 `Domain`([api.checkintest.42cadet.kr](http://api.checkintest.42cadet.kr/))값이 됨([참고](http://bayou.io/draft/cookie.domain.html)).
            3. server의 Cookie로 생성됨 (주소창에 [api.checkintest.42cadet.kr](http://api.checkintest.42cadet.kr/)를 입력하고 개발자도구를 보면 Cookie를 확인할 수 있다.)
        2. `set-cookie: mycookie=42; Path=/; SameSite=Strict;`
            1. server의 Cookie로 생성됨
        3. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure;`
            1. server의 Cookie로 생성됨
        4. `set-cookie: mycookie=42; Path=/; SameSite=Lax; httpOnly;`
            1. `httpOnly` 헤더는 javascript 접근만 못할 뿐, 현재 헤더는 1번케이스와 동일한 결과
        5. `set-cookie: mycookie=42; Path=/; SameSite=Strict; httpOnly;`
            1. `httpOnly` 헤더는 javascript 접근만 못할 뿐, 현재 헤더는 2번케이스와 동일한 결과
        6. `set-cookie: mycookie=42; Path=/; SameSite=None; httpOnly;`
            1. `httpOnly` 헤더는 javascript 접근만 못할 뿐, 현재 헤더는 3번케이스와 동일한 결과
        7. `set-cookie: mycookie=42; Path=/; SameSite=Lax; Domain=42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성됨
        8. `set-cookie: mycookie=42; Path=/; SameSite=Strict; Domain=42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성됨
        9. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure; Domain=42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성됨
        10. `set-cookie: mycookie=42; Path=/; SameSite=Lax; Domain=checkintest.42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성됨
        11. `set-cookie: mycookie=42; Path=/; SameSite=Strict; Domain=checkintest.42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성됨
        12. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure; Domain=checkintest.42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성됨
        13. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure; Domain=naver.com;` 🚫
            1. SameSite가 아니므로 invalid함으로 생성되지 않음
        14. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure; Domain=seoul.42cadet.kr;` 🚫
            1. server의 URL은 `api.checkintest.42cadet.kr`임. 부모 도메인(`checkintest.42cadet.kr`, `42cadet.kr`)이 아니므로 생성 불가
        15. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure; Domain=seoul.api.checkintest.42cadet.kr;` 🚫
            1. server의 URL은 `api.checkintest.42cadet.kr`임. 부모 도메인이 아니므로 생성 불가

## 참고링크

- [Set-Cookie - HTTP | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Set-Cookie)
- [쿠키와 document.cookie](https://ko.javascript.info/cookie#ref-666)
- [쿠키(Cookie)에 대해 알아보자](https://sy34.net/what-is-cookie/)
- [HTTP 쿠키와 톰캣 버전별 이슈 : NHN Cloud Meetup](https://meetup.toast.com/posts/172)
- [SameSite=Lax가 Default로? SameSite Cookie에 대해 정확하게 알아보기](https://www.hahwul.com/2020/01/18/samesite-lax/#section_5)
- [[What is Block] ‘.io’... 도대체 무슨 도메인? | 블록미디어](https://www.blockmedia.co.kr/archives/122750)
- [Set cookies for cross origin requests](https://stackoverflow.com/questions/46288437/set-cookies-for-cross-origin-requests)
- [교차 출처 리소스 공유 (CORS) - HTTP | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)
- [브라우저 쿠키와 SameSite 속성 / seob.dev](https://seob.dev/posts/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EC%BF%A0%ED%82%A4%EC%99%80-SameSite-%EC%86%8D%EC%84%B1/)
- [Cookies and the Public Suffix List | Heroku Dev Center](https://devcenter.heroku.com/articles/cookies-and-herokuapp-com)
- [Cookie SameSite 기본편](https://yangbongsoo.tistory.com/5?category=919814)
- [Cookie Domain](http://bayou.io/draft/cookie.domain.html)
