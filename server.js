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
// كلمات اللعبة
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
function generateRoomCode() {
  return randomBytes(3).toString('hex').toUpperCase();
}

function sendToPlayer(userId, event, data, ws = null) {
  const player = players.get(userId);
  const socket = ws || (player ? player.ws : null);
  if (socket && socket.readyState === socket.OPEN) {
    socket.send(JSON.stringify({ event, data }));
  }
}

function broadcastToRoom(roomId, event, data) {
  const room = rooms.get(roomId);
  if (room) {
    room.players.forEach(userId => {
      sendToPlayer(userId, event, data);
    });
  }
}

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

function selectRandomWord(category) {
  const categoryWords = words[category];
  if (!categoryWords || categoryWords.length < 2) {
    return { word: 'كلمة عادية', spyWord: 'كلمة مختلفة' };
  }

  const randomIndex = Math.floor(Math.random() * categoryWords.length);
  const normalWordObject = categoryWords[randomIndex];
  const normalWord = normalWordObject.word;

  const similarWords = categoryWords.filter(w => w.spyWord === normalWordObject.spyWord && w.word !== normalWord);
  const otherWords = categoryWords.filter(w => w.spyWord !== normalWordObject.spyWord);

  let spyWord;

  if (similarWords.length > 0) {
    const spyWordIndex = Math.floor(Math.random() * similarWords.length);
    spyWord = similarWords[spyWordIndex].word;
  } else if (otherWords.length > 0) {
    const spyWordIndex = Math.floor(Math.random() * otherWords.length);
    spyWord = otherWords[spyWordIndex].word;
  } else {
    let spyWordIndex;
    do {
      spyWordIndex = Math.floor(Math.random() * categoryWords.length);
    } while (spyWordIndex === randomIndex && categoryWords.length > 1);
    spyWord = categoryWords[spyWordIndex].word;
  }

  return { word: normalWord, spyWord: spyWord };
}

function generateChallengeWords(category, correctWord) {
  const categoryWords = words[category];
  if (!categoryWords) return [correctWord];

  const correctWordObject = categoryWords.find(w => w.word === correctWord);
  const correctSpyWord = correctWordObject ? correctWordObject.spyWord : null;

  let incorrectWords = [];

  if (correctSpyWord) {
    const similarWords = categoryWords
      .filter(w => w.spyWord === correctSpyWord && w.word !== correctWord)
      .map(w => w.word);

    const otherWords = categoryWords
      .filter(w => w.spyWord !== correctSpyWord && w.word !== correctWord)
      .map(w => w.word);

    const shuffledSimilar = similarWords.sort(() => 0.5 - Math.random());
    const shuffledOther = otherWords.sort(() => 0.5 - Math.random());

    const similarCount = Math.min(5, shuffledSimilar.length);
    incorrectWords.push(...shuffledSimilar.slice(0, similarCount));

    const remainingCount = 7 - incorrectWords.length;
    incorrectWords.push(...shuffledOther.slice(0, remainingCount));

    if (incorrectWords.length < 7) {
      const moreSimilar = shuffledSimilar.slice(similarCount);
      incorrectWords.push(...moreSimilar.slice(0, 7 - incorrectWords.length));
    }

    if (incorrectWords.length < 7) {
      const moreOther = shuffledOther.slice(remainingCount);
      incorrectWords.push(...moreOther.slice(0, 7 - incorrectWords.length));
    }
  } else {
    const allWords = categoryWords.map(w => w.word);
    const allIncorrect = allWords.filter(w => w !== correctWord);
    const shuffledIncorrect = allIncorrect.sort(() => 0.5 - Math.random());
    incorrectWords = shuffledIncorrect.slice(0, 7);
  }

  if (incorrectWords.length === 0) {
    incorrectWords = [correctWord + '_fake'];
  }

  incorrectWords = incorrectWords.slice(0, 7);

  const challengeWords = [...incorrectWords, correctWord];
  return challengeWords.sort(() => 0.5 - Math.random());
}

