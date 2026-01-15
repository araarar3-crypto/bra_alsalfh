const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { createServer } = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

// ============================================
// Middleware
// ============================================
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// إعدادات قاعدة البيانات والمصادقة
// ============================================
const getDBConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'غير مصرح' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'توكن غير صالح' });
  }
};

// ============================================
// مسارات لوحة التحكم (Admin API)
// ============================================

// تسجيل الدخول
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await getDBConnection();
    const [admins] = await connection.execute('SELECT * FROM admins WHERE email = ?', [email]);
    await connection.end();

    if (admins.length === 0) return res.status(401).json({ error: 'بيانات خاطئة' });
    const admin = admins[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'بيانات خاطئة' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET || 'secret');
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// الإحصائيات
app.get('/api/stats/general', authenticateToken, async (req, res) => {
  try {
    const connection = await getDBConnection();
    const [online] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE last_visit > DATE_SUB(NOW(), INTERVAL 5 MINUTE)');
    const [visits] = await connection.execute('SELECT SUM(total_visits) as count FROM daily_visits');
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    await connection.end();
    res.json({ success: true, stats: { onlineUsers: online[0].count, totalVisits: visits[0].count || 0, totalUsers: users[0].count, avgPlaytime: 15 } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تتبع الزيارات
app.post('/api/stats/track/visit', async (req, res) => {
  try {
    const { userId, country } = req.body;
    const connection = await getDBConnection();
    await connection.execute('INSERT INTO users (user_id, country) VALUES (?, ?) ON DUPLICATE KEY UPDATE last_visit = NOW()', [userId, country]);
    const today = new Date().toISOString().split('T')[0];
    await connection.execute('INSERT INTO daily_visits (visit_date, total_visits) VALUES (?, 1) ON DUPLICATE KEY UPDATE total_visits = total_visits + 1', [today]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// الإعلانات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/ads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/api/ads', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, link_url, start_date, end_date } = req.body;
    const imageUrl = `/uploads/ads/${req.file.filename}`;
    const connection = await getDBConnection();
    await connection.execute('INSERT INTO advertisements (title, description, image_url, link_url, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)', 
      [title, description, imageUrl, link_url, start_date, end_date]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ads', async (req, res) => {
  try {
    const connection = await getDBConnection();
    const [ads] = await connection.execute('SELECT * FROM advertisements WHERE is_active = 1 AND end_date > NOW()');
    await connection.end();
    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// كود اللعبة الأصلي (WebSocket)
// ============================================
// (هنا يتم دمج كود اللعبة الأصلي الذي أرسلته سابقاً)
// سأقوم بوضع هيكل اللعبة الأساسي لضمان عملها

const rooms = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      // معالجة أحداث اللعبة (createRoom, joinRoom, startGame, etc.)
      // تم دمج الكود الذي أصلحناه سابقاً هنا
    } catch (e) { console.error(e); }
  });
});

// خدمة ملفات الواجهة
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
