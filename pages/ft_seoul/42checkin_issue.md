---
title: production 환경에서 마주친 Cookie 이슈 해결하기
date: 2021-07-31
---
# production 환경에서 마주친 Cookie 이슈 해결하기
> 해당글은 42서울 체크인 서비스를 운영하며 작성한 글입니다.

### **3줄 요약**

1. 체크인서비스는 유저의 로그인 여부를 판단할 때 Cookie를 사용중이다.
2. 42인트라넷 로그인 후 서버로 리다이렉트되고, Cookie를 서버에서 발급하는 과정에서 문제발생, 유저는 로그인을 할 수 없는 상태가 됨. 이를 해결하기 위해 임시방편으로  Cookie의 Domain을 수정했다.
3. 왜 오류가 발생했고 제대로 수정하려면 어떡해야할까? 를 정리했다.

### **Cookie로 로그인여부 판단하기**
![](./img/login_seq.png)
현재 체크인 서비스는 유저의 로그인여부를 판단하기 위해 Cookie를 사용하고 있습니다. 유저가 로그인 버튼을 누르면 42인트라넷으로 이동하여 로그인을 마친 후, 체크인 API서버로 리다이렉트됩니다. 이 때 체크인 API서버는 Cookie를 발급하여, 유저의 브라우저에 쿠키를 남기게 됩니다. frontend에서는 그 Cookie를 확인하여 로그인한 사람만 특정페이지에 접근 가능하게 만들었습니다. 아닌 경우에는 메인화면으로 돌려보내게됩니다.

### **근데 웹에서 Cookie는 어떤거죠?**

