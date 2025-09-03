/**
 * CSS Route Loading Utility
 * Dynamically loads and manages CSS files based on routes/components
 */

interface LoadedCSS {
  link: HTMLLinkElement;
  refCount: number;
}

class CSSLoader {
  private loadedCSS: Map<string, LoadedCSS> = new Map();
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Load a CSS file for a specific route/component
   * @param routeName - Name of the route/component
   * @param cssPath - Path to the CSS file (relative to base URL)
   */
  async loadRouteCSS(routeName: string, cssPath: string): Promise<void> {
    const fullPath = `${this.baseUrl}${cssPath}`;
    
    // Check if CSS is already loaded
    const existing = this.loadedCSS.get(routeName);
    if (existing) {
      existing.refCount++;
      return;
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = fullPath;
      link.dataset.route = routeName;

      link.onload = () => {
        this.loadedCSS.set(routeName, { link, refCount: 1 });
        resolve();
      };

      link.onerror = () => {
        reject(new Error(`Failed to load CSS for route: ${routeName}`));
      };

      document.head.appendChild(link);
    });
  }

  /**
   * Unload CSS for a specific route/component
   * @param routeName - Name of the route/component
   */
  unloadRouteCSS(routeName: string): void {
    const existing = this.loadedCSS.get(routeName);
    if (!existing) return;

    existing.refCount--;
    
    if (existing.refCount <= 0) {
      document.head.removeChild(existing.link);
      this.loadedCSS.delete(routeName);
    }
  }

  /**
   * Load CSS inline (for smaller styles)
   * @param routeName - Name of the route/component
   * @param cssContent - CSS content as string
   */
  loadInlineCSS(routeName: string, cssContent: string): void {
    // Check if already loaded
    if (this.loadedCSS.has(routeName)) {
      const existing = this.loadedCSS.get(routeName)!;
      existing.refCount++;
      return;
    }

    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = cssContent;
    style.dataset.route = routeName;

    document.head.appendChild(style);
    this.loadedCSS.set(routeName, { 
      link: style as any, // Type cast for consistency
      refCount: 1 
    });
  }

  /**
   * Get all currently loaded routes
   */
  getLoadedRoutes(): string[] {
    return Array.from(this.loadedCSS.keys());
  }

  /**
   * Clean up all loaded CSS
   */
  cleanup(): void {
    this.loadedCSS.forEach((cssData, routeName) => {
      document.head.removeChild(cssData.link);
    });
    this.loadedCSS.clear();
  }
}

// Global instance - will be configured by the SDK consumer
export const cssLoader = new CSSLoader();

/**
 * Configure the CSS loader base URL
 * This should be called once when the SDK is initialized
 * @param baseUrl - Base URL where CSS files are served from
 */
export function configureCSSLoader(baseUrl: string) {
  cssLoader['baseUrl'] = baseUrl;
}

// Route CSS mappings
export const ROUTE_CSS_MAP = {
  // Core routes
  'start': 'css/routes/start.css',
  'user-input': 'css/routes/user-input.css',
  'contact-info': 'css/routes/contact-info.css',
  'otp': 'css/routes/otp.css',
  
  // Main flows
  'selfie': 'css/routes/selfie.css',
  'document-check': 'css/routes/document-check.css',
  'end-flow': 'css/routes/end-flow.css',
  
  // Sub-components
  'jdi': 'css/components/jdi.css',
  'video-recorder': 'css/components/video-recorder.css',
  'ui-components': 'css/components/ui.css',
} as const;

export type RouteCSS = keyof typeof ROUTE_CSS_MAP;