---
author: [padawanr0k]
title: "[c] get_next_line 과제"
date: 2021-05-31
tags: ["42seoul"]
layout: post
image: ../../img/42seoul_title.jpeg
# keywords: [42서울, 라피신, 라피씬, 42seoul, la piscine]
---

# get_next_line
- 해당 과제는 파일을 읽어 개행을 만날때 마다 한줄씩 일어나가는 함수를 만드는 과제이다.

## 필요한 지식

### `open()`, `read()`
- 파일을 열고 읽는 함수에 대한 이해

### 파일디스크립터란?
- 리눅스, 유닉스 계열의 시스템에서 파일에 접근시 사용하는 양의 정수 값이다.
- 새로운 파일이 열릴때는 사용하지 않는 파일 디스크립터중 가장 작은 값을 가져와 사용한다.
	- 자신의 환경에서의 최대값은 `getconf OPEN_MAX` 로 확인 가능하다
- `0`, `1`, `2`는 표준입력, 표준출력, 표준에러의 파일 디스크립터로 항상 운영체제가 사용중이다
	- 서버에서 에러로그를 확인할 때 2번 파일디스크립터로 write된 로그만 확인하는 방식도 사용한다고 한다.

### 컴퓨터에서 메모리가 사용되는 구조

![메모리 구조](./memory_structure.png)
| 따배씨 - 11.2 메모리 레이아웃과 문자열

- 컴퓨터는 프로그램을 실행시킬때 메모리를 데이터를 저장하기위해 사용한다.
- 함수내부의 변수들은 스택영역에 저장되고, 동적할당된 변수는 힙영역에 저장된다.
- 함수내부의 변수들은 함수가 실행될 때, 스택형식으로 쌓였다가 사용되면서 스택에서 사라지게 된다. → 함수의 라이프사이클이 끝나면 해당 변수도 끝나게된다.
- 해당 과제에서 정적 변수를 쓴 이유는?
    - 이전에 읽었던 내용을 저장해야하기 때문에`정적변수`를 쓴다. 정적변수는 스택영역에 쌓이지않기 때문에 함수의 라이프사이클이 끝나도 데이터를 가지고 있다.
- BUFFER_SIZE값에 아주 큰 값을 주면 오류가 나는 이유는?
    - 메모리 크기는 유한하다. 전달된 값만큼 메모리를 확보해야하는데 그만큼의 메모리가 없으면 프로그램이 제대로 작동할 수 없게되는것이다.
    - 여기서 사용한 정적변수는 초기화되지 않은 정적변수여서 BSS Segment에 할당됨.
- DATA Segment 영역은 일기전용, 읽기/쓰기 전용으로 나누어져 있다.

    ```c
    char *s1[] = "test"; // 읽기 쓰기 둘다 가능
    char *s2 = "test"; // 읽기만 가능
    s2[1] = 'a'; // 오류 발갱
    ```

    - s1의 경우 메모리를 할당한것
    - s2의 경우 test라는 글자가 적힌 메모리를 가리키고 있는 것
    - 자바스크립트에서도  `s1[1] = 'a'` 이런식으로 문자열을 수정할 수 없다. v8같은 엔진에서 문자열을 다룰때 읽기전용으로만 다루기 때문에 그런듯하다.
	- 해당 과제에서는 `gcc` 컴파일러의 옵션중 `-D`를 사용을 강제한다. 해당 옵션은 전역변수를 컴파일단계에서 할당해주는 옵션이다. 위 표를 보았을 때 저장되는 영역은 DATA Segment로 보인다.


## 참고한 링크들
- [https://projects.intra.42.fr/projects/42cursus-get_next_line](https://projects.intra.42.fr/projects/42cursus-get_next_line)
- [[리눅스] 리눅스 파일 열기(OPEN), 읽기(READ), 쓰기(WRITE) 구현](https://reakwon.tistory.com/39)
- [[GetNextLine] 삽질의 기록](https://velog.io/@hidaehyunlee/GetNextLine-%EC%82%BD%EC%A7%88%EC%9D%98-%EA%B8%B0%EB%A1%9D)
- [GNL(Get Next Line) 문제 이해하기](https://epicarts.tistory.com/154)
- [NULL과 \0의 차이](https://linuxism.ustd.ip.or.kr/95)
- 테스터기
    - [https://github.com/Hellio404/Get_Next_Line_Tester](https://github.com/Hellio404/Get_Next_Line_Tester)
    - [https://github.com/harm-smits/gnl-unit-test](https://github.com/harm-smits/gnl-unit-test)
    - [https://github.com/charMstr/GNL_lover](https://github.com/charMstr/GNL_lover)
    - [https://github.com/Mazoise/42TESTERS-GNL.git](https://github.com/Mazoise/42TESTERS-GNL.git)
    - [https://github.com/DontBreakAlex/gnlkiller.git](https://github.com/DontBreakAlex/gnlkiller.git)
    - [https://github.com/charMstr/GNL_lover.git](https://github.com/charMstr/GNL_lover.git)
