import express from 'express';
import multer from 'multer';
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
// تقديم الملفات الثابتة (index.html) من مجلد public
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

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
    { word: 'أجويرو', spyWord: 'لاعب أرجنتيني' },
    { word: 'ماسكيرانو', spyWord: 'لاعب أرجنتيني' },
    { word: 'موتا', spyWord: 'لاعب أرجنتيني' },
    { word: 'سامبايولي', spyWord: 'لاعب أرجنتيني' },
    { word: 'إيتشيفاريا', spyWord: 'لاعب أرجنتيني' },
    { word: 'بيريز', spyWord: 'لاعب أرجنتيني' },
    
    // لاعبين إسبان
    { word: 'بوسكيتس', spyWord: 'لاعب إسباني' },
    { word: 'بيكيه', spyWord: 'لاعب إسباني' },
    { word: 'إنييستا', spyWord: 'لاعب إسباني' },
    { word: 'رامس', spyWord: 'لاعب إسباني' },
    { word: 'ألبا', spyWord: 'لاعب إسباني' },
    { word: 'بوسكيتس', spyWord: 'لاعب إسباني' },
    { word: 'فيدال', spyWord: 'لاعب إسباني' },
    { word: 'بيدري', spyWord: 'لاعب إسباني' },
    
    // لاعبين إيطاليين
    { word: 'فيراتي', spyWord: 'لاعب إيطالي' },
    { word: 'فيراتي', spyWord: 'لاعب إيطالي' },
    { word: 'إيموبيلي', spyWord: 'لاعب إيطالي' },
    { word: 'بيرلو', spyWord: 'لاعب إيطالي' },
    { word: 'ماتيتش', spyWord: 'لاعب إيطالي' },
    
    // لاعبين ألمان
    { word: 'نويير', spyWord: 'لاعب ألماني' },
    { word: 'بوتس', spyWord: 'لاعب ألماني' },
    { word: 'مولر', spyWord: 'لاعب ألماني' },
    { word: 'كروس', spyWord: 'لاعب ألماني' },
    { word: 'هوميلس', spyWord: 'لاعب ألماني' },
    { word: 'شفاينشتايجر', spyWord: 'لاعب ألماني' },
    { word: 'رودريجيز', spyWord: 'لاعب ألماني' },
    
    // لاعبين هولنديين
    { word: 'فان ديك', spyWord: 'لاعب هولندي' },
    { word: 'فان بيرسي', spyWord: 'لاعب هولندي' },
    { word: 'روبن', spyWord: 'لاعب هولندي' },
    { word: 'سنايدر', spyWord: 'لاعب هولندي' },
    { word: 'ديبوي', spyWord: 'لاعب هولندي' },
    
    // لاعبين بلجيكيين
    { word: 'هازار', spyWord: 'لاعب بلجيكي' },
    { word: 'دي بروين', spyWord: 'لاعب بلجيكي' },
    { word: 'كومباني', spyWord: 'لاعب بلجيكي' },
    { word: 'ويتسل', spyWord: 'لاعب بلجيكي' },
    { word: 'فيرتونجن', spyWord: 'لاعب بلجيكي' }
  ],

  // ============================================
  // القسم 4: الأطعمة (Food) - 80 كلمة
  // ============================================
  food: [
    // وجبات عربية
    { word: 'الكبسة', spyWord: 'وجبة عربية' },
    { word: 'المندي', spyWord: 'وجبة عربية' },
    { word: 'المنسف', spyWord: 'وجبة عربية' },
    { word: 'المظبي', spyWord: 'وجبة عربية' },
    { word: 'الحنيذ', spyWord: 'وجبة عربية' },
    { word: 'الفتة', spyWord: 'وجبة عربية' },
    { word: 'الفلافل', spyWord: 'وجبة عربية' },
    { word: 'الحمص', spyWord: 'وجبة عربية' },
    { word: 'الباذنجان المقلي', spyWord: 'وجبة عربية' },
    { word: 'الكفتة', spyWord: 'وجبة عربية' },
    
    // وجبات إيطالية
    { word: 'البيتزا', spyWord: 'وجبة إيطالية' },
    { word: 'الباستا', spyWord: 'وجبة إيطالية' },
    { word: 'الريزوتو', spyWord: 'وجبة إيطالية' },
    { word: 'اللازانيا', spyWord: 'وجبة إيطالية' },
    { word: 'الكاربونارا', spyWord: 'وجبة إيطالية' },
    { word: 'الرافيولي', spyWord: 'وجبة إيطالية' },
    { word: 'الأرانشيني', spyWord: 'وجبة إيطالية' },
    
    // وجبات يابانية
    { word: 'السوشي', spyWord: 'وجبة يابانية' },
    { word: 'الرامن', spyWord: 'وجبة يابانية' },
    { word: 'الأودون', spyWord: 'وجبة يابانية' },
    { word: 'التمبورا', spyWord: 'وجبة يابانية' },
    { word: 'التونكاتسو', spyWord: 'وجبة يابانية' },
    { word: 'الأكومي', spyWord: 'وجبة يابانية' },
    { word: 'الساشيمي', spyWord: 'وجبة يابانية' },
    
    // وجبات صينية
    { word: 'الرز المقلي', spyWord: 'وجبة صينية' },
    { word: 'نودلز', spyWord: 'وجبة صينية' },
    { word: 'الدجاج بالصلصة الحارة', spyWord: 'وجبة صينية' },
    { word: 'الربيان المقلي', spyWord: 'وجبة صينية' },
    { word: 'الزنجبيل والثوم', spyWord: 'وجبة صينية' },
    
    // وجبات أمريكية
    { word: 'البرجر', spyWord: 'وجبة أمريكية' },
    { word: 'الهوت دوج', spyWord: 'وجبة أمريكية' },
    { word: 'الدجاج المقلي', spyWord: 'وجبة أمريكية' },
    { word: 'الفرايز', spyWord: 'وجبة أمريكية' },
    { word: 'الستيك', spyWord: 'وجبة أمريكية' },
    { word: 'الذرة المشوية', spyWord: 'وجبة أمريكية' },
    
    // وجبات هندية
    { word: 'الكاري', spyWord: 'وجبة هندية' },
    { word: 'الدال', spyWord: 'وجبة هندية' },
    { word: 'البيرياني', spyWord: 'وجبة هندية' },
    { word: 'الناان', spyWord: 'وجبة هندية' },
    { word: 'الساموسا', spyWord: 'وجبة هندية' },
    { word: 'التندوري', spyWord: 'وجبة هندية' },
    
    // وجبات شامية
    { word: 'الشاورما', spyWord: 'وجبة شامية' },
    { word: 'الكباب', spyWord: 'وجبة شامية' },
    { word: 'الحمص بالطحينة', spyWord: 'وجبة شامية' },
    { word: 'الفتوش', spyWord: 'وجبة شامية' },
    { word: 'التبولة', spyWord: 'وجبة شامية' },
    { word: 'الكبة', spyWord: 'وجبة شامية' },
    
    // وجبات مكسيكية
    { word: 'التاكو', spyWord: 'وجبة مكسيكية' },
    { word: 'الإنتشيلادا', spyWord: 'وجبة مكسيكية' },
    { word: 'البوريتو', spyWord: 'وجبة مكسيكية' },
    { word: 'الناتشوز', spyWord: 'وجبة مكسيكية' },
    { word: 'الكيساديلا', spyWord: 'وجبة مكسيكية' },
    
    // حلويات
    { word: 'الكنافة', spyWord: 'حلى عربي' },
    { word: 'البقلاوة', spyWord: 'حلى عربي' },
    { word: 'القطايف', spyWord: 'حلى عربي' },
    { word: 'البسبوسة', spyWord: 'حلى عربي' },
    { word: 'المعمول', spyWord: 'حلى عربي' },
    { word: 'التيراميسو', spyWord: 'حلى إيطالي' },
    { word: 'الباناكوتا', spyWord: 'حلى إيطالي' },
    { word: 'الكريم بروليه', spyWord: 'حلى فرنسي' },
    { word: 'الماكرون', spyWord: 'حلى فرنسي' },
    { word: 'التشيز كيك', spyWord: 'حلى أمريكي' }
  ],

  // ============================================
  // القسم 5: المشروبات (Drinks) - 85 كلمة
  // ============================================
  drinks: [
    // مشروبات ساخنة - قهوة
    { word: 'القهوة العربية', spyWord: 'قهوة' },
    { word: 'القهوة التركية', spyWord: 'قهوة' },
    { word: 'الإسبريسو', spyWord: 'قهوة' },
    { word: 'الأمريكانو', spyWord: 'قهوة' },
    { word: 'الكابتشينو', spyWord: 'قهوة' },
    { word: 'اللاتيه', spyWord: 'قهوة' },
    { word: 'الموكا', spyWord: 'قهوة' },
    { word: 'الماكياتو', spyWord: 'قهوة' },
    { word: 'الفلات وايت', spyWord: 'قهوة' },
    { word: 'الكورتادو', spyWord: 'قهوة' },
    { word: 'الفرابتشينو', spyWord: 'قهوة' },
    { word: 'الكولد برو', spyWord: 'قهوة' },
    { word: 'النسكافيه', spyWord: 'قهوة' },
    { word: 'القهوة الفرنسية', spyWord: 'قهوة' },
    
    // مشروبات ساخنة - شاي
    { word: 'الشاي الأحمر', spyWord: 'شاي' },
    { word: 'الشاي الأخضر', spyWord: 'شاي' },
    { word: 'شاي الكرك', spyWord: 'شاي' },
    { word: 'الشاي المغربي', spyWord: 'شاي' },
    { word: 'شاي الأعشاب', spyWord: 'شاي' },
    { word: 'شاي الزنجبيل', spyWord: 'شاي' },
    { word: 'شاي البابونج', spyWord: 'شاي' },
    { word: 'شاي الياسمين', spyWord: 'شاي' },
    { word: 'شاي الإيرل جراي', spyWord: 'شاي' },
    { word: 'الماتشا', spyWord: 'شاي' },
    
    // مشروبات ساخنة أخرى
    { word: 'الكاكاو', spyWord: 'مشروب ساخن' },
    { word: 'الشوكولاتة الساخنة', spyWord: 'مشروب ساخن' },
    { word: 'الحليب الساخن', spyWord: 'مشروب ساخن' },
    { word: 'السحلب', spyWord: 'مشروب ساخن' },
    { word: 'القرفة', spyWord: 'مشروب ساخن' },
    
    // مشروبات غازية
    { word: 'الكوكاكولا', spyWord: 'مشروب غازي' },
    { word: 'البيبسي', spyWord: 'مشروب غازي' },
    { word: 'السفن أب', spyWord: 'مشروب غازي' },
    { word: 'السبرايت', spyWord: 'مشروب غازي' },
    { word: 'الفانتا', spyWord: 'مشروب غازي' },
    { word: 'الميرندا', spyWord: 'مشروب غازي' },
    { word: 'الماونتن ديو', spyWord: 'مشروب غازي' },
    { word: 'الدكتور بيبر', spyWord: 'مشروب غازي' },
    { word: 'الشويبس', spyWord: 'مشروب غازي' },
    { word: 'الكندا دراي', spyWord: 'مشروب غازي' },
    { word: 'الريد بول', spyWord: 'مشروب طاقة' },
    { word: 'المونستر', spyWord: 'مشروب طاقة' },
    { word: 'الكود ريد', spyWord: 'مشروب طاقة' },
    
    // عصائر طبيعية
    { word: 'عصير البرتقال', spyWord: 'عصير طبيعي' },
    { word: 'عصير التفاح', spyWord: 'عصير طبيعي' },
    { word: 'عصير المانجو', spyWord: 'عصير طبيعي' },
    { word: 'عصير الفراولة', spyWord: 'عصير طبيعي' },
    { word: 'عصير الأناناس', spyWord: 'عصير طبيعي' },
    { word: 'عصير الليمون', spyWord: 'عصير طبيعي' },
    { word: 'عصير الجزر', spyWord: 'عصير طبيعي' },
    { word: 'عصير الرمان', spyWord: 'عصير طبيعي' },
    { word: 'عصير العنب', spyWord: 'عصير طبيعي' },
    { word: 'عصير الخوخ', spyWord: 'عصير طبيعي' },
    { word: 'عصير الكوكتيل', spyWord: 'عصير طبيعي' },
    { word: 'عصير الموز', spyWord: 'عصير طبيعي' },
    
    // مشروبات باردة أخرى
    { word: 'الحليب البارد', spyWord: 'مشروب بارد' },
    { word: 'الميلك شيك', spyWord: 'مشروب بارد' },
    { word: 'السموثي', spyWord: 'مشروب بارد' },
    { word: 'الآيس كريم شيك', spyWord: 'مشروب بارد' },
    { word: 'الفراب', spyWord: 'مشروب بارد' },
    { word: 'الموهيتو', spyWord: 'مشروب بارد' },
    { word: 'الليموناضة', spyWord: 'مشروب بارد' },
    
    // مشروبات تقليدية
    { word: 'التمر هندي', spyWord: 'مشروب تقليدي' },
    { word: 'الكركديه', spyWord: 'مشروب تقليدي' },
    { word: 'العرقسوس', spyWord: 'مشروب تقليدي' },
    { word: 'الجلاب', spyWord: 'مشروب تقليدي' },
    { word: 'السوبيا', spyWord: 'مشروب تقليدي' },
    { word: 'اللبن', spyWord: 'مشروب تقليدي' },
    { word: 'الشنينة', spyWord: 'مشروب تقليدي' },
    { word: 'القمر الدين', spyWord: 'مشروب تقليدي' },
    
    // مياه ومشروبات صحية
    { word: 'الماء', spyWord: 'ماء' },
    { word: 'ماء زمزم', spyWord: 'ماء' },
    { word: 'المياه المعدنية', spyWord: 'ماء' },
    { word: 'المياه الفوارة', spyWord: 'ماء' },
    { word: 'ماء جوز الهند', spyWord: 'مشروب صحي' },
    { word: 'الديتوكس', spyWord: 'مشروب صحي' },
    { word: 'الشاي الأخضر المثلج', spyWord: 'مشروب صحي' }
  ],

  // ============================================
  // القسم 6: الأشياء (Objects) - 90 كلمة
  // ============================================
  objects: [
    // أجهزة إلكترونية
    { word: 'الجوال', spyWord: 'جهاز إلكتروني' },
    { word: 'الحاسوب', spyWord: 'جهاز إلكتروني' },
    { word: 'اللابتوب', spyWord: 'جهاز إلكتروني' },
    { word: 'التلفزيون', spyWord: 'جهاز إلكتروني' },
    { word: 'الآيباد', spyWord: 'جهاز إلكتروني' },
    { word: 'البلايستيشن', spyWord: 'جهاز إلكتروني' },
    { word: 'الإكس بوكس', spyWord: 'جهاز إلكتروني' },
    { word: 'الكاميرا', spyWord: 'جهاز إلكتروني' },
    { word: 'السماعات', spyWord: 'جهاز إلكتروني' },
    { word: 'الماوس', spyWord: 'جهاز إلكتروني' },
    { word: 'الكيبورد', spyWord: 'جهاز إلكتروني' },
    { word: 'الطابعة', spyWord: 'جهاز إلكتروني' },
    { word: 'الماسح الضوئي', spyWord: 'جهاز إلكتروني' },
    { word: 'الراوتر', spyWord: 'جهاز إلكتروني' },
    { word: 'المودم', spyWord: 'جهاز إلكتروني' },
    
    // أدوات كتابة ومكتبية
    { word: 'القلم', spyWord: 'أداة كتابة' },
    { word: 'القلم الرصاص', spyWord: 'أداة كتابة' },
    { word: 'الممحاة', spyWord: 'أداة كتابة' },
    { word: 'المسطرة', spyWord: 'أداة كتابة' },
    { word: 'البراية', spyWord: 'أداة كتابة' },
    { word: 'الدفتر', spyWord: 'أداة كتابة' },
    { word: 'الكراسة', spyWord: 'أداة كتابة' },
    { word: 'الكتاب', spyWord: 'أداة كتابة' },
    { word: 'الدباسة', spyWord: 'أداة مكتبية' },
    { word: 'المقص', spyWord: 'أداة مكتبية' },
    { word: 'اللاصق', spyWord: 'أداة مكتبية' },
    { word: 'المشبك', spyWord: 'أداة مكتبية' },
    { word: 'الملف', spyWord: 'أداة مكتبية' },
    
    // أثاث منزلي
    { word: 'الكرسي', spyWord: 'أثاث' },
    { word: 'الطاولة', spyWord: 'أثاث' },
    { word: 'السرير', spyWord: 'أثاث' },
    { word: 'الخزانة', spyWord: 'أثاث' },
    { word: 'الكنب', spyWord: 'أثاث' },
    { word: 'الأريكة', spyWord: 'أثاث' },
    { word: 'الرف', spyWord: 'أثاث' },
    { word: 'المكتب', spyWord: 'أثاث' },
    { word: 'الدولاب', spyWord: 'أثاث' },
    { word: 'الكومودينو', spyWord: 'أثاث' },
    { word: 'الخزانة الجانبية', spyWord: 'أثاث' },
    { word: 'المرآة', spyWord: 'أثاث' },
    { word: 'الستارة', spyWord: 'أثاث' },
    { word: 'السجادة', spyWord: 'أثاث' },
    { word: 'المصباح', spyWord: 'أثاث' },
    
    // أدوات منزلية
    { word: 'الثلاجة', spyWord: 'جهاز منزلي' },
    { word: 'الغسالة', spyWord: 'جهاز منزلي' },
    { word: 'المكيف', spyWord: 'جهاز منزلي' },
    { word: 'المروحة', spyWord: 'جهاز منزلي' },
    { word: 'الميكروويف', spyWord: 'جهاز منزلي' },
    { word: 'الفرن', spyWord: 'جهاز منزلي' },
    { word: 'الخلاط', spyWord: 'جهاز منزلي' },
    { word: 'المكنسة', spyWord: 'جهاز منزلي' },
    { word: 'المكواة', spyWord: 'جهاز منزلي' },
    { word: 'السخان', spyWord: 'جهاز منزلي' },
    { word: 'الغلاية', spyWord: 'جهاز منزلي' },
    { word: 'القلاية', spyWord: 'جهاز منزلي' },
    { word: 'الخلاط الكهربائي', spyWord: 'جهاز منزلي' },
    
    // إكسسوارات شخصية
    { word: 'الساعة', spyWord: 'إكسسوار' },
    { word: 'النظارة', spyWord: 'إكسسوار' },
    { word: 'النظارة الشمسية', spyWord: 'إكسسوار' },
    { word: 'الخاتم', spyWord: 'إكسسوار' },
    { word: 'السوار', spyWord: 'إكسسوار' },
    { word: 'القلادة', spyWord: 'إكسسوار' },
    { word: 'الأقراط', spyWord: 'إكسسوار' },
    { word: 'الحزام', spyWord: 'إكسسوار' },
    { word: 'المحفظة', spyWord: 'إكسسوار' },
    { word: 'الحقيبة', spyWord: 'إكسسوار' },
    { word: 'الشنطة', spyWord: 'إكسسوار' },
    { word: 'القبعة', spyWord: 'إكسسوار' },
    { word: 'الوشاح', spyWord: 'إكسسوار' },
    
    // أدوات رياضية
    { word: 'الكرة', spyWord: 'أداة رياضية' },
    { word: 'المضرب', spyWord: 'أداة رياضية' },
    { word: 'الدراجة', spyWord: 'أداة رياضية' },
    { word: 'الدمبل', spyWord: 'أداة رياضية' },
    { word: 'حبل القفز', spyWord: 'أداة رياضية' },
    { word: 'السجادة الرياضية', spyWord: 'أداة رياضية' },
    { word: 'الجهاز الرياضي', spyWord: 'أداة رياضية' },
    
    // أدوات متنوعة
    { word: 'المفتاح', spyWord: 'أداة' },
    { word: 'القفل', spyWord: 'أداة' },
    { word: 'الشاحن', spyWord: 'أداة' },
    { word: 'السلك', spyWord: 'أداة' },
    { word: 'البطارية', spyWord: 'أداة' },
    { word: 'الريموت', spyWord: 'أداة' },
    { word: 'المنبه', spyWord: 'أداة' },
    { word: 'الهاتف', spyWord: 'أداة' },
    { word: 'الراديو', spyWord: 'أداة' },
    { word: 'المظلة', spyWord: 'أداة' }
  ],

  // ============================================
  // القسم 7: ألعاب الفيديو (Video Games) - 85 كلمة
  // ============================================
  video_games: [
    // ألعاب باتل رويال
    { word: 'فورتنايت', spyWord: 'لعبة باتل رويال' },
    { word: 'بابجي', spyWord: 'لعبة باتل رويال' },
    { word: 'أبيكس ليجندز', spyWord: 'لعبة باتل رويال' },
    { word: 'وارزون', spyWord: 'لعبة باتل رويال' },
    { word: 'فري فاير', spyWord: 'لعبة باتل رويال' },
    { word: 'فالورانت', spyWord: 'لعبة باتل رويال' },
    
    // ألعاب إطلاق نار
    { word: 'كول أوف ديوتي', spyWord: 'لعبة إطلاق نار' },
    { word: 'باتلفيلد', spyWord: 'لعبة إطلاق نار' },
    { word: 'كاونتر سترايك', spyWord: 'لعبة إطلاق نار' },
    { word: 'أوفرواتش', spyWord: 'لعبة إطلاق نار' },
    { word: 'رينبو سكس', spyWord: 'لعبة إطلاق نار' },
    { word: 'دوم', spyWord: 'لعبة إطلاق نار' },
    { word: 'هالو', spyWord: 'لعبة إطلاق نار' },
    { word: 'تايتنفول', spyWord: 'لعبة إطلاق نار' },
    { word: 'ديستني', spyWord: 'لعبة إطلاق نار' },
    { word: 'بوردرلاندز', spyWord: 'لعبة إطلاق نار' },
    
    // ألعاب كرة قدم
    { word: 'فيفا', spyWord: 'لعبة كرة قدم' },
    { word: 'إي فوتبول', spyWord: 'لعبة كرة قدم' },
    { word: 'بيس', spyWord: 'لعبة كرة قدم' },
    { word: 'فوتبول مانيجر', spyWord: 'لعبة كرة قدم' },
    { word: 'روكيت ليج', spyWord: 'لعبة كرة قدم' },
    
    // ألعاب رياضية أخرى
    { word: 'ماديين', spyWord: 'لعبة رياضية' },
    { word: 'NBA 2K', spyWord: 'لعبة رياضية' },
    { word: 'WWE', spyWord: 'لعبة رياضية' },
    { word: 'F1', spyWord: 'لعبة رياضية' },
    { word: 'تينس', spyWord: 'لعبة رياضية' },
    
    // ألعاب مغامرات
    { word: 'الجيتا', spyWord: 'لعبة مغامرات' },
    { word: 'الويتشر', spyWord: 'لعبة مغامرات' },
    { word: 'ريد ديد', spyWord: 'لعبة مغامرات' },
    { word: 'أنتشارتد', spyWord: 'لعبة مغامرات' },
    { word: 'فار كراي', spyWord: 'لعبة مغامرات' },
    
    // ألعاب RPG
    { word: 'إلدن رينج', spyWord: 'لعبة RPG' },
    { word: 'ديابلو', spyWord: 'لعبة RPG' },
    { word: 'فاينال فانتسي', spyWord: 'لعبة RPG' },
    { word: 'درجون إيج', spyWord: 'لعبة RPG' },
    { word: 'ويذر 3', spyWord: 'لعبة RPG' },
    
    // ألعاب ستيلث
    { word: 'أساسين كريد', spyWord: 'لعبة ستيلث' },
    { word: 'ديشونرد', spyWord: 'لعبة ستيلث' },
    { word: 'سبلينتر سيل', spyWord: 'لعبة ستيلث' },
    { word: 'هيتمان', spyWord: 'لعبة ستيلث' },
    { word: 'ميتال جير', spyWord: 'لعبة ستيلث' },
    
    // ألعاب ألغاز
    { word: 'بورتال', spyWord: 'لعبة ألغاز' },
    { word: 'تيتريس', spyWord: 'لعبة ألغاز' },
    { word: 'كاندي كراش', spyWord: 'لعبة ألغاز' },
    { word: 'ماين كرافت', spyWord: 'لعبة ألغاز' },
    { word: 'بلوكس', spyWord: 'لعبة ألغاز' },
    
    // ألعاب سباق
    { word: 'فورزا', spyWord: 'لعبة سباق' },
    { word: 'نيد فور سبيد', spyWord: 'لعبة سباق' },
    { word: 'جران توريسمو', spyWord: 'لعبة سباق' },
    { word: 'كول رانينج', spyWord: 'لعبة سباق' },
    { word: 'ماريو كارت', spyWord: 'لعبة سباق' },
    
    // ألعاب أخرى
    { word: 'ستاركيو', spyWord: 'لعبة أخرى' },
    { word: 'ليجند أوف زيلدا', spyWord: 'لعبة أخرى' },
    { word: 'سوبر ماريو', spyWord: 'لعبة أخرى' },
    { word: 'سونيك', spyWord: 'لعبة أخرى' },
    { word: 'كيرتي', spyWord: 'لعبة أخرى' }
  ],

  // ============================================
  // القسم 8: الأفلام والمسلسلات (Movies & Series) - 80 كلمة
  // ============================================
  movies_series: [
    // أفلام أكشن
    { word: 'مان أوف ستيل', spyWord: 'فيلم أكشن' },
    { word: 'باتمان', spyWord: 'فيلم أكشن' },
    { word: 'آيرون مان', spyWord: 'فيلم أكشن' },
    { word: 'أفنجرز', spyWord: 'فيلم أكشن' },
    { word: 'جيمس بوند', spyWord: 'فيلم أكشن' },
    { word: 'ترانسفورمرز', spyWord: 'فيلم أكشن' },
    { word: 'إنديانا جونز', spyWord: 'فيلم أكشن' },
    { word: 'جون ويك', spyWord: 'فيلم أكشن' },
    
    // أفلام كوميديا
    { word: 'الأسد الملك', spyWord: 'فيلم كوميديا' },
    { word: 'شريك', spyWord: 'فيلم كوميديا' },
    { word: 'مدغشقر', spyWord: 'فيلم كوميديا' },
    { word: 'توي ستوري', spyWord: 'فيلم كوميديا' },
    { word: 'فروزن', spyWord: 'فيلم كوميديا' },
    { word: 'مونستر إنك', spyWord: 'فيلم كوميديا' },
    { word: 'فايندينج نيمو', spyWord: 'فيلم كوميديا' },
    { word: 'الإمبراطورية الجديدة', spyWord: 'فيلم كوميديا' },
    
    // أفلام درامية
    { word: 'الشاوشانك', spyWord: 'فيلم درامي' },
    { word: 'بولب فيكشن', spyWord: 'فيلم درامي' },
    { word: 'الفلاح الأسود', spyWord: 'فيلم درامي' },
    { word: 'فورست جامب', spyWord: 'فيلم درامي' },
    { word: 'الحياة جميلة', spyWord: 'فيلم درامي' },
    { word: 'تايتانك', spyWord: 'فيلم درامي' },
    { word: 'الحرب والسلام', spyWord: 'فيلم درامي' },
    { word: 'الراقصة', spyWord: 'فيلم درامي' },
    
    // أفلام رعب
    { word: 'الحلقة', spyWord: 'فيلم رعب' },
    { word: 'الفك', spyWord: 'فيلم رعب' },
    { word: 'الصرخة', spyWord: 'فيلم رعب' },
    { word: 'الرعب الأمريكي', spyWord: 'فيلم رعب' },
    { word: 'الأرواح الشريرة', spyWord: 'فيلم رعب' },
    { word: 'الشيء', spyWord: 'فيلم رعب' },
    { word: 'الدخيل', spyWord: 'فيلم رعب' },
    
    // مسلسلات
    { word: 'صراع العروش', spyWord: 'مسلسل' },
    { word: 'بريكينج باد', spyWord: 'مسلسل' },
    { word: 'سترينجر ثينجز', spyWord: 'مسلسل' },
    { word: 'ويستوورلد', spyWord: 'مسلسل' },
    { word: 'بيج بانج', spyWord: 'مسلسل' },
    { word: 'فريندز', spyWord: 'مسلسل' },
    { word: 'ذا أوفيس', spyWord: 'مسلسل' },
    { word: 'جيمينج أوف ثرونز', spyWord: 'مسلسل' },
    
    // أفلام خيال علمي
    { word: 'ماتريكس', spyWord: 'فيلم خيال علمي' },
    { word: 'إنترستيلار', spyWord: 'فيلم خيال علمي' },
    { word: 'بليد رانر', spyWord: 'فيلم خيال علمي' },
    { word: 'تيرمينيتور', spyWord: 'فيلم خيال علمي' },
    { word: 'باك تو ذا فيوتشر', spyWord: 'فيلم خيال علمي' },
    { word: 'ستار وارز', spyWord: 'فيلم خيال علمي' },
    { word: 'ألين', spyWord: 'فيلم خيال علمي' },
    
    // أفلام رومانسية
    { word: 'نوتبوك', spyWord: 'فيلم رومانسي' },
    { word: 'رومان هوليديز', spyWord: 'فيلم رومانسي' },
    { word: 'تايتانك', spyWord: 'فيلم رومانسي' },
    { word: 'الحب الأول', spyWord: 'فيلم رومانسي' },
    { word: 'بريدجت جونز', spyWord: 'فيلم رومانسي' },
    { word: 'ذا فولت إن آور ستارز', spyWord: 'فيلم رومانسي' },
    { word: 'لاليفر', spyWord: 'فيلم رومانسي' },
    
    // أفلام وثائقية
    { word: 'بلانيت إيرث', spyWord: 'فيلم وثائقي' },
    { word: 'كوزموس', spyWord: 'فيلم وثائقي' },
    { word: 'ناشيونال جيوغرافيك', spyWord: 'فيلم وثائقي' },
    { word: 'ديسكفري', spyWord: 'فيلم وثائقي' },
    { word: 'ديسكفري تشانل', spyWord: 'فيلم وثائقي' }
  ]
};

