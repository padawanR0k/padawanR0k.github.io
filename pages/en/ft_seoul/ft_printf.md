# [EN Translation Placeholder] ft_print

---
author: [padawanr0k]
title: "[c] ft_printf 과제"
date: 2021-07-31
tags: ["42seoul"]
layout: post
image: ../../img/42seoul_title.jpeg
---

# ft_print
- 해당 과제는 `stdio.h`헤더에 존재하는 `printf()`함수를 구현하는 과제이다.
  - 최근 과제 업데이트로 인해 난이도가 많이 너프되었다...
    - 필수구현 항목이 서식지정자(`csdiupxX%`) + 플래그(`-0.*`)에서 서식지정자(`csdiupxX%`)로 줄어들었다. (나는 보너스항목인 `-0.`까지 구현했다.)

## 필요한 지식

### c에서 가변인자 사용하는법
- c언어에서는 함수를 선언 후 사용할 때 인자의 갯수와 타입을 맞추지 않으면 컴파일이 되지않는다. 가변인자는 인자의 갯수가 변할 수 있는 함수를 작성 위해 사용된다.
- 함수에서 인자를 작성하는 부분에 `...`파라미터를 사용하면 args뒤로 여러개의 인자를 받을 수 있다. 단, `...` 뒤에는 아무것도 올 수 없다.

```c
#include <stdio.h>

// args는 고정 매개변수
void printNumbers(int args, ...)
{
    printf("%d ", args);
}

int main()
{
    printNumbers(1, 10);
    printNumbers(2, 10, 20);
    printNumbers(3, 10, 20, 30);
    printNumbers(4, 10, 20, 30, 40);

    return 0;
}
```
> javascript에서 [rest parameter](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/rest_parameters)가 `...`로 쓰이는 이유가 이런데에서 영향을 받아서이지 않을까?

### 헤더파일 \<stdarg.h\>
- `va_start(va_list arg_ptr, prev_param)`
  - 가변인자를 받을 포인터가 첫번째 가변인자를 가르키도록 초기화한다.

- `va_arg(va_list arg_ptr, type)`
  - 가변인수를 읽고, 전달받은 타입으로 변환하여 해당 값을 반환한다. 읽어진 `arg_ptr`은 다음 가변인수 위치로 주소값이 바뀌게된다.
  - 실제함수가 아닌 매크로함수이기 때문에 타입을 매개변수로 받을 수 있다.

- `va_end(va_list arg_ptr)`
  - 실제로 내부에선 아무것도 하지않는다.
  - 이후 다른 플랫폼에서 중요한 역할을 할 수도 있어서 관례적으로 넣는다고 한다.

- `va_copy(va_list dest, va_list src)`
  - `dest`에 `src`를 복사한다. `src`는 `va_end`로 초기화된 포인터이면 안된다.

### printf 기본적인 사용법
- 기본적인 서식지정자 (필수구현 항목만 구현하는 경우)
  ```c
  // 정수
  printf("%u\n", 10);      //  10: 부호 없는 10진 정수
  printf("%d\n", -20);     // -20: 부호 있는 10진 정수
  printf("%i\n", -20);     // -20: 부호 있는 10진 정수
  printf("%x\n", 10);      //  a: 부호 있는 16진수 (소문자)
  printf("%X\n", 10);      //  A: 부호 있는 16진수 (대문자)
  // 문자, 문자열
  printf("%c\n", 'a');    // a: 문자
  printf("%s\n", "Hello, world!");    // Hello, world!: 문자열
  // 포인터
  int num1;
  void *ptr = &num1;
  printf("%p\n", ptr);    // 008BFB6C: 포인터의 메모리 주소
                          // 0x8bfb6c: 리눅스, OS X에서는 앞에 0x가 붙고, A~F는 소문자로 출력
                          // 높은 자릿수의 0은 생략

  // % 기호
  printf("%%\n");    // %: % 기호 출력
  ```
- 플래그 (**보너스하는 경우**)
  - `-`
      - 결과를 왼쪽 정렬
      - 너비에 의존성을 갖는다. 의존성이 없으면 작동안함
  - `{너비}`
      - 출력할 너비를 결정함. 변수값의 출력물이 너비보다 큰 경우 아무일도 일어나지 않음
  - `0`
      - 출력하고 남는 공간을 0으로 채움
  - `.`
      - `.{n}` n 만큼 출력

- 기본 서식 지정자에 플래그, 폭, 정밀도, 길이를 조합해서 사용함
  - `%[플래그][폭][.정밀도][길이]서식지정자`
  - `%[플래그(flag)][폭(width)][.정밀도][크기(length)]서식 문자(specifier)`

    ```c
    // %d의 출력 폭을 6칸으로 지정
    // 출력할 값의 길이가 폭보다 짧은 경우 공백으로 채워진다.
    printf("%6d\n", 20);
    printf("%6d\n", 2000);

        20
      2000

    // %d의 출력 폭을 6칸으로 지정, 남는 공간은 0으로 채움
    // 출력할 값의 길이가 폭보다 짧은 경우 0으로 채워진다.
    printf("%06d\n", 20);
    printf("%06d\n", 2000);

    000020
    002000

    // %d의 출력 폭을 6칸으로 지정, 좌측정렬
    printf("%[-6d]\n", 20);
    printf("%[-6d]\n", 2000);

    [20    ]
    [2000  ]

    // %d의 정밀도를 6으로 지정, 이때 정밀도에 의한 패딩으로 인해 남은 공간은 0으로 채워진다.
    printf("%.6d\n", 20);
    printf("%.6d\n", 2000);

    000020
    002000
    ```

## 참고한 링크들
- [가변-인수-vastart-vaend-vaarg-valist](https://jangsalt.tistory.com/entry/%EA%B0%80%EB%B3%80-%EC%9D%B8%EC%88%98-vastart-vaend-vaarg-valist)
- [jseo님 notion](https://bigpel66.oopy.io/library/42/inner-circle/4#b2d6c472ef504dd8a5982df5a0d30022)
- 테스터기
  - 최신 과제에 맞춰진 테스터기 (공유해주신 sbaek님 감사합니다~)
    - [https://github.com/Tripouille/printfTester](https://github.com/Tripouille/printfTester)
    - [https://github.com/paulo-santana/ft_printf_tester](https://github.com/paulo-santana/ft_printf_tester)
    - [https://github.com/chronikum/printf42_mandatorytester](https://github.com/chronikum/printf42_mandatorytester)
  - 이전 과제에 맞춰진 테스터기
    - [https://github.com/gavinfielder/pft](https://github.com/gavinfielder/pft)
    - [https://github.com/charMstr/printf_lover_v2.git](https://github.com/charMstr/printf_lover_v2.git)
      - `-0.*` 플래그를 테스트하게되어있어서, 필요없는 부분을 지우기 위해 `diff.txt`파일을 vscode에서 정규표현식으로 걸러낸 후 확인했다.
        ```plain
        .{0,}\*.{0,}\n // * 플래그가 들어간 한줄 삭제
         P.{0,}\n // 맨앞에 공백+P로 시작한 경우 맞는 케이스여서 지우기 위해 사용

        (.{0,}\*.{0,}\n)|( P.{0,}\n) // 두 케이스 한번에 지우기 위해 사용
        ```

