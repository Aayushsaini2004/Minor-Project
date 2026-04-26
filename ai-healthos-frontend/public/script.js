const API_KEY = "AIzaSyDcP1PDzhuEWuE3AkwbdKwkMP_J70F-TUk";



const avatar = document.getElementById("avatar");

// 💬 Add message
function addMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🔊 Speak + Avatar animation
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-IN";

  speech.onstart = () => {
    avatar.classList.add("talking"); // animate
  };

  speech.onend = () => {
    avatar.classList.remove("talking");
  };

  speechSynthesis.speak(speech);
}

// 🤖 AI Doctor
async function getAIResponse(userText) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
You are an AI Doctor Avatar.

Rules:
- Talk like doctor 👨‍⚕️
- Ask symptoms
- Give simple treatment
- Speak Hinglish

Patient: ${userText}
`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
}

// 🚀 Send
async function sendMessage(textInput = null) {
  const input = document.getElementById("user-input");
  const text = textInput || input.value;

  if (!text) return;

  addMessage("🧑: " + text);
  input.value = "";

  const reply = await getAIResponse(text);

  addMessage("👨‍⚕️: " + reply);
  speak(reply);
}

// 🎤 Voice Input
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

function startListening() {
  recognition.start();
}

recognition.onresult = (event) => {
  const text = event.results[0][0].transcript;
  sendMessage(text);
};
