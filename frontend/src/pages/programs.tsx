import { useRedirectTo404IfNotAdmin, useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Programs() {
  useRedirectToLoginIfNotSignedIn();
  useRedirectTo404IfNotAdmin();
  return (
    <main>
      <h1>PIA Programs Page!</h1>
    </main>
  );
}
