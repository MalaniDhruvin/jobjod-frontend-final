// components/Messages.jsx
import Avatar from "../image/dashboard.png";
import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import { ChevronRightIcon, ImageIcon, Paperclip, Smile } from "lucide-react";
import { IoMdSend } from "react-icons/io";
import useMediaQuery from "./hooks/useMediaQuery";
import { USER_BASE_URL } from "../config";
import axios from "axios";

const Messages = () => {
  // Dummy recruiter for testing
  const dummyRecruiter = {
    id: 1,
    title: "Recruiter Jane Doe",
    avatarUrl: Avatar,
    lastMessage: "Hi! I'm a recruiter. Let's chat!",
    lastTimestamp: new Date().toISOString(),
    isPinned: false,
    online: true,
  };
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeTab, setActiveTab] = useState("focused");
  const [conversations, setConversations] = useState([dummyRecruiter]);
  const [chatMessages, setChatMessages] = useState([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const fileInputRef = useRef(null);

  // Fetch conversations
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${USER_BASE_URL}/messages/${userId}/conversations`, fetchOptions)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setConversations([dummyRecruiter, ...list]);
      })
      .catch(console.error);
  }, [userId]);
  

  // Load messages
  useEffect(() => {
    if (!selectedChat || !userId) return;
    setChatMessages([]);
  
    if (selectedChat === dummyRecruiter.id) {
      setChatMessages([
        {
          id: 'd1',
          sender: 'other',
          text: "Hello! Are you available for a quick call?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  
    axios
      .get(`${USER_BASE_URL}/messages/${userId}/conversations/${selectedChat}/messages`, fetchOptions)
      .then((res) => {
        const msgs = Array.isArray(res.data) ? res.data : res.data.data || [];
        setChatMessages((prev) =>
          selectedChat === dummyRecruiter.id ? [...prev, ...msgs] : msgs
        );
      })
      .catch(console.error);
  }, [selectedChat, userId]);
  

  const triggerFileInput = () => fileInputRef.current.click();
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) console.log("File selected:", file.name);
  };
  const openChat = (id) => setSelectedChat(id);
  const closeChat = () => {
    setSelectedChat(null);
    setChatMessages([]);
  };
  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Send
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
  
    try {
      const response = await axios.post(
        `${USER_BASE_URL}/messages/${userId}/conversations/${selectedChat}/messages`,
        { text: messageText.trim() },
        fetchOptions
      );
  
      const newMsg = response.data.message || response.data;
      setChatMessages((msgs) => [...msgs, newMsg]);
      setMessageText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };
  
  

  // UI
  const renderMessageList = () => (
    <div className="flex flex-col h-full bg-white border-t border-gray-200">
      <div className="flex items-center px-3 py-3 border-b">
        <span className="text-sm font-medium mr-4">Messages</span>
        <span
          className={`px-2 py-1 rounded-full mr-4 cursor-pointer ${
            activeTab === "focused" ? "bg-blue-100 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("focused")}
        >
          Focused
        </span>
        <span
          className={`px-2 py-1 rounded-full cursor-pointer ${
            activeTab === "others" ? "bg-blue-100 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("others")}
        >
          Others
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations
          .filter((c) => (activeTab === "focused" ? c.isPinned : true))
          .map((conv) => (
            <div
              key={conv.id}
              className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer border-b"
              onClick={() => openChat(conv.id)}
            >
              <div className="relative">
                <img className="w-10 h-10 rounded-full" src={conv.avatarUrl} alt="avatar" />
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <p className="font-medium text-gray-900 truncate">{conv.title}</p>
                  <p className="text-xs text-gray-500">{formatTime(conv.lastTimestamp)}</p>
                </div>
                <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            </div>
          ))}
      </div>
    </div>
  );

  const renderChatView = () => (
    <div className="flex flex-col h-full bg-white border-t">
      <div className="px-4 py-2 flex items-center border-b">
        <button onClick={closeChat} className="mr-2">
          &lt;
        </button>
        <img className="w-8 h-8 rounded-full mr-2" src={
          conversations.find(c => c.id === selectedChat)?.avatarUrl
        } alt="avatar" />
        <div>
          <p className="font-medium">
            {conversations.find(c => c.id === selectedChat)?.title}
          </p>
          <p className="text-xs text-gray-500">online</p>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${msg.sender === "me" ? "justify-end" : ""}`}
          >
            {msg.sender !== "me" && <img className="w-8 h-8 rounded-full mr-2" src={Avatar} />}
            <div
              className={`${
                msg.sender === "me" ? "bg-blue-500 text-white" : "bg-gray-200"
              } p-3 rounded-2xl max-w-xs`}
            >
              {msg.text || msg.message}
            </div>
            {msg.sender === "me" && <img className="w-8 h-8 rounded-full ml-2" src={Avatar} />}
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t flex items-center">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message"
          className="flex-1 px-3 py-2 rounded-full border focus:outline-none"
        />
        <button onClick={triggerFileInput} className="ml-2">
          <Paperclip />
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
        <button onClick={handleSendMessage} className="ml-2">
          <IoMdSend />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        {!isMobile ? (
          <div className="flex w-full">
            <div className="w-80 border-r">{renderMessageList()}</div>
            <div className="flex-1">
              {selectedChat ? renderChatView() : <div className="flex items-center justify-center h-full text-gray-500">Select a conversation</div>}
            </div>
          </div>
        ) : (
          <div className="w-full">
            {selectedChat ? renderChatView() : renderMessageList()}
          </div>
        )}
      </div>
    </>
  );
};

export default Messages;
