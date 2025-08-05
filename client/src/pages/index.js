"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import { motion } from "framer-motion"
import { FiGrid, FiBookOpen, FiGithub, FiLinkedin, FiTwitter, FiMail } from "react-icons/fi"
import { MdTerminal } from "react-icons/md"
import { useTheme } from "../context/ThemeContext"
import ThemeToggle from "../components/ui/ThemeToggle"

export default function LandingPage() {
  const router = useRouter()
  const { isDark, mounted } = useTheme()
  const [activeCard, setActiveCard] = useState(null)

  // Use mounted from ThemeContext instead of isClient
  const isClient = mounted

  // Navigation handler
  const navigate = useCallback(
    (path) => {
      router.push(path)
    },
    [router],
  )

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      y: -4,
      scale: 1.01,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <>
      <Head>
        <title>Jasil Meledath - Full Stack Developer</title>
        <meta
          name="description"
          content="Full Stack Developer specializing in modern web technologies. Explore my portfolio, read technical articles, or experience interactive development tools."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div
        className={`min-h-screen transition-all duration-700 ease-out ${
          isClient && isDark
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100"
            : "bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900"
        }`}
      >
        {/* Subtle background pattern */}
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${
                isClient && isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"
              } 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10"
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              {/* Brand */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-medium text-lg tracking-tight"
              >
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  jasilmeledath.dev
                </span>
              </motion.div>

              {/* Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <ThemeToggle />
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="relative">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            {/* Hero Section */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="py-20 lg:py-32 text-center relative"
            >
              <div className="max-w-4xl mx-auto">
                <motion.div variants={itemVariants} className="mb-6">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 ${
                      isClient && isDark
                        ? "bg-slate-800/50 text-slate-300 border border-slate-700/50"
                        : "bg-slate-100/80 text-slate-600 border border-slate-200/50"
                    }`}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    Available for new opportunities
                  </div>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="font-bold text-4xl lg:text-6xl xl:text-7xl mb-6 leading-tight"
                >
                  <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
                    Welcome to my
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Digital Universe
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className={`text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed ${
                    isClient && isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Choose your path to explore my work, thoughts, and digital experiences
                </motion.p>

                {/* Navigation Cards */}
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
                >
                  {/* Portfolio Card */}
                  <motion.button
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => navigate("/portfolio")}
                    onHoverStart={() => setActiveCard("portfolio")}
                    onHoverEnd={() => setActiveCard(null)}
                    className={`group relative overflow-hidden rounded-3xl p-8 h-56 transition-all duration-300 ${
                      isClient && isDark
                        ? "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 hover:border-blue-500/50"
                        : "bg-white/70 border border-slate-200/50 hover:bg-white/90 hover:border-blue-400/50 shadow-sm hover:shadow-lg"
                    } backdrop-blur-sm`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative flex flex-col items-center justify-center h-full">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4"
                      >
                        <FiGrid className="w-10 h-10 text-blue-500" />
                      </motion.div>

                      <h3 className="text-xl font-semibold mb-2">Portfolio</h3>
                      <p className={`text-sm ${isClient && isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Explore my projects and work
                      </p>
                    </div>
                  </motion.button>

                  {/* Terminal Card */}
                  <motion.button
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => navigate("/terminal")}
                    onHoverStart={() => setActiveCard("terminal")}
                    onHoverEnd={() => setActiveCard(null)}
                    className={`group relative overflow-hidden rounded-3xl p-8 h-56 transition-all duration-300 ${
                      isClient && isDark
                        ? "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 hover:border-green-500/50"
                        : "bg-white/70 border border-slate-200/50 hover:bg-white/90 hover:border-green-400/50 shadow-sm hover:shadow-lg"
                    } backdrop-blur-sm`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-4 right-4">
                      <span className={`text-xs font-mono ${isClient && isDark ? "text-slate-500" : "text-slate-400"}`}>
                        $
                      </span>
                    </div>

                    <div className="relative flex flex-col items-center justify-center h-full">
                      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }} className="mb-4">
                        <MdTerminal className="w-10 h-10 text-green-500" />
                      </motion.div>

                      <h3 className="text-xl font-semibold mb-2">Terminal</h3>
                      <p className={`text-sm ${isClient && isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Interactive developer mode
                      </p>
                    </div>
                  </motion.button>

                  {/* Blog Card */}
                  <motion.button
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => navigate("/blog")}
                    onHoverStart={() => setActiveCard("blog")}
                    onHoverEnd={() => setActiveCard(null)}
                    className={`group relative overflow-hidden rounded-3xl p-8 h-56 transition-all duration-300 ${
                      isClient && isDark
                        ? "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 hover:border-purple-500/50"
                        : "bg-white/70 border border-slate-200/50 hover:bg-white/90 hover:border-purple-400/50 shadow-sm hover:shadow-lg"
                    } backdrop-blur-sm`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative flex flex-col items-center justify-center h-full">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4"
                      >
                        <FiBookOpen className="w-10 h-10 text-purple-500" />
                      </motion.div>

                      <h3 className="text-xl font-semibold mb-2">Blog</h3>
                      <p className={`text-sm ${isClient && isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Technical insights & thoughts
                      </p>
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </motion.section>

            {/* Enhanced Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={`border-t py-12 mt-20 ${isClient && isDark ? "border-slate-800/50" : "border-slate-200/50"}`}
            >
              <div className="max-w-4xl mx-auto text-center">
                {/* Social Links */}
                <div className="flex justify-center space-x-2 mb-8">
                  {[
                    { icon: FiGithub, href: "https://github.com/jasilmeledath", label: "GitHub" },
                    { icon: FiLinkedin, href: "https://linkedin.com/in/jasilmeledath", label: "LinkedIn" },
                    { icon: FiTwitter, href: "https://twitter.com/jasilmeledath", label: "Twitter" },
                    { icon: FiMail, href: "mailto:contact@jasilmeledath.dev", label: "Email" },
                  ].map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-2xl transition-all duration-200 ${
                        isClient && isDark
                          ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                      }`}
                      aria-label={`${label} Profile`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>

                {/* Copyright */}
                <p className={`text-sm ${isClient && isDark ? "text-slate-500" : "text-slate-500"}`}>
                  © 2025 jasilmeledath.dev • Crafted with NextJS & Passion ❤
                </p>
              </div>
            </motion.footer>
          </div>
        </main>
      </div>
    </>
  )
}
