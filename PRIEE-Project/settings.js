// Default state storage
const state = {
    conversationStyle: false,
    theme: false,
    memory: false,
    language: 'en'
  };
  
  // Toggle Listeners
  document.getElementById('conversationToggle').addEventListener('change', (e) => {
    state.conversationStyle = e.target.checked;
    console.log("Conversation Style:", state.conversationStyle ? "Formal" : "Casual");
  });
  
  document.getElementById('themeToggle').addEventListener('change', (e) => {
    state.theme = e.target.checked;
    document.body.style.backgroundColor = state.theme ? "black" : "#F7E7CA";
    document.body.style.color = state.theme ? "white" : "black";
  });
  
  document.getElementById('memoryToggle').addEventListener('change', (e) => {
    state.memory = e.target.checked;
    console.log("Chat Memory:", state.memory ? "On" : "Off");
  });
  
  document.getElementById('languageSelect').addEventListener('change', (e) => {
    state.language = e.target.value;
    console.log("Language selected:", state.language);
  });
  