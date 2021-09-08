---
author: [padawanr0k]
title: 슬랙으로 서버 에러 알림받기
date: 2021-09-08
tags: ["etc"]
layout: post
image: ../../img/logo_slack.png
keywords: [슬랙, 슬랙 알림]
---

### 알림받는 창구가 필요한 이유
나는 현재 42서울에서 클러스터 입장시 사용되는 체크인 서비스의 백엔드 담당하여 개발중이다. 최근 이 서비스에 오류가 발생되어 42서울 카뎃 중 한분이 클러스터에 입장하는데 애를 먹었고, 나는 이 오류가 발생된 사실을 6시간 후에 알았다. 그것도 오류를 경험한 분이 42서울 슬랙에 쓰레드를 올려주셔서 알게되었다...

이런 실수들을 회사가 아닌 곳에서 경험할 수 있다는게 참 좋은거같다.

물론 각 기업들은 이런 불상사를 막기 위해 다양한 모니터링이나 대처 방안들을 세워 놓았다.

1. 네이버 - [네이버 메인 페이지의 트래픽 처리](https://d2.naver.com/helloworld/6070967)
    - 네이버 메인 개발팀은 Spring Boot Actuator로 성능 지표를 수집해 지속적으로 네이버 메인 페이지의 서비스 상태를 모니터링한다. 지진 발생으로 인해 갑작스러운 트래픽 증가하는 경우에도 서비스가 중단되지 않도록 비상 대응 체제를 구축해 순간 급증하는 트래픽을 견디도록 구성해놓았다.
    - 성능 지표를 수집해 시각화해서 보여 주는 NPOT으로 네이버 메인 페이지의 상태를 모니터링한다. (NPOT은 네이버의 사내 시스템으로 Grafana 기반의 데이터 시각화 지원 시스템이라고 한다.)
    - 갑작스러운 트래픽 증가가 종종 나타난다. 그때마다 사람이 개입해서 조치해야 한다면 네이버 메인 페이지 개발자가 24시간 당번을 서야 할 것이다. 하지만 이는 물리적으로도 어려운 일이다. 네이버 메인 개발팀은 MEERCAT이라는 애플리케이션을 개발해서 애플리케이션이 스스로 트래픽을 예측해 갑작스러운 트래픽 증가를 방어하게 했다
2. 우아현 형제들 - [우아~한 장애대응](https://techblog.woowahan.com/4886/)
    - 모든 시스템에는 이상 현상을 감지할 수 있는 모니터링 시스템이 구축되어 있으며, 이 모니터링 시스템에서 탐지한 이상 현상을 즉각적으로 인지하기 위해서 Slack(슬랙)으로 알람을 발송하고 있다.
    - 장애를 감지한 순간 확인된 최소한의 정보만 정리하여 전사 슬랙에 공유한다. 이때 장애 복구와 장애 전파를 분리하여 운영하며 유저에게는 알고싶어할 내용을 전파해준다.
    - 장애는 롤백, 핫픽스, 장비 교체 등을 통해 해결한다.
    - 다시 동일한 장애가 발생하는걸 막기 위해 [5whys](https://npotoolmarket.campaignus.me/28)라는 기법을 사용하여 원인을 찾고 그에 대한 대책을 수립한다.

나는 일단 제일 간단한 알림 시스템부터 구축하려고한다.
### 슬랙 웹훅
**슬랙**은 널리 사용되는 채팅 애플리케이션이다. 많은 API를 제공하고 있으며 그 중에는 웹훅도 존재한다. **웹훅**은 이벤트로 인해 호출되었을 때 특정 행위(콜백함수)를 실행하게 하도록 할 수 있는 하나의 도구이다.

슬랙은 워크 스페이스로 공간이 구분된다. 1개의 워크 스페이스에는 여러개의 채널이 존재할 수 있다. 우리가 보낼 알림은 채널 단위로 보내는 것이다.

#### 앱 추가하기
1. [slack 사이트](https://api.slack.com/) 접속
2. 로그인 후 우측 상단 Your apps 클릭
3. Create New App 클릭 후 이름지정, 앱을 사용할 워크 스페이스 선택
4. 만들어진 App 클릭
5. 좌측 메뉴 - Feature - Incomming Webhooks 클릭
6. 우측 상단에 토글 UI를 `On`으로 변경
7. 이제 하단에 내가 POST 메소드를 통해 메세지를 보낼 수 있는 URL이 나오며 `curl`명령어를 통한  간단한 예제가 보여진다.

#### 코드
메세지를 보내는 코드는 정말 간단하다.
```typescript
import { axios } from 'axios'

const url = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
const body = {
  text: "Hello, World"
}
axios.post(url, body);
```

![슬랙 예시이미지](../../../img/slack_message.png)

슬랙은 메세지를 보낼 때 다양한 포맷을 지원한다. API문서를 보고 내가 원하는 포맷을 만들어도 되지만 슬랙에서는 UI로 포맷을 만들면 JSON으로 변환해주는 [Block kit builder](https://app.slack.com/block-kit-builder)를 제공하고 있다.

어떤 에러가 어디서 발생했는지 알기 좋게 에러메시지를 구성하자
- 에러가 발생한 파일, 해당 파일 몇번째 라인인지
- request의 고유 ID
- 에러객체 쌓인 호출 스택정보

![슬랙 블록키트](../../../img/slack_blockKit.png)
> 좌측영역에서 블록들을 중간에 드래그앤 드롭하거나, 우측영역에 JSON을 직접 수정하면 중간의 UI에 반영된다.

##### 작성한 코드
```typescript
import axios from 'axios';
import { Tracer } from 'tracer';
import ApiError from './errorHandle';

const SLACK_API = 'https://hooks.slack.com/services/';
type IError = Tracer.LogOutput & { statusCode: number; uid: unknown };

const getLine = (str: string, from: number, to: number) => str.split('\n').slice(from, to).join('\n');
const getErrorFormat = ({ stack, file, line, uid, statusCode, args, message }: IError) => {
	let errorTitle = '';
	if (args[1][0] instanceof ApiError) {
		errorTitle = args[1][0].message;
	} else {
		errorTitle = getLine(message, 0, 3)
	}

	const blockFormat = {
		blocks: [
			{
				type: 'header',
				text: {
					type: 'plain_text',
					text: `${errorTitle} (${file}:${line})`,
					emoji: true
				}
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `*id*: ${uid}\n*status code*: ${statusCode}`
				}
			},
			{
				type: 'divider'
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `\`\`\`${getLine(stack, 0, 5)}\`\`\``
				}
			}
		]
	};
	return blockFormat;
};
```
- block builder를 통해 만들었던 템플릿을 가져와 내가 필요한 부분만 동적으로 바뀌게끔 처리했다.

```typescript
export const sendErrorMessage = (error: IError) => {
	const body = getErrorFormat(error);
	axios.post(`${SLACK_API}${process.env.SLACK_WH_MONITOR}`, body);
};
```

- 이제 사용하는 곳에서 에러객체만 보내면 된다.
- 아래 이미지는 실제 예시이다.

![실제 블록 메시지](../../../img/slack_message_ex.png)

### 참고
- [slack 을 이용한 모니터링 알림 구축하기](https://devhaks.github.io/2019/12/31/slack-api/)
- [Sending messages using Incoming Webhooks](https://api.slack.com/messaging/webhooks)
- [MDN - Error](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error)
