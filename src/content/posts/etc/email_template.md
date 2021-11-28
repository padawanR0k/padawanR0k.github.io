---
author: [padawanr0k]
title: 이메일 템플릿 작업시 미리알면 좋은 것들
date: 2021-11-28
tags: ["etc"]
layout: post
image: ../../img/email.jpeg
keywords: [이메일 템플릿]
---

## 요약
1. css는 inline으로 작성해야한다.
2. 이메일을 보는 플랫폼마다 보여지는 이메일의 모습이 제 각각일 수 있다.
3. 이메일을 템플릿을 사용할 백엔드 담당자와 커뮤니케이션하며 진행하자.

## 퍼블리싱하기
이메일 템플릿은 `<style>`태그를 지원하지 않기 때문에 태그 내부에 inline으로 작성해야한다.
```html
<span style="font-size:14px"></span>
```
또한 특정 이메일 플랫폼은 `<div>`태그를 지원하지 않는다. 보통 `<table>`, `<tr>`, `<th>`만 사용해서 레이아웃을 잡는다. 내가 사용하려는 것이 이메일 플랫폼에서 지원하는지 확인하고 싶으면 [campaignmonitor](https://www.campaignmonitor.com/css/style-element/style-in-head/)에서 확인 가능하다. 그래도 혹시 모르니 자기 자신에게 이메일 템플릿을 보내 결과물을 확인하자.

## 여러가지 꼼수들
처음 템플릿을 완성하고 자신에게 발송해보면 중앙정렬이나 너비같은 부분이 플랫폼마다 제각각이라 당황스러울것이다. 나같은 경우는 나에게 왔었던 메일들을 참고해서 그런 부분들을 개선했다. (그런데 대부분 통이미지로 해결하더라..)

### Tip

- 네이버 메일은 style로 `width`를 지정하면 `width`문자열을 제거해버린다. 어트리뷰트로 넣어야한다.
  - `<table width="180">`
- 가운데 정렬같은 경우는 `align="center"`를 사용하자
- `table`태그를 많이 중첩해서 사용하자
- 아무리 잘만들어도 강제로 모습을 변형시키는 플랫폼이 있으니 완벽을 추구하지는 말자
  - e. g. macos 기본 mail앱
- 이메일 템플릿에 동적을 바뀌어야할 부분이 있다면 백엔드 개발자에게 어떤 템플릿 엔진을 사용할 건지 물어보고, 그 부분을 해당 엔진 문법을 사용해서 바꿔주자 (변수명은 협의해서)

## 똑똑하게 작업하기
html내부에 inline으로 전부 스타일을 넣으며 수정하는건 고역이다. [inline-email](https://www.npmjs.com/package/inline-email)을 사용하면 html과 css를 따로 작성하고 명령어 하나로 합칠 수 있다. 나같은 경우는 특정폴더 내부에 있는 html파일을 한번에 inline시킬 수 있도록 쉘파일을 작성했다.
```sh
#!/bin/bash

echo "converted 폴더를 만듭니다."
mkdir -p converted
rm ./converted/*.html
for file in ./*.html
do
	echo ${file}
	inline-email ${file} --out converted/${file} --force --css style.css
done
```
사용법은 다음과 같다.

1. 템플릿 작성시 `<link>`태그로 `style.css`를 불러온 채로 작업한다.
2. 해당 파일을 `convert_inline.sh`이름으로 html파일이 있는곳에 저장한다.
3. cli에서 `./conver_inline.sh`으로 실행하면 `converted`라는 폴더에 style이 inline된채로 저장된다.
  - 권한떄문에 실행되지 않으면 `chmod 777 ./convert_inline.sh`으로 실행권한을 수정하자

## 참고
- [웹-개발자의-지옥-이메일-폼-개발하기](https://vallista.kr/2019/12/27/%EC%9B%B9-%EA%B0%9C%EB%B0%9C%EC%9E%90%EC%9D%98-%EC%A7%80%EC%98%A5-%EC%9D%B4%EB%A9%94%EC%9D%BC-%ED%8F%BC-%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0)
- [HTML Email Template 만들기](https://heropy.blog/2018/12/30/html-email-template/)
