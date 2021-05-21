---
author: [padawanr0k]
title: github action 활용기 (로또 당첨번호 수집기)
date:  2021-01-01
tags: [github]
---
## 계기

---

나는 로또를 매주 3천원씩 구매한다. 최근에 로또를 구매하면서 당첨번호에 대한 궁금증이 생겨서 찾아봤는데 1회부터 지금까지의 당첨번호를 주관사에서 제공하고 있지 않았다. 지금까지 당첨번호를 크롤링을 하여 저장하는건 쉽지만, 앞으로 당첨될 번호를 매번 업데이트하는것을 어떻게 자동화 하면 좋을지 고민하고 해결한 부분을 기록한다.

## 기능

---

1. 당첨번호를 조회해서 파일을 업데이트한다.
2. 주기적으로 실행시킨다.

### 기능 1 - 기본적인 기능

---

- 당첨번호 조회 (⚠️ 공식적인 api는 아님)
    - GET - [`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo={round}`](https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=%7Bround%7D)
- 파일에 업데이트
    - 이 부분은 [gist](https://gist.github.com/)로 해결했다. csv를 직접 생성한 후 github에서 제공하는 공식 api로 GET, PATCH를 해결했다.
    - 플로우
        1. [https://gist.github.com/](https://gist.github.com/) 에서 당첨번호 리스트를 csv로 생성한다.
        2. 생성된 gist를 secret에서 public으로 바꿔준다.
        3. gist는 고유id가지고 있고 해당 값으로 api를 활용한다.
            - https://gist.github.com/{작성자id}/{id}
        4. [GET a gist](https://docs.github.com/en/free-pro-team@latest/rest/reference/gists#get-a-gist)로 csv파일을 가져오고, [Update a gist](https://docs.github.com/en/free-pro-team@latest/rest/reference/gists#update-a-gist)로 csv파일을 수정한다.
            - 여기서 Update시에는 gist의 생성자만 가능하다. 이때문에 수정 api 호출시 본인의 github Private Access Token을 request header에 넣어줘야한다.

                `'Authorization': 'token {PAT}'`

            - 본인의 인증정보는 노출되면 안되기때문에, 로컬 개발환경에서는 `export PAT=...`로 환경변수를 지정했다. github action에서는 job을 실행시킬 때 환경변수를 해당 repository의 [Settings - Secrets]메뉴에서 설정한 값을 읽어서 할당 시킬 수 있다.

                ```yaml
                ...
                      - run: |
                          pip install -r scraping/requirements.txt
                          python scraping/main.py
                        env:
                          PAT: ${{ secrets.PAT }} # 좌측에는 job내부에서 사용될 환경변수이름을 지정하고 우측에는 본인이 Secrets에 저장한 키값을 지정하면 된다.
                ```

### 기능 2 - 자동화

---

주기적으로 특정작업을 실행하는 자동화는 소프트웨어 유틸리티인 cron을 사용한다. 예로 서비스를 운영하기위해 재결제문자 같은걸 발송할 때 사용한다. 내가 하려는 것도 주기적이기 때문에 cron을 사용했다. 마침 예전에 기술블로그에서 [github action으로 서버상태 체크하는 봇 만들기](https://ryanking13.github.io/2019/12/29/twitter-bot-without-server.html) 라는글을 봤던적이 있었고, 비슷한 개념의 활용이라 생각되서 github action을 사용하게됬다.

[github action](https://github.com/features/actions)은 소프트웨어의 워크플로우를 쉽게 자동화 해준다. 프로젝트 빌드, 테스트, 배포 등을 github 플랫폼 안에서 해결 할 수 있다.  (repository에 git push했을 때, test를 돌리고 이상없으면 deploy하는  jenkins가 하던 기능이 github 플랫폼내부에 있는것이다. 이것말고도 다양한걸 할 수 있다.)

github action는 push같은 repository의 변화를 감지해서 코드의 테스트나 배포를 담당하는 스크립트를 작동시킬 수 도 있지만, cron을 스케쥴링할 수 도 있다.

- 플로우
    - 기능1에서 작성한 코드를 repository에 push한다
    - Actions탭에서 새로운 워크플로우를 만들고 yml파일을 수정한다.

        ```yaml

        name: lotto645_crawler

        on:
          schedule:
              - cron: '55 11 * * *'
          workflow_dispatch:

        jobs:
          cron:
            runs-on: ubuntu-latest

            steps:
              - uses: actions/checkout@v2
              - name: set up python
                uses: actions/setup-python@v2
                with:
                  python-version: '3.7.6'
                  architecture: 'x64'
              - run: |
                  pip install -r scraping/requirements.txt
                  python scraping/main.py
                env:
                  PAT: ${{ secrets.PAT }}
        ```

        - `cron: '55 11 * * *'`
            - github action은 UTC 시간대기준으로 실행된다. 한국시간인 KST는 9시간 더 빠르다.
            - cron 시간대 작성은 [https://crontab.guru/](https://crontab.guru/) 을 참고했다.
        - `pip install -r scraping/requirements.txt`
            - workflow를 작동시키는 가상환경은 내 컴퓨터처럼 영구적인 환경이 아니기 때문에 매번 실행될 때마다 코드에 쓰인 패키지를 다운받아야한다. 이를 위해 `requirements.txt`에 해당 패키지 정보를 작성했다. (js프로젝트의 package.json 개념)
        - `PAT: ${{ secrets.PAT }}`
            - 코드내에서 쓰일 환경변수를 지정해준다.

## 요약

---

- 코드는 github repository에 올려서 관리, github action에 의해 주기적으로 실행된다.
- [데이터](https://gist.github.com/padawanR0k/af700e6457ef5f5a4e6543c47c7ff76d)는 gist로 관리한다.
- 간단한 기능이라도 만들어보니, CI/CD를 어떻게 수행하는것인지에 대해 조금 감이 잡힌거같다.
    - [gist 주소](https://gist.github.com/padawanR0k/af700e6457ef5f5a4e6543c47c7ff76d)
    - [github주소](https://github.com/padawanR0k/k-lotto)

### Reference

---

- [Github Action 사용법 정리](https://zzsza.github.io/development/2020/06/06/github-action/)
- [Github Actions를 이용하여 서버 없이 알림 봇 만들기](https://ryanking13.github.io/2019/12/29/twitter-bot-without-server.html)
- [Github Docs](https://docs.github.com/en/free-pro-team@latest/rest/reference/gists#update-a-gist)