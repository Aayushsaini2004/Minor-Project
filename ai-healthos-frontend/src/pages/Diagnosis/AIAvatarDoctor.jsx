import React, { useState, useRef, useEffect } from 'react'
import { Mic, Send, Bot, Sparkles, MessageCircle, Stethoscope, Heart, Activity } from 'lucide-react'

// Get API key from environment variable or use fallback
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDFTDSVyPGVxZChMmcyx8aUKZMTyGS4xYA"

export default function AIAvatarDoctor() {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isTalking, setIsTalking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [avatarPulse, setAvatarPulse] = useState(false)
  const chatBoxRef = useRef(null)

  // Avatar breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarPulse(prev => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Add message to chat
  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender }])
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
      }
    }, 100)
  }

  // Speak text with avatar animation
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = "en-IN"

    speech.onstart = () => {
      setIsTalking(true)
    }

    speech.onend = () => {
      setIsTalking(false)
    }

    speechSynthesis.speak(speech)
  }

  // Get AI response from Gemini API
  const getAIResponse = async (userText) => {
    try {
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
- Give simple treatment advice
- Speak in Hinglish (mix of Hindi and English)
- Be friendly and professional
- Keep responses concise (2-3 sentences)

Patient: ${userText}
`
                  }
                ]
              }
            ]
          })
        }
      )

      // Handle rate limit (429) or other errors
      if (response.status === 429) {
        return "⚠️ API limit reached. Please wait a moment and try again. (Free tier: 60 requests/minute)"
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand. Can you please rephrase?"
    } catch (error) {
      console.error('AI Response Error:', error)
      
      // Return helpful error messages
      if (error.message.includes('429')) {
        return "⚠️ API rate limit exceeded. Please wait 1-2 minutes and try again."
      }
      
      return "Sorry, there was an error connecting to the AI service. Please check your internet connection and try again."
    }
  }

  // Send message
  const sendMessage = async (textInput = null) => {
    const text = textInput || inputText
    
    if (!text.trim()) return

    addMessage(text, 'user')
    setInputText('')

    const reply = await getAIResponse(text)
    addMessage(reply, 'doctor')
    speak(reply)
  }

  // Voice input
  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      setIsListening(true)
      
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript
        setIsListening(false)
        sendMessage(text)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        addMessage("Sorry, couldn't hear you. Please try again.", 'doctor')
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      addMessage("Speech recognition is not supported in your browser.", 'doctor')
    }
  }

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-yellow-300 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl animate-pulse-glow">
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold animate-fade-in-down flex items-center gap-1 sm:gap-2 flex-wrap">
                <span className="truncate">AI Avatar Doctor</span>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-300 animate-pulse flex-shrink-0" />
              </h1>
              <p className="text-white/90 text-xs sm:text-sm md:text-base">Your personal AI health assistant - Chat in Hinglish!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in-up">
        {/* Avatar Section */}
        <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6 sm:p-8 md:p-10 text-center relative overflow-hidden">
          {/* Animated Background Circles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute top-5 left-5 sm:top-10 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl sm:blur-2xl opacity-40 animate-blob ${isTalking ? 'animate-pulse' : ''}`}></div>
            <div className={`absolute top-5 right-5 sm:top-10 sm:right-10 w-20 h-20 sm:w-32 sm:h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl sm:blur-2xl opacity-40 animate-blob animation-delay-2000 ${isTalking ? 'animate-pulse' : ''}`}></div>
            <div className={`absolute -bottom-5 sm:-bottom-10 left-1/2 w-20 h-20 sm:w-32 sm:h-32 bg-violet-400 rounded-full mix-blend-multiply filter blur-xl sm:blur-2xl opacity-40 animate-blob animation-delay-4000 ${isTalking ? 'animate-pulse' : ''}`}></div>
                  
            {/* Floating Icons */}
            <div className="absolute top-2 sm:top-5 left-1/4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
              <Heart className="w-5 h-5 sm:w-8 sm:h-8 text-pink-400 opacity-50" />
            </div>
            <div className="absolute top-10 sm:top-20 right-1/4 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
              <Stethoscope className="w-5 h-5 sm:w-8 sm:h-8 text-purple-400 opacity-50" />
            </div>
            <div className="absolute bottom-10 sm:bottom-20 left-1/3 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
              <Activity className="w-5 h-5 sm:w-8 sm:h-8 text-violet-400 opacity-50" />
            </div>
          </div>
        
          <div className="relative z-10">
            <div className="relative inline-block">
              {/* Outer Glow Ring */}
              <div className={`absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-full blur-2xl sm:blur-3xl transition-all duration-1000 ${
                isTalking ? 'opacity-70 scale-125' : avatarPulse ? 'opacity-40 scale-105' : 'opacity-30 scale-100'
              }`}></div>
                    
              {/* Rotating Ring */}
              <div className={`absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-full opacity-50 blur-sm transition-all duration-1000 ${
                isTalking ? 'animate-spin' : ''
              }`} style={{ animationDuration: '3s' }}></div>
                    
              {/* Avatar Image */}
              <img 
                src="/669726e7b6388b54f9aa2769_66553f0390479b8e5a3fc524_image_CMEex1C1_1716770910814_raw.jpeg" 
                alt="AI Doctor Avatar"
                className={`relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto rounded-full border-4 sm:border-6 border-white shadow-2xl transition-all duration-1000 ${
                  isTalking ? 'scale-110 sm:scale-115 brightness-110' : avatarPulse ? 'scale-105' : 'scale-100'
                }`}
              />
                    
              {/* Status Indicator */}
              <div className={`absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1.5 sm:px-6 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-xl transition-all duration-500 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                isTalking 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse scale-105 sm:scale-110' 
                  : isListening
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white animate-pulse scale-105 sm:scale-110'
                  : 'bg-white text-gray-700 border-2 border-gray-200 scale-100'
              }`}>
                {isTalking ? (
                  <>
                    <span className="text-base sm:text-lg">🔊</span>
                    <span className="hidden sm:inline">Speaking...</span>
                    <span className="sm:hidden">Speaking</span>
                  </>
                ) : isListening ? (
                  <>
                    <span className="text-base sm:text-lg">🎤</span>
                    <span className="hidden sm:inline">Listening...</span>
                    <span className="sm:hidden">Listening</span>
                  </>
                ) : (
                  <>
                    <span className="text-base sm:text-lg">✨</span>
                    <span className="hidden sm:inline">Ready to Help</span>
                    <span className="sm:hidden">Ready</span>
                  </>
                )}
              </div>
            </div>
        
            {/* Sound Wave Animation */}
            {isTalking && (
              <div className="mt-6 sm:mt-10 flex justify-center items-end space-x-1 sm:space-x-1.5 h-8 sm:h-10">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 sm:w-2 bg-gradient-to-t from-purple-600 via-pink-600 to-violet-600 rounded-full animate-pulse shadow-lg"
                    style={{
                      animationDelay: `${i * 80}ms`,
                      animationDuration: '1s',
                      height: `${Math.random() * 24 + 8}px`
                    }}
                  ></div>
                ))}
              </div>
            )}
        
            {/* Listening Wave */}
            {isListening && (
              <div className="mt-6 sm:mt-10 flex justify-center items-center space-x-1.5 sm:space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping"
                    style={{ animationDelay: `${i * 200}ms`, animationDuration: '1.5s' }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Box */}
        <div 
          ref={chatBoxRef}
          className="h-64 sm:h-80 md:h-96 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-gray-50 via-white to-gray-50 space-y-3 sm:space-y-4"
        >
          {messages.length === 0 ? (
            <div className="text-center mt-8 sm:mt-12 animate-fade-in">
              {/* Animated Welcome Icon */}
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-purple-400 rounded-full blur-xl sm:blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center mx-auto shadow-xl border-4 border-white">
                  <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-purple-600 animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
              </div>
              
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 animate-fade-in-down">👋 Hello! I'm your AI Doctor</p>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">Tell me about your symptoms or health concerns</p>
              
              {/* Suggestion Chips */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {['I have a headache', 'Feeling feverish', 'Stomach pain', 'Cold and cough'].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(suggestion)}
                    className="px-3 py-2 sm:px-5 sm:py-3 bg-white border-2 border-purple-200 text-purple-700 rounded-full hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 shadow-md hover:shadow-xl text-xs sm:text-sm font-semibold animate-fade-in-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className="mr-1 sm:mr-2 text-sm sm:text-base">💬</span>
                    <span className="hidden xs:inline sm:inline">{suggestion}</span>
                    <span className="xs:hidden sm:hidden">{suggestion.split(' ').slice(0, 2).join(' ')}...</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`flex items-end gap-1.5 sm:gap-2 max-w-[85%] sm:max-w-xs md:max-w-md ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar Icon */}
                  {msg.sender === 'doctor' && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  )}
                  
                  {/* Message Bubble */}
                  <div
                    className={`px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                        : 'bg-white border-2 border-purple-100 rounded-bl-none'
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  
                  {/* User Icon */}
                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white text-[10px] sm:text-xs font-bold">You</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Controls */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-white to-gray-50 border-t-2 border-gray-100">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your symptoms or question..."
                className="w-full px-4 py-3 sm:px-5 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-xs sm:text-sm shadow-sm hover:shadow-md"
              />
              <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-[10px] sm:text-xs text-gray-400 hidden sm:block">
                Press Enter ↵
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim()}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
              <button
                onClick={startListening}
                disabled={isListening}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg transform hover:scale-105 disabled:opacity-50 ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl'
                }`}
                title="Voice Input"
              >
                <Mic className={`w-4 h-4 sm:w-5 sm:h-5 ${isListening ? 'animate-bounce' : ''}`} />
                <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Voice'}</span>
              </button>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3 text-center font-medium flex items-center justify-center gap-1 sm:gap-2">
            <span className="text-sm sm:text-lg">💡</span>
            <span className="hidden xs:inline">Tip: You can speak in Hindi or English - I understand both!</span>
            <span className="xs:hidden">Speak in Hindi or English!</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 animate-pulse" />
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 border-2 border-yellow-300 rounded-xl p-6 animate-fade-in shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-start gap-3">
          <div className="bg-yellow-100 p-3 rounded-xl flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <p className="text-sm text-yellow-800 font-bold mb-1">Medical Disclaimer</p>
            <p className="text-sm text-yellow-700 leading-relaxed">
              This AI assistant provides general health information only. 
              Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
