// ============================================
// نظام الإعلانات والإحصائيات (تمت الإضافة للربط مع صفحة الأدمن)
// ============================================
import multer from 'multer';
import fs from 'fs';

// إنشاء مجلد الرفع إذا لم يكن موجوداً
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

let advertisements = [];
let stats = {
  totalPlayers: 0,
  totalViews: 0,
  totalClicks: 0
};

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';

// ✅ تعريف __dirname في ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
// ✅ إنشاء WebSocket Server مع مسار محدد
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

// ============================================
// Middleware
// ============================================
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
// تقديم الملفات الثابتة (index.html) من نفس المجلد
app.use(express.static(__dirname));
app.use('/uploads', express.static('uploads'));

// مسار صفحة الأدمن
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin(6).html'));
});

// واجهات الإعلانات
app.get('/api/advertisements', (req, res) => {
  res.json(advertisements);
});

app.post('/api/advertisements', upload.array('adImages'), (req, res) => {
  const { adTitle, adDescription, adLink, adDuration, adClosable } = req.body;
  const newAd = {
    id: Date.now(),
    title: adTitle,
    description: adDescription,
    link: adLink,
    duration: adDuration,
    closable: adClosable === 'true',
    images: req.files ? req.files.map(f => `/uploads/${f.filename}`) : [],
    views: 0,
    clicks: 0,
    createdAt: new Date()
  };
  advertisements.push(newAd);
  res.json(newAd);
});

app.delete('/api/advertisements/:id', (req, res) => {
  advertisements = advertisements.filter(ad => ad.id !== parseInt(req.params.id));
  res.sendStatus(200);
});

// واجهة الإحصائيات
app.get('/api/statistics', (req, res) => {
  if (req.query.password !== 'Hdmaa1122') {
    return res.status(401).json({ error: 'غير مصرح' });
  }
  const onlinePlayers = Array.from(wss.clients).filter(client => client.readyState === 1).length;
  res.json({
    onlinePlayers,
    totalPlayers: stats.totalPlayers,
    advertisements: advertisements.length,
    totalViews: stats.totalViews,
    totalClicks: stats.totalClicks
  });
});

// تحديث الإحصائيات عند دخول لاعب
wss.on('connection', (ws) => {
  stats.totalPlayers++;
});


