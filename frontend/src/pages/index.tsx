import { ReactElement } from "react";

import CreateUser from "./create_user";

import Landing from "@/components/Landing";

export default function Home() {
  return <CreateUser />;
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};
