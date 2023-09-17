import Giscus from "@giscus/react";

export default function Comments() {
  return (
      <Giscus
          id="comments"
          repo="padawanr0k/padawanr0k.github.io"
          repoId="MDEwOlJlcG9zaXRvcnkzOTcxNTUwNDU="
          category="Comment"
          categoryId="DIC_kwDOF6wa5c4CZYa9"
          mapping="pathname"
          term="댓글을 남겨주세요 :)"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="ko"
          loading="lazy"
      />
  );
}
