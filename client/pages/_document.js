import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

// import favicon from '../data/imageExports';

const MyDocument = () => {
  return (
    <Html>
      <Head>
        <link rel="shortcut icon" href="/static/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

MyDocument.getInitialProps = async (context, client, currentUser) => {
  const initialProps = await Document.getInitialProps(context);
  return { ...initialProps };
};

export default MyDocument;