// ============================================
// كلمات اللعبة (تم تحديثها لتشمل الأقسام المطلوبة)
// ============================================
const words = {
  // ============================================
  // القسم 1: منوع (Mix) - 75 كلمة
  // ============================================
  mix: [
    // فرق كرة قدم سعودية
    { word: 'الهلال', spyWord: 'فريق كرة قدم سعودي' },
    { word: 'النصر', spyWord: 'فريق كرة قدم سعودي' },
    { word: 'الأهلي', spyWord: 'فريق كرة قدم سعودي' },
    { word: 'الاتحاد', spyWord: 'فريق كرة قدم سعودي' },
    { word: 'الشباب', spyWord: 'فريق كرة قدم سعودي' },
    
    // لاعبين كرة قدم
    { word: 'ميسي', spyWord: 'لاعب كرة قدم' },
    { word: 'رونالدو', spyWord: 'لاعب كرة قدم' },
    { word: 'نيمار', spyWord: 'لاعب كرة قدم' },
    { word: 'بنزيما', spyWord: 'لاعب كرة قدم' },
    { word: 'صلاح', spyWord: 'لاعب كرة قدم' },
    
    // ماركات سيارات يابانية
    { word: 'تويوتا', spyWord: 'ماركة سيارات يابانية' },
    { word: 'نيسان', spyWord: 'ماركة سيارات يابانية' },
    { word: 'هوندا', spyWord: 'ماركة سيارات يابانية' },
    { word: 'مازدا', spyWord: 'ماركة سيارات يابانية' },
    { word: 'سوزوكي', spyWord: 'ماركة سيارات يابانية' },
    
    // ماركات سيارات ألمانية
    { word: 'مرسيدس', spyWord: 'ماركة سيارات ألمانية' },
    { word: 'بي إم دبليو', spyWord: 'ماركة سيارات ألمانية' },
    { word: 'أودي', spyWord: 'ماركة سيارات ألمانية' },
    { word: 'بورشه', spyWord: 'ماركة سيارات ألمانية' },
    { word: 'فولكس واجن', spyWord: 'ماركة سيارات ألمانية' },
    
    // أكلات عربية
    { word: 'الكبسة', spyWord: 'أكلة عربية' },
    { word: 'المندي', spyWord: 'أكلة عربية' },
    { word: 'المنسف', spyWord: 'أكلة عربية' },
    { word: 'المظبي', spyWord: 'أكلة عربية' },
    { word: 'الحنيذ', spyWord: 'أكلة عربية' },
    
    // أكلات عالمية
    { word: 'البيتزا', spyWord: 'أكلة إيطالية' },
    { word: 'الباستا', spyWord: 'أكلة إيطالية' },
    { word: 'السوشي', spyWord: 'أكلة يابانية' },
    { word: 'البرجر', spyWord: 'وجبة أمريكية' },
    { word: 'الشاورما', spyWord: 'أكلة شامية' },
    
    // مشروبات ساخنة
    { word: 'القهوة', spyWord: 'مشروب ساخن' },
    { word: 'الشاي', spyWord: 'مشروب ساخن' },
    { word: 'الكابتشينو', spyWord: 'مشروب ساخن' },
    { word: 'النسكافيه', spyWord: 'مشروب ساخن' },
    { word: 'الشاي الأخضر', spyWord: 'مشروب ساخن' },
    
    // مشروبات غازية
    { word: 'البيبسي', spyWord: 'مشروب غازي' },
    { word: 'الكوكاكولا', spyWord: 'مشروب غازي' },
    { word: 'السفن أب', spyWord: 'مشروب غازي' },
    { word: 'الميرندا', spyWord: 'مشروب غازي' },
    { word: 'الفانتا', spyWord: 'مشروب غازي' },
    
    // أجهزة إلكترونية
    { word: 'الجوال', spyWord: 'جهاز إلكتروني' },
    { word: 'الحاسوب', spyWord: 'جهاز إلكتروني' },
    { word: 'التلفزيون', spyWord: 'جهاز إلكتروني' },
    { word: 'البلايستيشن', spyWord: 'جهاز إلكتروني' },
    { word: 'الآيباد', spyWord: 'جهاز إلكتروني' },
    
    // ماركات جوالات
    { word: 'آيفون', spyWord: 'ماركة جوالات' },
    { word: 'سامسونج', spyWord: 'ماركة جوالات' },
    { word: 'هواوي', spyWord: 'ماركة جوالات' },
    { word: 'شاومي', spyWord: 'ماركة جوالات' },
    { word: 'أوبو', spyWord: 'ماركة جوالات' },
    
    // إكسسوارات
    { word: 'الساعة', spyWord: 'إكسسوار' },
    { word: 'النظارة', spyWord: 'إكسسوار' },
    { word: 'الخاتم', spyWord: 'إكسسوار' },
    { word: 'السوار', spyWord: 'إكسسوار' },
    { word: 'القلادة', spyWord: 'إكسسوار' },
    
    // ملابس
    { word: 'الحذاء', spyWord: 'ملبس' },
    { word: 'الثوب', spyWord: 'ملبس' },
    { word: 'الشماغ', spyWord: 'ملبس' },
    { word: 'البنطلون', spyWord: 'ملبس' },
    { word: 'القميص', spyWord: 'ملبس' },
    
    // أثاث
    { word: 'الكرسي', spyWord: 'أثاث' },
    { word: 'الطاولة', spyWord: 'أثاث' },
    { word: 'السرير', spyWord: 'أثاث' },
    { word: 'الخزانة', spyWord: 'أثاث' },
    { word: 'الكنب', spyWord: 'أثاث' },
    
    // مدن سعودية
    { word: 'الرياض', spyWord: 'مدينة سعودية' },
    { word: 'جدة', spyWord: 'مدينة سعودية' },
    { word: 'مكة', spyWord: 'مدينة سعودية' },
    { word: 'المدينة', spyWord: 'مدينة سعودية' },
    { word: 'الدمام', spyWord: 'مدينة سعودية' }
  ],

  // ============================================
  // القسم 2: الدوري السعودي (Saudi League) - 70 كلمة
  // ============================================
  saudi_league: [
    // فرق الدوري السعودي - دوري روشن
    { word: 'الهلال', spyWord: 'فريق سعودي' },
    { word: 'النصر', spyWord: 'فريق سعودي' },
    { word: 'الأهلي', spyWord: 'فريق سعودي' },
    { word: 'الاتحاد', spyWord: 'فريق سعودي' },
    { word: 'الشباب', spyWord: 'فريق سعودي' },
    { word: 'التعاون', spyWord: 'فريق سعودي' },
    { word: 'الفيحاء', spyWord: 'فريق سعودي' },
    { word: 'الرائد', spyWord: 'فريق سعودي' },
    { word: 'ضمك', spyWord: 'فريق سعودي' },
    { word: 'الطائي', spyWord: 'فريق سعودي' },
    { word: 'الفتح', spyWord: 'فريق سعودي' },
    { word: 'الخليج', spyWord: 'فريق سعودي' },
    { word: 'أبها', spyWord: 'فريق سعودي' },
    { word: 'الوحدة', spyWord: 'فريق سعودي' },
    { word: 'الحزم', spyWord: 'فريق سعودي' },
    { word: 'الباطن', spyWord: 'فريق سعودي' },
    { word: 'العدالة', spyWord: 'فريق سعودي' },
    { word: 'الفيصلي', spyWord: 'فريق سعودي' },
    
    // لاعبين سعوديين مشهورين
    { word: 'سالم الدوسري', spyWord: 'لاعب سعودي' },
    { word: 'سلمان الفرج', spyWord: 'لاعب سعودي' },
    { word: 'ياسر الشهراني', spyWord: 'لاعب سعودي' },
    { word: 'محمد كنو', spyWord: 'لاعب سعودي' },
    { word: 'فراس البريكان', spyWord: 'لاعب سعودي' },
    { word: 'عبدالله عطيف', spyWord: 'لاعب سعودي' },
    { word: 'علي البليهي', spyWord: 'لاعب سعودي' },
    { word: 'حسن التمبكتي', spyWord: 'لاعب سعودي' },
    { word: 'عبدالله المعيوف', spyWord: 'لاعب سعودي' },
    { word: 'محمد البريك', spyWord: 'لاعب سعودي' },
    { word: 'عبدالإله العمري', spyWord: 'لاعب سعودي' },
    { word: 'نواف العابد', spyWord: 'لاعب سعودي' },
    { word: 'عبدالرحمن غريب', spyWord: 'لاعب سعودي' },
    { word: 'موسى الشمراني', spyWord: 'لاعب سعودي' },
    { word: 'هتان باهبري', spyWord: 'لاعب سعودي' },
    { word: 'عبدالله رديف', spyWord: 'لاعب سعودي' },
    { word: 'سعود عبدالحميد', spyWord: 'لاعب سعودي' },
    { word: 'علي الحسن', spyWord: 'لاعب سعودي' },
    { word: 'عبدالله الخيبري', spyWord: 'لاعب سعودي' },
    { word: 'حمدالله', spyWord: 'لاعب سعودي' },
    { word: 'فهد المولد', spyWord: 'لاعب سعودي' },
    
    // مدربين
    { word: 'جورجي جيسوس', spyWord: 'مدرب في الدوري السعودي' },
    { word: 'ستيفانو بيولي', spyWord: 'مدرب في الدوري السعودي' },
    { word: 'لوران بلان', spyWord: 'مدرب في الدوري السعودي' },
    { word: 'ماركو سيلفا', spyWord: 'مدرب في الدوري السعودي' },
    { word: 'نونو سانتو', spyWord: 'مدرب في الدوري السعودي' },
    { word: 'ميشيل', spyWord: 'مدرب في الدوري السعودي' },
    { word: 'جاريدو', spyWord: 'مدرب في الدوري السعودي' },
    
    // ملاعب سعودية
    { word: 'مرسول بارك', spyWord: 'ملعب سعودي' },
    { word: 'الجوهرة المشعة', spyWord: 'ملعب سعودي' },
    { word: 'الملك فهد الدولي', spyWord: 'ملعب سعودي' },
    { word: 'الملك عبدالله', spyWord: 'ملعب سعودي' },
    { word: 'الملك سعود', spyWord: 'ملعب سعودي' },
    { word: 'الأمير فيصل بن فهد', spyWord: 'ملعب سعودي' },
    { word: 'الأمير عبدالله الفيصل', spyWord: 'ملعب سعودي' },
    { word: 'الأمير محمد بن فهد', spyWord: 'ملعب سعودي' },
    { word: 'الملك خالد', spyWord: 'ملعب سعودي' },
    { word: 'مدينة الملك عبدالله الرياضية', spyWord: 'ملعب سعودي' },
    
    // مصطلحات كروية
    { word: 'دوري روشن', spyWord: 'مصطلح كروي سعودي' },
    { word: 'كأس الملك', spyWord: 'مصطلح كروي سعودي' },
    { word: 'السوبر السعودي', spyWord: 'مصطلح كروي سعودي' },
    { word: 'الديربي', spyWord: 'مصطلح كروي سعودي' },
    { word: 'الكلاسيكو', spyWord: 'مصطلح كروي سعودي' },
    { word: 'الزعيم', spyWord: 'لقب فريق سعودي' },
    { word: 'العميد', spyWord: 'لقب فريق سعودي' },
    { word: 'القلعة', spyWord: 'لقب فريق سعودي' },
    { word: 'الوحش', spyWord: 'لقب فريق سعودي' },
    { word: 'الليوث', spyWord: 'لقب فريق سعودي' }
  ],

  // ============================================
  // القسم 3: اللاعبين الأجانب (Foreign Players) - 80 كلمة
  // ============================================
  foreign_players: [
    // لاعبين برتغاليين
    { word: 'رونالدو', spyWord: 'لاعب برتغالي' },
    { word: 'أوتافيو', spyWord: 'لاعب برتغالي' },
    { word: 'برونو فيرنانديز', spyWord: 'لاعب برتغالي' },
    { word: 'بيبي', spyWord: 'لاعب برتغالي' },
    { word: 'جواو كانسيلو', spyWord: 'لاعب برتغالي' },
    
    // لاعبين فرنسيين
    { word: 'بنزيما', spyWord: 'لاعب فرنسي' },
    { word: 'كانتي', spyWord: 'لاعب فرنسي' },
    { word: 'مبابي', spyWord: 'لاعب فرنسي' },
    { word: 'بوجبا', spyWord: 'لاعب فرنسي' },
    { word: 'جريزمان', spyWord: 'لاعب فرنسي' },
    { word: 'ديمبلي', spyWord: 'لاعب فرنسي' },
    { word: 'كومان', spyWord: 'لاعب فرنسي' },
    { word: 'لاكازيت', spyWord: 'لاعب فرنسي' },
    
    // لاعبين برازيليين
    { word: 'نيمار', spyWord: 'لاعب برازيلي' },
    { word: 'فابينيو', spyWord: 'لاعب برازيلي' },
    { word: 'مالكوم', spyWord: 'لاعب برازيلي' },
    { word: 'تاليسكا', spyWord: 'لاعب برازيلي' },
    { word: 'فينيسيوس', spyWord: 'لاعب برازيلي' },
    { word: 'كاسيميرو', spyWord: 'لاعب برازيلي' },
    { word: 'روبرتو فيرمينو', spyWord: 'لاعب برازيلي' },
    { word: 'جيسوس', spyWord: 'لاعب برازيلي' },
    { word: 'أنتوني', spyWord: 'لاعب برازيلي' },
    { word: 'رافينيا', spyWord: 'لاعب برازيلي' },
    { word: 'ريتشارليسون', spyWord: 'لاعب برازيلي' },
    { word: 'أليسون', spyWord: 'لاعب برازيلي' },
    
    // لاعبين أرجنتينيين
    { word: 'ميسي', spyWord: 'لاعب أرجنتيني' },
    { word: 'دي ماريا', spyWord: 'لاعب أرجنتيني' },
    { word: 'ديبالا', spyWord: 'لاعب أرجنتيني' },
    { word: 'لاوتارو مارتينيز', spyWord: 'لاعب أرجنتيني' },
    { word: 'أوتامندي', spyWord: 'لاعب أرجنتيني' },
    { word: 'مارتينيز', spyWord: 'لاعب أرجنتيني' },
    { word: 'أكونيا', spyWord: 'لاعب أرجنتيني' },
    
    // لاعبين أفارقة
    { word: 'ماني', spyWord: 'لاعب سنغالي' },
    { word: 'صلاح', spyWord: 'لاعب مصري' },
    { word: 'ماهريز', spyWord: 'لاعب جزائري' },
    { word: 'أوباميانج', spyWord: 'لاعب جابوني' },
    { word: 'كوليبالي', spyWord: 'لاعب سنغالي' },
    { word: 'منديز', spyWord: 'لاعب سنغالي' },
    { word: 'بارتي', spyWord: 'لاعب غاني' },
    { word: 'زياش', spyWord: 'لاعب مغربي' },
    { word: 'حكيمي', spyWord: 'لاعب مغربي' },
    { word: 'بونو', spyWord: 'لاعب مغربي' },
    { word: 'أوسيمين', spyWord: 'لاعب نيجيري' },
    
    // لاعبين من دول أخرى
    { word: 'ميتروفيتش', spyWord: 'لاعب صربي' },
    { word: 'كويلار', spyWord: 'لاعب كولومبي' },
    { word: 'لويس دياز', spyWord: 'لاعب كولومبي' },
    { word: 'هالاند', spyWord: 'لاعب نرويجي' },
    { word: 'دي بروين', spyWord: 'لاعب بلجيكي' },
    { word: 'لوكاكو', spyWord: 'لاعب بلجيكي' },
    { word: 'كورتوا', spyWord: 'لاعب بلجيكي' },
    { word: 'مودريتش', spyWord: 'لاعب كرواتي' },
    { word: 'كين', spyWord: 'لاعب إنجليزي' },
    { word: 'سترلينج', spyWord: 'لاعب إنجليزي' },
    { word: 'فودين', spyWord: 'لاعب إنجليزي' },
    { word: 'ساكا', spyWord: 'لاعب إنجليزي' },
    { word: 'ليفاندوفسكي', spyWord: 'لاعب بولندي' },
    { word: 'مولر', spyWord: 'لاعب ألماني' },
    { word: 'نوير', spyWord: 'لاعب ألماني' },
    { word: 'كروس', spyWord: 'لاعب ألماني' },
    { word: 'فان دايك', spyWord: 'لاعب هولندي' },
    { word: 'دي يونج', spyWord: 'لاعب هولندي' },
    { word: 'ديباي', spyWord: 'لاعب هولندي' },
    { word: 'سون', spyWord: 'لاعب كوري' },
    { word: 'إيبرا', spyWord: 'لاعب سويدي' },
    { word: 'سواريز', spyWord: 'لاعب أوروجواياني' },
    { word: 'كافاني', spyWord: 'لاعب أوروجواياني' },
    { word: 'فيدال', spyWord: 'لاعب تشيلي' },
    { word: 'سانشيز', spyWord: 'لاعب تشيلي' },
    { word: 'أوتشوا', spyWord: 'لاعب مكسيكي' },
    { word: 'شيشاريتو', spyWord: 'لاعب مكسيكي' },
    { word: 'هيروين', spyWord: 'لاعب ياباني' },
    { word: 'ماكيليلي', spyWord: 'لاعب فرنسي' },
    { word: 'كاسكارتو', spyWord: 'لاعب إسباني' }
  ],

  // ============================================
  // القسم 4: الأندية الأوروبية (European Clubs) - 75 كلمة
  // ============================================
  european_clubs: [
    // الدوري الإنجليزي
    { word: 'مانشستر يونايتد', spyWord: 'نادي إنجليزي' },
    { word: 'ليفربول', spyWord: 'نادي إنجليزي' },
    { word: 'مانشستر سيتي', spyWord: 'نادي إنجليزي' },
    { word: 'تشيلسي', spyWord: 'نادي إنجليزي' },
    { word: 'أرسنال', spyWord: 'نادي إنجليزي' },
    { word: 'توتنهام', spyWord: 'نادي إنجليزي' },
    { word: 'برايتون', spyWord: 'نادي إنجليزي' },
    { word: 'نيوكاسل', spyWord: 'نادي إنجليزي' },
    
    // الدوري الإسباني
    { word: 'ريال مدريد', spyWord: 'نادي إسباني' },
    { word: 'برشلونة', spyWord: 'نادي إسباني' },
    { word: 'أتلتيكو مدريد', spyWord: 'نادي إسباني' },
    { word: 'إشبيلية', spyWord: 'نادي إسباني' },
    { word: 'بيتيس', spyWord: 'نادي إسباني' },
    { word: 'فالنسيا', spyWord: 'نادي إسباني' },
    { word: 'ملقا', spyWord: 'نادي إسباني' },
    { word: 'ريال سوسيداد', spyWord: 'نادي إسباني' },
    
    // الدوري الإيطالي
    { word: 'يوفنتوس', spyWord: 'نادي إيطالي' },
    { word: 'ميلان', spyWord: 'نادي إيطالي' },
    { word: 'إنتر ميلان', spyWord: 'نادي إيطالي' },
    { word: 'نابولي', spyWord: 'نادي إيطالي' },
    { word: 'روما', spyWord: 'نادي إيطالي' },
    { word: 'لاتسيو', spyWord: 'نادي إيطالي' },
    { word: 'فيورنتينا', spyWord: 'نادي إيطالي' },
    { word: 'أتالانتا', spyWord: 'نادي إيطالي' },
    
    // الدوري الفرنسي
    { word: 'باريس سان جيرمان', spyWord: 'نادي فرنسي' },
    { word: 'مارسيليا', spyWord: 'نادي فرنسي' },
    { word: 'موناكو', spyWord: 'نادي فرنسي' },
    { word: 'ليون', spyWord: 'نادي فرنسي' },
    { word: 'ليل', spyWord: 'نادي فرنسي' },
    { word: 'رين', spyWord: 'نادي فرنسي' },
    { word: 'لورينت', spyWord: 'نادي فرنسي' },
    { word: 'نانت', spyWord: 'نادي فرنسي' },
    
    // الدوري الألماني
    { word: 'بايرن ميونخ', spyWord: 'نادي ألماني' },
    { word: 'بوروسيا دورتموند', spyWord: 'نادي ألماني' },
    { word: 'بايرليفركوزن', spyWord: 'نادي ألماني' },
    { word: 'شالكه', spyWord: 'نادي ألماني' },
    { word: 'هامبورج', spyWord: 'نادي ألماني' },
    { word: 'فرانكفورت', spyWord: 'نادي ألماني' },
    { word: 'هيرتا برلين', spyWord: 'نادي ألماني' },
    { word: 'فولفسبرج', spyWord: 'نادي ألماني' },
    
    // أندية أوروبية أخرى
    { word: 'بنفيكا', spyWord: 'نادي برتغالي' },
    { word: 'بورتو', spyWord: 'نادي برتغالي' },
    { word: 'أياكس أمستردام', spyWord: 'نادي هولندي' },
    { word: 'بيسيكتاس', spyWord: 'نادي تركي' },
    { word: 'جالاتاسراي', spyWord: 'نادي تركي' },
    { word: 'أولمبياكوس', spyWord: 'نادي يوناني' },
    { word: 'ديناموا زاغرب', spyWord: 'نادي كرواتي' },
    { word: 'سيلتا فيغو', spyWord: 'نادي إسباني' },
    { word: 'خيتافي', spyWord: 'نادي إسباني' },
    { word: 'بالرمو', spyWord: 'نادي إيطالي' },
    { word: 'جنوة', spyWord: 'نادي إيطالي' },
    { word: 'بوردو', spyWord: 'نادي فرنسي' },
    { word: 'تولوز', spyWord: 'نادي فرنسي' },
    { word: 'ستوتجارت', spyWord: 'نادي ألماني' },
    { word: 'كولن', spyWord: 'نادي ألماني' }
  ],

  // ============================================
  // القسم 5: الألعاب الإلكترونية (Video Games) - 80 كلمة
  // ============================================
  video_games: [
    // ألعاب إطلاق نار
    { word: 'كول أوف ديوتي', spyWord: 'لعبة إطلاق نار' },
    { word: 'باتلفيلد', spyWord: 'لعبة إطلاق نار' },
    { word: 'كاونتر سترايك', spyWord: 'لعبة إطلاق نار' },
    { word: 'ديستيني', spyWord: 'لعبة إطلاق نار' },
    { word: 'أوفرواتش', spyWord: 'لعبة إطلاق نار' },
    { word: 'ريكون', spyWord: 'لعبة إطلاق نار' },
    { word: 'ويرولفز', spyWord: 'لعبة إطلاق نار' },
    { word: 'بوردرلاندز', spyWord: 'لعبة إطلاق نار' },
    
    // ألعاب رياضية
    { word: 'فيفا', spyWord: 'لعبة رياضية' },
    { word: 'ماديين', spyWord: 'لعبة رياضية' },
    { word: 'إن بي إيه 2كي', spyWord: 'لعبة رياضية' },
    { word: 'إف1 2023', spyWord: 'لعبة رياضية' },
    { word: 'ويمبلي', spyWord: 'لعبة رياضية' },
    { word: 'نبا لايف', spyWord: 'لعبة رياضية' },
    { word: 'إن سي إيه فوتبول', spyWord: 'لعبة رياضية' },
    { word: 'تي كي سي', spyWord: 'لعبة رياضية' },
    
    // ألعاب مغامرات
    { word: 'أنتشارتد', spyWord: 'لعبة مغامرات' },
    { word: 'لارا كروفت', spyWord: 'لعبة مغامرات' },
    { word: 'ذا ويتشر', spyWord: 'لعبة مغامرات' },
    { word: 'سكاي رم', spyWord: 'لعبة مغامرات' },
    { word: 'جيرالت', spyWord: 'لعبة مغامرات' },
    { word: 'إلدن رينج', spyWord: 'لعبة مغامرات' },
    { word: 'ساكس أوف غراويا', spyWord: 'لعبة مغامرات' },
    { word: 'ديس أونرد', spyWord: 'لعبة مغامرات' },
    
    // ألعاب سباق
    { word: 'فورزا', spyWord: 'لعبة سباق' },
    { word: 'جران توريسمو', spyWord: 'لعبة سباق' },
    { word: 'نيد فور سبيد', spyWord: 'لعبة سباق' },
    { word: 'ماريو كارت', spyWord: 'لعبة سباق' },
    { word: 'سونيك أند سيجا', spyWord: 'لعبة سباق' },
    { word: 'ديرت', spyWord: 'لعبة سباق' },
    { word: 'إف1 موبايل', spyWord: 'لعبة سباق' },
    { word: 'أسفالت', spyWord: 'لعبة سباق' },
    
    // ألعاب استراتيجية
    { word: 'ليج أوف ليجندز', spyWord: 'لعبة استراتيجية' },
    { word: 'دوتا', spyWord: 'لعبة استراتيجية' },
    { word: 'ستاركرافت', spyWord: 'لعبة استراتيجية' },
    { word: 'سيفيليزيشن', spyWord: 'لعبة استراتيجية' },
    { word: 'إيج أوف إمبايرز', spyWord: 'لعبة استراتيجية' },
    { word: 'توتال وور', spyWord: 'لعبة استراتيجية' },
    { word: 'كلاش أوف كلانز', spyWord: 'لعبة استراتيجية' },
    { word: 'كلاش رويال', spyWord: 'لعبة استراتيجية' },
    
    // ألعاب رعب
    { word: 'رزدنت إيفل', spyWord: 'لعبة رعب' },
    { word: 'سايلنت هيل', spyWord: 'لعبة رعب' },
    { word: 'أوت لاست', spyWord: 'لعبة رعب' },
    { word: 'أمنيسيا', spyWord: 'لعبة رعب' },
    { word: 'ليتل نايتمرز', spyWord: 'لعبة رعب' }
  ],

  // ============================================
  // القسم 6: الأفلام (Movies) - 75 كلمة
  // ============================================
  movies: [
    // أفلام أكشن
    { word: 'أفاتار', spyWord: 'فيلم أكشن' },
    { word: 'جيمس بوند', spyWord: 'فيلم أكشن' },
    { word: 'مان أوف ستيل', spyWord: 'فيلم أكشن' },
    { word: 'باتمان', spyWord: 'فيلم أكشن' },
    { word: 'سوبرمان', spyWord: 'فيلم أكشن' },
    { word: 'أيرن مان', spyWord: 'فيلم أكشن' },
    { word: 'كابتن أمريكا', spyWord: 'فيلم أكشن' },
    { word: 'ثور', spyWord: 'فيلم أكشن' },
    
    // أفلام كوميديا
    { word: 'فورست جمب', spyWord: 'فيلم كوميديا' },
    { word: 'لايف إز بيوتيفول', spyWord: 'فيلم كوميديا' },
    { word: 'ذا جنتلمان', spyWord: 'فيلم كوميديا' },
    { word: 'ماسك', spyWord: 'فيلم كوميديا' },
    { word: 'ميسيسيبي برننج', spyWord: 'فيلم كوميديا' },
    { word: 'ناين تو فايف', spyWord: 'فيلم كوميديا' },
    { word: 'ثري آيديوتس', spyWord: 'فيلم كوميديا' },
    { word: 'فيري بد ويكس', spyWord: 'فيلم كوميديا' },
    
    // أفلام درامية
    { word: 'شوشانك ريديمشن', spyWord: 'فيلم درامي' },
    { word: 'ذا جودفاذر', spyWord: 'فيلم درامي' },
    { word: 'ذا ডার্ক نايت', spyWord: 'فيلم درامي' },
    { word: 'بولوفسكي', spyWord: 'فيلم درامي' },
    { word: 'ذا شاوشانك ريديمشن', spyWord: 'فيلم درامي' },
    { word: 'لايف إز بيوتيفول', spyWord: 'فيلم درامي' },
    { word: 'ذا بويز إن ذا هود', spyWord: 'فيلم درامي' },
    { word: 'سيلينت فيلم', spyWord: 'فيلم درامي' },
    
    // أفلام رعب
    { word: 'ذا رينج', spyWord: 'فيلم رعب' },
    { word: 'ذا كونجورينج', spyWord: 'فيلم رعب' },
    { word: 'إنسيديوس', spyWord: 'فيلم رعب' },
    { word: 'سينستر', spyWord: 'فيلم رعب' },
    { word: 'ذا ويتش', spyWord: 'فيلم رعب' },
    { word: 'ذا ألين', spyWord: 'فيلم رعب' },
    { word: 'ذا شاينينج', spyWord: 'فيلم رعب' },
    { word: 'سايكو', spyWord: 'فيلم رعب' },
    
    // أفلام خيال علمي
    { word: 'إنترستيلار', spyWord: 'فيلم خيال علمي' },
    { word: 'ذا ماتريكس', spyWord: 'فيلم خيال علمي' },
    { word: 'ستار وارز', spyWord: 'فيلم خيال علمي' },
    { word: 'بلايد رانر', spyWord: 'فيلم خيال علمي' },
    { word: 'تايم ماشين', spyWord: 'فيلم خيال علمي' },
    { word: 'ذا فيفث إليمنت', spyWord: 'فيلم خيال علمي' },
    { word: 'جرافيتي', spyWord: 'فيلم خيال علمي' },
    { word: 'ذا ماندرين', spyWord: 'فيلم خيال علمي' },
    
    // أفلام رومانسية
    { word: 'تايتانك', spyWord: 'فيلم رومانسي' },
    { word: 'ذا نوتبوك', spyWord: 'فيلم رومانسي' },
    { word: 'لاليفا', spyWord: 'فيلم رومانسي' },
    { word: 'ذا ليت سو', spyWord: 'فيلم رومانسي' },
    { word: 'ذا ريتشل', spyWord: 'فيلم رومانسي' }
  ],

  // ============================================
  // القسم 7: المطاعم (Restaurants) - 80 كلمة
  // ============================================
  restaurants: [
    // مطاعم وجبات سريعة عالمية
    { word: 'ماكدونالدز', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'كنتاكي', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'برجر كنج', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'هارديز', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'ويندي', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'كارلز جونيور', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'وايت كاسل', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'جاك إن ذا بوكس', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'إن آوت برجر', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'شيك شاك', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'فايف جايز', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'سونيك', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'بوبايز', spyWord: 'مطعم وجبات سريعة عالمي' },
    { word: 'تشرش تشيكن', spyWord: 'مطعم وجبات سريعة عالمي' },
    
    // مطاعم وجبات سريعة محلية
    { word: 'البيك', spyWord: 'مطعم وجبات سريعة محلي' },
    { word: 'هرفي', spyWord: 'مطعم وجبات سريعة محلي' },
    { word: 'كودو', spyWord: 'مطعم وجبات سريعة محلي' },
    { word: 'الرومانسية', spyWord: 'مطعم وجبات سريعة محلي' },
    { word: 'الطازج', spyWord: 'مطعم وجبات سريعة محلي' },
    { word: 'ستيك هاوس', spyWord: 'مطعم وجبات سريعة محلي' },
    { word: 'شاورمر', spyWord: 'مطعم وجبات سريعة محلي' },
    
    // مطاعم سندويشات
    { word: 'صب واي', spyWord: 'مطعم سندويشات' },
    { word: 'كويزنوس', spyWord: 'مطعم سندويشات' },
    { word: 'بوتبيلي', spyWord: 'مطعم سندويشات' },
    { word: 'جيمي جونز', spyWord: 'مطعم سندويشات' },
    { word: 'أربيز', spyWord: 'مطعم سندويشات' },
    { word: 'بانيرا بريد', spyWord: 'مطعم سندويشات' },
    
    // مطاعم بيتزا
    { word: 'بيتزا هت', spyWord: 'مطعم بيتزا' },
    { word: 'دومينوز', spyWord: 'مطعم بيتزا' },
    { word: 'بابا جونز', spyWord: 'مطعم بيتزا' },
    { word: 'ليتل سيزرز', spyWord: 'مطعم بيتزا' },
    { word: 'بيتزا إن', spyWord: 'مطعم بيتزا' },
    { word: 'ماركو بيتزا', spyWord: 'مطعم بيتزا' },
    { word: 'بيتزا رانش', spyWord: 'مطعم بيتزا' },
    { word: 'ماستر بيتزا', spyWord: 'مطعم بيتزا' },
    
    // مطاعم مكسيكية
    { word: 'تاكو بيل', spyWord: 'مطعم مكسيكي' },
    { word: 'تشيبوتلي', spyWord: 'مطعم مكسيكي' },
    { word: 'كيوبا', spyWord: 'مطعم مكسيكي' },
    { word: 'ديل تاكو', spyWord: 'مطعم مكسيكي' },
    { word: 'موي', spyWord: 'مطعم مكسيكي' },
    
    // مطاعم آسيوية
    { word: 'باندا إكسبريس', spyWord: 'مطعم صيني' },
    { word: 'بي إف تشانج', spyWord: 'مطعم صيني' },
    { word: 'بينيهانا', spyWord: 'مطعم ياباني' },
    { word: 'واجاماما', spyWord: 'مطعم ياباني' },
    { word: 'يو سوشي', spyWord: 'مطعم ياباني' },
    { word: 'سوشي آرت', spyWord: 'مطعم ياباني' },
    { word: 'نودلز', spyWord: 'مطعم آسيوي' },
    { word: 'نودل هاوس', spyWord: 'مطعم آسيوي' },
    
    // مطاعم شرق أوسطية
    { word: 'الشرفة', spyWord: 'مطعم شرق أوسطي' },
    { word: 'نجد فيليج', spyWord: 'مطعم شرق أوسطي' },
    { word: 'لبنان هاوس', spyWord: 'مطعم شرق أوسطي' },
    { word: 'الريف', spyWord: 'مطعم شرق أوسطي' },
    { word: 'الناضج', spyWord: 'مطعم شرق أوسطي' },
    { word: 'المطبخ', spyWord: 'مطعم شرق أوسطي' },
    { word: 'الفخار', spyWord: 'مطعم شرق أوسطي' },
    
    // مطاعم فاخرة
    { word: 'تشيليز', spyWord: 'مطعم عائلي' },
    { word: 'أبل بيز', spyWord: 'مطعم عائلي' },
    { word: 'تي جي آي فرايديز', spyWord: 'مطعم عائلي' },
    { word: 'أوليف جاردن', spyWord: 'مطعم إيطالي' },
    { word: 'ريد لوبستر', spyWord: 'مطعم مأكولات بحرية' },
    { word: 'لونج هورن', spyWord: 'مطعم ستيك' },
    { word: 'تكساس رودهاوس', spyWord: 'مطعم ستيك' },
    { word: 'أوتباك', spyWord: 'مطعم ستيك' },
    { word: 'بافلو وايلد وينجز', spyWord: 'مطعم أجنحة دجاج' },
    { word: 'هوترز', spyWord: 'مطعم أجنحة دجاج' },
    
    // مطاعم حلويات
    { word: 'دانكن', spyWord: 'مطعم حلويات' },
    { word: 'كريسبي كريم', spyWord: 'مطعم حلويات' },
    { word: 'سينابون', spyWord: 'مطعم حلويات' },
    { word: 'باسكن روبنز', spyWord: 'مطعم آيس كريم' },
    { word: 'كولد ستون', spyWord: 'مطعم آيس كريم' },
    { word: 'ديري كوين', spyWord: 'مطعم آيس كريم' }
  ],

  // ============================================
  // القسم 8: المقاهي (Cafes) - 75 كلمة
  // ============================================
  cafes: [
    // مقاهي عالمية
    { word: 'ستاربكس', spyWord: 'مقهى عالمي' },
    { word: 'كوستا', spyWord: 'مقهى عالمي' },
    { word: 'نيرو', spyWord: 'مقهى عالمي' },
    { word: 'كافيه نيرو', spyWord: 'مقهى عالمي' },
    { word: 'بريت أ مانجيه', spyWord: 'مقهى عالمي' },
    { word: 'تيم هورتنز', spyWord: 'مقهى عالمي' },
    { word: 'لافازا', spyWord: 'مقهى عالمي' },
    { word: 'بول', spyWord: 'مقهى عالمي' },
    { word: 'كوفي بين', spyWord: 'مقهى عالمي' },
    { word: 'سيجافريدو', spyWord: 'مقهى عالمي' },
    { word: 'إيلي', spyWord: 'مقهى عالمي' },
    { word: 'باسيفيك كوفي', spyWord: 'مقهى عالمي' },
    { word: 'جلوريا جينز', spyWord: 'مقهى عالمي' },
    { word: 'كاريبو', spyWord: 'مقهى عالمي' },
    { word: 'بيتس', spyWord: 'مقهى عالمي' },
    
    // مقاهي محلية سعودية
    { word: 'جافا تايم', spyWord: 'مقهى محلي' },
    { word: 'بلاك كوفي', spyWord: 'مقهى محلي' },
    { word: 'دوز', spyWord: 'مقهى محلي' },
    { word: 'كوفي دي', spyWord: 'مقهى محلي' },
    { word: 'برو كوفي', spyWord: 'مقهى محلي' },
    { word: 'كوفي لاب', spyWord: 'مقهى محلي' },
    { word: 'كوفي روستر', spyWord: 'مقهى محلي' },
    { word: 'ذا كوفي هاوس', spyWord: 'مقهى محلي' },
    { word: 'كوفي بار', spyWord: 'مقهى محلي' },
    { word: 'كوفي سنترال', spyWord: 'مقهى محلي' },
    { word: 'كوفي كورنر', spyWord: 'مقهى محلي' },
    { word: 'كوفي شوب', spyWord: 'مقهى محلي' },
    { word: 'كوفي لاونج', spyWord: 'مقهى محلي' },
    { word: 'كوفي بلس', spyWord: 'مقهى محلي' },
    { word: 'كوفي تايم', spyWord: 'مقهى محلي' },
    { word: 'كوفي ستيشن', spyWord: 'مقهى محلي' },
    { word: 'كوفي سبوت', spyWord: 'مقهى محلي' },
    { word: 'كوفي بريك', spyWord: 'مقهى محلي' },
    { word: 'كوفي زون', spyWord: 'مقهى محلي' },
    { word: 'كوفي بلاس', spyWord: 'مقهى محلي' },
    { word: 'كوفي لايف', spyWord: 'مقهى محلي' },
    
    // مقاهي تركية وعربية
    { word: 'كافيه باتيسري', spyWord: 'مقهى تركي' },
    { word: 'كافيه بلس', spyWord: 'مقهى تركي' },
    { word: 'مندولين', spyWord: 'مقهى تركي' },
    { word: 'كافيه لاتيه', spyWord: 'مقهى عربي' },
    { word: 'كافيه موكا', spyWord: 'مقهى عربي' },
    { word: 'كافيه أرابيكا', spyWord: 'مقهى عربي' },
    { word: 'كافيه اسبريسو', spyWord: 'مقهى عربي' },
    
    // مقاهي متخصصة
    { word: 'بلو بوتل', spyWord: 'مقهى متخصص' },
    { word: 'إنتليجنسيا', spyWord: 'مقهى متخصص' },
    { word: 'ستامبتاون', spyWord: 'مقهى متخصص' },
    { word: 'كاونتر كلتشر', spyWord: 'مقهى متخصص' },
    { word: 'فيلز', spyWord: 'مقهى متخصص' },
    { word: 'لا كولومب', spyWord: 'مقهى متخصص' },
    { word: 'جو كوفي', spyWord: 'مقهى متخصص' },
    
    // مقاهي شاي
    { word: 'ديفيدز تي', spyWord: 'مقهى شاي' },
    { word: 'تي دبليو جي', spyWord: 'مقهى شاي' },
    { word: 'تي بار', spyWord: 'مقهى شاي' },
    { word: 'تي هاوس', spyWord: 'مقهى شاي' },
    { word: 'تي لاونج', spyWord: 'مقهى شاي' },
    { word: 'تي روم', spyWord: 'مقهى شاي' },
    { word: 'تي سبوت', spyWord: 'مقهى شاي' },
    { word: 'تي تايم', spyWord: 'مقهى شاي' },
    
    // مقاهي عصائر
    { word: 'جامبا جوس', spyWord: 'مقهى عصائر' },
    { word: 'بوست', spyWord: 'مقهى عصائر' },
    { word: 'سموثي كينج', spyWord: 'مقهى عصائر' },
    { word: 'جوس بار', spyWord: 'مقهى عصائر' },
    { word: 'فريش', spyWord: 'مقهى عصائر' },
    { word: 'عصير تايم', spyWord: 'مقهى عصائر' },
    { word: 'فروت بار', spyWord: 'مقهى عصائر' },
    { word: 'سموثي بار', spyWord: 'مقهى عصائر' }
  ]
};

