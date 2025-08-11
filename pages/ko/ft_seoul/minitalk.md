---
author: [padawanr0k]
title: "[c] minitalk 과제"
date: 2021-09-03
tags: ["42seoul"]
layout: post
image: ../../img/42seoul_title.jpeg
keywords: [42서울, minitalk]
---

# minitalk
client -> server 간의 통신을 구현하는 과제이다. client 는 서버에게 문자열을 전달함, server는 문자열을 받아 출력하는데, 특이한 점은 여기서 통신이 비트개념으로 이루어져야한다는 것이다.

## 필요 사전 지식

### 허용함수

`write()`

```c
size_t write(int fd, const void *buf, size_t nbytes);
```

- `fd`
    - 파일 디스크립터. 파일에 대한 입출력시 필요한 정수값
- `buf`
    - 파일에 쓸 버퍼. 이사를 하는 경우 짐을 나르는 트럭의 역할
- `nbytes`
    - 얼마만큼의 크기의 바이트를 쓸것인지에 대한 정수값
- 반환값
    - 성공시 쓰여진 바이트 수, 실패시 음수 `-1`

`signal()`

```c
handler_t *signal(int signum, handler_t *handler);
```

- `signum`
    - 시그널의 번호
- `handler`
    - 시그널이 발생하면 핸들링할 함수 (javascript의 이벤트 리스너 같은 느낌?)

`sigemptyset()`

```c
int sigemptyset(sigset_t *set);
```

집합에서 모든 시그널을 제거

- `set`
    - 시그널 집합
- 반환값
    - 성공시 `0` 실패시 `-1`

`sigaddset()`

```c
int sigaddset(sigset_t *set, int signum);
```

집합에 시그널 추가

- `set`
    - 시그널 집합
- `signum`
    - 추가할 시그널
- 반환값
    - 성공시 `0` 실패시 `-1`

`sigaction()`

```c
int sigaction(int signum, const struct sigaction *act, struct sigaction *oldact);
```

시그널을 받아 이를 처리할 시그널 핸들러를 지정.

- `signum`
    - 시그널의 번호
- `act`
    - 시그널을 처리할 방법을 저장한 구조체
    - sigaction 구조체

        ```c
        struct sigaction
        {
            void (*sa_handler) (int); // 시그널 핸들러
            void (*sa_sigaction) (int, siginfo_t *, void *);// 시그널 핸들러로 위와 같다
            sigset_t sa_mask;// 시그널 핸들러가 동작 중 블록되는 시그널집합
            int sa_flags; // 시그널이 어떻게 처리돼야하는지를 제어
            void (*sa_restorer) (void); // 응용프로그램에서 사용용도가 아니다.
        }

        ```

- `oldact`
    - 기존에 시그널을 처리할 방법을 저장할 구조체 주소
- 반환값
    - 성공시 `0`, 실패시 `-1`

`kill()`

```c
int kill(pid_t pid, int sig);
```

`pid`에 대응하는 프로세스에 시그널(`sig`)을 보낸다.

- `pid`
    - 프로세스 id
    - 상세
        - `pid > 0`
            - 프로세스에 시그널 보냄
        - `pid == 0`
            - 특별한 프로세스를 제외하고, 프로세스 그룹 id가 시그널을 보내는 프로세스의 프로세스 그룹  id와 같은 모든 프로세스에게 시그널 보냄
        - `pid < -1`
            - 그룹 id가 pid의 절대값인 프로세스 그룹에 속하면서 시그널 보낼 권한을 가지고 있는 모든 프로세스에게 시그널 보냄
- `sig`
    - 시그널 번호

`getpid()`

```c
pid_t getpid(void);
```

- 반환값
    - 현재 프로세스의 id

`pause()`

```c
int pause(void);
```

사용한 프로세스를 block상태로 바꾸고, 그 프로세스가 사용한 쓰레드를 suspend 상태로 바꿈

- 반환값
    - `-1`

`sleep()`

```c
unsigned int sleep(unsigned int seconds);
```

- 프로그램을 일정시간동안 작업을 초단위로 대기시킴
- `seconds`
    - 대기시킬 시간
- 반환값
    - 지정된 시간이 모두 지난 경우 `0`
    - 도중에 시그널을 받아 시간이 모두 지나지 않은 경우  `the requested time minus the time actually slep`

`usleep()`

```c
int usleep(useconds_t microseconds);
```

프로그램을 일정시간동안 작업을 마이크로 초단위로 대기시킴

- `microseconds`
    - 대기시킬 시간
- 반환값
    - 성공시 `0`, 실패시 `-1`

`exit()`

```c
void exit(int status);
```

프로세스를 종료하며 권한을 운영체제에게 넘김. 프로그램으로 인해 열린 파일을 모두 닫음

- `status`
    - 상태값
    - 0 - 255(두 값 포함)
    - `EXIT_SUCCESS(0)`, `EXIT_FAILURE(1)`

### 지식

- 시그널
    - 프로세스에 무언가 발생했음을 알리는 간단한 메세지를 보내는 것
    - Signal을 받은 프로세스는 Signal에 따른 미리 지정된 기본 동작(default action)을 수행할 수도 있고, 사용자가 미리 정의해 놓은 함수에 의해서 무시하거나, 특별한 처리를 할 수 있다. (node.js 서버시작하는 부분에서 볼 수 있음)
    - 각 시그널은 시스템에 정의되어있다. ([링크](https://www.linux.co.kr/superuserboard/view.html?id=16602&code=linux&start=200&position))

- 프로세스
    - id 순차적으로 할당됨. 먼저 실행된 프로세스가 종료되어 번호가 비어있어도 그 id를 사용하지 않음
    - 가능한 최대 id 숫자를 넘어가면 1부터 사용하지 않는 번호를 찾아 할당

## 요약

- 2개의 시그널만 사용하여 데이터를 다른 터미널로 전송해야한다. → 1, 0으로 데이터 전송하는 개념

### 내가 생각한 해결방법

1. argv로 전달받은 문자열을 하나씩 8개의 비트로 바꾼다.
2. 1비트씩 전달한다.
3. 8개의 비트가 전달될 때 마다 8개의 비트를 조합해서 숫자로 만든다.
4. 숫자에 따라 출력할지 그만둘지 분기처리한다.
5. write로 출력한다.

분해와 조립이 반복되는 느낌?

### 참조

- [소켓 프로그래밍 - (10) signal함수 사용 방법](https://www.crocus.co.kr/460)
- [리눅스 시그널 함수](https://www.linux.co.kr/superuserboard/view.html?id=16602&code=linux&start=200&position)
- [함수군을-이용한-시그널-객체의-처리](https://chipmaker.tistory.com/entry/sigaction-%ED%95%A8%EC%88%98%EA%B5%B0%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%8B%9C%EA%B7%B8%EB%84%90-%EA%B0%9D%EC%B2%B4%EC%9D%98-%EC%B2%98%EB%A6%AC)
- [시그널](https://12bme.tistory.com/224)
