/**
 * Common Notification and Confirmation System
 * Beautiful notifications and modals for all pages
 */

// Enhanced Notification System
function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications of the same type to avoid spam
    document.querySelectorAll(`.notification.${type}`).forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-text">${message}</span>
            <button class="notification-close" onclick="removeNotification(this)">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
    
    return notification;
}

// Enhanced notification for API errors
function showApiError(error, context = '') {
    let message = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
    
    if (error.message.includes('Failed to fetch')) {
        message = '🔌 ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
    } else if (error.message.includes('401')) {
        message = '🔐 กรุณาเข้าสู่ระบบใหม่';
        setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }, 3000);
    } else if (error.message.includes('403')) {
        message = '🚫 ไม่มีสิทธิ์เข้าถึงข้อมูลนี้';
    } else if (error.message.includes('404')) {
        message = '🔍 ไม่พบข้อมูลที่ต้องการ';
    } else if (error.message.includes('500')) {
        message = '⚠️ เซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่ภายหลัง';
    }
    
    if (context) {
        message += ` (${context})`;
    }
    
    return showNotification(message, 'error', 8000);
}

// Show success notification with action
function showSuccessWithAction(message, actionText, actionCallback) {
    const notification = document.createElement('div');
    notification.className = 'notification success with-action';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-text">${message}</span>
            <button class="notification-action" onclick="removeNotification(this); (${actionCallback.toString()})()">${actionText}</button>
            <button class="notification-close" onclick="removeNotification(this)">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        removeNotification(notification);
    }, 10000);
    
    return notification;
}

// Network status monitoring
function initNetworkMonitoring() {
    let isOnline = navigator.onLine;
    
    function updateNetworkStatus() {
        if (navigator.onLine && !isOnline) {
            isOnline = true;
            showNotification('🔗 การเชื่อมต่ออินเทอร์เน็ตกลับมาแล้ว', 'success', 3000);
        } else if (!navigator.onLine && isOnline) {
            isOnline = false;
            showNotification('📶 ขาดการเชื่อมต่ออินเทอร์เน็ต ข้อมูลบางส่วนอาจไม่เป็นปัจจุบัน', 'warning', 0);
        }
    }
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initNetworkMonitoring();
});

function removeNotification(element) {
    const notification = element.closest ? element.closest('.notification') : element;
    if (notification && notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        case 'info': return 'ℹ️';
        default: return '📝';
    }
}