// ============================================
// حالة اللعبة
// ============================================
const rooms = new Map();
const players = new Map();

// ============================================
// نظام مكافحة السبام (Anti-Spam System)
// ============================================
const spamRecords = new Map(); // سجل المخالفات لكل لاعب

// ثوابت نظام السبام
const SPAM_CONFIG = {
  // عدد الرسائل للكشف عن السبام
  MESSAGE_THRESHOLD: 5,
  // النافذة الزمنية للمخالفة الأولى (10 ثواني - أكثر واقعية)
  FIRST_VIOLATION_WINDOW: 10000,
  // النافذة الزمنية للمخالفات التالية (15 ثانية)
  SUBSEQUENT_VIOLATION_WINDOW: 15000,
  // مدة العقوبات بالميلي ثانية
  PENALTIES: {
    1: 30 * 1000,           // 30 ثانية
    2: 3 * 60 * 1000,       // 3 دقائق
    3: 24 * 60 * 60 * 1000, // 24 ساعة
    4: 7 * 24 * 60 * 60 * 1000 // أسبوع
  },
  // رسائل العقوبات
  PENALTY_MESSAGES: {
    1: 'نظام ساهر للرسائل رصدك… خفف السرعة وارجع بعد 30 ثانية.',
    2: 'هدي اللعب… محد لاحق يقرا أصلاً. جرب ترجع بعد 3 دقايق.',
    3: 'تراك مزعج رسمي… خذلك 24 ساعة راحة وفكّنا شوي.',
    4: 'نبّهناك ثلاث مرات… بس واضح إن أصابعك أسرع من عقلك. خذلك أسبوع عقاب.'
  },
  // مدة إعادة التصفير (أسبوع)
  RESET_PERIOD: 7 * 24 * 60 * 60 * 1000
};

