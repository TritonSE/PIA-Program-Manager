import { ReactElement } from "react";

import Login from "./login";

import Landing from "@/components/Landing";

export default function Home() {
  return <Login />;
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};