---
author:
  - padawanr0k
title: 프론트엔드 에러 모니터링 - Datadog RUM
date: 2025-02-22
tags:
  - web
layout: post
keywords:
  - datadog RUM
---

## 에러 발생

에러는 잘못된 로직이 실행됐거나 코드로 의도적으로 throw 했을 때 발생한다.

catch하지 않은 에러는 브라우저 console에 console.error로 출력된다.

## 에러 스택 트레이스

잘못된 로직으로 에러가 발생된 경우 에러가 어디서 발생했는지 알려주는 stack trace 정보가 에러 객체에 포함된다.

만약  `Erorr`객체를 extends하여 만든 커스텀한 에러인 경우 stack trace가 존재하지 않는다. 이 때 에러 스택 트레이스를 남기고 싶으면 `Error.captureStackTrace()`를 사용하여 trace를 전달하여야한다. ([참고](https://stackoverflow.com/questions/59625425/understanding-error-capturestacktrace-and-stack-trace-persistance))

## 리액트에서의 에러

리액트에서는 ErrorBoundary를 통해 비동기적인 로직은 방어할 수 없으나 동기적 로직에 대한 에러에 대한 방어를 할 수 있다. ([참고](https://lilys.ai/digest/2416209/499798))

```jsx
const Button = () => {
  const [error, setError] = useState(null)
  const onClick = () => {
    throw Error('click Error') // 브라우저 콘솔에 에러가 출력되나 ErrorBoundary에 잡히지 않는다.
  }

  if (error) {
    throw Error("error"); // ErrorBoundary에 잡힌다.
  }

  return (
    <button onClick={onClick}> Click! </button>
  );
};
```

렌더링되는 UI에 영향을 끼칠 정도의 에러라면 ErrorBoundary로 핸들링하고, 그렇지 않다면 기록만 남기면 된다.

## datadog RUM 에러 모니터링

### error source

datadog RUM에 에러가 남겨지면 여러 정보가 저장된다. 여기서 에러가 어떤 것에 의해 발생했는지에 대한 분류인 [error source는 5가지 분류된다.](https://docs.datadoghq.com/error_tracking/frontend/collecting_browser_errors/?tab=npm#error-sources)

- **agent**: datadog sdk 내부 에러
- **console**: console.error가 호출됐을 때
- **custom**: RUM 라이브러리의 `addError` [API](https://docs.datadoghq.com/error_tracking/frontend/collecting_browser_errors/?tab=npm#collect-errors-manually)가 호출됐을 때 (console.error 처럼 브라우저 콘솔에 에러를 출력하지 않음)
- **report**: `ReportingObserver` API가 호출 됐을 때
- **source**: 코드 내부에서 핸들링되지 않은 에러가 발생했을 때

그렇다면 console.error로 호출하면서 `datadogRum.addError()` 도 실행시키고 있다면 중복으로 찍히는거 아닌가? 맞다.

![데이터독 럼 에러 예시](/img/datadog-rum-error-list.png)


- `datadogRum.addError()` 에 의해 custom로 기록됨
- 리액트 라이브러리 내부 console.error에 의해 console로 기록됨

### error type

error type을 통해 에러가 발생했을 때 어떤 타입의 에러인지 알 수 있다.

Javascript에 네이티브하게 내장되어 있는 에러는 [SyntaxError, TypeError, RangeError 등 다양하다.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error#%EC%98%A4%EB%A5%98_%EC%9C%A0%ED%98%95)

만약 모니터링시 특별한 오류타입으로 다루고 싶은 경우 `Error`를 확장하여 만들어 사용하면 된다.

```jsx
export class ShakaError extends Error {
  constructor(error: Shaka.util.Error) {
    super(error.message);
    this.name = 'ShakaError';
    this.message = this.getErrorMessage(error);
    this.detail = { ... };

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShakaError);
    } else {
      this.stack = error.stack;
    }
  }

  getErrorMessage(...) { ... }
}
```

여기서 `Error.captureStackTrace` 를 통해 스택 트레이스를 전달해야한다.

그 경우 확장한 Error객의 name으로 error type이 표시된다.
![datadog error type](/img/datadog-error-type.png)



### datadogRum.addError() 두번째 인자 context

`addError()`함수 실행시 두번째 인자에 추가 정보를 객체로 전달할 수 있다.

해당 값이 같이 전달된 오류의 경우 다음과 같이 에러 상세 페이지에서 Custom Attributes 섹션에서 확인할 수 있다.

![datadog rum custom attributes](/img/datadog-rum-custom-attributes.png)
context로 전달된 custom attributes도 다른 값들과 동일하게 쿼리하는데 사용할 수 있다.

`@context.errorDetail.data` 이런식으로 키값으로 그루핑하거나 필터링 가능하다.

## 에러 알람 고도화

datadog monitors 에서 RUM 에러 갯수 기준으로 트리거를 생성할 수 있다.

위 정보들을 활용해 만약 에러를 분류하고 높은 카디널리티를 가진 데이터들을 context에 넣어놨다면 단순 40개 이상 에러가 발생했을 때 에러 알람을 받는게 아니라 “영상 재생에 필요한 에셋 요청 40회 이상 실패 알람”, “XXX API 요청 20회 이상 실패 알람” 등이 가능해진다.

## 브라우저 로그 데이터독에 남기기

[@datadog/browser-logs](https://www.npmjs.com/package/@datadog/browser-logs)는 클라이언트에서도 로깅할 수 있게 해주는 데이터독 라이브러리이다. ([공식문서](https://docs.datadoghq.com/logs/log_collection/javascript/))

`forwardConsoleLogs` [옵션을 통해](https://docs.datadoghq.com/logs/log_collection/javascript/#initialization-parameters) 로깅하고 싶은 로그의 레벨을 지정할 수 있다. (log, debug, info, warn, error)

만약 `forwardConsoleLogs: ['log', 'error']`로 옵션을 설정하면 브라우저에 `console.log`, `console.error`가 출력될 때 마다 전부 데이터독에 전달된다.

RUM의 addError와 비슷하게 browser-logs 라이브러리에도 콘솔에 남기지 않지만 [데이터독에 전달하는 기능이 존재한다.](https://docs.datadoghq.com/logs/log_collection/javascript/#custom-logs)

```jsx
export class ShakaError extends Error {
  constructor(error: Shaka.util.Error) {
    super(error.message);
    this.name = 'ShakaError';
    this.message = this.getErrorMessage(error);
    this.detail = { ... };

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShakaError);
    } else {
      this.stack = error.stack;
    }
  }

  getErrorMessage(...) { ... }
}
```

이렇게 전달된 로그는 [Datadog Log Explorer](https://docs.datadoghq.com/logs/explorer/)에서 확인할 수 있다. 그리고 이 로그를 남긴 특정 유저의 RUM Session 하위 View 이벤트 타입의 Logs 탭에서 확인할 수 있다. 이를 통해 RUM에서 에러가 아닌 정보성 로그도 확인할 수 있다
![datadog view logs](/img/datadog-view-logs.png)
