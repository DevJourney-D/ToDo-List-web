# ToDo List Frontend

Simple HTML/JavaScript frontend สำหรับ ToDo List application

## Features

- 📱 Responsive design with Tailwind CSS
- 🔐 Authentication (Login/Register)
- 📊 User dashboard with statistics
- 🎨 Modern UI with animations
- 📱 Mobile-friendly
- 🔔 Toast notifications

## Quick Start

1. เปิดไฟล์ `index.html` ในเบราว์เซอร์ หรือ
2. ใช้ Live Server:

```bash
# ติดตั้ง live-server (ถ้ายังไม่มี)
npm install -g live-server

# รันในโฟลเดอร์ frontend
cd frontend
live-server
```

## Configuration

แก้ไข API endpoint ในไฟล์ HTML:
```javascript
const API_BASE = 'https://to-do-list-api-app.vercel.app/api/v1';
```

## Structure

```
frontend/
├── index.html      # Main application file
└── README.md       # This file
```

## Usage

1. เปิดเบราว์เซอร์ไปที่ `index.html`
2. สมัครสมาชิกหรือเข้าสู่ระบบ
3. ดู dashboard พร้อมสถิติส่วนตัว

## API Integration

Frontend เชื่อมต่อกับ Go backend API:
- Authentication with JWT tokens
- RESTful API calls
- Error handling with toast notifications
