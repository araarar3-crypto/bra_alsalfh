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
 * @param {string} category 
 * @returns {{word: string, spyWord: string}}
 */
function selectRandomWord(category) {
  const categoryWords = words[category];
  if (!categoryWords || categoryWords.length === 0) {
    return { word: 'كلمة عادية', spyWord: 'كلمة مندس' };
  }
  const randomIndex = Math.floor(Math.random() * categoryWords.length);
  return categoryWords[randomIndex];
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

  const allWords = categoryWords.map(w => w.word);
  const incorrectWords = allWords.filter(w => w !== correctWord);
  
  // اختيار 7 كلمات خاطئة عشوائية
  const shuffledIncorrect = incorrectWords.sort(() => 0.5 - Math.random());
  const selectedIncorrect = shuffledIncorrect.slice(0, 7);
  
  // إضافة الكلمة الصحيحة
  const challengeWords = [...selectedIncorrect, correctWord];
  
  // خلط الكلمات
  return challengeWords.sort(() => 0.5 - Math.random());
}

// ============================================
// معالجات الأحداث
// ============================================

function handleCreateRoom(ws, userId, data) {
  const { displayName, roomName, category } = data;
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

  // الانتقال للاعب التالي
  room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;
  
  // التحقق من نهاية الجولة (بعد دور كامل لكل لاعب)
  if (room.currentPlayerIndex === 0) {
    // نهاية مرحلة الأسئلة، الانتقال للتصويت
    room.gameState = 'voting';
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
      if (player.isCreator) {
        const newCreatorId = room.players[0];
        players.get(newCreatorId).isCreator = true;
        broadcastToRoom(room.id, 'creatorChanged', { newCreatorId });
        console.log(`👑 تم تعيين ${players.get(newCreatorId).name} كمنشئ جديد للغرفة ${room.roomCode}.`);
      }
    }
  }
  
  players.delete(userId);
  console.log(`👋 غادر اللاعب ${player.name} (${userId}).`);
}

// ============================================
// WebSocket معالجات الاتصال
// ============================================
wss.on('connection', (ws) => {
  const userId = 'user-' + uuidv4();
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
          handleJoinRoom(ws, userId, data);
          break;
        case 'startGame':
          handleStartGame(ws, userId, data);
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
    handleLeaveRoom(ws, userId, {});
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
    if (room.gameState === 'waiting' && room.players.length < room.maxPlayers) {
      publicRooms.push({
        id: room.id,
        name: room.name,
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