// ============================================
// إدارة الحالة
// ============================================
const players = new Map();
const rooms = new Map();

// ============================================
// الدوال المساعدة
// ============================================

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * إرسال رسالة لاعب محدد
 * @param {string} userId 
 * @param {string} event 
 * @param {object} data 
 * @param {WebSocket} ws (اختياري)
 */
function sendToPlayer(userId, event, data, ws = null) {
  try {
    const player = players.get(userId);
    const targetWs = ws || (player && player.ws);
    
    if (!targetWs || targetWs.readyState !== WebSocket.OPEN) {
      console.warn(`⚠️ لا يمكن إرسال رسالة إلى ${userId}: الاتصال غير متاح`);
      return;
    }
    
    targetWs.send(JSON.stringify({ event, data }));
  } catch (error) {
    console.error(`❌ خطأ في إرسال الرسالة:`, error);
  }
}

/**
 * بث رسالة لجميع اللاعبين في الغرفة
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
  
  if (!roomName || !category) {
    return sendToPlayer(userId, 'error', { message: 'بيانات الغرفة غير كاملة.' });
  }
  
  // ✅ فحص: إذا كان اللاعب موجودًا بالفعل (منقطع) في غرفة، عامله كـ reconnect
  const existingPlayer = players.get(userId);
  if (existingPlayer && existingPlayer.roomId && !existingPlayer.ws) {
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
    const oldPlayer = players.get(existingPlayerWithName);
    if (oldPlayer && oldPlayer.ws) {
      sendToPlayer(existingPlayerWithName, 'playerKicked', { message: 'تم حذفك' }, oldPlayer.ws);
      oldPlayer.ws.close();
    }
    room.players = room.players.filter(pid => pid !== existingPlayerWithName);
    players.delete(existingPlayerWithName);
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

  // إخطار باقي اللاعبين بانضمام اللاعب الجديد
  broadcastToRoom(room.id, 'playerJoined', {
    userId: userId,
    playerName: displayName,
    players: getPlayersInRoom(room.id)
  });

}

function handleChangeName(ws, userId, data) {
  const { newName } = data;
  const player = players.get(userId);
  
  if (!player) {
    return sendToPlayer(userId, 'error', { message: 'أنت لست في اللعبة.' });
  }
  
  if (!newName || newName.trim().length === 0) {
    return sendToPlayer(userId, 'error', { message: 'يجب إدخال اسم صحيح.' });
  }
  
  if (newName.trim().length > 20) {
    return sendToPlayer(userId, 'error', { message: 'الاسم طويل جداً (الحد الأقصى 20 حرف).' });
  }
  
  player.name = newName.trim();
  players.set(userId, player);
  
  if (player.roomId) {
    broadcastToRoom(player.roomId, 'playerNameChanged', {
      userId: userId,
      newName: newName,
      players: getPlayersInRoom(player.roomId)
    });
  }
  
}

/**
 * ✅ معالج إعادة الاتصال المحسّن
 */
