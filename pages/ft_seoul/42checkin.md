---
author: [padawanr0k]
title: 42서울 체크인 서비스 개발기
date: 2021-07-11
tags: ["42seoul"]
layout: post
image: ../../img/42seoul_title.jpeg
keywords: [42서울]
---

# 프로젝트에 참여하게된 계기

프론트엔드로 일해봤던 경험이 있었고, 그당시 협업을 하면서 백엔드에 대한 지식이 얕다보니까 커뮤니케이션이 잘되지않거나 재활용할 가능한 코드를 작성하지 못하는 경우 종종 있었다. 이 기회에 백엔드에 대해 지식을 쌓으면 추후 백엔드 개발자와 커뮤니케이션하는데 도움이 될거같아 42 체크인서비스 팀원 모집에 신청하게되었다.

# 42체크인 서비스란?

코로나 바이러스의 여파로 인해 42서울에서는 각 클러스터마다 최대 입장인원수를 150명으로 제한하고 있습니다. 이 서비스는 각 클러스터마다 입장인원수를 파악하기 위해 개발된 서비스다.

## 주어진 미션

- 기존에 [nest.js](https://nestjs.com/)를 사용하여 개발된 코드를 [express](https://expressjs.com/ko/)로 교체하기
    - nest.js는 JAVA언어에서 가장 유명한 [Spring](https://spring.io/)과 구조가 비슷한 프레임워크이다. TypeScript의 적극적인 도입, DI(Dependency Injection), IoC(Inversion of Control), Module을 통한 구조화 등의 기술등을 통해 생산성이 향상된 개발을 할수 으나, JavaScript를 어느정도 익히지 못한 사람이 사용하기에는 러닝커브가 가파르며, 오래된 expressjs와 비교하면 관련자료의 양과 생태계도 많이 차이난다.([npm trend](https://www.npmtrends.com/@nestjs/core-vs-express))
    - 42서울에서 원활한 유지보수를 하기위해서 보다 더 러닝커브가 완만하고 자료가 많은 express를 사용하게 되었다. (javascript를 따로 배우지 않는 교육환경이기 때문에)
- 1개의 EC2에 배포된 환경을 frontend backend로 나누어 배포하기

## 실무같은 프로젝트 진행하기

실무같은 프로젝트 진행을 위해, 테스크를 관리하고 그에 대한 커밋들을 관리할 수있는 환경인 JIRA, Confluence 42서울 멘토님께서 제공해주셨다. 또한 기존에 사용하던 github대신 JIRA와 연동이 훨씬 잘되는 bitbucket로 코드 저장소를 옮겨 진행했다.

- JIRA
    - 업무를 진행하다보면 다양한 업무를 동시에 진행하게 되기도하고, 다양한 이슈를 마주치게되기도 한다. 이때 이런 부분들을 잘 관리하는것으로도 업무의 비효율을 줄일 수 있는데, JIRA는 업무와 이슈에 대해 팀원간의 **피드백**, **공유, 구체화**를 하는것을 도와주는 협업도구이다.
- bitbucket
    - JIRA의 개발사인 Atlassian에서 만든 버전 관리 저장소 호스팅 서비스이다. github보다 JIRA와 연동해서 쓰기에 더 적합하며, 연동하는데 비용이 들지않는다! (github는 Enterprise부터 가능하며 인당 $21/월)

### 자신의 일은 스스로 하자

JIRA에 큰 방향과 목적을 적어놓은 Epic 이슈를 멘토님이 먼저 작성해주셨고, 각자 파트에 맞춰 Epic 이슈를 해결하기 위해 필요한 하위 이슈들을 작성했다. 이슈들마다 내용이나 수정이 더 필요한 부분들은 멘토님이 피드백을 주시기도 했다.

처음에는 이슈를 어떻게 작성해야할지 몰라서 간단하게 큰 덩어리로 작성했다. 그러다 보니 어느 이슈만 보고 어떻게 진행되는지 알기 어려운 상태가 되었고, 멘토님은 이슈는 작은 작업 단위로 나누어져야 하며, 각 커밋메세지는 어떤 이슈로 인해 작업이 되었는지 남겨서 누가 봐도 이 프로젝트가 어떻게 돌아가고 있는지, 누가 무엇을 작업하고 있는지, 문제는 무엇인지 한눈에 알기 쉬워야한다고 조언을 해주셨다.

![https://i2.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210702-154131.png?resize=616%2C427&ssl=1](https://i2.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210702-154131.png?resize=616%2C427&ssl=1)
*멘토님이 작성한 Epic 이슈*

![https://i2.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210702-154236.png?resize=616%2C236&ssl=1](https://i2.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210702-154236.png?resize=616%2C236&ssl=1)
*Epic 이슈를 달성하기 위한 하위 이슈들 (backend)*

![https://i0.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210702-154249.png?resize=616%2C189&ssl=1](https://i0.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210702-154249.png?resize=616%2C189&ssl=1)
*Epic 이슈를 달성하기 위한 하위 이슈들 (frontend)*


![https://i0.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210702-154400.png?resize=616%2C557&ssl=1](https://i0.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210702-154400.png?resize=616%2C557&ssl=1)
*각 이슈를 클릭하면 상세내용을 볼 수 있고 해당 이슈에 대해 커뮤니케이션할 수 있는 환경이 구성되어있다.*

### 똑똑한 커밋메시지 남기기

- JIRA와 bitbucket을 연결했을 경우 커밋 메시지에 특정 문구가 있을 경우 관련된 JIRA 이슈의 상태를 자동으로 변경되도록 할 수 있으며 이 기능을 [스마트 커밋](https://www.lesstif.com/jira/jira-smart-commit-51282248.html)이라고 부른다.
- 스마트 커밋은 아래와 같은 문법을 따른다.
  - `<ignored text> <ISSUE_KEY> <ignored text> #<COMMAND> <optional COMMAND_ARGUMENTS>`
  - ISSUE_KEY
      - 이슈에 대한 KEY값이다. 커밋메세지에 ISSUE_KEY를 남기게 되면 해당 이슈 상세정보에서 커밋내용을 확인할 수 있다. 만약 어떤 이슈를 해결하기위해 여러 커밋을 남겼을 때, 코드 리뷰어는 해당 커밋들만 보면 되는것이다.
  - COMMAND
      - 이슈에 대한 상태를 업데이트할 수 있는 옵션이다. 이슈는 OPEN, IN PROGRESS, RESOLVED, CLOSED가 있다. 이 옵션을 사용하면 커밋에 대한 설명이아닌, JIRA에 대한 상태변화를 메세지에 나타내기 때문에 [좋은 git 커밋 메시지를 작성하기 위한 7가지 약속](https://meetup.toast.com/posts/106)을 지키지 못한다. 이 옵션에 대한 사용은 팀원간의 논의 후에 사용하는것이 좋을것같다.

![https://i2.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210703-034247.png?resize=616%2C367&ssl=1](https://i2.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210703-034247.png?resize=616%2C367&ssl=1)
*이슈카드와 연결된 커밋이 해당 영역에 보여진다.*


### 흠 이건 좀….

bitbucket에서는 같은 workspace를 사용하는 유저의 코드에 file또는 line별로 커밋메시지를 남길 수 있는 기능이 있다. 이 기능을 활용해 작성한 코드들에 대해 리뷰어에게 피드백을 받을 수 있다.

![https://i0.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210702-155621.png?resize=616%2C334&ssl=1](https://i0.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210702-155621.png?resize=616%2C334&ssl=1)
*내가 작성한 코드는 '이 변수는 이렇게 꼭 전달되어야만해'라는 방식의 코드였다. 이 부분에 대해 더 강한 예외처리를 하라고 조언을 해주셨다.*


### 개발시 마주친 이슈들

개발하면서 마주친 이슈들은 대체로 두가지로 인해 발생했습니다. 기술에 대해 깊게 알아보지 않고 사용했거나, 라이브러리를 필요한 부분들만 얕게 보고 사용했기때문에 발생했다. (42과제할 때 꼼꼼히 공부하는 습관을 키워야하는 이유…)

- 42 로그인 오류
    - callback url을 환경변수화하지 않고 하드코딩하다보니, 서로다른 환경에서 같은 URL을 사용하여 쿠키를 생성할 때 올바르지 않은 도메인값을 전달하여 발생했다.
- TypeORM QueryBuilder 오류
    - 프로젝트 빌드시 webpack을 사용했는데, 그로 인해 orm에서 2개이상의 테이블을 조인하여 사용하는 쿼리에서 문자열이 제대로 생성되지않아 오류 발생했습니다 (테이블이름이 webpack으로 인해 uglify되어 발생)
        - webpack optimization 옵션에서 minimize를 `false` 처리하여 해결했다.
- cookie 만료기간 설정
    - jsonwebtoken를 사용하여 토큰을 생성할 때 단순히 expiresIn 옵션만 사용하면 되는게아니라, express controller 상에서 resposne를 전달할때 res.cookie 세번째 인자에 옵션을 전달해주어야하는데 쿠키값에만 값을 전달하여 발생했습니다.
- 토큰이 생성될 때 내부에 `iat`, `exp` 값이 같이 저장된다. `iat`는 생성시각 `exp`는 만료일자를 의미한다. 시간값이 저장될때 ms가 아닌 s단위로 저장되기때문에 사용할 땐 1000을 곱해주어야 했다.
  ```typescript
  const token = await UserService.service.login(user);
  const decoded = jwt.decode(token) as any;
  const cookieOption: { domain?: string, expires: any } = {
    expires: new Date(decoded.exp * 1000)
  };
  res.cookie('w_auth', token, cookieOption);
  ```
- TypeORM Repository 사용문제
    - User Repo를 사용하는 User Serivce에서 Repo를 찾을 수 없는 문제발생
    - 코드 수정하면서 알게된 사실
        - [https://stackoverflow.com/questions/51663956/get-connection-after-bootstraping-in-express-js](https://stackoverflow.com/questions/51663956/get-connection-after-bootstraping-in-express-js)
        - TypeORM DB connection이 끝난 후에 라우팅하는 코드를 실행시켜야 라우트객체 내부 constructor에서 오류가 발생하지 않는다.
        - 객체 생성시
          ```typescript
          this.userRepository = new UserRepository()// 오류 발생
          this.userRepository = getConnection().getCustomRepository(UserRepository);  // OK

          // 여러곳에서 같은 부분을 중복되어 사용하는것을 줄이기 위해 간단한 함수로 모듈화하여 사용
          const getRepo = (repository) => {
              return getConnection().getCustomRepository(repository)
          }
          ```

### 배포를 위한 AWS 서비스에 대해 알아보자

바뀐 구조를 알아보기전에 AWS 서비스들에 대해 알아보자

- CloudFront
    - CloudFront는 AWS에서 제공하는 CDN(*Content Delivery Network*) 서비스이다.
    - CDN은 물리적으로 멀리 떨어져있는 사용자에게 더 빨리 콘텐츠를 전달하는 시스템을 말한다. 예를 들어 미국에 있는 데이터센터에서 이미지를 한국에서 다운받는 속도보다 아시아 어딘가에 있는 CDN에서 받게되면 훨씬 빠를것이다.
    - 또한 사이트를 1번이상 방문한 유저에게는 웹 콘텐츠를 캐싱하여 전달하기 때문에 사용자는 더 빠른 속도를 경험할 수 있다.
    - 업데이트 이후 유저가 새로 업데이트된 콘텐츠를 보게하려면 invalidation이라는 캐시를 날리는 작업이 필요하다.
- S3
    - 저장공간이 무제한인 웹 스토리지 서비스이다. 파일크기는 0kb 부터 5TB까지 지원하며 Bucket이라는 단위로 저장소를 구분한다. (디렉토리 개념과 비슷함)
- Route53
    - AWS 리소스(EC2, CloudFront, S3 등) 과 연동 가능한 DNS(*Domain Name System*)서비스이다.
    - DNS는 사람이 읽기 쉬운 도메인과 대응된 IP주소를 매핑시켜준다. 223.130.195.200로 접속하면 naver로 접속되는 이유는 DNS를 사용하고있기 때문이다.
- EC2
    - AWS에서 제공하는 가상 컴퓨팅환경이다. 가상화된 서버를 기반으로 탄력적으로 크기 조정이 가능한 컴퓨팅 파워를 제공해주어 필요할 때만 탄력적으로 리소스를 늘이거나 줄일 수 있다.

### 바뀐 구조

- Before
    - 하나의 EC2 환경에 frontend(react), backend(nest.js) 코드를 둘 다 업로드했었다.
    - 빌드된 react의 static 파일들을 nginx로 서빙하고있었고, backend api를 같은 origin에서 /api 라는 접미사를 붙여 호출하고 있었다. 이를 위해 nginx에서는 리버스 프록시기능을 활용했다.
    - backend 프로젝트는 빌드를 한 뒤 [pm2](https://pm2.keymetrics.io/)를 사용해 실행하였다.
- After
    - frontend
        - 빌드된 react의 static 파일들을 S3에 업로드하고, 해당 버킷에 연결된 CloundFront를 invalidation하여 캐시를 날려주는 방식으로 변경되었다.
        - backend를 분리하여 배포해서 기존에 /api라는 접미사대신 아예 다른 url로 api를 호출하게 변경했다.
    - backend
        - EC2 환경에는 backend코드만 존재하게되었으며, pm2로 빌드된 javascript를 실행하였다. 현재 nodejs가 구동되고있는 EC2는 직접적인 접근을 못하게 하기 위해 [bastion host](https://velog.io/@makeitcloud/%EB%9E%80-Bastion-host-%EB%9E%80)를 거쳐 접속이 가능하게 변경하였다.

이로써 frontend를 더 간단히 배포할 수 있게되었고, EC2 내부에서 설정했던 부분들의 복잡성을 낮추게되었다.

# 드디어 배포

- 배포는 사람들의 체크인,아웃 횟수가 일주일 중에 가장 적었던 수요일(2021-07-01 00:00:00)에 각자 집에서 zoom으로 진행되었고, 배포 과정은 다음과 같았다.

1. 기존 [http://cluster.42seoul.io](http://cluster.42seoul.io/) 와 연결된 도메인을 내립니다. ([mxtoolbox](https://mxtoolbox.com/)를 사용해서 제대로 내려갔는지 확인)
2. react로 작성된 frontend가 업로드된 S3와 연결되어잇는 cloudfront를 만들어 [http://cluster.42seoul.io](http://cluster.42seoul.io/) 를 연결한다. cloundfront에 대한 설정은 아래와 같다.
    1. Origin Domain Name에 연결할 S3을 입력해야한다.
    2. Viewer Protocol Policy 는 rediect HTTP to HTTPS를 선택한다. 일부 라이브러리나 프로토콜 같은 경우에는 보안 상의 이유로 HTTPS 환경에서만 동작하게 하는 경우가 있기 때문이다.
    3. Default Root Object 는 index.html로 설정한다. url로 접근했을때 서빙해줄 파일을 지정한다.
    4. 배포가 되는 동안 해당 cloudfront distribution의 Error Pages 탭의 Create Custom Error Response 를 설정해준다.
      ![https://i1.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210705-144202-1.png?resize=616%2C396&ssl=1](https://i1.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210705-144202-1.png?resize=616%2C396&ssl=1)
      1. 403 Forbidden, 404 Not Found 에러를 200 OK로 응답하게끔 수정한다. 해당 설정을 하지 않고 react상에서 react-router-dom을 사용해 url을 변경하게되면 cloudfront에 해당 URL의 GET 요청을 보내게되고 없는 파일에 접근시에 오류발생하게된다.
        1. 만약 별다른 설정없이 [https://example.com/checkin/1 에](https://example.com/checkin/1%EC%97%90) 접근하게되면 해당 cloudfront와 연결된 S3버킷 내부의 checkin 폴더 하위에 존재하는 1이라는 파일을 찾게되고 에러가 발생한다.
    5. 이상이 없는지 확인한다.



## 인생은 실전이다

배포가 완료되자마자 확인을 진행하였는데 테스트서버에서는 제대로 작동하는걸 확인한 부분에서 이슈가 발생했다.

- 이슈 증상
  - 유저가 42인트라넷 로그인을 완료하고, 체크인 페이지로 복귀하였을때 쿠키를 발급하지 못해, 다시 첫화면으로 되돌아간다.
- 원인
  - 개발자도구의 Application 탭에서 쿠키를 확인하였을 때, 쿠키가 아예 발급이 되지 않고 있었다.

이 부분을 확인하고 바로 코드수정을 진행하였다. 하지만 쿠키에 대한 깊은 이해가 있지 않아 50분만에 오류를 잡고 다행이 예상 완료시간이였던 01시를 10분 남기고 00시50분에 오류를 수정하고 배포할 수 있었다.

### 쿠키 발급에 대한 오류 한줄 요약

> 쿠키 발급시 Domain 옵션을 잘못지정하여 유저가 쿠키를 발급받지 못햇다.

현재 체크인서비스의 개발환경은 다음과 같다. (로컬제외)

| | 실서버 URL	| 테스트서버 URL |
|-|-|-|
|frontend|	https://cluster.42seoul.io |	https://checkin.dev.42seoul.io|
|backend|	https://api.checkin.42seoul.io |	https://api.checkin.dev.42seoul.io|

서버에서 쿠키를 전달할 때 Domain 옵션을 각 환경의 frontend URL를 가져와 `https://`을 제외한  부분으로 값을 지정했었다.

- 실서버 쿠키의 Domain 값
    - Domain=cluster.42seoul.io;
- 테스트서버 쿠키의 Domain 값
    - Domain=checkin.dev.42seoul.io;

테스트서버의 backend URL은 `api.checkin.dev.42seoul.io`이였기 때문에 정상적으로 발급이 되었고, 실서버 backend URL은 `api.checkin.42seoul.io`으로 frontend와 backend의 서브도메인이 일치하지 않았습니다. (cluster != checkin)이로 인해 브라우저에서는 쿠키생성을 거부하게되었던 것이다. 쿠키가 없는 상태로 유저의 정보를 불러오는 api가 정상적으로 작동하지 않았고, 이로 인해 계속 초기화면으로 리다이렉트가 되고 현상이 발생했다.

### 해결 방법

- 쿠키 발급시 Domain 설정값을 frontend의 URL으로 전달하지않고, .42seoul.io 로 전달하여 같은 도메인을 가진 서브도메인들이 쿠키를 공유하도록하여 해결했다.
    - [비슷한 상황의 stackoverflow 질문](https://stackoverflow.com/questions/18492576/share-cookie-between-subdomain-and-domain)

### 해치웠나…?

배포가 완료된날 아침. 클러스터로 출근을 하고 있었는데 데스크를 관리하시는분에게서 슬랙DM이 와 있었다.

![https://i2.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210703-045956.png?resize=504%2C94&ssl=1](https://i2.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210703-045956.png?resize=504%2C94&ssl=1)

![https://i1.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210703-045930.png?resize=616%2C325&ssl=1](https://i1.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/07/image-20210703-045930.png?resize=616%2C325&ssl=1)
*카뎃들이 봤었던 404화면*

다행히도 이 부분은 쉽게 원인을 파악할 수 있었다.

- 기존에는 체크인을 진행하는 화면의 URL이 변경되었다. (`/submit` → `/checkin`) 하지만 사이트를 접속했었던 사람들의 디바이스내에서는 기존 URL이 그대로 남아있었고, 그 URL로 다시 접속하게 되어 404 Not Found화면이 보여지고 있었다.
    - react 코드 내부에서 `/submit` URL로 접근시 `/checkin` URL로 리다이렉트 시키는 코드를 추가하여 해결했다.

## 1.0.0 패치노트

> 프로젝트구조는 TypeScript-Node-Starter 저장소에 올라온 코드를 참고하여 진행되었습니다.

- frontend 프로젝트의 배포를 EC2가 아닌 S3와 CloundFront를 사용하는 것으로 변경했다.
- backend 프로젝트는 기존처럼 EC2에 배포되었으나 URL이 분리되었다.
    - 이로 인해 frontend에서는 API 호출시에 요청하는 URL을 분리된 API로 요청하게끔 모두 교체하였다.
- 메인화면에서 로그인하지 않고도 클러스터의 인원을 확인할 수 있는 UI가 추가되었다.
- 메인화면 하단에 frontend의 버전정보를 노출하였다.

# 회고
다녔던 회사에서는 개발 협업자가 1명밖에 없었다. 그래서 개발문화랄게 없었고, 업무 프로세스 또한 딱히 없었다. 나는 이런 부분들에 대해 공부가 필요했었다. 이번에 완벽하게는 아니지만 멘토님의 지원으로 조금이라도 더 실제와 가까운 개발협업에 대해 알게된거같다. 정말 돈주고도 배울 수 없는 경험이 아닌가 싶었다.

42과제를 할 때처럼 내가 현재 해결해야할 문제들을 나열해보고 내가 모르는 단어가 있다면 그 단어들에 대한 이해를 위해 구글링을 해가며 정리를 했었던것이 진행하는데 도움이 많이 됐던거같다. 처음엔 어디부터 시작해야할지 막막했지만 가끔씩 멘토님이 찾아봐야할 방향을 알려주셔서 많이 헤매지 않고 진행할 수 있었다. 정말 실무같은 서비스를 운영하기엔 아직 갈길이 엄청 멀지만 앞으로도 더 노력해야겠다.
