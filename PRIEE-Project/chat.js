document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");

  // Handle Enter key
  window.handleKeyPress = function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // Append message to chat
  function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Send message to backend
  window.sendMessage = async function () {
    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage("user", userMessage);
    input.value = "";

    const typingDiv = document.createElement("div");
    typingDiv.classList.add("bot-message");
    typingDiv.textContent = "Typing...";
    chatMessages.appendChild(typingDiv);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "user123",
          user_message: userMessage,
          user_age: 21,
        }),
      });

      const data = await response.json();
      chatMessages.removeChild(typingDiv);
      appendMessage("bot", data.reply);
    } catch (error) {
      console.error("Error sending message:", error);
      chatMessages.removeChild(typingDiv);
      appendMessage("bot", "⚠️ Error: Could not connect to backend.");
    }
  };

  // Clear chat for new conversation
  window.clearChat = function () {
    chatMessages.innerHTML = "";
    appendMessage("bot", "✨ New chat started. How can I help you?");
  };

  // Toggle sidebar visibility
  window.toggleSidebar = function () {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
  };
});