/**
 * الحصول على سجل المخالفات للاعب أو إنشاء سجل جديد
 * @param {string} userId - معرف اللاعب
 * @returns {object} سجل المخالفات
 */
function getSpamRecord(userId) {
  if (!spamRecords.has(userId)) {
    spamRecords.set(userId, {
      violations: 0,           // عدد المخالفات
      lastViolationTime: 0,    // وقت آخر مخالفة
      banEndTime: 0,           // وقت انتهاء الحظر
      messageTimes: [],        // أوقات الرسائل الأخيرة
      lastCleanBehavior: Date.now() // وقت آخر سلوك نظيف
    });
  }
  return spamRecords.get(userId);
}

/**
 * فحص وتحديث حالة إعادة التصفير
 * @param {object} record - سجل المخالفات
 */
function checkAndResetRecord(record) {
  const now = Date.now();
  
  // إذا مر أسبوع على آخر سلوك نظيف بدون مخالفات
  if (record.violations > 0 && 
      record.banEndTime < now && 
      (now - record.lastCleanBehavior) >= SPAM_CONFIG.RESET_PERIOD) {
    // إعادة تصفير السجل
    record.violations = 0;
    record.lastViolationTime = 0;
    record.banEndTime = 0;
    record.messageTimes = [];
    console.log(`🔄 تم إعادة تصفير سجل المخالفات للاعب`);
  }
}

/**
 * فحص إذا كان اللاعب محظوراً حالياً
 * @param {string} userId - معرف اللاعب
 * @returns {object} {isBanned, message, remainingTime}
 */
function checkBanStatus(userId) {
  const record = getSpamRecord(userId);
  const now = Date.now();
  
  if (record.banEndTime > now) {
    const remainingTime = record.banEndTime - now;
    return {
      isBanned: true,
      message: SPAM_CONFIG.PENALTY_MESSAGES[record.violations] || 'أنت محظور من الكتابة.',
      remainingTime: remainingTime
    };
  }
  
  return { isBanned: false };
}

/**
 * فحص وتطبيق عقوبة السبام
 * @param {string} userId - معرف اللاعب
 * @returns {object} {isSpam, penaltyApplied, penaltyLevel, message, banEndTime}
 */
function checkAndHandleSpam(userId) {
  const record = getSpamRecord(userId);
  const now = Date.now();
  
  // إضافة وقت الرسالة الحالية
  record.messageTimes.push(now);
  
  // تنظيف الأوقات القديمة
  const windowTime = record.violations === 0 ? SPAM_CONFIG.FIRST_VIOLATION_WINDOW : SPAM_CONFIG.SUBSEQUENT_VIOLATION_WINDOW;
  record.messageTimes = record.messageTimes.filter(time => now - time < windowTime);
  
  // فحص إذا تم تجاوز الحد
  if (record.messageTimes.length > SPAM_CONFIG.MESSAGE_THRESHOLD) {
    record.violations++;
    record.lastViolationTime = now;
    record.banEndTime = now + SPAM_CONFIG.PENALTIES[Math.min(record.violations, 4)];
    record.messageTimes = [];
    
    return {
      isSpam: true,
      penaltyApplied: true,
      penaltyLevel: Math.min(record.violations, 4),
      message: SPAM_CONFIG.PENALTY_MESSAGES[Math.min(record.violations, 4)],
      banEndTime: record.banEndTime
    };
  }
  
  // تحديث وقت السلوك النظيف
  record.lastCleanBehavior = now;
  
  return { isSpam: false, penaltyApplied: false };
}

// ============================================
// دوال مساعدة
// ============================================

function generateRoomCode() {
  return randomBytes(3).toString('hex').toUpperCase().slice(0, 6);
}

/**
 * إرسال رسالة لاعب معين
 * @param {string} userId - معرف اللاعب
 * @param {string} event - نوع الحدث
 * @param {object} data - بيانات الحدث
 * @param {WebSocket} ws - اتصال WebSocket (اختياري)
 */
function sendToPlayer(userId, event, data, ws = null) {
  try {
    const player = players.get(userId);
    const socket = ws || (player ? player.ws : null);
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ event, data }));
    } else if (!socket) {
      console.warn(`⚠️ لا يوجد اتصال نشط للاعب ${userId}`);
    }
  } catch (error) {
    console.error(`❌ خطأ في إرسال رسالة للاعب ${userId}:`, error);
  }
}

/**
 * بث رسالة لجميع لاعبي الغرفة
 * @param {string} roomId 
 * @param {string} event 
 * @param {object} data
 */
function broadcastToRoom(roomId, event, data) {
  try {
    const room = rooms.get(roomId);
    if (room) {
      room.players.forEach(userId => {
        sendToPlayer(userId, event, data);
      });
    }
  } catch (error) {
    console.error(`❌ خطأ في بث الرسالة:`, error);
  }
}

/**
 * الحصول على قائمة اللاعبين في الغرفة
 * @param {string} roomId 
 * @returns {Array<object>}
 */
function getPlayersInRoom(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    return room.players
      .map(userId => {
        const player = players.get(userId);
        // ✅ فحص null قبل استخدام player
        if (!player) {
          console.warn(`⚠️ لاعب غير موجود: ${userId}`);
          return null;
        }
        return {
          id: userId,
          name: player.name,
          isSpy: player.isSpy,
          isCreator: player.isCreator,
          votes: room.votes.filter(v => v.targetId === userId).length,
          isChallenged: room.challenge && room.challenge.spyId === userId,
          isConnected: player.isConnected || false // ✅ حالة الاتصال
        };
      })
      .filter(p => p !== null); // ✅ إزالة القيم null
  }
  return [];
}

/**
 * اختيار كلمة عشوائية للمندس واللاعبين العاديين
 * المندس يحصل على كلمة مختلفة تماماً عن اللاعبين العاديين
 * @param {string} category 
 * @returns {{word: string, spyWord: string}}
 */
