-- إضافة الجداول المطلوبة لقاعدة البيانات

-- جدول المسؤول (Admin)
CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- جدول الإعلانات
CREATE TABLE IF NOT EXISTS advertisements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  link_url VARCHAR(500),
  display_pages VARCHAR(500) DEFAULT 'home,game',
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  views INT DEFAULT 0,
  clicks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100),
  ip_address VARCHAR(45),
  country VARCHAR(100),
  first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_games INT DEFAULT 0,
  total_playtime INT DEFAULT 0
);

-- جدول الزيارات اليومية
CREATE TABLE IF NOT EXISTS daily_visits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  visit_date DATE NOT NULL UNIQUE,
  total_visits INT DEFAULT 0,
  unique_users INT DEFAULT 0,
  total_playtime INT DEFAULT 0
);

-- جدول الجلسات (Sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(255) NOT NULL,
  session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_end TIMESTAMP NULL,
  playtime_seconds INT DEFAULT 0,
  games_played INT DEFAULT 0
);

-- جدول سجل الإعلانات (للتحليلات)
CREATE TABLE IF NOT EXISTS ad_analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ad_id INT NOT NULL,
  user_id VARCHAR(255),
  action VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ad_id) REFERENCES advertisements(id)
);

-- جدول سجل الدخول (Security)
CREATE TABLE IF NOT EXISTS login_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255),
  ip_address VARCHAR(45),
  success BOOLEAN,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المحظورين
CREATE TABLE IF NOT EXISTS banned_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  reason VARCHAR(500),
  banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  banned_by INT,
  FOREIGN KEY (banned_by) REFERENCES admins(id)
);

-- إنشاء المسؤول الأساسي
-- البريد: b7239355@gmail.com
-- كلمة المرور: Hdmaa?!!
-- استخدم هذا الـ hash: $2a$10$YourHashedPasswordHere
INSERT IGNORE INTO admins (email, password_hash) VALUES 
('b7239355@gmail.com', '$2a$10$YourHashedPasswordHere');

-- الفهارس
CREATE INDEX IF NOT EXISTS idx_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_visit_date ON daily_visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_ad_active ON advertisements(is_active);
CREATE INDEX IF NOT EXISTS idx_session_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_login_email ON login_logs(email);
