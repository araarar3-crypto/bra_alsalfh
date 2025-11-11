import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
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

// ============================================
// كلمات اللعبة (تم تحديثها لتشمل الأقسام المطلوبة)
// ============================================
const words = {
  mix: [
    { word: 'الهلال', spyWord: 'فريق كرة قدم' },
    { word: 'الكبسة', spyWord: 'أكلة عربية' },
    { word: 'تويوتا', spyWord: 'ماركة سيارات' },
    { word: 'ميسي', spyWord: 'لاعب كرة قدم' },
    { word: 'القهوة', spyWord: 'مشروب ساخن' },
    { word: 'الجوال', spyWord: 'جهاز إلكتروني' },
    { word: 'الحاسوب', spyWord: 'جهاز إلكتروني' },
    { word: 'الساعة', spyWord: 'جهاز قياس الوقت' },
    { word: 'النظارة', spyWord: 'إكسسوار' },
    { word: 'الحذاء', spyWord: 'ملبس' }
  ],
  saudi_league: [
    { word: 'الهلال', spyWord: 'فريق سعودي' },
    { word: 'النصر', spyWord: 'فريق سعودي' },
    { word: 'الأهلي', spyWord: 'فريق سعودي' },
    { word: 'الاتحاد', spyWord: 'فريق سعودي' },
    { word: 'الشباب', spyWord: 'فريق سعودي' },
    { word: 'التعاون', spyWord: 'فريق سعودي' },
    { word: 'الفيحاء', spyWord: 'فريق سعودي' },
    { word: 'الرائد', spyWord: 'فريق سعودي' },
    { word: 'ضمك', spyWord: 'فريق سعودي' },
    { word: 'الطائي', spyWord: 'فريق سعودي' }
  ],
  foreign_players: [
    { word: 'رونالدو', spyWord: 'لاعب برتغالي' },
    { word: 'بنزيما', spyWord: 'لاعب فرنسي' },
    { word: 'نيمار', spyWord: 'لاعب برازيلي' },
    { word: 'ماني', spyWord: 'لاعب سنغالي' },
    { word: 'كانتي', spyWord: 'لاعب فرنسي' },
    { word: 'فابينيو', spyWord: 'لاعب برازيلي' },
    { word: 'ميتروفيتش', spyWord: 'لاعب صربي' },
    { word: 'مالكوم', spyWord: 'لاعب برازيلي' },
    { word: 'كويلار', spyWord: 'لاعب كولومبي' },
    { word: 'تاليسكا', spyWord: 'لاعب برازيلي' }
  ],
  cars: [
    { word: 'تويوتا', spyWord: 'ماركة يابانية' },
    { word: 'بي إم دبليو', spyWord: 'ماركة ألمانية' },
    { word: 'مرسيدس', spyWord: 'ماركة ألمانية' },
    { word: 'أودي', spyWord: 'ماركة ألمانية' },
    { word: 'فيراري', spyWord: 'ماركة إيطالية' },
    { word: 'لامبورغيني', spyWord: 'ماركة إيطالية' },
    { word: 'بورشه', spyWord: 'ماركة ألمانية' },
    { word: 'رولز رويس', spyWord: 'ماركة بريطانية' },
    { word: 'تيسلا', spyWord: 'ماركة كهربائية' },
    { word: 'نيسان', spyWord: 'ماركة يابانية' }
  ],
  food: [
    { word: 'الكبسة', spyWord: 'أكلة عربية' },
    { word: 'المنسف', spyWord: 'أكلة عربية' },
    { word: 'المندي', spyWord: 'أكلة عربية' },
    { word: 'البيتزا', spyWord: 'أكلة إيطالية' },
    { word: 'الباستا', spyWord: 'أكلة إيطالية' },
    { word: 'البرجر', spyWord: 'وجبة سريعة' },
    { word: 'الشاورما', spyWord: 'وجبة سريعة' },
    { word: 'الفلافل', spyWord: 'وجبة شعبية' },
    { word: 'الهمبرجر', spyWord: 'وجبة سريعة' },
    { word: 'السوشي', spyWord: 'أكلة يابانية' }
  ],
  drinks: [
    { word: 'القهوة', spyWord: 'مشروب ساخن' },
    { word: 'الشاي', spyWord: 'مشروب ساخن' },
    { word: 'العصير', spyWord: 'مشروب بارد' },
    { word: 'الماء', spyWord: 'مشروب أساسي' },
    { word: 'الحليب', spyWord: 'مشروب مغذي' },
    { word: 'البيبسي', spyWord: 'مشروب غازي' },
    { word: 'السفن أب', spyWord: 'مشروب غازي' },
    { word: 'الليمون', spyWord: 'مشروب حمضي' },
    { word: 'البرتقال', spyWord: 'مشروب حمضي' },
    { word: 'الكركديه', spyWord: 'مشروب شعبي' }
  ],
  objects: [
    { word: 'الجوال', spyWord: 'جهاز إلكتروني' },
    { word: 'الحاسوب', spyWord: 'جهاز إلكتروني' },
    { word: 'الساعة', spyWord: 'جهاز قياس الوقت' },
    { word: 'النظارة', spyWord: 'إكسسوار' },
    { word: 'القلم', spyWord: 'أداة كتابة' },
    { word: 'الدفتر', spyWord: 'أداة كتابة' },
    { word: 'الكرسي', spyWord: 'أثاث' },
    { word: 'الطاولة', spyWord: 'أثاث' },
    { word: 'السرير', spyWord: 'أثاث' },
    { word: 'الخزانة', spyWord: 'أثاث' }
  ],
  video_games: [
    { word: 'فورتنايت', spyWord: 'لعبة باتل رويال' },
    { word: 'بابجي', spyWord: 'لعبة باتل رويال' },
    { word: 'كول أوف ديوتي', spyWord: 'لعبة إطلاق نار' },
    { word: 'فيفا', spyWord: 'لعبة كرة قدم' },
    { word: 'ماينكرافت', spyWord: 'لعبة بناء' },
    { word: 'ريد ديد', spyWord: 'لعبة عالم مفتوح' },
    { word: 'جراند ثيفت أوتو', spyWord: 'لعبة عالم مفتوح' },
    { word: 'ذا ويتشر', spyWord: 'لعبة تقمص أدوار' },
    { word: 'سايبربانك', spyWord: 'لعبة تقمص أدوار' },
    { word: 'أساسنز كريد', spyWord: 'لعبة مغامرات' }
  ],
  restaurants: [
    { word: 'ماكدونالدز', spyWord: 'مطعم وجبات سريعة' },
    { word: 'كنتاكي', spyWord: 'مطعم وجبات سريعة' },
    { word: 'البيك', spyWord: 'مطعم وجبات سريعة' },
    { word: 'هارديز', spyWord: 'مطعم وجبات سريعة' },
    { word: 'برجر كنج', spyWord: 'مطعم وجبات سريعة' },
    { word: 'شيك شاك', spyWord: 'مطعم وجبات سريعة' },
    { word: 'فايف جايز', spyWord: 'مطعم وجبات سريعة' },
    { word: 'صب واي', spyWord: 'مطعم سندويشات' },
    { word: 'بيتزا هت', spyWord: 'مطعم بيتزا' },
    { word: 'دومينوز', spyWord: 'مطعم بيتزا' }
  ],
  cafes: [
    { word: 'ستاربكس', spyWord: 'مقهى عالمي' },
    { word: 'دانكن', spyWord: 'مقهى عالمي' },
    { word: 'كوستا', spyWord: 'مقهى عالمي' },
    { word: 'تيم هورتنز', spyWord: 'مقهى عالمي' },
    { word: 'لافازا', spyWord: 'مقهى عالمي' },
    { word: 'بول', spyWord: 'مقهى عالمي' },
    { word: 'كافيه نيرو', spyWord: 'مقهى عالمي' },
    { word: 'جافا تايم', spyWord: 'مقهى محلي' },
    { word: 'كوفي بين', spyWord: 'مقهى عالمي' },
    { word: 'بلاك كوفي', spyWord: 'مقهى محلي' }
  ]
};