function selectRandomWord(category) {
  const categoryWords = words[category];
  if (!categoryWords || categoryWords.length < 2) {
    return { word: 'كلمة عادية', spyWord: 'كلمة مختلفة' };
  }

  // اختيار كلمة للاعبين العاديين
  const randomIndex = Math.floor(Math.random() * categoryWords.length);
  const normalWordObject = categoryWords[randomIndex];
  const normalWord = normalWordObject.word;

	  // اختيار كلمة مختلفة للمندس، مع تفضيل الكلمات ذات الوصف المختلف تماماً (برا السالفة)
	  const similarWords = categoryWords.filter(w => w.spyWord === normalWordObject.spyWord && w.word !== normalWord);
	  const otherWords = categoryWords.filter(w => w.spyWord !== normalWordObject.spyWord);

	  let spyWord;

	  if (otherWords.length > 0) {
	    // الأولوية القصوى: اختيار كلمة المندس من الكلمات ذات الوصف المختلف (برا السالفة)
	    const spyWordIndex = Math.floor(Math.random() * otherWords.length);
	    spyWord = otherWords[spyWordIndex].word;
	  } else if (similarWords.length > 0) {
	    // الأولوية الثانية (احتياطي): إذا كانت القائمة الثانية فارغة، يتم الاختيار من الكلمات المشابهة في الوصف
	    const spyWordIndex = Math.floor(Math.random() * similarWords.length);
	    spyWord = similarWords[spyWordIndex].word;
	  } else {
	    // الحل الأخير: إذا كانت كلتا القائمتين فارغة، يتم اختيار أي كلمة أخرى بشكل عشوائي من القسم
	    let spyWordIndex;
	    do {
	      spyWordIndex = Math.floor(Math.random() * categoryWords.length);
	    } while (spyWordIndex === randomIndex && categoryWords.length > 1);
	    spyWord = categoryWords[spyWordIndex].word;
	  }

	  return { word: normalWord, spyWord: spyWord };
}

/**
 * توليد تحدي الكلمات للمندس
 * @param {string} category 
 * @param {string} correctWord 
 * @returns {Array<string>}
 */
	function generateChallengeWords(category, correctWord) {
	  const categoryWords = words[category];
	  if (!categoryWords) return [correctWord];
	
	  // 1. تحديد الفئة الوصفية (spyWord) للكلمة الصحيحة
	  const correctWordObject = categoryWords.find(w => w.word === correctWord);
	  const correctSpyWord = correctWordObject ? correctWordObject.spyWord : null;
	
	  let incorrectWords = [];
	
	  if (correctSpyWord) {
	    // 2. تجميع الكلمات التي تشترك في نفس الفئة الوصفية (spyWord)
	    const similarWords = categoryWords
	      .filter(w => w.spyWord === correctSpyWord && w.word !== correctWord)
	      .map(w => w.word);
	      
	    // 3. تجميع الكلمات الأخرى من نفس الفئة (category)
	    const otherWords = categoryWords
	      .filter(w => w.spyWord !== correctSpyWord && w.word !== correctWord)
	      .map(w => w.word);
	      
	    // 4. اختيار الكلمات الخاطئة: نفضل الكلمات المشابهة أولاً
	    const shuffledSimilar = similarWords.sort(() => 0.5 - Math.random());
	    const shuffledOther = otherWords.sort(() => 0.5 - Math.random());
	    
	    // نأخذ ما يصل إلى 5 كلمات مشابهة
	    const similarCount = Math.min(5, shuffledSimilar.length);
	    incorrectWords.push(...shuffledSimilar.slice(0, similarCount));
	    
	    // نكمل العدد المتبقي (7 - similarCount) من الكلمات الأخرى
	    const remainingCount = 7 - incorrectWords.length;
	    incorrectWords.push(...shuffledOther.slice(0, remainingCount));
	    
	    // إذا لم نصل إلى 7 كلمات، نأخذ ما تبقى من الكلمات المشابهة (إذا كان هناك المزيد)
	    if (incorrectWords.length < 7) {
	      const moreSimilar = shuffledSimilar.slice(similarCount);
	      incorrectWords.push(...moreSimilar.slice(0, 7 - incorrectWords.length));
	    }
	    
	    // إذا لم نصل إلى 7 كلمات، نأخذ ما تبقى من الكلمات الأخرى (إذا كان هناك المزيد)
	    if (incorrectWords.length < 7) {
	      const moreOther = shuffledOther.slice(remainingCount);
	      incorrectWords.push(...moreOther.slice(0, 7 - incorrectWords.length));
	    }
	    
	    // إذا لم نصل إلى 7 كلمات بعد، نأخذ أي كلمات أخرى من الفئات الأخرى (للتأكد من وجود 7)
	    // (هذا الجزء غير مطلوب حالياً لأن الكلمات مأخوذة من نفس الفئة، ولكن يمكن إضافته كاحتياط)
	    
	  } else {
	    // إذا لم نجد فئة وصفية، نعود للمنطق القديم (اختيار 7 كلمات عشوائية من نفس الفئة)
	    const allWords = categoryWords.map(w => w.word);
	    const allIncorrect = allWords.filter(w => w !== correctWord);
	    const shuffledIncorrect = allIncorrect.sort(() => 0.5 - Math.random());
	    incorrectWords = shuffledIncorrect.slice(0, 7);
	  }
	  
	  // التأكد من أن لدينا 7 كلمات خاطئة على الأكثر
  if (incorrectWords.length === 0) {
    incorrectWords = [correctWord + "_fake"];
  }

	  incorrectWords = incorrectWords.slice(0, 7);
	  
	  // إضافة الكلمة الصحيحة
	  const challengeWords = [...incorrectWords, correctWord];
	  
	  // خلط الكلمات
	  return challengeWords.sort(() => 0.5 - Math.random());
	}

// ============================================
// معالجات الأحداث
// ============================================

function handleCreateRoom(ws, userId, data) {
  const { displayName, roomName, category, isPrivate } = data;
  
  // فلترة الأسماء
  if (!displayName || displayName.trim().length === 0) {
    return sendToPlayer(userId, 'error', { message: 'يجب إدخال اسم صحيح.' });
  }
  
  if (displayName.trim().length > 20) {
    return sendToPlayer(userId, 'error', { message: 'الاسم طويل جداً (الحد الأقصى 20 حرف).' });
  }
  
  // لا حاجة لفحص الأسماء المكررة عالمياً، فقط في الغرفة (تمت إزالته لإصلاح مشكلة التعليق)
  
  if (!roomName || !category) {
    return sendToPlayer(userId, 'error', { message: 'بيانات الغرفة غير كاملة.' });
  }
  
  // ✅ فحص: إذا كان اللاعب موجودًا بالفعل (منقطع) في غرفة، عامله كـ reconnect
  const existingPlayer = players.get(userId);
  if (existingPlayer && existingPlayer.roomId && !existingPlayer.ws) {
    console.log(`🔄 اللاعب ${userId} موجود بالفعل في غرفة أخرى، معاملته كإعادة اتصال`);
    return handleReconnect(ws, userId, { userId, roomId: existingPlayer.roomId });
  }

  let roomCode;
  do {
    roomCode = generateRoomCode();
  } while (Array.from(rooms.values()).some(r => r.roomCode === roomCode));

  const roomId = uuidv4();
  const newRoom = {
    id: roomId,
    roomCode,
    name: roomName,
    category,
    isPrivate: isPrivate || false,
    players: [userId],
    gameState: 'waiting', // waiting, inGame, voting, challenge
    currentRound: 0,
    currentWord: null,
    spyWord: null,
    spyId: null,
    currentPlayerIndex: 0,
    votes: [],
    challenge: null,
    maxPlayers: 10,
    questionTimer: null,
    votingTimer: null,
    challengeTimer: null,
    timerStartTime: null,
    timerDuration: null,
    currentQuestion: 1,
    skipToVotingAttempts: 0
  };
  rooms.set(roomId, newRoom);

  players.set(userId, {
    ws,
    name: displayName,
    roomId,
    isSpy: false,
    isCreator: true,
    hasVoted: false,
    isConnected: true
  });

  sendToPlayer(userId, 'roomCreated', {
    userId: userId,
    roomId: roomId,
    roomCode,
    creatorId: userId,
    players: getPlayersInRoom(roomId)
  });
  console.log(`✅ تم إنشاء غرفة: ${roomCode} بواسطة ${displayName} (${userId})`);
}

function handleJoinRoom(ws, userId, data) {
  const { displayName, roomCode } = data;
  
  // فلترة الأسماء
  if (!displayName || displayName.trim().length === 0) {
    return sendToPlayer(userId, 'error', { message: 'يجب إدخال اسم صحيح.' }, ws);
  }
  
  if (displayName.trim().length > 20) {
    return sendToPlayer(userId, 'error', { message: 'الاسم طويل جداً (الحد الأقصى 20 حرف).' }, ws);
  }
  
  if (!roomCode) {
    return sendToPlayer(userId, 'error', { message: 'بيانات الانضمام غير كاملة.' }, ws);
  }

  const room = Array.from(rooms.values()).find(r => r.roomCode === roomCode);
  if (!room) {
    return sendToPlayer(userId, 'error', { message: 'رمز الغرفة غير صحيح.' }, ws);
  }
  
  // ✅ فحص: إذا كان اللاعب موجودًا بالفعل (منقطع)، عامله كـ reconnect
  const existingPlayer = players.get(userId);
  if (existingPlayer && existingPlayer.roomId === room.id && !existingPlayer.ws) {
    console.log(`🔄 اللاعب ${userId} موجود بالفعل في الغرفة، معاملته كإعادة اتصال`);
    return handleReconnect(ws, userId, { userId, roomId: room.id });
  }
  if (room.gameState !== 'waiting') {
    return sendToPlayer(userId, 'error', { message: 'اللعبة بدأت بالفعل.' }, ws);
  }
  if (room.players.length >= room.maxPlayers) {
    return sendToPlayer(userId, 'error', { message: 'الغرفة ممتلئة.' }, ws);
  }
  if (room.players.includes(userId)) {
    return sendToPlayer(userId, 'error', { message: 'أنت بالفعل في هذه الغرفة.' }, ws);
  }
  
  const roomPlayerNames = room.players.map(pid => players.get(pid)?.name.toLowerCase()).filter(Boolean);
  const existingPlayerWithName = room.players.find(pid => players.get(pid)?.name.toLowerCase() === displayName.trim().toLowerCase());
  
  if (existingPlayerWithName) {
    // ✅ منع اللاعب الجديد من الدخول إذا كان الاسم محجوزاً، بدلاً من طرد اللاعب الموجود
    sendToPlayer(userId, 'error', { message: 'غير اسمك او الغرفة محجوز الاسم بالغرفة الحالية' }, ws);
    return;
  }

  room.players.push(userId);
  rooms.set(room.id, room);

  players.set(userId, {
    ws,
    name: displayName,
    roomId: room.id,
    isSpy: false,
    isCreator: false,
    hasVoted: false,
    isConnected: true
  });

  sendToPlayer(userId, 'joinedRoom', {
    userId: userId,
    roomId: room.id,
    roomCode: room.roomCode,
    creatorId: players.get(room.players[0]).isCreator ? room.players[0] : null,
    players: getPlayersInRoom(room.id)
  });
  
  broadcastToRoom(room.id, 'playerJoined', {
    players: getPlayersInRoom(room.id)
  });
  console.log(`✅ انضمام: ${displayName} (${userId}) إلى الغرفة ${room.roomCode}`);
}

function handleRequestNewRound(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room) return sendToPlayer(userId, 'error', { message: 'أنت لست في غرفة.' });
  // ✅ Fix #9: Check if the player is the room creator
  if (!players.get(userId)?.isCreator) {
    return sendToPlayer(userId, 'error', { message: 'فقط منشئ الغرفة يمكنه طلب جولة جديدة.' });
  }

  if (room.gameState !== 'finished') return sendToPlayer(userId, 'error', { message: 'لا يمكن بدء جولة جديدة الآن.' });

  
  // إرسال طلب تصويت لجميع اللاعبين غير المنشئ
  room.newRoundVotes = { accept: 0, reject: 0, total: room.players.length - 1, voters: new Set() };
  
  room.players.forEach(pid => {
    if (pid !== userId) {
      sendToPlayer(pid, 'newRoundVoteRequest', {});
    }
  });
  
  console.log(`📢 طلب جولة جديدة في الغرفة ${room.roomCode}`);
}

function handleVoteNewRound(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room || !room.newRoundVotes) return;
  
  const { accept } = data;
  
  // منع التصويت المكرر
  if (room.newRoundVotes.voters.has(userId)) return;
  room.newRoundVotes.voters.add(userId);
  
  if (accept) {
    room.newRoundVotes.accept++;
  } else {
    room.newRoundVotes.reject++;
    // إذا رفض أحد، إنهاء التصويت وإخراج الرافضين
    broadcastToRoom(room.id, 'newRoundRejected', {});
    delete room.newRoundVotes;
    console.log(`❌ تم رفض الجولة الجديدة في الغرفة ${room.roomCode}`);
    return;
  }
  
  // التحقق من اكتمال التصويت
  if (room.newRoundVotes.voters.size === room.newRoundVotes.total) {
    if (room.newRoundVotes.accept === room.newRoundVotes.total) {
      // الجميع وافق، بدء جولة جديدة
      console.log(`✅ تم قبول الجولة الجديدة في الغرفة ${room.roomCode}`);
      startNewRound(room);
    }
    delete room.newRoundVotes;
  }
}

