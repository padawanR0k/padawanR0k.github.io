import React from 'react'
import {DocsThemeConfig, useConfig} from 'nextra-theme-docs'
import Comments from './components/Comments';
import {useRouter} from "next/router";
import blogConfig from "./next-sitemap.config.mjs";

const config: DocsThemeConfig = {
  logo: <h1>R0k's log</h1>,
  project: {
    link: 'https://github.com/padawanR0k/padawanR0k.github.io',
  },
  docsRepositoryBase: 'https://github.com/padawanr0k/padawanr0k.github.io/tree/main/docs',
  // useNextSeoProps() {
  //   const { asPath, pathname } = useRouter()
  //   if (asPath !== '/') {
  //     return {
  //       titleTemplate: `%s – R0k's log`,
  //       pathname,
  //     }
  //   }
  // },
  // head: () => {
  //   const { head } = useThemeConfig();
  //   const seoProps = head() as unknown as { titleTemplate: string, pathname: string };

  //   console.log('head')
  //   console.log(head())
  //   console.log('seoProps')
  //   console.log(seoProps)
  //   if (!seoProps?.pathname) {
  //     return;
  //   }

  //   const seperated = seoProps.pathname.split('/').slice(1);
  //   const thumbnailPath = seperated.join('-');

  //   return <meta property={'og:image'} content={`https://r0k.blog.wiki/thumbnail/${thumbnailPath}.png`} />;
  // },
  main: ({ children }) => {
    return <>
      {children}
      <Comments />
    </>
  },
  head: (props) =>{
    const {asPath} = useRouter()
    const config = useConfig()

    const pageTitle = config.frontMatter.title || config.title

    const siteTitle = "R0k's Log"
    const title = pageTitle ? `${pageTitle} – ${siteTitle}` : siteTitle

    const url = `${blogConfig.siteUrl}${asPath}`
    const description =
        "A code generation tool for openapi 3 / 3.1, and typespec specifications, " +
        "primarily aimed at generating typescript client SDKs, and server stubs, " +
        "with an emphasis on compile & runtime safety."

    // {/*<meta property="og:image" content="/opengraph_image.jpeg" />*/}
    return (
        <>
          <title>{title}</title>
          <meta name="robots" content="index,follow" />
          <meta name="description" content={description} />

          <meta property="og:title" content={pageTitle} />
          <meta property="og:site_name" content={siteTitle} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content={url} />

          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </>
    )
  },
  footer: () => null
}

export default config
