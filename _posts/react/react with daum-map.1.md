---
title: creat-react-app-typescript 에 다음지도 적용하기
date:  2018-07-15
tags: [react, 다음 지도 api]

---

## 키 발급

[카카오 개발자사이트](https://developers.kakao.com/)에가서 가입후 키발급을 받자

## 적용하기

### 1. `public/index.html`에 다음 지도 api를 스크립트로 추가
```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=발급받은키값"></script>
```


### 2. 사용하려는 컴포넌트에 추가

```typescript
import * as React from 'react';

declare var daum:any;

class Map extends React.Component {
  componentDidMount() {
    const el = document.getElementById('map');
    let daumMap = new daum.maps.Map(el, {
      center: new daum.maps.LatLng(33.450701, 126.570667),
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="Map" id="map" style="width:1000px;height:500px"/>

      </React.Fragment>
    );
  }
}

export default Map;

```


이 때 TSlint가 daum키워드 때문에 계속 오류를 내뿜는다. 이렇게 써드파티 라이브러리를 타입스크립트에서 사용할 땐 [여러방법](http://www.albertgao.xyz/2016/08/10/how-to-use-a-third-party-library-in-typescript-with-or-without-its-type-definition-file/)으로 피할 수 있지만 간단히 `declare var someValue:any`를 사용 할 수도 있다.

리액트에는 여러 라이프사이클이 존재한다. 그 중 `componentDidMount()`은 컴포넌트가 화면에 나타나게 됐을 때 호출된다. 주로 DOM을 사용하는 외부 라이브러리 연동을 하거나 데이터를 요청하기위해 ajax요청을 하거나, DOM 속성을 읽거나 직접 변경하는 작업을 진행할 수 있다.

`... declared but its value is never read` 이 오류 메세지가 뜬다면 `tsconfig.json`파일에서 `noUnusedLocals`를 `false`로 바꾸면된다.

---

## 참고한 링크
- [누구든지 하는 리액트 5편: LifeCycle API](https://velopert.com/3631)
- [How to use a third party library in Typescript with or without its type definition file?](http://www.albertgao.xyz/2016/08/10/how-to-use-a-third-party-library-in-typescript-with-or-without-its-type-definition-file/)
- https://github.com/Microsoft/TypeScript/issues/19700
