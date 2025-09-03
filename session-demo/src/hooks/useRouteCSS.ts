import { useEffect } from 'react';
import { cssLoader, RouteCSS, ROUTE_CSS_MAP } from '../utils/cssLoader';

/**
 * Hook to load CSS for specific routes/components
 * @param routeName - Name of the route to load CSS for
 * @param options - Loading options
 */
interface UseRouteCSSOptions {
  /** Whether to unload CSS when component unmounts (default: false for better performance) */
  unloadOnUnmount?: boolean;
  /** Custom CSS content to load inline instead of external file */
  inlineCSS?: string;
  /** Whether to load CSS immediately or wait for manual trigger */
  immediate?: boolean;
}

export function useRouteCSS(
  routeName: RouteCSS | string,
  options: UseRouteCSSOptions = {}
) {
  const {
    unloadOnUnmount = false,
    inlineCSS,
    immediate = true
  } = options;

  useEffect(() => {
    if (!immediate) return;

    const loadCSS = async () => {
      try {
        if (inlineCSS) {
          cssLoader.loadInlineCSS(routeName, inlineCSS);
        } else if (routeName in ROUTE_CSS_MAP) {
          const cssPath = ROUTE_CSS_MAP[routeName as RouteCSS];
          await cssLoader.loadRouteCSS(routeName, cssPath);
        } else {
          // Fallback: try to load CSS file with same name as route
          await cssLoader.loadRouteCSS(routeName, `css/routes/${routeName}.css`);
        }
      } catch (error) {
        console.warn(`Failed to load CSS for route ${routeName}:`, error);
      }
    };

    loadCSS();

    // Cleanup function
    return () => {
      if (unloadOnUnmount) {
        cssLoader.unloadRouteCSS(routeName);
      }
    };
  }, [routeName, inlineCSS, immediate, unloadOnUnmount]);

  // Return manual control functions
  const loadCSS = async () => {
    try {
      if (inlineCSS) {
        cssLoader.loadInlineCSS(routeName, inlineCSS);
      } else if (routeName in ROUTE_CSS_MAP) {
        const cssPath = ROUTE_CSS_MAP[routeName as RouteCSS];
        await cssLoader.loadRouteCSS(routeName, cssPath);
      } else {
        await cssLoader.loadRouteCSS(routeName, `css/routes/${routeName}.css`);
      }
    } catch (error) {
      console.warn(`Failed to load CSS for route ${routeName}:`, error);
    }
  };

  const unloadCSS = () => {
    cssLoader.unloadRouteCSS(routeName);
  };

  return { loadCSS, unloadCSS };
}

/**
 * Hook to load multiple CSS routes at once
 * @param routeNames - Array of route names to load
 * @param options - Loading options
 */
export function useMultipleRouteCSS(
  routeNames: (RouteCSS | string)[],
  options: UseRouteCSSOptions = {}
) {
  const { unloadOnUnmount = false, immediate = true } = options;

  useEffect(() => {
    if (!immediate) return;

    const loadAllCSS = async () => {
      for (const routeName of routeNames) {
        try {
          if (routeName in ROUTE_CSS_MAP) {
            const cssPath = ROUTE_CSS_MAP[routeName as RouteCSS];
            await cssLoader.loadRouteCSS(routeName, cssPath);
          } else {
            await cssLoader.loadRouteCSS(routeName, `css/routes/${routeName}.css`);
          }
        } catch (error) {
          console.warn(`Failed to load CSS for route ${routeName}:`, error);
        }
      }
    };

    loadAllCSS();

    return () => {
      if (unloadOnUnmount) {
        routeNames.forEach(routeName => {
          cssLoader.unloadRouteCSS(routeName);
        });
      }
    };
  }, [routeNames, immediate, unloadOnUnmount]);
}