// ko 경로 전용 리다이렉트 핸들러
export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);

  // 경로 파라미터에서 나머지 경로 추출
  const path = params.path ? params.path.join('/') : '';
  const redirectPath = path ? `/${path}` : '/';

  // 쿼리 파라미터 유지
  const search = url.search;
  const newUrl = `${url.origin}${redirectPath}${search}`;

  // 301 영구 리다이렉트
  return Response.redirect(newUrl, 301);
}
