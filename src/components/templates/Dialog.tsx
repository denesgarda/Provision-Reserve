import React, { useEffect, useRef, KeyboardEvent, ReactNode } from 'react';

export type DialogButton = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  autoFocus?: boolean;
};

export type DialogProps = {
  // Core properties
  isOpen: boolean;
  onClose: () => void;

  // Content
  title?: string;
  children: ReactNode;
  description?: string;

  // Buttons
  buttons?: DialogButton[];
  showCloseButton?: boolean;

  // Styling
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'warning' | 'danger' | 'success' | 'info';
  className?: string;
  overlayClassName?: string;
  dialogClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;

  // Behavior
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventClose?: boolean;

  // Accessibility
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;

  // Animation/Transition
  showAnimation?: boolean;

  // Custom close icon
  closeIcon?: ReactNode;
};

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  description,
  buttons = [],
  showCloseButton = true,
  size = 'md',
  variant = 'default',
  className = '',
  overlayClassName = '',
  dialogClassName = '',
  headerClassName = '',
  contentClassName = '',
  footerClassName = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventClose = false,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  showAnimation = false,
  closeIcon
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && !preventClose) {
        onClose();
      }
    };

    const handleGlobalKeyDown = (event: globalThis.KeyboardEvent) => {
      handleKeyDown(event as any);
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, closeOnEscape, preventClose, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the dialog
      if (dialogRef.current) {
        dialogRef.current.focus();
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore previous focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }

      // Restore body scroll
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick && !preventClose) {
      onClose();
    }
  };

  // Handle dialog key navigation
  const handleDialogKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      // Trap focus within dialog
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    const sizeClasses = {
      sm: 'dialog-sm',
      md: 'dialog-md',
      lg: 'dialog-lg',
      xl: 'dialog-xl',
      full: 'dialog-full'
    };
    return sizeClasses[size];
  };

  // Get variant classes
  const getVariantClasses = () => {
    const variantClasses = {
      default: 'dialog-default',
      warning: 'dialog-warning',
      danger: 'dialog-danger',
      success: 'dialog-success',
      info: 'dialog-info'
    };
    return variantClasses[variant];
  };

  if (!isOpen) return null;

  return (
    <div
      className={`dialog-overlay ${overlayClassName}`}
      onClick={handleOverlayClick}
      role="presentation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001,
        ...(showAnimation && {
          animation: 'dialog-fade-in 0.2s ease-out'
        })
      }}
    >
      <div
        ref={dialogRef}
        className={`dialog ${getSizeClasses()} ${getVariantClasses()} ${dialogClassName}`}
        onKeyDown={handleDialogKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy || (title ? 'dialog-title' : undefined)}
        aria-describedby={ariaDescribedBy || (description ? 'dialog-description' : undefined)}
        tabIndex={-1}
        style={{
          backgroundColor: 'white',
          borderRadius: '6px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          ...(showAnimation && {
            animation: 'dialog-slide-in 0.2s ease-out'
          })
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`dialog-header ${headerClassName}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              flexShrink: 0
            }}
          >
            {title && (
              <h2
                id="dialog-title"
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827'
                }}
              >
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                onClick={onClose}
                disabled={preventClose}
                aria-label="Close dialog"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: preventClose ? 'not-allowed' : 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  opacity: preventClose ? 0.5 : 1,
                  transition: 'color 120ms ease, background-color 120ms ease'
                }}
                onMouseEnter={(e) => {
                  if (!preventClose) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!preventClose) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                {closeIcon || (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <div
            id="dialog-description"
            style={{
              padding: '0 20px 16px',
              fontSize: '14px',
              color: '#6b7280'
            }}
          >
            {description}
          </div>
        )}

        {/* Content */}
        <div
          className={`dialog-content ${contentClassName}`}
          style={{
            padding: '20px',
            flex: 1,
            overflowY: 'auto'
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {buttons.length > 0 && (
          <div
            className={`dialog-footer ${footerClassName}`}
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-end',
              padding: '16px 20px',
              borderTop: '1px solid #e5e7eb',
              flexShrink: 0
            }}
          >
            {buttons.map((button, index) => {
              const buttonClassName = `standard-button ${
                button.variant === 'primary' ? 'primary' :
                button.variant === 'danger' ? '' : ''
              }`;

              return (
                <button
                  key={index}
                  onClick={button.onClick}
                  disabled={button.disabled}
                  autoFocus={button.autoFocus}
                  className={buttonClassName}
                  style={{
                    opacity: button.disabled ? 0.5 : 1,
                    cursor: button.disabled ? 'not-allowed' : 'pointer'
                  }}
                >
                  {button.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


// Preset dialog components for common use cases
export function ConfirmDialog({
  isOpen,
  onClose,
  title = 'Confirm Action',
  message,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  ...props
}: Omit<DialogProps, 'children' | 'buttons'> & {
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      buttons={[
        {
          label: cancelLabel,
          onClick: onClose,
          variant: 'secondary'
        },
        {
          label: confirmLabel,
          onClick: () => {
            onConfirm();
            onClose();
          },
          variant: variant === 'danger' ? 'danger' : 'primary',
          autoFocus: true
        }
      ]}
      {...props}
    >
      <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
        {message}
      </p>
    </Dialog>
  );
}

export function AlertDialog({
  isOpen,
  onClose,
  title = 'Alert',
  message,
  confirmLabel = 'OK',
  variant = 'info',
  ...props
}: Omit<DialogProps, 'children' | 'buttons'> & {
  message: string;
  confirmLabel?: string;
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      buttons={[
        {
          label: confirmLabel,
          onClick: onClose,
          variant: 'primary',
          autoFocus: true
        }
      ]}
      {...props}
    >
      <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
        {message}
      </p>
    </Dialog>
  );
}