function startNewRound(room) {
  // ✅ حذف اللاعبين غير المتصلين عند بدء جولة جديدة
  const disconnectedPlayers = room.players.filter(pid => {
    const p = players.get(pid);
    return p && !p.isConnected;
  });
  
  disconnectedPlayers.forEach(pid => {
    room.players = room.players.filter(id => id !== pid);
    players.delete(pid);
    console.log(`🗑️ تم حذف اللاعب غير المتصل عند بدء جولة جديدة.`);
  });
  
  // إعادة تهيئة الجولة بنفس اللاعبين
  room.gameState = 'inGame';
  room.currentRound = (room.currentRound || 0) + 1;
  room.votes = [];
  room.challenge = null;
  
  // اختيار الكلمات
  const { word, spyWord } = selectRandomWord(room.category);
  room.currentWord = word;
  room.spyWord = spyWord;

  // اختيار المندس
  const spyIndex = Math.floor(Math.random() * room.players.length);
  room.spyId = room.players[spyIndex];

  // تحديد دور السؤال الأول
  room.currentPlayerIndex = Math.floor(Math.random() * room.players.length);

  // إرسال حالة اللعبة للاعبين
  room.players.forEach(pid => {
    const player = players.get(pid);
    player.isSpy = (pid === room.spyId);
    player.hasVoted = false;
    
    const wordToSend = player.isSpy ? room.spyWord : room.currentWord;
    
    sendToPlayer(pid, 'gameStarted', {
      word: wordToSend,
      isSpy: player.isSpy,
      players: getPlayersInRoom(room.id),
      currentPlayer: room.players[room.currentPlayerIndex],
      timerDuration: 120
    });
  });
  
  // بدء مؤقت السؤال الأول
  startQuestionTimer(room);
  
  rooms.set(room.id, room);
  console.log(`🔄 بدء جولة جديدة في الغرفة ${room.roomCode}. المندس: ${players.get(room.spyId).name}`);
}

// دالة بدء مؤقت السؤال (2 دقيقة)
function startQuestionTimer(room) {
  const QUESTION_TIMEOUT = 120000; // 2 دقيقة
  
  // إلغاء المؤقت السابق إن وجد
  if (room.questionTimer) {
    clearTimeout(room.questionTimer);
  }
  
  // ✅ تتبع وقت بدء المؤقت ومدته
  room.timerStartTime = Date.now();
  room.timerDuration = QUESTION_TIMEOUT / 1000; // بالثواني
  
  room.questionTimer = setTimeout(() => {
    // انتهى الوقت، الانتقال تلقائياً للسؤال التالي
    if (room.gameState !== 'inGame') return;
    
    // تسجيل أن اللاعب الحالي قد سأل
    if (!room.playersAsked) {
      room.playersAsked = new Set();
    }
    const currentPlayerId = room.players[room.currentPlayerIndex];
    room.playersAsked.add(currentPlayerId);
    
    // إرسال إشعار للجميع
    broadcastToRoom(room.id, 'questionTimeout', {
      playerName: players.get(currentPlayerId)?.name
    });
    
    // ✅ الانتقال للاعب المتصل التالي
    let nextIndex = (room.currentPlayerIndex + 1) % room.players.length;
    let nextPlayer = players.get(room.players[nextIndex]);
    let attempts = 0;
    
    // البحث عن أول لاعب متصل
    while ((!nextPlayer || !nextPlayer.isConnected) && attempts < room.players.length) {
      nextIndex = (nextIndex + 1) % room.players.length;
      nextPlayer = players.get(room.players[nextIndex]);
      attempts++;
    }
    
    room.currentPlayerIndex = nextIndex;
    
    // ✅ التحقق من أن جميع اللاعبين المتصلين قد سألوا
    const connectedPlayersCount = room.players.filter(pid => {
      const p = players.get(pid);
      return p && p.isConnected;
    }).length;
    
    room.currentQuestion++;
    
    if (room.currentQuestion >= 20) {
      // نهاية مرحلة الأسئلة، الانتقال للتصويت
      
      // ✅ حذف اللاعبين المنقطعين من القائمة
      const disconnectedPlayers = room.players.filter(pid => {
        const p = players.get(pid);
        return p && !p.isConnected;
      });
      
      disconnectedPlayers.forEach(pid => {
        room.players = room.players.filter(id => id !== pid);
        players.delete(pid);
        console.log(`🗑️ تم حذف اللاعب غير المتصل عند الانتقال للتصويت.`);
      });
      
      room.gameState = 'voting';
      room.playersAsked = new Set();
      broadcastToRoom(room.id, 'votingPhase', { players: getPlayersInRoom(room.id) });
      console.log(`🗳️ الغرفة ${room.roomCode} دخلت مرحلة التصويت بعد انتهاء الوقت.`);
    } else {
      broadcastToRoom(room.id, 'nextQuestion', {
        currentPlayer: room.players[room.currentPlayerIndex],
        currentQuestion: room.currentQuestion
      });
      
      // بدء مؤقت جديد
      startQuestionTimer(room);
    }
    
    rooms.set(room.id, room);
  }, QUESTION_TIMEOUT);
}

function handleStartGame(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room) return sendToPlayer(userId, 'error', { message: 'أنت لست في غرفة.' });
  // ✅ Fix #7: Check minimum players (at least 3 players for Spy game)
  if (room.players.length < 3) {
    return sendToPlayer(userId, 'error', { message: 'يتطلب بدء اللعبة 3 لاعبين على الأقل.' });
  }
  // ✅ Fix #6: Check if game is already running (redundant check, but good practice)
  if (room.gameState !== 'waiting') {
    return sendToPlayer(userId, 'error', { message: 'اللعبة بدأت بالفعل أو في حالة أخرى.' });
  }
  if (!players.get(userId).isCreator) return sendToPlayer(userId, 'error', { message: 'فقط منشئ الغرفة يمكنه بدء اللعبة.' });

  // ✅ حذف اللاعبين غير المتصلين عند بدء اللعبة
  const disconnectedPlayers = room.players.filter(pid => {
    const p = players.get(pid);
    return p && !p.isConnected;
  });
  
  disconnectedPlayers.forEach(pid => {
    room.players = room.players.filter(id => id !== pid);
    players.delete(pid);
    console.log(`🗑️ تم حذف اللاعب غير المتصل عند بدء اللعبة.`);
  });
  
  room.gameState = 'inGame';
  room.currentRound = 1;
  room.votes = [];
  room.challenge = null;
  room.currentQuestion = 1;
  room.skipToVotingAttempts = 0;
  
  // اختيار الكلمات
  const { word, spyWord } = selectRandomWord(room.category);
  room.currentWord = word;
  room.spyWord = spyWord;

  // اختيار المندس
  const spyIndex = Math.floor(Math.random() * room.players.length);
  room.spyId = room.players[spyIndex];

  // تحديد دور السؤال الأول
  room.currentPlayerIndex = Math.floor(Math.random() * room.players.length);

  // إرسال حالة اللعبة للاعبين
  room.players.forEach(pid => {
    const player = players.get(pid);
    player.isSpy = (pid === room.spyId);
    player.hasVoted = false;
    
    const wordToSend = player.isSpy ? room.spyWord : room.currentWord;
    
    sendToPlayer(pid, 'gameStarted', {
      word: wordToSend,
      isSpy: player.isSpy,
      players: getPlayersInRoom(room.id),
      currentPlayer: room.players[room.currentPlayerIndex],
      timerDuration: 120
    });
  });
  
  // بدء مؤقت السؤال الأول
  startQuestionTimer(room);
  
  rooms.set(room.id, room);
  console.log(`✅ بدء اللعبة في الغرفة ${room.roomCode}. المندس: ${players.get(room.spyId).name}`);
}

function handleFinishQuestion(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  const player = players.get(userId);
  if (!room || room.gameState !== 'inGame' || !player) return;
  
  // التأكد من أن اللاعب الحالي هو من ينهي السؤال
  if (room.players[room.currentPlayerIndex] !== userId) {
    return sendToPlayer(userId, 'error', { message: 'ليس دورك لإنهاء السؤال.' });
  }
  
  // إلغاء المؤقت الحالي
  if (room.questionTimer) {
    clearTimeout(room.questionTimer);
  }
  
  // تسجيل أن اللاعب قد سأل
  if (!room.playersAsked) {
    room.playersAsked = new Set();
  }
  room.playersAsked.add(userId);
  
  // الانتقال للاعب التالي
  let nextIndex = (room.currentPlayerIndex + 1) % room.players.length;
  let nextPlayer = players.get(room.players[nextIndex]);
  let attempts = 0;
  
  // البحث عن أول لاعب متصل
  while ((!nextPlayer || !nextPlayer.isConnected) && attempts < room.players.length) {
    nextIndex = (nextIndex + 1) % room.players.length;
    nextPlayer = players.get(room.players[nextIndex]);
    attempts++;
  }
  
  room.currentPlayerIndex = nextIndex;
  room.currentQuestion++;
  
  // التحقق من انتهاء الأسئلة
  if (room.currentQuestion >= 20) {
    // نهاية مرحلة الأسئلة، الانتقال للتصويت
    
    // ✅ حذف اللاعبين المنقطعين من القائمة
    const disconnectedPlayers = room.players.filter(pid => {
      const p = players.get(pid);
      return p && !p.isConnected;
    });
    
    disconnectedPlayers.forEach(pid => {
      room.players = room.players.filter(id => id !== pid);
      players.delete(pid);
      console.log(`🗑️ تم حذف اللاعب غير المتصل عند الانتقال للتصويت.`);
    });
    
    room.gameState = 'voting';
    room.playersAsked = new Set();
    broadcastToRoom(room.id, 'votingPhase', { players: getPlayersInRoom(room.id) });
    console.log(`🗳️ الغرفة ${room.roomCode} دخلت مرحلة التصويت.`);
  } else {
    broadcastToRoom(room.id, 'nextQuestion', {
      currentPlayer: room.players[room.currentPlayerIndex],
      currentQuestion: room.currentQuestion
    });
    
    // بدء مؤقت جديد
    startQuestionTimer(room);
  }
  
  rooms.set(room.id, room);
}

function handleSkipToVoting(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room) return sendToPlayer(userId, 'error', { message: 'أنت لست في غرفة.' });
  
  if (!players.get(userId).isCreator) {
    return sendToPlayer(userId, 'error', { message: 'فقط منشئ الغرفة يمكنه الانتقال للتصويت.' });
  }
  
  if (room.gameState !== 'inGame') {
    return sendToPlayer(userId, 'error', { message: 'لا يمكن الانتقال للتصويت الآن.' });
  }
  
  // إلغاء المؤقت الحالي
  if (room.questionTimer) {
    clearTimeout(room.questionTimer);
  }
  
  // ✅ حذف اللاعبين المنقطعين من القائمة
  const disconnectedPlayers = room.players.filter(pid => {
    const p = players.get(pid);
    return p && !p.isConnected;
  });
  
  disconnectedPlayers.forEach(pid => {
    room.players = room.players.filter(id => id !== pid);
    players.delete(pid);
    console.log(`🗑️ تم حذف اللاعب غير المتصل عند الانتقال للتصويت.`);
  });
  
  room.gameState = 'voting';
  room.playersAsked = new Set();
  broadcastToRoom(room.id, 'votingPhase', { players: getPlayersInRoom(room.id) });
  rooms.set(room.id, room);
  
  console.log(`⏭️ تم الانتقال للتصويت في الغرفة ${room.roomCode}.`);
}

function handleSkipToVotingAttempt(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room) return;
  
  if (!room.skipToVotingAttempts) {
    room.skipToVotingAttempts = 0;
  }
  
  room.skipToVotingAttempts++;
  
  const creatorId = room.players.find(pid => players.get(pid)?.isCreator);
  
  sendToPlayer(creatorId, 'skipToVotingAttempt', {
    playerName: players.get(userId)?.name,
    totalAttempts: room.skipToVotingAttempts
  });
}