// ============================================
// معالجات الأحداث
// ============================================
function handleCreateRoom(ws, userId, data) {
  const { displayName, roomName, category, isPrivate } = data;

  if (!displayName || displayName.trim().length === 0) {
    return sendToPlayer(userId, 'error', { message: 'يجب إدخال اسم صحيح.' });
  }

  if (displayName.trim().length > 20) {
    return sendToPlayer(userId, 'error', { message: 'الاسم طويل جداً (الحد الأقصى 20 حرف).' });
  }

  if (!roomName || !category) {
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
    gameState: 'waiting',
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
  if (room.gameState !== 'waiting') {
    return sendToPlayer(userId, 'error', { message: 'اللعبة بدأت بالفعل.' }, ws);
  }
  if (room.players.length >= room.maxPlayers) {
    return sendToPlayer(userId, 'error', { message: 'الغرفة ممتلئة.' }, ws);
  }
  if (room.players.includes(userId)) {
    return sendToPlayer(userId, 'error', { message: 'أنت بالفعل في هذه الغرفة.' }, ws);
  }

  const roomPlayerNames = room.players
    .map(pid => players.get(pid)?.name.toLowerCase())
    .filter(Boolean);
  if (roomPlayerNames.includes(displayName.trim().toLowerCase())) {
    return sendToPlayer(userId, 'error', { message: 'هذا الاسم مستخدم في الغرفة. اختر اسماً آخر.' }, ws);
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

  const creatorId = room.players[0];
  sendToPlayer(userId, 'joinedRoom', {
    userId: userId,
    roomId: room.id,
    roomCode: room.roomCode,
    creatorId: creatorId,
    players: getPlayersInRoom(room.id)
  });

  broadcastToRoom(room.id, 'playerJoined', {
    players: getPlayersInRoom(room.id)
  });

  console.log(`✅ انضمام: ${displayName} (${userId}) إلى الغرفة ${room.roomCode}`);
}

function handleRequestNewRound(ws, userId, data) {
  const roomId = players.get(userId)?.roomId;
  const room = roomId ? rooms.get(roomId) : null;
  if (!room) return sendToPlayer(userId, 'error', { message: 'أنت لست في غرفة.' });
  if (room.gameState !== 'finished') return sendToPlayer(userId, 'error', { message: 'لا يمكن بدء جولة جديدة الآن.' });
  if (!players.get(userId).isCreator) return sendToPlayer(userId, 'error', { message: 'فقط منشئ الغرفة يمكنه بدء جولة جديدة.' });

  room.newRoundVotes = { accept: 0, reject: 0, total: room.players.length - 1, voters: new Set() };

  room.players.forEach(pid => {
    if (pid !== userId) {
      sendToPlayer(pid, 'newRoundVoteRequest', {});
    }
  });

  console.log(`📢 طلب جولة جديدة في الغرفة ${room.roomCode}`);
}

function handleVoteNewRound(ws, userId, data) {
  const roomId = players.get(userId)?.roomId;
  const room = roomId ? rooms.get(roomId) : null;
  if (!room || !room.newRoundVotes) return;

  const { accept } = data;

  if (room.newRoundVotes.voters.has(userId)) return;
  room.newRoundVotes.voters.add(userId);

  if (accept) {
    room.newRoundVotes.accept++;
  } else {
    room.newRoundVotes.reject++;
    broadcastToRoom(room.id, 'newRoundRejected', {});
    delete room.newRoundVotes;
    console.log(`❌ تم رفض الجولة الجديدة في الغرفة ${room.roomCode}`);
    return;
  }

  if (room.newRoundVotes.voters.size === room.newRoundVotes.total) {
    if (room.newRoundVotes.accept === room.newRoundVotes.total) {
      console.log(`✅ تم قبول الجولة الجديدة في الغرفة ${room.roomCode}`);
      startNewRound(room);
    }
    delete room.newRoundVotes;
  }
}

function startNewRound(room) {
  room.gameState = 'inGame';
  room.currentRound = (room.currentRound || 0) + 1;
  room.votes = [];
  room.challenge = null;

  const { word, spyWord } = selectRandomWord(room.category);
  room.currentWord = word;
  room.spyWord = spyWord;

  const spyIndex = Math.floor(Math.random() * room.players.length);
  room.spyId = room.players[spyIndex];

  room.currentPlayerIndex = Math.floor(Math.random() * room.players.length);

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

  startQuestionTimer(room);

  rooms.set(room.id, room);
  console.log(`🔄 بدء جولة جديدة في الغرفة ${room.roomCode}. المندس: ${players.get(room.spyId).name}`);
}

function startQuestionTimer(room) {
  const QUESTION_TIMEOUT = 120000;

  if (room.questionTimer) {
    clearTimeout(room.questionTimer);
  }

  room.questionTimer = setTimeout(() => {
    if (room.gameState !== 'inGame') return;

    if (!room.playersAsked) {
      room.playersAsked = new Set();
    }
    const currentPlayerId = room.players[room.currentPlayerIndex];
    room.playersAsked.add(currentPlayerId);

    broadcastToRoom(room.id, 'questionTimeout', {
      playerName: players.get(currentPlayerId)?.name
    });

    room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;

    if (room.playersAsked.size >= room.players.length) {
      room.gameState = 'voting';
      room.playersAsked = new Set();
      broadcastToRoom(room.id, 'votingPhase', { players: getPlayersInRoom(room.id) });
      console.log(`🗳️ الغرفة ${room.roomCode} دخلت مرحلة التصويت بعد انتهاء الوقت.`);
    } else {
      broadcastToRoom(room.id, 'nextQuestion', {
        currentPlayer: room.players[room.currentPlayerIndex]
      });
      startQuestionTimer(room);
    }

    rooms.set(room.id, room);
  }, QUESTION_TIMEOUT);
}

function handleStartGame(ws, userId, data) {
  const roomId = players.get(userId)?.roomId;
  const room = roomId ? rooms.get(roomId) : null;
  if (!room) return sendToPlayer(userId, 'error', { message: 'أنت لست في غرفة.' });
  if (room.players.length < 3) {
    return sendToPlayer(userId, 'error', { message: 'يجب وجود 3 لاعبين على الأقل لبدء اللعبة.' });
  }
  if (room.gameState !== 'waiting') return sendToPlayer(userId, 'error', { message: 'اللعبة بدأت بالفعل.' });
  if (!players.get(userId).isCreator) return sendToPlayer(userId, 'error', { message: 'فقط منشئ الغرفة يمكنه بدء اللعبة.' });

  room.gameState = 'inGame';
  room.currentRound = 1;
  room.votes = [];
  room.challenge = null;

  const { word, spyWord } = selectRandomWord(room.category);
  room.currentWord = word;
  room.spyWord = spyWord;

  const spyIndex = Math.floor(Math.random() * room.players.length);
  room.spyId = room.players[spyIndex];

  room.currentPlayerIndex = Math.floor(Math.random() * room.players.length);

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

  startQuestionTimer(room);

  rooms.set(room.id, room);
  console.log(`✅ بدء اللعبة في الغرفة ${room.roomCode}. المندس: ${players.get(room.spyId).name}`);
}

function handleFinishQuestion(ws, userId, data) {
  const roomId = players.get(userId)?.roomId;
  const room = roomId ? rooms.get(roomId) : null;
  const player = players.get(userId);
  if (!room || room.gameState !== 'inGame' || !player) return;

  if (room.players[room.currentPlayerIndex] !== userId) {
    return sendToPlayer(userId, 'error', { message: 'ليس دورك لإنهاء السؤال.' });
  }

  if (room.questionTimer) {
    clearTimeout(room.questionTimer);
    room.questionTimer = null;
  }

  if (!player.isSpy) {
    if (!room.playersAsked) {
      room.playersAsked = new Set();
    }
    room.playersAsked.add(userId);
  }

  room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;

  const normalPlayersCount = room.spyId ? room.players.length - 1 : room.players.length;
  if (!room.playersAsked) {
    room.playersAsked = new Set();
  }

  if (room.playersAsked.size >= normalPlayersCount) {
    room.gameState = 'voting';
    room.playersAsked = new Set();
    room.votes = [];

    room.players.forEach(pid => {
      const p = players.get(pid);
      if (p) p.hasVoted = false;
    });

    broadcastToRoom(room.id, 'votingPhase', { players: getPlayersInRoom(room.id) });
    console.log(`🗳️ الغرفة ${room.roomCode} دخلت مرحلة التصويت.`);
    startVotingTimer(room);
  } else {
    broadcastToRoom(room.id, 'nextQuestion', {
      currentPlayer: room.players[room.currentPlayerIndex]
    });
    startQuestionTimer(room);
  }

  rooms.set(room.id, room);
}

function handleVote(ws, userId, data) {
  const roomId = players.get(userId)?.roomId;
  const room = roomId ? rooms.get(roomId) : null;
  const player = players.get(userId);
  if (!room || room.gameState !== 'voting' || !player) return;
  if (player.hasVoted) return sendToPlayer(userId, 'error', { message: 'لقد صوتت بالفعل.' });

  const { targetId } = data;
  if (!room.players.includes(targetId)) return sendToPlayer(userId, 'error', { message: 'الهدف غير موجود.' });

  room.votes.push({ voterId: userId, targetId });
  player.hasVoted = true;

  broadcastToRoom(room.id, 'voteUpdate', {
    players: getPlayersInRoom(room.id),
    votedCount: room.votes.length,
    totalPlayers: room.players.length
  });

  if (room.votes.length === room.players.length) {
    if (room.votingTimer) {
      clearTimeout(room.votingTimer);
      room.votingTimer = null;
    }

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
      console.log(`🎯 تعادل في التصويت! فاز المندس ${players.get(room.spyId).name} تلقائياً.`);
      rooms.set(room.id, room);
      return;
    }

    const votedPlayerId = playersWithMaxVotes[0];

    if (votedPlayerId === room.spyId) {
      room.gameState = 'challenge';

      const challengeWords = generateChallengeWords(room.category, room.currentWord);
      room.challenge = {
        spyId: room.spyId,
        words: challengeWords,
        correctWord: room.currentWord,
        spyAnswer: null,
        status: null
      };

      sendToPlayer(room.spyId, 'spyChallenge', {
        words: challengeWords,
        duration: 30
      });

      room.players
        .filter(pid => pid !== room.spyId)
        .forEach(pid => {
          sendToPlayer(pid, 'waitingForChallenge', {
            spyName: players.get(room.spyId).name,
            duration: 30
          });
        });

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
            challenge: {
              status: 'timeout',
              chosenWord: null,
              correctWord: room.currentWord
            }
          });
          console.log(`⏰ انتهى وقت التحدي، فاز اللاعبون العاديون.`);
        }
      }, 30000);

      console.log(`🚨 المندس ${players.get(room.spyId).name} انكشف! بدأ تحدي الكلمات.`);
    } else {
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

    room.players.forEach(pid => {
      const p = players.get(pid);
      if (p) p.hasVoted = false;
    });
  }

  rooms.set(room.id, room);
}

