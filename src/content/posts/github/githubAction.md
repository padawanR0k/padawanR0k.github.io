---
title: CI를 위한 github action사용기
layout: post
image: ../../img/android-github-actions-setup-image.png
author: [padawanr0k]
date:  2021-06-14
tags: [github]
---

> 42서울 클러스터 입장시 활용되는 체크인웹 서비스를 이어받게 되면서 평소에 해보고 싶었던 기술을 사용해보고 싶었다.

## 내가 원했던 기능

- 기존에 ec2에 올라간 nodejs서버를 업데이트할 때, 방법은 다음과 같았다.
	1. 로컬에서 빌드
	2. 터미널을 켜서 `scp`명령어로 직접 올린다.
	3. `pm2`를 사용해 상태를 업데이트시킨다
- 이 부분을 자동화 하고자 했다.

## github action이란?

- 리포지토리의 상태를 특정 조건으로 반응하는 컴퓨팅 도구 이다. 예를 들면, 깃허브 리포지토리로 파일을 푸쉬 시, 그 푸쉬 된 파일을 베이스로 가상 리눅스가 만들어지고 사용자가 설정해놓은 순서대로 작업이 시작된다.([출처](https://meaownworld.tistory.com/162))
- 공개 레포지토리인 경우 무료로 사용가능하다.

## 흐름
`git push`나 풀 리퀘스트로 인해 master 브랜치에 새로운 커밋이 올라왔을 경우 아래와 같은 작업을 하는 깃허브 액션을 실행시킨다.

1. `.env.production`파일을 만든다.
2. `yarn build`로 빌드한다.
3. 빌드된 파일을 `scp`를 사용해 ec2에 업로드한다.
4. ec2에 접근하여 pm2로 상태를 업데이트시킨다.

- 위 내용을 기준으로 작성된 .yml파일은 다음과 같다.
```yml
# This is a basic workflow to help you get started with Actions

name: CI

# Controls when the action will run.
on:
  # Triggers the workflow on push or pull request events but only for the master branch
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]
```
- master브랜치에 push나 pull request가 이루어지면 해당 워크플로우가 작동한다.

```yml
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x]
```
- 사용할 nodejs 버전을 지정한다.

```yml

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      - uses: actions/checkout@v1

      - name: Create env file
        env:
          API_KEY: ${{ secrets.API_KEY }}
          PORT: ${{ secrets.PORT }}
          NODE_secrets: ${{ secrets.NODE_secrets }}
          DATABASE_HOST: ${{ secrets.DATABASE_HOST }}
          DATABASE_PORT: ${{ secrets.DATABASE_PORT }}
          DATABASE_USERNAME: ${{ secrets.DATABASE_USERNAME }}
          DATABASE_PASSWORD: ${{ secrets.DATABASE_PASSWORD }}
          DATABASE_NAME: ${{ secrets.DATABASE_NAME }}
          CLIENT_ID: ${{ secrets.CLIENT_ID }}
          CLIENT_SECRET: ${{ secrets.CLIENT_SECRET }}
          CLIENT_CALLBACK: ${{ secrets.CLIENT_CALLBACK }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}

        run: |
          touch .env.production
          echo API_KEY="$API_KEY" >> .env.production
          echo PORT="$PORT" >> .env.production
          echo NODE_ENV="$NODE_ENV" >> .env.production
          echo DATABASE_HOST="$DATABASE_HOST" >> .env.production
          echo DATABASE_PORT="$DATABASE_PORT" >> .env.production
          echo DATABASE_USERNAME="$DATABASE_USERNAME" >> .env.production
          echo DATABASE_PASSWORD="$DATABASE_PASSWORD" >> .env.production
          echo DATABASE_NAME="$DATABASE_NAME" >> .env.production
          echo CLIENT_ID="$CLIENT_ID" >> .env.production
          echo CLIENT_SECRET="$CLIENT_SECRET" >> .env.production
          echo CLIENT_CALLBACK="$CLIENT_CALLBACK" >> .env.production
          echo JWT_SECRET="$JWT_SECRET" >> .env.production
          cat .env.production | head -n 1
```
- 깃허브 레포지토리 secret키를 `.env.production`파일에 한줄씩 추가한다. (cat은 확인용)

```yml
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
          registry-url: "https://npm.pkg.github.com"
```
- 지정했던 nodejs버전을 다운받는다.

```yml
      - name: Install dependencies
        run: yarn install
        env:
          CI: true
```
- yarn install을 통해 의존모듈들을 다운받는다.

```yml
      - name: Run Build
        run: yarn build
```
- package.json에 지정했던 빌드 스크립트를 실행한다.

```yml
      - name: build file upload to ec2
        uses: garygrossgarten/github-action-scp@release
        with:
            local: ./dist
            remote: /home/yurlee/code/42s_checkin_server/dist/
            host: ${{ secrets.HOST }}
            username: ${{ secrets.SSH_USER }}
            privateKey: ${{ secrets.SSH_KEY }}
            recursive: true
```
- 빌드는 dist폴더에 저장된다. 해당 결과파일들을 [`github-action-scp`](https://github.com/garygrossgarten/github-action-scp)를 이용해 ec2에 전송한다.

```yml
      - name: ec2 update
        uses: appleboy/ssh-action@master
        with:
           host: ${{ secrets.HOST }}
           username: ${{ secrets.SSH_USER }}
           key: ${{ secrets.SSH_KEY }}
           script: pm2 restart 0 --update-env

```
- [`ssh-action`](https://github.com/appleboy/ssh-action)를 이용해 ec2에 접속한 후 pm2 특정 스크립트를 실행시킨다.

## ETC
- .env파일을 저장소에 업로드하면 안되기 때문에 secret키로 등록한 후 액션이 실행될때마다 생성되게해서 해결했다.

## 참고
- https://dev.to/lukasborawski/node-js-app-deployment-with-aws-pm2-and-github-actions-31o2
- [Deploying a Production ready React-Express app on AWS EC2 with CI/CD](https://gist.github.com/rmiyazaki6499/b564b40e306707c8ff6ca9c67d38fb6f#github-actions)
- [GitHub Actions로 간단히 CI 서버 대신하기](https://huns.me/posts/2019-12-17-34)
- [Github Actions 예제로 workflow 알아보기 (비용, 제한)](https://meaownworld.tistory.com/162)
