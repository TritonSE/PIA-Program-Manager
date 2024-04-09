import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { initFirebase } from "@/firebase/firebase";

export default function LogOut() {
  const { auth } = initFirebase();
  const router = useRouter();
  signOut(auth)
    .then(() => {
      router.push("/login");
    })
    .catch((error) => {
      console.error(error);
    });
}
