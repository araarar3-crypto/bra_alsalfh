import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling']
});

// ============================================
// Middleware
// ============================================
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, '../client/public')));

// ============================================
// نظام Rate Limiting
// ============================================
const rateLimiter = new Map();

function checkRateLimit(socketId, action, limit = 5, window = 1000) {
  const key = `${socketId}:${action}`;
  const now = Date.now();
  
  if (!rateLimiter.has(key)) {
    rateLimiter.set(key, []);
  }
  
  const timestamps = rateLimiter.get(key);
  const recentTimestamps = timestamps.filter(t => now - t < window);
  
  if (recentTimestamps.length >= limit) {
    return false;
  }
  
  recentTimestamps.push(now);
  rateLimiter.set(key, recentTimestamps);
  return true;
}

// تنظيف دوري لـ Rate Limiter
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimiter.entries()) {
    const valid = timestamps.filter(t => now - t < 60000);
    if (valid.length === 0) {
      rateLimiter.delete(key);
    } else {
      rateLimiter.set(key, valid);
    }
  }
}, 60000);

// ============================================
// كلمات اللعبة
// ============================================
const words = {
  saudi_league: [
    { word: 'ناصر الشمراني', alternative: 'مدافع سعودي' },
    { word: 'سلطان الغنام', alternative: 'حارس مرمى' },
    { word: 'محمود كهربا', alternative: 'لاعب مصري' },
    { word: 'عبدالعزيز البيشي', alternative: 'لاعب وسط' },
    { word: 'الهلال', alternative: 'فريق سعودي' },
    { word: 'النصر', alternative: 'فريق الرياض' },
    { word: 'الأهلي', alternative: 'فريق جدة' },
    { word: 'الشباب', alternative: 'فريق الرياض' },
    { word: 'الاتحاد', alternative: 'فريق جدة' },
    { word: 'الفيصلي', alternative: 'فريق الرياض' },
    { word: 'الفتح', alternative: 'فريق الدمام' },
    { word: 'الباطن', alternative: 'فريق الخبر' },
    { word: 'الرائد', alternative: 'فريق الرياض' },
    { word: 'الوحدة', alternative: 'فريق الدمام' },
    { word: 'الحزم', alternative: 'فريق الرياض' },
    { word: 'الفيحاء', alternative: 'فريق الدمام' },
    { word: 'الطائي', alternative: 'فريق الرياض' },
    { word: 'الحد', alternative: 'فريق الدمام' },
    { word: 'أبها', alternative: 'فريق جنوب' },
    { word: 'الخليج', alternative: 'فريق الدمام' },
    { word: 'الاتفاق', alternative: 'فريق الخبر' },
    { word: 'الدعيع', alternative: 'لاعب سعودي' },
    { word: 'الشهراني', alternative: 'لاعب دفاع' },
    { word: 'الفراج', alternative: 'لاعب وسط' },
    { word: 'الجابر', alternative: 'لاعب هجوم' },
    { word: 'الحمد', alternative: 'لاعب سعودي' },
    { word: 'الحارثي', alternative: 'لاعب سعودي' },
    { word: 'الحربي', alternative: 'لاعب سعودي' },
    { word: 'الحسيني', alternative: 'لاعب سعودي' },
    { word: 'الحويل', alternative: 'لاعب سعودي' },
    { word: 'الخالدي', alternative: 'لاعب سعودي' },
    { word: 'الخضيري', alternative: 'لاعب سعودي' },
    { word: 'عبدالرحمن الدعيع', alternative: 'حارس مرمى' },
    { word: 'عبدالله المعيطي', alternative: 'لاعب سعودي قديم' },
    { word: 'محمد النويفي', alternative: 'لاعب سعودي' }
  ],
  foreign_players: [
    { word: 'ليونيل ميسي', alternative: 'لاعب أرجنتيني' },
    { word: 'كريستيانو رونالدو', alternative: 'لاعب برتغالي' },
    { word: 'لويس سواريز', alternative: 'لاعب أوروغواياني' },
    { word: 'لويس أنريكي', alternative: 'لاعب إسباني' },
    { word: 'نيمار', alternative: 'لاعب برازيلي' },
    { word: 'بيليه', alternative: 'لاعب برازيلي أسطوري' },
    { word: 'مارادونا', alternative: 'لاعب أرجنتيني أسطوري' },
    { word: 'زيدان', alternative: 'لاعب فرنسي' },
    { word: 'بيكهام', alternative: 'لاعب إنجليزي' },
    { word: 'رونالدينهو', alternative: 'لاعب برازيلي' },
    { word: 'روبرت لويس', alternative: 'لاعب ألماني' },
    { word: 'ريان جيجز', alternative: 'لاعب ويلزي' },
    { word: 'تيبو هنري', alternative: 'لاعب فرنسي' },
    { word: 'رافائيل نادال', alternative: 'لاعب إسباني' },
    { word: 'ديفيد بيكهام', alternative: 'لاعب إنجليزي' },
    { word: 'بيتر تشيخ', alternative: 'لاعب روسي' },
    { word: 'كارلوس تيفيز', alternative: 'لاعب أرجنتيني' },
    { word: 'ديييجو مارادونا', alternative: 'أسطورة كرة قدم' },
    { word: 'جورج بيست', alternative: 'لاعب إيرلندي' },
    { word: 'بوبي مور', alternative: 'لاعب إنجليزي' },
    { word: 'جون تيري', alternative: 'لاعب إنجليزي' },
    { word: 'ريو فرديناند', alternative: 'لاعب إنجليزي' },
    { word: 'باتريك فييرا', alternative: 'لاعب فرنسي' },
    { word: 'رويال كيين', alternative: 'لاعب هولندي' },
    { word: 'ياب ستام', alternative: 'لاعب هولندي' },
    { word: 'جيانلويجي بوفون', alternative: 'حارس مرمى إيطالي' },
    { word: 'إدوين فان در سار', alternative: 'حارس مرمى هولندي' },
    { word: 'بيتر شميشل', alternative: 'حارس مرمى تشيكي' },
    { word: 'ماركو فان باستن', alternative: 'لاعب هولندي' },
    { word: 'جون كروي', alternative: 'لاعب هولندي' },
    { word: 'جوزيه مورينيو', alternative: 'مدرب برتغالي' },
    { word: 'أرسين فينجر', alternative: 'مدرب فرنسي' },
    { word: 'سير أليكس فيرجسون', alternative: 'مدرب اسكتلندي' },
    { word: 'بيب جوارديولا', alternative: 'مدرب إسباني' },
    { word: 'كارلو أنشيلوتي', alternative: 'مدرب إيطالي' }
  ],
  cars: [
    { word: 'تويوتا', alternative: 'ماركة يابانية' },
    { word: 'بي إم دبليو', alternative: 'ماركة ألمانية' },
    { word: 'مرسيدس', alternative: 'ماركة ألمانية' },
    { word: 'أودي', alternative: 'ماركة ألمانية' },
    { word: 'فولكس فاغن', alternative: 'ماركة ألمانية' },
    { word: 'فيراري', alternative: 'ماركة إيطالية' },
    { word: 'لامبورغيني', alternative: 'ماركة إيطالية' },
    { word: 'بورشه', alternative: 'ماركة ألمانية' },
    { word: 'رولز رويس', alternative: 'ماركة بريطانية' },
    { word: 'بنتلي', alternative: 'ماركة بريطانية' },
    { word: 'جاغوار', alternative: 'ماركة بريطانية' },
    { word: 'رنج روفر', alternative: 'ماركة بريطانية' },
    { word: 'هيونداي', alternative: 'ماركة كورية' },
    { word: 'كيا', alternative: 'ماركة كورية' },
    { word: 'نيسان', alternative: 'ماركة يابانية' },
    { word: 'هوندا', alternative: 'ماركة يابانية' },
    { word: 'مازدا', alternative: 'ماركة يابانية' },
    { word: 'سوبارو', alternative: 'ماركة يابانية' },
    { word: 'ميتسوبيشي', alternative: 'ماركة يابانية' },
    { word: 'فولفو', alternative: 'ماركة سويدية' },
    { word: 'ساب', alternative: 'ماركة سويدية' },
    { word: 'رينو', alternative: 'ماركة فرنسية' },
    { word: 'بيجو', alternative: 'ماركة فرنسية' },
    { word: 'سيتروين', alternative: 'ماركة فرنسية' },
    { word: 'فيات', alternative: 'ماركة إيطالية' },
    { word: 'ألفا روميو', alternative: 'ماركة إيطالية' },
    { word: 'لانشيا', alternative: 'ماركة إيطالية' },
    { word: 'جنرال موتورز', alternative: 'شركة أمريكية' },
    { word: 'فورد', alternative: 'ماركة أمريكية' },
    { word: 'شيفروليه', alternative: 'ماركة أمريكية' },
    { word: 'دودج', alternative: 'ماركة أمريكية' },
    { word: 'جيب', alternative: 'ماركة أمريكية' },
    { word: 'تيسلا', alternative: 'ماركة أمريكية كهربائية' },
    { word: 'بيك أب', alternative: 'نوع سيارة' },
    { word: 'سيدان', alternative: 'نوع سيارة' }
  ],
  food_detailed: [
    { word: 'الكبسة', alternative: 'أكلة عربية' },
    { word: 'الفلافل', alternative: 'أكلة عربية' },
    { word: 'الحمص', alternative: 'أكلة عربية' },
    { word: 'الفتوش', alternative: 'سلطة عربية' },
    { word: 'الشاورما', alternative: 'أكلة عربية' },
    { word: 'الكنافة', alternative: 'حلوى عربية' },
    { word: 'البقلاوة', alternative: 'حلوى عربية' },
    { word: 'الزلابية', alternative: 'حلوى عربية' },
    { word: 'المقلوبة', alternative: 'أكلة عربية' },
    { word: 'الفرن', alternative: 'أكلة عربية' },
    { word: 'الملوخية', alternative: 'أكلة عربية' },
    { word: 'الفتة', alternative: 'أكلة عربية' },
    { word: 'الفول', alternative: 'أكلة عربية' },
    { word: 'الطعمية', alternative: 'أكلة مصرية' },
    { word: 'الكشري', alternative: 'أكلة مصرية' },
    { word: 'الكنافة بالقشطة', alternative: 'حلوى عربية' },
    { word: 'الحلويات الشرقية', alternative: 'حلوى عربية' },
    { word: 'المعمول', alternative: 'حلوى عربية' },
    { word: 'الغريبة', alternative: 'حلوى عربية' },
    { word: 'الشعيرية', alternative: 'حلوى عربية' },
    { word: 'الكيك', alternative: 'حلوى غربية' },
    { word: 'الآيس كريم', alternative: 'حلوى باردة' },
    { word: 'الشوكولاتة', alternative: 'حلوى' },
    { word: 'الحلقوم', alternative: 'حلوى عربية' },
    { word: 'الجيلي', alternative: 'حلوى باردة' },
    { word: 'الفشار', alternative: 'وجبة خفيفة' },
    { word: 'الفطائر', alternative: 'أكلة عربية' },
    { word: 'الخبز', alternative: 'طعام أساسي' },
    { word: 'الجبن', alternative: 'منتج ألبان' },
    { word: 'الزبدة', alternative: 'منتج ألبان' },
    { word: 'الحليب', alternative: 'منتج ألبان' },
    { word: 'الزيت', alternative: 'دهن' },
    { word: 'الملح', alternative: 'توابل' },
    { word: 'الفلفل', alternative: 'توابل' },
    { word: 'الثوم', alternative: 'توابل' }
  ],
  drinks: [
    { word: 'القهوة العربية', alternative: 'مشروب ساخن' },
    { word: 'الشاي', alternative: 'مشروب ساخن' },
    { word: 'القهوة بالحليب', alternative: 'مشروب ساخن' },
    { word: 'الكابتشينو', alternative: 'مشروب ساخن' },
    { word: 'الإسبريسو', alternative: 'مشروب ساخن' },
    { word: 'الشوكولاتة الساخنة', alternative: 'مشروب ساخن' },
    { word: 'القرفة', alternative: 'مشروب ساخن' },
    { word: 'الزنجبيل', alternative: 'مشروب ساخن' },
    { word: 'النعناع', alternative: 'مشروب ساخن' },
    { word: 'الليمون الساخن', alternative: 'مشروب ساخن' },
    { word: 'العصير الطازج', alternative: 'مشروب بارد' },
    { word: 'عصير البرتقال', alternative: 'مشروب بارد' },
    { word: 'عصير التفاح', alternative: 'مشروب بارد' },
    { word: 'عصير الليمون', alternative: 'مشروب بارد' },
    { word: 'الشربة', alternative: 'مشروب بارد' },
    { word: 'الكمبوت', alternative: 'مشروب بارد' },
    { word: 'الماء', alternative: 'مشروب أساسي' },
    { word: 'الحليب البارد', alternative: 'مشروب بارد' },
    { word: 'اللبن', alternative: 'مشروب بارد' },
    { word: 'الزبادي', alternative: 'مشروب بارد' },
    { word: 'الكولا', alternative: 'مشروب غازي' },
    { word: 'الفانتا', alternative: 'مشروب غازي' },
    { word: 'السبرايت', alternative: 'مشروب غازي' },
    { word: 'البيبسي', alternative: 'مشروب غازي' },
    { word: 'الجنجر إيل', alternative: 'مشروب غازي' },
    { word: 'الآيس تي', alternative: 'مشروب بارد' },
    { word: 'القهوة المثلجة', alternative: 'مشروب بارد' },
    { word: 'الميلك شيك', alternative: 'مشروب بارد' },
    { word: 'الكوكتيل', alternative: 'مشروب' },
    { word: 'الموهيتو', alternative: 'مشروب' },
    { word: 'الكومبوتة', alternative: 'مشروب' },
    { word: 'الشراب', alternative: 'مشروب' },
    { word: 'الرمان', alternative: 'عصير' },
    { word: 'التمر الهندي', alternative: 'عصير' },
    { word: 'الكركديه', alternative: 'مشروب بارد' }
  ],
  objects: [
    { word: 'الطاولة', alternative: 'أثاث' },
    { word: 'الكرسي', alternative: 'أثاث' },
    { word: 'السرير', alternative: 'أثاث' },
    { word: 'الدولاب', alternative: 'أثاث' },
    { word: 'الرف', alternative: 'أثاث' },
    { word: 'المرآة', alternative: 'أداة' },
    { word: 'المصباح', alternative: 'أداة إضاءة' },
    { word: 'الثلاجة', alternative: 'جهاز كهربائي' },
    { word: 'الفرن', alternative: 'جهاز كهربائي' },
    { word: 'الميكروويف', alternative: 'جهاز كهربائي' },
    { word: 'الغسالة', alternative: 'جهاز كهربائي' },
    { word: 'المكيف', alternative: 'جهاز كهربائي' },
    { word: 'المروحة', alternative: 'جهاز كهربائي' },
    { word: 'التلفاز', alternative: 'جهاز كهربائي' },
    { word: 'الراديو', alternative: 'جهاز كهربائي' },
    { word: 'الهاتف', alternative: 'جهاز اتصالات' },
    { word: 'الحاسوب', alternative: 'جهاز إلكتروني' },
    { word: 'الطابعة', alternative: 'جهاز إلكتروني' },
    { word: 'الماوس', alternative: 'جهاز إلكتروني' },
    { word: 'لوحة المفاتيح', alternative: 'جهاز إلكتروني' },
    { word: 'الشاشة', alternative: 'جهاز عرض' },
    { word: 'الساعة', alternative: 'أداة قياس الوقت' },
    { word: 'الكاميرا', alternative: 'جهاز تصوير' },
    { word: 'الميكروفون', alternative: 'جهاز صوت' },
    { word: 'السماعة', alternative: 'جهاز صوت' },
    { word: 'الكتاب', alternative: 'وسيلة معلومات' },
    { word: 'الدفتر', alternative: 'وسيلة كتابة' },
    { word: 'القلم', alternative: 'أداة كتابة' },
    { word: 'الممحاة', alternative: 'أداة' },
    { word: 'المسطرة', alternative: 'أداة قياس' },
    { word: 'الحقيبة', alternative: 'حاوية' },
    { word: 'الصندوق', alternative: 'حاوية' },
    { word: 'الباب', alternative: 'جزء من البناء' },
    { word: 'النافذة', alternative: 'جزء من البناء' },
    { word: 'السقف', alternative: 'جزء من البناء' }
  ],
  video_games: [
    { word: 'فورت نايت', alternative: 'لعبة فيديو' },
    { word: 'بابجي', alternative: 'لعبة فيديو' },
    { word: 'ماين كرافت', alternative: 'لعبة فيديو' },
    { word: 'جراند ثيفت أوتو', alternative: 'لعبة فيديو' },
    { word: 'كول أوف ديوتي', alternative: 'لعبة فيديو' },
    { word: 'فيفا', alternative: 'لعبة كرة قدم' },
    { word: 'إيفو', alternative: 'لعبة كرة قدم' },
    { word: 'ليج أوف ليجندز', alternative: 'لعبة فيديو' },
    { word: 'دوتا 2', alternative: 'لعبة فيديو' },
    { word: 'ريد ديد ريدمبشن', alternative: 'لعبة فيديو' },
    { word: 'ساكس', alternative: 'لعبة فيديو' },
    { word: 'هالو', alternative: 'لعبة فيديو' },
    { word: 'ديسكاونت داجيون', alternative: 'لعبة فيديو' },
    { word: 'ستاركيو', alternative: 'لعبة فيديو' },
    { word: 'سكايريم', alternative: 'لعبة فيديو' },
    { word: 'ويتشر', alternative: 'لعبة فيديو' },
    { word: 'سايبرباك', alternative: 'لعبة فيديو' },
    { word: 'ديس أونورد', alternative: 'لعبة فيديو' },
    { word: 'بيوشوك', alternative: 'لعبة فيديو' },
    { word: 'بورتال', alternative: 'لعبة فيديو' },
    { word: 'سليندر', alternative: 'لعبة فيديو' },
    { word: 'أوفرواتش', alternative: 'لعبة فيديو' },
    { word: 'ديسيني', alternative: 'لعبة فيديو' },
    { word: 'فالنت', alternative: 'لعبة فيديو' },
    { word: 'أبكس ليجندز', alternative: 'لعبة فيديو' },
    { word: 'بيتل رويال', alternative: 'نمط لعبة' },
    { word: 'إم إم أو آر بي جي', alternative: 'نمط لعبة' },
    { word: 'آر بي جي', alternative: 'نمط لعبة' },
    { word: 'إف بي إس', alternative: 'نمط لعبة' },
    { word: 'استراتيجي', alternative: 'نمط لعبة' },
    { word: 'بلايستيشن', alternative: 'جهاز ألعاب' },
    { word: 'إكس بوكس', alternative: 'جهاز ألعاب' },
    { word: 'نينتندو', alternative: 'جهاز ألعاب' },
    { word: 'بي سي', alternative: 'جهاز ألعاب' },
    { word: 'موبايل', alternative: 'جهاز ألعاب' }
  ],
  restaurants: [
    { word: 'ماكدونالدز', alternative: 'مطعم برجر' },
    { word: 'كنتاكي', alternative: 'مطعم دجاج' },
    { word: 'بيتزا هت', alternative: 'مطعم بيتزا' },
    { word: 'دومينوز', alternative: 'مطعم بيتزا' },
    { word: 'سوبوي', alternative: 'مطعم ساندويتش' },
    { word: 'برجر كينج', alternative: 'مطعم برجر' },
    { word: 'وندز', alternative: 'مطعم برجر' },
    { word: 'أربيز', alternative: 'مطعم لحم' },
    { word: 'تاكو بيل', alternative: 'مطعم مكسيكي' },
    { word: 'تشيليز', alternative: 'مطعم أمريكي' },
    { word: 'أوليفز جاردن', alternative: 'مطعم إيطالي' },
    { word: 'ريد لوبستر', alternative: 'مطعم مأكولات بحرية' },
    { word: 'ستيك هاوس', alternative: 'مطعم لحم' },
    { word: 'شاهي بهار', alternative: 'مطعم هندي' },
    { word: 'الشامي', alternative: 'مطعم عربي' },
    { word: 'الفرن', alternative: 'مطعم عربي' },
    { word: 'البيت الشامي', alternative: 'مطعم عربي' },
    { word: 'الريجة', alternative: 'مطعم عربي' },
    { word: 'نور الشام', alternative: 'مطعم عربي' },
    { word: 'بيت الحلال', alternative: 'مطعم عربي' },
    { word: 'الشرقية', alternative: 'مطعم عربي' },
    { word: 'الشرق الأوسط', alternative: 'مطعم عربي' },
    { word: 'ساكي', alternative: 'مطعم ياباني' },
    { word: 'تايم آوت', alternative: 'مطعم آسيوي' },
    { word: 'ووك', alternative: 'مطعم آسيوي' },
    { word: 'بانكوك', alternative: 'مطعم تايلاندي' },
    { word: 'بيتشيا', alternative: 'مطعم إيطالي' },
    { word: 'بيتزا إن', alternative: 'مطعم بيتزا' },
    { word: 'فرانشيسكا', alternative: 'مطعم إيطالي' },
    { word: 'شيبوتل', alternative: 'مطعم مكسيكي' },
    { word: 'كويسوبا', alternative: 'مطعم مكسيكي' },
    { word: 'باندا إكسبريس', alternative: 'مطعم صيني' },
    { word: 'بيف آند تشيز', alternative: 'مطعم برجر' },
    { word: 'فاست فود', alternative: 'نوع مطعم' },
    { word: 'مطعم فاخر', alternative: 'نوع مطعم' }
  ],
  cafes: [
    { word: 'ستاربكس', alternative: 'كافيه' },
    { word: 'كوستا', alternative: 'كافيه' },
    { word: 'نسبريسو', alternative: 'كافيه' },
    { word: 'كافيه كوفي', alternative: 'كافيه' },
    { word: 'بيت القهوة', alternative: 'كافيه' },
    { word: 'قهوة الشرقية', alternative: 'كافيه عربي' },
    { word: 'القهوة السوداء', alternative: 'كافيه' },
    { word: 'كافيه الأرابيسك', alternative: 'كافيه عربي' },
    { word: 'مقهى البيت', alternative: 'كافيه عربي' },
    { word: 'قهوة الحي', alternative: 'كافيه عربي' },
    { word: 'الكافيه الأسود', alternative: 'كافيه' },
    { word: 'تاون كافيه', alternative: 'كافيه' },
    { word: 'كافيه ديلايت', alternative: 'كافيه' },
    { word: 'كافيه جاردن', alternative: 'كافيه' },
    { word: 'كافيه كورنر', alternative: 'كافيه' },
    { word: 'بريو', alternative: 'كافيه' },
    { word: 'لافاتا', alternative: 'كافيه' },
    { word: 'إسبريسو بار', alternative: 'كافيه' },
    { word: 'كافيه كلاسيك', alternative: 'كافيه' },
    { word: 'كافيه موسيقى', alternative: 'كافيه' },
    { word: 'كافيه ليل', alternative: 'كافيه' },
    { word: 'كافيه نهار', alternative: 'كافيه' },
    { word: 'كافيه صباح', alternative: 'كافيه' },
    { word: 'كافيه عصر', alternative: 'كافيه' },
    { word: 'كافيه ليلة', alternative: 'كافيه' },
    { word: 'كافيه جديد', alternative: 'كافيه' },
    { word: 'كافيه قديم', alternative: 'كافيه' },
    { word: 'كافيه شعبي', alternative: 'كافيه' },
    { word: 'كافيه فاخر', alternative: 'كافيه' },
    { word: 'كافيه بسيط', alternative: 'كافيه' },
    { word: 'كافيه صغير', alternative: 'كافيه' },
    { word: 'كافيه كبير', alternative: 'كافيه' },
    { word: 'كافيه وسط', alternative: 'كافيه' },
    { word: 'كافيه طريق', alternative: 'كافيه' },
    { word: 'كافيه ساحة', alternative: 'كافيه' }
  ],
  mix: [
    { word: 'الهلال', alternative: 'فريق سعودي' },
    { word: 'ميسي', alternative: 'لاعب أرجنتيني' },
    { word: 'تويوتا', alternative: 'ماركة سيارة' },
    { word: 'الكبسة', alternative: 'أكلة عربية' },
    { word: 'القهوة', alternative: 'مشروب ساخن' },
    { word: 'الطاولة', alternative: 'أثاث' },
    { word: 'فورت نايت', alternative: 'لعبة فيديو' },
    { word: 'ماكدونالدز', alternative: 'مطعم برجر' },
    { word: 'ستاربكس', alternative: 'كافيه' },
    { word: 'رونالدو', alternative: 'لاعب برتغالي' },
    { word: 'الشاورما', alternative: 'أكلة عربية' },
    { word: 'الشاي', alternative: 'مشروب ساخن' },
    { word: 'الكرسي', alternative: 'أثاث' },
    { word: 'ماين كرافت', alternative: 'لعبة فيديو' },
    { word: 'كنتاكي', alternative: 'مطعم دجاج' },
    { word: 'كوستا', alternative: 'كافيه' },
    { word: 'النصر', alternative: 'فريق سعودي' },
    { word: 'نيمار', alternative: 'لاعب برازيلي' },
    { word: 'مرسيدس', alternative: 'ماركة سيارة' },
    { word: 'الفلافل', alternative: 'أكلة عربية' },
    { word: 'الحليب', alternative: 'مشروب' },
    { word: 'السرير', alternative: 'أثاث' },
    { word: 'جراند ثيفت', alternative: 'لعبة فيديو' },
    { word: 'بيتزا هت', alternative: 'مطعم بيتزا' },
    { word: 'نسبريسو', alternative: 'كافيه' },
    { word: 'الاتحاد', alternative: 'فريق سعودي' },
    { word: 'زيدان', alternative: 'لاعب فرنسي' },
    { word: 'بي إم دبليو', alternative: 'ماركة سيارة' },
    { word: 'الحمص', alternative: 'أكلة عربية' },
    { word: 'عصير البرتقال', alternative: 'مشروب بارد' },
    { word: 'الدولاب', alternative: 'أثاث' },
    { word: 'كول أوف ديوتي', alternative: 'لعبة فيديو' },
    { word: 'سوبوي', alternative: 'مطعم ساندويتش' },
    { word: 'بيت القهوة', alternative: 'كافيه عربي' },
    { word: 'الفيصلي', alternative: 'فريق سعودي' }
  ]
};

