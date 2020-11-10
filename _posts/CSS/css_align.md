---
title: CSS를 깔끔하게 작성하는법 - 1 (CSS 선언규칙)
date:  2018-01-22
tags: [css]
categories : [css]

---


# Intro

CSS에는 속성을 적을 때 순서가 상관이 없기 때문에 마음대로 편하게 적을 수 있다. (속성이 겹치는 경우는 제외)
하지만 속성의 순서를 신경을 안 쓴 채 작성된 CSS문서는 다른사람이 볼 때 특정 속성을 찾으려 할 때 불편하다.

# CSS 선언 규칙
협업을 할 때 서로서로 CSS를 마음대로 작성해서 파일을 열어 특정속성을 수정할 때 눈이 빠지게 찾는 걸 방지하기 위해 CSS선언하는 것에 대해 규칙을 세우는것이 필요하다.

Mozilla, 네이버, 다음에서는 다음과 같이 선언순서를 제안하고 있다.

## Mozilla 재단
1. display
2. list-style
3. position
4. float
5. clear
5. width / height
6. padding / margin
7. border / background
8. color / font
9. text-decoration
10. text-align / vertical-align
11. white-space
12. other text
13. content

## NAVER
1. display(표시)
2. overflow(넘침)
3. float(흐름)
4. position(위치)
5. width/height(크기)
6. padding/margin(간격)
7. border(테두리)
8. background(배경)
9. color/font(글꼴)
10. animation
11. 기타

## DAUM

1. display
2. overflow
3. float
4. position
5. z-index
6. width & height
7. margin & padding
8. border
9. font
10. background
11. 기타

## 선택은 자유
CSS를 작성하는데에는 맞다 틀리다가 없다. 이 위의 규칙을 따라도 돼고 자신만의 규칙을 만들어서 써도됀다. 다만, 다른 이가 봣을때 이해하기 쉽게 작성하자.

##  Learn more
[네이버 코딩컨벤션](http://nuli.nhncorp.com/data/convention/NHN_Coding_Conventions_for_Markup_Languages-v2.75_open.pdf)
[다음 css컨벤션](http://darum.daum.net/convention/css/css_convention)