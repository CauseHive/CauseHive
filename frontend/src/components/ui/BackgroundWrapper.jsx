import React from 'react';
import { cn } from '../../lib/utils';

/**
 * BackgroundWrapper component for applying consistent background across the app
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.variant - Background variant ('default', 'light', 'overlay', 'gradient')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fullHeight - Whether to use full viewport height
 * @param {boolean} props.withOverlay - Whether to apply background overlay
 */
export const BackgroundWrapper = ({ 
  children, 
  variant = 'default',
  className = '',
  fullHeight = true,
  withOverlay = true
}) => {
  const getBackgroundClass = () => {
    switch (variant) {
      case 'light':
        return 'app-background-light';
      case 'default':
      default:
        return 'app-background';
    }
  };

  const getOverlayClass = () => {
    if (!withOverlay) return '';
    
    switch (variant) {
      case 'light':
        return 'app-background-light-overlay';
      case 'gradient':
        return 'app-background-overlay-gradient';
      case 'default':
      default:
        return 'app-background-overlay';
    }
  };

  return (
    <div className={cn(getBackgroundClass(), fullHeight && 'min-h-screen', className)}>
      {withOverlay ? (
        <div className={cn(getOverlayClass(), fullHeight && 'min-h-screen')}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

/**
 * ContentCard component for content that needs to stand out against the background
 */
export const ContentCard = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={cn('content-container', className)} 
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Modal background component for overlays
 */
export const ModalBackground = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={cn('modal-background-blur', className)} 
      {...props}
    >
      {children}
    </div>
  );
};

export default BackgroundWrapper;