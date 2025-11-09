// ====================================================================
// برا السالفة - خادم اللعبة (نسخة إعداد كاملة للنشر على Render)
// ====================================================================
// ملاحظات مهمة:
// - يحتاج package.json فيه "type": "module" و "start": "node server.js"
// - هذا الخادم يخدم Index.html من نفس مجلد server.js
// - يدعم الغرف العامة/الخاصة + الانضمام بالكود + بقاء اللاعب عند الرجوع
// - إضافة "تخمين الجاسوس النهائي": 8 كلمات من نفس الفئة (واحدة صحيحة)
// - يمنع "Cannot GET /" عبر تقديم Index.html لجميع المسارات غير API
// ====================================================================

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ------------------------- إعداد الخادم ------------------------------
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET','POST'] },
  transports: ['websocket', 'polling']
});

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '64kb' }));

// تقديم الملفات الثابتة وIndex.html
app.use(express.static(__dirname));
app.get('/', (_req, res) => {
  const indexPath = path.join(__dirname, 'Index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  return res.status(404).send('Index.html غير موجود في نفس مجلد server.js');
});

// أي مسار غير API → أعد Index.html (لمنع "Cannot GET /")
app.get(['/:any', '/:any/:sub'], (_req, res) => {
  const indexPath = path.join(__dirname, 'Index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  return res.status(404).send('Index.html غير موجود');
});

// فحص صحي
app.get('/healthz', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// ------------------------- هياكل البيانات ---------------------------
/** roomsById: Map<roomId, Room> */
const roomsById = new Map();
/** roomsByCode: Map<roomCode, roomId> */
const roomsByCode = new Map();
/** playerToRoom: Map<socketId, roomId> */
const playerToRoom = new Map();
/** inactivityTimers: Map<roomId, Timeout> */
const inactivityTimers = new Map();

// فئات/كلمات (مثال؛ عدّل بحسب بيانات لعبتك)
const WORD_BANK = {
  'السيارات': ['تويوتا', 'هيونداي', 'مرسيدس', 'بي إم دبليو', 'جيب', 'كامري', 'سوناتا', 'تيسلا', 'هامر', 'كيا'],
  'الأكل': ['كبسة', 'برجر', 'شاورما', 'بيتزا', 'ملوخية', 'مندي', 'فول', 'عدس', 'تبولة', 'مشاوي'],
  'دوري السعودي': ['النصر', 'الهلال', 'الاتحاد', 'الأهلي', 'الشباب', 'التعاون', 'الفيحاء', 'الرائد', 'الحزم', 'الوحدة'],
  'mix': ['قهوة', 'صحراء', 'كمبيوتر', 'كتاب', 'هاتف', 'شارع', 'طيارة', 'بحر', 'سحابة', 'مدينة']
};

function pickRandom(arr, n=1) {
  const a = [...arr];
  const out = [];
  while (a.length && out.length < n) {
    const i = Math.floor(Math.random()*a.length);
    out.push(a.splice(i,1)[0]);
  }
  return n === 1 ? out[0] : out;
}

// توليد كود من 6 رموز على شكل [A-Z0-9]
function makeRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // بدون 0O1I لتقليل اللبس
  let s = '';
  for (let i=0;i<6;i++) s += chars[Math.floor(Math.random()*chars.length)];
  return s;
}

// توليد كلمة الجولة
function getRandomWord(category='mix') {
  const pool = WORD_BANK[category] || WORD_BANK['mix'];
  if (!pool || pool.length === 0) {
    return { word: pickRandom(WORD_BANK['mix']), category: 'mix' };
  }
  return { word: pickRandom(pool), category };
}

// توليد خيارات تخمين الجاسوس النهائي (٨ كلمات من نفس الفئة تتضمن الصحيحة)
function buildSpyFinalChoices(correctWord, category='mix') {
  const pool = WORD_BANK[category] || WORD_BANK['mix'];
  const others = pool.filter(w => w !== correctWord);
  const distractors = pickRandom(others, Math.min(7, Math.max(0, others.length)));
  const options = [...distractors, correctWord];
  // خلط
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  // لو أقل من 8، كمّل من mix
  while (options.length < 8) {
    const extra = pickRandom(WORD_BANK['mix']);
    if (!options.includes(extra)) options.push(extra);
    else break;
  }
  return options.slice(0, 8);
}

// حذف غرفة
function deleteRoom(roomId) {
  const room = roomsById.get(roomId);
  if (!room) return;
  if (inactivityTimers.has(roomId)) {
    clearTimeout(inactivityTimers.get(roomId));
    inactivityTimers.delete(roomId);
  }
  roomsByCode.delete(room.code);
  if (room.players) {
    room.players.forEach(p => playerToRoom.delete(p.socketId));
  }
  roomsById.delete(roomId);
}

// إعادة ضبط مؤقت الخمول للغرفة
function resetInactivity(roomId) {
  if (inactivityTimers.has(roomId)) clearTimeout(inactivityTimers.get(roomId));
  const t = setTimeout(() => {
    const room = roomsById.get(roomId);
    if (!room) return;
    if (room.status === 'waiting') {
      io.to(room.id).emit('roomClosed', { message: 'الغرفة أغلقت بسبب عدم النشاط' });
      deleteRoom(roomId);
    }
  }, 10 * 60 * 1000); // 10 دقائق
  inactivityTimers.set(roomId, t);
}

// بث حالة الغرفة للاعبين
function broadcastRoomState(room) {
  const safeRoom = {
    id: room.id,
    code: room.code,
    status: room.status,
    type: room.type,
    players: room.players.map(p => ({ id: p.id, name: p.name, connected: p.connected, isHost: p.isHost })),
    currentQuestionPlayer: room.currentQuestionPlayer || null,
    category: room.category || 'mix'
  };
  io.to(room.id).emit('roomState', safeRoom);
}

// إرسال قائمة الغرف العامة للجميع
function broadcastPublicRooms() {
  const list = [];
  roomsById.forEach(room => {
    if (room.type === 'public' && room.status !== 'closing') {
      list.push({
        code: room.code,
        playersCount: room.players.length,
        category: room.category || 'mix',
        status: room.status
      });
    }
  });
  io.emit('roomsUpdated', list);
}

// ----------------------------- Socket.io -----------------------------
io.on('connection', (socket) => {
  // إنشاء غرفة
  socket.on('createRoom', (data = {}) => {
    const name = (data.playerName || data.name || 'لاعب').toString().slice(0, 20).trim() || 'لاعب';
    const category = (data.category || 'mix').toString();
    const type = (data.type || data.roomType || 'public') === 'private' ? 'private' : 'public';

    const roomId = uuidv4();
    const roomCode = makeRoomCode();

    const room = {
      id: roomId,
      code: roomCode,
      creatorId: socket.id,
      status: 'waiting',
      type,              // public | private
      category,
      word: null,
      gameStartTime: null,
      players: [{
        id: uuidv4(),
        socketId: socket.id,
        name,
        isHost: true,
        connected: true,
        joinedAt: Date.now()
      }],
      spyId: null,
      finalGuess: null, // { active, spySocketId, options:[], correctWord }
      votes: {}         // playerId -> targetId
    };

    roomsById.set(roomId, room);
    roomsByCode.set(roomCode, roomId);
    playerToRoom.set(socket.id, roomId);

    socket.join(roomId);
    resetInactivity(roomId);

    socket.emit('roomCreated', { code: room.code, id: room.id, category: room.category, isHost: true, type: room.type });
    broadcastRoomState(room);
    broadcastPublicRooms(); // تحديث قائمة الغرف العامة للجميع
  });

  // الحصول على الغرف العامة (عند الضغط على "انضمام")
  socket.on('getPublicRooms', () => {
    const list = [];
    roomsById.forEach(room => {
      if (room.type === 'public' && room.status !== 'closing') {
        list.push({
          code: room.code,
          playersCount: room.players.length,
          category: room.category || 'mix',
          status: room.status
        });
      }
    });
    socket.emit('roomsUpdated', list);
  });

  // الانضمام عبر الكود
  socket.on('joinByCode', (payload = {}) => {
    const code = (payload.code || '').toString().toUpperCase();
    const name = (payload.playerName || payload.name || 'لاعب').toString().slice(0, 20).trim() || 'لاعب';

    const roomId = roomsByCode.get(code);
    if (!roomId) return socket.emit('error', { message: 'الغرفة غير موجودة' });

    const room = roomsById.get(roomId);
    if (!room) return socket.emit('error', { message: 'الغرفة غير موجودة' });

    if (room.finalGuess?.active) return socket.emit('error', { message: 'لا يمكن الانضمام أثناء مرحلة الحسم' });

    const player = {
      id: uuidv4(),
      socketId: socket.id,
      name,
      isHost: false,
      connected: true,
      joinedAt: Date.now()
    };

    room.players.push(player);
    playerToRoom.set(socket.id, roomId);
    socket.join(roomId);
    resetInactivity(roomId);

    socket.emit('joinedRoom', { code: room.code, id: room.id, category: room.category, isHost: false, type: room.type });
    broadcastRoomState(room);
    broadcastPublicRooms();
  });

  // الانضمام إلى غرفة عامة من القائمة
  socket.on('joinPublicRoom', (payload = {}) => {
    const code = (payload.code || '').toString().toUpperCase();
    const name = (payload.playerName || payload.name || 'لاعب').toString().slice(0, 20).trim() || 'لاعب';
    const roomId = roomsByCode.get(code);
    if (!roomId) return socket.emit('error', { message: 'الغرفة غير موجودة' });
    const room = roomsById.get(roomId);
    if (!room || room.type !== 'public') return socket.emit('error', { message: 'هذه الغرفة ليست عامة' });

    const player = {
      id: uuidv4(),
      socketId: socket.id,
      name,
      isHost: false,
      connected: true,
      joinedAt: Date.now()
    };

    room.players.push(player);
    playerToRoom.set(socket.id, roomId);
    socket.join(roomId);
    resetInactivity(roomId);

    socket.emit('joinedRoom', { code: room.code, id: room.id, category: room.category, isHost: false, type: room.type });
    broadcastRoomState(room);
    broadcastPublicRooms();
  });

  // بدء اللعبة (المضيف فقط)
  socket.on('startGame', (data = {}) => {
    const roomId = playerToRoom.get(socket.id);
    if (!roomId) return socket.emit('error', { message: 'ما أنت في غرفة' });
    const room = roomsById.get(roomId);
    if (!room) return;

    if (room.creatorId !== socket.id) {
      return socket.emit('error', { message: 'فقط منشئ الغرفة يمكنه بدء اللعبة' });
    }
    if (!room.players || room.players.length < 3) {
      return socket.emit('error', { message: 'يجب أن يكون هناك 3 لاعبين على الأقل' });
    }

    const category = data.category || room.category || 'mix';
    const { word, category: pickedCategory } = getRandomWord(category);
    room.word = word;
    room.category = pickedCategory;
    room.status = 'playing';
    room.gameStartTime = Date.now();
    room.votes = {};
    room.currentQuestionPlayer = room.players[0]?.id || null;

    // اختيار جاسوس عشوائي
    const spyIndex = Math.floor(Math.random() * room.players.length);
    const spyPlayer = room.players[spyIndex];
    room.spyId = spyPlayer.id;
    room.finalGuess = null;

    // إرسال كلمة خاصة لكل لاعب
    room.players.forEach(p => {
      const s = io.sockets.sockets.get(p.socketId);
      if (!s) return;
      const isSpy = (p.id === room.spyId);
      s.emit('gameStarted', {
        isSpy,
        word: isSpy ? null : room.word,
        category: room.category,
        players: room.players.map(pp => ({ id: pp.id, name: pp.name })),
        currentQuestionPlayer: room.currentQuestionPlayer
      });
    });

    broadcastRoomState(room);
  });

  // إنهاء سؤال/دور (تناوب)
  socket.on('finishQuestion', () => {
    const roomId = playerToRoom.get(socket.id);
    if (!roomId) return;
    const room = roomsById.get(roomId);
    if (!room || room.status !== 'playing') return;

    const order = room.players.map(p => p.id);
    const idx = order.indexOf(room.currentQuestionPlayer);
    const next = order[(idx + 1) % order.length];
    room.currentQuestionPlayer = next;
    io.to(room.id).emit('turnChanged', { currentQuestionPlayer: next });
  });

  // تصويت
  socket.on('vote', ({ targetId }) => {
    const roomId = playerToRoom.get(socket.id);
    if (!roomId) return;
    const room = roomsById.get(roomId);
    if (!room || room.status !== 'playing') return;

    const voter = room.players.find(p => p.socketId === socket.id);
    if (!voter) return;

    // منع التصويت على نفسه
    if (voter.id === targetId) return socket.emit('error', { message: 'لا يمكنك التصويت لنفسك' });

    room.votes[voter.id] = targetId;

    // بث تقدّم التصويت
    const votedCount = Object.keys(room.votes).length;
    io.to(room.id).emit('voteProgress', { voted: votedCount, total: room.players.length });

    // هل اكتمل التصويت؟
    if (votedCount >= room.players.length) {
      // حساب النتائج
      const tally = {};
      Object.values(room.votes).forEach(t => tally[t] = (tally[t] || 0) + 1);

      let topId = null, topCount = -1;
      Object.entries(tally).forEach(([pid, cnt]) => {
        if (cnt > topCount) { topCount = cnt; topId = pid; }
      });

      // تحقق تعادل
      const tie = Object.values(tally).filter(c => c === topCount).length > 1;
      if (tie) {
        io.to(room.id).emit('voteTie', { message: 'تعادل في الأصوات، جولة أسئلة قصيرة إضافية' });
        // إعادة ضبط التصويت فقط
        room.votes = {};
        return;
      }

      const eliminated = room.players.find(p => p.id === topId);
      if (!eliminated) return;

      const eliminatedIsSpy = (eliminated.id === room.spyId);

      io.to(room.id).emit('voteResult', {
        eliminated: { id: eliminated.id, name: eliminated.name },
        eliminatedIsSpy
      });

      if (eliminatedIsSpy) {
        // مرحلة "تخمين الجاسوس النهائي"
        const spySocket = io.sockets.sockets.get(eliminated.socketId);
        const options = buildSpyFinalChoices(room.word, room.category);
        room.finalGuess = {
          active: true,
          spySocketId: eliminated.socketId,
          options,
          correctWord: room.word
        };
        if (spySocket) {
          spySocket.emit('spyFinalGuess', { options, category: room.category });
        }
        // باقي اللاعبين ينتظرون النتيجة
        io.to(room.id).emit('waitingForSpyGuess', { optionsCount: options.length });
      } else {
        // يستمر اللعب بدون اللاعب المُقصى
        room.players = room.players.filter(p => p.id !== eliminated.id);
        room.votes = {};
        // لو بقى أقل من 3 لاعبين: إنهاء
        if (room.players.length < 3) {
          room.status = 'waiting';
          io.to(room.id).emit('gameEnded', { winner: 'spy', reason: 'عدد اللاعبين صار قليل' });
        } else {
          // التالي يسأل
          room.currentQuestionPlayer = room.players[0].id;
          io.to(room.id).emit('nextRound', { players: room.players.map(p => ({ id:p.id, name:p.name })) });
        }
      }
    }
  });

  // استلام تخمين الجاسوس النهائي
  socket.on('spyGuess', ({ guess }) => {
    const roomId = playerToRoom.get(socket.id);
    if (!roomId) return;
    const room = roomsById.get(roomId);
    if (!room || !room.finalGuess?.active) return;

    // تأكد أن هذا هو الجاسوس
    if (room.finalGuess.spySocketId !== socket.id) {
      return socket.emit('error', { message: 'أنت لست الجاسوس' });
    }

    const correct = (guess === room.finalGuess.correctWord);
    room.finalGuess.active = false;
    room.status = 'waiting';

    if (correct) {
      io.to(room.id).emit('gameEnded', { winner: 'spy', reason: 'الجاسوس خمّن الكلمة الصحيحة' });
    } else {
      io.to(room.id).emit('gameEnded', { winner: 'team', reason: 'الجاسوس أخطأ في التخمين' });
    }
  });

  // طلب قائمة الغرف العامة بشكل دوري من الواجهة
  socket.on('pollRooms', () => {
    broadcastPublicRooms();
  });

  // إعادة اتصال لاعب
  socket.on('playerReconnect', ({ oldSocketId }) => {
    const roomId = playerToRoom.get(oldSocketId);
    if (!roomId) return;
    playerToRoom.set(socket.id, roomId);

    const room = roomsById.get(roomId);
    if (!room) return;
    const p = room.players.find(pp => pp.socketId === oldSocketId);
    if (p) {
      p.socketId = socket.id;
      p.connected = true;
    }
    socket.join(roomId);
    broadcastRoomState(room);
  });

  // قطع اتصال
  socket.on('disconnect', () => {
    const roomId = playerToRoom.get(socket.id);
    playerToRoom.delete(socket.id);
    if (!roomId) return;
    const room = roomsById.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.socketId === socket.id);
    if (player) {
      player.connected = false;
      // مهلة 60 ثانية لإعادة الاتصال قبل الإزالة
      setTimeout(() => {
        const r = roomsById.get(roomId);
        if (!r) return;
        const pp = r.players.find(px => px.id === player.id);
        if (pp && !pp.connected) {
          r.players = r.players.filter(px => px.id !== player.id);
          // لو انحذفت كلّها
          if (r.players.length === 0) {
            deleteRoom(roomId);
          } else {
            broadcastRoomState(r);
            broadcastPublicRooms();
          }
        }
      }, 60 * 1000);
    }

    resetInactivity(roomId);
  });
});

// --------------------------- تشغيل الخادم ---------------------------
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🎮 لعبة برا السالفة تعمل على http://localhost:${PORT}`);
  console.log(`⌚ ${new Date().toLocaleString('ar-SA')}`);
});
