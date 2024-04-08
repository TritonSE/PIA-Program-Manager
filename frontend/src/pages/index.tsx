import { ReactElement } from "react";

// import Login from "./login";
import CreateUser from "./create_user";

import Landing from "@/components/Landing";

export default function MyApp() {
  // return <Login />;
  return <CreateUser />;
}

MyApp.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};
