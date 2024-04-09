import { useRedirectTo404IfNotAdmin, useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Notifications() {
  useRedirectToLoginIfNotSignedIn();
  useRedirectTo404IfNotAdmin();
  return (
    <main>
      <h1>PIA Notifications Page!</h1>
    </main>
  );
}
