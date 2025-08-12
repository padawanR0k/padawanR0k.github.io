---
title: force push로 날아간 커밋 복구하기
date: 2022-03-19
tags: ["git"]
layout: post
image: ../../img/force-push.jpeg
keywords: [git force push]
---
# force push로 날아간 커밋 복구하기

## 사건의 전말
1. A 컴퓨터에서 BBB, CCC 커밋을 남기고 push했다.
    1.  origin의 커밋로그 AAA - BBB - CCC
2. B 컴퓨터에서 pull받지 않고 커밋(DDD)을 한 뒤 `git push -u -f origin HEAD` 실행시켰다.
3. origin의 커밋은 이제 AAA - DDD가 되었다.

### 해결한 방법
다행히도 나와 비슷한 사람이 있었고, [스택오버 플로우](https://stackoverflow.com/a/43271529)에서 해결방법을 찾을 수 있었다.
깃허브에서는 [레포지토리 관련 API](https://docs.github.com/en/rest/reference/git#create-a-reference)를 제공해주는데 이를 통해 해결했다.

1. 레포지토리에서 발생한 이벤트를 조회한다.
    - `curl -u <username> https://api.github.com/repos/:owner/:repo/events`
    - 길이가 너무 길어 터미널에서 한번에 안보인다면 뒤에 `> text`를 붙여서 표준 출력을 파일로 리다이렉트 시키자. 그럼 해당 파일에 내용이 담긴다.
    - 아니면 그냥 브라우저에서 확인해도 된다. 예시) https://api.github.com/repos/padawanr0k/wiki/events
2. JSON을 보다보면 아래와 같은 메세지가 보인다. 여기서 `message`를 보며 내가 필요한 커밋인지 확인한다. `url`값을 통해 접속하면 커밋의 내용을 볼 수 있고, 그 내부의 `files`값으로 깃허브상에 남겨진 데이터도 확인할 수 있다.
    ```json
    "payload": {
      "push_id": 9343999662,
      "size": 1,
      "distinct_size": 1,
      "ref": "refs/heads/master",
      "head": "56dfb60cb631164a1bf716e98371f595da6634b1",
      "before": "d0e7ae07a20aede975a37536f0439defb4e68e9a",
      "commits": [
        {
          "sha": "56dfb60cb631164a1bf716e98371f595da6634b1",
          "author": {
            "email": "35283339+padawanR0k@users.noreply.github.com",
            "name": "padawanR0k"
          },
          "message": "Update shortcut.md",
          "distinct": true,
          "url": "https://api.github.com/repos/padawanR0k/wiki/commits/56dfb60cb631164a1bf716e98371f595da6634b1"
        }
      ]
    },
    "public": true,
    "created_at": "2022-03-14T09:43:08Z"
    ```
3. 내가 필요한 커밋인지, 즉 날아갔으면 안되는 커밋들중 제일 마지막 커밋인지 확인하고 아래 api를 실행시켜 해당 커밋을 가진 새로운 브랜치를 remote에 생성한다.
    - `curl -i -u <username>:<persnalAccessToken> -H "Accept: application/vnd.github.v3+json" -H "Content-Type: application/json" -X POST -d '{"ref":"refs/heads/<branchName>", "sha":"<targetCommit>"}' https://api.github.com/repos/<username>/<repositoryName>/git/refs`
    - `status`값이 `201`로 넘어오면 성공이다. 이제 PR을 만들어 머지하자
    - 꺽쇠내부의 값은 본인의 정보를 넣어주자

### 참고한 링크
- [Git database](https://docs.github.com/en/rest/reference/git#create-a-reference)
- [How to recover from a git push -force?](https://stackoverflow.com/a/43271529)


