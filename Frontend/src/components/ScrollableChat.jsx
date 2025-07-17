"use client"

import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics"
import { ChatState } from "../Context/ChatProvider"

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState()

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col space-y-1 p-4 overflow-y-auto h-full custom-scrollbar">
      {messages &&
        messages.map((m, i) => (
          <div
            className={`flex items-end group ${m.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
            key={m._id}
          >
            {/* Avatar for received messages */}
            {m.sender._id !== user._id &&
              (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                <div className="relative mr-3 mb-1">
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-semibold text-white shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200"
                    title={m.sender?.name || 'User'}
                  >
                    {m.sender?.pic ? (
                      <img
                        src={m.sender.pic}
                        alt={m.sender?.name || 'User'}
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      (m.sender?.name ? m.sender.name.charAt(0).toUpperCase() : '?')
                    )}
                  </div>
                  {/* Online status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              )}

            {/* Always render the message bubble for all messages */}
            <div className={`flex flex-col max-w-xs lg:max-w-md ${m.sender._id === user._id ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 message-bubble ${
                  m.sender._id === user._id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-auto rounded-br-md text-right"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-md text-left"
                }`}
                style={{
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? "2px" : "8px",
                }}
              >
                {/* Sender name for group chats */}
                {m.sender._id !== user._id && !isSameUser(messages, m, i, user._id) && (
                  <div className="text-xs font-semibold text-blue-600 mb-1">{m.sender?.name || 'User'}</div>
                )}
                <div className="text-sm leading-relaxed">{m.content}</div>
                <div className={`text-xs mt-1 ${m.sender._id === user._id ? "text-blue-100" : "text-gray-500"}`}>
                  {formatTime(m.createdAt)}
                </div>
              </div>
              {m.sender._id === user._id && (
                <div className="flex justify-end mt-1 mr-2">
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  )
}

export default ScrollableChat
