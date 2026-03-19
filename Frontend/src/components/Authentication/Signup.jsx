"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../config/api"

const Signup = () => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  const navigate = useNavigate()

  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [confirmpassword, setConfirmpassword] = useState()
  const [password, setPassword] = useState()
  const [pic, setPic] = useState()
  const [picLoading, setPicLoading] = useState(false)

  const submitHandler = async () => {
    setPicLoading(true)
    if (!name || !email || !password || !confirmpassword) {
      alert("Please Fill all the Fields")
      setPicLoading(false)
      return
    }
    if (password !== confirmpassword) {
      alert("Passwords Do Not Match")
      setPicLoading(false)
      return
    }

    try {
      const { data } = await api.post("/api/user", {
        name,
        email,
        password,
        pic,
      })

      alert("Registration Successful")
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        pic: data.pic,
        token: data.token,
      }
      localStorage.setItem("userInfo", JSON.stringify(userData))
      setPicLoading(false)
      navigate("/chats")
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed")
      setPicLoading(false)
    }
  }

  const postDetails = (pics) => {
    setPicLoading(true)
    if (pics === undefined) {
      alert("Please Select an Image!")
      setPicLoading(false)
      return
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData()
      data.append("file", pics)
      data.append("upload_preset", "chat-app")
      data.append("cloud_name", "piyushproj")
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString())
          setPicLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setPicLoading(false)
        })
    } else {
      alert("Please Select an Image!")
      setPicLoading(false)
      return
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-600">Join Connect and start connecting</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Full Name</label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                type="email"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  type={show ? "text" : "password"}
                  placeholder="Create a password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-blue-600 transition-colors"
                  onClick={handleClick}
                >
                  {show ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                type={show ? "text" : "password"}
                placeholder="Confirm your password"
                onChange={(e) => setConfirmpassword(e.target.value)}
              />
            </div>

            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Profile Picture</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  type="file"
                  accept="image/*"
                  onChange={(e) => postDetails(e.target.files[0])}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              onClick={submitHandler}
              disabled={picLoading}
            >
              {picLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Sign in here
            </button>
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Signup