function startVotingTimer(room) {
  const VOTING_TIMEOUT = 60000;

  if (room.votingTimer) {
    clearTimeout(room.votingTimer);
  }

  room.votingTimer = setTimeout(() => {
    if (room.gameState !== 'voting') return;

    const voteCounts = room.votes.reduce((acc, vote) => {
      acc[vote.targetId] = (acc[vote.targetId] || 0) + 1;
      return acc;
    }, {});

    if (Object.keys(voteCounts).length === 0) {
      const randomPlayer = room.players[Math.floor(Math.random() * room.players.length)];
      voteCounts[randomPlayer] = 1;
    }

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
        tie: true,
        timeout: true
      });
      console.log(`⏰ انتهى وقت التصويت! تعادل - فاز المندس ${players.get(room.spyId).name} تلقائياً.`);
      rooms.set(room.id, room);
      return;
    }

    const votedPlayerId = playersWithMaxVotes[0];

    if (votedPlayerId === room.spyId) {
      room.gameState = 'challenge';

      const challengeWords = generateChallengeWords(room.category, room.currentWord);
      room.challenge = {
        spyId: room.spyId,
        words: challengeWords,
        correctWord: room.currentWord,
        spyAnswer: null,
        status: null
      };

      sendToPlayer(room.spyId, 'spyChallenge', {
        words: challengeWords,
        duration: 30
      });

      room.players
        .filter(pid => pid !== room.spyId)
        .forEach(pid => {
          sendToPlayer(pid, 'waitingForChallenge', {
            spyName: players.get(room.spyId).name,
            duration: 30
          });
        });

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
            challenge: {
              status: 'timeout',
              chosenWord: null,
              correctWord: room.currentWord
            }
          });
          console.log(`⏰ انتهى وقت التحدي، فاز اللاعبون العاديون.`);
        }
      }, 30000);

      console.log(`⏰ انتهى وقت التصويت! المندس ${players.get(room.spyId).name} انكشف! بدأ تحدي الكلمات.`);
    } else {
      room.gameState = 'finished';
      broadcastToRoom(room.id, 'roundResult', {
        winner: 'spy',
        word: room.currentWord,
        spyWord: room.spyWord,
        spyPlayer: players.get(room.spyId).name,
        isSpyEliminated: false,
        timeout: true
      });
      console.log(`⏰ انتهى وقت التصويت! فاز المندس ${players.get(room.spyId).name}.`);
    }

    room.players.forEach(pid => {
      const p = players.get(pid);
      if (p) p.hasVoted = false;
    });

    rooms.set(room.id, room);
  }, VOTING_TIMEOUT);
}

