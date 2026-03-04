# NEXUS Digital Agency Website

## Project Structure
```
nexus-agency/
├── index.html              # Main website (all sections)
├── css/
│   ├── style.css           # Main styles
│   └── animations.css      # Animation styles
├── js/
│   ├── main.js             # Core JS (nav, forms, slider, etc.)
│   ├── ai-chat.js          # AI chat powered by Claude API
│   └── animations.js       # Advanced animations & effects
├── php/
│   ├── contact.php         # Contact form handler → MySQL
│   ├── ai-proxy.php        # Server-side Claude API proxy
│   └── db.php              # Database connection
└── database/
    └── schema.sql          # Full MySQL database schema
```

## Setup Instructions

### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

### 2. Configure Database Credentials
Edit `php/contact.php` and `php/db.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'nexus_agency');
```

### 3. Configure AI (Claude API)
Edit `php/ai-proxy.php`:
```php
define('ANTHROPIC_API_KEY', 'sk-ant-your-key-here');
```
Get your API key at: https://console.anthropic.com

### 4. Configure Email
Edit `php/contact.php`:
```php
define('NOTIFY_EMAIL', 'your@email.com');
define('FROM_EMAIL', 'noreply@yourdomain.com');
```

### 5. Deploy
- Upload all files to your web server (Apache/Nginx)
- Ensure PHP 8.0+ is installed
- Point domain to the folder containing index.html
- Enable HTTPS (required for secure forms)

## Database Tables
| Table | Purpose |
|-------|---------|
| users | Staff/admin accounts |
| leads | Contact form submissions |
| clients | Active clients |
| services | Service catalog |
| client_services | Active subscriptions |
| projects | Project tracking |
| tasks | Task management |
| campaigns | Marketing campaigns |
| campaign_metrics | Daily performance data |
| invoices | Billing |
| invoice_items | Line items |
| ai_conversations | AI chat logs |
| newsletter_subscribers | Email list |
| testimonials | Reviews |
| activity_log | Audit trail |
| settings | App configuration |

## Features
- ✅ Stunning animated hero with parallax orbs
- ✅ Custom animated cursor
- ✅ Smooth loading animation
- ✅ All 7 services showcased
- ✅ Portfolio with filter by category
- ✅ Pricing toggle (monthly/annual)
- ✅ Testimonials auto-slider
- ✅ AI chatbot powered by Claude API
- ✅ Contact form → MySQL database
- ✅ Email notifications (lead alert + auto-reply)
- ✅ Scroll progress bar
- ✅ Back to top button
- ✅ Fully responsive (mobile-first)
- ✅ Scroll reveal animations
- ✅ Tilt card effects
- ✅ Magnetic buttons
- ✅ Marquee ticker

## Security
- All form inputs sanitized and validated
- Rate limiting on contact form (5/hour per IP)
- Rate limiting on AI proxy (20/minute per IP)
- PDO prepared statements (SQL injection prevention)
- CORS headers configured
- XSS protection via htmlspecialchars
