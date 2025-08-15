---
author:
  - padawanr0k
title: Front-End Error Monitoring - Datadog RUM
date: 2025-02-22
tags:
  - web
layout: post
keywords:
  - datadog RUM
---

## What Causes Errors?

Errors occur when incorrect logic is executed or when they are intentionally thrown by the code.

Uncaught errors are printed to the browser console using `console.error`.

## Error Stack Traces

When an error is caused by flawed logic, the error object includes a stack trace that shows where the error originated.

If you create a custom error by extending the native `Error` object, it won't have a stack trace by default. To include one, you must pass the trace using `Error.captureStackTrace()`. ([Reference](https://stackoverflow.com/questions/59625425/understanding-error-capturestacktrace-and-stack-trace-persistance))

## Errors in React

In React, **Error Boundaries** can handle errors from synchronous logic, but not from asynchronous logic. ([Reference](https://lilys.ai/digest/2416209/499798))

```jsx
const Button = () => {
  const [error, setError] = useState(null)
  const onClick = () => {
    throw Error('click Error') // This error is printed to the browser console but not caught by an ErrorBoundary.
  }

  if (error) {
    throw Error("error"); // This error is caught by an ErrorBoundary.
  }

  return (
    <button onClick={onClick}> Click! </button>
  );
};
````

You should use an Error Boundary to handle errors that affect the rendered UI. For other errors, it's enough to simply log them.

## Datadog RUM Error Monitoring

### Error Source

When an error is logged in Datadog RUM, it saves a variety of information, including the **error source**. There are five categories for error sources:

  - **agent**: Errors from within the Datadog SDK itself.
  - **console**: When `console.error` is called.
  - **custom**: When the `addError` API of the RUM library is called. (Unlike `console.error`, this does not print to the browser console).
  - **report**: When the `ReportingObserver` API is called.
  - **source**: When an uncaught error occurs within the code.

So, what if you call both `console.error` and `datadogRum.addError()`? Yes, it will be logged twice.

  - Logged as **custom** by `datadogRum.addError()`.
  - Logged as **console** by the `console.error` inside the React library.

### Error Type

The **error type** tells you what kind of error occurred.

JavaScript has various native error types, such as `SyntaxError`, `TypeError`, and `RangeError`.

If you want to handle a specific type of error, you can create a custom error by extending the native `Error` object.

```jsx
export class ShakaError extends Error {
  constructor(error: Shaka.util.Error) {
    super(error.message);
    this.name = 'ShakaError';
    this.message = this.getErrorMessage(error);
    this.detail = { ... };

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShakaError);
    } else {
      this.stack = error.stack;
    }
  }

  getErrorMessage(...) { ... }
}
```

Here, you must pass the stack trace via `Error.captureStackTrace`.

When you do this, the **error type** will be displayed using the `name` of your extended Error object.

### `datadogRum.addError()` with Context

You can pass an object with additional information as the second argument to the `addError()` function.

For errors with this context, you can see the information in the **Custom Attributes** section of the error details page.

The custom attributes you pass via context can be used for querying, just like other values.

You can group or filter them using their key, for example: `@context.errorDetail.data`.

## Advanced Error Alerts

In Datadog Monitors, you can create a trigger based on the number of RUM errors.

By leveraging the information above—categorizing errors and including high-cardinality data in the context—you can create much more specific alerts. Instead of a generic alert like "over 40 errors," you can set up alerts like "video asset request failed more than 40 times" or "XXX API request failed more than 20 times."

## Sending Browser Logs to Datadog

`@datadog/browser-logs` is a Datadog library that enables client-side logging. ([Official Documentation](https://docs.datadoghq.com/logs/log_collection/javascript/))

You can specify the log levels you want to forward (log, debug, info, warn, error) using the `forwardConsoleLogs` option.

For example, if you set `forwardConsoleLogs: ['log', 'error']`, every time `console.log` or `console.error` is called in the browser, it will be sent to Datadog.

Similar to RUM's `addError`, the browser-logs library also provides a function to send logs to Datadog without printing them to the console.

```jsx
export class ShakaError extends Error {
  constructor(error: Shaka.util.Error) {
    super(error.message);
    this.name = 'ShakaError';
    this.message = this.getErrorMessage(error);
    this.detail = { ... };

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShakaError);
    } else {
      this.stack = error.stack;
    }
  }

  getErrorMessage(...) { ... }
}
```

These logs can be viewed in the **Datadog Log Explorer**. You can also find them under the **Logs** tab of a specific user's RUM Session's View event. This allows you to check informational logs, not just errors, within RUM.
