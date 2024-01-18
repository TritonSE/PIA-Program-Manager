import { AppProps } from "next/app";

import Navigation from "../components/Navigation";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Navigation>
      <Component {...pageProps} />
    </Navigation>
  );
}
export default MyApp;