// ============================================
// حالة اللعبة
// ============================================
const rooms = new Map();
const players = new Map();

// ============================================
// دوال مساعدة
// ============================================

/**
 * توليد رمز غرفة عشوائي مكون من 6 أحرف
 * @returns {string}
 */
function generateRoomCode() {
  return randomBytes(3).toString('hex').toUpperCase();
}

/**
 * إرسال رسالة إلى لاعب معين
 * @param {string} userId 
 * @param {string} event 
 * @param {object} data 
 */
function sendToPlayer(userId, event, data, ws = null) {
  const player = players.get(userId);
  const socket = ws || (player ? player.ws : null);
  if (socket && socket.readyState === socket.OPEN) {
    socket.send(JSON.stringify({ event, data }));
  }
}

/**
 * إرسال رسالة إلى جميع اللاعبين في الغرفة
 * @param {string} roomId 
 * @param {string} event 
 * @param {object} data 
 */
function broadcastToRoom(roomId, event, data) {
  const room = rooms.get(roomId);
  if (room) {
    room.players.forEach(userId => {
      sendToPlayer(userId, event, data);
    });
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
    return room.players.map(userId => {
      const player = players.get(userId);
      return {
        id: userId,
        name: player.name,
        isSpy: player.isSpy,
        isCreator: player.isCreator,
        votes: room.votes.filter(v => v.targetId === userId).length,
        isChallenged: room.challenge && room.challenge.spyId === userId
      };
    });
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

  // اختيار كلمة مختلفة للمندس، مع تفضيل الكلمات من نفس الفئة الوصفية
  const similarWords = categoryWords.filter(w => w.spyWord === normalWordObject.spyWord && w.word !== normalWord);
  const otherWords = categoryWords.filter(w => w.spyWord !== normalWordObject.spyWord);

  let spyWord;

  if (similarWords.length > 0) {
    // إذا وجدت كلمات مشابهة، اختر واحدة منها
    const spyWordIndex = Math.floor(Math.random() * similarWords.length);
    spyWord = similarWords[spyWordIndex].word;
  } else if (otherWords.length > 0) {
    // إذا لم توجد كلمات مشابهة، اختر كلمة أخرى من نفس الفئة (category)
    const spyWordIndex = Math.floor(Math.random() * otherWords.length);
    spyWord = otherWords[spyWordIndex].word;
  } else {
    // كحل أخير، إذا كانت كل الكلمات متشابهة، اختر أي كلمة أخرى
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
  if (!displayName || !roomName || !category) {
    return sendToPlayer(userId, 'error', { message: 'بيانات الغرفة غير كاملة.' });
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
    maxPlayers: 10
  };
  rooms.set(roomId, newRoom);

  players.set(userId, {
    ws,
    name: displayName,
    roomId,
    isSpy: false,
    isCreator: true,
    hasVoted: false
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
  if (!displayName || !roomCode) {
    return sendToPlayer(userId, 'error', { message: 'بيانات الانضمام غير كاملة.' }, ws);
  }

  const room = Array.from(rooms.values()).find(r => r.roomCode === roomCode);
  if (!room) {
    return sendToPlayer(userId, 'error', { message: 'رمز الغرفة غير صحيح.' }, ws);
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

  room.players.push(userId);
  rooms.set(room.id, room);

  players.set(userId, {
    ws,
    name: displayName,
    roomId: room.id,
    isSpy: false,
    isCreator: false,
    hasVoted: false
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

function handleNewRound(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room) return sendToPlayer(userId, 'error', { message: 'أنت لست في غرفة.' });
  if (room.gameState !== 'finished') return sendToPlayer(userId, 'error', { message: 'لا يمكن بدء جولة جديدة الآن.' });
  if (!players.get(userId).isCreator) return sendToPlayer(userId, 'error', { message: 'فقط منشئ الغرفة يمكنه بدء جولة جديدة.' });

  // إعادة تهيئة الجولة بنفس اللاعبين
  room.gameState = 'inGame';
  room.currentRound++;
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
      currentPlayer: room.players[room.currentPlayerIndex]
    });
  });
  
  rooms.set(room.id, room);
  console.log(`🔄 بدء جولة جديدة في الغرفة ${room.roomCode}. المندس: ${players.get(room.spyId).name}`);
}

function handleStartGame(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room) return sendToPlayer(userId, 'error', { message: 'أنت لست في غرفة.' });
  if (room.players.length < 3) return sendToPlayer(userId, 'error', { message: 'يجب أن يكون هناك 3 لاعبين على الأقل.' });
  if (room.gameState !== 'waiting') return sendToPlayer(userId, 'error', { message: 'اللعبة بدأت بالفعل.' });
  if (!players.get(userId).isCreator) return sendToPlayer(userId, 'error', { message: 'فقط منشئ الغرفة يمكنه بدء اللعبة.' });

  // تهيئة الجولة
  room.gameState = 'inGame';
  room.currentRound = 1;
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
      currentPlayer: room.players[room.currentPlayerIndex]
    });
  });
  
  rooms.set(room.id, room);
  console.log(`✅ بدء اللعبة في الغرفة ${room.roomCode}. المندس: ${players.get(room.spyId).name}`);
}

