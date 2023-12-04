import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import { db } from "./../../firebase";

const GAuth = () => {
  const navigate = useNavigate();

  // To Auth. with Google
  async function GoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // To check if the user already exit and add user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with google");
    }
  }

  return (
    <>
      <button
        onClick={GoogleClick}
        type="button"
        className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-2 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out rounded"
      >
        <FcGoogle className="bg-white text-2xl mr-2 rounded-full" /> Sign In
        With Google
      </button>
    </>
  );
};

export default GAuth;
