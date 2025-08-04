/**
 * @fileoverview Portfolio Data Hook - Custom hook for portfolio data management
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
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
  // Initialize with empty data structure - will be populated by API
  const emptyPortfolioData = {
    personalInfo: {},
    socialLinks: [],
    skills: {
      frontend: [],
      backend: [],
      tools: []
    },
    projects: [],
    experience: []
  };

  const [portfolioData, setPortfolioData] = useState(emptyPortfolioData);
  const [loading, setLoading] = useState(true); // Start with true since we need to load data
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
          
          // Use only API data - no fallback to defaults
          const finalData = {
            personalInfo: data.personalInfo || {},
            socialLinks: processedSocialLinks || [],
            skills: processedSkills || { frontend: [], backend: [], tools: [] },
            projects: processedProjects || [],
            experience: processedExperience || []
          };
          
          
          setPortfolioData(finalData);
          
        } else {
          setError('Failed to load portfolio data');
        }
      } catch (err) {
        setError('Failed to connect to portfolio service');
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
