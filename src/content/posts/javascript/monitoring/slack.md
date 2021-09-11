---
author: [padawanr0k]
title: Slack을 활용한 서비스 오류/장애 모니터링
date: 2021-09-08
tags: ["etc"]
layout: post
image: ../../../img/logo_slack.png
keywords: [슬랙, 슬랙 알림]
---

# 알림받는 창구가 필요한 이유

저는 현재 42서울에서 클러스터 입장에 사용하는 체크인 서비스의 백엔드를 개발하고 있습니다.

최근에 오류가 발생해서 카뎃 중 한 분이 클러스터에 입장하는데 애를 먹었고, 저는 이 오류가 발생된 사실을 6시간 후에나 오류를 경험한 분이 42서울 슬랙에 문의 메시지를 올리셔서 알게되었습니다. (이런 실수들을 회사가 아닌 곳에서 경험할 수 있다는게 참 다행…)

우선 급한대로 오류 원인을 찾아서 해결한 뒤, 발생한 오류, 원인등을 정리해서 장애보고서를 작성했습니다.

---

# 📋장애 보고서

# 경위

- 2021-09-07 14:26:00
    - 유저가 로그인을 진행하는데, 프론트URL을 벗어난 상태에서 오류가 발생하여 정상적인 페이지가 아닌 API의 response를 화면에 표시함. (이 내용으로는 유저는 오류가 발생한 원인을 당연히 알 수 없음)

오류 발생화면

