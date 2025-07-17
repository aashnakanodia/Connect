"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../config/api"
import ChatLoading from "../ChatLoading"
import ProfileModal from "./ProfileModal"
import UserListItem from "../userAvatar/UserListItem"
import { ChatState } from "../../Context/ChatProvider"
import '@fortawesome/fontawesome-free/css/all.min.css';

function SideDrawer() {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)

  const { setSelectedChat, user, notification, setNotification, chats, setChats } = ChatState()

  const navigate = useNavigate()

  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  const handleSearch = async () => {
    if (!search) {
      alert("Please Enter something in search")
      return
    }

    try {
      setLoading(true)

      const { data } = await api.get(`/api/user?search=${search}`)

      setLoading(false)
      setSearchResult(Array.isArray(data) ? data : [])
    } catch (error) {
      alert(error.response?.data?.message || "Failed to Load the Search Results")
      setLoading(false)
      setSearchResult([])
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
      const { data } = await api.post(`/api/chat`, { userId })

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
      setSelectedChat(data)
      setLoadingChat(false)
      setOpenDrawer(false)
    } catch (error) {
      alert(error.response?.data?.message || "Error fetching the chat")
    }
  }

  return (
    <>
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="flex justify-between items-center px-6 py-4">
          <button
            className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
            onClick={() => setOpenDrawer(true)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Search Users</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ChatSphere
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                <i className="fas fa-envelope w-6 h-6"></i>
                {notification.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {notification.length}
                  </span>
                )}
              </button>
            </div>

            {/* Profile & Logout */}
            <ProfileModal user={user}>
              <div className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer">
                <img
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  src={user.pic || "/placeholder.svg"}
                  alt={user.name}
                />
                <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            </ProfileModal>

            <button
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={logoutHandler}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Search Drawer */}
      {openDrawer && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setOpenDrawer(false)}></div>
          <div className="absolute left-0 top-0 w-96 h-full bg-white shadow-2xl">
            <div className="p-6 h-full flex flex-col">
              {/* Drawer Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Search Users</h2>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => setOpenDrawer(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search Input */}
              <div className="flex space-x-3 mb-6">
                <input
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <ChatLoading />
                ) : (
                  <div className="space-y-2">
                    {Array.isArray(searchResult) && searchResult.length > 0
                      ? searchResult.map((user) => (
                          <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                        ))
                      : search &&
                        !loading && (
                          <div className="text-center py-8 text-gray-500">
                            <svg
                              className="w-12 h-12 mx-auto mb-4 text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                            <p>No users found</p>
                          </div>
                        )}
                    {loadingChat && (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SideDrawer
