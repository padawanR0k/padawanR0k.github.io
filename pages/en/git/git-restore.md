---
title: Recovering Commits Lost by a Force Push
date: 2022-03-19
tags: ["git"]
layout: post
image: ../../img/force-push.jpeg
keywords: [git force push]
---

# Recovering Commits Lost by a Force Push

## Story
1. On computer A, I made commits BBB and CCC and pushed them.
   1. The commit log on origin became AAA - BBB - CCC
2. On computer B, without pulling, I made commit DDD and then ran `git push -u -f origin HEAD`.
3. The commit history on origin became AAA - DDD.

### How I solved it
Fortunately, I found someone with a similar issue and a solution on [Stack Overflow](https://stackoverflow.com/a/43271529). GitHub provides [repository-related APIs](https://docs.github.com/en/rest/reference/git#create-a-reference) which can be used to resolve this.

1. List the events that occurred in the repository.
   - `curl -u <username> https://api.github.com/repos/:owner/:repo/events`
   - If the output is too long to see at once in the terminal, append `> text` to redirect stdout to a file.
   - Or just check in a browser. Example) https://api.github.com/repos/padawanr0k/wiki/events
2. In the JSON, find a message like the one below. Check the `message` to see if it is the commit you need. You can follow the `url` to inspect the commit contents, and within it, you can also check the data GitHub retained under `files`.
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
3. After confirming it is the commit you need (i.e., the last commit among the ones that should not have been lost), create a new branch in the remote that points to that commit via the API below.
   - `curl -i -u <username>:<persnalAccessToken> -H "Accept: application/vnd.github.v3+json" -H "Content-Type: application/json" -X POST -d '{"ref":"refs/heads/<branchName>", "sha":"<targetCommit>"}' https://api.github.com/repos/<username>/<repositoryName>/git/refs`
   - If the `status` is `201`, it succeeded. Create a PR and merge it.
   - Replace the angle-bracketed placeholders with your actual information.

### References
- [Git database](https://docs.github.com/en/rest/reference/git#create-a-reference)
- [How to recover from a git push -force?](https://stackoverflow.com/a/43271529)


