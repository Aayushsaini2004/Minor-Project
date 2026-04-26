import React, { useState, useEffect } from 'react'
import { ArrowDown } from 'lucide-react'

export default function WelcomePage({ onScrollToLanding }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const [waveCount, setWaveCount] = useState(0)

  useEffect(() => {
    // Trigger initial animation
    setTimeout(() => setIsAnimating(false), 2000)
    
    // Auto wave animation
    const waveInterval = setInterval(() => {
      setWaveCount(prev => prev + 1)
    }, 3000)

    return () => clearInterval(waveInterval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = window.innerHeight
      const currentScroll = window.scrollY
      const progress = Math.min(currentScroll / maxScroll, 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollDown = () => {
    onScrollToLanding()
  }

  // Calculate slide transformation
  const slideX = -scrollProgress * 100
  const opacity = 1 - scrollProgress

  return (
    <div 
      className="fixed inset-0 z-40 transition-all duration-100"
      style={{
        transform: `translateX(${slideX}%)`,
        opacity: opacity,
        pointerEvents: scrollProgress > 0.9 ? 'none' : 'auto'
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full opacity-20 animate-float-welcome"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Greeting Character */}
        <div className={`relative mb-4 sm:mb-6 md:mb-8 transition-all duration-1000 ${isAnimating ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
          {/* Character Container */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
            {/* Energy rings */}
            <div className="absolute inset-0 rounded-full border-2 sm:border-3 md:border-4 border-dashed border-purple-400/40 animate-spin-slow"></div>
            <div className="absolute inset-2 sm:inset-3 md:inset-4 rounded-full border-2 sm:border-3 md:border-4 border-dashed border-pink-400/40 animate-spin-reverse" style={{ animationDuration: '15s' }}></div>
            
            {/* Pulsing glow */}
            <div className="absolute inset-6 sm:inset-7 md:inset-8 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500 opacity-30 animate-ping"></div>
            
            {/* Main character circle */}
            <div className="absolute inset-10 sm:inset-11 md:inset-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 p-0.5 sm:p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
                
                {/* Animated Character */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-48 xl:h-48">
                    
                    {/* Character Body */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-16 sm:w-24 sm:h-18 md:w-28 md:h-20 lg:w-32 lg:h-24 animate-breathe-welcome">
                      <div className="relative w-full h-full">
                        {/* Futuristic outfit */}
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600 rounded-t-2xl sm:rounded-t-3xl shadow-xl"></div>
                        {/* Glowing lines */}
                        <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-10 sm:h-12 md:h-14 lg:h-16 bg-gradient-to-b from-white to-transparent rounded-full"></div>
                        {/* Tech patterns */}
                        <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border border-sm:border-2 border-white/50 rounded-lg"></div>
                        <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border border-sm:border-2 border-white/50 rounded-lg"></div>
                        {/* Glowing core */}
                        <div className="absolute top-5 sm:top-6 md:top-7 lg:top-8 left-1/2 transform -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full animate-pulse shadow-lg"></div>
                      </div>
                    </div>

                    {/* Character Head */}
                    <div className="absolute top-1 sm:top-1.5 md:top-2 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 animate-breathe-welcome" style={{ animationDelay: '0.2s' }}>
                      <div className="relative w-full h-full bg-gradient-to-b from-orange-100 to-orange-200 rounded-full shadow-xl">
                        {/* Hair - Futuristic style */}
                        <div className="absolute -top-1 sm:-top-1.5 md:-top-2 -left-1 sm:-left-1.5 md:-left-2 -right-1 sm:-right-1.5 md:-right-2 h-10 sm:h-12 md:h-14 lg:h-16 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600 rounded-t-full overflow-hidden">
                          <div className="absolute top-0 left-1 sm:left-1.5 md:left-2 w-2 sm:w-2.5 md:w-3 h-8 sm:h-10 md:h-12 bg-gradient-to-t from-cyan-400 to-blue-400 rotate-12 rounded-full"></div>
                          <div className="absolute top-0 left-5 sm:left-6 md:left-8 w-2 sm:w-2.5 md:w-3 h-10 sm:h-12 md:h-14 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"></div>
                          <div className="absolute top-0 right-5 sm:right-6 md:right-8 w-2 sm:w-2.5 md:w-3 h-10 sm:h-12 md:h-14 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"></div>
                          <div className="absolute top-0 right-1 sm:right-1.5 md:right-2 w-2 sm:w-2.5 md:w-3 h-8 sm:h-10 md:h-12 bg-gradient-to-t from-cyan-400 to-blue-400 -rotate-12 rounded-full"></div>
                          {/* Hair glow */}
                          <div className="absolute top-1 sm:top-1.5 md:top-2 left-2 sm:left-3 md:left-4 w-1.5 sm:w-2 h-4 sm:h-5 md:h-6 bg-white/40 rounded-full rotate-12"></div>
                          <div className="absolute top-1 sm:top-1.5 md:top-2 right-2 sm:right-3 md:right-4 w-1.5 sm:w-2 h-4 sm:h-5 md:h-6 bg-white/40 rounded-full -rotate-12"></div>
                        </div>
                        
                        {/* Eyes - Big and friendly */}
                        <div className="absolute top-7 sm:top-8 md:top-9 lg:top-10 left-2 sm:left-3 md:left-4 w-7 sm:w-8 md:w-9 lg:w-10 h-8 sm:h-9 md:h-10 lg:h-12 bg-white rounded-full overflow-hidden shadow-inner animate-blink-slow border border-sm:border-2 border-cyan-400">
                          <div className="absolute inset-0.5 sm:inset-1 bg-gradient-to-b from-cyan-400 via-blue-400 to-purple-500 rounded-full">
                            <div className="absolute bottom-1 sm:bottom-1.5 md:bottom-2 right-1 sm:right-1.5 md:right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-white rounded-full shadow-lg"></div>
                            <div className="absolute top-1 sm:top-1.5 md:top-2 left-1 sm:left-1.5 md:left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="absolute top-7 sm:top-8 md:top-9 lg:top-10 right-2 sm:right-3 md:right-4 w-7 sm:w-8 md:w-9 lg:w-10 h-8 sm:h-9 md:h-10 lg:h-12 bg-white rounded-full overflow-hidden shadow-inner animate-blink-slow border border-sm:border-2 border-cyan-400">
                          <div className="absolute inset-0.5 sm:inset-1 bg-gradient-to-b from-cyan-400 via-blue-400 to-purple-500 rounded-full">
                            <div className="absolute bottom-1 sm:bottom-1.5 md:bottom-2 right-1 sm:right-1.5 md:right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-white rounded-full shadow-lg"></div>
                            <div className="absolute top-1 sm:top-1.5 md:top-2 left-1 sm:left-1.5 md:left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Eyebrows */}
                        <div className="absolute top-5 sm:top-6 md:top-7 left-3 sm:left-4 md:left-5 w-5 sm:w-6 md:w-7 lg:w-8 h-1 sm:h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transform -rotate-12"></div>
                        <div className="absolute top-5 sm:top-6 md:top-7 right-3 sm:right-4 md:right-5 w-5 sm:w-6 md:w-7 lg:w-8 h-1 sm:h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transform rotate-12"></div>
                        
                        {/* Big smile */}
                        <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-1/2 transform -translate-x-1/2">
                          <div className="w-4 sm:w-5 md:w-6 h-2 sm:h-2.5 md:h-3 border-b-2 sm:border-b-3 md:border-b-4 border-pink-500 rounded-b-full"></div>
                        </div>
                        
                        {/* Blush */}
                        <div className="absolute bottom-5 sm:bottom-6 md:bottom-7 lg:bottom-8 left-1 sm:left-2 md:left-3 w-4 sm:w-5 md:w-6 h-2 sm:h-2.5 md:h-3 bg-pink-400 rounded-full opacity-60 blur-sm"></div>
                        <div className="absolute bottom-5 sm:bottom-6 md:bottom-7 lg:bottom-8 right-1 sm:right-2 md:right-3 w-4 sm:w-5 md:w-6 h-2 sm:h-2.5 md:h-3 bg-pink-400 rounded-full opacity-60 blur-sm"></div>
                        
                        {/* Sparkles */}
                        <div className="absolute top-2 sm:top-2.5 md:top-3 right-2 sm:right-2.5 md:right-3 text-yellow-400 text-xs sm:text-sm animate-pulse">✨</div>
                        <div className="absolute top-3 sm:top-3.5 md:top-4 left-1 sm:left-1.5 md:left-2 text-cyan-400 text-[8px] sm:text-[10px] md:text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
                      </div>
                    </div>

                    {/* Waving hand animation */}
                    <div 
                      className="absolute top-12 sm:top-14 md:top-16 -right-2 sm:-right-3 md:-right-4 animate-wave-hand"
                      style={{ 
                        transformOrigin: 'bottom center',
                        animationDelay: `${waveCount * 0.1}s`
                      }}
                    >
                      <div className="relative">
                        {/* Arm */}
                        <div className="w-2 sm:w-2.5 md:w-3 h-12 sm:h-14 md:h-16 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full transform -rotate-12"></div>
                        {/* Hand */}
                        <div className="absolute -top-1 sm:-top-1.5 md:-top-2 left-1/2 transform -translate-x-1/2 w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full shadow-md">
                          {/* Fingers */}
                          <div className="absolute -top-0.5 sm:-top-1 left-0 w-1 sm:w-1.5 h-2 sm:h-2.5 md:h-3 bg-orange-200 rounded-full transform -rotate-12"></div>
                          <div className="absolute -top-0.5 sm:-top-1 sm:left-1.5 md:left-2 w-1 sm:w-1.5 h-2 sm:h-2.5 md:h-3 bg-orange-200 rounded-full"></div>
                          <div className="absolute -top-0.5 sm:-top-1 right-0 w-1 sm:w-1.5 h-2 sm:h-2.5 md:h-3 bg-orange-200 rounded-full transform rotate-12"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="absolute bottom-1 sm:bottom-1.5 md:bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-green-500/90 to-emerald-500/90 rounded-full backdrop-blur-sm shadow-lg">
                  <span className="inline-block w-1.5 h-1.5 sm:w-2 md:w-2 bg-white rounded-full animate-ping"></span>
                  <span className="text-white text-[10px] sm:text-[11px] md:text-xs font-semibold whitespace-nowrap">AI Assistant Online</span>
                </div>
              </div>
            </div>

            {/* Floating icons */}
            <div className="absolute -top-2 sm:-top-3 md:-top-4 left-1/4 p-1.5 sm:p-2 bg-white rounded-md sm:rounded-lg shadow-lg animate-float-welcome">
              <span className="text-xl sm:text-2xl">👋</span>
            </div>
            <div className="absolute top-1/4 -right-2 sm:-right-3 md:-right-4 p-1.5 sm:p-2 bg-white rounded-md sm:rounded-lg shadow-lg animate-float-welcome" style={{ animationDelay: '1s' }}>
              <span className="text-xl sm:text-2xl">🤖</span>
            </div>
            <div className="absolute bottom-1/4 -left-2 sm:-left-3 md:-left-4 p-1.5 sm:p-2 bg-white rounded-md sm:rounded-lg shadow-lg animate-float-welcome" style={{ animationDelay: '2s' }}>
              <span className="text-xl sm:text-2xl">💙</span>
            </div>
          </div>
        </div>

        {/* Greeting Text */}
        <div className={`text-center transition-all duration-1000 delay-500 ${isAnimating ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 md:mb-4 animate-glow-text px-2">
            Namaste! 🙏
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-purple-200 mb-1 sm:mb-2 px-4">
            Main hoon aapka AI Health Assistant
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-pink-200 mb-6 sm:mb-8 px-4">
            Aapki health meri priority hai! ✨
          </p>
        </div>

        {/* Scroll indicator */}
        <div 
          className={`mt-4 sm:mt-6 md:mt-8 cursor-pointer transition-all duration-1000 delay-1000 ${isAnimating ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}
          onClick={handleScrollDown}
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3 group px-4">
            <span className="text-white text-sm sm:text-base md:text-lg font-medium group-hover:text-purple-300 transition-colors text-center">
              Scroll karke dekhiye
            </span>
            <div className="animate-bounce">
              <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white group-hover:text-purple-300 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes float-welcome {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes breathe-welcome {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.02); }
        }
        @keyframes wave-hand {
          0%, 100% { transform: rotate(-15deg); }
          25% { transform: rotate(15deg); }
          50% { transform: rotate(-10deg); }
          75% { transform: rotate(20deg); }
        }
        @keyframes blink-slow {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        @keyframes glow-text {
          0%, 100% { text-shadow: 0 0 10px rgba(168, 85, 247, 0.5); }
          50% { text-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 0 30px rgba(236, 72, 153, 0.6); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-float-welcome {
          animation: float-welcome 4s ease-in-out infinite;
        }
        .animate-breathe-welcome {
          animation: breathe-welcome 3s ease-in-out infinite;
        }
        .animate-wave-hand {
          animation: wave-hand 1s ease-in-out 3;
        }
        .animate-blink-slow {
          animation: blink-slow 4s ease-in-out infinite;
        }
        .animate-glow-text {
          animation: glow-text 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
      `}</style>
    </div>
  )
}