function handleReconnect(ws, userId, data) {
  const player = players.get(userId);
  
  if (!player) {
    // ✅ بدلاً من إعطاء خطأ، نعامل اللاعب كلاعب جديد
    // هذا يحدث عندما يطلع اللاعب ويرجع بعد فترة طويلة
    const newUserId = `user-${uuidv4()}`;
    return sendToPlayer(userId, 'setUserId', { userId: newUserId }, ws);
  }

  // ✅ إلغاء مؤقت إلغاء اللعبة للمندس (إذا رجع خلال 3 ثواني)
  if (player.spyDisconnectTimer) {
    clearTimeout(player.spyDisconnectTimer);
    player.spyDisconnectTimer = null;
  }

  // ✅ إلغاء مؤقت الحذف التلقائي
  if (player.disconnectTimer) {
    clearTimeout(player.disconnectTimer);
    player.disconnectTimer = null;
  }

  // تحديث الـ WebSocket وحالة الاتصال
  player.ws = ws;
  player.isConnected = true;
  players.set(userId, player);
  
  // إرسال حالة اللاعب الحالية
  sendToPlayer(userId, 'reconnected', {
    userId: userId,
    roomId: player.roomId,
    roomCode: player.roomId ? rooms.get(player.roomId)?.roomCode : null,
    displayName: player.name
  });

  // إذا كان اللاعب في غرفة، نرسل له حالة الغرفة الحالية ونرسل تحديثاً للغرفة
  if (player.roomId) {
    const room = rooms.get(player.roomId);
    if (room) {
      // إرسال حالة اللعبة الحالية للاعب الذي أعاد الاتصال
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
      
      // إرسال تحديث للغرفة بأن اللاعب عاد متصلاً
      broadcastToRoom(player.roomId, 'playerReconnected', {
        userId: userId,
        playerName: player.name,
        players: getPlayersInRoom(room.id)
      });
    }
  }
  
}

