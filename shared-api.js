// Shared API utilities to reduce code duplication and improve performance

// Date utility functions for consistent timezone handling
class DateUtils {
    // Convert date to local date string (YYYY-MM-DD) without timezone issues
    static toLocalDateString(date) {
        if (!date) return null;
        const d = date instanceof Date ? date : new Date(date + 'T00:00:00');
        return d.getFullYear() + '-' + 
               String(d.getMonth() + 1).padStart(2, '0') + '-' + 
               String(d.getDate()).padStart(2, '0');
    }

    // Get today's date in local timezone
    static getTodayString() {
        const today = new Date();
        return this.toLocalDateString(today);
    }

    // Compare two dates (date strings or Date objects) 
    static isSameDate(date1, date2) {
        return this.toLocalDateString(date1) === this.toLocalDateString(date2);
    }

    // Check if date is today
    static isToday(date) {
        return this.isSameDate(date, new Date());
    }

    // Check if date is before today (overdue)
    static isOverdue(date) {
        if (!date) return false;
        const dateStr = this.toLocalDateString(date);
        const todayStr = this.getTodayString();
        return dateStr < todayStr;
    }

    // Format date for display in Thai format
    static formatThaiDate(date) {
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date + 'T00:00:00');
        return d.toLocaleDateString('th-TH');
    }
}

class APIManager {
    constructor() {
        this.baseURL = 'https://to-do-list-api-app.vercel.app/api/v1';
        this.cache = new Map();
        this.cacheDuration = 30000; // 30 seconds
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.token = localStorage.getItem('token');
        this.maxRetries = 2;
        this.retryDelay = 1000;
    }

    // Get token
    getToken() {
        return localStorage.getItem('token');
    }

    // Cache management
    getCacheKey(endpoint, options) {
        return `${endpoint}:${JSON.stringify(options || {})}`;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    getCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        const isExpired = Date.now() - cached.timestamp > this.cacheDuration;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    clearCache() {
        this.cache.clear();
    }

    // Queue management for API calls
    async processQueue() {
        if (this.isProcessingQueue) return;
        this.isProcessingQueue = true;

        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            try {
                await this.delay(100); // Small delay between requests
                const result = await this.executeRequest(request);
                request.resolve(result);
            } catch (error) {
                request.reject(error);
            }
        }

        this.isProcessingQueue = false;
    }

    // Add request to queue
    queueRequest(endpoint, options) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                endpoint,
                options,
                resolve,
                reject
            });
            this.processQueue();
        });
    }

    // Execute single API request
    async executeRequest({ endpoint, options }) {
        const controller = new AbortController();
        const timeout = options?.timeout || 8000;
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const config = {
                method: options?.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.getToken() && { 'Authorization': `Bearer ${this.getToken()}` }),
                    ...(options?.headers || {})
                },
                signal: controller.signal,
                ...(options?.body && { body: options.body })
            };

            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/index.html';
                    return null;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    // Main API call method with caching and retry
    async apiCall(endpoint, options = {}) {
        const cacheKey = this.getCacheKey(endpoint, options);
        
        // Check cache first (only for GET requests)
        if ((!options.method || options.method === 'GET') && !options.noCache) {
            const cached = this.getCache(cacheKey);
            if (cached) {
                console.log(`Cache hit for ${endpoint}`);
                return cached;
            }
        }

        // Add to queue for processing
        let retries = this.maxRetries;
        while (retries >= 0) {
            try {
                const result = await this.queueRequest(endpoint, options);
                
                // Cache successful GET requests
                if ((!options.method || options.method === 'GET') && !options.noCache) {
                    this.setCache(cacheKey, result);
                }
                
                return result;
            } catch (error) {
                retries--;
                if (retries < 0) {
                    console.error(`API call failed after ${this.maxRetries} retries:`, error.message);
                    throw error;
                }
                
                console.warn(`API call failed, retrying... (${retries} retries left)`);
                await this.delay(this.retryDelay);
            }
        }
    }

    // Utility delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Batch API calls
    async batchCall(requests) {
        const promises = requests.map(({ endpoint, options }) => 
            this.apiCall(endpoint, options).catch(error => ({ error }))
        );
        return await Promise.all(promises);
    }

    // Test connection
    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(3000)
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Shared data manager
class DataManager {
    constructor(apiManager) {
        this.api = apiManager;
        this.userData = null;
        this.tasksData = null;
        this.analyticsData = null;
        this.lastUserLoad = 0;
        this.lastTasksLoad = 0;
        this.loadPromises = new Map();
    }

    // Load user info with caching
    async loadUserInfo(forceRefresh = false) {
        if (!forceRefresh && this.userData && (Date.now() - this.lastUserLoad < 30000)) {
            return this.userData;
        }

        // Prevent duplicate calls
        if (this.loadPromises.has('userInfo')) {
            return this.loadPromises.get('userInfo');
        }

        const promise = this.api.apiCall('/user/info')
            .then(data => {
                this.userData = data;
                this.lastUserLoad = Date.now();
                this.loadPromises.delete('userInfo');
                return data;
            })
            .catch(error => {
                this.loadPromises.delete('userInfo');
                throw error;
            });

        this.loadPromises.set('userInfo', promise);
        return promise;
    }

    // Load tasks with caching
    async loadTasks(forceRefresh = false) {
        if (!forceRefresh && this.tasksData && (Date.now() - this.lastTasksLoad < 30000)) {
            return this.tasksData;
        }

        // Prevent duplicate calls
        if (this.loadPromises.has('tasks')) {
            return this.loadPromises.get('tasks');
        }

        const promise = this.api.apiCall('/tasks')
            .then(data => {
                this.tasksData = data.tasks || data || [];
                this.lastTasksLoad = Date.now();
                this.loadPromises.delete('tasks');
                return this.tasksData;
            })
            .catch(error => {
                this.loadPromises.delete('tasks');
                throw error;
            });

        this.loadPromises.set('tasks', promise);
        return promise;
    }

    // Load analytics data
    async loadAnalytics() {
        if (this.loadPromises.has('analytics')) {
            return this.loadPromises.get('analytics');
        }

        const promise = this.api.batchCall([
            { endpoint: '/analytics/overview' },
            { endpoint: '/analytics/tasks' },
            { endpoint: '/analytics/habits' }
        ]).then(results => {
            this.analyticsData = {
                overview: results[0].error ? null : results[0],
                tasks: results[1].error ? null : results[1],
                habits: results[2].error ? null : results[2]
            };
            this.loadPromises.delete('analytics');
            return this.analyticsData;
        }).catch(error => {
            this.loadPromises.delete('analytics');
            throw error;
        });

        this.loadPromises.set('analytics', promise);
        return promise;
    }

    // Clear all cached data
    clearCache() {
        this.userData = null;
        this.tasksData = null;
        this.analyticsData = null;
        this.lastUserLoad = 0;
        this.lastTasksLoad = 0;
        this.loadPromises.clear();
        this.api.clearCache();
    }
}

// Global instances
window.apiManager = new APIManager();
window.dataManager = new DataManager(window.apiManager);
window.dateUtils = DateUtils;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIManager, DataManager, DateUtils };
}