function handleFinishQuestion(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room || room.gameState !== 'inGame') return;
  
  // التأكد من أن اللاعب الحالي هو من ينهي السؤال
  if (room.players[room.currentPlayerIndex] !== userId) {
    return sendToPlayer(userId, 'error', { message: 'ليس دورك لإنهاء السؤال.' });
  }

  // تسجيل أن اللاعب الحالي قد سأل
  if (!room.playersAsked) {
    room.playersAsked = new Set();
  }
  room.playersAsked.add(userId);
  
  // الانتقال للاعب التالي
  room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;
  
  // التحقق من أن جميع اللاعبين قد سألوا
  if (room.playersAsked.size >= room.players.length) {
    // نهاية مرحلة الأسئلة، الانتقال للتصويت
    room.gameState = 'voting';
    room.playersAsked = new Set(); // إعادة تعيين
    broadcastToRoom(room.id, 'votingPhase', { players: getPlayersInRoom(room.id) });
    console.log(`🗳️ الغرفة ${room.roomCode} دخلت مرحلة التصويت.`);
  } else {
    // الانتقال للسؤال التالي
    broadcastToRoom(room.id, 'nextQuestion', {
      currentPlayer: room.players[room.currentPlayerIndex]
    });
  }
  
  rooms.set(room.id, room);
}

