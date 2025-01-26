/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/function-component-definition */
import {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentProps,
} from "next/document";
import { type ReactElement } from "react";

const appUrl = process.env.NEXT_PUBLIC_URL || "https://compusophy.vercel.app";

const frame = {
  version: "next",
  imageUrl: `${appUrl}/opengraph-image`,
  button: {
    title: "launch",
    action: {
      type: "launch_frame",
      name: "compusophy",
      url: "https://compusophy.vercel.app",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#000000",
    },
  },
};

export default function Document(_props: DocumentProps): ReactElement {
  return (
    <Html lang="en">
      <Head>
        <title>Compusophy</title>
        <meta property="og:title" content="compusophy" />
        <meta
          property="og:description"
          content="A Farcaster Frame for philosophical discussions"
        />
        <meta property="og:image" content={`${appUrl}/image.png`} />
        <meta property="fc:frame" content={JSON.stringify(frame)} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
