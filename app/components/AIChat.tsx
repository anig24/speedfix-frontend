"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "👋 Hi there. I’m SpeedFix AI.\n📍 Looks like you're in Bangalore.\n🟢 14 technicians are active near you.\nWhat needs fixing today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const aiReply = {
      role: "ai",
      text: generateReply(input),
    };

    setMessages((prev) => [...prev, userMessage, aiReply]);
    setInput("");
  };

  const generateReply = (text: string) => {
    const lower = text.toLowerCase();

    if (lower.includes("ac")) {
      return "AC issue detected. ⚡\nAvailable slots today: 2PM, 5PM.\nEstimated starting price: ₹499.\nShall I confirm a booking?";
    }
    if (lower.includes("maid") || lower.includes("clean")) {
      return "Home cleaning service selected. 🧹\nSingle or duo staff?\nTomorrow morning slots available.";
    }
    if (lower.includes("leak") || lower.includes("plumb")) {
      return "Plumbing issue detected. 🚰\nFastest technician arrival: 28 minutes.\nShall I assign one now?";
    }

    return "I can help with AC repair, plumbing, cleaning, appliance repair and more. Tell me your issue 😊";
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            backgroundColor: "#2563EB",
            color: "white",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          }}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: "fixed",
              bottom: "25px",
              right: "25px",
              width: "350px",
              height: "500px",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(15px)",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "15px",
                background: "#0F172A",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>SpeedFix AI</span>
              <X style={{ cursor: "pointer" }} onClick={() => setOpen(false)} />
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: "15px", overflowY: "auto" }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "12px",
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px 14px",
                      borderRadius: "14px",
                      background:
                        msg.role === "user" ? "#2563EB" : "#E2E8F0",
                      color: msg.role === "user" ? "white" : "black",
                      whiteSpace: "pre-line",
                      fontSize: "14px",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: "10px", display: "flex" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your issue..."
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  marginLeft: "8px",
                  padding: "8px 12px",
                  background: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}