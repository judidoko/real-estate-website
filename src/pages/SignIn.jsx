import { useState } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import GAuth from "../components/GAuth";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";

const SignIn = () => {
  // Form Data UseState Hook
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // Show password useState Hook and Function
  const [showPassword, setShowPassword] = useState(false);

  function showPasswords() {
    setShowPassword((prevState) => !prevState);
  }
  // Destructing Form Data
  const { email, password } = formData;
  // onChange Function
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  // onSubmit Function for SignIn
  const navigate = useNavigate();
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Wrong user credentials");
    }
  }
  return (
    <>
      <section>
        <h1 className="text-3xl text-center mt-6 font-bold">Sign In</h1>
        <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
          <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
            <img
              src="https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=867&q=80"
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
                  Don&apos;t have an account?
                  <Link
                    to="/sign-up"
                    className="text-red-500 hover:text-red-700 transition duration-200 ease-in-out ml-1"
                  >
                    Register
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
                Sign In
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

export default SignIn;