function handleSpyChallengeAnswer(ws, userId, data) {
  const roomId = players.get(userId)?.roomId;
  const room = roomId ? rooms.get(roomId) : null;
  if (!room || room.gameState !== 'challenge' || room.spyId !== userId) return;

  const { chosenWord } = data;

  if (room.challengeTimer) {
    clearTimeout(room.challengeTimer);
    room.challengeTimer = null;
  }

  room.challenge.spyAnswer = chosenWord;

  if (chosenWord === room.challenge.correctWord) {
    room.challenge.status = 'win';
    room.gameState = 'finished';
    broadcastToRoom(room.id, 'roundResult', {
      winner: 'spy',
      word: room.currentWord,
      spyWord: room.spyWord,
      spyPlayer: players.get(room.spyId).name,
      isSpyEliminated: true,
      challenge: {
        status: 'win',
        chosenWord,
        correctWord: room.currentWord
      }
    });
    console.log(`🎉 فاز المندس ${players.get(room.spyId).name} بتحدي الكلمات.`);
  } else {
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
        chosenWord,
        correctWord: room.currentWord
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

  const filteredMessage = message.trim().replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '');
  if (filteredMessage.length === 0) {
    return sendToPlayer(userId, 'error', { message: 'الرسالة تحتوي على رموز غير مدعومة.' }, ws);
  }

  if (filteredMessage.length > 200) {
    return sendToPlayer(userId, 'error', { message: 'الرسالة طويلة جداً (الحد الأقصى 200 حرف).' }, ws);
  }

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

  if (!newName || newName.length > 20) {
    return sendToPlayer(userId, 'error', { message: 'اسم غير صالح.' });
  }

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

  sendToPlayer(userId, 'nameChanged', { newName });

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
  if (room) {
    if (room.gameState === 'inGame' && room.players[room.currentPlayerIndex] === userId) {
      const currentIndex = room.players.indexOf(userId);
      if (currentIndex !== -1) {
        if (room.questionTimer) {
          clearTimeout(room.questionTimer);
          room.questionTimer = null;
        }
        room.players = room.players.filter(id => id !== userId);
        if (room.players.length > 0) {
          room.currentPlayerIndex = currentIndex % room.players.length;
          broadcastToRoom(room.id, 'nextQuestion', {
            currentPlayer: room.players[room.currentPlayerIndex]
          });
          startQuestionTimer(room);
        }
      }
    } else {
      room.players = room.players.filter(id => id !== userId);
    }

    if (room.players.length === 0) {
      if (room.questionTimer) clearTimeout(room.questionTimer);
      if (room.votingTimer) clearTimeout(room.votingTimer);
      if (room.challengeTimer) clearTimeout(room.challengeTimer);
      rooms.delete(room.id);
      console.log(`🗑️ تم حذف الغرفة ${room.roomCode} لعدم وجود لاعبين.`);
    } else {
      broadcastToRoom(room.id, 'playerLeft', {
        players: getPlayersInRoom(room.id)
      });

      if (room.gameState === 'voting') {
        room.votes = room.votes.filter(v => v.voterId !== userId && v.targetId !== userId);

        if (room.votes.length === room.players.length) {
          if (room.votingTimer) {
            clearTimeout(room.votingTimer);
            room.votingTimer = null;
          }

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
              sendToPlayer(room.spyId, 'spyChallenge', {
                words: challengeWords,
                duration: 30
              });
              room.players
                .filter(pid => pid !== room.spyId)
                .forEach(pid => {
                  sendToPlayer(pid, 'waitingForChallenge', {
                    spyName: players.get(room.spyId).name,
                    duration: 30
                  });
                });
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
                    challenge: {
                      status: 'timeout',
                      chosenWord: null,
                      correctWord: room.currentWord
                    }
                  });
                }
              }, 30000);
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
      }

      if (player.isCreator && room.players.length > 0) {
        const newCreatorId = room.players[0];
        const newCreator = players.get(newCreatorId);
        if (newCreator) {
          newCreator.isCreator = true;
          broadcastToRoom(room.id, 'creatorChanged', {
            newCreatorId,
            players: getPlayersInRoom(room.id)
          });
          console.log(`👑 تم تعيين ${newCreator.name} كمنشئ جديد للغرفة ${room.roomCode}.`);
        }
      }

      rooms.set(room.id, room);
    }
  }

  sendToPlayer(userId, 'roomLeft', {});
  players.delete(userId);
  console.log(`👋 غادر اللاعب ${player.name} (${userId}).`);
}

