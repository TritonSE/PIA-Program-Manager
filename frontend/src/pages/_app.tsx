import "../styles/globals.css";

import { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps<object>) {
  return <Component {...pageProps} />;
}
