/**
 * @fileoverview Portfolio Page - Professional Visitor Mode
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter,
  ExternalLink,
  MapPin,
  Calendar,
  Code,
  Database,
  Server,
  Smartphone
} from 'lucide-react';

import { PORTFOLIO_IDS } from '../constants/component-ids';
import { useTheme } from '../context/ThemeContext';

/**
 * Portfolio Page Component
 * @function PortfolioPage
 * @returns {JSX.Element} Portfolio page component
 */
export default function PortfolioPage() {
  const { toggleTheme, isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('hero');

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Sample data - in real app this would come from API
  const personalInfo = {
    name: "Professional Developer",
    title: "Full Stack Developer",
    location: "Your City, Country",
    email: "your.email@domain.com",
    phone: "+1 (555) 123-4567",
    description: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love turning complex problems into simple, beautiful solutions.",
  };

  const skills = {
    frontend: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "Tailwind CSS", level: 90 },
    ],
    backend: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 80 },
      { name: "Python", level: 75 },
      { name: "MongoDB", level: 80 },
    ],
    tools: [
      { name: "Git", level: 90 },
      { name: "Docker", level: 70 },
      { name: "AWS", level: 65 },
      { name: "Jest", level: 75 },
    ]
  };

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack MERN application with payment integration, inventory management, and admin dashboard.",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "/api/placeholder/400/250",
      liveUrl: "https://demo.example.com",
      githubUrl: "https://github.com/yourusername/ecommerce",
      featured: true
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Real-time collaborative task management with drag-and-drop interface and team features.",
      tech: ["Next.js", "Socket.io", "PostgreSQL", "Redis"],
      image: "/api/placeholder/400/250",
      liveUrl: "https://tasks.example.com",
      githubUrl: "https://github.com/yourusername/taskapp",
      featured: true
    },
    {
      id: 3,
      title: "Portfolio Terminal",
      description: "Interactive terminal-based portfolio with multiple themes and command-line interface.",
      tech: ["React", "Next.js", "Framer Motion"],
      image: "/api/placeholder/400/250",
      liveUrl: "/terminal",
      githubUrl: "https://github.com/yourusername/portfolio",
      featured: true
    }
  ];

  const experience = [
    {
      company: "TechCorp",
      position: "Senior Full Stack Developer",
      period: "2022 - Present",
      description: "Lead development of microservices architecture, mentored junior developers, and improved application performance by 40%.",
      achievements: [
        "Architected scalable microservices handling 1M+ requests/day",
        "Mentored 5 junior developers and conducted code reviews",
        "Reduced deployment time by 60% through CI/CD optimization"
      ]
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      period: "2020 - 2022",
      description: "Built responsive web applications from scratch, implemented CI/CD pipelines, and collaborated with design team.",
      achievements: [
        "Developed 3 web applications from concept to production",
        "Implemented automated testing reducing bugs by 70%",
        "Collaborated with UX team to improve user satisfaction by 35%"
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Professional Portfolio | Full Stack Developer</title>
        <meta name="description" content="Professional portfolio showcasing full-stack development skills, projects, and experience. Specializing in React, Node.js, and modern web technologies." />
        <meta name="keywords" content="full stack developer, react developer, nodejs, portfolio, web development" />
        <meta property="og:title" content="Professional Portfolio | Full Stack Developer" />
        <meta property="og:description" content="Professional portfolio showcasing full-stack development skills and projects." />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>

              <div className="hidden md:flex items-center space-x-8">
                <a href="#about" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">About</a>
                <a href="#skills" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Skills</a>
                <a href="#projects" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Projects</a>
                <a href="#experience" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Experience</a>
                <a href="#contact" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section 
          id={PORTFOLIO_IDS.HERO_SECTION}
          className="pt-24 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-8"
              >
                <motion.div variants={fadeInUp}>
                  <h1 
                    id={PORTFOLIO_IDS.NAME_HEADING}
                    className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4"
                  >
                    {personalInfo.name}
                  </h1>
                  <h2 
                    id={PORTFOLIO_IDS.TITLE_SUBHEADING}
                    className="text-2xl lg:text-3xl text-blue-600 dark:text-blue-400 font-medium mb-6"
                  >
                    {personalInfo.title}
                  </h2>
                  <p 
                    id={PORTFOLIO_IDS.HERO_DESCRIPTION}
                    className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
                  >
                    {personalInfo.description}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{personalInfo.location}</span>
                </motion.div>

                <motion.div 
                  id={PORTFOLIO_IDS.CTA_BUTTONS_CONTAINER}
                  variants={fadeInUp}
                  className="flex flex-wrap gap-4"
                >
                  <button 
                    id={PORTFOLIO_IDS.RESUME_DOWNLOAD_BTN}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </button>
                  <a 
                    href="#contact"
                    id={PORTFOLIO_IDS.CONTACT_ME_BTN}
                    className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Get In Touch
                  </a>
                </motion.div>

                <motion.div 
                  id={PORTFOLIO_IDS.SOCIAL_MEDIA_BAR}
                  variants={fadeInUp}
                  className="flex items-center space-x-4"
                >
                  <a 
                    href="https://github.com/yourusername"
                    className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://linkedin.com/in/yourusername"
                    className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://twitter.com/yourusername"
                    className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </motion.div>
              </motion.div>

              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center lg:justify-end"
              >
                <div 
                  id={PORTFOLIO_IDS.PROFILE_IMAGE_CONTAINER}
                  className="relative"
                >
                  <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {/* Placeholder for profile image */}
                      <div className="text-6xl text-gray-400">👨‍💻</div>
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg animate-bounce-slow">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg animate-bounce-slow animate-delay-500">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Technical Skills
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300">
                Technologies I work with
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Frontend Skills */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <Smartphone className="w-6 h-6 text-blue-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Frontend</h3>
                </div>
                <div className="space-y-4">
                  {skills.frontend.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="bg-blue-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Backend Skills */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <Server className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Backend</h3>
                </div>
                <div className="space-y-4">
                  {skills.backend.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="bg-green-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tools Skills */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <Database className="w-6 h-6 text-purple-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tools & Others</h3>
                </div>
                <div className="space-y-4">
                  {skills.tools.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="bg-purple-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Projects
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300">
                Some of my recent work
              </motion.p>
            </motion.div>

            <div 
              id={PORTFOLIO_IDS.PROJECTS_GRID}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Project Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-white text-6xl opacity-50">📱</div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Project Links */}
                    <div className="flex items-center space-x-4">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Live Demo
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Let's Work Together
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300">
                I'm always interested in new opportunities and projects
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg text-center"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h3>
                  
                  <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-600 dark:text-gray-300">
                    <Mail className="w-5 h-5" />
                    <span>{personalInfo.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-5 h-5" />
                    <span>{personalInfo.location}</span>
                  </div>

                  <div className="pt-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Feel free to reach out for opportunities, collaborations, or just to say hello!
                    </p>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Alternative Experiences</h3>
                  <div className="space-y-4">
                    <Link
                      href="/terminal"
                      className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-mono text-sm">{'>'}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Developer Mode</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Terminal interface</p>
                        </div>
                      </div>
                    </Link>
                    
                    <Link
                      href="/blog"
                      className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-lg">📝</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Technical Blog</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Articles & insights</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 Professional Developer. Built with Next.js and ❤️
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}