function handleVote(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  const player = players.get(userId);
  if (!room || room.gameState !== 'voting' || !player) return;
  if (player.hasVoted) return sendToPlayer(userId, 'error', { message: 'لقد صوتت بالفعل.' });
  
  const { targetId } = data;
  if (!room.players.includes(targetId)) return sendToPlayer(userId, 'error', { message: 'الهدف غير موجود.' });
  
  room.votes.push({ voterId: userId, targetId });
  player.hasVoted = true;
  
  // إرسال تحديث التصويت لجميع اللاعبين
  broadcastToRoom(room.id, 'voteUpdate', {
    players: getPlayersInRoom(room.id)
  });

  // التحقق من اكتمال التصويت
  if (room.votes.length === room.players.length) {
    // حساب الأصوات
    const voteCounts = room.votes.reduce((acc, vote) => {
      acc[vote.targetId] = (acc[vote.targetId] || 0) + 1;
      return acc;
    }, {});
    
    const maxVotes = Math.max(...Object.values(voteCounts));
    const votedPlayerId = Object.keys(voteCounts).find(id => voteCounts[id] === maxVotes);
    
    if (votedPlayerId === room.spyId) {
      // المندس انكشف، الآن تحدي الكلمات
      room.gameState = 'challenge';
      
      const challengeWords = generateChallengeWords(room.category, room.currentWord);
      room.challenge = {
        spyId: room.spyId,
        words: challengeWords,
        correctWord: room.currentWord,
        spyAnswer: null,
        status: null // win, lose
      };
      
      // إرسال التحدي للمندس
      sendToPlayer(room.spyId, 'spyChallenge', {
        words: challengeWords
      });
      
      // إرسال رسالة انتظار للآخرين
      room.players.filter(pid => pid !== room.spyId).forEach(pid => {
        sendToPlayer(pid, 'waitingForChallenge', { spyName: players.get(room.spyId).name });
      });
      
      console.log(`🚨 المندس ${players.get(room.spyId).name} انكشف! بدأ تحدي الكلمات.`);
      
    } else {
      // المندس لم ينكشف، نهاية الجولة
      room.gameState = 'finished';
      broadcastToRoom(room.id, 'roundResult', {
        winner: 'spy',
        word: room.currentWord,
        spyWord: room.spyWord,
        spyPlayer: players.get(room.spyId).name,
        isSpyEliminated: false
      });
      console.log(`🎉 فاز المندس ${players.get(room.spyId).name} بالتصويت.`);
    }
  }
  
  rooms.set(room.id, room);
}

