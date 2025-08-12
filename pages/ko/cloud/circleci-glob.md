---
author: [padawanr0k]
title: circleCI에서 glob패턴 사용시 주의점
date: 2022-08-27
---

## 배경
현재 회사에서는 프론트엔드에서 유저의 행동을 트래킹할 수 있는 datadog사의 RUM을 사용중입니다.
유저의 마우스 움직임과 버튼 클릭등을 프레임단위로 저장해서 리플레이하면서 보거나, 에러 발생 타이밍을 확인할 수 있는 기능을 가지고 있습니다. (민감한 정보는 모자이크 처리되어 보여집니다)
최근, 에러 발생 위치를 코드의 어느 부분에서 발생건지 알 수 있는 기능을 사용하기 위해 리액트 프로젝트 빌드 결과물에 소스맵을 포함하도록 수정했습니다.
다만 소스맵이 자바스크립트 파일과 같이 정적으로 서비스되면 유저가 브라우저에서 직접 코드를 확인할 수 있기때문에 업로드시에는 포함되면 안되는 부분이 있었습니다.
이를 위해서 소스맵을 [`datadog-ci`](https://github.com/DataDog/datadog-ci)을 통해 데이터독에 업로드하고, 정적으로 서비스되지 않도록 삭제하는 명령을 circleCI 설정파일에 추가했습니다.

### 이슈
처음 떠오른 생각은 소스맵을 지우기 위해 실행한 명령어로 `rm -rfv ./.next/**/*.js.map` 실행하는 방법이였습니다.
`-v` 옵션을 붙여 삭제된 항목들을 출력으로 확인하고, glob패턴을 사용해 특정 함수 밑에 있는 소스맵 파일을 재귀적으로 탐색하여 삭제하려고 시도했으나 예상과 다르게 아무파일도 삭제되지 않았습니다.

### 원인

#### pathname expansion
우리는 `rm` 명령어를 사용할 때 삭제할 대상을 문자열로 전달합니다. 이 떄 double quote(`""`) 없이 사용하게 되면
쉘 상에서 해당 문자열이 pathname expansion을 거치게됩니다.
예를 들어 `foo1/A.js`, `foo1/a.txt`, `foo1/bar1/B.js`,
3개의 파일이 있다면 `rm -rf */**/*.js` 는 pathname expansion을 거쳐 `rm -rf foo1/A.js foo1/bar1/B.js` 로 변환되어 실행됩니다.

#### glob패턴과 globstar 옵션
명령어에서 사용한 glob패턴(`**/*`)은 globstar라는 옵션과 연관이 있습니다. bash쉘에서는 해당 옵션이 비활성화(`off`)되어있으면,
glob 패턴이 glob 패턴으로 동작하지 않고 단순 asterisk로써 동작하게됩니다.
이를 확인하기 위해 circleCI 설정파일에 `shopt` 명령어를 추가하여 확인을 해본결과 설정값은 `off`였습니다.
하여 위 명령어는 `./.next 하위 폴더에 있는 모든 소스맵을 지워라`가 아닌 `./.next 하위에 하위에 있는 모든 소스맵`을 지워라로 동작했던것이였습니다.

### 이슈 해결 방법
시도해본 방법은 두가지 입니다.
1. `shopt -s globstar` 명령어를 실행해주어 glob패턴이 정상작동하도록 합니다.
    - 이 부분은 불필요한 코드가 한 줄 추가된다는 단점이 있었습니다.
2. 삭제하기 위해 실행하는 명령어를 변경합니다. `find ./.next -type f -name "*.js.map" -delete -print`



### 참고
- [Why isn't my glob pattern recursing all folders? - circleCI 공식 문서](https://support.circleci.com/hc/en-us/articles/360007178074-Why-isn-t-my-glob-pattern-recursing-all-folders-)
- [What do double-asterisk (**) wildcards mean?](https://stackoverflow.com/questions/28176590/what-do-double-asterisk-wildcards-mean)
- [Does a double-asterisk wildcard mean anything apart from `globstar`?](https://stackoverflow.com/questions/37058324/does-a-double-asterisk-wildcard-mean-anything-apart-from-globstar)
- [Unable to save shopt globstar output to variable](https://stackoverflow.com/questions/54535189/unable-to-save-shopt-globstar-output-to-variable)
