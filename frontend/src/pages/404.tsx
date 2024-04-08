import { ReactElement } from "react";

export default function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

NotFound.getLayout = function getLayout(page: ReactElement) {
  return page;
};
