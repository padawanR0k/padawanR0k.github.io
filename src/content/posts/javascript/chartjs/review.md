---
author: [padawanr0k]
title: chart.js 사용 경험 메모
date: 2021-11-20
tags: ["javascript"]
layout: post
image: ../../../img/chartjs-logo.png
keywords: [chart.js]
---

### 문서

- [chart.js 공식 문서](https://www.chartjs.org/docs/latest/)

    chart.js는 canvas내부에 차트를 시각화해주는 라이브러리이다.

    - [차트예시들 모음](https://www.chartjs.org/docs/latest/samples/bar/vertical.html)
        - chart.js로 만들 수 있는 차트 예시들 확인 가능
    - [상세 API 문서](https://www.chartjs.org/docs/latest/api/)
        - api들을 사용할 때, 프로퍼티나 메소드에 대해서 설명과 인터페이스 제공

### 사용방법

```jsx
new Chart(DOM, {
  type:  'bar', // 어떤 형태의 차트를 그릴 것인지
  plugins: {}, // 차트내부에 있는 노드에 부가적인 기능을 추가할 수 있는 설정
  data: {
	  labels: [], // x축에 표시할 범례
    datasets: [{ // 데이터들
      label: '', // 해당 데이터의 이름
      data: [], // 실제 시각화를 위한 수치 데이터들
    }],
  },
	options, // 제공하는 기능을 제어할수 있는 객체
});
```

- 만약 2021년 대한민국의 월 평균 온도를 차트로 나타내고 싶은 경우라면

    ```jsx
    data: {
    	  labels: ['1월', '2월', ..., '12월' ],
        datasets: [{
          label: '대한 민국 평균 온도',
          data: [-1, 4, ..., 7],
        }],
      },
    ```

- 만약 2021년 대한민국 각 도의 월 평균 온도를 차트로 나타내고 싶은 경우라면

    ```jsx
    data: {
    	  labels: ['1월', '2월', ..., '12월' ],
        datasets: [
    			{
    	      label: '경기도',
    	      data: [-1, 4, ..., 7],
    	    },
    			{
    	      label: '강원도',
    	      data: [-10, 1, ..., 2],
    	    },
    			...
    		],
      },
    ```


대부분의 차트들에 대해 어떻게 데이터와 라벨을 전달해야하는지 [차트예시들](https://www.chartjs.org/docs/latest/samples/bar/vertical.html) 문서를 보면쉽게 구현할 수 있다.

### 트러블 슈팅

- 너무 많아 화면에서 넘치는 범례 (legend)
    1. 하나의 차트에 다소 많은 데이터 종류를 보여줘야했음
    2. 각 종류마다 legend가 차트 우측에 표시되는데 일부러 짤려서 보여짐
    3. canvas내부에서는 그리지 않고, html로 그리도록 함
    4. plugins, options 설정 필요
        - [https://www.chartjs.org/docs/latest/samples/legend/html.html](https://www.chartjs.org/docs/latest/samples/legend/html.html)
    5. 주의할 점
        1. 클릭시 데이터 view 토글 이벤트를 걸어야하고 시각적으로 표시해줘야함
        2. legend item 색상과 차트의 bar색상이 통일되어야함
- 차트 내부에 hover했을 때, 보이는 툴팁의 내용을 변경하고 싶은 경우 참고해야할 문서
    - [https://www.chartjs.org/docs/latest/samples/tooltip/position.html](https://www.chartjs.org/docs/latest/samples/tooltip/position.html)
    - [https://www.chartjs.org/docs/latest/api/interfaces/TooltipCallbacks.html](https://www.chartjs.org/docs/latest/api/interfaces/TooltipCallbacks.html)
    - [https://www.chartjs.org/docs/latest/configuration/tooltip.html](https://www.chartjs.org/docs/latest/configuration/tooltip.html)
- line 차트에서 dot을 가리고 싶은 경우 (hover시에만 보임)

    ```jsx
    options: {
    	point: {
    	  radius: 0,
    	},
    }
    ```

- 데이터를 다뤄야할 때
    - 서버에서 받아온 데이터가 배열 형태이면서 chart.js에 전달하기 위한 형태로 변환하는 작업이 필요할 때, 데이터의 pk값으로 객체형태로 만들어서 다루는 것이 편하다.
    - 기간이 X축인 경우, 서버에서 받아온 데이터가 연속적이지 않다면 내가 시각화하려는 모든 기간에 대해서 dataset을 만들어주는 것이 좋다.
        - e. g. 2021-01-01 ~ 2021-01-31을 시각화하려는데, 서버에서는 주말에 대한값을 전달해주지 않음 → 주말에 해당하는 수치를 0으로 지정해서 넣어주자.
