import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * Screen Reader Only text component
 * Provides text that's only visible to screen readers
 */
export const ScreenReaderOnly = ({ children, className, ...props }) => (
  <span
    className={cn(
      "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
      className
    )}
    {...props}
  >
    {children}
  </span>
);

/**
 * Skip to main content link for keyboard navigation
 */
export const SkipToMain = ({ targetId = "main-content", className }) => (
  <a
    href={`#${targetId}`}
    className={cn(
      "absolute top-0 left-0 z-50 p-4 bg-primary text-primary-foreground",
      "translate-y-[-100%] focus:translate-y-0 transition-transform",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className
    )}
  >
    Skip to main content
  </a>
);

/**
 * Accessible heading component with proper hierarchy
 */
export const AccessibleHeading = ({ 
  level = 1, 
  children, 
  className,
  visualLevel,
  ...props 
}) => {
  const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}`;
  const visualClass = visualLevel ? `text-${visualLevel}xl font-bold` : '';
  
  return React.createElement(
    HeadingTag,
    {
      className: cn(visualClass, className),
      ...props
    },
    children
  );
};

/**
 * Accessible button with proper ARIA attributes
 */
export const AccessibleButton = ({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaPressed,
  type = "button",
  className,
  ...props
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    aria-expanded={ariaExpanded}
    aria-pressed={ariaPressed}
    className={cn(
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "transition-colors",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

/**
 * Accessible form field with proper labeling and error handling
 */
export const AccessibleField = ({
  id,
  label,
  error,
  hint,
  required = false,
  children,
  className
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <label 
        htmlFor={id} 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      
      {React.cloneElement(children, {
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? 'true' : 'false',
        'aria-required': required
      })}
      
      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Live region for announcing dynamic content changes
 */
export const LiveRegion = ({ 
  children, 
  politeness = "polite", 
  atomic = false,
  className 
}) => (
  <div
    aria-live={politeness}
    aria-atomic={atomic}
    className={cn("sr-only", className)}
  >
    {children}
  </div>
);

/**
 * Accessible modal dialog with focus management
 */
export const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  ...props
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement;
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      
      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
        
        // Restore focus to the previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${title}-title` : undefined}
        tabIndex={-1}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
          "gap-4 border bg-background p-6 shadow-lg duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {title && (
          <AccessibleHeading level={2} id={`${title}-title`} className="text-lg font-semibold">
            {title}
          </AccessibleHeading>
        )}
        {children}
      </div>
    </div>
  );
};

/**
 * Accessible progress indicator
 */
export const AccessibleProgress = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  className,
  ...props
}) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${percentage}%`}
        />
      </div>
      <ScreenReaderOnly>
        {label} progress: {percentage}% complete
      </ScreenReaderOnly>
    </div>
  );
};

/**
 * Keyboard navigation handler hook
 */
export const useKeyboardNavigation = (items, onSelect) => {
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev <= 0 ? items.length - 1 : prev - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && items[focusedIndex]) {
          onSelect(items[focusedIndex], focusedIndex);
        }
        break;
      case 'Escape':
        setFocusedIndex(-1);
        break;
    }
  };

  return { focusedIndex, handleKeyDown, setFocusedIndex };
};