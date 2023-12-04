import { useState } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import GAuth from "../components/GAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "./../../firebase";

const SignUp = () => {
  const navigate = useNavigate();
  // Form Data UseState Hook
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  // Show password useState Hook and Function
  const [showPassword, setShowPassword] = useState(false);

  function showPasswords() {
    setShowPassword((prevState) => !prevState);
  }
  // Destructing Form Data
  const { name, email, password } = formData;
  // onChange Function
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  // Form onSubmit Function
  async function onSubmit(e) {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      // To get user Info
      const user = userCredential.user;
      //  To delete a user password
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      // To save time a user register
      formDataCopy.timestamp = serverTimestamp();

      // To save user info to Database
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      // To navigate to homePage after adding user to Database
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with the registration");
    }
  }
  return (
    <>
      <section>
        <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
        <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
          <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
            <img
              src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg1fHxvcGVuJTIwZG9vcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
              alt="Welcome"
              className="w-full rounded-2xl"
            />
          </div>
          <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
            <form onSubmit={onSubmit}>
              <div className="mb-6">
                <input
                  className="w-full px-4 py-2 text-xl text-gray-700
                bg-white border-gray-300 rounded transition ease-in-out"
                  type="text"
                  id="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Full Name"
                />
              </div>
              <div className="mb-6">
                <input
                  className="w-full px-4 py-2 text-xl text-gray-700
                bg-white border-gray-300 rounded transition ease-in-out"
                  type="email"
                  id="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Email address"
                />
              </div>
              <div className="relative mb-6">
                <input
                  className="w-full px-4 py-2 text-xl text-gray-700
                bg-white border-gray-300 rounded transition ease-in-out"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Password"
                />
                {showPassword ? (
                  <BsFillEyeSlashFill
                    className="absolute right-3 top-3 text-xl cursor-pointer"
                    onClick={showPasswords}
                    // onClick={() => setShowPassword((prevState) => !prevState)}
                  />
                ) : (
                  <BsFillEyeFill
                    className="absolute right-3 top-3 text-xl cursor-pointer"
                    onClick={showPasswords}
                    // onClick={() => setShowPassword((prevState) => !prevState)}
                  />
                )}
              </div>
              <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
                <p className="mb-6">
                  Already have an account?
                  <Link
                    to="/sign-in"
                    className="text-red-500 hover:text-red-700 transition duration-200 ease-in-out ml-1"
                  >
                    Sign In
                  </Link>
                </p>
                <p>
                  <Link
                    to="/forgot-password"
                    className="text-blue-500 hover:text-blue-700 transition duration-200 ease-in-out"
                  >
                    Forgot Password?
                  </Link>
                </p>
              </div>
              <button
                className="w-full bg-blue-600 text-white px-7 py-2 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800"
                type="submit"
              >
                Sign Up
              </button>
              <div className="flex my-2 before:border-t-2 before:flex-1 items-center before:border-gray-300 after:border-t-2 after:flex-1 after:border-gray-300">
                <p className="text-center font-semibold m-4">OR</p>
              </div>
              <GAuth />
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