function handleReconnect(ws, currentUserId, data) {
  const targetUserId = data && data.userId ? data.userId : currentUserId;
  const player = players.get(targetUserId);
  if (!player) {
    sendToPlayer(targetUserId, 'error', { message: 'لا يمكن إعادة الاتصال. لم يتم العثور على بيانات اللاعب.' }, ws);
    return currentUserId;
  }

  if (player.disconnectTimer) {
    clearTimeout(player.disconnectTimer);
    player.disconnectTimer = null;
  }

  if (player.ws && player.ws !== ws && player.ws.readyState === ws.OPEN) {
    try {
      player.ws.close();
    } catch (err) {
      console.error('⚠️ خطأ أثناء إغلاق اتصال WebSocket القديم:', err);
    }
  }

  player.ws = ws;

  sendToPlayer(targetUserId, 'reconnected', {
    userId: targetUserId,
    roomId: player.roomId,
    roomCode: player.roomId ? rooms.get(player.roomId).roomCode : null,
    displayName: player.name
  });

  if (player.roomId) {
    const room = rooms.get(player.roomId);
    if (room) {
      sendToPlayer(targetUserId, 'roomState', {
        roomCode: room.roomCode,
        gameState: room.gameState,
        players: getPlayersInRoom(room.id),
        currentWord: player.isSpy ? room.spyWord : room.currentWord,
        isSpy: player.isSpy,
        currentPlayer: room.players[room.currentPlayerIndex],
        creatorId: room.players.find(pid => players.get(pid)?.isCreator) || room.players[0]
      });

      broadcastToRoom(player.roomId, 'playerReconnected', {
        userId: targetUserId,
        playerName: player.name,
        players: getPlayersInRoom(room.id)
      });
    }
  }

  console.log(`🔄 إعادة اتصال ناجحة: ${player.name} (${targetUserId})`);
  return targetUserId;
}