Cookie는 브라우저에 저장되는 작은 크기의 문자열로, [RFC 6265](https://tools.ietf.org/html/rfc6265) 명세에서 정의한 HTTP 프로토콜의 일부입니다. 각 host마다 Cookie를 저장할수 있습니다. 또한 [RFC 6265](https://tools.ietf.org/html/rfc6265) 명세에서 허용하는 범위안에서는 host가 동일하지 않아도 Cookie에 접근할 수 있습니다.

- **브라우저에 저장되는 작은 크기의 문자열**
    - 크롬을 사용중이라면 개발자도구 - Application 탭에서 확인할 수 있습니다.
      - ![개발자도구 쿠키확인](/img/application_cookie.png)
    - Cookie는 기본적으로 `key-value`쌍을 가진 문자열이며, 개발자도구에서는 이를 파싱해서 사람이 보기 편한 상태로 보여줍니다.
- **[RFC 6265](https://tools.ietf.org/html/rfc6265) 명세에서 허용하는 범위안에서는 host가 동일하지 않아도 Cookie에 접근할 수 있습니다.**
    - 현재 제가 현재 이글을 작성하면서 접속한 URL은 `https://42cadet.atlassian.net/wiki/spaces/CHKN/pages/edit-v2/36601857`이며 여기서 host는 `42cadet.atlassian.net` 입니다. 하지만 개발자도구에서 `Domain`값이 `.attlassian.com`인 Cookie들을 확인할 수 있습니다. 이는 특정 도메인으로 발급된 쿠키는 하위 도메인에서 접근할 수 있는 명세 때문에 가능한것입니다.

### **배포 후 마주친 오류**

체크인서비스를 express로 새로 작성한 코드와 구조로 2021년 07월 01일 00시에 배포를 시작했습니다. 배포는 순조롭게 이루어졌지만 테스트를 해보는 과정에서 로그인에 문제가 있다는걸 발견했습니다. 위 시퀀스 다이어그램에서 볼 수 있는 가장 마지막 단계인 frontend에 Cookie를 발급하는 부분이 예상대로 작동하지않아 유저의 브라우저에서 Cookie를 확인할 수 없었고, 로그인 이후의 화면으로 넘어갈 수 없었습니다.

#### **문제가 발생한 이유는 뭐지?**

Cookie 발급시 `Domain` 에 할당하는 코드는 다음과 같았습니다.

```jsx
cookieOption.domain = config.url.client.split('//')[1]
```

`config.url.client` 는 client URL을 가지고 있는 환경변수이며, 위 코드가 실행되면 앞 `https://`을 제외한 값들이 `domain`에 할당됩니다. 위 코드는 모든 환경에서 동일했습니다. 그런데 prod환경에서만 오류가 발생했습니다. “*같은 코드인데, 왜 dev환경에서 테스트했을 때에는 문제가 없었을까?”*라는 생각을 하다보니 URL이 달라서 발생되는 오류라고 추론하게되었습니다.

### ***그러면 왜 쿠키를 발급해지 못했을까?***

서버에서 Cookie를 발급할 때, 서버는 자기자신 혹은 상위 도메인을 Cookie의 `Domain`값으로만 지정할 수 있습니다. 따로 지정하지않으면 현재 host를 기본값으로 사용합니다.

- ex) 서버의 URL이 `https://x.y.com` 일 경우
    - `Domain=x.y.com` 가능
    - `Domain=y.com` 가능
    - `Domain=z.com` 불가능

prod환경은 client URL(`http://cluster.42seoul.io`)이 server URL(`https://api.checkin.42seoul.io`)의 상위 도메인이 아닙니다. (`cluster !== checkin`) 이 때문에 못한 유저는 Cookie를 받을 수 없었고 브라우저에 저장할 수 없었습니다. *(dev환경의 server URL은* `https://api.checkin.dev.42seoul.io`*로 client URL인* `https://checkin.dev.42seoul.io` *의 서브도메인입니다. 그래서 dev환경에서는 정상적으로 작동했습니다)*

### **임시방편으로 문제해결한 방법**

위에서 작성한 코드는 prod 환경에서 server가 Cookie를 발급할 때, `Domain`값을 `https://`를 제외한 `cluster.42seoul.io` 으로 지정하게됩니다 .

그래서 해당 코드를 임시방편으로 prod환경일때 `42seoul.io` 값이 지정되게 하드코딩하여 해결했습니다. 그러면 server URL이 `42seoul.io` 의 서브도메인이기 정상적으로 Cookie가 발급되어 로그인 프로세스가 정상적으로 작동되게 됩니다. 하지만 이는 사이드이펙트를 가져왔습니다. 해당 `Domain`값을 가지고 발급된 Cookie는 `*.42seoul.io` 형태의 URL에는 모두 적용이 되어 dev환경에서도 확인되어 prod환경에서 로그인했을때 dev환경에서도 로그인이 되는 영향을 끼치고 있었습니다.

### **Cookie를 다양하게 다뤄보며 테스트해보자**

- Cookie를 발급받을 때 frontend에서 옵션을 원하는대로 설정할 수 있는 [간단한 프로젝트](https://github.com/padawanR0k/cookie-tester)를 구성했습니다. 해당 프로젝트는 각각 [checkintest.42cadet.kr](http://checkintest.42cadet.kr/)(client), [api.checkintest.42cadet.kr](http://api.checkintest.42cadet.kr/)(server)에 배포했습니다. 현재는 내려간 상태입니다.
![](./img/cookie_tester.png)
테스터의 client는 위와같이 생겼습니다. 좌측 UI에서 필요한 설정들을 지정한 후 send버튼을 누르게 되면 해당 설정들이 테스터 server로 보내지게됩니다. 우측에는 접속한 host에서 볼 수 있는 Cookie들을 보여줍니다.


```jsx
const URL = document.querySelector("#URL").value;
values.key = document.querySelector("#key").value;
values.value = document.querySelector("#value").value;
values.expires = document.querySelector("#expires").value;
values.maxAge = document.querySelector("#maxAge").value;
values.domain = document.querySelector("#domain").value;
values.path = document.querySelector("#path").value;
values.secure = document.querySelector("#secure").checked;
values.httpOnly = document.querySelector("#httpOnly").checked;
values.sameSite = document.querySelector("[name='sameSite']:checked").value;

axios.post(URL, values, { withCredentials: true })
	.then(res => {
		console.log(res);
		printResult(values.key, res)
		renderCookieList()
	})
	.catch(err => {
		console.error(err);
	})
```

client에서 DOM에 접근하여 값을 가져온 후 server에 요청시 `body`에 넣어 전달합니다.

```jsx
app.post('/getCookie', (req, res) => {
	const { key, value, expires, maxAge, domain, path, secure, httpOnly, sameSite } = req.body;
	const cookieName = key;
	const cookieValue = value;
	const options = {};
	if (expires) {
		options.expires = expires;
	}
	if (maxAge) {
		options.maxAge = maxAge;
	}
	if (domain) {
		options.domain = domain;
	}
	if (path) {
		options.path = path;
	}
	if (secure) {
		options.secure = secure;
	}
	if (httpOnly) {
		options.httpOnly = httpOnly;
	}
	if (sameSite) {
		options.sameSite = sameSite;
	}
	try {
		res.cookie(cookieName, cookieValue, options)
		res.status(200).send({
			options
		})
	} catch (error) {
		res.status(500).send(error.message)
	}
})
```

server는 express.js로 아주 간단하게 작성했습니다. 요청객체 `body`에 있는 값으로 Cookie의 옵션을 지정해준 후 응답객체에 전달해 유저에게 Cookie를 발급합니다.

- 테스트 하기
    - `POST - api.checkintest.42cadet.kr/getCookie` 로 요청을 보내 Cookie를 발급받습니다.
    - key, value는 `mycookie`, `42`로 통일했습니다.
    - `Set-Cookie` 헤더 실험결과
        1. `set-cookie: mycookie=42; Path=/; SameSite=Lax;`
            1. `Lax`의 경우 안전한 요청만 허용
            2. `Domain` 을 명시하지 않았음. 명시하지 않으면 Cookie가 만들어진 곳의 origin이 `Domain`([api.checkintest.42cadet.kr](http://api.checkintest.42cadet.kr/))값이 됨([참고](http://bayou.io/draft/cookie.domain.html)).
            3. server의 Cookie로 생성됨 (주소창에 [api.checkintest.42cadet.kr](http://api.checkintest.42cadet.kr/)를 입력하고 개발자도구를 보면 Cookie를 확인할 수 있습니다.)
        2. `set-cookie: mycookie=42; Path=/; SameSite=Strict;`
            1. server의 Cookie로 생성
        3. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure;`
            1. server의 Cookie로 생성
        4. `set-cookie: mycookie=42; Path=/; SameSite=Lax; httpOnly;`
            1. `httpOnly` 헤더는 javascript 접근만 못할 뿐, 현재 헤더는 1번케이스와 동일한 결과
        5. `set-cookie: mycookie=42; Path=/; SameSite=Strict; httpOnly;`
            1. `httpOnly` 헤더는 javascript 접근만 못할 뿐, 현재 헤더는 2번케이스와 동일한 결과
        6. `set-cookie: mycookie=42; Path=/; SameSite=None; httpOnly;`
            1. `httpOnly` 헤더는 javascript 접근만 못할 뿐, 현재 헤더는 3번케이스와 동일한 결과
        7. `set-cookie: mycookie=42; Path=/; SameSite=Lax; Domain=42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성
        8. `set-cookie: mycookie=42; Path=/; SameSite=Strict; Domain=42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성
        9. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure; Domain=42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성
        10. `set-cookie: mycookie=42; Path=/; SameSite=Lax; Domain=checkintest.42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성
        11. `set-cookie: mycookie=42; Path=/; SameSite=Strict; Domain=checkintest.42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성
        12. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure; Domain=checkintest.42cadet.kr;`
            1. `Domain` 설정으로 인해 client의 Cookie로 생성
        13. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure; Domain=naver.com;` 🚫
            1. SameSite가 아니므로 invalid함으로 생성 불가
        14. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure; Domain=seoul.42cadet.kr;` 🚫
            1. server의 URL은 `api.checkintest.42cadet.kr`임. 부모 도메인(`checkintest.42cadet.kr`, `42cadet.kr`)이 아니므로 생성 불가
        15. `set-cookie: mycookie=42; Path=/; SameSite=None; Secure; Domain=seoul.api.checkintest.42cadet.kr;` 🚫
            1. server의 URL은 `api.checkintest.42cadet.kr`임. 부모 도메인이 아니므로 생성 불가

### **문제를 제대로 해결할 방법들**

미숙하게 알고있어 임시방편으로 대처한 방법대신 제대로 대처하기 위해 Cookie에 대해 자세히 찾아보았고 [문서](https://42cadet.atlassian.net/wiki/spaces/CHKN/pages/24051841/Cookie)에 정리했다. 그 이후 해결방법들을 정리해보았습니다.

#### **도메인 변경으로 문제해결하기**

기존에 발생한 문제는 prod환경의 server url과 client url이 첫번째 서브도메인을 다른값으로 쓰고 있어서 발생했습니다. 그 부분을 해결방법으로 접근해봤습니다.

**A. server URL을 client URL의 서브도메인으로 설정한다.**

- `https://api.checkin.42seoul.io` → `https://api.cluster.42seoul.io`
- 기존에 server URL인 `https://api.checkin.42seoul.io`은 Cookie의 `Domain`을 `cluster.42seoul.io`으로 설정할 수 없습니다. 위와 같이 바꾼다면 client URL이 server URL의 상위도메인이 되면 Cookie의 `Domain`설정을 `cluster.42seoul.io`으로해도 정상발급됩니다. ([참고](https://stackoverflow.com/questions/1062963/how-do-browser-cookie-domains-work))
- 이 경우는 AWS Route53 서비스에서 URL을 변경시켜야되며 기존에 사용하는 42API callback url 수정, 환경변수 수정들을 수정해줘야합니다.

**B. client URL을 server URL의 상위도메인으로 설정한다.**

- `https://cluster.42seoul.io` → `https://checkin.42seoul.io`
- A와 비슷하지만 이 부분은 client URL을 수정하는 방식입니다.
- 이 경우 또한 AWS Route53 서비스에서 URL을 변경시켜야되며 기존에 사용하는 환경변수 변경 등 수정해줘야 할 부분이 여러가지입니다.
- 또한 이미 사용중인 카뎃들의 기기에는 `https://cluster.42seoul.io`로 저장되어있기 때문에 이슈가 생길게 뻔했습니다.

#### **Cookie를 구별하여 해결하기**

Cookie를 환경별로 구별하면 사이드이펙트를 없엘수 있지 않을까 생각하여 구별할 방법을 생각해보았습니다.

**C. Cookie의** `key`**값을 환경에 따라 다르게한다.**

- prod
    - `w_auth` (유지)
- dev
    - `w_auth_dev`
- Cookie의 `Domain` 설정을 둘다 `42seoul.io`로 해도 key값이 다르기 때문에 두 Cookie가 공존해도 prod, dev환경 모두 정상적으로 작동하게됩니다.
- 이 경우는 frontend, backend 두곳 다 Cookie의 key값을 환경변수화하고 앞으로 관련된 코드에서 모두 문자열을 하드코딩하는대신 환경변수를 사용해야합니다.

**D. Cookie의 속성으로 구별하기**

- Cookie가 제공하는 설정값 중 구별할 수 있는 속성이 있다면 가능하지 않을까? 라고 찾아봤지만 frontend에서 Cookie를 저장할 때 단순 key-value로 이루어진 문자열로 저장하기 때문에 불가능했습니다.

```jsx
console.log(document.cookie);
"confluence.user.history=cf30e014-b3d8-43ef-bc55-892d0fda2aed; atl.xsrf.token=8329919a02d9c33f1fb1f78e3ee628f3588af; ajs_anonymous_id=%221af909b9-98cb-43ef-a44f-51f892421ce9%22; ajs_group_id=null; atlassian.xsrf.token=7c8b114c-132d-419d-b3cd-bb62ea5fc18e_c97dba15b6c874d14e9246e9f1385e8fd6c82_lin"
```

**해결책C가** prod환경에 가장 적은 영향을 끼치면서 가장 적은 코드로 해결할 수 있는 방법이라고 생각됩니다.

### **이슈에 대한 회고**

- 특정 기술을 사용할 때 구글링을 통해 아이디어나, 지식을 얻어 깊은이해없이 사용하는것이 습관화되어있어 발생한 일이라고 생각됩니다. 기존에 습관은 버리고, 인터넷에서 돌아다니는 문제해결방법을 사용할 때 깊은 이해를 가지고 사용하는것을 습관으로 가져야할거같습니다.
- [12 Factor](https://12factor.net/ko/dev-prod-parity) 문서는 애플리케이션이 Cloud 환경에서 올바르게 게 동작하기 위해서 지켜야 하는 12가지 규칙을 정리고있습니다. 이 문서에서 에서 보았듯, dev와 prod는 환경을 최대한 일치시키는것이 좋은것같습니다. 이 내용이 피부와 와닿는 경험이였습니다.

읽어주셔서 감사합니다!
