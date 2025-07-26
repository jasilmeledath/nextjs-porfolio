/**
 * @fileoverview Common Form Footer Component with Save Button
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-07-26
 * @lastModified 2025-07-26
 * @version 1.0.0
 */

import { motion } from 'framer-motion';
import { FiSave } from 'react-icons/fi';

/**
 * Form Footer Component with Save Button
 * @function FormFooter
 * @param {Object} props - Component props
 * @param {Function} props.onSave - Save function to call
 * @param {boolean} props.saving - Is saving in progress
 * @param {string} props.buttonText - Text to display on button
 * @returns {JSX.Element} Form footer component
 */
export default function FormFooter({ onSave, saving = false, buttonText = 'Save Information' }) {
  /**
   * Handle save button click
   * Uses setTimeout to avoid event propagation issues
   */
  const handleSaveClick = (e) => {
    console.log('==================== FORM FOOTER BUTTON CLICK ====================');
    console.log('[FormFooter] Save button clicked - event:', e);
    console.log('[FormFooter] onSave function:', typeof onSave, onSave);
    console.log('[FormFooter] saving state:', saving);
    
    if (!saving && onSave && typeof onSave === 'function') {
      // Prevent any default behavior
      e.preventDefault();
      e.stopPropagation();
      
      // Use setTimeout to ensure the function is called outside the current event loop
      setTimeout(() => {
        console.log('[FormFooter] Calling onSave function now...');
        try {
          onSave();
        } catch (error) {
          console.error('[FormFooter] Error calling onSave:', error);
        }
      }, 0);
    } else {
      console.log('[FormFooter] Not calling onSave - conditions not met');
    }
  };

  return (
    <div 
      className="flex justify-end mt-8 py-4 border-t border-green-500/20"
      style={{ pointerEvents: 'auto', zIndex: 1000 }}
    >
      <button
        type="button"
        onClick={handleSaveClick}
        onMouseDown={() => console.log('[FormFooter] Button mouse down event')}
        onMouseUp={() => console.log('[FormFooter] Button mouse up event')}
        onPointerDown={() => console.log('[FormFooter] Button pointer down event')}
        onPointerUp={() => console.log('[FormFooter] Button pointer up event')}
        disabled={saving}
        className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-mono font-bold rounded-lg transition-all duration-300 shadow-lg shadow-green-500/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed relative z-50"
        style={{ pointerEvents: 'auto' }}
      >
        {saving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
            Saving...
          </>
        ) : (
          <>
            <FiSave className="w-4 h-4 mr-2" />
            {buttonText}
          </>
        )}
      </button>
    </div>
  );
}