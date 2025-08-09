// Demo Data Generator for ToDo List App
// ใช้สำหรับสร้างข้อมูลตัวอย่างเพื่อการทดสอบ

window.demoDataGenerator = {
    // Generate sample user data
    generateUserData() {
        return {
            user: {
                username: 'komkem',
                email: 'komkem.contact@gmail.com',
                display_name: 'komkem',
                location: 'ขอนแก่น',
                bio: 'komkem khamket - Developer & Designer',
                created_at: '2024-01-15T10:00:00.000Z'
            }
        };
    },

    // Generate sample activity logs
    generateActivityLogs() {
        const activities = [
            {
                id: 1,
                description: 'เสร็จสิ้นงาน "ทำรายงานประจำเดือน"',
                action: 'task_completed',
                task_title: 'ทำรายงานประจำเดือน',
                created_at: '2024-08-10T16:30:00.000Z'
            },
            {
                id: 2,
                description: 'เสร็จสิ้นงาน "ประชุมทีมพัฒนา"',
                action: 'task_completed',
                task_title: 'ประชุมทีมพัฒนา',
                created_at: '2024-08-12T14:00:00.000Z'
            },
            {
                id: 3,
                description: 'เสร็จสิ้นงาน "ตรวจสอบอีเมล"',
                action: 'task_completed',
                task_title: 'ตรวจสอบอีเมล',
                created_at: '2024-08-10T09:15:00.000Z'
            },
            {
                id: 4,
                description: 'สร้างงานใหม่ "วางแผนโปรเจกต์ใหม่"',
                action: 'task_created',
                task_title: 'วางแผนโปรเจกต์ใหม่',
                created_at: '2024-08-13T10:30:00.000Z'
            },
            {
                id: 5,
                description: 'เริ่มงาน "ออกแบบ UI/UX"',
                action: 'task_started',
                task_title: 'ออกแบบ UI/UX',
                created_at: '2024-08-14T08:45:00.000Z'
            },
            {
                id: 6,
                description: 'อัปเดตงาน "เขียน API Documentation"',
                action: 'task_updated',
                task_title: 'เขียน API Documentation',
                created_at: '2024-08-15T13:20:00.000Z'
            },
            {
                id: 7,
                description: 'เสร็จสิ้นงาน "ทดสอบระบบ"',
                action: 'task_completed',
                task_title: 'ทดสอบระบบ',
                created_at: '2024-08-09T17:45:00.000Z'
            },
            {
                id: 8,
                description: 'สร้างงานใหม่ "ปรับปรุงฐานข้อมูล"',
                action: 'task_created',
                task_title: 'ปรับปรุงฐานข้อมูล',
                created_at: '2024-08-11T11:15:00.000Z'
            },
            {
                id: 9,
                description: 'อัปเดตโปรไฟล์ผู้ใช้',
                action: 'profile_updated',
                created_at: '2024-08-16T10:00:00.000Z'
            },
            {
                id: 10,
                description: 'เข้าสู่ระบบ',
                action: 'user_login',
                created_at: '2024-08-16T08:30:00.000Z'
            }
        ];

        // Sort by created_at descending (newest first)
        return activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    // Generate sample tasks
    generateSampleTasks() {
        const tasks = [
            {
                id: 1,
                title: 'ทำรายงานประจำเดือน',
                description: 'จัดทำรายงานสรุปผลงานประจำเดือนสิงหาคม 2568',
                status: 'completed',
                priority: 3,
                category: 'งานประจำ',
                due_date: '2024-08-15',
                created_at: '2024-08-01T09:00:00.000Z',
                completed_at: '2024-08-10T16:30:00.000Z'
            },
            {
                id: 2,
                title: 'ประชุมทีมพัฒนา',
                description: 'ประชุมวางแผนงานสำหรับไตรมาสถัดไป',
                status: 'completed',
                priority: 2,
                category: 'ประชุม',
                due_date: '2024-08-12',
                created_at: '2024-08-05T10:00:00.000Z',
                completed_at: '2024-08-12T14:00:00.000Z'
            },
            {
                id: 3,
                title: 'ตรวจสอบอีเมล',
                description: 'ตอบกลับอีเมลสำคัญและจัดระเบียบกล่องขาเข้า',
                status: 'completed',
                priority: 1,
                category: 'ประจำวัน',
                due_date: '2024-08-10',
                created_at: '2024-08-10T08:00:00.000Z',
                completed_at: '2024-08-10T09:30:00.000Z'
            },
            {
                id: 4,
                title: 'อัปเดตเว็บไซต์',
                description: 'เพิ่มฟีเจอร์ใหม่และแก้ไข bugs ที่พบ',
                status: 'completed',
                priority: 3,
                category: 'พัฒนา',
                due_date: '2024-08-20',
                created_at: '2024-08-08T11:00:00.000Z',
                completed_at: '2024-08-18T17:00:00.000Z'
            },
            {
                id: 5,
                title: 'เรียนคอร์ส JavaScript',
                description: 'ทำคอร์สออนไลน์เรื่อง Advanced JavaScript',
                status: 'completed',
                priority: 2,
                category: 'การเรียนรู้',
                due_date: '2024-08-25',
                created_at: '2024-08-01T19:00:00.000Z',
                completed_at: '2024-08-22T20:30:00.000Z'
            },
            {
                id: 6,
                title: 'ออกแบบ UI/UX',
                description: 'ออกแบบหน้าจอใหม่สำหรับแอปพลิเคชัน',
                status: 'completed',
                priority: 3,
                category: 'ออกแบบ',
                due_date: '2024-08-30',
                created_at: '2024-08-15T13:00:00.000Z',
                completed_at: '2024-08-28T16:45:00.000Z'
            },
            {
                id: 7,
                title: 'เตรียมงานนำเสนอ',
                description: 'เตรียมสไลด์และเนื้อหาสำหรับงานนำเสนอโครงการ',
                status: 'pending',
                priority: 3,
                category: 'งานนำเสนอ',
                due_date: '2024-08-28',
                created_at: '2024-08-20T10:00:00.000Z'
            },
            {
                id: 8,
                title: 'ซื้อของใช้ในบ้าน',
                description: 'ไปซื้อของใช้จำเป็นในบ้านที่หมดแล้ว',
                status: 'pending',
                priority: 1,
                category: 'ส่วนตัว',
                due_date: '2024-08-25',
                created_at: '2024-08-22T18:00:00.000Z'
            },
            {
                id: 9,
                title: 'ทำ backup ข้อมูล',
                description: 'สำรองข้อมูลสำคัญลงในคลาวด์',
                status: 'pending',
                priority: 2,
                category: 'เทคนิค',
                due_date: '2024-08-26',
                created_at: '2024-08-23T09:00:00.000Z'
            },
            {
                id: 10,
                title: 'วางแผนการเดินทาง',
                description: 'วางแผนและจองที่พักสำหรับการเดินทางเดือนหน้า',
                status: 'in-progress',
                priority: 2,
                category: 'ส่วนตัว',
                due_date: '2024-09-01',
                created_at: '2024-08-20T15:00:00.000Z'
            },
            {
                id: 11,
                title: 'ทบทวนงบประมาณ',
                description: 'ตรวจสอบและปรับแผนงบประมาณประจำเดือน',
                status: 'pending',
                priority: 2,
                category: 'การเงิน',
                due_date: '2024-08-31',
                created_at: '2024-08-24T12:00:00.000Z'
            },
            {
                id: 12,
                title: 'อ่านหนังสือ',
                description: 'อ่านหนังสือเรื่อง "Clean Code" ให้จบ',
                status: 'in-progress',
                priority: 1,
                category: 'การเรียนรู้',
                due_date: '2024-09-15',
                created_at: '2024-08-10T20:00:00.000Z'
            },
            {
                id: 13,
                title: 'ออกกำลังกาย',
                description: 'ไปยิมอย่างน้อยสัปดาห์ละ 3 ครั้ง',
                status: 'in-progress',
                priority: 2,
                category: 'สุขภาพ',
                due_date: '2024-08-31',
                created_at: '2024-08-01T06:00:00.000Z'
            },
            {
                id: 14,
                title: 'จัดระเบียบโต๊ะทำงาน',
                description: 'ทำความสะอาดและจัดระเบียบพื้นที่ทำงาน',
                status: 'pending',
                priority: 1,
                category: 'ส่วนตัว',
                due_date: '2024-08-27',
                created_at: '2024-08-25T17:00:00.000Z'
            },
            {
                id: 15,
                title: 'เขียนบล็อก',
                description: 'เขียนบทความใหม่เกี่ยวกับ Responsive Design',
                status: 'pending',
                priority: 2,
                category: 'เขียน',
                due_date: '2024-09-05',
                created_at: '2024-08-25T14:00:00.000Z'
            }
        ];

        // Save to localStorage for persistence
        localStorage.setItem('demo_tasks', JSON.stringify(tasks));
        return tasks;
    },

    // Generate categories
    generateCategories() {
        return [
            'งานประจำ',
            'ประชุม', 
            'ประจำวัน',
            'พัฒนา',
            'การเรียนรู้',
            'ออกแบบ',
            'งานนำเสนอ',
            'ส่วนตัว',
            'เทคนิค',
            'การเงิน',
            'สุขภาพ',
            'เขียน'
        ];
    },

    // Initialize demo data
    initializeDemoData() {
        // Only initialize if no data exists
        if (!localStorage.getItem('demo_initialized')) {
            const userData = this.generateUserData();
            const tasks = this.generateSampleTasks();
            const categories = this.generateCategories();

            // Save user data
            localStorage.setItem('demo_user', JSON.stringify(userData));
            localStorage.setItem('username', userData.user.username);
            localStorage.setItem('userCreatedAt', userData.user.created_at);

            // Save tasks and categories
            localStorage.setItem('demo_tasks', JSON.stringify(tasks));
            localStorage.setItem('demo_categories', JSON.stringify(categories));

            // Mark as initialized
            localStorage.setItem('demo_initialized', 'true');
            
            console.log('Demo data initialized:', {
                user: userData,
                tasksCount: tasks.length,
                categoriesCount: categories.length
            });
        }
    },

    // Get demo tasks
    getDemoTasks() {
        const stored = localStorage.getItem('demo_tasks');
        return stored ? JSON.parse(stored) : this.generateSampleTasks();
    },

    // Get demo user
    getDemoUser() {
        const stored = localStorage.getItem('demo_user');
        return stored ? JSON.parse(stored) : this.generateUserData();
    },

    // Calculate real stats from tasks
    calculateStats(tasks = null) {
        if (!tasks) {
            tasks = this.getDemoTasks();
        }

        return {
            total_tasks: tasks.length,
            completed_tasks: tasks.filter(task => task.status === 'completed').length,
            pending_tasks: tasks.filter(task => task.status === 'pending').length,
            in_progress_tasks: tasks.filter(task => task.status === 'in-progress').length
        };
    },

    // Reset demo data
    resetDemoData() {
        localStorage.removeItem('demo_initialized');
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_tasks');
        localStorage.removeItem('demo_categories');
        this.initializeDemoData();
    }
};

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', function() {
    window.demoDataGenerator.initializeDemoData();
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.demoDataGenerator.initializeDemoData();
    });
} else {
    window.demoDataGenerator.initializeDemoData();
}
