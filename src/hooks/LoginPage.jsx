import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../helper/axios";
import Swal from "sweetalert2";
import { useLogin } from "../contexts/AuthContext";
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";

const LoginPage = () => {
  const { dispatch } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    user_password: "",
  });

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const CheckLoader=()=>{
     if(loginData.email.length === 0 && loginData.user_password.length=== 0)return;
     
    
     setIsLogin(true);
     


     
  }

  const loginUser = async (e) => {
    e.preventDefault();
     if (!loginData.email || !loginData.user_password) {
    return;
  }
    setIsLogin(true);

    try {
      const response = await axios.post("/api/ai_calling/login/", loginData, {
        headers: {
          "Content-type": "application/json",
        },
      });
      const user_data = response.data;
      const { token: newToken } = response.data;

      if (!newToken) {
        throw new Error("Token missing. Login failed.");
      }

      localStorage.setItem("user", JSON.stringify(user_data));
      localStorage.setItem("token", newToken);
      dispatch({ type: "LOGIN", payload: { token: newToken } });

      navigate("/dashboard");
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Logged in successfully",
      });
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: `${e.response}`,
      });
    }
    finally{
       setIsLogin(false); 
    }
  };

  const handleChange = (name, value) => {
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-[url('/bg-logo.jpg')] bg-cover bg-center bg-no-repeat  flex justify-center items-center min-h-screen ">
      <div className="flex shadow-lg rounded-lg md:max-w-[95%] bg-gray-200 flex-col md:flex-row md:items-center md:justify-center md:p-12 p-4 gap-6 lg:max-w-[80%] lg:max-h-[80%]">
        <img
          className=" max-h-64 h-auto sm:max-h-96 md:max-h-[450px] lg:max-h-[600px] md:w-[50%] lg:w-[50%]"
          src="./images/SignIn.png"
          alt="Login"
        />

        <div className="shadow-lg flex- rounded-xl px-6 py-4 md:px-10 md:w-[800px] bg-gray-100">
          <div className="">
            <img
              className="m-auto w-36 md:w-40"
              src="./images/LogoTagline.png"
              alt="Logo"
            />
          </div>
          <div className="flex flex-col items-center gap-2 mt-4">
            <h1 className="text-3xl md:text-4xl font-semibold">Sign In</h1>
            <p className="text-gray-600 text-sm md:text-base text-center">
              Welcome back! Please enter your details
            </p>
          </div>
          <form onSubmit={loginUser} className="mt-8 flex flex-col gap-4">
            <div>
              <label className="text-gray-600 font-semibold">Email</label>
              <input
                name="email"
                value={loginData.email}
                type="email"
                placeholder="Enter your email"
                className="w-full border px-5 py-2 rounded-md mt-1"
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <label className="text-gray-600 font-semibold">Password</label>
              <input
                name="password"
                value={loginData.user_password}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border px-5 py-2 rounded-md mt-1"
                onChange={(e) => handleChange("user_password", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 top-7 right-2 flex items-center"
              >
                {showPassword ? (
                  <PiEyeLight className="h-5 w-5 text-gray-500" />
                ) : (
                  <PiEyeSlash className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="bg-[#BD695D] hover:bg-[#A13727] text-center py-3 rounded-xl mt-4 text-white font-semibold"
              onClick={CheckLoader}
            >
              {isLogin ? (
                <div className="flex justify-center">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
// bg-[#BD695D] hover:bg-[#A13727]
