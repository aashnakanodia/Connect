import "./App.css";
import { Routes, Route } from "react-router-dom";
import ChatProvider from "./Context/ChatProvider";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";

function App() {
  return (
    <div className="App">
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chats" element={<Chatpage />} />
        </Routes>
      </ChatProvider>
    </div>
  );
}

export default App;