function handleLeaveRoom(ws, userId, data) {
  const player = players.get(userId);
  if (!player) return;

  const room = player.roomId ? rooms.get(player.roomId) : null;
  if (room) {
    room.players = room.players.filter(id => id !== userId);
    
    if (room.players.length === 0) {
      // حذف الغرفة إذا كانت فارغة
      if (room.questionTimer) clearTimeout(room.questionTimer);
      if (room.votingTimer) clearTimeout(room.votingTimer);
      if (room.challengeTimer) clearTimeout(room.challengeTimer);
      rooms.delete(room.id);
    } else {
      // إخطار باقي اللاعبين بمغادرة اللاعب
      broadcastToRoom(room.id, 'playerLeft', {
        userId: userId,
        playerName: player.name,
        players: getPlayersInRoom(room.id)
      });
      
      // إذا كان اللاعب هو منشئ الغرفة، نعين منشئاً جديداً
      if (player.isCreator && room.players.length > 0) {
        const newCreator = players.get(room.players[0]);
        if (newCreator) {
          newCreator.isCreator = true;
          players.set(room.players[0], newCreator);
          broadcastToRoom(room.id, 'creatorChanged', {
            newCreatorId: room.players[0],
            newCreatorName: newCreator.name
          });
        }
      }
      
      rooms.set(room.id, room);
    }
  }

  players.delete(userId);
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
    if (player) {
      player.isSpy = (pid === room.spyId);
      player.hasVoted = false;
      players.set(pid, player);
      
      const wordToSend = player.isSpy ? room.spyWord : room.currentWord;
      
      sendToPlayer(pid, 'gameStarted', {
        word: wordToSend,
        isSpy: player.isSpy,
        players: getPlayersInRoom(room.id),
        currentPlayer: room.players[room.currentPlayerIndex],
        timerDuration: 120
      });
    }
  });
  
  // بدء مؤقت السؤال الأول
  startQuestionTimer(room);
  
  rooms.set(room.id, room);
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
      });
      
      room.gameState = 'voting';
      room.playersAsked = new Set();
      broadcastToRoom(room.id, 'votingPhase', { players: getPlayersInRoom(room.id) });
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
    room.questionTimer = null;
  }

  // تسجيل أن اللاعب قد سأل (سواء كان عادياً أو مندساً)
  if (!room.playersAsked) {
    room.playersAsked = new Set();
  }
  room.playersAsked.add(userId);
  room.currentQuestion++;
  
  // الانتقال للاعب التالي (سواء كان عادياً أو مندساً)
  
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
  
  if (!room.playersAsked) {
    room.playersAsked = new Set();
  }
  
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
    });
    
    room.gameState = 'voting';
    room.playersAsked = new Set(); // إعادة تعيين
    room.votes = []; // إعادة تعيين الأصوات
    
    // إعادة تعيين حالة التصويت لجميع اللاعبين
    room.players.forEach(pid => {
      const p = players.get(pid);
      if (p) {
        p.hasVoted = false;
        players.set(pid, p);
      }
    });
    
    broadcastToRoom(room.id, 'votingPhase', { players: getPlayersInRoom(room.id) });
    
    // بدء مؤقت التصويت
    startVotingTimer(room);
  } else {
    broadcastToRoom(room.id, 'nextQuestion', {
      currentPlayer: room.players[room.currentPlayerIndex],
      currentQuestion: room.currentQuestion
    });
    
    // بدء مؤقت جديد (2 دقيقة)
    startQuestionTimer(room);
  }
  
  rooms.set(room.id, room);
}

