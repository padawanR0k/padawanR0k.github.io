import React from 'react'
import {DocsThemeConfig, useConfig} from 'nextra-theme-docs'
import {useRouter} from 'next/router'
import Comments from './components/Comments';
import { generateOgImage } from './open-graph/slug.png';
import {arrr} from "./scripts/generate";

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
    arrr.push(head.title)
    const filename= encodeURIComponent(head.title)
    return <>
      <meta property={'og:image'} content={`http://localhost:3000/${filename}.png`} />
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
