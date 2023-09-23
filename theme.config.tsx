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
      }
    }
  },
  head: () => {
    const head = useConfig()
    console.log(head.title);
    const filename= encodeURIComponent(head.title)
    return <>
      <meta property={'og:image'} content={`http://localhost:3000/${filename}.png`} />
    </>;
  },
  main: ({ children }) => {
    return <>
      {children}
      <Comments />
    </>
  }
}

export default config