function handleSkipToVoting(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  const player = players.get(userId);
  if (!room || room.gameState !== 'inGame' || !player) return;
  
  if (!player.isCreator) {
    return sendToPlayer(userId, 'error', { message: 'فقط منشئ الغرفة يمكنه الانتقال للتصويت.' });
  }
  
  if (room.questionTimer) {
    clearTimeout(room.questionTimer);
    room.questionTimer = null;
  }
  
  room.gameState = 'voting';
  room.playersAsked = new Set();
  room.votes = [];
  
  room.players.forEach(pid => {
    const p = players.get(pid);
    if (p) {
      p.hasVoted = false;
      players.set(pid, p);
    }
  });
  
  broadcastToRoom(room.id, 'votingPhase', { players: getPlayersInRoom(room.id) });
  
  startVotingTimer(room);
  rooms.set(room.id, room);
}

function handleSkipToVotingAttempt(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room || room.gameState !== 'inGame') return;
  
  room.skipToVotingAttempts = (room.skipToVotingAttempts || 0) + 1;
  
  const creatorId = room.players.find(pid => players.get(pid)?.isCreator);
  if (creatorId) {
    sendToPlayer(creatorId, 'skipToVotingAttempt', {
      playerName: players.get(userId)?.name,
      totalAttempts: room.skipToVotingAttempts
    });
  }
  
  rooms.set(room.id, room);
}