// ============================================
// خريطة تحويل الفئات
// ============================================
const categoryMapping = {
  'الدوري السعودي': 'saudi_league',
  'دوري السعودي': 'saudi_league',
  'saudi_league': 'saudi_league',
  'اللاعبين الأجانب': 'foreign_players',
  'لاعبين أجانب': 'foreign_players',
  'foreign_players': 'foreign_players',
  'السيارات': 'cars',
  'سيارات': 'cars',
  'cars': 'cars',
  'الطعام': 'food_detailed',
  'طعام': 'food_detailed',
  'food_detailed': 'food_detailed',
  'المشروبات': 'drinks',
  'مشروبات': 'drinks',
  'drinks': 'drinks',
  'الجمادات': 'objects',
  'جمادات': 'objects',
  'objects': 'objects',
  'ألعاب الفيديو': 'video_games',
  'العاب الفيديو': 'video_games',
  'العاب فيديو': 'video_games',
  'video_games': 'video_games',
  'المطاعم': 'restaurants',
  'مطاعم': 'restaurants',
  'restaurants': 'restaurants',
  'المقاهي': 'cafes',
  'مقاهي': 'cafes',
  'cafes': 'cafes',
  'المكس': 'mix',
  'مكس': 'mix',
  'mix': 'mix'
};

