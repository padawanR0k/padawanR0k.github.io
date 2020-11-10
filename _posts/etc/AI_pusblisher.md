---
title: Pix2code, UI/UX 개발의 자동화
date:  2018-02-27
tags: [AI, 딥러닝, 퍼블리셔]
categories : [etc]
---

디자이너가 개발자에게 시안을 넘겨주면 개발자는 그걸 토대로 실제 작동하는 코드를 작성한다. 그 과정에서 시안과 똑같이 만드는 과정은 간단하지 않고 시간도 많이 소요된다. 하지만 앞으로 몇년 후에는 이런 작업은 AI가 대체 할 수도 있을것 같다.


# Pix2Code ?

> Pix2Code는 숙련 된 신경망을 사용하여 이미지를 코드 줄로 변경합니다. 모든 응용 프로그램 요구 사항은 GUI(그래픽 사용자 인터페이스)에 대한 타깃 디자인의 이미지입니다. 앱이 GUI를 인식하면 해당 코드가 생성됩니다.


[![video](http://img.youtube.com/vi/Fevg4aowNyc/0.jpg)](https://youtu.be/Fevg4aowNyc?t=0s)

1. 훈련된 신경망에 디자인 이미지를 제공

![](https://blog.floydhub.com/static/image_to_notebookfile-3354b407064e4d95a0217612a5463434-6c1a3.png)


2. 신경망은 이미지를 HTML마크 업으로 변환

![](https://blog.floydhub.com/generate_html_markup-b6ceec69a7c9cfd447d188648049f2a4.gif)

3. 렌더링 출력

![](https://blog.floydhub.com/static/render_example-4c9df7e5e8bb455c71dd7856acca7aae-6c1a3.png)

>이미지 출처: https://blog.floydhub.com/turning-design-mockups-into-code-with-deep-learning/


[Arxiv](https://arxiv.org/abs/1705.07962)에 발표된 논문에 따르면 현재는 코드작성에 있어서 77퍼센트의 정확도를 보여준다고 한다.



## AI가 만들어낸 HTML,CSS 예제들
- https://emilwallner.github.io/bootstrap/real_1/
- https://emilwallner.github.io/bootstrap/pred_2/
- https://emilwallner.github.io/bootstrap/real_3/
- https://emilwallner.github.io/bootstrap/real_4/
- https://emilwallner.github.io/bootstrap/pred_5/

> 생각보다 괜찮아서 충격...

## 흐음...
아직은 개발자가 만든 결과물보다는 뒤떨어지긴 한다. 하지만 알파고가 수많은 학습끝에 이세돌을 이겼듯, GUI 프로그래밍도 언제 인간을 뛰어넘을지 모른다.
만약 미래에 pix2Code의 정확도가 높아지고 웹표준, 웹접근성까지 맞춰서 코딩이 되어서 나온다면, 정말로 웹퍼블리셔라는 직업이 사라질 수 도 있을것 같다.

# Reference
- [turning-design-mockups-into-code-with-deep-learning](https://blog.floydhub.com/turning-design-mockups-into-code-with-deep-learning/)
- [Pix2Code: Automating Front-End development](https://medium.com/@thoszymkowiak/pix2code-automating-front-end-development-b9e9087c38e6)
- 깃허브 - [pix2code: Generating Code from a Graphical User Interface Screenshot](https://github.com/tonybeltramelli/pix2code)