function handleSpyChallengeAnswer(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room || room.gameState !== 'challenge' || room.spyId !== userId) return;
  
  const { chosenWord } = data;
  
  room.challenge.spyAnswer = chosenWord;
  
  if (chosenWord === room.challenge.correctWord) {
    // المندس فاز بالتحدي
    room.challenge.status = 'win';
    room.gameState = 'finished';
    broadcastToRoom(room.id, 'roundResult', {
      winner: 'spy',
      word: room.currentWord,
      spyWord: room.spyWord,
      spyPlayer: players.get(room.spyId).name,
      isSpyEliminated: true, // تم كشفه لكنه فاز بالتحدي
      challenge: {
        status: 'win',
        chosenWord
      }
    });
    console.log(`🎉 فاز المندس ${players.get(room.spyId).name} بتحدي الكلمات.`);
  } else {
    // المندس خسر التحدي
    room.challenge.status = 'lose';
    room.gameState = 'finished';
    broadcastToRoom(room.id, 'roundResult', {
      winner: 'normal',
      word: room.currentWord,
      spyWord: room.spyWord,
      spyPlayer: players.get(room.spyId).name,
      isSpyEliminated: true,
      challenge: {
        status: 'lose',
        chosenWord
      }
    });
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
  
  if (message.length > 200) {
    return sendToPlayer(userId, 'error', { message: 'الرسالة طويلة جداً (الحد الأقصى 200 حرف).' }, ws);
  }
  
  // إرسال الرسالة لجميع اللاعبين في الغرفة (تم التأكد من عدم وجود تأخير هنا)
  broadcastToRoom(player.roomId, 'chatMessage', {
    senderId: userId,
    senderName: player.name,
    message: message.trim(),
    timestamp: Date.now()
  });
  
  console.log(`💬 ${player.name} في الغرفة ${rooms.get(player.roomId).roomCode}: ${message.trim()}`);
}
function handleLeaveRoom(ws, userId, data) {
  const player = players.get(userId);
  if (!player) return;
  
  const room = rooms.get(player.roomId);
  if (room) {
    room.players = room.players.filter(id => id !== userId);
    
    if (room.players.length === 0) {
      rooms.delete(room.id);
      console.log(`🗑️ تم حذف الغرفة ${room.roomCode} لعدم وجود لاعبين.`);
    } else {
      // تحديث قائمة اللاعبين للجميع
      broadcastToRoom(room.id, 'playerLeft', {
        players: getPlayersInRoom(room.id)
      });
      
      // إذا كان المغادر هو منشئ الغرفة، يتم تعيين منشئ جديد
      if (player.isCreator && room.players.length > 0) {
        const newCreatorId = room.players[0];
        const newCreator = players.get(newCreatorId);
        if (newCreator) {
          newCreator.isCreator = true;
          broadcastToRoom(room.id, 'creatorChanged', { newCreatorId });
          console.log(`👑 تم تعيين ${newCreator.name} كمنشئ جديد للغرفة ${room.roomCode}.`);
        }
      }
    }
  }
  
  players.delete(userId);
  console.log(`👋 غادر اللاعب ${player.name} (${userId}).`);
}