function handleVote(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room || room.gameState !== 'voting') return;

  const player = players.get(userId);
  if (!player) return;

  // ✅ Fix #4: Prevent double voting (Race Condition)
  if (player.hasVoted || room.votes.some(v => v.voterId === userId)) {
    return sendToPlayer(userId, 'error', { message: 'لقد قمت بالتصويت بالفعل.' });
  }
  player.hasVoted = true;
  players.set(userId, player);
  
  const { targetId } = data;
  
  // ✅ منع اللاعب من التصويت على نفسه
  if (targetId === userId) {
    // ✅ إلغاء تسجيل hasVoted ليسمح بالتصويت مرة أخرى
    player.hasVoted = false;
    players.set(userId, player);
    // ✅ إرسال الرسالة لجميع اللاعبين في الغرفة
    broadcastToRoom(room.id, 'error', { message: 'لا يا رجال! ما تقدر تقصي نفسك… وش نسوي بدونك؟' });
    return;
  }
  
  if (!room.players.includes(targetId)) return sendToPlayer(userId, 'error', { message: 'الهدف غير موجود.' });
  
  room.votes.push({ voterId: userId, targetId });
  
  // إرسال تحديث التصويت لجميع اللاعبين
  
  // ✅ حساب عدد اللاعبين المتصلين فقط
  const connectedPlayersCount = room.players.filter(pid => {
    const p = players.get(pid);
    return p && p.isConnected;
  }).length;
  
  broadcastToRoom(room.id, 'voteUpdate', {
    players: getPlayersInRoom(room.id),
    votedCount: room.votes.length,
    totalPlayers: connectedPlayersCount // ✅ عدد المتصلين فقط
  });

  // ✅ التحقق من اكتمال التصويت (من المتصلين فقط)
  if (room.votes.length === connectedPlayersCount) {
    // إلغاء مؤقت التصويت إذا كان موجوداً
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
    
    // إذا كان هناك تعادل، يفوز المندس تلقائياً
    if (playersWithMaxVotes.length > 1) {
      room.gameState = 'finished';
      room.lastResult = {
        winner: 'spy',
        word: room.currentWord,
        spyWord: room.spyWord,
        spyPlayer: players.get(room.spyId)?.name,
        isSpyEliminated: false,
        tie: true
      };
      broadcastToRoom(room.id, 'roundResult', room.lastResult);
      rooms.set(room.id, room);
      return;
    }
    
    const votedPlayerId = playersWithMaxVotes[0];
    
    if (votedPlayerId === room.spyId) {
      // تم اكتشاف المندس
      room.gameState = 'challenge';
      room.challenge = {
        spyId: room.spyId,
        challengeWords: generateChallengeWords(room.category, room.currentWord),
        spyAnswer: null
      };
      
      broadcastToRoom(room.id, 'spyChallenged', {
        spyName: players.get(room.spyId)?.name,
        challengeWords: room.challenge.challengeWords
      });
      
      
      // بدء مؤقت التحدي
      startChallengeTimer(room);
    } else {
      // تم اختيار لاعب عادي بدلاً من المندس
      room.gameState = 'finished';
      room.lastResult = {
        winner: 'spy',
        word: room.currentWord,
        spyWord: room.spyWord,
        spyPlayer: players.get(room.spyId)?.name,
        eliminatedPlayer: players.get(votedPlayerId)?.name,
        isSpyEliminated: false
      };
      broadcastToRoom(room.id, 'roundResult', room.lastResult);
    }
    
    rooms.set(room.id, room);
  } else {
    rooms.set(room.id, room);
  }
}