// ============================================
// WebSocket
// ============================================
wss.on('connection', (ws) => {
  let userId = 'user-' + uuidv4();

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
        case 'changeName':
          handleChangeName(ws, userId, data);
          break;
        case 'reconnect':
          userId = handleReconnect(ws, userId, data) || userId;
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
      // لا تمسح ws إلا إذا هذا الاتصال هو نفسه المسجّل حالياً
      if (player.ws === ws) {
        player.ws = null;

        if (player.roomId) {
          const room = rooms.get(player.roomId);
          if (room) {
            broadcastToRoom(player.roomId, 'playerDisconnected', {
              userId: userId,
              playerName: player.name
            });

            player.disconnectTimer = setTimeout(() => {
              const p = players.get(userId);
              const stillDisconnected = !p || !p.ws || p.ws.readyState !== ws.OPEN;
              if (stillDisconnected) {
                console.log(`⏰ حذف اللاعب ${player.name} بعد انقطاع الاتصال`);
                handleLeaveRoom(null, userId, {});

                if (room.gameState === 'inGame' && room.players[room.currentPlayerIndex] === userId) {
                  if (room.players.length > 0) {
                    room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;
                    broadcastToRoom(room.id, 'nextQuestion', {
                      currentPlayer: room.players[room.currentPlayerIndex]
                    });
                  }
                }
              }
            }, 30000);
          }
        }
      }
    }
    console.log(`❌ انفصال WebSocket: ${userId}`);
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
