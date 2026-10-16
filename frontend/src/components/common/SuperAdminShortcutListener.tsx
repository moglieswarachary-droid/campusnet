import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * SuperAdminShortcutListener
 * Listens for global shortcut Shift + Z to securely navigate to the Super Admin Console.
 * Disregards events triggered when typing inside text inputs, textareas, or contentEditable nodes.
 */
export const SuperAdminShortcutListener: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently interacting with an input/textarea/editable field
      const target = e.target as HTMLElement | null;
      if (
        target && (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable
        )
      ) {
        return;
      }

      // Check for Shift + Z combination
      const isShiftZ = e.shiftKey && (e.key === 'Z' || e.key === 'z' || e.code === 'KeyZ');
      
      if (isShiftZ) {
        e.preventDefault();
        
        if (!location.pathname.startsWith('/admin')) {
          addToast({
            type: 'info',
            title: 'Admin Shortcut (Shift+Z)',
            message: 'Secret shortcut detected. Opening Super Administrator Console.'
          });
          navigate('/admin');
        } else {
          addToast({
            type: 'info',
            title: 'Admin Console Active',
            message: 'You are already in the Super Administrator Console.'
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, location.pathname, addToast]);

  return null;
};