function startVotingTimer(room) {
  const VOTING_TIMEOUT = 60000; // 1 دقيقة
  
  if (room.votingTimer) {
    clearTimeout(room.votingTimer);
  }
  
  room.timerStartTime = Date.now();
  room.timerDuration = VOTING_TIMEOUT / 1000;
  
  room.votingTimer = setTimeout(() => {
    if (room.gameState !== 'voting') return;
    
    // انتهى وقت التصويت، حساب الأصوات
    const voteCounts = room.votes.reduce((acc, vote) => {
      acc[vote.targetId] = (acc[vote.targetId] || 0) + 1;
      return acc;
    }, {});
    
    if (Object.keys(voteCounts).length === 0) {
      // لا أحد صوت
      room.gameState = 'finished';
      room.lastResult = {
        winner: 'spy',
        word: room.currentWord,
        spyWord: room.spyWord,
        spyPlayer: players.get(room.spyId)?.name,
        isSpyEliminated: false,
        noVotes: true
      };
      broadcastToRoom(room.id, 'roundResult', room.lastResult);
      rooms.set(room.id, room);
      return;
    }
    
    const maxVotes = Math.max(...Object.values(voteCounts));
    const playersWithMaxVotes = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes);
    
    if (playersWithMaxVotes.length > 1) {
      room.gameState = 'finished';
      room.lastResult = {
        winner: 'spy',
        word: room.currentWord,
        spyWord: room.spyWord,
        spyPlayer: players.get(room.spyId)?.name,
        isSpyEliminated: false,
        tie: true
      };
      broadcastToRoom(room.id, 'roundResult', room.lastResult);
      rooms.set(room.id, room);
      return;
    }
    
    const votedPlayerId = playersWithMaxVotes[0];
    
    if (votedPlayerId === room.spyId) {
      room.gameState = 'challenge';
      room.challenge = {
        spyId: room.spyId,
        challengeWords: generateChallengeWords(room.category, room.currentWord),
        spyAnswer: null
      };
      
      broadcastToRoom(room.id, 'spyChallenged', {
        spyName: players.get(room.spyId)?.name,
        challengeWords: room.challenge.challengeWords
      });
      
      startChallengeTimer(room);
    } else {
      room.gameState = 'finished';
      room.lastResult = {
        winner: 'spy',
        word: room.currentWord,
        spyWord: room.spyWord,
        spyPlayer: players.get(room.spyId)?.name,
        eliminatedPlayer: players.get(votedPlayerId)?.name,
        isSpyEliminated: false
      };
      broadcastToRoom(room.id, 'roundResult', room.lastResult);
    }
    
    rooms.set(room.id, room);
  }, VOTING_TIMEOUT);
}

function startChallengeTimer(room) {
  const CHALLENGE_TIMEOUT = 30000; // 30 ثانية
  
  if (room.challengeTimer) {
    clearTimeout(room.challengeTimer);
  }
  
  room.timerStartTime = Date.now();
  room.timerDuration = CHALLENGE_TIMEOUT / 1000;
  
  room.challengeTimer = setTimeout(() => {
    if (room.gameState !== 'challenge' || !room.challenge) return;
    
    // انتهى وقت التحدي
    const spyCorrect = room.challenge.spyAnswer === room.currentWord;
    
    room.gameState = 'finished';
    room.lastResult = {
      winner: spyCorrect ? 'spy' : 'players',
      word: room.currentWord,
      spyWord: room.spyWord,
      spyPlayer: players.get(room.spyId)?.name,
      spyAnswer: room.challenge.spyAnswer,
      isSpyEliminated: !spyCorrect,
      timedOut: true
    };
    
    broadcastToRoom(room.id, 'roundResult', room.lastResult);
    rooms.set(room.id, room);
  }, CHALLENGE_TIMEOUT);
}

