---
title: git 레포지토리에 앞글자가 소문자로 업로드되는 오류 해결하기
date:  2018-08-05
tags: [git, error]
categories: [error]
---

# 에러 내용
.scss 파일의 첫 글자를 대문자로 해둔 후 push를 했엇는데 정작 레포에는 대문자로 올라가있었음.
따로 설정한것도 없었는데...

# 해결법
git의 core.ignorecase 옵션을 false 값으로 바꿔주자.

```
git config core.ignorecase false
```

[출처](https://stackoverflow.com/questions/17683458/how-do-i-commit-case-sensitive-only-filename-changes-in-git/19956280)