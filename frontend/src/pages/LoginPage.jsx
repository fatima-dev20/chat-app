import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { MessagesSquare } from "lucide-react";
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreed, setAgreed] = useState(false)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (currState === "Sign up" && !agreed) {
      alert("Please agree to the terms and privacy policy")
      return
    }

    try {
      await login(
        currState === "Sign up" ? "signup" : "login",
        { fullName, email, password },
        navigate
      )
    } catch (error) {
      console.error("Authentication error:", error)
    }
  }

  const switchState = () => {
    setCurrState(currState === "Sign up" ? "Login" : "Sign up")
    setAgreed(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080B18] px-4 py-10 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute w-80 h-80 bg-purple-600/20 blur-[120px] rounded-full top-[-80px] left-[-60px]" />

      <div className="absolute w-80 h-80 bg-indigo-500/20 blur-[120px] rounded-full bottom-[-80px] right-[-60px]" />

      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 bg-white/[0.04] border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-violet-600/20 to-indigo-600/10">

          <div>
             <div className="flex items-center gap-2 mb-14">
            <MessagesSquare
              size={38}
              className="text-[#6316c2]"
              strokeWidth={2.5}
            />

            <h1 className="text-2xl font-bold text-white">
              Chat System
            </h1>
          </div>
          

            <h1 className="text-4xl font-bold text-white leading-tight">
              Connect with people,
              <span className="block text-violet-400">
                anytime, anywhere.
              </span>
            </h1>

            <p className="text-gray-400 mt-5 leading-7">
              Your conversations deserve a better space.
              Stay connected and share moments with the people
              who matter.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 rounded-2xl p-5">
            <p className="text-gray-300 text-sm">
              "Great conversations start with a simple hello."
            </p>

            <p className="text-violet-400 text-xs mt-3">
              — Your messaging experience
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-7 sm:p-10 md:p-12 flex flex-col justify-center">

          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-8">
            <img
              src={assets.logo_big}
              alt="Logo"
              className="w-32"
            />
          </div>

          <div className="mb-8">
            <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Welcome to Connectify
            </p>

            <h2 className="text-3xl font-bold text-white">
              {currState === "Sign up"
                ? "Create Account"
                : "Welcome Back"}
            </h2>

            <p className="text-gray-400 mt-2 text-sm">
              {currState === "Sign up"
                ? "Join us and start connecting today."
                : "Login to continue your conversations."}
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col gap-5"
          >

            {/* Full Name */}
            {currState === "Sign up" && (
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Full Name
                </label>

                <input
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="w-full p-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Email Address
              </label>

              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="name@example.com"
                required
                className="w-full p-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Password
              </label>

              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter your password"
                required
                className="w-full p-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
              />
            </div>

            {/* Terms Checkbox */}
            {currState === "Sign up" && (
              <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer">

                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 accent-violet-500"
                  required
                />

                <span>
                  I agree to the terms of use and privacy policy.
                </span>

              </label>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-600/20 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/30 active:scale-[0.98] transition-all duration-200"
            >
              {currState === "Sign up"
                ? "Create Account"
                : "Login to Account"}
            </button>

          </form>

          {/* Switch Login / Signup */}
          <div className="mt-8 text-center text-sm text-gray-400">

            {currState === "Sign up"
              ? "Already have an account? "
              : "Don't have an account? "}

            <button
              type="button"
              onClick={switchState}
              className="text-violet-400 font-semibold hover:text-violet-300 transition"
            >
              {currState === "Sign up" ? "Login" : "Sign Up"}
            </button>

          </div>

          <p className="text-center text-xs text-gray-600 mt-8">
            © 2026 Connectify. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginPage