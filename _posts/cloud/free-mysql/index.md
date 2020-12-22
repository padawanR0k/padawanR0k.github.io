---
title: 무료로 db서버를 사용해보자
date:  2020-12-22
tags: [mysql]
keyword: [mysql, mysql 무료, clearDB, 구름 IDE]
---

미니프로젝트를 하면서 db를 사용할 일이 생겼고, 각자의 컴퓨터 로컬에 디비 환경을 구성하기에는 환경설정에 시간을 많이 소비하게될거 같아서 온라인에 db서버를 구축하기로함. 돈쓰기는 아까워서 어려 무료서비스들을 찾아봤다.

## 1. heroku ClearDB

heroku 에서는 ClearDB 애드온을 제공한다애드온 추가만하면 DB서버를 자동으로 생성해준다. 사용자는 url, hostname, password등만 입력하면 바로 사용할 수 있다.

- 생성방법
    1. [heroku](https://dashboard.heroku.com/) 로그인
    2. [dashboard](https://dashboard.heroku.com/apps)로 이동
    3. 우측상단 `new`   - `Create new App`
    4. 이름 입력후 생성
    5. 해당 앱의 `Resources` 탭 클릭
    6. `Add-ons` 에서 clearDB 검색 후 클릭
    7. `Settigs` 탭 - Config vars의 `Reveal Config Vars`  클릭하면 연결가능한 URL이 나옴
        1. 해당 주소는 `mysql://[user name]:[password]@[Host name]/[password2]?reconnect=true`  형태임
        2. mysql workbench에서 연결할 경우  아래와 같이 입력

            ```java
            Connection Name : [ password2 ]
            Host name : [ host name ]
            User name : [ user name ]
            Password : [ password ]
            ```

    8. 끝

### 후기

- 설명도 잘되있고, 만들기도 엄청 쉽지만 매우 매우 매우 느리다.

## 2. 구름 IDE

구름에서는 클라우드상에서 개발할 수 있는 환경을 [구름 IDE](https://ide.goorm.io/)로 제공해준다.  프리티어도 가상 컨테이너를 생성할 수 있다.

- 생성방법
    1. [구름 IDE 로그인](https://ide.goorm.io/my)
    2. [컨테이너](https://ide.goorm.io/my)로 이동
    3. `새 컨테이너 생성` 클릭
    4. 본인의 개발환경 설정 후, `추가 모듈/패키지` - `MySQL 설치` 체크 후 생성
    5. 생성된 컨테이너에서 `service mysql start` 입력
    6. 권한 주기

        ```java
        GRANT ALL PRIVILEGES ON * . * TO 'root'@'localhost';
        FLUSH PRIVILEGES;
        ```

    7. 환경변수 수정하기
        1.  `vi /etc/mysql/mysql.conf.d/mysqld.cnf` 로 vim 으로 파일을 연후
        2. bind-address = 127.0.0.1 부분을 주석처리하고 `esc` - `:wq` - `enter` 로 저장
        3. `service mysql restart` 로 DB 재부팅
    8. 상단의 `컨테이너` - `포트포워딩` - 유형을 `MySQL`로 선택후 `등록` 버튼 클릭
    9. 포트포워딩으로 생성된 정보로 mysql workbench에 접속
    10. 끝

### 후기

- 속도는 빠르나 설정이 조금 복잡하다.
- 프리티어에서는 컨테이너가 항상 유지되지않는다... 컨테이너가 껏다 켜질때마다 포트포워딩한 ip가 달라진다. (이거때문에 못쓰겟다)

### 3. GCP (Google Cloud Platform)

---

AWS, Azure, GCP 클라우드 삼대장중 하나. AWS처럼 검색하면 나오는 자료들도 많고 설정도 어렵지않다. 90일간 300$를 사용할 수 있는 무료티어를 제공해준다.

- 생성방법
    1. [GCP 로그인](https://console.cloud.google.com/)
    2. 좌측메뉴중 `SQL` 클릭
    3. `인스턴스 만들기` 클릭
    4. `MySQL` 클릭
    5. 좌측메뉴증 `연결`에서 승인된 IP만 접근가능하게 설정
        1. `연결` - `공개 IP` - `네트워크 추가` 이름과 ip입력후 저장
            - [내 아이피 아는방법](https://www.google.com/search?q=my+ip)
    6. mysql workbench에 접속
        - hostname : `개요` - `공개 IP 주소` 값 입력
        - port : 기본포트인 3306
        - username, password : `사용지` - `사용자 계정  추가` 클릭 후 새로운 사용자 계정 추가후 본인이 입력한 값 입력
    7. 끝

### 후기

- 따로 구글링을 안해봤을정도로 설정하는게 매우 간단하면서 속도도 빠름
- 무료티어끝나기 전에 삭제해야함..

---

AWS의 프리티어를 쓰기에는 아까워서 AWS로는 해보지 않았다.

### ref

- [https://velog.io/@anrun/Heroku-MySQL-Heroku-ClearDB-사용하기](https://velog.io/@anrun/Heroku-MySQL-Heroku-ClearDB-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)
- [구름IDE 에서 MySQL 사용하기](https://www.notion.so/db-d829d575e847421cb256da259e466185)