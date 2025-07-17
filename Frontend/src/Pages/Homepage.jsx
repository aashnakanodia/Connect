"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Login from "../components/Authentication/Login"
import Signup from "../components/Authentication/Signup"

function Homepage() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"))
    if (user && location.pathname === "/") navigate("/chats")
  }, [navigate, location])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              ChatSphere
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with friends and family around the world. Experience seamless communication with our modern chat
              platform.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Section - Only Buttons */}
      <div className="flex items-center justify-center px-4 pb-16">
        <div className="max-w-md w-full flex flex-col items-center space-y-6">
          <button
            className="w-64 py-4 px-8 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            className="w-64 py-4 px-8 rounded-xl font-bold text-lg bg-white text-blue-700 border-2 border-blue-600 shadow-lg hover:bg-blue-50 transition-all duration-200"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Homepage