// ============================================
// دالة تحويل اسم الفئة
// ============================================
function normalizeCategoryName(categoryName) {
  if (!categoryName) return 'mix';
  const trimmed = categoryName.trim();
  const mapped = categoryMapping[trimmed];
  if (mapped && words[mapped] && words[mapped].length > 0) {
    return mapped;
  }
  return 'mix';
}

// ============================================
// دالة اختيار الكلمة - محسّنة وآمنة
// ============================================
function getRandomWord(category) {
  const normalizedCategory = normalizeCategoryName(category);
  const categoryWords = words[normalizedCategory];
  
  if (!categoryWords || categoryWords.length === 0) {
    let allWords = [];
    Object.values(words).forEach(w => {
      if (w && w.length > 0) {
        allWords.push(...w);
      }
    });
    if (allWords.length === 0) {
      return { word: 'كلمة', alternative: 'بديل' };
    }
    return allWords[Math.floor(Math.random() * allWords.length)];
  }
  
  const randomIndex = Math.floor(Math.random() * categoryWords.length);
  return categoryWords[randomIndex];
}

// ============================================
// إدارة الغرف والجلسات
// ============================================
const roomsById = new Map();
const roomsByCode = new Map();
const playerSessions = new Map(); // تتبع جلسات اللاعبين
const roomTimers = new Map();
const inactivityTimers = new Map();

function generateRoomCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

function deleteRoom(roomId, roomCode) {
  const room = roomsById.get(roomId);
  
  // تنظيف جلسات اللاعبين
  if (room && room.players) {
    room.players.forEach(player => {
      playerSessions.delete(player.id);
    });
  }
  
  roomsById.delete(roomId);
  if (roomCode) roomsByCode.delete(roomCode);
  
  if (roomTimers.has(roomId)) {
    clearTimeout(roomTimers.get(roomId));
    roomTimers.delete(roomId);
  }
  
  if (inactivityTimers.has(roomId)) {
    clearTimeout(inactivityTimers.get(roomId));
    inactivityTimers.delete(roomId);
  }
}

// ============================================
// REST API Endpoints
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toLocaleString('ar-SA') });
});

app.get('/api/rooms', (req, res) => {
  const publicRooms = Array.from(roomsById.values())
    .filter(r => r.isPublic && r.status === 'waiting')
    .map(r => ({
      id: r.id,
      name: r.name,
      playerCount: r.players.length,
      maxPlayers: r.maxPlayers,
      category: r.category
    }));
  res.json(publicRooms);
});

// ============================================
// Socket.io Events
// ============================================
io.on('connection', (socket) => {
  console.log(`✅ مستخدم جديد: ${socket.id}`);

  socket.on('createRoom', (data) => {
    try {
      // التحقق من صحة البيانات
      if (!data.userId || !data.displayName || !data.roomName) {
        socket.emit('error', { message: 'بيانات ناقصة' });
        return;
      }
      
      // التحقق من اسم اللاعب
      const playerName = data.displayName.trim();
      if (!playerName || playerName.length === 0 || playerName.length > 20) {
        socket.emit('error', { message: 'اسم اللاعب غير صحيح' });
        return;
      }
      
      const roomId = uuidv4();
      const roomCode = generateRoomCode();
      const normalizedCategory = normalizeCategoryName(data.category);
      
      const room = {
        id: roomId,
        code: roomCode,
        name: data.roomName,
        maxPlayers: data.maxPlayers || 6,
        category: normalizedCategory,
        isPublic: data.isPublic || false,
        creatorId: data.userId, // ✅ حفظ معرّف المنشئ
        players: [{
          id: data.userId,
          name: playerName,
          socketId: socket.id
        }],
        status: 'waiting',
        currentQuestionPlayer: 0,
        word: null,
        spyWord: null,
        spyPlayerId: null,
        votes: new Map(),
        gameStartTime: null,
        roundStartTime: Date.now() // ✅ تتبع وقت بدء الجولة
      };
      
      roomsById.set(roomId, room);
      roomsByCode.set(roomCode, room);
      playerSessions.set(data.userId, { roomId, socketId: socket.id }); // ✅ حفظ جلسة اللاعب
      
      socket.join(roomId);
      socket.emit('roomCreated', {
        roomId,
        roomCode,
        room
      });
      
      io.to(roomId).emit('playerJoined', {
        players: room.players
      });
    } catch (error) {
      console.error('خطأ في إنشاء الغرفة:', error);
      socket.emit('error', { message: 'خطأ في إنشاء الغرفة' });
    }
  });

  socket.on('joinRoom', (data) => {
    try {
      if (!data.userId || !data.displayName) {
        socket.emit('error', { message: 'بيانات ناقصة' });
        return;
      }
      
      const playerName = data.displayName.trim();
      if (!playerName || playerName.length === 0 || playerName.length > 20) {
        socket.emit('error', { message: 'اسم اللاعب غير صحيح' });
        return;
      }
      
      let room = null;
      
      if (data.roomId) {
        room = roomsById.get(data.roomId);
      } else if (data.roomCode) {
        room = roomsByCode.get(data.roomCode.toUpperCase());
      }
      
      if (!room) {
        socket.emit('error', { message: 'الغرفة غير موجودة' });
        return;
      }
      
      if (room.status !== 'waiting') {
        socket.emit('error', { message: 'اللعبة قد بدأت بالفعل' });
        return;
      }
      
      if (room.players.length >= room.maxPlayers) {
        socket.emit('error', { message: 'الغرفة ممتلئة' });
        return;
      }
      
      // ✅ التحقق من عدم تكرار اللاعب
      if (room.players.some(p => p.id === data.userId)) {
        socket.emit('error', { message: 'أنت بالفعل في هذه الغرفة' });
        return;
      }
      
      room.players.push({
        id: data.userId,
        name: playerName,
        socketId: socket.id
      });
      
      playerSessions.set(data.userId, { roomId: room.id, socketId: socket.id }); // ✅ حفظ جلسة اللاعب
      
      socket.join(room.id);
      socket.emit('joinedRoom', {
        roomId: room.id,
        roomCode: room.code,
        players: room.players,
        creatorId: room.creatorId // ✅ إرسال معرّف المنشئ
      });
      
      io.to(room.id).emit('playerJoined', {
        players: room.players
      });
    } catch (error) {
      console.error('خطأ في الانضمام:', error);
      socket.emit('error', { message: 'خطأ في الانضمام للغرفة' });
    }
  });

  socket.on('startGame', (data) => {
    try {
      const rooms = Array.from(roomsById.values());
      const room = rooms.find(r => r.players.some(p => p.socketId === socket.id));
      
      if (!room) {
        socket.emit('error', { message: 'لم يتم العثور على الغرفة' });
        return;
      }
      
      // ✅ التحقق من أن المستخدم هو منشئ الغرفة
      if (data.userId !== room.creatorId) {
        socket.emit('error', { message: 'فقط منشئ الغرفة يمكنه بدء اللعبة' });
        return;
      }
      
      // ✅ التحقق من عدد اللاعبين
      if (room.players.length < 3) {
        socket.emit('error', { message: 'يجب أن يكون هناك 3 لاعبين على الأقل' });
        return;
      }
      
      room.status = 'playing';
      room.currentQuestionPlayer = 0;
      room.gameStartTime = Date.now(); // ✅ تحديث وقت بدء اللعبة
      
      const wordData = getRandomWord(room.category);
      if (!wordData || !wordData.word) {
        socket.emit('error', { message: 'خطأ في تحميل الكلمات' });
        return;
      }
      
      room.word = wordData.word;
      room.spyWord = wordData.alternative;
      
      const spyIndex = Math.floor(Math.random() * room.players.length);
      room.spyPlayerId = room.players[spyIndex].id;
      
      // ✅ إرسال الكلمة بشكل منفصل لكل لاعب
      room.players.forEach((player, index) => {
        const isSpy = player.id === room.spyPlayerId;
        const playerSocket = io.sockets.sockets.get(player.socketId);
        if (playerSocket) {
          playerSocket.emit('gameStarted', {
            word: room.word,
            spyWord: room.spyWord,
            isSpy: isSpy,
            players: room.players,
            currentQuestionPlayer: room.currentQuestionPlayer
          });
        }
      });
    } catch (error) {
      console.error('خطأ في بدء اللعبة:', error);
      socket.emit('error', { message: 'خطأ في بدء اللعبة' });
    }
  });

  socket.on('finishQuestion', (data) => {
    try {
      const rooms = Array.from(roomsById.values());
      const room = rooms.find(r => r.players.some(p => p.socketId === socket.id));
      
      if (!room || room.status !== 'playing') {
        return;
      }
      
      room.currentQuestionPlayer = (room.currentQuestionPlayer + 1) % room.players.length;
      
      io.to(room.id).emit('nextQuestion', {
        players: room.players,
        currentQuestionPlayer: room.currentQuestionPlayer
      });
    } catch (error) {
      console.error('خطأ في تحديث السؤال:', error);
    }
  });

  socket.on('vote', (data) => {
    try {
      const rooms = Array.from(roomsById.values());
      const room = rooms.find(r => r.players.some(p => p.socketId === socket.id));
      
      if (!room) return;
      
      // ✅ منع التصويت على النفس
      if (data.voterId === data.targetId) {
        socket.emit('error', { message: 'لا يمكن التصويت على نفسك' });
        return;
      }
      
      room.votes.set(data.voterId, data.targetId);
      
      const votedCount = room.votes.size;
      const totalPlayers = room.players.length;
      
      io.to(room.id).emit('votingProgress', {
        votedCount,
        totalPlayers
      });
      
      if (votedCount === totalPlayers) {
        const voteResults = {};
        for (const [voterId, targetId] of room.votes) {
          voteResults[targetId] = (voteResults[targetId] || 0) + 1;
        }
        
        // ✅ معالجة التعادل بشكل صحيح
        let maxVotes = 0;
        let candidates = [];
        for (const [playerId, voteCount] of Object.entries(voteResults)) {
          if (voteCount > maxVotes) {
            maxVotes = voteCount;
            candidates = [playerId];
          } else if (voteCount === maxVotes) {
            candidates.push(playerId);
          }
        }
        
        const eliminatedId = candidates[Math.floor(Math.random() * candidates.length)];
        const eliminatedPlayer = room.players.find(p => p.id === eliminatedId);
        const isSpyEliminated = eliminatedId === room.spyPlayerId;
        
        room.votes.clear();
        
        io.to(room.id).emit('gameResult', {
          eliminatedPlayer,
          isSpyEliminated,
          word: room.word,
          spyWord: room.spyWord,
          spyPlayer: room.players.find(p => p.id === room.spyPlayerId).name
        });
        
        // ✅ جولة جديدة
        setTimeout(() => {
          room.status = 'waiting';
          room.currentQuestionPlayer = 0;
          room.votes.clear();
          room.roundStartTime = Date.now();
          
          const wordData = getRandomWord(room.category);
          if (wordData && wordData.word) {
            room.word = wordData.word;
            room.spyWord = wordData.alternative;
            const spyIndex = Math.floor(Math.random() * room.players.length);
            room.spyPlayerId = room.players[spyIndex].id;
          }
          
          io.to(room.id).emit('waitingForNextRound', {
            message: 'الجولة القادمة تبدأ بعد قليل...'
          });
          
          setTimeout(() => {
            room.status = 'playing';
            room.gameStartTime = Date.now();
            
            // ✅ إرسال الكلمة بشكل منفصل
            room.players.forEach((player) => {
              const isSpy = player.id === room.spyPlayerId;
              const playerSocket = io.sockets.sockets.get(player.socketId);
              if (playerSocket) {
                playerSocket.emit('gameStarted', {
                  word: room.word,
                  spyWord: room.spyWord,
                  isSpy: isSpy,
                  players: room.players,
                  currentQuestionPlayer: room.currentQuestionPlayer
                });
              }
            });
          }, 3000);
        }, 3000);
      }
    } catch (error) {
      console.error('خطأ في التصويت:', error);
      socket.emit('error', { message: 'خطأ في التصويت' });
    }
  });

  socket.on('ping', () => {
    socket.emit('pong');
  });

  socket.on('disconnect', () => {
    try {
      const rooms = Array.from(roomsById.values());
      const room = rooms.find(r => r.players.some(p => p.socketId === socket.id));
      
      if (room) {
        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIndex !== -1) {
          const player = room.players[playerIndex];
          room.players.splice(playerIndex, 1);
          
          // ✅ عدم حذف جلسة اللاعب فوراً (للسماح بالعودة)
          // playerSessions.delete(player.id);
          
          if (room.players.length === 0) {
            deleteRoom(room.id, room.code);
          } else {
            io.to(room.id).emit('playerLeft', {
              players: room.players
            });
          }
        }
      }
    } catch (error) {
      console.error('خطأ في قطع الاتصال:', error);
    }
  });
});

// ============================================
// تنظيف دوري للغرف القديمة
// ============================================
setInterval(() => {
  const now = Date.now();
  const roomsToDelete = [];
  
  for (const [roomId, room] of roomsById) {
    // ✅ حذف الغرف الخاملة بعد 10 دقائق
    if (room.status === 'waiting' && room.roundStartTime) {
      if (now - room.roundStartTime > 600000) {
        roomsToDelete.push({ id: roomId, code: room.code });
      }
    }
  }
  
  roomsToDelete.forEach(r => deleteRoom(r.id, r.code));
}, 1800000);

// ============================================
// بدء الخادم
// ============================================
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🎮 لعبة برا السالفة تعمل على http://localhost:${PORT}`);
  console.log(`📊 الوقت الحالي: ${new Date().toLocaleString('ar-SA')}`);
});
