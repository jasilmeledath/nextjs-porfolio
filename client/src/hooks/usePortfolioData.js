/**
 * @fileoverview Portfolio Data Hook - Custom hook for portfolio data management
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import PortfolioService from '../services/portfolio-service';

/**
 * Custom hook for managing portfolio data
 * @returns {Object} Portfolio data and loading states
 */
export const usePortfolioData = () => {
  // Default portfolio data for immediate display
  const defaultPortfolioData = {
    personalInfo: {
      name: 'Jasil Meledath',
      title: 'Full Stack Developer & UI/UX Designer',
      description: `Passionate full-stack developer with 5+ years of experience creating innovative web applications and user interfaces. I specialize in React, Node.js, and modern web technologies, with a keen eye for design and user experience.

I love turning complex problems into simple, beautiful solutions. When I'm not coding, you can find me exploring new technologies, contributing to open source projects, or designing the next big thing.`,
      email: 'jasil@example.com',
      location: 'San Francisco, CA',
      phone: '+1 (555) 123-4567'
    },
    socialLinks: [
      { platform: 'github', url: 'https://github.com/jasilmeledath', username: 'jasilmeledath' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/jasilmeledath', username: 'jasilmeledath' },
      { platform: 'twitter', url: 'https://twitter.com/jasilmeledath', username: 'jasilmeledath' },
      { platform: 'website', url: 'https://jasilmeledath.dev', username: 'Portfolio' }
    ],
    skills: {
      frontend: [
        { name: 'React', icon: '⚛️', level: 95 },
        { name: 'Next.js', icon: '🔼', level: 90 },
        { name: 'TypeScript', icon: '📘', level: 88 },
        { name: 'Tailwind CSS', icon: '🎨', level: 92 },
        { name: 'Framer Motion', icon: '🎭', level: 85 },
        { name: 'Vue.js', icon: '💚', level: 80 }
      ],
      backend: [
        { name: 'Node.js', icon: '🟢', level: 90 },
        { name: 'Express.js', icon: '🚀', level: 88 },
        { name: 'MongoDB', icon: '🍃', level: 85 },
        { name: 'PostgreSQL', icon: '🐘', level: 82 },
        { name: 'GraphQL', icon: '📊', level: 80 },
        { name: 'Docker', icon: '🐳', level: 75 }
      ],
      tools: [
        { name: 'Git', icon: '📝', level: 95 },
        { name: 'VS Code', icon: '💻', level: 98 },
        { name: 'Figma', icon: '🎨', level: 85 },
        { name: 'AWS', icon: '☁️', level: 75 },
        { name: 'Webpack', icon: '📦', level: 80 },
        { name: 'Jest', icon: '🧪', level: 78 }
      ]
    },
    projects: [
      {
        id: 1,
        title: 'E-Commerce Platform',
        description: 'A modern, responsive e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, payment processing, admin dashboard, and real-time inventory management.',
        image: '/placeholder.svg',
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
        liveUrl: 'https://demo-ecommerce.com',
        githubUrl: 'https://github.com/jasilmeledath/ecommerce-platform',
        stats: { users: '10K+', performance: '95%', rating: '4.8' }
      },
      {
        id: 2,
        title: 'Task Management App',
        description: 'Collaborative task management application with real-time updates, team collaboration features, and advanced project tracking capabilities.',
        image: '/placeholder.svg',
        tech: ['Next.js', 'Socket.io', 'PostgreSQL', 'Prisma', 'TypeScript'],
        liveUrl: 'https://task-manager-demo.com',
        githubUrl: 'https://github.com/jasilmeledath/task-manager',
        stats: { users: '5K+', performance: '98%', rating: '4.9' }
      },
      {
        id: 3,
        title: 'Portfolio Website',
        description: 'This very portfolio website you\'re viewing! Built with Next.js, featuring interactive animations, dark/light mode, and a terminal interface for developers.',
        image: '/placeholder.svg',
        tech: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'MongoDB'],
        liveUrl: 'https://jasilmeledath.dev',
        githubUrl: 'https://github.com/jasilmeledath/portfolio',
        stats: { users: '2K+', performance: '100%', rating: '5.0' }
      }
    ],
    experience: [
      {
        id: 1,
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        duration: '2022 - Present',
        description: 'Leading development of web applications, mentoring junior developers, and architecting scalable solutions.',
        technologies: ['React', 'Node.js', 'AWS', 'MongoDB']
      },
      {
        id: 2,
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        duration: '2020 - 2022',
        description: 'Built responsive web applications and implemented modern UI/UX designs using React and TypeScript.',
        technologies: ['React', 'TypeScript', 'Sass', 'Jest']
      }
    ]
  };

  const [portfolioData, setPortfolioData] = useState(defaultPortfolioData);
  const [loading, setLoading] = useState(false); // Start with false since we have default data
  const [error, setError] = useState(null);

  /**
   * Load complete portfolio data
   */
  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load data from API
      const response = await PortfolioService.getVisitorPortfolio();
      
      if (response.success && response.data) {
        const data = response.data;
        
        // Process the data
        const processedSkills = data.skills && Array.isArray(data.skills) && data.skills.length > 0
          ? PortfolioService.processSkillsData(data.skills) 
          : null;
        
        const processedProjects = data.projects && data.projects.length > 0
          ? PortfolioService.processProjectsData(data.projects)
          : null;
          
        const processedSocialLinks = data.socialLinks && data.socialLinks.length > 0
          ? PortfolioService.processSocialLinksData(data.socialLinks)
          : null;
          
        const processedExperience = data.experience && data.experience.length > 0
          ? PortfolioService.processExperienceData(data.experience)
          : null;
        
        // Merge API data with defaults, keeping defaults as fallback
        setPortfolioData(prevData => ({
          personalInfo: data.personalInfo && Object.keys(data.personalInfo).length > 0
            ? {
                ...prevData.personalInfo,
                ...data.personalInfo
              }
            : prevData.personalInfo,
          socialLinks: processedSocialLinks || prevData.socialLinks,
          skills: processedSkills || prevData.skills,
          projects: processedProjects || prevData.projects,
          experience: processedExperience || prevData.experience
        }));
        
        console.log('[usePortfolioData] Successfully loaded data from API');
      } else {
        console.log('[usePortfolioData] API response unsuccessful, using default data');
      }
    } catch (err) {
      console.log('[usePortfolioData] API failed, using default data:', err.message);
      setError(null); // Don't show error to user since we have fallback data
      
      // Keep the default data that was already set
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to show the data loads smoothly
    const timer = setTimeout(() => {
      loadPortfolioData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    portfolioData,
    loading,
    error,
    refetch: loadPortfolioData
  };
};

/**
 * Custom hook for loading individual data sections
 * @returns {Object} Individual data loaders
 */
export const usePortfolioSections = () => {
  const [sectionsData, setSectionsData] = useState({
    personalInfo: null,
    socialLinks: [],
    skills: {},
    projects: [],
    experience: []
  });
  
  const [loadingStates, setLoadingStates] = useState({
    personalInfo: false,
    socialLinks: false,
    skills: false,
    projects: false,
    experience: false
  });

  /**
   * Load personal information
   */
  const loadPersonalInfo = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, personalInfo: true }));
      const response = await PortfolioService.getPublicPersonalInfo();
      
      if (response.success) {
        setSectionsData(prev => ({ ...prev, personalInfo: response.data }));
      }
    } catch (error) {
      console.error('[usePortfolioSections] Error loading personal info:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, personalInfo: false }));
    }
  };

  /**
   * Load social links
   */
  const loadSocialLinks = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, socialLinks: true }));
      const response = await PortfolioService.getPublicSocialLinks();
      
      if (response.success) {
        setSectionsData(prev => ({ 
          ...prev, 
          socialLinks: PortfolioService.processSocialLinksData(response.data) 
        }));
      }
    } catch (error) {
      console.error('[usePortfolioSections] Error loading social links:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, socialLinks: false }));
    }
  };

  /**
   * Load skills
   */
  const loadSkills = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, skills: true }));
      const response = await PortfolioService.getPublicSkills();
      
      if (response.success) {
        setSectionsData(prev => ({ 
          ...prev, 
          skills: PortfolioService.processSkillsData(response.data) 
        }));
      }
    } catch (error) {
      console.error('[usePortfolioSections] Error loading skills:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, skills: false }));
    }
  };

  /**
   * Load projects
   */
  const loadProjects = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, projects: true }));
      const response = await PortfolioService.getAllProjects({ status: 'published' });
      
      if (response.success) {
        setSectionsData(prev => ({ 
          ...prev, 
          projects: PortfolioService.processProjectsData(response.data.projects) 
        }));
      }
    } catch (error) {
      console.error('[usePortfolioSections] Error loading projects:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, projects: false }));
    }
  };

  /**
   * Load experience
   */
  const loadExperience = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, experience: true }));
      const response = await PortfolioService.getPublicExperience();
      
      if (response.success) {
        setSectionsData(prev => ({ 
          ...prev, 
          experience: PortfolioService.processExperienceData(response.data) 
        }));
      }
    } catch (error) {
      console.error('[usePortfolioSections] Error loading experience:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, experience: false }));
    }
  };

  return {
    sectionsData,
    loadingStates,
    loaders: {
      loadPersonalInfo,
      loadSocialLinks,
      loadSkills,
      loadProjects,
      loadExperience
    }
  };
};
