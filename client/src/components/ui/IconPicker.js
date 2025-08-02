/**
 * @fileoverview Icon Picker Component - Visual logo selection for skills management
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-08-02
 * @lastModified 2025-08-02
 * @version 1.0.0
 */

"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiChevronDown, FiFilter } from 'react-icons/fi';

// Icon Libraries - Popular icons for technology skills
const ICON_LIBRARIES = {
  'react-icons/si': {
    name: 'Simple Icons',
    description: 'Brand and technology logos',
    icons: {
      // Frontend
      'SiReact': { name: 'React', category: 'frontend', color: '#61DAFB' },
      'SiVuedotjs': { name: 'Vue.js', category: 'frontend', color: '#4FC08D' },
      'SiAngular': { name: 'Angular', category: 'frontend', color: '#DD0031' },
      'SiSvelte': { name: 'Svelte', category: 'frontend', color: '#FF3E00' },
      'SiNextdotjs': { name: 'Next.js', category: 'frontend', color: '#000000' },
      'SiNuxtdotjs': { name: 'Nuxt.js', category: 'frontend', color: '#00C58E' },
      'SiJavascript': { name: 'JavaScript', category: 'frontend', color: '#F7DF1E' },
      'SiTypescript': { name: 'TypeScript', category: 'frontend', color: '#3178C6' },
      'SiHtml5': { name: 'HTML5', category: 'frontend', color: '#E34F26' },
      'SiCss3': { name: 'CSS3', category: 'frontend', color: '#1572B6' },
      'SiSass': { name: 'Sass', category: 'frontend', color: '#CC6699' },
      'SiTailwindcss': { name: 'Tailwind CSS', category: 'frontend', color: '#06B6D4' },
      'SiBootstrap': { name: 'Bootstrap', category: 'frontend', color: '#7952B3' },
      'SiMaterialui': { name: 'Material-UI', category: 'frontend', color: '#007FFF' },
      'SiChakraui': { name: 'Chakra UI', category: 'frontend', color: '#319795' },
      
      // Backend
      'SiNodedotjs': { name: 'Node.js', category: 'backend', color: '#339933' },
      'SiExpress': { name: 'Express.js', category: 'backend', color: '#000000' },
      'SiNestjs': { name: 'NestJS', category: 'backend', color: '#E0234E' },
      'SiPython': { name: 'Python', category: 'backend', color: '#3776AB' },
      'SiDjango': { name: 'Django', category: 'backend', color: '#092E20' },
      'SiFastapi': { name: 'FastAPI', category: 'backend', color: '#009688' },
      'SiFlask': { name: 'Flask', category: 'backend', color: '#000000' },
      'SiPhp': { name: 'PHP', category: 'backend', color: '#777BB4' },
      'SiLaravel': { name: 'Laravel', category: 'backend', color: '#FF2D20' },
      'SiRubyonrails': { name: 'Ruby on Rails', category: 'backend', color: '#CC0000' },
      'SiSpring': { name: 'Spring', category: 'backend', color: '#6DB33F' },
      'SiJava': { name: 'Java', category: 'backend', color: '#ED8B00' },
      'SiCsharp': { name: 'C#', category: 'backend', color: '#239120' },
      'SiDotnet': { name: '.NET', category: 'backend', color: '#512BD4' },
      'SiGo': { name: 'Go', category: 'backend', color: '#00ADD8' },
      'SiRust': { name: 'Rust', category: 'backend', color: '#000000' },

      // Databases
      'SiMongodb': { name: 'MongoDB', category: 'tools', color: '#47A248' },
      'SiPostgresql': { name: 'PostgreSQL', category: 'tools', color: '#4169E1' },
      'SiMysql': { name: 'MySQL', category: 'tools', color: '#4479A1' },
      'SiRedis': { name: 'Redis', category: 'tools', color: '#DC382D' },
      'SiSqlite': { name: 'SQLite', category: 'tools', color: '#003B57' },
      'SiFirebase': { name: 'Firebase', category: 'tools', color: '#FFCA28' },
      'SiSupabase': { name: 'Supabase', category: 'tools', color: '#3ECF8E' },

      // Tools & DevOps
      'SiGit': { name: 'Git', category: 'tools', color: '#F05032' },
      'SiGithub': { name: 'GitHub', category: 'tools', color: '#181717' },
      'SiGitlab': { name: 'GitLab', category: 'tools', color: '#FCA326' },
      'SiDocker': { name: 'Docker', category: 'tools', color: '#2496ED' },
      'SiKubernetes': { name: 'Kubernetes', category: 'tools', color: '#326CE5' },
      'SiAmazonaws': { name: 'AWS', category: 'tools', color: '#232F3E' },
      'SiGooglecloud': { name: 'Google Cloud', category: 'tools', color: '#4285F4' },
      'SiMicrosoftazure': { name: 'Azure', category: 'tools', color: '#0078D4' },
      'SiVercel': { name: 'Vercel', category: 'tools', color: '#000000' },
      'SiNetlify': { name: 'Netlify', category: 'tools', color: '#00C7B7' },
      'SiHeroku': { name: 'Heroku', category: 'tools', color: '#430098' },
      'SiJenkins': { name: 'Jenkins', category: 'tools', color: '#D24939' },
      'SiVite': { name: 'Vite', category: 'tools', color: '#646CFF' },
      'SiWebpack': { name: 'Webpack', category: 'tools', color: '#8DD6F9' },
      'SiEslint': { name: 'ESLint', category: 'tools', color: '#4B32C3' },
      'SiPrettier': { name: 'Prettier', category: 'tools', color: '#F7B93E' },
      'SiJest': { name: 'Jest', category: 'tools', color: '#C21325' },
      'SiCypress': { name: 'Cypress', category: 'tools', color: '#17202C' },
      'SiPostman': { name: 'Postman', category: 'tools', color: '#FF6C37' },
      'SiInsomnia': { name: 'Insomnia', category: 'tools', color: '#4000BF' },
      
      // Design
      'SiFigma': { name: 'Figma', category: 'design', color: '#F24E1E' },
      'SiSketch': { name: 'Sketch', category: 'design', color: '#F7B500' },
      'SiAdobexd': { name: 'Adobe XD', category: 'design', color: '#FF61F6' },
      'SiAdobephotoshop': { name: 'Photoshop', category: 'design', color: '#31A8FF' },
      'SiAdobeillustrator': { name: 'Illustrator', category: 'design', color: '#FF9A00' }
    }
  },
  'react-icons/fa': {
    name: 'Font Awesome',
    description: 'General purpose icons',
    icons: {
      'FaCode': { name: 'Code', category: 'tools', color: '#4A5568' },
      'FaDatabase': { name: 'Database', category: 'tools', color: '#4A5568' },
      'FaServer': { name: 'Server', category: 'tools', color: '#4A5568' },
      'FaDesktop': { name: 'Desktop', category: 'tools', color: '#4A5568' },
      'FaMobile': { name: 'Mobile', category: 'frontend', color: '#4A5568' },
      'FaCloud': { name: 'Cloud', category: 'tools', color: '#4A5568' },
      'FaCog': { name: 'Settings', category: 'tools', color: '#4A5568' },
      'FaTools': { name: 'Tools', category: 'tools', color: '#4A5568' },
      'FaLaptopCode': { name: 'Development', category: 'tools', color: '#4A5568' },
      'FaTerminal': { name: 'Terminal', category: 'tools', color: '#4A5568' }
    }
  },
  'react-icons/di': {
    name: 'Devicons',
    description: 'Development specific icons',
    icons: {
      'DiReact': { name: 'React', category: 'frontend', color: '#61DAFB' },
      'DiNodejsSmall': { name: 'Node.js', category: 'backend', color: '#339933' },
      'DiMongodb': { name: 'MongoDB', category: 'tools', color: '#47A248' },
      'DiGit': { name: 'Git', category: 'tools', color: '#F05032' },
      'DiJavascript1': { name: 'JavaScript', category: 'frontend', color: '#F7DF1E' },
      'DiHtml5': { name: 'HTML5', category: 'frontend', color: '#E34F26' },
      'DiCss3': { name: 'CSS3', category: 'frontend', color: '#1572B6' },
      'DiPython': { name: 'Python', category: 'backend', color: '#3776AB' },
      'DiDocker': { name: 'Docker', category: 'tools', color: '#2496ED' },
      'DiNpm': { name: 'NPM', category: 'tools', color: '#CB3837' }
    }
  }
};