function handleSpyChallengeAnswer(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room || room.gameState !== 'challenge' || !room.challenge) return;
  
  if (userId !== room.spyId) {
    return sendToPlayer(userId, 'error', { message: 'أنت لست المندس.' });
  }
  
  const { answer } = data;
  room.challenge.spyAnswer = answer;
  
  const spyCorrect = answer === room.currentWord;
  
  if (room.challengeTimer) {
    clearTimeout(room.challengeTimer);
    room.challengeTimer = null;
  }
  
  room.gameState = 'finished';
  room.lastResult = {
    winner: spyCorrect ? 'spy' : 'players',
    word: room.currentWord,
    spyWord: room.spyWord,
    spyPlayer: players.get(room.spyId)?.name,
    spyAnswer: answer,
    isSpyEliminated: !spyCorrect
  };
  
  broadcastToRoom(room.id, 'roundResult', room.lastResult);
  rooms.set(room.id, room);
  
}

function handleChatMessage(ws, userId, data) {
  const { message } = data;
  const player = players.get(userId);
  
  if (!player) return;
  
  const room = player.roomId ? rooms.get(player.roomId) : null;
  if (!room) return;
  
  // تنظيف الرسالة
  const cleanMessage = message.trim().substring(0, 200);
  if (!cleanMessage) return;
  
  broadcastToRoom(room.id, 'chatMessage', {
    userId: userId,
    playerName: player.name,
    message: cleanMessage,
    timestamp: new Date().toISOString()
  });
  
}

function handleRequestNewRound(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room || room.gameState !== 'finished') return;
  
  const player = players.get(userId);
  if (!player) return;
  
  // إعادة تعيين حالة اللعبة
  room.gameState = 'waiting';
  room.currentRound = 0;
  room.votes = [];
  room.challenge = null;
  room.currentQuestion = 1;
  room.skipToVotingAttempts = 0;
  room.currentWord = null;
  room.spyWord = null;
  room.spyId = null;
  room.lastResult = null;
  
  // إعادة تعيين حالة اللاعبين
  room.players.forEach(pid => {
    const p = players.get(pid);
    if (p) {
      p.isSpy = false;
      p.hasVoted = false;
      players.set(pid, p);
    }
  });
  
  broadcastToRoom(room.id, 'newRoundStarted', {
    players: getPlayersInRoom(room.id)
  });
  
  rooms.set(room.id, room);
}

function handleVoteNewRound(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room || room.gameState !== 'finished') return;
  
  const player = players.get(userId);
  if (!player) return;
  
  // تسجيل صوت اللاعب للجولة الجديدة
  if (!room.newRoundVotes) {
    room.newRoundVotes = [];
  }
  
  if (!room.newRoundVotes.includes(userId)) {
    room.newRoundVotes.push(userId);
  }
  
  // التحقق من موافقة الجميع
  const connectedPlayersCount = room.players.filter(pid => {
    const p = players.get(pid);
    return p && p.isConnected;
  }).length;
  
  if (room.newRoundVotes.length === connectedPlayersCount) {
    // جميع اللاعبين وافقوا على جولة جديدة
    room.gameState = 'waiting';
    room.currentRound = 0;
    room.votes = [];
    room.challenge = null;
    room.currentQuestion = 1;
    room.skipToVotingAttempts = 0;
    room.currentWord = null;
    room.spyWord = null;
    room.spyId = null;
    room.lastResult = null;
    room.newRoundVotes = [];
    
    room.players.forEach(pid => {
      const p = players.get(pid);
      if (p) {
        p.isSpy = false;
        p.hasVoted = false;
        players.set(pid, p);
      }
    });
    
    broadcastToRoom(room.id, 'newRoundStarted', {
      players: getPlayersInRoom(room.id)
    });
  } else {
    // إخطار بعدد الأصوات
    broadcastToRoom(room.id, 'newRoundVoteUpdate', {
      votedCount: room.newRoundVotes.length,
      totalPlayers: connectedPlayersCount
    });
  }
  
  rooms.set(room.id, room);
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
        } else {
          // إذا كانت رسالة عادية، نولد هوية جديدة
          userId = 'user-' + uuidv4();
          sendToPlayer(userId, 'setUserId', { userId: userId }, ws);
        }
      }
      
      
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
      players.set(userId, player);
      
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
                
                rooms.set(room.id, room);
              }
            }, 3000); // ✅ مهلة 3 ثواني
            
          }
          
          broadcastToRoom(player.roomId, 'playerDisconnected', {
            userId: userId,
            playerName: player.name,
            players: getPlayersInRoom(room.id) // ✅ إرسال قائمة اللاعبين المحدثة
          });
          
          // حذف اللاعب تلقائيًا بعد 120 ثانية (دقيقتين) إذا لم يعد الاتصال
          player.disconnectTimer = setTimeout(() => {
            const stillDisconnected = !player.ws;
            if (stillDisconnected) {
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
              }
            }
           }, 120000); // 120 ثانية (دقيقتين)
        }
      }
    }
  });
});

// ============================================
// REST API
// ============================================
// ✅ مسار رئيسية للملفات الثابتة
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
// نظام الإعلانات
// ============================================

const advertisements = [];
let adIdCounter = 1;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// إضافة إعلان جديد
app.post('/api/advertisements', upload.single('image'), (req, res) => {
  const { title, description, link, durationDays } = req.body;
  
  if (!title || !req.file) {
    return res.status(400).json({ error: 'العنوان والصورة مطلوبان' });
  }
  
  const ad = {
    id: adIdCounter++,
    title,
    description,
    link,
    image: req.file.path,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + (durationDays || 7) * 24 * 60 * 60 * 1000),
    views: 0,
    clicks: 0
  };
  
  advertisements.push(ad);
  res.json(ad);
});

// الحصول على الإعلانات النشطة
app.get('/api/advertisements', (req, res) => {
  const now = new Date();
  const activeAds = advertisements.filter(ad => ad.expiresAt > now);
  res.json(activeAds);
});

// تسجيل مشاهدة الإعلان
app.post('/api/advertisements/:id/view', (req, res) => {
  const ad = advertisements.find(a => a.id === parseInt(req.params.id));
  if (ad) {
    ad.views++;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'الإعلان غير موجود' });
  }
});

// تسجيل نقر الإعلان
app.post('/api/advertisements/:id/click', (req, res) => {
  const ad = advertisements.find(a => a.id === parseInt(req.params.id));
  if (ad) {
    ad.clicks++;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'الإعلان غير موجود' });
  }
});

// حذف إعلان
app.delete('/api/advertisements/:id', (req, res) => {
  const index = advertisements.findIndex(a => a.id === parseInt(req.params.id));
  if (index !== -1) {
    advertisements.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'الإعلان غير موجود' });
  }
});

// الإحصائيات
app.get('/api/statistics', (req, res) => {
  const password = req.query.password;
  if (password !== 'Hdmaa1122') {
    return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
  }
  
  res.json({
    onlinePlayers: players.size,
    totalPlayers: players.size,
    advertisements: advertisements.length,
    totalViews: advertisements.reduce((sum, ad) => sum + ad.views, 0),
    totalClicks: advertisements.reduce((sum, ad) => sum + ad.clicks, 0)
  });
});

// ============================================
// بدء الخادم
// ============================================
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  const now = new Date();
  const arabicDate = now.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
});
