/**
 * @fileoverview Resume Manager Component for Admin Portfolio
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FiDownload,
  FiEye,
  FiFile,
  FiExternalLink,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import PortfolioManagementService from '../../services/portfolio-management-service';

/**
 * Resume Manager Component
 * @function ResumeManager
 * @returns {JSX.Element} Resume management component
 */
export default function ResumeManager() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [viewing, setViewing] = useState(false);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Load resume data on component mount
  useEffect(() => {
    checkResumeAvailability();
  }, []);

  /**
   * Check if resume is available
   */
  const checkResumeAvailability = async () => {
    try {
      setLoading(true);
      const response = await PortfolioManagementService.checkResumeAvailability();
      
      if (response.success) {
        setResumeData(response.data);
      } else {
        setResumeData({ hasResume: false, resumeUrl: null });
      }
    } catch (error) {
      console.error('[ResumeManager] Error checking resume availability:', error);
      setResumeData({ hasResume: false, resumeUrl: null });
      toast.error('Failed to check resume availability');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle resume download
   */
  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      const response = await PortfolioManagementService.downloadResume();
      
      if (response.success) {
        // Create blob URL and trigger download
        const url = window.URL.createObjectURL(response.data.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.data.fileName || 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        toast.success('Resume downloaded successfully');
      }
    } catch (error) {
      console.error('[ResumeManager] Error downloading resume:', error);
      
      if (error.message.includes('not found')) {
        toast.error('Resume file not found on server');
      } else {
        toast.error('Failed to download resume');
      }
    } finally {
      setDownloading(false);
    }
  };

  /**
   * Handle resume view in new tab
   */
  const handleView = async () => {
    try {
      setViewing(true);
      
      const response = await PortfolioManagementService.viewResume();
      
      if (response.success) {
        // Open resume in new tab
        const newWindow = window.open(response.data.viewUrl, '_blank');
        
        if (newWindow) {
          toast.success('Resume opened in new tab');
        } else {
          toast.error('Please allow popups to view resume');
        }
      }
    } catch (error) {
      console.error('[ResumeManager] Error viewing resume:', error);
      
      if (error.message.includes('not found')) {
        toast.error('Resume file not found on server');
      } else {
        toast.error('Failed to view resume');
      }
    } finally {
      setViewing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-400 rounded-full animate-spin"></div>
          <span className="ml-3 text-green-400 font-mono">Checking resume...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-mono font-bold text-green-400 tracking-wide">
          RESUME_MANAGER
        </h3>
        <button
          onClick={checkResumeAvailability}
          className="flex items-center space-x-2 px-3 py-1 text-xs font-mono text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded border border-green-500/30 hover:border-green-500/50 transition-all duration-300"
        >
          <FiRefreshCw className="w-3 h-3" />
          <span>REFRESH</span>
        </button>
      </div>

      {resumeData?.hasResume ? (
        <div className="space-y-4">
          {/* Resume Status */}
          <div className="flex items-center space-x-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <FiCheckCircle className="w-5 h-5 text-green-400" />
            <div className="flex-1">
              <div className="text-sm font-mono font-medium text-green-300">
                Resume Available
              </div>
              <div className="text-xs text-green-600 font-mono">
                {resumeData.resumeUrl ? `File: ${resumeData.resumeUrl.split('/').pop()}` : 'Ready for download'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleView}
              disabled={viewing}
              className="flex items-center justify-center space-x-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {viewing ? (
                <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
              ) : (
                <FiEye className="w-5 h-5 text-blue-400 group-hover:animate-pulse" />
              )}
              <div className="text-left">
                <div className="text-sm font-mono font-medium text-blue-300">
                  {viewing ? 'Opening...' : 'View Resume'}
                </div>
                <div className="text-xs text-blue-600">
                  Open in browser
                </div>
              </div>
              <FiExternalLink className="w-4 h-4 text-blue-400 opacity-50" />
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center justify-center space-x-3 p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <div className="w-5 h-5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
              ) : (
                <FiDownload className="w-5 h-5 text-green-400 group-hover:animate-pulse" />
              )}
              <div className="text-left">
                <div className="text-sm font-mono font-medium text-green-300">
                  {downloading ? 'Downloading...' : 'Download Resume'}
                </div>
                <div className="text-xs text-green-600">
                  Save to device
                </div>
              </div>
            </button>
          </div>

          {/* Resume Info */}
          <div className="p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <FiFile className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-mono text-gray-300">Resume Details</span>
            </div>
            <div className="text-xs font-mono text-gray-500 space-y-1">
              <div>• Format: PDF</div>
              <div>• Source: Server Database</div>
              <div>• Access: Authenticated Users</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FiAlertCircle className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-lg font-mono font-medium text-yellow-300">
                No Resume Available
              </div>
              <div className="text-sm text-yellow-600">
                Upload a resume in Personal Info section
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-left">
            <div className="text-xs font-mono text-yellow-600 space-y-1">
              <div>• Go to Personal Info management</div>
              <div>• Upload your resume PDF file</div>
              <div>• Return here to download/view</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