const CATEGORIES = [
  { value: 'all', label: 'All', color: 'bg-gray-500' },
  { value: 'frontend', label: 'Frontend', color: 'bg-blue-500' },
  { value: 'backend', label: 'Backend', color: 'bg-green-500' },
  { value: 'tools', label: 'Tools', color: 'bg-purple-500' },
  { value: 'design', label: 'Design', color: 'bg-pink-500' }
];

const IconPicker = ({
  selectedIcon = '',
  selectedLibrary = 'react-icons/si',
  onSelect,
  isOpen = false,
  onClose,
  isDark = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentLibrary, setCurrentLibrary] = useState(selectedLibrary);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    const library = ICON_LIBRARIES[currentLibrary];
    if (!library) return [];

    let icons = Object.entries(library.icons);

    // Filter by category
    if (selectedCategory !== 'all') {
      icons = icons.filter(([, iconData]) => iconData.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      icons = icons.filter(([iconKey, iconData]) => 
        iconData.name.toLowerCase().includes(query) ||
        iconKey.toLowerCase().includes(query)
      );
    }

    return icons;
  }, [currentLibrary, selectedCategory, searchQuery]);

  // Get icon component dynamically
  const getIconComponent = (library, iconKey) => {
    try {
      switch (library) {
        case 'react-icons/si':
          return require('react-icons/si')[iconKey];
        case 'react-icons/fa':
          return require('react-icons/fa')[iconKey];
        case 'react-icons/di':
          return require('react-icons/di')[iconKey];
        default:
          return null;
      }
    } catch (error) {
      return null;
    }
  };

  // Handle icon selection
  const handleIconSelect = (iconKey, iconData) => {
    onSelect({
      logoIdentifier: iconKey,
      logoLibrary: currentLibrary,
      name: iconData.name,
      color: iconData.color
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${
            isDark 
              ? 'bg-gray-900 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Select Icon
              </h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Library Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Icon Library
                </label>
                <select
                  value={currentLibrary}
                  onChange={(e) => setCurrentLibrary(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {Object.entries(ICON_LIBRARIES).map(([key, library]) => (
                    <option key={key} value={key}>
                      {library.name} - {library.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      placeholder="Search icons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark 
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Icons Grid */}
          <div className="p-6 overflow-y-auto max-h-96">
            {filteredIcons.length === 0 ? (
              <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <FiFilter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No icons found matching your criteria</p>
                <p className="text-sm mt-2">Try adjusting your search or category filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {filteredIcons.map(([iconKey, iconData]) => {
                  const IconComponent = getIconComponent(currentLibrary, iconKey);
                  const isSelected = iconKey === selectedIcon && currentLibrary === selectedLibrary;

                  return (
                    <motion.button
                      key={iconKey}
                      onClick={() => handleIconSelect(iconKey, iconData)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 group ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/20 shadow-lg'
                          : isDark
                            ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={iconData.name}
                    >
                      {IconComponent ? (
                        <IconComponent 
                          className="w-6 h-6 mx-auto" 
                          style={{ color: iconData.color }}
                        />
                      ) : (
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          ?
                        </div>
                      )}
                      <div className={`text-xs mt-2 truncate transition-colors ${
                        isSelected 
                          ? 'text-blue-400 font-medium'
                          : isDark
                            ? 'text-gray-400 group-hover:text-gray-300'
                            : 'text-gray-500 group-hover:text-gray-700'
                      }`}>
                        {iconData.name}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IconPicker;
