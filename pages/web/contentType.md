---
author: [padawanr0k]
title: pdf 다운로드 기능을 구현하다 만난 content-type
date: 2022-01-31
tags: ["web"]
layout: post
image: ../../img/Importance-content-type-header-http-requests.png
keywords: [content-type]
---

## 찾아보게된 계기
유저가 작성한 문서를 PDF로 다운받는 기능을 구현하다가 기기마다 조금씩 다른 결과가 나오게 되어 이유를 찾게되었다.

- 상황
  - PDF를 Blob 인스턴스로 만든 후, anchor태그에 href속성으로 할당한다. 해당 태그에 `click()`메소드를 실행하면 안드로이드 폰에서는 파일을 다운로드하고, ios safari에서는 pdf를 다운받지 않고 미리보기를 보여준다.


## Content-type 이란
Content-type은 MIME 타입의 종류 중 하나이다.

### MIME 타입이란
클라이언트에게 문서를 전송할 때, 어떤 문서가 전달된것인지 알려주기 위한 메커니즘이다. 우리가 아는 문서의 종류가 다양하듯 많은 MIME 타입이 존재한다. ([참고](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types))

> 파일이 어떤 타입인지 알려주는 [매직 넘버](http://forensic-proof.com/archives/300)와 비슷하다.

예전에는 파일을 주고 받을때 ASCII로 공통된 표준을 따르기만하면 됐다. 그러나 점점 다양한 바이너리 파일들 (음악파일, 동영상 파일 등)을 보내야하는 요구사항들이 생기면서 문제없이 주고받기 위해 텍스트파일로의 변환과정이 필요해졌다. 변환된 파일이 어떤 타입인지 알려주어 클라이언트가 데이터를 받았을 때 다시 바이너리파일로 변환하고 의도한 작업이 이루어지게끔 변환된 파일 앞 부분에는 Content-type이 담기게된다.

### 구조
```
type/subtype
```
MIME 타입의 구조는 간단하다. `/`로 타입과 서브타입을 구분 한다. 대소문자는 구분하지 않지만 전통적으로 소문자를 쓴다.

## Content-type 종류
- text
  - 텍스트를 포함한 모든 문서
- image
  - 모든 종류의 이미지
- audio
  - 모든 종류의 오디오
- video
  - 모든 종류의 비디오
- application
  - 모든 종류의 이진 데이터들
- multipart
  - 서로 다른 MIME 타입을 개별적인 요소들로 이루어진 경우 사용한다. 흔히 웹개발할 때 폼 데이터를 제출할 때 다양한 파일들을 전송하기 때문에 `multipart/form-data`를 자주 사용한다.

`<video>`, `<audio>`태그의 경우 적절한 MIME 타입을 지정한 리소스만이 제대로 인식이되니 주의해야한다.


### 개발할 때 자주 마주치는 타입
- `application/octet-stream`
  - 이진 파일들에 대한 기본값이다. 이 타입으로 Content-type이 지정된 경우 브라우저들은 보통 자동으로 실행하지 않거나 실행해야할 지 묻는다. (실행하거나 다운로드)
- `text/plain`
  - 텍스트 파일에 대한 기본값이다.
- `text/css`
  - css를 link태그를 통해 불러올 때, `text/plain`으로 불러오게되면 유효한 css파일로 감지하지 못하게된다.
- `image/gif`, `image/jpeg`, `image/png`, `image/svg+xml`

## 그래서 ios safari에서 pdf를 다운로드 받게 하려면?
간단한 코드 예시이다.

```typescript
// App.tsx
function App() {
  const [blob, setBlob] = React.useState<Blob | null>(null);
  const handlerRender = (param: {blob: Blob}) => {
    if (!blob) {
      setBlob(param.blob);
    }
  }
  const handleclick = (type: string) => {

    if (blob) {
      const binary = new Blob([blob], { type });
      const fileURL = URL.createObjectURL(binary);
      const anchor = document.createElement('a');

      anchor.href = fileURL;
      anchor.download = 'test.pdf';
      anchor.click();
    }
  }

  return (
    <div className="App">
      <div style={{ position: 'absolute', left: -100, zIndex: 1}}>
      <MyDocument onRender={handlerRender} />
      </div>
      <div style={{ paddingTop: 500, position: 'relative', zIndex: 2}}>
        <button onClick={() => handleclick('application/pdf')}>application/pdf Download</button>
        <button onClick={() => handleclick('application/octet-stream')}>application/octet-stream Download</button>
      </div>
    </div>
  );
}

export default App;



// MyDocument.tsx
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const MyDocument = ({ onRender }: { onRender: any }) => (
  <PDFViewer>
    <Document onRender={onRender}>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  </PDFViewer>

);

export default MyDocument;
```
크롬의 경우 Blob의 MIME 타입을 `application/pdf`로 지정하여도 다운로드되게끔 구현해놨다. anchor태그의 download 속성의 행동을 예상대로 잘 구현해 놓은것같다. ([anchor태그의 download 속성](https://developer.mozilla.org/ko/docs/Web/HTML/Element/a#attr-download))

ios의 safari의 경우 download 속성을 무시하고 pdf 미리보기로 보여진다. 미리보기를 무시하고 다운받도록하기 위해서는 `application/octet-stream`을 지정해야한다. 이 속성은 바이너리 파일에 대한 기본타입이다. 이 타입을 지정하게되면 브라우저는 해당 파일을 실행(다운)받을 건지에 대한 시스템 컨펌모달을 띄우게 되고 `예`를 누르면 미리보기 없이 다운로드가 가능하다.

## 참고
- [MIME 타입](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
- [서버 MIME 유형을 올바르게 구성](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Configuring_server_MIME_types)
- [\<a\>](https://developer.mozilla.org/ko/docs/Web/HTML/Element/a#attr-download)
