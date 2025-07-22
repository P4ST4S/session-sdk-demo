import axios, { AxiosError } from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";

// Types pour la configuration de l'API
export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

// Types pour les réponses
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class ApiService {
  private client: AxiosInstance;
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        Accept: "application/json",
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Intercepteur de requête
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Log des requêtes en développement
        if (process.env.NODE_ENV === "development") {
          console.log(
            `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
          );
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Intercepteur de réponse pour gérer les erreurs
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `✅ API Response: ${response.status} ${response.config.url}`
          );
        }
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    let apiError: ApiError = {
      message: "Une erreur inattendue s'est produite",
      status: 500,
    };

    if (error.response) {
      // Erreur de réponse du serveur
      const { status, data } = error.response;
      apiError = {
        message: (data as any)?.message || `Erreur ${status}`,
        status,
        code: (data as any)?.code,
        details: data,
      };
    } else if (error.request) {
      // Erreur réseau
      apiError = {
        message: "Erreur de connexion réseau",
        code: "NETWORK_ERROR",
      };
    } else if (error.code === "ECONNABORTED") {
      // Timeout
      apiError = {
        message: "Délai d'attente dépassé",
        code: "TIMEOUT_ERROR",
      };
    }

    console.error("❌ API Error:", apiError);
    return apiError;
  }

  // Plus de retryRequest, shouldRetry, ni delay : chaque appel Axios ne sera fait qu'une seule fois

  // Méthodes publiques pour les requêtes HTTP
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url, config);
    return {
      data: response.data,
      success: true,
      status: response.status,
    };
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    console.log("API POST method called", url, data);
    const response = await this.client.post<T>(url, data, config);
    return {
      data: response.data,
      success: true,
      status: response.status,
    };
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data, config);
    return {
      data: response.data,
      success: true,
      status: response.status,
    };
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<T>(url, data, config);
    return {
      data: response.data,
      success: true,
      status: response.status,
    };
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url, config);
    return {
      data: response.data,
      success: true,
      status: response.status,
    };
  }

  // Méthodes utilitaires
  setDefaultHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }

  // Méthode pour créer une nouvelle instance avec une configuration différente
  createInstance(config: Partial<ApiConfig>): ApiService {
    return new ApiService({ ...this.config, ...config });
  }

  // Accès à l'instance Axios pour des cas spéciaux
  getRawClient(): AxiosInstance {
    return this.client;
  }
}

// Factory pour créer une instance
export const createApiService = (config: ApiConfig): ApiService => {
  return new ApiService(config);
};

// Instance par défaut (à configurer selon vos besoins)
export const apiService = createApiService({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8888/backend/session/sdk",
  timeout: 30000,
});
