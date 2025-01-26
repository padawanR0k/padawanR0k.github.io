---
author: [padawanr0k]
title: 프론트엔드에서 매직 넘버로 파일 구분하기
date: 2025-01-26
tags: ["web"]
layout: post
keywords: ["magic number"]
---

## 매직넘버란
매직넘버(Magic Number): 파일 종류 식별을 위한 특정한 바이트 시퀀스이다.
- 예시: PNG 파일은 바이트가 `89 50 4E 47 0D 0A 1A 0A`로 시작한다.

다른 파일들에 대한 형식은 [File signature (magic number)](https://pstor-eon.github.io/forensic-etc/magic-number/)에서 확인할 수 있다.
프로그램이 파일 형식을 식별하는 "파일 지문"이라고 생각하면 된다.

이미지를 업로드하여 다루는 로직에서 파일의 확장자만으로 파일 타입 식별하게되면, 유저가 단순히 이름 바꾸기를 통해 바꾼 파일이 업로드 됐을 때 의도하지 않은대로 동작할 수 있다.

### 프론트엔드에서 매직 넘버 활용하기
이미지를 업로드해 크롭하여 서버에 저장하는 기능을 구현하고 있었는데, `.png`파일 업로드시 자꾸 배경색이 생긴채로 저장되는 문제가 있었다.
확인해보니 크롭이 완료된 후 이미지를 다시 저장할 때, 파일의 확장자가 `.jpg`로 바뀌어서 저장되고 있었던 것이다.

해당 문제를 마주쳤을 때 매직 넘버를 쓰면 되겠구나 싶어 바로 적용했다.

```typescript
async function identifyImageType(file: Blob): Promise<string> {
  const buffer = await file.slice(0, 4).arrayBuffer();
  const uint8Array = new Uint8Array(buffer);

  // PNG magic number: 89 50 4E 47
  if (
    uint8Array[0] === 0x89 &&
    uint8Array[1] === 0x50 &&
    uint8Array[2] === 0x4e &&
    uint8Array[3] === 0x47
  ) {
    return 'png';
  }

  // JPEG magic number: FF D8 FF
  if (uint8Array[0] === 0xff && uint8Array[1] === 0xd8 && uint8Array[2] === 0xff) {
    return 'jpeg';
  }

  // GIF magic number: 47 49 46 38 (GIF8)
  if (
    uint8Array[0] === 0x47 &&
    uint8Array[1] === 0x49 &&
    uint8Array[2] === 0x46 &&
    (uint8Array[3] === 0x38 || uint8Array[3] === 0x39) // Supports GIF87a and GIF89a
  ) {
    return 'gif';
  }

  return 'jpeg';
}
```
