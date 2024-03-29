---
author: [padawanr0k]
title: node.js 서버에서 로그를 남겨보자
date: 2021-08-20
tags: ["42seoul"]
layout: post
image: ../../../img/log.png
keywords: [node.js, 로그, cls-tracer]
---

## 서비스에서 로그란?

- **로그**는 프로그램에서 발생하는 이벤트에 대한 기록이다.
- ex)
    - 서비스 수준에서 일어나는 상태변화나 유저의 행동에 대한 기록들
    - 유저의 아이템 구매, 사용 등

## 로그에는 무엇을, 언제, 어떻게 남겨야할까?

### **날짜/시간을 반드시 남길 것**

- 로그의 단서는 대부분 `날짜` 와 `키워드` 이다. 그리고 날짜와 시간을 남기게 되면 시간의 흐름에 따라서 추적할 수가 있다. 또한 시간을 작은 단위로 보게 되면 로그와 로그 사이의 시간의 간격을 문제가 있을 때 볼 수 있게 된다.

### **단서를 남길것**

- 빨리 찾기 위한 단서
    - 거래ID나 주문ID를 남겨서 해당 거래ID 기준으로 사용자의 로그를 찾을 수 있도록 해야한다. (도메인마다 다를 수 있음) 결제쪽에서는 거래ID를 대부분의 로그에 남겨서 해당 거래ID를 가진 사용자가 어떤 행위를 하고 어떤 단계를 거쳐서 결제 혹은 오류가 났는지를 빠르게 파악할 수 있게 하고있다.

### **데이터가 변하는 시점에 남길 것**

- 외부 API를 통해서 데이터를 가져오거나(생성), 데이터를 보내기 위해서 암호화를 하거나, 혹은 복호화를 하거나 하는 시점에는 반드시 원본데이터와 변조된 데이터를 남겨야 한다. 그리고 다른 캐릭터셋으로 바꾸거나 하는 시점에도 반드시 남겨야 한다.
    - 문자열을 암호화하는 로직이 있다고 생각하자 `A` → `Dw02ax9` 변하기 전, 변한 후에대한 내용을 남기지 않게되면 데이터가 이미 변해버렸기때문에 찾기도 힘들것이고, 이유도 알기 힘들것이다.

### **로그남기는 행위 자체에서의 에러 조심**

- 언어마다 특정 문법오류로 인해 에러가 발생할 수도 있기때문이다.
    - ex) 파이썬
        - `logger.debug("tid : " + tid)` 코드에서 `tid` 가 `None` 인 경우 오류발생
        - 이런 경우 따로 자신만의 logger.debug 등을 활용한 wrapper 클래서를 만들거나 항상 `str()` 로 감싸거나 하는 방법이 필요하다.

### **좋은 로그란?**

- 보편적인 개념
    1. 필요한 정보가 있다.
    2. 의미가 명확하다.
    3. 편리하게 데이터를 얻을 수 있다.
- 목표가 있는 로그를 작성해야한다.
    1. 목표 정하기

        ex) 인기 물품 집계가 필요하다

    2. 지표 고민하기

        ex) 카테고리, 연령대, 성별

- 일관성이 있는 로그를 작성해야한다.
    - 비슷한 항목에 대해 로그를 남길때, 구성하는 지표들을 일관성있게 통일하는게 좋다.

        ex) 게임에서 아이템의 획득 로그, 사용 로그

## 로그 구성하기

나는 아래 내용들을 로그에 추가하기로 했다.

- 이벤트 발생시각
- 요청 Method
- URL
- **UUID**
- 출력할 문자열

### **UUID는 왜 사용하는가?**

> 주로 분산 컴퓨팅 환경에서 **사용되는 식별자**이다. 중앙관리시스템이 있는 환경이라면 각 세션에 일련번호를 부여해줌으로써 유일성을 보장할 수 있겠지만 중앙에서 관리되지 않는 분산 환경이라면 개별 시스템이 id를 발급하더라도 유일성이 보장되어야만 할 것이다. 이를 위해 탄생한 것이 범용고유식별자 UUID (Universally Unique IDentifier) 이다.

