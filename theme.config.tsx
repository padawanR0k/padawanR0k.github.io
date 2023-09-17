import React from 'react'
import {DocsThemeConfig} from 'nextra-theme-docs'
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
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: `%s – R0k's log`
      }
    }
  },
  main: ({ children }) => {
    return <>
      {children}
      <Comments />
    </>
  }
}

export default config
