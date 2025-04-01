import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, MessageSquare, PlusCircle, Settings } from "lucide-react";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer API_KEY`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }],
        }),
      });

      const data = await response.json();
      const botReply = data.choices[0]?.message?.content || "Sorry, I couldn't understand that.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: Unable to fetch response." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
          {isSidebarOpen && <h2 className="title">Menu Bar</h2>}
        </div>
        <button className="menu-item" onClick={() => setMessages([])}>
          <PlusCircle size={18} /> {isSidebarOpen && "New Chat"}
        </button>
        <button className="menu-item">
          <MessageSquare size={18} /> {isSidebarOpen && "History"}
        </button>
        <button className="menu-item">
          <Settings size={18} /> {isSidebarOpen && "Settings"}
        </button>
      </aside>

      {/* Chat Container */}
      <main className="chat-container">
        <div className="chat-header">
          <motion.h1 
            className="chat-title"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", width: "100%" }}
          >
           ALTERRA : The Generationally Adaptive Chatbot
          </motion.h1>

          <motion.p 
            className="chat-subtitle"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ textAlign: "center", width: "100%" }}
          >
            Evolving Conversation, Adapting to You
          </motion.p>
        </div>

        <div className="chat-messages" style={{ flexGrow: 1, overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`chat-message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
              style={{
                maxWidth: "75%",
                padding: "10px 15px",
                borderRadius: "20px",
                margin: "5px 10px",
                backgroundColor: msg.sender === "user" ? "#007bff" : "#e5e5ea",
                color: msg.sender === "user" ? "white" : "black",
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                display: "inline-block"
              }}
            >
              {msg.text}
            </motion.div>
          ))}
          {isLoading && <motion.div className="chat-message bot-message">Typing...</motion.div>}
        </div>
      </main>

      {/* Input Area */}
      <div className="input-container" style={{ position: "fixed", bottom: 10, left: "55%", transform: "translateX(-50%)", width: "55%", background: "#fff", padding: "10px", borderRadius: "20px", border: "1px solid #ddd", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ width: "85%", padding: "10px", fontSize: "14px", borderRadius: "15px", border: "1px solid #ccc" }}
        />
        <button onClick={sendMessage} className="send-button" disabled={isLoading} style={{ marginLeft: "8px", padding: "10px 15px", borderRadius: "15px", backgroundColor: "black", color: "white", border: "none", cursor: "pointer" }}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
