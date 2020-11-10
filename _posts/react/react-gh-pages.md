---
title: github에 react로 만든 페이지를 cli로 올려보자
date:  2018-09-25
tags: [gh-pages]

---

# 원래는..

build -> git init -> 깃허브 레포생성 -> gh-pages 브랜치생성 후 다시 커밋 -> push

# react-gh-pages를 사용해서 편하게 해보자

```cli
npm install react-gh-pages --save-dev
```
0. react프로젝트로 이동
1. 깃허브에 새로운 레포지토리 생성
2. packge.json 수정
  ```json
  "homepage": "http://[본인계정명].github.io/[생성한 레포명]"
  ```
3. scripts 옵션 수정
  ```json
  "scripts": {
    //...
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
  ```
4. git init

5. git에 레포지토리 주소 추가

  ```cli
  git remote add origin https://github.com/[본인계정명]/[레포지토리 명].git
  ```
6. 아까 packge.json에 등록해놓은 명령어를 실행하여 배포하자.
  ```cli
    npm run deploy
  ```

  [react-gh-pages](https://github.com/gitname/react-gh-pages/tree/f7493337485ec85717a3bcd0fb732b13f5b0aada)