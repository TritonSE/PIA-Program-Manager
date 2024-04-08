import { initFirebase } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LogOut() {
    const { auth } = initFirebase();
    const router = useRouter();
    signOut(auth).then(() => router.push("/login"));
}
