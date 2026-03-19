"use client"

import { getSender, getSenderFull } from "../config/ChatLogics"
import { useEffect, useState } from "react"
import api from "../config/api"
import ProfileModal from "./miscellaneous/ProfileModal"
import ScrollableChat from "./ScrollableChat"
import io from "socket.io-client"
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal"
import { ChatState } from "../Context/ChatProvider"

const ENDPOINT = "http://localhost:5000"
var socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [istyping, setIsTyping] = useState(false)

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState()

  const fetchMessages = async () => {
    if (!selectedChat) return

    try {
      setLoading(true)

      const { data } = await api.get(`/api/message/${selectedChat._id}`)
      setMessages(data)
      setLoading(false)

      socket.emit("join chat", selectedChat._id)
    } catch (error) {
      console.error("Failed to Load the Messages:", error)
      setLoading(false)
    }
  }

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id)
      try {
        const messageToSend = newMessage
        setNewMessage("")
        
        // Check if we have a valid chat ID
        if (!selectedChat || !selectedChat._id) {
          console.error("No chat selected")
          return
        }
        
        console.log("Sending message to chat:", selectedChat._id)
        const { data } = await api.post("/api/message", {
          content: messageToSend,
          chatId: selectedChat._id,
        })
        console.log("Message sent successfully:", data)
        socket.emit("new message", data)
        setMessages([...messages, data])
      } catch (error) {
        console.error("Failed to send the Message:", error)
        // Provide user feedback
        alert("Failed to send message. Please try again.")
      }
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))
  }, [])

  useEffect(() => {
    fetchMessages()
    selectedChatCompare = selectedChat
  }, [selectedChat])

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification])
          setFetchAgain(!fetchAgain)
        }
      } else {
        setMessages([...messages, newMessageRecieved])
      }
    })
  })

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }
    const lastTypingTime = new Date().getTime()
    var timerLength = 3000
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              {/* Back button for mobile */}
              <button
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedChat("")}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Chat info */}
              <div className="flex items-center space-x-3">
                {!selectedChat.isGroupChat ? (
                  <>
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold">
                        {getSenderFull(user, selectedChat.users).pic ? (
                          <img
                            src={getSenderFull(user, selectedChat.users).pic || "/placeholder.svg"}
                            alt={getSender(user, selectedChat.users)}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          getSender(user, selectedChat.users).charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{getSender(user, selectedChat.users)}</h3>
                      <p className="text-sm text-green-600">Online</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedChat.chatName}</h3>
                      <p className="text-sm text-gray-500">{selectedChat.users.length} members</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center space-x-2">
              {!selectedChat.isGroupChat ? (
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </ProfileModal>
              ) : (
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              </div>
            ) : (
              <ScrollableChat messages={messages} />
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            {/* Typing indicator */}
            {istyping && (
              <div className="mb-3 flex items-center space-x-2 text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm">Someone is typing...</span>
              </div>
            )}

            {/* Input area */}
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>

              <div className="flex-1 relative">
                <input
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={sendMessage}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>

              <button
                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.key = "Enter"
                  sendMessage(e)
                }}
                disabled={!newMessage.trim()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Connect</h3>
            <p className="text-gray-600 max-w-md">
              Select a conversation from the sidebar to start chatting with your friends and colleagues.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default SingleChat