- 예: `550e8400-e29b-41d4-a716-446655440000`

만약에 3명의 사용자가 서버에 요청을 동시에 보냈다고 해보자.

- ex) 해당 서버는 `hello world` 를 비동기적으로 출력하는 기능을 가지고 있다. 각 사용자들은 `request.body`에 본인들의 번호를 전달한다. 그리고 서버는 모든 요청에 대해 `request.body`를 출력하는 미들웨어를 사용중이다.
- Request
    - CLIENT 1: curl [http://localhost:3000](http://localhost:3000/)
    - CLIENT 2: curl [http://localhost:3000](http://localhost:3000/)
    - CLIENT 3: curl [http://localhost:3000](http://localhost:3000/)
- log

    ```
    req.body : {num: "1"}
    req.body : {num: "3"}
    hello world
    req.body : {num: "2"}
    hello world
    hello world
    ```

    위와 같이 출력될 경우 누가 어떤 요청을 했고, 전달한 값과 그로 인해 반환받은 값이나 생성된 값들을 알기 힘들다. 이를 위해 UUID라는 고유한 값을 각 request 객체에 지정하여 로그에 남기게되면 추적이 쉬워진다.

    ```
    [request-id:f2fe1a9e-f107-4271-9e7a-e163f87cb2a5]: req.body : {num: "1"}
    [request-id:dd20szec-d125-6221-as1a-asd1235ajs9d]: req.body : {num: "3"}
    [request-id:f2fe1a9e-f107-4271-9e7a-e163f87cb2a5]: hello world
    [request-id:d3a323a9-32cb-453b-a0f0-e36c65ff411e]: req.body : {num: "2"}
    [request-id:dd20szec-f107-4271-9e7a-e163f87cb2a5]: hello world
    [request-id:d3a323a9-32cb-453b-a0f0-e36c65ff411e]: hello world
    ```

    UUID로 인해 어떤 요청으로 인해 어떤 콘솔이 찍혔는지 알기 쉬워졌다.

### **node.js에서 로그에 UUID남기기**

### UUID를 실행될 함수에게 건내주기

`app.ts`

```tsx
const app = express()
const uuidv4 = require('uuid/v4')

app.get('/user', function (req, res) {
  req._id = uuidv4(); // generate and store a request id
  logger.info(`Started request handling, request id: ${req._id}`)
  userService.getUser(req.query.id)
})
```

위 간단한 예시에서는 로그를 컨트롤러 단계에서 1번만 남겼다. 하지만 userService내부에서 여러 작업이 이루어 지고 그 중간에도 로그를 남기고 싶으면 어떻게 해야할까?

```tsx
const app = express()
const uuidv4 = require('uuid/v4')
const userService = require('./service/user')

app.get('/user', function (req, res) {
  req._id = uuidv4(); // generate and store a request id
  logger.info(`Started request handling, request id: ${req._id}`)
  userService.getUser(req.query.id, req._id)
})

// service/user.js
const getUser = (userId, traceId) => {
  ...
  logger.info(`get user infomation of ${userId}`)
  ...
}

module.exports = {
  getUser
}
```

지금은 깊이가 1단계 증가했지만, 서비스 내부에서 데이터베이스에 접근하는 코드가 있고 그 내부에서도 쿼리나, 반환값 같은걸 로그로 남기고 싶다면 또 그 함수에게 `traceId`를 전달해야한다. 점점 중복되는 코드가 많아질 것이고, 코드는 더 길어지게된다.

좀 더 좋은 방법이 없을까?

### UUID를 어디에서나 호출해서 가져오기

JVM이나 Java servlet 같은 경우는 멀티 스레드와 블로킹 I/O 기반으로 되어있어, 각 HTTP request에 대해서 스레드풀을 만들어 요청을 해결한다.([TLS](https://dev-jj.tistory.com/entry/Java-ThreadLocal-%EC%9D%B4%EC%9A%A9%ED%95%98%EA%B8%B0) 참고) 각 request가 분리된 스레드에서 처리되다보니, 스레드의 식별자를 로그에 고유값으로 넣으면 이 문제가 해결된다. ([stackoverflow 답변](https://stackoverflow.com/questions/3294293/how-to-get-thread-id-from-a-thread-pool))

node.js는 단일 스레드상에서 [이벤트 루프](https://ingg.dev/js-work/#run)를 기반으로 작동하는 특성때문에 위 경우처럼 스레드의 식별자를 전달하는 것은 의미가 없다. 대신 node.js에서는, Continuation-Local Storage (CLS)라는 대안이 존재한다.

Continuous-Local Storage는 스레드 프로그래밍에서 thread-local-storage 처럼 작동하지만, 스레드 대신 노드 스타일의 콜백 체인을 기반으로 한다.

[clr-rtracer](https://github.com/puzpuzpuz/cls-rtracer)는 CLS 기반 request id 생성을 구현하고 호출 체인 어디에서든 request id를 얻을 수 있는 Express 및 Koa용 미들웨어를 제공한다. 내부적으로는 node.js 14+ 부터지원하는 [AsyncLocalStorage](https://nodejs.org/api/async_context.html)를 사용하고 있다.

`app.ts`

```tsx
const app = express();
app.use(rTracer.expressMiddleware()); // 미들웨어를 추가한다

```

`logger.ts`

```tsx
import { dailyfile } from 'tracer';

const logger = {
  ...
	info (...trace) {
		logger_info.info(rTracer.id(), trace); // 이제 trace용 id를 로거를 호출하는 곳으로 부터 받을 필요가 없다.
	}
};

export default logger;

```

 사용예시

```tsx
async checkIn(req, res, next) {
	const user = req.user;
	const { cardId } = req.params;
	logger.info(`user id: ${id} cardId: ${cardId}`); // 단순히 출력하고 싶은값만 전달하면된다.
	...
}
```

이런식으로 로그에 UUID를 남기면 추적하기 더 편하다.
<img src="https://i0.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/08/log.png?ssl=1" style="width:100%">

같은 API를 두번 호출했을때 남겨진 로그의 예시이다. 서로 다른 파일에서 로그를 남기는 함수가 호출됐지만 같은 UUID를 확인할 수 있다. 또한 첫번째 호출되었을 때와 두번재 호출되었을 때의 UUID가 다른걸 확인할 수 있다.

## 로그 레벨

보통 로그를 남길때 로그의 중요도에 따라 레벨을 부여한다.

- TRACE > DEBUG > INFO > WARN > ERROR > FATAL

### **TRACE**

- 디버그 레벨이 너무 광범위한 것을 해결하기 위해서 좀 더 상세한 이벤트를 보여주기 위해 사용한다.

### **DEBUG**

- 개발시 디버그하는 용도로 사용한다.
- 배포환경에서 INFO레벨로 올려서 사용하기도 한다.

### **INFO**

- 상태 변경과 같은 정보성 메시지를 나타낸다.
- ERROR와 반대로 **명확한 의도**가 있는 로그들이 모두 INFO 레벨로 판단하자
    - 예를 들어 서비스 동작에 관한 예로 사용자의 상태(등록, 휴면, 해지)를 얻는 API가 있는 경우 사용자 서비스의 findById 만으로 구현을 한다면 다음과 같다.

        ```tsx
        function action() {
            const user = userService.findById(userId)
            log.info("User is ${user.status} status (userId: $userId)")
            return user.status
        } catch (e) {
            log.info("User is not exist (userId: $userId)")
            return UserStatus.NOT_REGISTERED
        }
        ```

### **WARN**

- 프로그램의 실행에는 문제가 없지만, 향후 시스템 에러의 원인이 될 수 있는 경고성 메시지를 나타낸다.
    - ex) 서버에 가해지는 부하가 한계값에 근접했을 때

### **ERROR**

- 명확한 에러인 경우 남기자
- 서비스에 치명적이므로 나에게 알릴 수단이 필요하다 (ex. 슬랙)

### **FATAL**

- 아주 심각한 에러가 발생한 상태를 나타낸다.

나는 이중에 `DEBUG`, `INFO`, `ERROR` 레벨만 사용하기로 했다. 너무 레벨을 많이 나누면 애매한 경계에 있는 정보들에 대해서는 사용할 때 고민을 쓸때없이 많이하게 될거같았다.

## 로그를 남기기 위한 라이브러리 tracer

```
npm install tracer --save
```

- [tracer](https://github.com/baryon/tracer)는 기능이 강력하며 쉽게 커스터마이즈가 가능한 node.js 로그라이브러리이다.
- 사용법

    ```tsx
    var logger = require('tracer').console();

    logger.log('hello');
    logger.trace('hello', 'world');
    logger.debug('hello %s',  'world', 123);
    logger.info('hello %s %d',  'world', 123, {foo:'bar'});
    logger.warn('hello %s %d %j', 'world', 123, {foo:'bar'});
    logger.error('hello %s %d %j', 'world', 123, {foo:'bar'}, [1, 2, 3, 4], Object);

    $ node example/console.js
    2012-03-02T13:35:22.83Z <log> console.js:3 (Object.<anonymous>) hello
    2012-03-02T13:35:22.85Z <trace> console.js:4 (Object.<anonymous>) hello world
    2012-03-02T13:35:22.85Z <debug> console.js:5 (Object.<anonymous>) hello world 123
    2012-03-02T13:35:22.85Z <info> console.js:6 (Object.<anonymous>) hello world 123 { foo: 'bar' }
    2012-03-02T13:35:22.85Z <warn> console.js:7 (Object.<anonymous>) hello world 123 {"foo":"bar"}
    2012-03-02T13:35:22.85Z <error> console.js:8 (Object.<anonymous>) hello world 123 {"foo":"bar"} [ 1, 2, 3, 4 ] function Object() { [native code] }
    ```

- `dailyfile()` 함수는 일자별로 로그파일을 쉽게 관리할 수 있게 해준다.

    ```tsx
    dailyfile({
    	root: '로그를 저장할 폴더위치',
    	allLogsFileName: '로그파일이름 지정', // 'test' -> 'test.20210724.log'
    	stackIndex: 1, // 로거를 사용하는곳을 알아내기 위해사용한다. 기본값 0을 사용하면 해당 코드가 존재하는 파일이름이 찍힌다.  * 1을 사용하면 한단계 위의 콜스택인 logger.ts를 사용하는 곳의 파일이 찍힌다.
    	level: 'info',
    });
    ```

## 참고

- [로그를 잘 남기기](https://blog.weirdx.io/post/50159)
- [무엇을 로그로 작성할까? 로그 목적, 방법 그리고 로그 레벨](https://blog.lulab.net/programmer/what-should-i-log-with-an-intention-method-and-level/)
- [(자막)[NDC19] 좋은 로그란 무엇인가?: 좋은 로그를 위해 고려해야 할 것들](https://speakerdeck.com/devinjeon/jamag-ndc19-joheun-rogeuran-mueosinga-joheun-rogeureul-wihae-goryeohaeya-hal-geosdeul?slide=26)
- [Node.js-애플리케이션에서 Request ID 추적하기](https://velog.io/@hopsprings2/Node.js-%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98%EC%97%90%EC%84%9C-Request-ID-%EC%B6%94%EC%A0%81%ED%95%98%EA%B8%B0)
- [How to Create a Singleton Logger in Your Server Applications with Webhooks](https://dev.to/jrdev_/how-to-create-a-singleton-logger-in-your-server-applications-with-webhooks-1k56)
- [싱글턴 패턴(Singleton Pattern)](https://webdevtechblog.com/%EC%8B%B1%EA%B8%80%ED%84%B4-%ED%8C%A8%ED%84%B4-singleton-pattern-db75ed29c36)
