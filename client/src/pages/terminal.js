/**
 * @fileoverview Terminal Page - Interactive Developer Mode
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { ArrowLeft, Minimize2, Maximize2, X } from 'lucide-react';
import Link from 'next/link';

import { TERMINAL_IDS } from '../constants/component-ids';

/**
 * Terminal Page Component
 * @function TerminalPage
 * @returns {JSX.Element} Terminal page component
 */
export default function TerminalPage() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDirectory, setCurrentDirectory] = useState('~');
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  // Welcome message
  const welcomeMessage = [
    '╭─────────────────────────────────────────────────╮',
    '│           Welcome to Portfolio Terminal         │',
    '│                                                 │',
    '│  Type "help" to see available commands          │',
    '│  Type "about" to learn more about me            │',
    '│  Type "clear" to clear the terminal             │',
    '╰─────────────────────────────────────────────────╯',
    '',
  ];

  /**
   * Available terminal commands
   * @constant {Object} COMMANDS
   */
  const COMMANDS = {
    help: {
      description: 'Show available commands',
      action: () => [
        'Available commands:',
        '',
        '  help          - Show this help message',
        '  about         - About me and my background',
        '  skills        - Technical skills and expertise',
        '  projects      - View my projects',
        '  experience    - Work experience and history',
        '  contact       - Contact information',
        '  resume        - Download my resume',
        '  social        - Social media links',
        '  clear         - Clear terminal screen',
        '  whoami        - Display current user info',
        '  date          - Show current date and time',
        '  history       - Show command history',
        '  theme         - Change terminal theme',
        '  visitor       - Switch to portfolio mode',
        '  blog          - Switch to blog mode',
        '',
        'Fun commands:',
        '  matrix        - Enter the matrix',
        '  joke          - Random programming joke',
        '  quote         - Inspirational quote',
        '  weather       - Current weather (mock)',
        '',
      ]
    },
    about: {
      description: 'About me',
      action: () => [
        '👨‍💻 About Me',
        '══════════',
        '',
        'Hi! I\'m a passionate Full-Stack Developer with expertise in:',
        '',
        '• Frontend: React, Next.js, TypeScript, Tailwind CSS',
        '• Backend: Node.js, Express, Python, Django',
        '• Database: MongoDB, PostgreSQL, Redis',
        '• DevOps: Docker, AWS, CI/CD, Kubernetes',
        '',
        'I love building scalable web applications and solving',
        'complex problems with clean, efficient code.',
        '',
        '🎯 Always learning, always coding, always improving.',
        '',
      ]
    },
    skills: {
      description: 'Technical skills',
      action: () => [
        '🛠️  Technical Skills',
        '═══════════════',
        '',
        'Frontend Development:',
        '  ▓▓▓▓▓▓▓▓▓░ React.js (90%)',
        '  ▓▓▓▓▓▓▓▓░░ Next.js (80%)',
        '  ▓▓▓▓▓▓▓▓▓░ JavaScript/TypeScript (90%)',
        '  ▓▓▓▓▓▓▓▓░░ CSS/Tailwind (80%)',
        '',
        'Backend Development:',
        '  ▓▓▓▓▓▓▓▓░░ Node.js (85%)',
        '  ▓▓▓▓▓▓▓░░░ Express.js (75%)',
        '  ▓▓▓▓▓▓▓░░░ Python (70%)',
        '  ▓▓▓▓▓▓▓▓░░ MongoDB (80%)',
        '',
        'DevOps & Tools:',
        '  ▓▓▓▓▓▓▓░░░ Docker (70%)',
        '  ▓▓▓▓▓▓░░░░ AWS (60%)',
        '  ▓▓▓▓▓▓▓▓▓░ Git (90%)',
        '',
      ]
    },
    projects: {
      description: 'View projects',
      action: () => [
        '🚀 Featured Projects',
        '══════════════════',
        '',
        '1. E-Commerce Platform',
        '   • Full-stack MERN application',
        '   • Payment integration with Stripe',
        '   • Real-time inventory management',
        '   • GitHub: github.com/yourusername/ecommerce',
        '',
        '2. Task Management App',
        '   • React + Node.js + MongoDB',
        '   • Real-time collaboration',
        '   • Drag & drop interface',
        '   • Live: taskapp.yoursite.com',
        '',
        '3. Portfolio Terminal (This App!)',
        '   • Interactive terminal interface',
        '   • Multiple themes and modes',
        '   • Responsive design',
        '   • GitHub: github.com/yourusername/portfolio',
        '',
        'Type "visitor" to see more projects in portfolio mode!',
        '',
      ]
    },
    experience: {
      description: 'Work experience',
      action: () => [
        '💼 Work Experience',
        '════════════════',
        '',
        'Senior Full Stack Developer @ TechCorp (2022-Present)',
        '• Lead development of microservices architecture',
        '• Mentored junior developers and code reviews',
        '• Improved application performance by 40%',
        '• Technologies: React, Node.js, AWS, Docker',
        '',
        'Full Stack Developer @ StartupXYZ (2020-2022)',
        '• Built responsive web applications from scratch',
        '• Implemented CI/CD pipelines',
        '• Collaborated with design team on UX improvements',
        '• Technologies: Vue.js, Python, PostgreSQL',
        '',
        'Junior Developer @ WebAgency (2019-2020)',
        '• Developed client websites and web applications',
        '• Learned best practices and modern frameworks',
        '• Participated in agile development process',
        '',
      ]
    },
    contact: {
      description: 'Contact information',
      action: () => [
        '📧 Contact Information',
        '═══════════════════',
        '',
        '  Email: your.email@domain.com',
        '  Phone: +1 (555) 123-4567',
        '  Location: Your City, Country',
        '',
        '  LinkedIn: linkedin.com/in/yourusername',
        '  GitHub: github.com/yourusername',
        '  Twitter: @yourusername',
        '',
        '💬 Feel free to reach out for opportunities,',
        '   collaborations, or just to say hello!',
        '',
      ]
    },
    whoami: {
      description: 'Current user info',
      action: () => [
        'guest@portfolio-terminal',
        `Current directory: ${currentDirectory}`,
        `Session started: ${new Date().toLocaleString()}`,
        'Terminal version: 1.0.0',
        'Environment: development',
        '',
      ]
    },
    date: {
      description: 'Show current date',
      action: () => [new Date().toString(), '']
    },
    clear: {
      description: 'Clear terminal',
      action: () => {
        setHistory([]);
        return [];
      }
    },
    history: {
      description: 'Show command history',
      action: () => [
        'Command History:',
        '───────────────',
        ...commandHistory.map((cmd, i) => `  ${i + 1}. ${cmd}`),
        '',
      ]
    },
    matrix: {
      description: 'Enter the matrix',
      action: () => [
        '01001000 01100101 01101100 01101100 01101111',
        '01010111 01101111 01110010 01101100 01100100',
        '',
        'Welcome to the Matrix, Neo...',
        '',
        '⠊⠕⠍⠂ ⠊⠞⠄⠎ ⠁ ⠏⠗⠕⠛⠗⠁⠍⠍⠊⠝⠛ ⠚⠕⠅⠑⠖',
        '',
        'The Matrix has you... but so does debugging.',
        '',
      ]
    },
    joke: {
      description: 'Random programming joke',
      action: () => {
        const jokes = [
          'Why do programmers prefer dark mode?\nBecause light attracts bugs! 🐛',
          'How many programmers does it take to change a light bulb?\nNone. That\'s a hardware problem.',
          'Why did the programmer quit his job?\nHe didn\'t get arrays! 📊',
          'What\'s a programmer\'s favorite hangout place?\nFoo Bar! 🍺',
          'Why do Java developers wear glasses?\nBecause they don\'t C#! 👓',
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        return [randomJoke, ''];
      }
    },
    quote: {
      description: 'Inspirational quote',
      action: () => {
        const quotes = [
          '"Code is poetry." - Unknown',
          '"First, solve the problem. Then, write the code." - John Johnson',
          '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
          '"The best error message is the one that never shows up." - Thomas Fuchs',
          '"Simplicity is the ultimate sophistication." - Leonardo da Vinci',
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return [randomQuote, ''];
      }
    },
    weather: {
      description: 'Current weather',
      action: () => [
        '🌤️  Current Weather (Mock Data)',
        '════════════════════════════',
        '',
        '  Location: Your City',
        '  Temperature: 22°C (72°F)',
        '  Condition: Partly Cloudy',
        '  Humidity: 65%',
        '  Wind: 8 km/h SW',
        '',
        '  Perfect coding weather! ☕',
        '',
      ]
    },
  };

  /**
   * Execute terminal command
   * @function executeCommand
   * @param {string} command - Command to execute
   */
  const executeCommand = (command) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    // Add to command history
    if (trimmedCommand && !commandHistory.includes(trimmedCommand)) {
      setCommandHistory(prev => [...prev, trimmedCommand]);
    }

    // Add command to output history
    const commandOutput = [`guest@portfolio:${currentDirectory}$ ${command}`];
    
    if (!trimmedCommand) {
      setHistory(prev => [...prev, ...commandOutput, '']);
      return;
    }

    // Handle special navigation commands
    if (trimmedCommand === 'visitor') {
      window.location.href = '/portfolio';
      return;
    }
    
    if (trimmedCommand === 'blog') {
      window.location.href = '/blog';
      return;
    }

    // Execute command
    if (COMMANDS[trimmedCommand]) {
      setIsLoading(true);
      
      // Simulate loading for some commands
      setTimeout(() => {
        const result = COMMANDS[trimmedCommand].action();
        setHistory(prev => [...prev, ...commandOutput, ...result]);
        setIsLoading(false);
        
        // Scroll to bottom
        setTimeout(() => {
          if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
          }
        }, 50);
      }, trimmedCommand === 'matrix' ? 1000 : 300);
    } else {
      // Command not found
      setHistory(prev => [...prev, ...commandOutput, `Command not found: ${trimmedCommand}`, 'Type "help" for available commands.', '']);
    }
  };

  /**
   * Handle input submission
   * @function handleSubmit
   * @param {Event} e - Form event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    executeCommand(input);
    setInput('');
    setHistoryIndex(-1);
  };

  /**
   * Handle keyboard navigation
   * @function handleKeyDown
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Initialize terminal with welcome message
  useEffect(() => {
    setHistory(welcomeMessage);
    
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Keep input focused
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <Head>
        <title>Terminal - Developer Mode | Professional Portfolio</title>
        <meta name="description" content="Interactive terminal interface for exploring my portfolio. Perfect for developers who love command-line interfaces." />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-terminal-text font-mono">
        {/* Terminal Header */}
        <div 
          id={TERMINAL_IDS.TERMINAL_HEADER}
          className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
            
            <div className="text-sm text-gray-400">
              Portfolio Terminal v1.0.0
            </div>
          </div>

          <div 
            id={TERMINAL_IDS.TERMINAL_CONTROLS}
            className="flex items-center space-x-2"
          >
            <button className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"></button>
            <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors"></button>
            <button className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors"></button>
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          id={TERMINAL_IDS.MAIN_CONTAINER}
          className="h-[calc(100vh-60px)] flex flex-col"
        >
          {/* Output Area */}
          <div 
            id={TERMINAL_IDS.OUTPUT_HISTORY}
            ref={outputRef}
            className="flex-1 p-4 overflow-y-auto terminal-scrollbar"
          >
            {history.map((line, index) => (
              <div key={index} className="mb-1 whitespace-pre-wrap">
                {line}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse animate-delay-100"></div>
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse animate-delay-200"></div>
                <span className="ml-2 text-gray-400">Processing...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <span className="text-terminal-green font-semibold">
                guest@portfolio:{currentDirectory}$
              </span>
              <input
                ref={inputRef}
                id={TERMINAL_IDS.INPUT_FIELD}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-terminal-text caret-terminal-green"
                disabled={isLoading}
                autoComplete="off"
                spellCheck="false"
              />
              <span className="text-terminal-green animate-terminal-blink">█</span>
            </form>
          </div>
        </div>

        {/* Mobile hint */}
        <div className="md:hidden fixed bottom-4 right-4 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg">
          💡 Tip: Use landscape mode for better experience
        </div>
      </div>

      <style jsx>{`
        .terminal-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .terminal-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </>
  );
}