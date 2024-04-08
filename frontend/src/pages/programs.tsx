import { useRedirectTo404IfNotAdmin } from "@/hooks/redirect";

export default function Programs() {
  useRedirectTo404IfNotAdmin();
  return (
    <main>
      <h1>PIA Programs Page!</h1>
    </main>
  );
}
