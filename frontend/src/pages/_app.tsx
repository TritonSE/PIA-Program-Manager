import { AppProps } from "next/app";

import Landing from "../components/Landing";

import "../styles/global.css";
import "../styles/globals.css";

// import Navigation from "../components/Navigation";

function App({ Component, pageProps }: AppProps) {
  return (
    <Landing {...pageProps}>
      <Component {...pageProps} />
    </Landing>
    // <Navigation>
    //   <Component {...pageProps} />
    // </Navigation>
  );
}
export default App;
