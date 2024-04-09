import { AppProps } from "next/app";

//import Landing from "../components/Landing";

import "../styles/global.css";
import "../styles/globals.css";
import { ReactElement, ReactNode } from "react";

import Navigation from "../components/Navigation";

// eslint-disable-next-line import/order
import { NextPage } from "next";
import { UserContextProvider } from "@/contexts/user";

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

//Unless specified, the default layout will have the Navigation bar
function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Navigation>{page}</Navigation>);
  return <UserContextProvider>{getLayout(<Component {...pageProps} />)}</UserContextProvider>;
}

export default App;
