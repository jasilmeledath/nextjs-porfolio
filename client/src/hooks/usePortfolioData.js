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
  const [portfolioData, setPortfolioData] = useState({
    personalInfo: {
      name: '',
      title: '',
      description: '',
      email: '',
      location: ''
    },
    socialLinks: [],
    skills: {},
    projects: [],
    experience: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load complete portfolio data
   */
  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the visitor portfolio endpoint for optimized loading
      const response = await PortfolioService.getVisitorPortfolio();
      
      if (response.success) {
        const data = response.data;
        
        setPortfolioData({
          personalInfo: data.personalInfo || {
            name: 'Portfolio Loading...',
            title: 'Please wait while we load the content',
            description: 'Loading portfolio data...',
            email: '',
            location: ''
          },
          socialLinks: PortfolioService.processSocialLinksData(data.socialLinks),
          skills: PortfolioService.processSkillsData(data.skills),
          projects: PortfolioService.processProjectsData(data.projects),
          experience: PortfolioService.processExperienceData(data.experience)
        });
      } else {
        throw new Error(response.message || 'Failed to load portfolio data');
      }
    } catch (err) {
      console.error('[usePortfolioData] Error loading portfolio data:', err);
      setError(err.message);
      
      // Set default empty data on error
      setPortfolioData({
        personalInfo: {
          name: "Portfolio Loading...",
          title: "Please wait while we load the content",
          location: "",
          email: "",
          phone: "",
          description: "Loading portfolio data..."
        },
        socialLinks: [],
        skills: {},
        projects: [],
        experience: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
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
