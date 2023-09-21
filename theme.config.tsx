import React from 'react'
import {DocsThemeConfig, useConfig} from 'nextra-theme-docs'
import {useRouter} from 'next/router'
import Comments from './components/Comments';

const config: DocsThemeConfig = {
  logo: <h1>R0k's log</h1>,
  project: {
    link: 'https://github.com/padawanR0k/padawanR0k.github.io',
  },
  // chat: {
  //   link: 'https://discord.com',
  // },
  docsRepositoryBase: 'https://github.com/padawanr0k/padawanr0k.github.io/tree/main/docs',

  // footer: {
  //   text: 'Nextra Docs Template',
  // },
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
    // const { pathname } = head.useNextSeoProps()
    console.log(head.title);
    return <>
      <meta property={'og:image'} content={`http://localhost:3000/api/open-graph/slug.png?title=${head.title}`} />
    </>;
  },
  main: ({ children }) => {
    return <>
      {children}
      <Comments />
      <meta name="google-site-verification" content="D2ge0ulWTiD8wQwrjWMg2yHjlWX3t_6Fj8GiYRJBIsY" />
    </>
  }
}

export default config