// Beautiful Confirmation Modal System
function showConfirmation(options = {}) {
    const {
        title = 'Confirm Action',
        message = 'Are you sure you want to proceed?',
        type = 'warning',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        onConfirm = () => {},
        onCancel = () => {}
    } = options;
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('confirm-modal');
    if (!modal) {
        createConfirmationModal();
        modal = document.getElementById('confirm-modal');
    }
    
    const icon = document.getElementById('confirm-icon');
    const titleEl = document.getElementById('confirm-title');
    const messageEl = document.getElementById('confirm-message');
    const confirmBtn = document.getElementById('confirm-ok');
    const cancelBtn = document.getElementById('confirm-cancel');
    
    // Set content
    titleEl.textContent = title;
    messageEl.textContent = message;
    confirmBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;
    
    // Set icon and style based on type
    icon.className = `confirm-icon ${type}`;
    switch (type) {
        case 'danger':
            icon.textContent = '🗑️';
            confirmBtn.className = 'btn-confirm danger';
            break;
        case 'warning':
            icon.textContent = '⚠️';
            confirmBtn.className = 'btn-confirm warning';
            break;
        case 'info':
            icon.textContent = 'ℹ️';
            confirmBtn.className = 'btn-confirm info';
            break;
        case 'logout':
            icon.textContent = '👋';
            confirmBtn.className = 'btn-confirm warning';
            break;
        default:
            icon.textContent = '❓';
            confirmBtn.className = 'btn-confirm';
    }
    
    // Set up event handlers
    const handleConfirm = () => {
        hideConfirmation();
        onConfirm();
    };
    
    const handleCancel = () => {
        hideConfirmation();
        onCancel();
    };
    
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
    };
    
    const handleBackdropClick = (e) => {
        if (e.target === modal) {
            handleCancel();
        }
    };
    
    // Remove existing listeners
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
    
    // Add new listeners
    document.getElementById('confirm-ok').addEventListener('click', handleConfirm);
    document.getElementById('confirm-cancel').addEventListener('click', handleCancel);
    document.addEventListener('keydown', handleEscape);
    modal.addEventListener('click', handleBackdropClick);
    
    // Store cleanup function
    modal._cleanup = () => {
        document.removeEventListener('keydown', handleEscape);
        modal.removeEventListener('click', handleBackdropClick);
    };
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function hideConfirmation() {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;
    
    if (modal._cleanup) {
        modal._cleanup();
        modal._cleanup = null;
    }
    
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function createConfirmationModal() {
    const modalHTML = `
        <div id="confirm-modal" class="confirm-modal" style="display: none;">
            <div class="confirm-content">
                <div class="confirm-header">
                    <div id="confirm-icon" class="confirm-icon warning">⚠️</div>
                    <h3 id="confirm-title" class="confirm-title">Confirm Action</h3>
                </div>
                <div class="confirm-body">
                    <p id="confirm-message" class="confirm-message">Are you sure you want to proceed?</p>
                </div>
                <div class="confirm-footer">
                    <button id="confirm-cancel" class="btn-cancel">Cancel</button>
                    <button id="confirm-ok" class="btn-confirm">Confirm</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Common logout function with beautiful confirmation
function confirmLogout() {
    showConfirmation({
        title: 'Logout Confirmation',
        message: 'Are you sure you want to logout? You will need to login again to access your account.',
        type: 'logout',
        confirmText: 'Logout',
        cancelText: 'Stay',
        onConfirm: () => {
            showNotification('Logging out...', 'info', 2000);
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userProfile');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            }, 1000);
        }
    });
}

// Common delete confirmation
function confirmDelete(itemName, onConfirm) {
    showConfirmation({
        title: 'Delete Confirmation',
        message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
        type: 'danger',
        confirmText: 'Delete',
        cancelText: 'Keep',
        onConfirm: onConfirm
    });
}

// Loading states
function showLoadingNotification(message = 'Processing...') {
    return showNotification(message, 'info', 0); // Duration 0 = permanent until manually removed
}

function hideLoadingNotification(notification) {
    if (notification) {
        removeNotification(notification);
    }
}

// Success operations
function showSuccessMessage(message) {
    showNotification(message, 'success', 4000);
}

function showErrorMessage(message) {
    showNotification(message, 'error', 6000);
}

function showWarningMessage(message) {
    showNotification(message, 'warning', 5000);
}

// Initialize common styles if not already added
function initializeCommonStyles() {
    if (document.getElementById('common-notification-styles')) return;
    
    const styles = `
        <style id="common-notification-styles">
            /* Enhanced Notification Styles */
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 20px;
                border-radius: 12px;
                color: white;
                font-weight: 500;
                z-index: 1100;
                animation: slideInRight 0.3s ease-out;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                min-width: 300px;
                max-width: 400px;
            }
            
            .notification.success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            }
            
            .notification.error {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            }
            
            .notification.warning {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            }
            
            .notification.info {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-icon {
                font-size: 20px;
                flex-shrink: 0;
            }
            
            .notification-text {
                flex: 1;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity 0.2s ease;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            /* Confirmation Modal Styles */
            .confirm-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1200;
                backdrop-filter: blur(4px);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .confirm-modal.show {
                opacity: 1;
            }
            
            .confirm-content {
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                max-width: 400px;
                width: 90%;
                animation: modalSlideIn 0.3s ease-out;
                overflow: hidden;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .confirm-modal.show .confirm-content {
                transform: scale(1);
            }
            
            .confirm-header {
                padding: 24px 24px 16px;
                text-align: center;
                border-bottom: 1px solid #f3f4f6;
            }
            
            .confirm-body {
                padding: 24px;
                text-align: center;
            }
            
            .confirm-footer {
                padding: 16px 24px 24px;
                display: flex;
                gap: 12px;
                justify-content: center;
            }
            
            .confirm-icon {
                width: 64px;
                height: 64px;
                margin: 0 auto 16px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
            }
            
            .confirm-icon.warning {
                background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
                color: #92400e;
            }
            
            .confirm-icon.danger {
                background: linear-gradient(135deg, #fee2e2 0%, #ef4444 100%);
                color: #dc2626;
            }
            
            .confirm-icon.info {
                background: linear-gradient(135deg, #dbeafe 0%, #3b82f6 100%);
                color: #1d4ed8;
            }
            
            .confirm-icon.logout {
                background: linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%);
                color: #92400e;
            }
            
            .confirm-title {
                font-size: 20px;
                font-weight: 700;
                color: #111827;
                margin-bottom: 8px;
            }
            
            .confirm-message {
                color: #6b7280;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .btn-confirm {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
            }
            
            .btn-confirm:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
            }
            
            .btn-confirm.warning {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
            }
            
            .btn-confirm.warning:hover {
                box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
            }
            
            .btn-confirm.info {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
            }
            
            .btn-confirm.info:hover {
                box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
            }
            
            .btn-cancel {
                background: #f9fafb;
                color: #374151;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                padding: 12px 24px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .btn-cancel:hover {
                background: #e5e7eb;
                transform: translateY(-1px);
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', initializeCommonStyles);

// Global loading state management
let globalLoadingState = {
    isLoading: false,
    loadingElement: null
};

function showGlobalLoading(message = 'กำลังโหลด...') {
    hideGlobalLoading(); // Remove any existing loading
    
    globalLoadingState.isLoading = true;
    
    const loadingElement = document.createElement('div');
    loadingElement.className = 'global-loading';
    loadingElement.innerHTML = `
        <div class="loading-backdrop">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        </div>
    `;
    
    // Add loading styles if not exists
    if (!document.getElementById('global-loading-styles')) {
        const loadingStyles = document.createElement('style');
        loadingStyles.id = 'global-loading-styles';
        loadingStyles.textContent = `
            .global-loading {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .loading-backdrop {
                background: rgba(0, 0, 0, 0.7);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .loading-content {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                min-width: 200px;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f4f6;
                border-top: 4px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem auto;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-text {
                color: #374151;
                font-weight: 500;
            }
        `;
        document.head.appendChild(loadingStyles);
    }
    
    document.body.appendChild(loadingElement);
    globalLoadingState.loadingElement = loadingElement;
    
    return loadingElement;
}

function hideGlobalLoading() {
    if (globalLoadingState.loadingElement) {
        globalLoadingState.loadingElement.remove();
        globalLoadingState.loadingElement = null;
    }
    globalLoadingState.isLoading = false;
}

function updateGlobalLoading(message) {
    if (globalLoadingState.loadingElement) {
        const textElement = globalLoadingState.loadingElement.querySelector('.loading-text');
        if (textElement) {
            textElement.textContent = message;
        }
    }
}

// Empty state helpers
function createEmptyState(config = {}) {
    const {
        icon = '📝',
        title = 'ไม่มีข้อมูล',
        description = 'ยังไม่มีข้อมูลในส่วนนี้',
        actionText = 'เพิ่มข้อมูล',
        actionCallback = null,
        className = 'empty-state'
    } = config;
    
    return `
        <div class="${className} text-center py-12">
            <div class="text-6xl mb-4">${icon}</div>
            <h3 class="text-xl font-bold text-gray-700 mb-2">${title}</h3>
            <p class="text-gray-500 mb-6">${description}</p>
            ${actionCallback ? `
                <button onclick="${actionCallback}" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                    ${actionText}
                </button>
            ` : ''}
        </div>
    `;
}

// Error state helpers  
function createErrorState(config = {}) {
    const {
        icon = '⚠️',
        title = 'เกิดข้อผิดพลาด',
        description = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        retryCallback = null,
        className = 'error-state'
    } = config;
    
    return `
        <div class="${className} text-center py-12">
            <div class="text-6xl mb-4">${icon}</div>
            <h3 class="text-xl font-bold text-gray-700 mb-2">${title}</h3>
            <p class="text-gray-500 mb-6">${description}</p>
            ${retryCallback ? `
                <button onclick="${retryCallback}" class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">
                    🔄 ลองใหม่
                </button>
            ` : ''}
        </div>
    `;
}

// Enhanced API error handler
function handleApiError(error, context = '', showGlobal = false) {
    console.error(`API Error in ${context}:`, error);
    
    if (showGlobal) {
        hideGlobalLoading();
    }
    
    return showApiError(error, context);
}
