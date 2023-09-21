import * as gtag from '../lib/gtag'
import './styles.css'
import {Fragment} from "react";
import Script from 'next/script';
import Head from 'next/head';


// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  gtag.useGtag();
  return <Fragment>
    <Head>
      <link rel="stylesheet" type="text/css" href='https://blog.r0k.wiki/pretendard-subset.css'/>
    </Head>
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
