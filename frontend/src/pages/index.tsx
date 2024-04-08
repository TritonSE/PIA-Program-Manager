// // import Login from "./login";
// import CreateUser from "./create_user";

// export default function Home() {
//   // return <Login />;
//   return <CreateUser />;

import { ReactElement } from "react";

import Login from "./login";

import Landing from "@/components/Landing";

export default function MyApp() {
  return <Login />;
}

MyApp.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};
