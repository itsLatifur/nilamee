import { register } from "../store/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("profileImage", profileImage);
    dispatch(register(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, loading, isAuthenticated]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfileImagePreview(reader.result);
      setProfileImage(file);
    };
  };

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
        <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 dark:backdrop-blur-sm whitestone:backdrop-blur-xl mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-2xl">
          <h1
            className={`text-golden-500 whitestone:text-gray-900 text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
          >
            Register
          </h1>
          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={handleRegister}
          >
            <p className="font-semibold text-xl md:text-2xl">
              Personal Details
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white focus:border-b-golden-300 transition-all"
                />
              </div>
              <div className="flex flex-col sm:flex-1">
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
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                  Phone
                </label>
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white focus:border-b-golden-300 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white focus:border-b-golden-300 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white focus:border-b-golden-300 transition-all"
                >
                  <option value="">Select Role</option>
                  <option value="Auctioneer">Auctioneer</option>
                  <option value="Bidder">Bidder</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-1 gap-2">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Profile Image{" "}
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={
                    profileImagePreview
                      ? profileImagePreview
                      : "/imageHolder.jpg"
                  }
                  alt="profileImagePreview"
                  className="w-14 h-14 rounded-full"
                />
                <input type="file" onChange={imageHandler} />
              </div>
            </div>

            <button
              className="bg-burgundy-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 w-[420px] font-semibold text-xl transition-all duration-300 py-2 px-4 rounded-md text-warm-white whitestone:!text-white mx-auto lg:w-[640px] my-4 btn-hover"
              type="submit"
              disabled={loading}
            >
              {loading && "Registering..."}
              {!loading && "Register"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SignUp;