![https://i1.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/09/error.png?resize=212%2C406&ssl=1](https://i1.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/09/error.png?resize=212%2C406&ssl=1)

- 2021-09-07 20:35:00
    - 뒤 늦게 슬랙 random채널에서 오류 내용을 파악함. 이후 오류 수정 후 배포

# 문제 / 대처 과정에서의 미흡했던 원인

1. 작성했던 테스트 케이스가 모든 케이스를 커버하지 못함. 특히 42 API를 통해 42인트라넷으로 리다이렉트하여 로그인하는 부분을 코드로 풀어낼 방법을 찾지 못해 그 부분은 아예 테스트 코드를 작성하지 않았었음
2. Sequelize.js에서 새로운 데이터를 INSERT하는 메소드의 사용법이 typeORM과 조금 달랐으며 그 부분을 인지하지 못함. 추가적으로 테이블마다 모델을 생성해주어야하는 부분에서 특정 컬럼의 입력 필수/선택사항을 잘못지정함
    1. Model.build() 으로 만들어진 인스턴스는 Instance.save()를 해주어야 INSERT되는 구조
    2. 모델 생성시 기본값이 지정된 컬럼이라면, defaultValue 프로퍼티를 지정해주어야함
3. 오류가 발생하는 경우 알림 시스템이 구축되어있지 않아 오류를 알아채는데 오래걸림
4. 에러로그를 읽으며 추적하기 힘든 구조로 로그가 남겨져 있음

# 재발 방지를 위한 대책

- API에서 일어나는 CRUD에 대해서 더 다양한 테스트 케이스 추가필요. 로그인 관련 테스트 케이스도 고민 필요
- 오류를 모니터링할 수 있는 슬랙 알림 필요
- 에러로그를 남기는 부분에 있어, 필요한 부분만 남기고 추적하기 쉽도록 해야할 필요가 있음

---

보고서를 작성해보며 개선점들을 정리했고, 저는 여기서 제일 간단한 알림 시스템부터 구축하려고 합니다.

# 슬랙 채널

**슬랙**은 널리 사용되는 채팅 애플리케이션입니다. 워크 스페이스로 공간이 구분되며, 1개의 워크 스페이스에는 여러개의 채널을 가질 수 있습니다. 지금 보낼 알림은 채널 단위로 보내는 것입니다.

슬랙 워크스페이스에 무료로 연동 가능한 앱이 10개이기 때문에, 비용도 비용이지만 채널을 잘게 쪼개는 것은 확인에 어려움이 있기 때문에 가능하면 공통으로 사용하는 것이 좋습니다.

아래는 채널명 작성 예시입니다.

- `#000-alarm`
    - 장애나 중요한 문제가 발생했을때 메시지를 보낼 채널
- `#devops`
    - 일반적인 시스템 운영상 기록으로 남기는 메시지를 보낼 채널
- `#dev-test`
    - 굳이 서비스나 목적을 구분할 필요가 없을는 개발서버 관련 알림 (보통 알림을 꺼놓음)

Slack 봇 알림은 대부분의 목적이 ‘모니터링’ 이기 때문에 굳이 채널 이름에 monitoring 같은 단어는 지양하고 직관적으로 한번에 이해할 수 있는 단어가 들어가는 것이 좋습니다.

# 슬랙 웹훅

**슬랙**은 많은 API를 제공하고 있으며, 그 중에는 웹훅도 존재합니다. **웹훅**은 이벤트로 인해 호출되었을 때 특정 행위(콜백함수)를 실행할수 있게 해주는 하나의 도구입니다.

### **웹훅을 위해 앱 추가하기**

1. [slack 사이트](https://api.slack.com/) 접속
2. 로그인 후 우측 상단 Your apps 클릭
3. Create New App 클릭 후 이름지정, 앱을 사용할 워크 스페이스 선택
4. 만들어진 App 클릭
5. 좌측 메뉴 – Feature – Incomming Webhooks 클릭
6. 우측 상단에 토글 UI를 On으로 변경
7. 이제 하단에 내가 POST 메소드를 통해 메세지를 보낼 수 있는 URL이 나오며 curl명령어를 통한 간단한 예제가 보여집니다.

각 채널에 메세지를 보낼 수 있는 URL은 다음과 같으며, 뒷 부분은 고유한 값으로 이루어져있습니다.

```tsx
'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
```

### **간단한 코드예제**

메세지를 보내는 슬랙의 웹훅 API를 사용하는 방법은 정말 간단합니다.

```tsx
import { axios } from 'axios'

const url = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
const body = {
  text: "Hello, World"
}
axios.post(url, body);
```

실제 메세지 캡쳐

![https://i2.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/09/ex.png?resize=506%2C128&ssl=1](https://i2.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/09/ex.png?resize=506%2C128&ssl=1)

슬랙은 다양한 메세지 포맷을 지원합니다. API문서를 보고 내가 원하는 포맷을 만들어도 되지만 슬랙에서는 UI로 포맷을 만들면 JSON으로 변환해주는 [Block kit builder](https://app.slack.com/block-kit-builder)를 제공하고 있습니다.

저는 어떤 에러가 어디서 발생했는지 알기 쉽게 에러메시지를 구성하려 했고 다음과 같은 항목들을 메세지에 포함했습니다.

- 에러가 발생한 파일, 해당 파일 몇번째 라인인지
- 각 request의 고유 ID
- 에러객체에 쌓인 호출 스택정보

![https://i1.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/09/bulder.png?resize=616%2C250&ssl=1](https://i1.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/09/bulder.png?resize=616%2C250&ssl=1)

> 좌측영역에서 블록들을 클릭하거나, 우측영역에 JSON을 직접 수정하면 중간의 UI에 반영된다. 이를 통해 내가 보낼 메세지의 형태를 미리 확인할 수 있다.

### **슬랙 알림을 보내는 코드**

```tsx
import config from '@config/configuration';
import axios from 'axios';
import { Tracer } from 'tracer';
import ApiError from './errorHandle';

const SLACK_API = 'https://hooks.slack.com/services/';

const getLine = (str: string, from: number, to: number) => str.split('\n').slice(from, to).join('\n');

class SlackAttachmentBuilder {
	color: string;
	pretext: string;
	fields: Array<Field>;
	blocks: Array<Block>;

	constructor({color, pretext}: Partial<{color: string, pretext: string}>) {
		this.color = color || '#2eb886';
		this.pretext = pretext || '';
		this.fields = [];
		this.blocks = [];
	}

	addField(field: any) {
		if (field.short === undefined) {
			field.short = true;
		}
		this.fields.push(field)
		return this;
	}

	addBlock(block: any) {
		this.blocks.push(block)
		return this;
	}

	toJSON() {
		return {
            as_user: false,
            attachments: [
                {
                    color: config.env === 'production' ? '#FF0000' : this.color,
                    pretext: this.pretext,
                    fields: this.fields,
                }
            ],
			blocks: this.blocks
		}
	}
}
```

슬랙 API에 전달될 body를 만들어주는 클래스를 간단하게 만들어보았습니다. 아래는 사용 예시입니다.

```tsx
const getErrorFormat = ({ stack, file, line, uid, statusCode, args, message }: IError) => {
	let errorTitle = '';
	if (args[1][0] instanceof ApiError) {
		errorTitle = args[1][0].message;
	} else {
		errorTitle = getLine(message, 0, 3);
	}
	const builder = new SlackAttachmentBuilder({});
	builder
		.addField({
			title: 'APP_NAME',
			value: 'checkin'
		})
		.addField({
			title: 'ENV_TYPE',
			value: config.env
		})
		.addField({
			title: 'SOURCE',
			value: `${file}:${line}`
		})
		.addField({
			title: 'STATUS_CODE',
			value: statusCode
		})
		.addField({
			title: 'ERR_STACK',
			value: statusCode
		})
		.addField({
			title: 'UUID',
			value: uid
		})
		.addBlock({
			type: 'header',
			text: {
				type: 'plain_text',
				text: errorTitle,
				emoji: true
			}
		})
		.addBlock({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `\`\`\`${getLine(stack, 0, 5)}\`\`\``
			}
		})
	const json = builder.toJSON();
	return json;
};

export const sendErrorMessage = (error: IError) => {
	const body = getErrorFormat(error);
	axios.post(`${SLACK_API}${config.webHook.alarm}`, body);
};
```

아래 이미지는 실제로 발송된 슬랙 메세지 예시입니다. 윗 부분은 Block포맷으로 보내진 내용이며, 아랫 부분은 Attachment포맷으로 보내진 영역입니다.

![https://i1.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/09/ex2.png?resize=616%2C470&ssl=1](https://i1.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/09/ex2.png?resize=616%2C470&ssl=1)

# pm2-slack

[pm2-slack](https://github.com/mattpker/pm2-slack)은 Node.js 서버를 pm2를 통해 구동시키는 경우 비정상적인 종료같은 이벤트를 감지해 슬랙으로 보낼 수 있는 pm2 모듈입니다. 이를 통해 실행중인 Node.js 프로세스가 죽거나 멈추는등의 이벤트 발생 여부도 모니터링할 수 있습니다.

### **설치**

```bash
pm2 install pm2-slack

# 슬랙 웹훅 URL 설정
pm2 set pm2-slack:slack_url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX

# 특정 옵션 끄거나 키기
pm2 set pm2-slack:log true
```

# 참고

- [slack 을 이용한 모니터링 알림 구축하기](https://devhaks.github.io/2019/12/31/slack-api/)
- [Sending messages using Incoming Webhooks](https://api.slack.com/messaging/webhooks)
- [MDN – Error](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error)

# 추가적인 정보

각 기업들은 이런 불상사를 막기 위해 다양한 모니터링을 하고 있거나 대처 방안들을 세워 놓고 있으며 몇몇 기업들은 글로서 관련정보들을 공유하고 있습니다.

1. 네이버 – [네이버 메인 페이지의 트래픽 처리](https://d2.naver.com/helloworld/6070967)
    - 네이버 메인 개발팀은 Spring Boot Actuator로 성능 지표를 수집해 지속적으로 네이버 메인 페이지의 서비스 상태를 모니터링한다. 지진 발생으로 인해 갑작스러운 트래픽 증가하는 경우에도 서비스가 중단되지 않도록 비상 대응 체제를 구축해 순간 급증하는 트래픽을 견디도록 구성해놓았다.
    - 성능 지표를 수집해 시각화해서 보여 주는 NPOT으로 네이버 메인 페이지의 상태를 모니터링한다. (NPOT은 네이버의 사내 시스템으로 Grafana 기반의 데이터 시각화 지원 시스템이라고 한다.)
    - “갑작스러운 트래픽 증가가 종종 나타난다. 그때마다 사람이 개입해서 조치해야 한다면 네이버 메인 페이지 개발자가 24시간 당번을 서야 할 것이다. 하지만 이는 물리적으로도 어려운 일이다. 네이버 메인 개발팀은 MEERCAT이라는 애플리케이션을 개발해서 애플리케이션이 스스로 트래픽을 예측해 갑작스러운 트래픽 증가를 방어하게 했다”
2. 우아현 형제들 – [우아~한 장애대응](https://techblog.woowahan.com/4886/)
    - 모든 시스템에는 이상 현상을 감지할 수 있는 모니터링 시스템이 구축되어 있으며, 이 모니터링 시스템에서 탐지한 이상 현상을 즉각적으로 인지하기 위해서 Slack(슬랙)으로 알람을 발송하고 있다.
    - 장애를 감지한 순간 확인된 최소한의 정보만 정리하여 전사 슬랙에 공유한다. 이때 장애 복구와 장애 전파를 분리하여 운영하며 유저에게는 알고싶어할 내용을 전파해준다.
    - 장애는 롤백, 핫픽스, 장비 교체 등을 통해 장애를 해결한다.
    - 다시 동일한 장애가 발생하는걸 막기 위해 [5whys](https://npotoolmarket.campaignus.me/28)라는 기법을 사용하여 원인을 찾고 그에 대한 대책을 수립한다.

읽어주셔서 감사합니다.
