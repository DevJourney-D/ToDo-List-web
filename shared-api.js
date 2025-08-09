// Shared API utilities to reduce code duplication and improve performance

// Date utility functions for consistent timezone handling
class DateUtils {
    // Convert date to local date string (YYYY-MM-DD) without timezone issues
    static toLocalDateString(date) {
        if (!date) return null;
        let d;
        if (date instanceof Date) {
            d = date;
        } else if (typeof date === 'string') {
            // Handle different date string formats
            if (date.includes('T') || date.includes('Z')) {
                // ISO format with time (e.g., "2025-08-09T05:00:00Z" or "2025-08-09T05:00:00")
                d = new Date(date);
            } else {
                // Date only format (e.g., "2025-08-09")
                d = new Date(date + 'T00:00:00');
            }
        } else {
            d = new Date(date);
        }
        
        // Check if date is valid
        if (isNaN(d.getTime())) return null;
        
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

    // Format date for display in Thai format (DD/MM/YYYY)
    static formatThaiDate(date) {
        if (!date) return '';
        let d;
        if (date instanceof Date) {
            d = date;
        } else if (typeof date === 'string') {
            // Handle different date string formats
            if (date.includes('T') || date.includes('Z')) {
                // ISO format with time (e.g., "2025-08-09T05:00:00Z" or "2025-08-09T05:00:00")
                d = new Date(date);
            } else {
                // Date only format (e.g., "2025-08-09")
                d = new Date(date + 'T00:00:00');
            }
        } else {
            d = new Date(date);
        }
        
        // Check if date is valid
        if (isNaN(d.getTime())) return '';
        
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Format date for display with Thai month names
    static formatThaiDateWithMonthName(date) {
        if (!date) return '';
        let d;
        if (date instanceof Date) {
            d = date;
        } else if (typeof date === 'string') {
            // Handle different date string formats
            if (date.includes('T') || date.includes('Z')) {
                // ISO format with time (e.g., "2025-08-09T05:00:00Z" or "2025-08-09T05:00:00")
                d = new Date(date);
            } else {
                // Date only format (e.g., "2025-08-09")
                d = new Date(date + 'T00:00:00');
            }
        } else {
            d = new Date(date);
        }
        
        // Check if date is valid
        if (isNaN(d.getTime())) return '';
        
        const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                       'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
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

    // Load tasks with caching and pagination support
    async loadTasks(forceRefresh = false, page = 1, pageSize = 100) {
        const cacheKey = `tasks_${page}_${pageSize}`;
        
        if (!forceRefresh && this.tasksData && (Date.now() - this.lastTasksLoad < 30000) && page === 1 && pageSize === 100) {
            return this.tasksData;
        }

        // Prevent duplicate calls
        if (this.loadPromises.has(cacheKey)) {
            return this.loadPromises.get(cacheKey);
        }

        const promise = this.api.apiCall(`/tasks?page=${page}&pageSize=${pageSize}`)
            .then(data => {
                const result = data.tasks || data || [];
                // Only cache the first page with default page size for backward compatibility
                if (page === 1 && pageSize === 100) {
                    this.tasksData = result;
                    this.lastTasksLoad = Date.now();
                }
                this.loadPromises.delete(cacheKey);
                return result;
            })
            .catch(error => {
                this.loadPromises.delete(cacheKey);
                throw error;
            });

        this.loadPromises.set(cacheKey, promise);
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

// Beautiful Toast Notification System
class ToastNotification {
    constructor() {
        this.toastContainer = this.createToastContainer();
    }

    createToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-4 right-4 z-[9998] flex flex-col gap-2 max-w-sm';
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `
            transform translate-x-full opacity-0 transition-all duration-300 ease-out
            bg-white rounded-lg shadow-lg border-l-4 p-4 flex items-center space-x-3
            hover:shadow-xl cursor-pointer
        `;

        let iconHTML = '';
        let borderColor = '';
        let iconBg = '';

        switch (type) {
            case 'success':
                iconHTML = '<svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
                borderColor = 'border-l-green-500';
                iconBg = 'bg-green-100';
                break;
            case 'error':
                iconHTML = '<svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';
                borderColor = 'border-l-red-500';
                iconBg = 'bg-red-100';
                break;
            case 'warning':
                iconHTML = '<svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>';
                borderColor = 'border-l-yellow-500';
                iconBg = 'bg-yellow-100';
                break;
            case 'info':
            default:
                iconHTML = '<svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>';
                borderColor = 'border-l-blue-500';
                iconBg = 'bg-blue-100';
                break;
        }

        toast.className += ` ${borderColor}`;
        
        toast.innerHTML = `
            <div class="flex-shrink-0 ${iconBg} rounded-full p-2">
                ${iconHTML}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">${message}</p>
            </div>
            <button class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors" onclick="this.parentElement.remove()">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        `;

        this.toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        }, 10);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(toast);
            }, duration);
        }

        // Click to dismiss
        toast.addEventListener('click', () => {
            this.removeToast(toast);
        });

        return toast;
    }

    removeToast(toast) {
        if (toast && toast.parentElement) {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 300);
        }
    }

    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 6000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }
}

// Beautiful Confirmation Dialog System
class ConfirmationDialog {
    constructor() {
        this.createDialogHTML();
    }

