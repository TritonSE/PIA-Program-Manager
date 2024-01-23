import { AppProps } from "next/app";

import Navigation from "../components/Navigation";
import "../styles/global.css";
import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <Navigation>
      <Component {...pageProps} />
    </Navigation>
  );
}
export default App;
