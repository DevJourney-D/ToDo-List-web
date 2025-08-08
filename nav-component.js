// Navigation Component for ToDo List App
// ส่วนประกอบของ Navigation ที่เหมือนกันทุกหน้า

// Navigation styles that should be included in every HTML file
const NAV_STYLES = `
    /* Navigation Styles - Shared across all pages */
    .nav-container {
        background: white;
        border-bottom: 1px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 100;
    }
    
    .nav-brand {
        font-size: 1.5rem;
        font-weight: bold;
        color: #1f2937;
        text-decoration: none;
        background: linear-gradient(135deg, #1565c0 0%, #2196f3 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .nav-menu {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .nav-link {
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 500;
        font-size: 0.875rem;
        transition: all 0.2s ease;
        text-decoration: none;
        color: #374151;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .nav-link:hover {
        background: #f3f4f6;
        color: #1f2937;
    }
    
    .nav-link.active {
        background: #3b82f6;
        color: white;
    }
    
    .nav-link.btn-primary {
        background: #3b82f6;
        color: white;
        border: none;
    }
    
    .nav-link.btn-primary:hover {
        background: #2563eb;
        color: white;
    }
    
    .nav-link.btn-secondary {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
    }
    
    .nav-link.btn-secondary:hover {
        background: #e5e7eb;
        color: #1f2937;
    }
    
    .nav-link.btn-danger {
        background: #ef4444;
        color: white;
    }
    
    .nav-link.btn-danger:hover {
        background: #dc2626;
        color: white;
    }
    
    .user-greeting {
        color: #6b7280;
        font-weight: 500;
        font-size: 0.875rem;
    }
    
    /* Mobile responsive */
    @media (max-width: 1024px) {
        .nav-container .container {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
        }
        
        .nav-menu {
            justify-content: center;
        }
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            gap: 0.25rem;
        }
        
        .nav-link {
            padding: 6px 12px;
            font-size: 0.75rem;
        }
        
        .nav-brand {
            font-size: 1.25rem;
        }
    }
    
    @media (max-width: 480px) {
        .nav-container .container {
            padding: 0.75rem;
        }
        
        .nav-menu {
            flex-wrap: wrap;
            gap: 0.25rem;
        }
        
        .nav-link {
            padding: 4px 8px;
            font-size: 0.7rem;
        }
        
        .nav-brand {
            font-size: 1rem;
        }
    }
`;

// Navigation HTML structure generator
function generateNavigation(currentPage = '', isLoggedIn = false, username = '') {
    const publicPages = [
        { href: 'index.html', label: '🔑 เข้าสู่ระบบ', id: 'index' }
    ];
    
    const authPages = [
        { href: 'dashboard.html', label: '📊 Dashboard', id: 'dashboard' },
        { href: 'tasks.html', label: '📋 Tasks', id: 'tasks' },
        { href: 'calendar.html', label: '📅 Calendar', id: 'calendar' },
        { href: 'analytics.html', label: '📊 Analytics', id: 'analytics' },
        { href: 'profile.html', label: '👤 Profile', id: 'profile' },
        { href: 'settings.html', label: '⚙️ Settings', id: 'settings' }
    ];
    
    const menuItems = isLoggedIn ? authPages : publicPages;
    
    // Handle special cases for page detection
    let pageId = currentPage;
    if (currentPage === 'dashboard_optimized') {
        pageId = 'dashboard';
    }
    
    const menuHtml = menuItems.map(item => {
        const isActive = item.id === pageId ? 'active' : '';
        return `<a href="${item.href}" class="nav-link ${isActive}">${item.label}</a>`;
    }).join('');
    
    const rightSideHtml = isLoggedIn ? 
        `<span class="user-greeting">สวัสดี, ${username || 'User'}</span>
         <button onclick="logout()" class="nav-link btn-danger">📤 ออกจากระบบ</button>` :
        `<a href="register.html" class="nav-link btn-secondary">✨ สมัครสมาชิก</a>`;
    
    return `
        <nav class="nav-container">
            <div class="container mx-auto flex justify-between items-center px-4 py-3">
                <div class="flex items-center space-x-8">
                    <a href="${isLoggedIn ? 'dashboard.html' : 'index.html'}" class="nav-brand">
                        🍅 ToDo List
                    </a>
                    <div class="nav-menu">
                        ${menuHtml}
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    ${rightSideHtml}
                </div>
            </div>
        </nav>
    `;
}

// Function to inject navigation into page
function initNavigation(currentPage = '', isLoggedIn = false, username = '') {
    // Add styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = NAV_STYLES;
    document.head.appendChild(styleElement);
    
    // Find existing nav element or create container
    let navContainer = document.querySelector('nav');
    if (!navContainer) {
        navContainer = document.createElement('div');
        navContainer.id = 'nav-container';
        document.body.insertBefore(navContainer, document.body.firstChild);
    }
    
    // Replace navigation content
    navContainer.outerHTML = generateNavigation(currentPage, isLoggedIn, username);
}

// Auto-detect current page and login status
function autoInitNavigation() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop().replace('.html', '') || 'index';
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    
    // Get username from localStorage or set default
    let username = localStorage.getItem('username') || 'User';
    
    // Check if user needs to be redirected
    const publicPages = ['index', 'register'];
    const isPublicPage = publicPages.includes(filename);
    
    // Redirect logic
    if (isLoggedIn && isPublicPage) {
        // User is logged in but on login/register page - redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }
    
    if (!isLoggedIn && !isPublicPage) {
        // User is not logged in but on protected page - redirect to login
        window.location.href = 'index.html';
        return;
    }
    
    initNavigation(filename, isLoggedIn, username);
    
    // Load username from API if logged in
    if (isLoggedIn) {
        loadUserInfo();
    }
}

// Load user info from API
async function loadUserInfo() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('https://to-do-list-api-app.vercel.app/api/v1/user/info', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.user && data.user.username) {
                localStorage.setItem('username', data.user.username);
                // Update greeting if element exists
                const greetingEl = document.querySelector('.user-greeting');
                if (greetingEl) {
                    greetingEl.textContent = `สวัสดี, ${data.user.username}`;
                }
            }
        }
    } catch (error) {
        console.warn('Failed to load user info:', error);
    }
}

// Logout function (shared across all pages)
function logout() {
    // Create custom confirmation modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <span class="text-2xl">📤</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">ออกจากระบบ</h3>
                <p class="text-gray-600 mb-6">คุณต้องการออกจากระบบหรือไม่?</p>
                <div class="flex space-x-3">
                    <button id="cancel-logout" class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                        ยกเลิก
                    </button>
                    <button id="confirm-logout" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        ออกจากระบบ
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    document.getElementById('cancel-logout').onclick = () => {
        document.body.removeChild(modal);
    };
    
    document.getElementById('confirm-logout').onclick = () => {
        document.body.removeChild(modal);
        
        // Perform logout
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        
        showToast && showToast('ออกจากระบบเรียบร้อย', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    };
    
    // Close modal when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

// Toast notification function (if not already exists)
if (typeof showToast === 'undefined') {
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const bgColor = type === 'error' ? 'bg-red-500' : 
                       type === 'success' ? 'bg-green-500' : 
                       type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
        
        toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initNavigation, autoInitNavigation, generateNavigation, logout };
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitNavigation);
} else {
    autoInitNavigation();
}