function handleVote(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  const player = players.get(userId);
  if (!room || room.gameState !== 'voting' || !player) return;
  
  const { targetId } = data;
  
  // منع التصويت على النفس
  if (targetId === userId) {
    sendToPlayer(userId, 'error', { message: 'لا يمكنك التصويت على نفسك.' });
    return;
  }
  
  // منع التصويت المكرر
  if (room.votes.some(v => v.voterId === userId)) {
    return;
  }
  
  // تسجيل الصوت
  room.votes.push({
    voterId: userId,
    targetId: targetId,
    timestamp: Date.now()
  });
  
  player.hasVoted = true;
  
  // إرسال تحديث الأصوات
  broadcastToRoom(room.id, 'voteUpdate', {
    players: getPlayersInRoom(room.id)
  });
  
  // حساب عدد اللاعبين المتصلين
  const connectedPlayers = room.players.filter(pid => {
    const p = players.get(pid);
    return p && p.isConnected;
  });
  
  // التحقق من اكتمال التصويت (فقط من اللاعبين المتصلين)
  if (room.votes.length === connectedPlayers.length) {
    // إلغاء مؤقت التصويت
    if (room.votingTimer) {
      clearTimeout(room.votingTimer);
      room.votingTimer = null;
    }
    
    // حساب الأصوات
    const voteCounts = room.votes.reduce((acc, vote) => {
      acc[vote.targetId] = (acc[vote.targetId] || 0) + 1;
      return acc;
    }, {});
    
    const maxVotes = Math.max(...Object.values(voteCounts));
    const playersWithMaxVotes = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes);
    
    if (playersWithMaxVotes.length > 1) {
      room.gameState = 'finished';
      broadcastToRoom(room.id, 'roundResult', {
        winner: 'spy',
        word: room.currentWord,
        spyWord: room.spyWord,
        spyPlayer: players.get(room.spyId).name,
        isSpyEliminated: false,
        tie: true
      });
    } else {
      const mostVotedPlayer = playersWithMaxVotes[0];
      if (mostVotedPlayer === room.spyId) {
        room.gameState = 'challenge';
        const challengeWords = generateChallengeWords(room.category, room.currentWord);
        room.challenge = {
          spyId: room.spyId,
          words: challengeWords,
          correctWord: room.currentWord,
          spyAnswer: null,
          status: null
        };
        sendToPlayer(room.spyId, 'spyChallenge', { words: challengeWords });
        room.players.filter(pid => pid !== room.spyId).forEach(pid => {
          sendToPlayer(pid, 'waitingForChallenge', { spyName: players.get(room.spyId).name });
        });
        room.timerStartTime = Date.now();
        room.timerDuration = 120;
        room.challengeTimer = setTimeout(() => {
          if (room.gameState === 'challenge' && room.challenge && room.challenge.status === null) {
            room.challenge.status = 'timeout';
            room.gameState = 'finished';
            broadcastToRoom(room.id, 'roundResult', {
              winner: 'normal',
              word: room.currentWord,
              spyWord: room.spyWord,
              spyPlayer: players.get(room.spyId).name,
              isSpyEliminated: true,
              challenge: { status: 'timeout', chosenWord: null, correctWord: room.currentWord }
            });
          }
        }, 120000);
      } else {
        room.gameState = 'finished';
        broadcastToRoom(room.id, 'roundResult', {
          winner: 'spy',
          word: room.currentWord,
          spyWord: room.spyWord,
          spyPlayer: players.get(room.spyId).name,
          isSpyEliminated: false
        });
      }
    }
  }
  
  rooms.set(room.id, room);
}

function handleSpyChallengeAnswer(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room || room.gameState !== 'challenge' || room.spyId !== userId) return;
  
  const { chosenWord } = data;
  
  // ✅ إلغاء مؤقت التحدي
  if (room.challengeTimer) {
    clearTimeout(room.challengeTimer);
    room.challengeTimer = null;
  }
  
  room.challenge.spyAnswer = chosenWord;
  
  if (chosenWord === room.challenge.correctWord) {
    // المندس فاز بالتحدي
    room.challenge.status = 'win';
    room.gameState = 'finished';
    
    // ✅ حفظ النتائج لإعادة الاتصال
    room.lastResult = {
      winner: 'spy',
      word: room.currentWord,
      spyWord: room.spyWord,
      spyPlayer: players.get(room.spyId).name,
      isSpyEliminated: true,
      challenge: {
        status: 'win',
        chosenWord,
        correctWord: room.currentWord
      },
      players: getPlayersInRoom(room.id)
    };
    
    broadcastToRoom(room.id, 'roundResult', room.lastResult);
    console.log(`🎉 فاز المندس ${players.get(room.spyId).name} بتحدي الكلمات.`);
  } else {
    // المندس خسر التحدي
    room.challenge.status = 'lose';
    room.gameState = 'finished';
    
    // ✅ حفظ النتائج لإعادة الاتصال
    room.lastResult = {
      winner: 'normal',
      word: room.currentWord,
      spyWord: room.spyWord,
      spyPlayer: players.get(room.spyId).name,
      isSpyEliminated: true,
      challenge: {
        status: 'lose',
        chosenWord,
        correctWord: room.currentWord
      },
      players: getPlayersInRoom(room.id)
    };
    
    broadcastToRoom(room.id, 'roundResult', room.lastResult);
    console.log(`❌ خسر المندس ${players.get(room.spyId).name} تحدي الكلمات.`);
  }
  
  rooms.set(room.id, room);
}

function handleChatMessage(ws, userId, data) {
  const player = players.get(userId);
  if (!player || !player.roomId) {
    return sendToPlayer(userId, 'error', { message: 'أنت لست في غرفة.' });
  }
  
  const { message } = data;
  if (!message || message.trim() === '') return;
  
  // ============================================
  // فحص نظام مكافحة السبام
  // ============================================
  
  // 1. فحص إذا كان اللاعب محظوراً حالياً
  const banStatus = checkBanStatus(userId);
  if (banStatus.isBanned) {
    // إرسال رسالة الحظر للاعب فقط
    return sendToPlayer(userId, 'chatBanned', {
      message: banStatus.message,
      remainingTime: banStatus.remainingTime
    }, ws);
  }
  
  // 2. فحص السبام وتطبيق العقوبة إذا لزم
  const spamCheck = checkAndHandleSpam(userId);
  
  if (spamCheck.isSpam && spamCheck.penaltyApplied) {
    // إرسال رسالة العقوبة للاعب
    return sendToPlayer(userId, 'spamWarning', {
      message: spamCheck.message,
      penaltyLevel: spamCheck.penaltyLevel,
      banEndTime: spamCheck.banEndTime
    }, ws);
  }
  
  // ============================================
  // المعالجة العادية للرسالة
  // ============================================
  
  // فلترة الرموز الغريبة
  const filteredMessage = message.trim().replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, ''); // السماح بالحروف والأرقام وعلامات الترقيم والمسافات
  
  if (filteredMessage.length === 0) {
    return sendToPlayer(userId, 'error', { message: 'الرسالة تحتوي على رموز غير مدعومة.' }, ws);
  }
  
  if (filteredMessage.length > 200) {
    return sendToPlayer(userId, 'error', { message: 'الرسالة طويلة جداً (الحد الأقصى 200 حرف).' }, ws);
  }
  
  // إرسال الرسالة لجميع اللاعبين في الغرفة
  broadcastToRoom(player.roomId, 'chatMessage', {
    senderId: userId,
    senderName: player.name,
    message: message.trim(),
    timestamp: Date.now()
  });
  
  console.log(`💬 ${player.name} في الغرفة ${rooms.get(player.roomId).roomCode}: ${message.trim()}`);
}

function handleChangeName(ws, userId, data) {
  const player = players.get(userId);
  if (!player) return;
  
  const { newName } = data;
  
  // التحقق من الاسم (تمت الفلترة في الواجهة، لكن للتأكد)
  if (!newName || newName.length > 20) {
    return sendToPlayer(userId, 'error', { message: 'اسم غير صالح.' });
  }
  
  // التحقق من تكرار الاسم في الغرفة
  if (player.roomId) {
    const room = rooms.get(player.roomId);
    if (room) {
      const isNameTaken = room.players.some(pid => {
        const p = players.get(pid);
        return p && p.id !== userId && p.name === newName;
      });
      
      if (isNameTaken) {
        return sendToPlayer(userId, 'error', { message: `الاسم "${newName}" مستخدم بالفعل في هذه الغرفة.` });
      }
    }
  }
  
  const oldName = player.name;
  player.name = newName;
  
  // إرسال تحديث للاعب نفسه
  sendToPlayer(userId, 'nameChanged', { newName });
  
  // إرسال تحديث للغرفة
  if (player.roomId) {
    broadcastToRoom(player.roomId, 'nameChanged', {
      userId: userId,
      newName: newName,
      players: getPlayersInRoom(player.roomId)
    });
  }
  
  console.log(`✏️ تم تغيير اسم اللاعب ${oldName} إلى ${newName}`);
}

function handleLeaveRoom(ws, userId, data) {
  const player = players.get(userId);
  if (!player) return;
  
  const room = rooms.get(player.roomId);
  if (!room) return;
  
  // ✅ تحديث حالة الاتصال بدلاً من حذف اللاعب
  player.isConnected = false;
  player.ws = null;
  
  console.log(`👋 انقطع اتصال اللاعب ${player.name} (${userId}).`);
  
  // ✅ إرسال تحديث لجميع اللاعبين بأن اللاعب انقطع
  broadcastToRoom(room.id, 'playerDisconnected', {
    userId: userId,
    players: getPlayersInRoom(room.id)
  });
  
  // ✅ إدارة حالة اللعبة حسب المرحلة
  
  // 1️⃣ مرحلة الانتظار (waiting): يبقى في القائمة حتى يبدأ المنشئ اللعبة
  if (room.gameState === 'waiting') {
    // لا نفعل شيء، يبقى في القائمة
  }
    // 2️⃣ مرحلة اللعب (inGame): تخطي دوره إذا كان دوره، ويبقى في القائمة
  else if (room.gameState === 'inGame') {
    // ✅ إذا كان المندس انقطع، إلغاء اللعبة
    if (room.spyId === userId) {
      room.gameState = 'waiting';
      room.currentRound = 0;
      room.votes = [];
      room.challenge = null;
      room.playersAsked = new Set();
      
      // حذف المندس من القائمة
      room.players = room.players.filter(id => id !== userId);
      players.delete(userId);
      
      broadcastToRoom(room.id, 'gameReset', {
        message: 'سحب عليكم المندس',
        players: getPlayersInRoom(room.id)
      });
      
      console.log(`🚫 المندس ${player.name} انقطع، تم إلغاء اللعبة.`);
      rooms.set(room.id, room);
      return;
    }
    
    // إذا كان دور اللاعب المنقطع، ننتقل للاعب التالي
    if (room.players[room.currentPlayerIndex] === userId) {
      if (room.questionTimer) {
        clearTimeout(room.questionTimer);
        room.questionTimer = null;
      }
      
      // البحث عن اللاعب المتصل التالي
      const connectedPlayers = room.players.filter(pid => {
        const p = players.get(pid);
        return p && p.isConnected;
      });
      
      if (connectedPlayers.length === 0) {
        // لا يوجد لاعبون متصلون، ننهي اللعبة
        room.gameState = 'finished';
        broadcastToRoom(room.id, 'roundResult', {
          winner: 'none',
          word: room.currentWord,
          spyWord: room.spyWord,
          message: 'انتهت اللعبة لعدم وجود لاعبين متصلين.'
        });
      } else {
        // الانتقال للاعب المتصل التالي
        let nextIndex = (room.currentPlayerIndex + 1) % room.players.length;
        let nextPlayer = players.get(room.players[nextIndex]);
        let attempts = 0;
        
        // البحث عن اللاعب المتصل التالي
        while ((!nextPlayer || !nextPlayer.isConnected) && attempts < room.players.length) {
          nextIndex = (nextIndex + 1) % room.players.length;
          nextPlayer = players.get(room.players[nextIndex]);
          attempts++;
        }
        
        room.currentPlayerIndex = nextIndex;
        
        // بدء مؤقت جديد
        startQuestionTimer(room);
      }
    }
  }
  
  // 3️⃣ مرحلة التصويت (voting): لا نفعل شيء خاص، يبقى في القائمة
  else if (room.gameState === 'voting') {
    // لا نفعل شيء
  }
  
  // 4️⃣ مرحلة التحدي (challenge): لا نفعل شيء خاص، يبقى في القائمة
  else if (room.gameState === 'challenge') {
    // لا نفعل شيء
  }
  
  // 5️⃣ مرحلة النتائج (finished): لا نفعل شيء خاص، يبقى في القائمة
  else if (room.gameState === 'finished') {
    // لا نفعل شيء
  }
  
  rooms.set(room.id, room);
}