function handleReconnect(ws, userId, data) {
  const player = players.get(userId);
  if (!player) {
    return sendToPlayer(userId, 'error', { message: 'لا يمكن إعادة الاتصال. لم يتم العثور على بيانات اللاعب.' }, ws);
  }

  // تحديث الـ WebSocket
  player.ws = ws;
  
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
      sendToPlayer(userId, 'roomState', {
        roomCode: room.roomCode,
        gameState: room.gameState,
        players: getPlayersInRoom(room.id),
        currentWord: player.isSpy ? room.spyWord : room.currentWord,
        isSpy: player.isSpy,
        currentPlayer: room.players[room.currentPlayerIndex],
        creatorId: room.players[0] // نفترض أن المنشئ هو أول لاعب في القائمة
      });
      
      // إرسال تحديث للغرفة بأن اللاعب عاد متصلاً
      broadcastToRoom(player.roomId, 'playerStatusUpdate', {
        userId: userId,
        isConnected: true
      });
    }
  }
  
  console.log(`🔄 إعادة اتصال ناجحة: ${player.name} (${userId})`);
}

// ============================================
// WebSocket معالجات الاتصال
// ============================================
wss.on('connection', (ws) => {
  let userId = 'user-' + uuidv4();
  
  // إرسال الـ userId الجديد للعميل
  sendToPlayer(userId, 'setUserId', { userId: userId }, ws);
  console.log(`✅ اتصال WebSocket جديد: ${userId}`);
  
  ws.on('message', (message) => {
    try {
      const { event, data } = JSON.parse(message);
      console.log(`📨 رسالة من ${userId}: ${event}`, data);
      
      switch (event) {
        case 'createRoom':
          handleCreateRoom(ws, userId, data);
          break;
        case 'joinRoom':
        case 'joinRoomByCode':
          handleJoinRoom(ws, userId, data);
          break;
        case 'reconnect':
          handleReconnect(ws, userId, data);
          break;
          handleJoinRoom(ws, userId, data);
          break;
        case 'startGame':
          handleStartGame(ws, userId, data);
          break;
        case 'newRound':
          handleNewRound(ws, userId, data);
          break;
        case 'finishQuestion':
          handleFinishQuestion(ws, userId, data);
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
    // لا نحذف اللاعب مباشرة، بل نترك بياناته ليتمكن من إعادة الاتصال
    // سيتم حذف اللاعب إذا لم يعد الاتصال خلال فترة زمنية معينة (يمكن إضافتها لاحقاً)
    // أو إذا كانت الغرفة فارغة
    const player = players.get(userId);
    if (player) {
      player.ws = null; // إزالة الـ WebSocket لكن إبقاء بيانات اللاعب
      // إذا كان اللاعب في غرفة، نرسل تحديثاً للغرفة بأن اللاعب غير متصل
      if (player.roomId) {
        broadcastToRoom(player.roomId, 'playerStatusUpdate', {
          userId: userId,
          isConnected: false
        });
      }
    }
    console.log(`❌ انفصال WebSocket: ${userId}`);
    // handleLeaveRoom(ws, userId, {}); // إزالة استدعاء المغادرة التلقائي
  });
});

// ============================================
// REST API
// ============================================
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
    if (!room.isPrivate && room.gameState === 'waiting' && room.players.length < room.maxPlayers) {
      publicRooms.push({
        id: room.id,
        name: room.name,
        roomCode: room.roomCode,
        players: getPlayersInRoom(room.id),
        maxPlayers: room.maxPlayers
      });
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
