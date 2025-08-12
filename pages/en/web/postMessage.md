---
author: [padawanr0k]
title: Using window.postMessage for NICE Identity Verification Popup
date: 2023-09-09
updated: 2023-09-09T11:28:03+09:00
tags: ["javascript"]
created: 2023-09-09T11:28:03+09:00
---

# Using window.postMessage for NICE Identity Verification Popup

## Context

We needed a feature that only allows access to users who have completed identity verification via the NICE popup. The backend logic had already been implemented using the [NICE API](https://www.niceapi.co.kr/#/apis/guide?ctgrCd=0100&prdId=31&prdNm=%EB%B3%B8%EC%9D%B8%ED%99%95%EC%9D%B8%28%ED%86%B5%ED%95%A9%ED%98%95%29). My tasks were:

- Open the verification popup using the form code provided in the official docs.
- Detect when the popup closes and perform branch logic depending on verification status.

## Problem

### How can the host page know when verification in the NICE popup has completed?

#### beforeunload — an event fired when a window is being closed

I first tried calling an API to check the current account's verification status whenever the popup closes, regardless of whether verification succeeded.

```typescript
popUpRef.current = window.open(...)
popUpRef.current?.addEventListener('beforeunload', () => {
  ...
});
```

However, the event fired immediately when the popup opened, not when it closed.

It turned out that the URL opened via window.open did not satisfy the same-site policy. It works when the host is the same or a subdomain.

#### window.postMessage — a safe method for cross-origin communication between window objects

One window can send a message via this method and the other can receive it with an event listener. I planned to treat receipt of the message as a successful verification and invalidate the query (or call the API) to fetch the latest verification status.

```typescript
/*
 * Script in window A at <http://example.com:8080>:
 */

var popup = window.open(...popup details...);

// When the popup is fully loaded:
popup.parent.postMessage("hello there!", "http://example.com");

function receiveMessage(event)
{

  if (event.origin !== "http://example.com")
    return;

  // console.log(event.data); "hello there!"
}
window.addEventListener("message", receiveMessage, false);
```

It still did not work on the first try…

###### window.parent vs window.opener
> window.opener refers to the window that called window.open( ... ) to open the window from which it's called
> window.parent refers to the parent of a window in a <frame> or <iframe>
>
> [Source](https://stackoverflow.com/questions/11313045/what-are-window-opener-window-parent-window-top/11313219#11313219)

I should have used window.opener, but I used parent, so the host window could not receive the message. Even after switching to window.opener, the message still was not received…

- [How do I use Window.postMessage() cross domain?](https://stackoverflow.com/questions/76024047/how-do-i-use-window-postmessage-cross-domain/76024048#76024048)

When communicating across domains with postMessage, I had not specified the second parameter, targetOrigin, so the message was not received. Adding the host to the second parameter of `postMessage`, as in the example above, resolved the issue.

Using `*` allows any host, which is not a safe configuration. In development, we allowed both localhost and the dev server URL using `*`, but in production we specified the correct origin explicitly.


