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
import { ArrowLeft, Terminal, Monitor, Wifi, WifiOff } from "lucide-react"
import PortfolioService from '../services/portfolio-service'

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
  const [portfolioData, setPortfolioData] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('connected')
  const [terminalStartTime] = useState(new Date())
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  // Fix hydration mismatch by only rendering dynamic content on client
  useEffect(() => {
    setIsClient(true)
    loadPortfolioData()
  }, [])

  // Load portfolio data from backend
  const loadPortfolioData = async () => {
    try {
      setConnectionStatus('connecting')
      const response = await PortfolioService.getVisitorPortfolio()
      if (response.success) {
        setPortfolioData(response.data)
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('error')
        console.error('Failed to load portfolio data:', response.message)
      }
    } catch (error) {
      setConnectionStatus('error')
      console.error('Error loading portfolio data:', error)
    }
  }

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
    "⚡ Loading portfolio data from backend...",
    connectionStatus === 'connected' ? "✅ Backend connection established" : 
    connectionStatus === 'connecting' ? "🔄 Connecting to backend..." : "❌ Backend connection failed",
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
        "  contact       - Contact information",
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
        "  status        - System and connection status",
        "  reload        - Reload portfolio data from backend",
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
        "🔄 Tip: Use 'reload' to refresh data from backend",
        "",
      ],
    },

    about: {
      description: "About me",
      action: () => {
        if (!portfolioData) {
          return ["❌ Portfolio data not loaded. Try running 'reload' command.", ""]
        }
        
        const personalInfo = portfolioData.personalInfo || {}
        const skills = portfolioData.skills || []
        
        return [
          `👨‍💻 About ${personalInfo.name || 'Developer'}`,
          "═══════════════",
          "",
          personalInfo.bio || "Full-Stack Developer passionate about creating amazing digital experiences.",
          "",
          `📍 Location: ${personalInfo.location || 'Not specified'}`,
          `💼 Title: ${personalInfo.title || 'Full-Stack Developer'}`,
          `📧 Email: ${personalInfo.email || 'Not specified'}`,
          "",
          "🎯 Core Technologies:",
          ...skills.slice(0, 8).map(skill => `  • ${skill.name} - ${skill.level}% proficiency`),
          "",
          "🚀 What drives me:",
          "  • Building scalable web applications",
          "  • Solving complex problems with elegant solutions", 
          "  • Learning new technologies and best practices",
          "  • Creating meaningful user experiences",
          "",
          "🎯 Always learning, always coding, always improving!",
          "",
        ]
      },
    },

    skills: {
      description: "Technical skills",
      action: () => {
        if (!portfolioData?.skills) {
          return ["❌ Skills data not loaded. Try running 'reload' command.", ""]
        }
        
        const skills = portfolioData.skills
        const categories = {}
        
        // Group skills by category
        skills.forEach(skill => {
          const category = skill.category || 'Other'
          if (!categories[category]) {
            categories[category] = []
          }
          categories[category].push(skill)
        })
        
        const result = [
          "🛠️ Technical Skills Matrix",
          "═══════════════════════════",
          "",
        ]
        
        Object.entries(categories).forEach(([category, categorySkills]) => {
          result.push(`${category}:`)
          categorySkills.forEach(skill => {
            const barLength = Math.floor(skill.level / 5)
            const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength)
            result.push(`  ${bar} ${skill.name} (${skill.level}%)`)
          })
          result.push("")
        })
        
        result.push("🏆 Expertise Level:")
        result.push("  • Expert (90-100%): Advanced proficiency")
        result.push("  • Advanced (75-89%): Strong working knowledge")
        result.push("  • Intermediate (60-74%): Comfortable usage")
        result.push("  • Beginner (40-59%): Basic understanding")
        result.push("")
        
        return result
      },
    },

    projects: {
      description: "View projects",
      action: () => {
        if (!portfolioData?.projects) {
          return ["❌ Projects data not loaded. Try running 'reload' command.", ""]
        }
        
        const projects = portfolioData.projects
        const result = [
          "🚀 Featured Projects",
          "═══════════════════════",
          "",
        ]
        
        projects.slice(0, 5).forEach((project, index) => {
          result.push(`${index + 1}. ${project.emoji || '🛠️'} ${project.title}`)
          result.push(`   ├─ ${project.description}`)
          result.push(`   ├─ Status: ${project.status || 'Active'}`)
          result.push(`   ├─ Tech: ${project.technologies?.join(', ') || 'Not specified'}`)
          if (project.liveUrl) {
            result.push(`   ├─ Live: ${project.liveUrl}`)
          }
          if (project.githubUrl) {
            result.push(`   └─ GitHub: ${project.githubUrl}`)
          } else {
            result.push(`   └─ Code: Private repository`)
          }
          result.push("")
        })
        
        if (projects.length > 5) {
          result.push(`📝 Showing top 5 of ${projects.length} projects`)
          result.push("")
        }
        
        result.push("💡 Type 'portfolio' to see all projects in visual mode!")
        result.push("")
        
        return result
      },
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
      action: () => {
        if (!portfolioData?.personalInfo) {
          return ["❌ Contact data not loaded. Try running 'reload' command.", ""]
        }
        
        const personalInfo = portfolioData.personalInfo
        const socialLinks = portfolioData.socialLinks || []
        
        return [
          "📧 Contact Information",
          "═══════════════════════",
          "",
          "📬 Primary Contact:",
          `  ✉️  Email: ${personalInfo.email || 'Not specified'}`,
          `  📱 Phone: ${personalInfo.phone || 'Not specified'}`,
          `  📍 Location: ${personalInfo.location || 'Not specified'}`,
          "",
          "🔗 Professional Networks:",
          ...socialLinks.map(link => `  ${link.icon || '�'} ${link.platform}: ${link.url}`),
          "",
          "💬 Preferred Contact Methods:",
          "  1. Email (fastest response)",
          "  2. LinkedIn message",
          "  3. Professional inquiry form",
          "",
          "⏰ Response Time:",
          "  • Email: Within 24 hours",
          "  • LinkedIn: Within 48 hours",
          "  • Professional inquiries: Same day",
          "",
          "🤝 Open to:",
          "  • Full-time opportunities",
          "  • Freelance projects",
          "  • Technical consultations",
          "  • Collaboration opportunities",
          "",
          "💡 Feel free to reach out for opportunities or collaborations!",
          "",
        ]
      },
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
      action: () => {
        if (!portfolioData?.socialLinks) {
          return ["❌ Social links data not loaded. Try running 'reload' command.", ""]
        }
        
        const socialLinks = portfolioData.socialLinks
        const personalInfo = portfolioData.personalInfo || {}
        
        return [
          "🔗 Social Media & Professional Links",
          "═══════════════════════════════════",
          "",
          "💼 Professional:",
          ...socialLinks.filter(link => ['LinkedIn', 'GitHub', 'Portfolio'].includes(link.platform))
            .map(link => `  ${link.icon || '🔗'} ${link.platform}: ${link.url}`),
          "",
          "� Content & Writing:",
          ...socialLinks.filter(link => ['Medium', 'Dev.to', 'Blog'].includes(link.platform))
            .map(link => `  ${link.icon || '📝'} ${link.platform}: ${link.url}`),
          "",
          "🎮 Social:",
          ...socialLinks.filter(link => !['LinkedIn', 'GitHub', 'Portfolio', 'Medium', 'Dev.to', 'Blog'].includes(link.platform))
            .map(link => `  ${link.icon || '🔗'} ${link.platform}: ${link.url}`),
          "",
          "🤝 Let's connect and build something amazing together!",
          "",
        ]
      },
    },

    reload: {
      description: "Reload portfolio data",
      action: () => {
        loadPortfolioData()
        return [
          "� Reloading portfolio data from backend...",
          "⏳ Please wait while we fetch the latest information...",
          "",
        ]
      },
    },

    status: {
      description: "System status",
      action: () => {
        const uptime = Math.floor((new Date() - terminalStartTime) / 1000)
        const formatUptime = (seconds) => {
          const mins = Math.floor(seconds / 60)
          const secs = seconds % 60
          return `${mins}m ${secs}s`
        }
        
        return [
          "📊 System Status",
          "═══════════════",
          "",
          `🟢 Terminal Status: Online`,
          `� Backend Connection: ${connectionStatus === 'connected' ? '🟢 Connected' : connectionStatus === 'connecting' ? '🟡 Connecting' : '🔴 Disconnected'}`,
          `⏱️  Uptime: ${formatUptime(uptime)}`,
          `� Data Loaded: ${portfolioData ? '✅ Yes' : '❌ No'}`,
          `� Current Theme: ${theme}`,
          `📱 Client Rendered: ${isClient ? '✅ Yes' : '❌ No'}`,
          `🖥️  Screen Mode: ${isFullscreen ? 'Fullscreen' : 'Windowed'}`,
          "",
          "📈 Performance:",
          `  • Commands Executed: ${commandHistory.length}`,
          `  • History Entries: ${history.length}`,
          `  • Memory Usage: Light`,
          "",
        ]
      },
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
          try {
            const result = COMMANDS[trimmedCommand].action()
            setHistory((prev) => [...prev, ...commandOutput, ...result])
          } catch (error) {
            console.error('Command execution error:', error)
            setHistory((prev) => [...prev, ...commandOutput, 
              "❌ Error executing command. Please try again.",
              "💡 Tip: Try 'reload' to refresh data from backend.",
              ""
            ])
          }
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
      // Command not found with helpful suggestions
      const suggestions = Object.keys(COMMANDS).filter(cmd => 
        cmd.includes(trimmedCommand.substring(0, 3)) || 
        trimmedCommand.includes(cmd.substring(0, 3))
      ).slice(0, 3)
      
      const suggestionText = suggestions.length > 0 
        ? [`💡 Did you mean: ${suggestions.join(', ')}?`, ""]
        : ["💡 Type 'help' for available commands.", ""]
      
      setHistory((prev) => [
        ...prev,
        ...commandOutput,
        `❌ Command '${trimmedCommand}' not found.`,
        ...suggestionText
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
      // Update welcome message based on connection status
      const dynamicWelcome = [
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
        "⚡ Loading portfolio data from backend...",
        connectionStatus === 'connected' ? "✅ Backend connection established" : 
        connectionStatus === 'connecting' ? "🔄 Connecting to backend..." : "❌ Backend connection failed - using fallback data",
        portfolioData ? `📊 Portfolio data loaded: ${Object.keys(portfolioData).length} sections` : "📊 Portfolio data: Loading...",
        "",
        "💡 Pro tip: Try 'status' to check system health or 'reload' to refresh data!",
        "",
      ]
      setHistory(dynamicWelcome)
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [isClient, connectionStatus, portfolioData])

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
          bg: "#000000",
          text: "text-green-400",
          accent: "text-green-300",
          border: "border-green-500",
        }
      case "cyberpunk":
        return {
          bg: "#1a0b2e",
          text: "text-cyan-400",
          accent: "text-pink-400",
          border: "border-cyan-500",
        }
      case "retro":
        return {
          bg: "#2d1b00",
          text: "text-amber-300",
          accent: "text-orange-400",
          border: "border-amber-500",
        }
      case "minimal":
        return {
          bg: "#1f2937",
          text: "text-gray-300",
          accent: "text-blue-400",
          border: "border-gray-600",
        }
      default:
        return {
          bg: "#000000",
          text: "text-green-400",
          accent: "text-green-300",
          border: "border-green-500",
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

      <div 
        className={`min-h-screen ${themeStyles.text} font-mono relative overflow-hidden`}
        style={{ backgroundColor: themeStyles.bg }}
      >
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-30 backdrop-blur-lg border-b"
            style={{
              background: `linear-gradient(135deg, ${themeStyles.bg}ee, ${themeStyles.bg}dd)`,
              borderColor: themeStyles.accent.replace('text-', '')
            }}
          >
          <div className="flex items-center justify-between p-3 sm:p-4 max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className={`flex items-center space-x-2 transition-all duration-200 hover:scale-105 ${themeStyles.text} hover:${themeStyles.accent}`}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">Back to Home</span>
              </Link>
              
              {/* Connection Status Indicator */}
              <div className="flex items-center space-x-2">
                {connectionStatus === 'connected' ? (
                  <Wifi className={`w-4 h-4 ${themeStyles.accent.replace('text-', 'text-')}`} />
                ) : connectionStatus === 'connecting' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Monitor className={`w-4 h-4 ${themeStyles.text}`} />
                  </motion.div>
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-xs ${themeStyles.text} hidden sm:inline`}>
                  {connectionStatus === 'connected' ? 'Online' : 
                   connectionStatus === 'connecting' ? 'Connecting' : 'Offline'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Theme Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const themes = ["matrix", "cyberpunk", "retro", "minimal"]
                  const currentIndex = themes.indexOf(theme)
                  const nextTheme = themes[(currentIndex + 1) % themes.length]
                  setTheme(nextTheme)
                }}
                className={`${themeStyles.text} transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg border font-medium hover:opacity-80 flex items-center space-x-1`}
                style={{ 
                  backgroundColor: `${themeStyles.bg}80`,
                  borderColor: themeStyles.accent.replace('text-', '')
                }}
                title="Click to cycle through themes"
              >
                <span>
                  {theme === 'matrix' && '🔰'}
                  {theme === 'cyberpunk' && '🎯'}
                  {theme === 'retro' && '🌴'}
                  {theme === 'minimal' && '🎨'}
                </span>
                <span className="capitalize">{theme}</span>
              </motion.button>
              
              {/* Reload Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadPortfolioData}
                disabled={connectionStatus === 'connecting'}
                className={`${themeStyles.text} transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg border font-medium disabled:opacity-50 hover:opacity-80`}
                style={{ 
                  backgroundColor: `${themeStyles.bg}80`,
                  borderColor: themeStyles.accent.replace('text-', '')
                }}
              >
                🔄 Sync
              </motion.button>
              
              {/* Fullscreen Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`${themeStyles.text} transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg border font-medium hover:opacity-80`}
                style={{ 
                  backgroundColor: `${themeStyles.bg}80`,
                  borderColor: themeStyles.accent.replace('text-', '')
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
              background: `linear-gradient(135deg, ${themeStyles.bg}f0, ${themeStyles.bg}e0)`
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
              borderColor: themeStyles.accent.replace('text-', ''),
              background: `linear-gradient(135deg, ${themeStyles.bg}f0, ${themeStyles.bg}e0)`
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
                transition={{ duration: 1, repeat: Infinity }}
                className={`${themeStyles.accent} flex-shrink-0`}
              >
                █
              </motion.span>
            </form>
          </motion.div>
        </div>

        {/* Mobile optimization hints */}
        {isClient && (
          <div className="md:hidden fixed bottom-4 right-4 bg-black/90 text-white text-xs p-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/20 max-w-xs z-50">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4" />
              <div>
                <div className="font-semibold">Terminal Tips:</div>
                <div className="text-xs opacity-80 mt-1">
                  • Type 'help' for commands
                  • Use ↑/↓ for history
                  • 'reload' to sync data
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
