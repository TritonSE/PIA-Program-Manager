import { AppProps } from "next/app";
import { Provider } from "react-redux";

import Landing from "../components/Landing";
import { wrapper } from "../redux-sagas/store";

import "../styles/global.css";
import "../styles/globals.css";

// import Navigation from "../components/Navigation";

function App({ Component, ...pageProps }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  return (
    <Provider store={store}>
      <Landing {...props}>
        <Component {...props} />
      </Landing>
    </Provider>
    // <Navigation>
    //   <Component {...pageProps} />
    // </Navigation>
  );
}
export default App;
