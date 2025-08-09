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
        z-index: 50;
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

    .mobile-menu-button {
        display: none;
        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        border: 1px solid #e2e8f0;
        font-size: 1.25rem;
        color: #374151;
        cursor: pointer;
        padding: 10px;
        border-radius: 8px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;
    }

    .mobile-menu-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
        transition: left 0.5s ease;
    }

    .mobile-menu-button:hover::before {
        left: 100%;
    }

    .mobile-menu-button:hover {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        border-color: #1d4ed8;
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.25);
    }

    .mobile-menu-button:active {
        transform: translateY(0);
        box-shadow: 0 3px 10px rgba(59, 130, 246, 0.2);
    }

    .mobile-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-bottom: 1px solid #e5e7eb;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 40;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-height: 0;
        overflow: hidden;
    }

    .mobile-menu.active {
        display: block;
        opacity: 1;
        transform: translateY(0);
        max-height: 500px;
    }

    .mobile-menu-content {
        padding: 1.5rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    }

    .mobile-user-section {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #e2e8f0;
        margin-bottom: 0.75rem;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        border-radius: 12px;
        color: white;
        text-align: center;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    }

    .mobile-user-section .text-sm {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        font-size: 0.875rem;
    }

    .mobile-nav-link {
        padding: 14px 18px;
        border-radius: 12px;
        font-weight: 500;
        text-decoration: none;
        color: #374151;
        display: flex;
        align-items: center;
        gap: 0.875rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid transparent;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;
    }

    .mobile-nav-link::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
        transition: left 0.5s ease;
    }

    .mobile-nav-link:hover::before {
        left: 100%;
    }

    .mobile-nav-link:hover {
        background: linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%);
        border-color: #3b82f6;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
        color: #1d4ed8;
    }

    .mobile-nav-link.active {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        border-color: #1d4ed8;
        transform: translateY(-1px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    }

    .mobile-nav-link.active::before {
        display: none;
    }

    .mobile-nav-link.btn-danger {
        background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%);
        color: #dc2626;
        border-color: #fecaca;
        margin-top: 1rem;
    }

    .mobile-nav-link.btn-danger:hover {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        border-color: #dc2626;
        box-shadow: 0 8px 25px rgba(239, 68, 68, 0.25);
    }

    .mobile-nav-link.btn-secondary {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        color: #475569;
        border-color: #e2e8f0;
    }

    .mobile-nav-link.btn-secondary:hover {
        background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
        color: #1e293b;
        border-color: #94a3b8;
    }

    /* Desktop and Tablet responsive */
    @media (max-width: 1024px) {
        .nav-container .container {
            padding: 0.75rem 1rem;
        }
        
        .nav-menu {
            gap: 0.375rem;
        }

        .nav-link {
            padding: 6px 12px;
            font-size: 0.875rem;
        }
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
        .mobile-menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .nav-menu {
            display: none;
        }

        .nav-container .container > div:last-child {
            display: none;
        }

        .nav-container .container {
            position: relative;
            padding: 0.75rem 1rem;
        }

        .nav-brand {
            font-size: 1.25rem;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
        }

        .nav-container {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-bottom: 1px solid #e2e8f0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
    }
    
    @media (max-width: 480px) {
        .nav-container .container {
            padding: 0.75rem;
        }
        
        .nav-brand {
            font-size: 1.125rem;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .mobile-menu-content {
            padding: 0.75rem;
        }

        .mobile-nav-link {
            padding: 10px 14px;
            font-size: 0.875rem;
        }

        .mobile-menu-button {
            font-size: 1rem;
            padding: 8px;
        }

        .mobile-user-section {
            padding: 0.75rem;
            margin-bottom: 0.5rem;
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
        return `<a href="${item.href}" class="nav-link nav-responsive ${isActive}">${item.label}</a>`;
    }).join('');

    // Mobile menu HTML
    const mobileMenuHtml = menuItems.map(item => {
        const isActive = item.id === pageId ? 'active' : '';
        return `<a href="${item.href}" class="mobile-nav-link mobile-nav-item ${isActive}" onclick="closeMobileMenu()">${item.label}</a>`;
    }).join('');
    
    const rightSideHtml = isLoggedIn ? 
        `<span class="user-greeting">สวัสดี, ${username || 'User'}</span>
         <button onclick="logout()" class="nav-link btn-danger">📤 ออกจากระบบ</button>` :
        `<a href="register.html" class="nav-link btn-secondary">✨ สมัครสมาชิก</a>`;

    const mobileRightSideHtml = isLoggedIn ? 
        `<div class="mobile-user-section">
            <div class="text-sm text-gray-600 mb-2">สวัสดี, ${username || 'User'}</div>
        </div>
        ${mobileMenuHtml}
        <button onclick="logout(); closeMobileMenu();" class="mobile-nav-link btn-danger">📤 ออกจากระบบ</button>` :
        `${mobileMenuHtml}
        <a href="register.html" class="mobile-nav-link btn-secondary" onclick="closeMobileMenu()">✨ สมัครสมาชิก</a>`;
    
    return `
        <nav class="nav-container">
            <div class="container mx-auto flex justify-between items-center nav-container-responsive">
                <div class="flex items-center space-x-4 sm:space-x-8">
                    <a href="${isLoggedIn ? 'dashboard.html' : 'index.html'}" class="nav-brand nav-brand-responsive">
                        ToDo List
                    </a>
                    <div class="nav-menu">
                        ${menuHtml}
                    </div>
                </div>
                <div class="hidden md:flex items-center space-x-2 sm:space-x-4">
                    ${rightSideHtml}
                </div>
                <button class="mobile-menu-button md:hidden" onclick="toggleMobileMenu()" aria-label="Toggle menu">
                    <span id="mobile-menu-icon" style="transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);">☰</span>
                </button>
            </div>
            <div id="mobile-menu" class="mobile-menu md:hidden">
                <div class="mobile-menu-content">
                    ${mobileRightSideHtml}
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
    
    // Add mobile menu functionality
    addMobileMenuFunctionality();
}

// Mobile menu functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('mobile-menu-icon');
    
    if (mobileMenu) {
        const isActive = mobileMenu.classList.contains('active');
        if (isActive) {
            mobileMenu.classList.remove('active');
            menuIcon.textContent = '☰';
            menuIcon.style.transform = 'rotate(0deg)';
        } else {
            mobileMenu.classList.add('active');
            menuIcon.textContent = '✕';
            menuIcon.style.transform = 'rotate(180deg)';
        }
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('mobile-menu-icon');
    
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        if (menuIcon) {
            menuIcon.textContent = '☰';
            menuIcon.style.transform = 'rotate(0deg)';
        }
    }
}

function addMobileMenuFunctionality() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        
        if (mobileMenu && mobileMenuButton) {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnButton = mobileMenuButton.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnButton && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });

    // Close mobile menu on window resize to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
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
async function logout() {
    const confirmed = await window.confirmDialog.confirm(
        'คุณต้องการออกจากระบบหรือไม่? การออกจากระบบจะทำให้คุณต้องเข้าสู่ระบบใหม่',
        'ออกจากระบบ?'
    );
    
    if (!confirmed) return;
    
    // Perform logout
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    showToast && showToast('ออกจากระบบเรียบร้อย', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Toast notification function (if not already exists)
if (typeof showToast === 'undefined') {
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const bgColor = type === 'error' ? 'bg-red-500' : 
                       type === 'success' ? 'bg-green-500' : 
                       type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
        
        toast.className = `fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
        toast.style.zIndex = '9999';
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
    module.exports = { 
        initNavigation, 
        autoInitNavigation, 
        generateNavigation, 
        logout, 
        toggleMobileMenu, 
        closeMobileMenu 
    };
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitNavigation);
} else {
    autoInitNavigation();
}
