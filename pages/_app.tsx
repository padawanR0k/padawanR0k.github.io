import Clarity from '@microsoft/clarity';
import Head from 'next/head';
import Script from 'next/script';
import { Fragment } from "react";
import * as gtag from '../lib/gtag';
import './styles.css';

import NextTopLoader from 'nextjs-toploader';


if (process.env.NODE_ENV === 'production') {
  const projectId = "qhaci5tb0k"

  Clarity.init(projectId);
}


// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  gtag.useGtag();
  return <Fragment>
    <Head>
      <link rel="stylesheet" type="text/css" href='https://blog.r0k.wiki/pretendard-subset.css'/>
      <meta name="google-site-verification" content="D2ge0ulWTiD8wQwrjWMg2yHjlWX3t_6Fj8GiYRJBIsY" />
    </Head>
    <NextTopLoader />

    <Component {...pageProps} />
    {process.env.NODE_ENV !== 'development' && (
        <>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
          />
          <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gtag.GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
          />
        </>
    )}
  </Fragment>
}
