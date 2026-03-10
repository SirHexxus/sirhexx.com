import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang="en">
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Space+Grotesk:wght@300;400;500&family=JetBrains+Mono:wght@400;500&family=VT323&display=swap"
        rel="stylesheet"
      />
      <script defer src="https://analytics.sirhexx.com/script.js" data-website-id="d0d54e90-ff62-4a3e-8230-d7704f75c960" />
    </Head>
    <body>
      <Main />
      <NextScript />
      <script type="module" src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs"></script>
    </body>
  </Html>
);

export default Document;
