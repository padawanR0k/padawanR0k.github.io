// Cloudflare Pages Functions - ko 리다이렉트
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // /ko/로 시작하는 경로 처리
  if (pathname.startsWith('/ko/')) {
    // /ko/ 제거하고 나머지 경로 추출
    const newPath = pathname.substring(3);
    const redirectPath = newPath || '/';

    // 쿼리 파라미터가 있으면 유지
    const search = url.search;
    const newUrl = `${url.origin}${redirectPath}${search}`;

    return Response.redirect(newUrl, 301);
  }

  // /ko 정확히 매치하는 경우
  if (pathname === '/ko') {
    const search = url.search;
    const newUrl = `${url.origin}/${search}`;

    return Response.redirect(newUrl, 301);
  }

  // 다른 요청은 그대로 통과
  return await context.next();
}
