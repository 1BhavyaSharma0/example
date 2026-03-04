-- =====================================================
-- NEXUS Digital Agency — MySQL Database Schema
-- =====================================================

CREATE DATABASE IF NOT EXISTS nexus_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nexus_agency;

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('super_admin','admin','manager','sales','support') DEFAULT 'support',
    avatar_url    VARCHAR(500),
    is_active     BOOLEAN DEFAULT TRUE,
    last_login    DATETIME,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email), INDEX idx_role (role)
) ENGINE=InnoDB;

-- LEADS
CREATE TABLE IF NOT EXISTS leads (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    email               VARCHAR(150) NOT NULL,
    phone               VARCHAR(30),
    company             VARCHAR(150),
    services_interested TEXT,
    budget_range        VARCHAR(50),
    message             TEXT,
    ip_address          VARCHAR(45),
    source              VARCHAR(255),
    status              ENUM('new','contacted','qualified','proposal','won','lost') DEFAULT 'new',
    assigned_to         INT,
    notes               TEXT,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_email (email), INDEX idx_status (status), INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- CLIENTS
CREATE TABLE IF NOT EXISTS clients (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    lead_id         INT,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    phone           VARCHAR(30),
    company         VARCHAR(150),
    website         VARCHAR(255),
    industry        VARCHAR(100),
    plan            ENUM('starter','growth','enterprise','custom') DEFAULT 'starter',
    status          ENUM('active','paused','churned') DEFAULT 'active',
    monthly_value   DECIMAL(10,2) DEFAULT 0.00,
    start_date      DATE,
    account_manager INT,
    notes           TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
    FOREIGN KEY (account_manager) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_email (email), INDEX idx_status (status), INDEX idx_plan (plan)
) ENGINE=InnoDB;

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    slug        VARCHAR(50) NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    category    VARCHAR(50),
    base_price  DECIMAL(10,2) DEFAULT 0.00,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO services (slug, name, category, base_price) VALUES
('web-development','Web Development','Development',1500.00),
('social-media-marketing','Social Media Marketing','Marketing',800.00),
('content-marketing','Content Marketing','Content',600.00),
('email-marketing','Email Marketing','Marketing',400.00),
('ppc-advertising','PPC Advertising','Advertising',1000.00),
('affiliate-marketing','Affiliate Marketing','Marketing',500.00),
('public-relations','Public Relations','PR',1200.00);

-- CLIENT SERVICES
CREATE TABLE IF NOT EXISTS client_services (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    client_id    INT NOT NULL,
    service_id   INT NOT NULL,
    status       ENUM('active','paused','cancelled') DEFAULT 'active',
    monthly_cost DECIMAL(10,2) NOT NULL,
    start_date   DATE NOT NULL,
    end_date     DATE,
    notes        TEXT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE KEY unique_client_service (client_id, service_id)
) ENGINE=InnoDB;

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    client_id    INT NOT NULL,
    service_id   INT,
    name         VARCHAR(200) NOT NULL,
    description  TEXT,
    status       ENUM('planning','in_progress','review','completed','on_hold','cancelled') DEFAULT 'planning',
    priority     ENUM('low','medium','high','urgent') DEFAULT 'medium',
    budget       DECIMAL(10,2),
    start_date   DATE,
    due_date     DATE,
    completed_at DATETIME,
    manager_id   INT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_client (client_id), INDEX idx_status (status)
) ENGINE=InnoDB;

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    project_id   INT NOT NULL,
    assigned_to  INT,
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    status       ENUM('todo','in_progress','review','done') DEFAULT 'todo',
    priority     ENUM('low','medium','high') DEFAULT 'medium',
    due_date     DATE,
    completed_at DATETIME,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- CAMPAIGNS
CREATE TABLE IF NOT EXISTS campaigns (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    client_id       INT NOT NULL,
    service_id      INT NOT NULL,
    name            VARCHAR(200) NOT NULL,
    type            ENUM('email','ppc','social','content','pr','affiliate') NOT NULL,
    status          ENUM('draft','scheduled','active','paused','completed') DEFAULT 'draft',
    budget          DECIMAL(10,2),
    spend           DECIMAL(10,2) DEFAULT 0.00,
    impressions     BIGINT DEFAULT 0,
    clicks          INT DEFAULT 0,
    conversions     INT DEFAULT 0,
    revenue         DECIMAL(12,2) DEFAULT 0.00,
    start_date      DATE,
    end_date        DATE,
    target_audience TEXT,
    notes           TEXT,
    created_by      INT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_client (client_id), INDEX idx_status (status), INDEX idx_type (type)
) ENGINE=InnoDB;

-- CAMPAIGN METRICS (Daily)
CREATE TABLE IF NOT EXISTS campaign_metrics (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id  INT NOT NULL,
    metric_date  DATE NOT NULL,
    impressions  INT DEFAULT 0,
    clicks       INT DEFAULT 0,
    conversions  INT DEFAULT 0,
    spend        DECIMAL(10,2) DEFAULT 0.00,
    revenue      DECIMAL(10,2) DEFAULT 0.00,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    UNIQUE KEY unique_campaign_date (campaign_id, metric_date)
) ENGINE=InnoDB;

-- INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    client_id      INT NOT NULL,
    invoice_number VARCHAR(30) NOT NULL UNIQUE,
    status         ENUM('draft','sent','paid','overdue','cancelled') DEFAULT 'draft',
    subtotal       DECIMAL(10,2) NOT NULL,
    tax_rate       DECIMAL(5,2) DEFAULT 0.00,
    tax_amount     DECIMAL(10,2) DEFAULT 0.00,
    total          DECIMAL(10,2) DEFAULT 0.00,
    issue_date     DATE NOT NULL,
    due_date       DATE NOT NULL,
    paid_date      DATE,
    payment_method VARCHAR(50),
    notes          TEXT,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client (client_id), INDEX idx_status (status)
) ENGINE=InnoDB;

-- INVOICE ITEMS
CREATE TABLE IF NOT EXISTS invoice_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id  INT NOT NULL,
    service_id  INT,
    description VARCHAR(255) NOT NULL,
    quantity    INT DEFAULT 1,
    unit_price  DECIMAL(10,2) NOT NULL,
    total       DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- AI CONVERSATIONS LOG
CREATE TABLE IF NOT EXISTS ai_conversations (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    session_id     VARCHAR(64),
    ip_address     VARCHAR(45),
    user_message   TEXT NOT NULL,
    ai_response    TEXT NOT NULL,
    lead_generated BOOLEAN DEFAULT FALSE,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id), INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(150) NOT NULL UNIQUE,
    name            VARCHAR(100),
    status          ENUM('active','unsubscribed','bounced') DEFAULT 'active',
    source          VARCHAR(100) DEFAULT 'website',
    subscribed_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at DATETIME,
    INDEX idx_email (email), INDEX idx_status (status)
) ENGINE=InnoDB;

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    client_id    INT,
    author_name  VARCHAR(100) NOT NULL,
    author_title VARCHAR(150),
    company      VARCHAR(150),
    content      TEXT NOT NULL,
    rating       TINYINT DEFAULT 5,
    is_featured  BOOLEAN DEFAULT FALSE,
    is_approved  BOOLEAN DEFAULT FALSE,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ACTIVITY LOG
CREATE TABLE IF NOT EXISTS activity_log (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT,
    lead_id     INT,
    client_id   INT,
    action      VARCHAR(100) NOT NULL,
    description TEXT,
    metadata    JSON,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    INDEX idx_action (action), INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- SETTINGS
CREATE TABLE IF NOT EXISTS settings (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    key_name   VARCHAR(100) NOT NULL UNIQUE,
    value      TEXT,
    type       ENUM('text','json','boolean','number') DEFAULT 'text',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO settings (key_name, value, type) VALUES
('company_name','NEXUS Digital Agency','text'),
('company_email','hello@nexusagency.io','text'),
('tax_rate','0','number'),
('invoice_prefix','INV','text'),
('ai_responses_enabled','1','boolean');

-- DEFAULT ADMIN (change password immediately in production!)
INSERT IGNORE INTO users (name, email, password_hash, role) VALUES
('NEXUS Admin','admin@nexusagency.io','$2y$12$CHANGE_THIS_HASH_IN_PRODUCTION','super_admin');

-- USEFUL VIEWS
CREATE OR REPLACE VIEW v_lead_summary AS
SELECT l.*, u.name AS assigned_name FROM leads l LEFT JOIN users u ON l.assigned_to = u.id;

CREATE OR REPLACE VIEW v_client_mrr AS
SELECT c.id, c.name, c.company, c.plan, c.status,
    COALESCE(SUM(cs.monthly_cost), c.monthly_value) AS mrr,
    COUNT(DISTINCT cs.service_id) AS active_services
FROM clients c
LEFT JOIN client_services cs ON c.id = cs.client_id AND cs.status = 'active'
GROUP BY c.id;

CREATE OR REPLACE VIEW v_campaign_performance AS
SELECT c.id, c.name, c.type, c.status, cl.name AS client_name,
    c.budget, c.spend,
    SUM(m.impressions) AS total_impressions,
    SUM(m.clicks) AS total_clicks,
    SUM(m.conversions) AS total_conversions,
    SUM(m.revenue) AS total_revenue,
    IF(c.spend > 0, SUM(m.revenue)/c.spend, 0) AS overall_roas
FROM campaigns c
JOIN clients cl ON c.client_id = cl.id
LEFT JOIN campaign_metrics m ON c.id = m.campaign_id
GROUP BY c.id;

CREATE OR REPLACE VIEW v_monthly_revenue AS
SELECT DATE_FORMAT(paid_date, '%Y-%m') AS month,
    COUNT(*) AS invoices_paid,
    SUM(total) AS total_revenue
FROM invoices WHERE status = 'paid'
GROUP BY DATE_FORMAT(paid_date, '%Y-%m')
ORDER BY month DESC;
