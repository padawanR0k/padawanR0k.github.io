import React from 'react'
import {DocsThemeConfig, useConfig} from 'nextra-theme-docs'
import {useRouter} from 'next/router'
import Comments from './components/Comments';

const config: DocsThemeConfig = {
  logo: <h1>R0k's log</h1>,
  project: {
    link: 'https://github.com/padawanR0k/padawanR0k.github.io',
  },
  docsRepositoryBase: 'https://github.com/padawanr0k/padawanr0k.github.io/tree/main/docs',
  useNextSeoProps() {
    const { asPath, pathname } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: `%s – R0k's log`,
        pathname,
      }
    }
  },
  head: () => {
    const head = useConfig();
    const seoProps = head.useNextSeoProps() as unknown as { titleTemplate: string, pathname: string };

    if (!seoProps?.pathname) {
      return;
    }

    const seperated = seoProps.pathname.split('/').slice(1);
    const thumbnailPath = seperated.join('-');

    return <meta property={'og:image'} content={`https://r0k.blog.wiki/thumbnail/${thumbnailPath}.png`} />;
  },
  main: ({ children }) => {
    return <>
      {children}
      <Comments />
    </>
  }
}

export default config