function handleDisconnect(userId) {
  const player = players.get(userId);
  if (!player) return;
  
  // حذف اللاعب من الغرفة إذا كان في واحدة
  if (player.roomId) {
    const room = rooms.get(player.roomId);
    if (room) {
      room.players = room.players.filter(id => id !== userId);
      
      // حذف الغرفة إذا كانت فارغة
      if (room.players.length === 0) {
        rooms.delete(room.id);
        console.log(`🗑️ حذف الغرفة الفارغة ${room.roomCode}`);
      } else {
        rooms.set(room.id, room);
      }
    }
  }
  
  players.delete(userId);
  console.log(`❌ حذف اللاعب ${userId} من النظام`);
}

/**
 * معالجة إعادة الاتصال
 * @param {WebSocket} ws - اتصال WebSocket
 * @param {string} userId - معرف اللاعب
 * @param {object} data - بيانات الرسالة
 */
function handleReconnect(ws, userId, data) {
  const { roomId } = data;
  let player = players.get(userId);
  
  // ✅ إذا كان اللاعب غير موجود، نحاول البحث عن غرفة به
  if (!player && roomId) {
    const room = rooms.get(roomId);
    if (room && room.players.includes(userId)) {
      // اللاعب موجود في الغرفة لكن ليس في قاعمة players - نعيد إنشاء بيانات اللاعب
      console.log(`⚠️ إعادة بناء بيانات اللاعب: ${userId}`);
      player = {
        id: userId,
        name: 'لاعب عائد',
        roomId: roomId,
        isSpy: false,
        isConnected: true,
        ws: ws,
        hasVoted: false,
        isCreator: false
      };
      players.set(userId, player);
    }
  }
  
  if (!player && !roomId) {
    // ✅ تأخير رسالة الخطأ 5 ثواني
    setTimeout(() => {
      sendToPlayer(userId, 'error', { message: 'انقطع الاتصال بالسيرفر. يرجى تحديث الصفحة.' }, ws);
    }, 5000);
    return;
  }
  
  if (!player || !roomId) {
    // ✅ جعل الخطأ صامتاً لتجنب إزعاج اللاعب، والسماح له بالدخول كلاعب جديد
    console.log(`⚠️ فشل إعادة الاتصال للاعب ${userId}: بيانات غير موجودة`);
    return;
  }
  
  const room = rooms.get(roomId);
  if (!room || !room.players.includes(userId)) {
    return sendToPlayer(userId, 'error', { message: 'الغرفة غير موجودة أو أنت لست فيها.' }, ws);
  }
  
  // ✅ إلغاء مؤقت إلغاء اللعبة للمندس (إذا رجع خلال 3 ثواني)
  if (player.spyDisconnectTimer) {
    clearTimeout(player.spyDisconnectTimer);
    player.spyDisconnectTimer = null;
    console.log(`✅ المندس ${player.name} رجع خلال المهلة - اللعبة تكمل عادي!`);
  }

  // تحديث الـ WebSocket وحالة الاتصال
  player.ws = ws;
  player.isConnected = true;
  
  // إرسال حالة اللاعب الحالية
  sendToPlayer(userId, 'reconnected', {
    userId: userId,
    roomId: player.roomId,
    roomCode: player.roomId ? rooms.get(player.roomId).roomCode : null,
    displayName: player.name
  });

  // إذا كان اللاعب في غرفة، نرسل له حالة الغرفة الحالية ونرسل تحديثاً للغرفة
  if (player.roomId) {
    const room = rooms.get(player.roomId);
    if (room) {
      // إرسال حالة اللعبة الحالية للاعب الذي أعاد الاتصال
      console.log(`📤 إرسال roomState لـ ${player.name}`);
      // ✅ حساب الوقت المتبقي للمؤقت
      let timerDurationRemaining = null;
      if (room.timerStartTime && room.timerDuration) {
        const elapsed = (Date.now() - room.timerStartTime) / 1000; // بالثواني
        timerDurationRemaining = Math.max(0, room.timerDuration - elapsed);
      }
      
      sendToPlayer(userId, 'roomState', {
        roomCode: room.roomCode,
        gameState: room.gameState,
        players: getPlayersInRoom(room.id),
        currentWord: player.isSpy ? room.spyWord : room.currentWord,
        isSpy: player.isSpy,
        currentPlayer: room.players[room.currentPlayerIndex],
        currentQuestion: room.currentQuestion,
        creatorId: room.players.find(pid => players.get(pid)?.isCreator) || room.players[0],
        timerDurationRemaining: timerDurationRemaining,
        votes: room.votes || [],
        hasVoted: player.hasVoted || false,
        lastResult: room.lastResult || null
      });
      
      // ✅ إرسال تحديث للغرفة بأن اللاعب عاد متصلاً - لكن بدون رسالة مزعجة
      broadcastToRoom(player.roomId, 'playerReconnected', {
        userId: userId,
        playerName: player.name,
        players: getPlayersInRoom(room.id)
      });
    }
  }
  
  console.log(`🔄 إعادة اتصال ناجحة: ${player.name} (${userId})`);
}

// ============================================
// WebSocket معالجات الاتصال
// ============================================
wss.on('connection', (ws) => {
  let userId = null; // ✅ لن نولد هوية جديدة فوراً، سننتظر أول رسالة
  let isFirstMessage = true;
  
  ws.on('error', (error) => {
    console.error(`❌ خطأ في WebSocket ${userId}:`, error);
    if (userId) handleDisconnect(userId);
  });

  ws.on('message', (message) => {
    try {
      let event, data;
      try {
        const parsed = JSON.parse(message);
        event = parsed.event;
        data = parsed.data || {};
      } catch (parseError) {
        console.error('❌ خطأ في تحليل JSON:', parseError);
        return;
      }
      
      // ✅ تحديد الهوية مبكراً من أول رسالة
      if (isFirstMessage) {
        isFirstMessage = false;
        
        // إذا كانت رسالة reconnect، نستخدم userId المرسل
        if (event === 'reconnect' && data.userId) {
          userId = data.userId;
          console.log(`🔄 محاولة إعادة اتصال بـ userId موجود: ${userId}`);
        } else {
          // إذا كانت رسالة عادية، نولد هوية جديدة
          userId = 'user-' + uuidv4();
          sendToPlayer(userId, 'setUserId', { userId: userId }, ws);
          console.log(`✅ اتصال WebSocket جديد: ${userId}`);
        }
      }
      
      console.log(`📨 رسالة من ${userId}: ${event}`, data);
      
      if (event === 'setUserId') {
        return;
      }
      
      switch (event) {
        case 'createRoom':
          handleCreateRoom(ws, userId, data);
          break;
        case 'joinRoom':
        case 'joinRoomByCode':
          handleJoinRoom(ws, userId, data);
          break;
        case 'changeName':
          handleChangeName(ws, userId, data);
          break;
        case 'reconnect':
          handleReconnect(ws, userId, data);
          break;
        case 'startGame':
          handleStartGame(ws, userId, data);
          break;
        case 'requestNewRound':
          handleRequestNewRound(ws, userId, data);
          break;
        case 'voteNewRound':
          handleVoteNewRound(ws, userId, data);
          break;
        case 'finishQuestion':
          handleFinishQuestion(ws, userId, data);
          break;
        case 'skipToVoting':
          handleSkipToVoting(ws, userId, data);
          break;
        case 'skipToVotingAttempt':
          handleSkipToVotingAttempt(ws, userId, data);
          break;
        case 'vote':
          handleVote(ws, userId, data);
          break;
        case 'spyChallengeAnswer':
          handleSpyChallengeAnswer(ws, userId, data);
          break;
        case 'leaveRoom':
          handleLeaveRoom(ws, userId, data);
          break;
        case 'chatMessage':
          handleChatMessage(ws, userId, data);
          break;
        case 'ping':
          sendToPlayer(userId, 'pong', {});
          break;
        default:
          console.log(`⚠️ حدث غير معالج: ${event}`);
      }
    } catch (error) {
      console.error('❌ خطأ في معالجة الرسالة:', error);
    }
  });
  
  ws.on('close', () => {
    const player = players.get(userId);
    if (player) {
      player.ws = null;
      player.isConnected = false; // ✅ تحديث حالة الاتصال
      
      // إذا كان اللاعب في غرفة، نرسل تحديثاً
      if (player.roomId) {
        const room = rooms.get(player.roomId);
        if (room) {
          // ✅ فحص إذا كان المندس انقطع في مرحلة اللعب
          if (room.spyId === userId && (room.gameState === 'inGame' || room.gameState === 'voting' || room.gameState === 'challenge')) {
            // ✅ إعطاء مهلة 3 ثواني للتفريق بين التحديث والانقطاع الحقيقي
            player.spyDisconnectTimer = setTimeout(() => {
              // إذا ما رجع خلال 3 ثواني، يعتبر انقطاع حقيقي
              const stillDisconnected = !player.ws;
              if (stillDisconnected) {
                // إلغاء اللعبة
                room.gameState = 'waiting';
                room.currentRound = 0;
                room.votes = [];
                room.challenge = null;
                room.playersAsked = new Set();
                
                // حذف المندس من القائمة
                room.players = room.players.filter(id => id !== userId);
                players.delete(userId);
                
                broadcastToRoom(room.id, 'gameReset', {
                  message: 'سحب عليكم المندس',
                  players: getPlayersInRoom(room.id)
                });
                
                console.log(`🚫 المندس ${player.name} انقطع حقيقي، تم إلغاء اللعبة.`);
                rooms.set(room.id, room);
              }
            }, 3000); // ✅ مهلة 3 ثواني
            
            console.log(`⏳ المندس ${player.name} انقطع، انتظار 3 ثواني...`);
            // لا نعمل return هنا، نخلي الكود يكمل لإرسال playerDisconnected
          }
          
          // ✅ إرسال تحديث للغرفة بأن اللاعب انقطع - لكن بدون رسالة مزعجة
          broadcastToRoom(player.roomId, 'playerDisconnected', {
            userId: userId,
            playerName: player.name,
            players: getPlayersInRoom(room.id) // ✅ إرسال قائمة اللاعبين المحدثة
          });
          
          // حذف اللاعب تلقائيًا بعد 120 ثانية (دقيقتين) إذا لم يعد الاتصال
          player.disconnectTimer = setTimeout(() => {
            const stillDisconnected = !player.ws;
            if (stillDisconnected) {
              console.log(`⏰ حذف اللاعب ${player.name} بعد انقطاع الاتصال`);
              handleLeaveRoom(null, userId, {});
              
              // إذا كانت اللعبة جارية، الانتقال لللاعب التالي
              if (room.gameState === 'inGame' && room.players[room.currentPlayerIndex] === userId) {
                room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;
                broadcastToRoom(room.id, 'nextQuestion', {
                  currentPlayer: room.players[room.currentPlayerIndex],
                  currentQuestion: room.currentQuestion
                });
              }
              
              const connectedPlayersInRoom = room.players.filter(pid => {
                const p = players.get(pid);
                return p && p.isConnected;
              });
              
              if (connectedPlayersInRoom.length === 0) {
                if (room.questionTimer) clearTimeout(room.questionTimer);
                if (room.votingTimer) clearTimeout(room.votingTimer);
                if (room.challengeTimer) clearTimeout(room.challengeTimer);
                room.players.forEach(pid => players.delete(pid));
                rooms.delete(room.id);
                console.log(`Deleted empty room ${room.roomCode}`);
              }
            }
           }, 120000); // 120 ثانية (دقيقتين)
        }
      }
    }
    console.log(`❌ انفصال WebSocket: ${userId}`);
  });
});

// ============================================
// REST API
// ============================================

// ✅ Route للـ root - تقديم ملف HTML الرئيسي
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index(14).html'));
});

app.get('/api/health', (req, res) => {
  const now = new Date();
  const arabicDate = now.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  res.json({
    status: 'ok',
    timestamp: arabicDate
  });
});

app.get('/api/rooms', (req, res) => {
  const publicRooms = [];
  for (const [, room] of rooms) {
    // إرجاع الغرف العامة فقط (ليست خاصة)
    if (!room.isPrivate && room.gameState === 'waiting' && room.players.length > 0 && room.players.length < room.maxPlayers) {
      // ✅ تصفية اللاعبين المتصلين فقط (الذين لديهم ws !== null)
      const connectedPlayers = room.players.filter(pid => {
        const player = players.get(pid);
        return player && player.ws !== null;
      });
      
      // عرض الغرفة فقط إذا كان هناك لاعبين متصلين
      if (connectedPlayers.length > 0) {
        publicRooms.push({
          id: room.id,
          name: room.name,
          roomCode: room.roomCode,
          players: getPlayersInRoom(room.id).filter(p => {
            const player = players.get(p.id);
            return player && player.ws !== null;
          }),
          maxPlayers: room.maxPlayers
        });
      }
    }
  }
  res.json(publicRooms);
});

// ============================================
// بدء الخادم
// ============================================
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log('🎮 لعبة برا السالفة تعمل على http://localhost:' + PORT);
  const now = new Date();
  const arabicDate = now.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  console.log('📊 الوقت الحالي: ' + arabicDate);
});
