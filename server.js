const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


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
app.use(express.static(__dirname));

// Serve index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Index.html'));
});

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
// كلمات اللعبة - محسّنة وبدون تكرارات
// ============================================
const words = {
  saudi_league: [
    { word: 'ناصر الشمراني', alternative: 'مدافع سعودي' },
    { word: 'سلطان الغنام', alternative: 'حارس مرمى' },
    { word: 'محمود كهربا', alternative: 'لاعب مصري' },
    { word: 'عبدالعزيز البيشي', alternative: 'لاعب وسط' },
    { word: 'الهلال', alternative: 'فريق سعودي' },
    { word: 'النصر', alternative: 'فريق رياض' },
    { word: 'الأهلي', alternative: 'فريق جدة' },
    { word: 'الشباب', alternative: 'فريق رياض' },
    { word: 'الاتحاد', alternative: 'فريق جدة' },
    { word: 'الفيصلي', alternative: 'فريق رياض' },
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
    { word: 'الثوم', alternative: 'توابل' },
    { word: 'البهارات', alternative: 'توابل' }
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
// دالة اختيار الكلمة العشوائية - محسّنة
// ============================================
function getRandomWord(category) {
  // التحقق من أن الفئة موجودة
  if (!category || !words[category]) {
    // إذا كانت الفئة غير موجودة أو 'mix'، اختر من جميع الكلمات
    let allWords = [];
    Object.values(words).forEach(w => allWords.push(...w));
    if (allWords.length === 0) return null;
    return allWords[Math.floor(Math.random() * allWords.length)];
  }
  
  // الحصول على الكلمات من الفئة المحددة
  const categoryWords = words[category];
  
  // التحقق من أن الفئة تحتوي على كلمات
  if (!categoryWords || categoryWords.length === 0) {
    return null;
  }
  
  // اختيار كلمة عشوائية من الفئة
  return categoryWords[Math.floor(Math.random() * categoryWords.length)];
}

// ============================================
// باقي الكود (نسخ من الملف الأصلي)
// ============================================
const roomsById = new Map();
const roomsByCode = new Map();
const roomTimers = new Map();
const inactivityTimers = new Map();

function generateRoomCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

function deleteRoom(roomId, roomCode) {
  roomsById.delete(roomId);
  roomsByCode.delete(roomCode);
  
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
    .filter(r => r.isPublic)
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
      const roomId = uuidv4();
      const roomCode = generateRoomCode();
      
      const room = {
        id: roomId,
        code: roomCode,
        name: data.roomName,
        maxPlayers: data.maxPlayers,
        category: data.category || 'mix',
        isPublic: data.isPublic || false,
        players: [{
          id: data.userId,
          name: data.displayName,
          socketId: socket.id
        }],
        status: 'waiting',
        currentQuestionPlayer: 0,
        word: null,
        spyWord: null,
        spyPlayerId: null,
        votes: new Map(),
        gameStartTime: null
      };
      
      roomsById.set(roomId, room);
      roomsByCode.set(roomCode, room);
      
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
      socket.emit('error', { message: 'خطأ في إنشاء الغرفة' });
    }
  });

  socket.on('joinRoom', (data) => {
    try {
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
      
      if (room.players.length >= room.maxPlayers) {
        socket.emit('error', { message: 'الغرفة ممتلئة' });
        return;
      }
      
      room.players.push({
        id: data.userId,
        name: data.displayName,
        socketId: socket.id
      });
      
      socket.join(room.id);
      socket.emit('joinedRoom', {
        roomId: room.id,
        roomCode: room.code,
        players: room.players
      });
      
      io.to(room.id).emit('playerJoined', {
        players: room.players
      });
    } catch (error) {
      socket.emit('error', { message: 'خطأ في الانضمام للغرفة' });
    }
  });

  socket.on('startGame', (data) => {
    try {
      const rooms = Array.from(roomsById.values());
      const room = rooms.find(r => r.players.some(p => p.socketId === socket.id));
      
      if (!room) return;

const creatorId = room.creatorId;
if (!creatorId) {
  socket.emit('error', { message: 'حدث خطأ في بيانات الغرفة' });
  return;
}

if (socket.id !== creatorId) {
  socket.emit('error', { message: 'فقط منشئ الغرفة يمكنه بدء اللعبة' });
  return;
}
if (room.players.length < 3) {
        socket.emit('error', { message: 'يجب أن يكون هناك 3 لاعبين على الأقل' });
        return;
      }
      
      room.status = 'playing';
      room.currentQuestionPlayer = 0;
      
      const wordData = getRandomWord(room.category);
      if (!wordData) {
        socket.emit('error', { message: 'خطأ في تحميل الكلمات' });
        return;
      }
      
      room.word = wordData.word;
      room.spyWord = wordData.alternative;
      
      const spyIndex = Math.floor(Math.random() * room.players.length);
      room.spyPlayerId = room.players[spyIndex].id;
      
      io.to(room.id).emit('gameStarted', {
        word: room.word,
        players: room.players,
        currentQuestionPlayer: room.currentQuestionPlayer,
        isSpy: room.players.map(p => p.id === room.spyPlayerId)
      });
    } catch (error) {
      socket.emit('error', { message: 'خطأ في بدء اللعبة' });
    }
  });

  socket.on('finishQuestion', (data) => {
    try {
      const rooms = Array.from(roomsById.values());
      const room = rooms.find(r => r.players.some(p => p.socketId === socket.id));
      
      if (!room || room.status !== 'playing') return;
      
      room.currentQuestionPlayer = (room.currentQuestionPlayer + 1) % room.players.length;
      
      io.to(room.id).emit('nextQuestion', {
        players: room.players,
        currentQuestionPlayer: room.currentQuestionPlayer
      });
    } catch (error) {
      socket.emit('error', { message: 'خطأ في تحديث السؤال' });
    }
  });

  socket.on('vote', (data) => {
    try {
      const rooms = Array.from(roomsById.values());
      const room = rooms.find(r => r.players.some(p => p.socketId === socket.id));
      
      if (!room) return;
      
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
        
        const eliminatedId = Object.keys(voteResults).reduce((a, b) => 
          voteResults[a] > voteResults[b] ? a : b
        );
        
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
        
        setTimeout(() => {
          room.status = 'waiting';
          room.currentQuestionPlayer = 0;
          room.votes.clear();
          
          const wordData = getRandomWord(room.category);
          if (wordData) {
            room.word = wordData.word;
            room.spyWord = wordData.alternative;
            const spyIndex = Math.floor(Math.random() * room.players.length);
            room.spyPlayerId = room.players[spyIndex].id;
          }
          
          io.to(room.id).emit('waitingForNextRound', {
            message: 'الجولة القادمة تبدأ بعد قليل...'
          });
          
          setTimeout(() => {
            io.to(room.id).emit('gameStarted', {
              word: room.word,
              players: room.players,
              currentQuestionPlayer: room.currentQuestionPlayer,
              isSpy: room.players.map(p => p.id === room.spyPlayerId)
            });
          }, 3000);
        }, 3000);
      }
    } catch (error) {
      socket.emit('error', { message: 'خطأ في التصويت' });
    }
  });

  socket.on('disconnect', () => {
    try {
      const rooms = Array.from(roomsById.values());
      const room = rooms.find(r => r.players.some(p => p.socketId === socket.id));
      
      if (room) {
        room.players = room.players.filter(p => p.socketId !== socket.id);
        
        if (room.players.length === 0) {
          deleteRoom(room.id, room.code);
        } else {
          io.to(room.id).emit('playerLeft', {
            players: room.players
          });
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
    if (room.status === 'waiting' && room.gameStartTime) {
      if (now - room.gameStartTime > 600000) {
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