---
title: 낯선 HTML태그들
date:  2018-07-01
tags: [HTML]
categories : [etc]
---

## `<mark>`
> Mark 요소는 특정 문맥과 관련있어서 참조 목적으로 표시된 하이라이트된 글자를 나타냅니다. 예를 들면, 검색 결과에서 검색에 대한 단어의 모든 인스턴스를 표시하기 위해 사용될수 있습니다.

### 예제
```html
<p>The &lt;mark&gt; element is used to <mark>highlight</mark> text</p>
```

### 결과
<p>The &lt;mark&gt; element is used to <mark>highlight</mark> text</p>

---

## `<meter>`
> meter 요소는 알려진 범위 내에서의 스칼라 측정 또는 분포 비율을 나타냅니다. 예를 들어 디스크 사용 현황, 쿼리 결과의 관련성, 특정 후보에 대한 투표율 등에 사용 될 수 있습니다. 이것을 게이지라고도 합니다.

***IE 사용불가***

### 예제
```html
<p>오늘의 강수확률은 <meter low="69" high="80" max="100" value="84"></meter> 입니다.</p>
```

### 결과
<p>오늘의 강수확률은 <meter low="69" high="90" max="100" value="90"></meter> 입니다.</p>

---

## `<progress>`
> 일의 진척도를 표현하기 위해 사용가능하다. max 어트리뷰트의 기본값은 1

***IE 10부터 사용가능***

### 예제
```html
<progress value="70" max="100">70 %</progress>
```

### 결과
<progress value="70" max="100">70 %</progress>

---