    createDialogHTML() {
        // Remove existing dialog if any
        const existing = document.getElementById('confirmation-dialog');
        if (existing) existing.remove();

        // Create dialog HTML
        const dialogHTML = `
            <div id="confirmation-dialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style="display: none;">
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-95 opacity-0" id="confirmation-dialog-content">
                    <div class="p-6">
                        <!-- Icon -->
                        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" id="confirmation-icon">
                            <!-- Icon will be inserted here -->
                        </div>
                        
                        <!-- Title -->
                        <h3 class="text-xl font-bold text-gray-900 text-center mb-2" id="confirmation-title">
                            ยืนยันการดำเนินการ
                        </h3>
                        
                        <!-- Message -->
                        <p class="text-gray-600 text-center mb-6" id="confirmation-message">
                            คุณแน่ใจหรือไม่ที่จะดำเนินการนี้?
                        </p>
                        
                        <!-- Actions -->
                        <div class="flex space-x-3" id="confirmation-actions">
                            <button type="button" id="confirmation-cancel" 
                                    class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                                ยกเลิก
                            </button>
                            <button type="button" id="confirmation-confirm" 
                                    class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                                ยืนยัน
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);
    }

    show(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'ยืนยันการดำเนินการ',
                message = 'คุณแน่ใจหรือไม่ที่จะดำเนินการนี้?',
                confirmText = 'ยืนยัน',
                cancelText = 'ยกเลิก',
                type = 'warning', // warning, danger, info, success
                showCancel = true
            } = options;

            const dialog = document.getElementById('confirmation-dialog');
            const content = document.getElementById('confirmation-dialog-content');
            const icon = document.getElementById('confirmation-icon');
            const titleEl = document.getElementById('confirmation-title');
            const messageEl = document.getElementById('confirmation-message');
            const confirmBtn = document.getElementById('confirmation-confirm');
            const cancelBtn = document.getElementById('confirmation-cancel');

            // Set content
            titleEl.textContent = title;
            messageEl.textContent = message;
            confirmBtn.textContent = confirmText;
            cancelBtn.textContent = cancelText;

            // Set icon and colors based on type
            let iconHTML = '';
            let confirmBtnClass = '';
            let iconBgClass = '';

            switch (type) {
                case 'danger':
                    iconHTML = '<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.729-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>';
                    confirmBtnClass = 'bg-red-600 hover:bg-red-700';
                    iconBgClass = 'bg-red-100';
                    break;
                case 'warning':
                    iconHTML = '<svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.729-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>';
                    confirmBtnClass = 'bg-orange-600 hover:bg-orange-700';
                    iconBgClass = 'bg-orange-100';
                    break;
                case 'info':
                    iconHTML = '<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                    confirmBtnClass = 'bg-blue-600 hover:bg-blue-700';
                    iconBgClass = 'bg-blue-100';
                    break;
                case 'success':
                    iconHTML = '<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                    confirmBtnClass = 'bg-green-600 hover:bg-green-700';
                    iconBgClass = 'bg-green-100';
                    break;
            }

            icon.innerHTML = iconHTML;
            icon.className = `flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${iconBgClass}`;
            confirmBtn.className = `flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium ${confirmBtnClass}`;

            // Handle cancel button visibility
            if (!showCancel) {
                cancelBtn.style.display = 'none';
                confirmBtn.className = confirmBtn.className.replace('flex-1', 'w-full');
            } else {
                cancelBtn.style.display = 'block';
                confirmBtn.className = confirmBtn.className.replace('w-full', 'flex-1');
            }

            // Show dialog with animation
            dialog.style.display = 'flex';
            setTimeout(() => {
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }, 10);

            // Handle clicks
            const handleConfirm = () => {
                this.hide();
                resolve(true);
            };

            const handleCancel = () => {
                this.hide();
                resolve(false);
            };

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    handleCancel();
                }
            };

            // Add event listeners
            confirmBtn.onclick = handleConfirm;
            cancelBtn.onclick = handleCancel;
            document.addEventListener('keydown', handleEscape);

            // Click outside to cancel
            dialog.onclick = (e) => {
                if (e.target === dialog) {
                    handleCancel();
                }
            };

            // Clean up function
            const cleanup = () => {
                document.removeEventListener('keydown', handleEscape);
                confirmBtn.onclick = null;
                cancelBtn.onclick = null;
                dialog.onclick = null;
            };

            // Store cleanup for later use
            this.cleanup = cleanup;
        });
    }

    hide() {
        const dialog = document.getElementById('confirmation-dialog');
        const content = document.getElementById('confirmation-dialog-content');
        
        if (dialog && content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
            
            setTimeout(() => {
                dialog.style.display = 'none';
                if (this.cleanup) {
                    this.cleanup();
                    this.cleanup = null;
                }
            }, 300);
        }
    }

    // Shorthand methods for common dialog types
    static confirm(message, title = 'ยืนยันการดำเนินการ') {
        const dialog = new ConfirmationDialog();
        return dialog.show({
            title,
            message,
            type: 'warning'
        });
    }

    static danger(message, title = 'คำเตือน!') {
        const dialog = new ConfirmationDialog();
        return dialog.show({
            title,
            message,
            type: 'danger',
            confirmText: 'ลบ',
            cancelText: 'ยกเลิก'
        });
    }

    static info(message, title = 'ข้อมูล') {
        const dialog = new ConfirmationDialog();
        return dialog.show({
            title,
            message,
            type: 'info',
            confirmText: 'ตกลง',
            showCancel: false
        });
    }

    static success(message, title = 'สำเร็จ!') {
        const dialog = new ConfirmationDialog();
        return dialog.show({
            title,
            message,
            type: 'success',
            confirmText: 'ตกลง',
            showCancel: false
        });
    }
}

// Global instances
window.apiManager = new APIManager();
window.dataManager = new DataManager(window.apiManager);
window.dateUtils = DateUtils;
window.confirmDialog = ConfirmationDialog;
window.toastNotification = new ToastNotification();

// Legacy showToast function for backward compatibility
window.showToast = function(message, type = 'info', duration) {
    return window.toastNotification.show(message, type, duration);
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIManager, DataManager, DateUtils, ConfirmationDialog, ToastNotification };
}
