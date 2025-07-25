/**
 * @fileoverview Terminal Page - Interactive Developer Mode
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

"use client"

import { useEffect, useState, useRef } from "react"
import Head from "next/head"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"

export default function TerminalPage() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentDirectory, setCurrentDirectory] = useState("~")
  const [isLoading, setIsLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [theme, setTheme] = useState("matrix")
  const [userName] = useState("guest")
  const [hostName] = useState("portfolio-terminal")
  const [isClient, setIsClient] = useState(false)
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  // Fix hydration mismatch by only rendering dynamic content on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Enhanced welcome message with ASCII art
  const welcomeMessage = [
    "╭─────────────────────────────────────────────────────────────╮",
    "│  ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ │",
    "│  ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗│",
    "│  ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║│",
    "│  ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║│",
    "│  ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝│",
    "│  ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ │",
    "│                                                                         │",
    "│           🚀 Welcome to the Interactive Portfolio Terminal 🚀           │",
    "│                                                                         │",
    "│  Type 'help' to see available commands                                  │",
    "│  Type 'about' to learn more about me                                    │",
    "│  Type 'clear' to clear the terminal                                     │",
    "│                                                                         │",
    "╰─────────────────────────────────────────────────────────────────────────╯",
    "",
    "🌟 System initialized successfully...",
    "⚡ All modules loaded and ready to go!",
    "",
  ]

  // Enhanced command system
  const COMMANDS = {
    help: {
      description: "Show available commands",
      action: () => [
        "🔧 Available Commands:",
        "═══════════════════════",
        "",
        "📋 Information:",
        "  help          - Show this help message",
        "  about         - About me and my background",
        "  skills        - Technical skills and expertise",
        "  projects      - View my featured projects",
        "  experience    - Work experience and history",
        "  contact       - Contact information",
        "  resume        - Download my resume",
        "  social        - Social media links",
        "",
        "🎮 System:",
        "  clear         - Clear terminal screen",
        "  whoami        - Display current user info",
        "  date          - Show current date and time",
        "  history       - Show command history",
        "  theme         - Change terminal theme",
        "  pwd           - Print working directory",
        "  ls            - List directory contents",
        "",
        "🚀 Navigation:",
        "  portfolio     - Switch to portfolio mode",
        "  blog          - Switch to blog mode",
        "  home          - Return to main page",
        "",
        "🎯 Fun Commands:",
        "  matrix        - Enter the matrix",
        "  joke          - Random programming joke",
        "  quote         - Inspirational quote",
        "  weather       - Current weather (mock)",
        "  ascii         - Display ASCII art",
        "  cowsay        - Make the cow say something",
        "",
        "💡 Tip: Use ↑/↓ arrow keys to navigate command history",
        "",
      ],
    },

    about: {
      description: "About me",
      action: () => [
        "👨‍💻 About Me",
        "═══════════════",
        "",
        "Hello! I'm a passionate Full-Stack Developer with expertise in:",
        "",
        "🎯 Frontend Technologies:",
        "  • React.js & Next.js - Building modern, responsive UIs",
        "  • TypeScript - Type-safe development",
        "  • Tailwind CSS - Rapid styling and design systems",
        "  • Framer Motion - Smooth animations and interactions",
        "",
        "⚙️ Backend Technologies:",
        "  • Node.js & Express - Scalable server applications",
        "  • Python & Django - Robust web frameworks",
        "  • GraphQL & REST APIs - Efficient data communication",
        "  • MongoDB & PostgreSQL - Database design and optimization",
        "",
        "☁️ DevOps & Tools:",
        "  • Docker & Kubernetes - Containerization and orchestration",
        "  • AWS & Vercel - Cloud deployment and hosting",
        "  • Git & GitHub Actions - Version control and CI/CD",
        "  • Jest & Cypress - Testing and quality assurance",
        "",
        "🚀 What I Love:",
        "  • Building scalable web applications",
        "  • Solving complex problems with elegant solutions",
        "  • Learning new technologies and best practices",
        "  • Contributing to open-source projects",
        "  • Mentoring junior developers",
        "",
        "🎯 Always learning, always coding, always improving!",
        "",
      ],
    },

    skills: {
      description: "Technical skills",
      action: () => [
        "🛠️ Technical Skills Matrix",
        "═══════════════════════════",
        "",
        "Frontend Development:",
        "  ████████████████████ React.js (95%)",
        "  ██████████████████░░ Next.js (90%)",
        "  ████████████████████ JavaScript/TypeScript (95%)",
        "  ██████████████████░░ CSS/Tailwind (90%)",
        "  ████████████████░░░░ Vue.js (80%)",
        "",
        "Backend Development:",
        "  ██████████████████░░ Node.js (90%)",
        "  ████████████████░░░░ Express.js (85%)",
        "  ██████████████░░░░░░ Python (75%)",
        "  ████████████████░░░░ MongoDB (80%)",
        "  ██████████████░░░░░░ PostgreSQL (75%)",
        "",
        "DevOps & Cloud:",
        "  ██████████████░░░░░░ Docker (70%)",
        "  ████████████░░░░░░░░ AWS (60%)",
        "  ████████████████████ Git (95%)",
        "  ██████████████░░░░░░ Kubernetes (65%)",
        "",
        "🏆 Certifications:",
        "  • AWS Certified Developer",
        "  • MongoDB Certified Developer",
        "  • Google Cloud Professional",
        "",
      ],
    },

    projects: {
      description: "View projects",
      action: () => [
        "🚀 Featured Projects",
        "═══════════════════════",
        "",
        "1. 🛒 AI-Powered E-Commerce Platform",
        "   ├─ Full-stack MERN application with AI recommendations",
        "   ├─ Real-time inventory management and analytics",
        "   ├─ Payment integration with Stripe and PayPal",
        "   ├─ Tech: React, Node.js, MongoDB, TensorFlow, Stripe",
        "   ├─ Users: 10,000+ active users",
        "   └─ GitHub: github.com/yourusername/ecommerce-ai",
        "",
        "2. 🤝 Real-Time Collaboration Suite",
        "   ├─ WebRTC-powered video calls and screen sharing",
        "   ├─ Collaborative whiteboards and document editing",
        "   ├─ Real-time messaging and file sharing",
        "   ├─ Tech: Next.js, Socket.io, WebRTC, Redis, PostgreSQL",
        "   ├─ Performance: 99.9% uptime",
        "   └─ Live: collab.yoursite.com",
        "",
        "3. 💻 3D Portfolio Terminal (This App!)",
        "   ├─ Interactive terminal interface with 3D animations",
        "   ├─ Multiple themes and responsive design",
        "   ├─ Command history and auto-completion",
        "   ├─ Tech: React, Three.js, Framer Motion, TypeScript",
        "   ├─ Rating: ⭐⭐⭐⭐⭐ (5.0/5.0)",
        "   └─ GitHub: github.com/yourusername/portfolio-terminal",
        "",
        "4. 📊 Analytics Dashboard",
        "   ├─ Real-time data visualization and reporting",
        "   ├─ Custom chart components and interactive filters",
        "   ├─ Export functionality and scheduled reports",
        "   ├─ Tech: React, D3.js, Node.js, InfluxDB",
        "   └─ Processing: 1M+ data points daily",
        "",
        "💡 Type 'portfolio' to see more projects in visual mode!",
        "",
      ],
    },

    experience: {
      description: "Work experience",
      action: () => [
        "💼 Professional Experience",
        "═══════════════════════════",
        "",
        "🏢 Senior Full Stack Developer @ TechCorp (2022-Present)",
        "   ├─ Lead development of microservices architecture",
        "   ├─ Mentored 8+ junior developers and conducted code reviews",
        "   ├─ Improved application performance by 40% through optimization",
        "   ├─ Implemented CI/CD pipelines reducing deployment time by 60%",
        "   ├─ Technologies: React, Node.js, AWS, Docker, Kubernetes",
        "   └─ Team size: 12 developers",
        "",
        "🚀 Full Stack Developer @ StartupXYZ (2020-2022)",
        "   ├─ Built 3 web applications from concept to production",
        "   ├─ Implemented automated testing reducing bugs by 70%",
        "   ├─ Collaborated with UX team improving user satisfaction by 35%",
        "   ├─ Developed RESTful APIs handling 100K+ requests daily",
        "   ├─ Technologies: Vue.js, Python, PostgreSQL, Redis",
        "   └─ Startup growth: 0 to 50K users",
        "",
        "💻 Junior Developer @ WebAgency (2019-2020)",
        "   ├─ Developed responsive client websites and web applications",
        "   ├─ Learned modern frameworks and best practices",
        "   ├─ Participated in agile development process",
        "   ├─ Contributed to 20+ client projects",
        "   ├─ Technologies: HTML, CSS, JavaScript, PHP, MySQL",
        "   └─ Client satisfaction: 98% positive feedback",
        "",
        "🎓 Education:",
        "   ├─ B.S. Computer Science - University of Technology (2019)",
        "   ├─ Relevant Coursework: Data Structures, Algorithms, Database Systems",
        "   └─ GPA: 3.8/4.0, Magna Cum Laude",
        "",
      ],
    },

    contact: {
      description: "Contact information",
      action: () => [
        "📧 Contact Information",
        "═══════════════════════",
        "",
        "📬 Primary Contact:",
        "  ✉️  Email: hello@developer.com",
        "  📱 Phone: +1 (555) 123-4567",
        "  📍 Location: San Francisco, CA",
        "  🌐 Website: https://portfolio.dev",
        "",
        "🔗 Professional Networks:",
        "  💼 LinkedIn: linkedin.com/in/developer",
        "  🐙 GitHub: github.com/developer",
        "  🐦 Twitter: @developer",
        "  📝 Medium: medium.com/@developer",
        "",
        "💬 Preferred Contact Methods:",
        "  1. Email (fastest response)",
        "  2. LinkedIn message",
        "  3. Phone call (business hours)",
        "",
        "⏰ Response Time:",
        "  • Email: Within 24 hours",
        "  • LinkedIn: Within 48 hours",
        "  • Phone: Same day (if available)",
        "",
        "🤝 Open to:",
        "  • Full-time opportunities",
        "  • Freelance projects",
        "  • Technical consultations",
        "  • Speaking engagements",
        "  • Open source collaborations",
        "",
        "💡 Feel free to reach out for opportunities, collaborations,",
        "   or just to say hello! I love connecting with fellow developers.",
        "",
      ],
    },

    whoami: {
      description: "Current user info",
      action: () => [
        `${userName}@${hostName}`,
        `Current directory: ${currentDirectory}`,
        `Session started: ${isClient ? new Date().toLocaleString() : 'Loading...'}`,
        "Terminal version: 2.0.0",
        "Environment: production",
        "Shell: portfolio-shell",
        `Theme: ${theme}`,
        "",
      ],
    },

    date: {
      description: "Show current date",
      action: () => [isClient ? new Date().toString() : 'Loading...', ""],
    },

    pwd: {
      description: "Print working directory",
      action: () => [`/home/${userName}${currentDirectory === "~" ? "" : currentDirectory}`, ""],
    },

    ls: {
      description: "List directory contents",
      action: () => [
        "📁 projects/",
        "📁 skills/",
        "📁 experience/",
        "📄 about.txt",
        "📄 contact.txt",
        "📄 resume.pdf",
        "🔗 portfolio -> /portfolio",
        "🔗 blog -> /blog",
        "",
      ],
    },

    clear: {
      description: "Clear terminal",
      action: () => {
        setHistory([])
        return []
      },
    },

    history: {
      description: "Show command history",
      action: () => [
        "📜 Command History:",
        "═══════════════════",
        ...commandHistory.map((cmd, i) => `  ${i + 1}. ${cmd}`),
        "",
      ],
    },

    theme: {
      description: "Change terminal theme",
      action: () => {
        const themes = ["matrix", "cyberpunk", "retro", "minimal"]
        const currentIndex = themes.indexOf(theme)
        const nextTheme = themes[(currentIndex + 1) % themes.length]
        setTheme(nextTheme)
        return [`🎨 Theme changed to: ${nextTheme}`, ""]
      },
    },

    matrix: {
      description: "Enter the matrix",
      action: () => [
        "🔴 Entering the Matrix...",
        "",
        "01001000 01100101 01101100 01101100 01101111",
        "01010111 01101111 01110010 01101100 01100100",
        "",
        "⠊⠕⠍⠂ ⠊⠞⠄⠎ ⠁ ⠏⠗⠕⠛⠗⠁⠍⠍⠊⠝⠛ ⠚⠕⠅⠑⠖",
        "",
        "🕶️ Welcome to the Matrix, Neo...",
        "",
        "The Matrix has you... but so does debugging.",
        "There is no spoon... only semicolons.",
        "",
        "💊 Red pill: continue coding",
        "💊 Blue pill: return to terminal",
        "",
        "Choose wisely...",
        "",
      ],
    },

    joke: {
      description: "Random programming joke",
      action: () => {
        const jokes = [
          "Why do programmers prefer dark mode?\nBecause light attracts bugs! 🐛",
          "How many programmers does it take to change a light bulb?\nNone. That's a hardware problem. 💡",
          "Why did the programmer quit his job?\nHe didn't get arrays! 📊",
          "What's a programmer's favorite hangout place?\nFoo Bar! 🍺",
          "Why do Java developers wear glasses?\nBecause they don't C#! 👓",
          "A SQL query goes into a bar, walks up to two tables\nand asks: 'Can I join you?' 🍻",
          "Why don't programmers like nature?\nIt has too many bugs! 🌿🐛",
          "What do you call a programmer from Finland?\nNerdic! 🇫🇮",
        ]
        if (!isClient) return ["😄 Loading joke...", ""]
        const randomIndex = Math.floor(Date.now() / 1000) % jokes.length
        const selectedJoke = jokes[randomIndex]
        return ["😄 " + selectedJoke, ""]
      },
    },

    quote: {
      description: "Inspirational quote",
      action: () => {
        const quotes = [
          '"Code is poetry." - Unknown',
          '"First, solve the problem. Then, write the code." - John Johnson',
          '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
          '"The best error message is the one that never shows up." - Thomas Fuchs',
          '"Simplicity is the ultimate sophistication." - Leonardo da Vinci',
          '"Programs must be written for people to read, and only incidentally for machines to execute." - Harold Abelson',
          '"The most important property of a program is whether it accomplishes the intention of its user." - C.A.R. Hoare',
          '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
        ]
        if (!isClient) return ["💭 Loading quote...", ""]
        const randomIndex = Math.floor(Date.now() / 1000) % quotes.length
        const selectedQuote = quotes[randomIndex]
        return ["💭 " + selectedQuote, ""]
      },
    },

    weather: {
      description: "Current weather",
      action: () => [
        "🌤️ Current Weather (Mock Data)",
        "═══════════════════════════════",
        "",
        "📍 Location: San Francisco, CA",
        "🌡️  Temperature: 22°C (72°F)",
        "☁️  Condition: Partly Cloudy",
        "💧 Humidity: 65%",
        "💨 Wind: 8 km/h SW",
        "👁️  Visibility: 10 km",
        "📊 Pressure: 1013 hPa",
        "",
        "☕ Perfect coding weather!",
        "🌅 Sunrise: 6:42 AM",
        "🌇 Sunset: 7:28 PM",
        "",
      ],
    },

    ascii: {
      description: "Display ASCII art",
      action: () => [
        "🎨 ASCII Art Gallery",
        "",
        "    /\\_/\\  ",
        "   ( o.o ) ",
        "    > ^ <  ",
        "",
        "  ╔══════════════╗",
        "  ║   DEVELOPER   ║",
        "  ║      MODE     ║",
        "  ╚══════════════╝",
        "",
        "    ___",
        "   /   \\",
        "  | o o |",
        "   \\___/",
        "    |||",
        "   /   \\",
        "",
      ],
    },

    cowsay: {
      description: "Make the cow say something",
      action: () => [
        " _________________________________",
        "< Moo! Welcome to my portfolio! >",
        " ---------------------------------",
        "        \\   ^__^",
        "         \\  (oo)\\_______",
        "            (__)\\       )\\/\\",
        "                ||----w |",
        "                ||     ||",
        "",
      ],
    },

    resume: {
      description: "Download resume",
      action: () => [
        "📄 Resume Download",
        "═══════════════════",
        "",
        "🔗 Download links:",
        "  • PDF: https://portfolio.dev/resume.pdf",
        "  • Word: https://portfolio.dev/resume.docx",
        "  • LinkedIn: linkedin.com/in/developer",
        "",
        "📋 Resume highlights:",
        "  • 5+ years of full-stack development",
        "  • Led teams of 8+ developers",
        "  • 20+ successful projects delivered",
        "  • Expert in React, Node.js, and cloud technologies",
        "",
        "💡 Tip: Type 'experience' for detailed work history",
        "",
      ],
    },

    social: {
      description: "Social media links",
      action: () => [
        "🔗 Social Media & Professional Links",
        "═══════════════════════════════════",
        "",
        "💼 Professional:",
        "  🔗 LinkedIn: linkedin.com/in/developer",
        "  🐙 GitHub: github.com/developer",
        "  🌐 Portfolio: https://portfolio.dev",
        "  📧 Email: hello@developer.com",
        "",
        "📝 Content & Writing:",
        "  📝 Medium: medium.com/@developer",
        "  📚 Dev.to: dev.to/developer",
        "  📖 Personal Blog: blog.portfolio.dev",
        "",
        "🎮 Social & Fun:",
        "  🐦 Twitter: @developer",
        "  📷 Instagram: @developer_life",
        "  🎵 Spotify: Developer's Coding Playlist",
        "",
        "🤝 Let's connect and build something amazing together!",
        "",
      ],
    },
  }

  // Navigation commands
  const navigationCommands = {
    portfolio: () => {
      window.location.href = "/portfolio"
    },
    blog: () => {
      window.location.href = "/blog"
    },
    home: () => {
      window.location.href = "/"
    },
  }

  const executeCommand = (command) => {
    const trimmedCommand = command.trim().toLowerCase()

    // Add to command history
    if (trimmedCommand && !commandHistory.includes(trimmedCommand)) {
      setCommandHistory((prev) => [...prev, trimmedCommand])
    }

    // Add command to output history
    const prompt = `${userName}@${hostName}:${currentDirectory}$ `
    const commandOutput = [`${prompt}${command}`]

    if (!trimmedCommand) {
      setHistory((prev) => [...prev, ...commandOutput, ""])
      return
    }

    // Handle navigation commands
    if (navigationCommands[trimmedCommand]) {
      navigationCommands[trimmedCommand]()
      return
    }

    // Execute regular commands
    if (COMMANDS[trimmedCommand]) {
      setIsLoading(true)
      const delay = isClient ? Math.floor(Date.now() / 100) % 300 + 200 : 300
      setTimeout(
        () => {
          const result = COMMANDS[trimmedCommand].action()
          setHistory((prev) => [...prev, ...commandOutput, ...result])
          setIsLoading(false)
          // Scroll to bottom
          setTimeout(() => {
            if (outputRef.current) {
              outputRef.current.scrollTop = outputRef.current.scrollHeight
            }
          }, 50)
        },
        delay,
      ) // Random delay for realism
    } else {
      // Command not found
      setHistory((prev) => [
        ...prev,
        ...commandOutput,
        `bash: ${trimmedCommand}: command not found`,
        "Type 'help' for available commands.",
        "",
      ])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLoading) return
    executeCommand(input)
    setInput("")
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple auto-completion
      const availableCommands = Object.keys(COMMANDS)
      const matches = availableCommands.filter((cmd) => cmd.startsWith(input.toLowerCase()))
      if (matches.length === 1) {
        setInput(matches[0])
      }
    }
  }

  // Initialize terminal - only after client loads
  useEffect(() => {
    if (isClient) {
      setHistory(welcomeMessage)
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [isClient])

  // Keep input focused
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  // Theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case "matrix":
        return {
          bg: "bg-black",
          text: "text-green-400",
          accent: "text-green-300",
          border: "border-green-500",
        }
      case "cyberpunk":
        return {
          bg: "bg-purple-900",
          text: "text-cyan-400",
          accent: "text-pink-400",
          border: "border-cyan-500",
        }
      case "retro":
        return {
          bg: "bg-amber-900",
          text: "text-amber-300",
          accent: "text-orange-400",
          border: "border-amber-500",
        }
      default:
        return {
          bg: "bg-gray-900",
          text: "text-gray-300",
          accent: "text-blue-400",
          border: "border-gray-600",
        }
    }
  }

  const themeStyles = getThemeStyles()

  return (
    <>
      <Head>
        <title>Terminal - Developer Mode | Professional Portfolio</title>
        <meta
          name="description"
          content="Interactive terminal interface for exploring my portfolio. Perfect for developers who love command-line interfaces."
        />
      </Head>

      <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text} font-mono relative overflow-hidden`}>
        {/* Enhanced Mobile-Responsive Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-30 backdrop-blur-lg border-b"
          style={{
            background: `linear-gradient(135deg, ${themeStyles.bg}ee, ${themeStyles.bg}dd)`,
            borderColor: themeStyles.accent
          }}
        >
          <div className="flex items-center justify-between p-3 sm:p-4 max-w-7xl mx-auto">
            <Link
              href="/"
              className={`flex items-center space-x-2 transition-all duration-200 hover:scale-105 ${themeStyles.text} hover:${themeStyles.accent}`}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className={`${themeStyles.bg} ${themeStyles.text} text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50`}
                style={{ borderColor: themeStyles.accent, '--tw-ring-color': themeStyles.accent }}
              >
                <option value="matrix">🔰 Matrix</option>
                <option value="hacker">👨‍💻 Hacker</option>
                <option value="classic">📟 Classic</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`${themeStyles.text} hover:${themeStyles.accent} transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg border font-medium`}
                style={{ 
                  backgroundColor: `${themeStyles.bg}80`,
                  borderColor: themeStyles.accent 
                }}
              >
                {isFullscreen ? "⛶ Exit" : "⛶ Full"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Matrix-style falling characters - Only render on client */}
          {theme === "matrix" && isClient &&
            [...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-green-500 opacity-20 text-xs"
                style={{
                  left: `${(i * 5) % 100}%`,
                  top: "-10%",
                }}
                animate={{
                  y: ["0vh", "110vh"],
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: i * 0.1,
                }}
              >
                {String.fromCharCode(0x30a0 + (i % 96))}
              </motion.div>
            ))}

          {/* Cyberpunk grid */}
          {theme === "cyberpunk" && (
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          )}
        </div>

        {/* Single Unified Terminal Container - Mobile Optimized */}
        <div className={`${isFullscreen ? 'h-screen' : 'h-[calc(100vh-80px)]'} flex flex-col relative z-10`}>
          {/* Terminal Output Area */}
          <motion.div
            ref={outputRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            style={{
              background: `linear-gradient(135deg, ${themeStyles.bg}f0, ${themeStyles.bg}e0)`,
            }}
          >
            <div className="p-3 sm:p-6 space-y-1 sm:space-y-2">
              <AnimatePresence>
                {history.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm break-words"
                    style={{ wordBreak: 'break-all' }}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <motion.div
                    className={`w-2 h-2 ${themeStyles.accent} rounded-full`}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.div
                    className={`w-2 h-2 ${themeStyles.accent} rounded-full`}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                  />
                  <motion.div
                    className={`w-2 h-2 ${themeStyles.accent} rounded-full`}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
                  />
                  <span className={`text-xs sm:text-sm ${themeStyles.text} opacity-70`}>Processing...</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Input Area - Mobile Responsive */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`border-t p-3 sm:p-4`}
            style={{ 
              borderColor: themeStyles.accent,
              background: `linear-gradient(135deg, ${themeStyles.bg}f0, ${themeStyles.bg}e0)`,
            }}
          >
            <form onSubmit={handleSubmit} className="flex items-center space-x-1 sm:space-x-2">
              <span className={`${themeStyles.accent} font-semibold text-xs sm:text-sm truncate flex-shrink-0`}>
                {userName}@{hostName}:{currentDirectory}$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`flex-1 bg-transparent border-none outline-none ${themeStyles.text} caret-current text-xs sm:text-sm min-w-0 px-1`}
                disabled={isLoading}
                autoComplete="off"
                spellCheck="false"
                placeholder="Type 'help' for commands..."
              />
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className={`${themeStyles.accent} flex-shrink-0`}
              >
                █
              </motion.span>
            </form>
          </motion.div>
        </div>

        {/* Mobile optimization hints */}
        <div className="md:hidden fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded-lg shadow-lg backdrop-blur-sm border border-white/20 max-w-xs">
          <div className="flex items-center space-x-2">
            <span>💡</span>
            <span>Rotate to landscape for better view</span>
          </div>
        </div>
      </div>
    </>
  )
}
