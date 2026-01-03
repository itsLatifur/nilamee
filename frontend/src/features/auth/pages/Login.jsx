import { login } from "../store/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (user && (user.role === "Super Admin" || user.role === "Admin")) {
        navigateTo("/dashboard");
      } else {
        navigateTo("/");
      }
    }
  }, [dispatch, isAuthenticated, loading, user]);

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
        <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm whitestone:backdrop-blur-xl mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md sm:w-[600px] sm:h-[450px] border-2 border-golden-400 whitestone:border-white/30 shadow-2xl">
          <h1
            className={`text-golden-500 whitestone:text-gray-900 text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
          >
            Login
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white focus:border-b-golden-300 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white focus:border-b-golden-300 transition-all"
              />
            </div>
            <button
              className="bg-gold-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 font-semibold text-xl transition-all duration-300 py-2 px-4 rounded-md text-warm-white mx-auto my-4 btn-hover whitestone:text-white"
              type="submit"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
