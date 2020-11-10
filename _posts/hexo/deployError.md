---
title:  hexo HttpRequestException encountered. 오류 해결하기 hexo
date:  2018-02-23
tags: [hexo,Solved]
categories : [hexo]

---
# 문제
ajax를 실습할때 express를 실행하면서 충돌이 있엇는지 git push를 할때마다 로그인을 요구하고, hexo deploy를 하려니
```code
fatal: HttpRequestException encountered.
   �� ��û�� ������ ���� ������ �߻��߽��ϴ�.
bash: /dev/tty: No such device or address
error: failed to execute prompt script (exit code 1)
fatal: could not read Username for 'https://github.com': No error
FATAL Something's wrong. Maybe you can find the solution here: http://hexo.io/docs/troubleshooting.htmlbleshooting.html
Error: fatal: HttpRequestException encountered.
   �� ��û�� ������ ���� ������ �߻��߽��ϴ�.
bash: /dev/tty: No such device or address
error: failed to execute prompt script (exit code 1)
fatal: could not read Username for 'https://github.com': No error
                                                                                             _modules\hexo-util\lib\spawn.js:37:17)
    at ChildProcess.<anonymous> (C:\Users\ROK\Documents\github\padawanR0k.github.io\blog\nodeg\node_modules\hexo-util\lib\spawn.js:37:17)
    at emitTwo (events.js:125:13)                                                            ules\cross-spawn\lib\enoent.js:40:29)
    at ChildProcess.emit (events.js:213:7)
    at ChildProcess.cp.emit (C:\Users\ROK\Documents\github\padawanR0k.github.io\blog\node_modde_modules\cross-spawn\lib\enoent.js:40:29)
    at maybeClose (internal/child_process.js:887:16)
    at Process.ChildProcess._handle.onexit (internal/child_process.js:208:5)
```
이런 오류가 자꾸 뜬다. 구글링을 하다보니 해결책을 찾았다.


Try adding this into your git config


> git config --global credential.helper wincred

https://github.com/atom/atom/issues/8984

위의 코드를 터미널에 입력하고 deploy를 하면 된다!

그런데
이 에러가 계속 뜨는게 거슬린다...
> fatal: HttpRequestException encountered. �� ��û�� ������ ���� ������ �߻��߽��ϴ�.