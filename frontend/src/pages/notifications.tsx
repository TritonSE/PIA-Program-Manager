import { useRedirectTo404IfNotAdmin } from "@/hooks/redirect";

export default function Notifications() {
  useRedirectTo404IfNotAdmin();
  return (
    <main>
      <h1>PIA Notifications Page!</h1>
    </main>
  );
}
