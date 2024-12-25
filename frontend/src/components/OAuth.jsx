import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import useUserStore from "../store/user.store";

import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/AppContext";

const OAuth = () => {
  const { signInStart, signInSuccess, signInFailure } = useUserContext();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      signInStart(); // Start the loading state

      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Creating popup for Google Sign-In
      const result = await signInWithPopup(auth, provider);

      // Sending user data to the backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (data) {
        // Update Zustand state
        signInSuccess(data);
        navigate("/");
      } else {
        // Handle errors returned from the backend
        signInFailure(data.message);
        console.log("Google sign-in failed:", data.message);
      }
    } catch (error) {
      signInFailure(error.message); // Handle client-side errors
      console.log("Could not sign in with Google:", error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  );
};

export default OAuth;
