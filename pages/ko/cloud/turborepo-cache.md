---
author: [padawanr0k]
title: 터보레포 캐시 트러블슈팅 - env 파일을 건드리지 말자
date: 2025-11-20
tags: ["turborepo"]
layout: post
keywords: ["turborepo", "cache"]
# image: ../../img/figma-code-connect.png
---

# 터보레포 캐시 트러블슈팅 - env 파일을 건드리지 말자

회사 데브옵스분께서 remote cache를 적용해주셔서 이전보다 CI/CD속도가 빨라졌었다. 이전보다 빨라지긴 했지만, 더 속도를 개선시킬만한 부분이 없을까 살펴보다가 마주친 이슈다.

## 1. 문제 상황: CI 빌드는 이미 빠른데, 더 안 줄어들었다

전제는 이랬다.

- 모노레포 + 터보레포 + Jenkins CI
- CI에서 Next.js / CRA 빌드를 돌리면서
    - 브라우저 소스맵을 항상 생성
    - 생성된 소스맵을 Sentry로 업로드

로컬 기준으로는 충분히 빠른데, CI 빌드는 **3분 후반대**에서 더 줄어들지 않았다. 로그를 보면 소스맵 생성과 Sentry 업로드가 눈에 띄게 오래 걸렸다.

그래서 “CI에서는 어차피 번들을 배포하지 않는데, 이걸 끄면 되지 않나?”라는 가정으로 작업을 시작했다.

## 2. 첫 번째 시도: 소스맵 생성과 Sentry 업로드를 끄기

### 2.1 Next.js (B2C)

Next.js 쪽은 설정이 단순했다.

- CI 여부를 `GENERATE_SOURCEMAP` 환경변수로 판단했다.

```tsx
// packages/b2c/next.config.js
const isCIMode = process.env.GENERATE_SOURCEMAP === 'false';

module.exports = {
	// ...
	productionBrowserSourceMaps: !isCIMode,
};
```

- 기본: `productionBrowserSourceMaps = true` → 브라우저 소스맵 생성
- CI: `GENERATE_SOURCEMAP=false` → 브라우저 소스맵 생성 X

### 2.2 CRA / Craco (Admin, B2B)

CRA는 `GENERATE_SOURCEMAP=false` 환경변수 하나로 해결된다.

Craco 설정에서 Sentry 업로드도 CI에서는 dry-run으로 돌리도록 처리했다.

```js
// packages/b2b/craco.config.js
const isCIMode = process.env.GENERATE_SOURCEMAP === 'false';

const sentryConfig = new SentryWebpackPlugin({
  // ...
  dryRun: process.env.REACT_APP_ENV === 'local' || isCIMode,
});

```

겉으로만 보면 여기까지는 “정상적인 최적화 작업”이었다. 그런데 의도대로 CI에서 캐싱이 되지 않았다.

## 3. 실수: 배포단계에서 env 파일을 수정했다

문제는 **CI에서 `GENERATE_SOURCEMAP=false`를 어떻게 주입할 것인가**였다. 처음 접근은 아래였다.

```jenkinsfile
// (잘못된 패턴) Jenkinsfile
when { environment name: 'MODE', value: 'ci' }
steps {
    script {
        sh "echo '\nGENERATE_SOURCEMAP=false' >> packages/b2c/env/.env.${env.ENV_LONG}"
        sh "echo '\nGENERATE_SOURCEMAP=false' >> packages/b2b/.env.${env.ENV_LONG}"
        sh "echo '\nGENERATE_SOURCEMAP=false' >> packages/admin/.env.${env.ENV_LONG}"Collapse comment
         deploy.dockerRun(env.NODE_IMAGE, 'pnpm test:ci', env.DOCKER_OPTION)
    }
}

```

### 3.1 왜 한 줄이 캐시를 모두 깨버렸는가

터보레포는 task 캐시 키를 만들 때 아래 항목을 해싱한다. ([관련 문서 링크](https://turborepo.com/docs/crafting-your-repository/caching?utm_source=chatgpt.com#task-inputs))

- 빌드 명령어
- 소스 코드, 설정 파일, lockfile
- `.env`, `.env.*` 같은 env 파일들
- `turbo.json` 설정

만약 `.env` 파일에 `>>`로 값을 추가하면:

- CI단에서 `.env` 파일 내용이 빌드마다 바뀌고
- 터보레포는 “입력이 변경되었다 → 캐시 무효”라고 판단
- 결과적으로 remote cache가 있어도 해싱이 달라지기 때문에 cache hit가 안된다.

이걸 이해하기 전까지는 “remote cache 쓰는데 왜 시간이 안 줄지?”가 됐었던거다.

## 4. 수정 방향 - env 파일 건드리지 않기

CI에서 env 파일을 수정하지 말고, 빌드 명령어 앞에 환경변수를 인라인으로 넣는  방향으로 바꿨다.

```
// Jenkinsfile (수정 후)
environment {
    CI_OPTIONS = 'GENERATE_SOURCEMAP=false '
}

stage('Test') {
    steps {
        script {
            deploy.dockerRun(env.NODE_IMAGE, env.CI_OPTIONS + 'pnpm test:ci', env.DOCKER_OPTION)
        }
    }
}

stage('Build') {
    steps {
        script {
            deploy.dockerRun(env.NODE_IMAGE, env.CI_OPTIONS + "pnpm build:${env.ENV_LONG}", env.DOCKER_OPTION)
        }
    }
}

```

이제  `.env` 파일은 더 이상 건드리지 않기 때문에 터보레포 입장에서는 입력 파일이 바뀌지 않으므로 cache hit가 된다.

---

## 5. 결과

- CI 빌드 시간 **3분 46초 → 3분 11초 (약 15% 단축)**
- CI에서 불필요한 브라우저 소스맵 생성 제거
