---
author: [padawanr0k]
title: CloundFront + ALB 접근제어하기
date: 2021-09-14
tags: ['cloud']
layout: post
keywords: [CloudFront, ALB]
---

## 지금 겪고 있는 상황
- Frontend는 react 기반으로 S3에 올려서 CloudFront로 서비스 제공 중
- Backend는 node.js 기반으로 EC2에 올려서 ALB로 서비스 제공 중
- Backend API ALB에서 따로 접근제어를 하지 않다보니 외부 트래픽 공격에 노출됨
  - 누군가 계속 이상한 값을 body에 넣어 전송중
  ```
  {
    "0x[]" : "androxgh0st"
  }
  ```

## 해결방법 (자세한 내용은 아래 공식 문서 확인)
1. 요청에 사용자 지정 HTTP 헤더를 추가
2. ALB로 보내는 요청에 사용자 지정 HTTP 헤더를 추가하여 구성하실 수 있습니다.
3. 특정 헤더가 포함된 요청만 전달하도록 Application Load Balancer 구성
4. 오리진 요청에 HTTPS 사용

> 외부 트래픽은 해당 헤더가 없을테니까 로드밸런서를 뚫고 접근할 수 없을것이다.

1. [Application Load Balancer에 대한 액세스 제한 - Amazon CloudFront](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html)
2. [보안 액세스 구성 및 콘텐츠에 대한 액세스 제한 - Amazon CloudFront](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/SecurityAndPrivateContent.html)

## 트러블슈팅
### front에서 api호출시 헤더에 커스텀 HTTP 헤더를 CORS에러 발생
- 원인: API 요청시, OPTION 메소드로 먼저 호출되는 Preflight 요청시 "커스텀 헤더를 사용할거야!"라는 의미를 나타내는 헤더를 사용하지 않아서 발생함
  - [Access-Control-Request-Headers](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Access-Control-Request-Headers)에 위에서 만든 커스텀헤더를 추가하여  해결

## 참고
- https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Access-Control-Request-Headers
- [CORS 이젠 끝내보자](https://siosio3103.medium.com/cors-%EC%9D%B4%EC%A0%A0-%EB%81%9D%EB%82%B4%EB%B3%B4%EC%9E%90-e4cedce3d1c)
- [[Spring Boot] CORS와 Preflight에 관한 이슈](https://velog.io/@change/Spring-Boot-CORS%EC%99%80-Preflight%EC%97%90-%EA%B4%80%ED%95%9C-%EC%9D%B4%EC%8A%88)
