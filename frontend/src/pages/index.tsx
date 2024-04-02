import { ReactElement } from "react";

import Login from "./login";

import Landing from "@/components/Landing";

export default function MyApp() {
  return <Login />;
}

MyApp.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};
