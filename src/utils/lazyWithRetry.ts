import React, { ComponentType, lazy } from 'react';

/**
 * Wraps React.lazy with an automatic single reload retry mechanism
 * to recover from stale deployment chunk hashes and network dropouts.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('campusnet_chunk_retry') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('campusnet_chunk_retry', 'false');
      return component;
    } catch (error: any) {
      console.warn('CampusNet dynamic chunk load failure detected:', error);
      
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem('campusnet_chunk_retry', 'true');
        window.location.reload();
        // Return a promise that never resolves while reloading so React does not render crashed state
        return new Promise<{ default: T }>(() => {});
      }

      // If already refreshed and still failing, throw to the ErrorBoundary
      window.sessionStorage.setItem('campusnet_chunk_retry', 'false');
      throw error;
    }
  });
}
