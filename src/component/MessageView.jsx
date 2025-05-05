import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Avatar from "../image/dashboard.png";
import Navbar from "./Navbar";
import { ChevronRightIcon, Paperclip } from "lucide-react";
import { IoMdSend } from "react-icons/io";
import useMediaQuery from "./hooks/useMediaQuery";
import { USER_BASE_URL, BASE_URL } from "../config";
import axios from "axios";

const MessageView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType"); // "jobseeker" or "recruiter"

  const targetUserId = userType === "Super Admin" && id ? id : userId;

  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const [activeTab, setActiveTab] = useState("focused");
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [peerInfo, setPeerInfo] = useState({});
  const [messageText, setMessageText] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const fileInputRef = useRef(null);

  // 1️⃣ Fetch all conversations once
  useEffect(() => {
    if (!targetUserId) return;
  
    const fetchConversationsWithPeerInfo = async () => {
      try {
        // 1️⃣ Fetch raw conversation list
        const convRes = await axios.get(
          `${USER_BASE_URL}/messages/${targetUserId}/conversations`,
          fetchOptions
        );
        const raw = Array.isArray(convRes.data)
          ? convRes.data
          : convRes.data.data || [];
  
        // 2️⃣ Normalize to minimal convo objects
        const convs = raw.map((c) => ({
          peerId: c.peerId,
          lastMessage: c.lastMessage,
          lastTimestamp: c.lastTimestamp,
          online: c.online,
        }));
  
        // 3️⃣ For each convo, try user API first, then company if no data
        const peerInfoPromises = convs.map(async (c) => {
          // try user endpoint
          try {
            const userRes = await axios.get(
              `${USER_BASE_URL}/users/${c.peerId}`,
              fetchOptions
            );
            const userInfo = userRes.data.data || userRes.data;
            if (userInfo && Object.keys(userInfo).length) {
              return {
                name: userInfo.fullName,
                avatar: userInfo.avatarUrl,
              };
            }
          } catch (_) { /* ignore */ }
  
          // fallback to company endpoint
          try {
            const compRes = await axios.get(
              `${BASE_URL}/company/${c.peerId}`,
              fetchOptions
            );
            const compInfo = compRes.data.data || compRes.data;
            if (compInfo && Object.keys(compInfo).length) {
              return {
                name: compInfo.companyName,
                avatar: compInfo.logoUrl,
              };
            }
          } catch (_) { /* ignore */ }
  
          // last‐resort empty
          return { name: "Unknown", avatar: Avatar };
        });
  
        const peers = await Promise.all(peerInfoPromises);
  
        // 4️⃣ Zip them back into your conversation list
        const enriched = convs.map((c, i) => ({
          id: c.peerId,
          peerId: c.peerId,
          title: peers[i].name,
          avatarUrl: peers[i].avatar,
          online: c.online,
          lastMessage: c.lastMessage,
          lastTimestamp: c.lastTimestamp,
        }));
  
        // 5️⃣ Commit to state
        setConversations(enriched);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };
  
    fetchConversationsWithPeerInfo();
  }, [targetUserId, token]);
  

  // 3️⃣ Whenever you select a chat, load its messages + peerInfo
  useEffect(() => {
    if (!selectedChat || !targetUserId) return;
  
    // 1️⃣ Fetch messages
    setChatMessages([]);
    axios
      .get(
        `${USER_BASE_URL}/messages/${targetUserId}/conversations/${selectedChat}/messages`,
        fetchOptions
      )
      .then((res) => {
        const msgs = Array.isArray(res.data) ? res.data : res.data.data || [];
        setChatMessages(msgs);
      })
      .catch(console.error);
  
    // 2️⃣ Fetch peerInfo: try users first, then company
    (async () => {
      try {
        // Try jobseeker endpoint
        const userRes = await axios.get(
          `${USER_BASE_URL}/users/${selectedChat}`,
          fetchOptions
        );
        const userInfo = userRes.data.data || userRes.data || null;
  
        if (userInfo) {
          setPeerInfo(userInfo);
          return;
        }
      } catch (err) {
        // ignore and fall back
      }
  
      try {
        // Fallback to company endpoint
        const compRes = await axios.get(
          `${BASE_URL}/company/${selectedChat}`,
          fetchOptions
        );
        const compInfo = compRes.data.data || compRes.data || {};
        setPeerInfo(compInfo);
      } catch (err) {
        console.error("Error fetching company info:", err);
      }
    })();
  }, [selectedChat, targetUserId, token]);
  

  const formatTime = (ts) =>
    ts
      ? new Date(ts).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      const res = await axios.post(
        `${USER_BASE_URL}/messages/${userId}/${selectedChat}`,
        { text: messageText.trim() },
        fetchOptions
      );
      const newMsg = res.data.message || res.data;
      setChatMessages((m) => [...m, newMsg]);
      setMessageText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const openChat = (convId) => {
    setSelectedChat(convId);
    // if (id) navigate(`/messageView/${convId}`);
  };
  const closeChat = () => {
    setSelectedChat(null);
    setChatMessages([]);
    setPeerInfo({});
    if (id) navigate("/Messages");
  };

  // Truncate + slicing logic
  const sorted = [...conversations].sort(
    (a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
  );
  const displayedConversations =
    activeTab === "focused" ? sorted.slice(0, 8) : sorted;

  // Renderers
  const renderMessageList = () => (
    <div className="flex flex-col h-full bg-white border-t border-gray-200">
      <div className="flex items-center px-3 py-3 border-b">
        <span className="text-sm font-medium mr-4">Messages</span>
        {["focused", "others"].map((tab) => (
          <span
            key={tab}
            className={`px-2 py-1 rounded-full mr-4 cursor-pointer ${
              activeTab === tab ? "bg-blue-100 text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "focused" ? "Focused" : "Others"}
          </span>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {displayedConversations.map((conv) => {
          const isActive = conv.id === selectedChat;
          const avatar = isActive
            ? peerInfo.avatarUrl || Avatar
            : conv.avatarUrl || Avatar;
          const title = isActive ? peerInfo.fullName || conv.title : conv.title;
          return (
            <div
              key={conv.id}
              className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer border-b"
              onClick={() => openChat(conv.id)}
            >
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full"
                  src={avatar}
                  alt="avatar"
                />
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <p className="font-medium text-gray-900 truncate">{title}</p>
                  <p className="text-xs text-gray-500">
                    {formatTime(conv.lastTimestamp)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {conv.lastMessage}
                </p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderChatView = () => (
    <div className="flex flex-col h-full bg-white border-t">
      <div className="px-4 py-2 flex items-center border-b">
        <button onClick={closeChat} className="mr-2">
          &lt;
        </button>
        <img
          className="w-8 h-8 rounded-full mr-2"
          src={peerInfo.avatarUrl || Avatar}
          alt="avatar"
        />
        <div>
          <p className="font-medium">
            {peerInfo.fullName || peerInfo.companyName}
          </p>
          <p className="text-xs text-gray-500">
            {peerInfo.online ? "online" : "offline"}
          </p>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${msg.sender === "me" ? "justify-end" : ""}`}
          >
            {msg.sender !== "me" && (
              <img
                className="w-8 h-8 rounded-full mr-2"
                src={peerInfo.avatarUrl || Avatar}
                alt="avatar"
              />
            )}
            <div
              className={`${
                msg.sender === "me" ? "bg-blue-500 text-white" : "bg-gray-200"
              } p-3 rounded-2xl max-w-xs`}
            >
              {msg.text || msg.message}
            </div>
            {msg.sender === "me" && (
              <img
                className="w-8 h-8 rounded-full ml-2"
                src={Avatar}
                alt="avatar"
              />
            )}
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
        <button onClick={() => fileInputRef.current.click()} className="ml-2">
          <Paperclip />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) =>
            e.target.files[0] && console.log("File:", e.target.files[0].name)
          }
        />
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
              {selectedChat ? (
                renderChatView()
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a conversation
                </div>
              )}
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

export default MessageView;
