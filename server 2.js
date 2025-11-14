import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const wss = new WebSocketServer({ port: 3000 });

// ============================================
// هياكل البيانات
// ============================================
const rooms = new Map();
const players = new Map();

// ============================================
// إعدادات اللعبة
// ============================================
const QUESTION_TIME = 60; // 60 ثانية لكل سؤال

// ============================================
// الكلمات
// ============================================
const words = {
  animals: [
    { word: 'أسد', description: 'حيوان مفترس' },
    { word: 'فيل', description: 'حيوان ضخم' },
    { word: 'زرافة', description: 'حيوان طويل العنق' },
    { word: 'نمر', description: 'حيوان مفترس' },
    { word: 'قرد', description: 'حيوان ذكي' },
  ],
  fruits: [
    { word: 'تفاح', description: 'فاكهة' },
    { word: 'موز', description: 'فاكهة' },
    { word: 'برتقال', description: 'فاكهة' },
    { word: 'فراولة', description: 'فاكهة' },
    { word: 'عنب', description: 'فاكهة' },
  ],
  sports: [
    { word: 'كرة القدم', description: 'رياضة جماعية' },
    { word: 'كرة السلة', description: 'رياضة جماعية' },
    { word: 'تنس', description: 'رياضة فردية' },
    { word: 'سباحة', description: 'رياضة مائية' },
    { word: 'ملاكمة', description: 'رياضة قتالية' },
  ],
};

// ============================================
// دوال مساعدة
// ============================================
function sendToPlayer(userId, event, data, ws = null) {
  const player = players.get(userId);
  const socket = ws || (player ? player.ws : null);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ event, data }));
  }
}

function broadcastToRoom(roomId, event, data, excludePlayerId = null) {
  const room = rooms.get(roomId);
  if (room) {
    room.players.forEach(playerId => {
      if (playerId !== excludePlayerId) {
        sendToPlayer(playerId, event, data);
      }
    });
  }
}

function getPlayersInRoom(roomId) {
  const room = rooms.get(roomId);
  if (!room) return [];
  return room.players.map(playerId => {
    const player = players.get(playerId);
    return {
      id: player.id,
      name: player.name,
      isCreator: player.isCreator,
    };
  });
}

// ============================================
// منطق اللعبة
// ============================================
function selectRandomWord(category) {
  const categoryWords = words[category] || Object.values(words).flat();
  const normalWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];

  const similarWords = categoryWords.filter(w => w.description === normalWord.description && w.word !== normalWord.word);
  const otherWords = categoryWords.filter(w => w.description !== normalWord.description);

  let spyWord;
  if (otherWords.length > 0) {
    spyWord = otherWords[Math.floor(Math.random() * otherWords.length)];
  } else if (similarWords.length > 0) {
    spyWord = similarWords[Math.floor(Math.random() * similarWords.length)];
  } else {
    const allOtherWords = Object.values(words).flat().filter(w => w.word !== normalWord.word);
    spyWord = allOtherWords[Math.floor(Math.random() * allOtherWords.length)];
  }

  return { normalWord: normalWord.word, spyWord: spyWord.word };
}

function generateChallengeWords(category, correctWord) {
  const categoryWords = words[category] || Object.values(words).flat();
  const challengeWords = [correctWord];
  while (challengeWords.length < 5) {
    const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)].word;
    if (!challengeWords.includes(randomWord)) {
      challengeWords.push(randomWord);
    }
  }
  return challengeWords.sort(() => Math.random() - 0.5);
}

function startNewRound(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  const { normalWord, spyWord } = selectRandomWord(room.category);
  room.currentWord = normalWord;
  room.spyWord = spyWord;
  room.gameState = 'playing';
  room.playersAsked = new Set();
  room.votes = [];

  const spyIndex = Math.floor(Math.random() * room.players.length);
  room.spyId = room.players[spyIndex];

  room.players.forEach((playerId, index) => {
    const player = players.get(playerId);
    player.isSpy = index === spyIndex;
    sendToPlayer(playerId, 'roundStart', {
      word: player.isSpy ? spyWord : normalWord,
      isSpy: player.isSpy,
      players: getPlayersInRoom(roomId),
    });
  });

  room.currentPlayerIndex = 0;
  startQuestionTimer(roomId);
  broadcastToRoom(roomId, 'nextTurn', { currentPlayer: room.players[room.currentPlayerIndex] });

  console.log(`🔄 بدء جولة جديدة في الغرفة ${room.roomCode}. المندس: ${players.get(room.spyId).name}`);
}

function startQuestionTimer(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  if (room.questionTimer) {
    clearTimeout(room.questionTimer);
  }

  room.questionTimer = setTimeout(() => {
    if (room.gameState !== 'playing') return;

    console.log(`⏰ انتهى وقت السؤال للاعب الحالي في الغرفة ${room.roomCode}.`);
    
    // ✅ إضافة اللاعب الحالي إلى قائمة من سأل
    const currentPlayerId = room.players[room.currentPlayerIndex];
    room.playersAsked.add(currentPlayerId);
    
    if (room.playersAsked.size >= room.players.length) {
      // جميع اللاعبين سألوا، انتقل إلى التصويت
      room.gameState = 'voting';
      stopTimer(room.id);
      broadcastToRoom(room.id, 'startVoting', { players: getPlayersInRoom(room.id) });
      startVotingTimer(room.id);
      console.log(`🗳️ بدء التصويت في الغرفة ${room.roomCode} بسبب انتهاء الوقت.`);
    } else {
      // انتقل إلى اللاعب التالي
      room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;
      startQuestionTimer(room.id);
      broadcastToRoom(room.id, 'nextTurn', { currentPlayer: room.players[room.currentPlayerIndex] });
    }

  }, QUESTION_TIME * 1000);

  broadcastToRoom(roomId, 'timer', { time: QUESTION_TIME });
}

function stopTimer(roomId) {
  const room = rooms.get(roomId);
  if (room && room.questionTimer) {
    clearTimeout(room.questionTimer);
    room.questionTimer = null;
  }
}

// ============================================
// معالجات الأحداث
// ============================================
function handleCreateRoom(ws, userId, data) {
  const { displayName, roomName, category, isPrivate } = data;
  const roomId = uuidv4();
  const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const player = {
    id: userId,
    name: displayName,
    ws: ws,
    isCreator: true,
    roomId: roomId,
  };
  players.set(userId, player);

  const room = {
    id: roomId,
    name: roomName,
    roomCode: roomCode,
    players: [userId],
    category: category,
    isPrivate: isPrivate,
    gameState: 'waiting',
  };
  rooms.set(roomId, room);

  sendToPlayer(userId, 'roomCreated', { roomCode: roomCode, players: getPlayersInRoom(roomId) });
  console.log(`✅ تم إنشاء غرفة: ${roomCode} بواسطة ${displayName} (${userId})`);
}

function handleJoinRoom(ws, userId, data) {
  const { displayName, roomCode } = data;
  const room = Array.from(rooms.values()).find(r => r.roomCode === roomCode);

  if (!room) {
    return sendToPlayer(userId, 'error', { message: 'الغرفة غير موجودة.' }, ws);
  }

  if (room.players.length >= 10) {
    return sendToPlayer(userId, 'error', { message: 'الغرفة ممتلئة.' }, ws);
  }

  const player = {
    id: userId,
    name: displayName,
    ws: ws,
    isCreator: false,
    roomId: room.id,
  };
  players.set(userId, player);

  room.players.push(userId);
  rooms.set(room.id, room);

  sendToPlayer(userId, 'joinedRoom', { roomCode: room.roomCode, players: getPlayersInRoom(room.id) });
  broadcastToRoom(room.id, 'playerJoined', { players: getPlayersInRoom(room.id) }, userId);
  console.log(`✅ انضمام: ${displayName} (${userId}) إلى الغرفة ${room.roomCode}`);
}

function handleStartGame(ws, userId, data) {
  const player = players.get(userId);
  if (!player || !player.isCreator) return;

  const room = rooms.get(player.roomId);
  if (!room || room.players.length < 3) {
    return sendToPlayer(userId, 'error', { message: 'يجب أن يكون هناك 3 لاعبين على الأقل لبدء اللعبة.' });
  }

  startNewRound(room.id);
}

function handleFinishQuestion(ws, userId, data) {
  const player = players.get(userId);
  if (!player || !player.roomId) return;

  const room = rooms.get(player.roomId);
  if (!room || room.gameState !== 'playing' || room.players[room.currentPlayerIndex] !== userId) {
    return sendToPlayer(userId, 'error', { message: 'ليس دورك لإنهاء السؤال.' });
  }

  room.playersAsked.add(userId);

  if (room.playersAsked.size >= room.players.length) {
    // جميع اللاعبين سألوا، انتقل إلى التصويت
    room.gameState = 'voting';
    stopTimer(room.id);
    broadcastToRoom(room.id, 'startVoting', { players: getPlayersInRoom(room.id) });
    startVotingTimer(room.id);
    console.log(`🗳️ بدء التصويت في الغرفة ${room.roomCode}`);
  } else {
    // انتقل إلى اللاعب التالي
    room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;
    startQuestionTimer(room.id);
    broadcastToRoom(room.id, 'nextTurn', { currentPlayer: room.players[room.currentPlayerIndex] });
  }
}

function handleVote(ws, userId, data) {
  const player = players.get(userId);
  if (!player || !player.roomId) return;

  const room = rooms.get(player.roomId);
  if (!room || room.gameState !== 'voting') return;

  const { targetId } = data;
  if (player.hasVoted) {
    return sendToPlayer(userId, 'error', { message: 'لقد قمت بالتصويت بالفعل.' });
  }

  player.hasVoted = true;
  room.votes.push({ voterId: userId, targetId });

  broadcastToRoom(room.id, 'playerVoted', { voterId: userId, targetId });

  if (room.votes.length === room.players.length) {
    // جميع اللاعبين صوتوا، احسب النتيجة
    clearTimeout(room.votingTimer);
    calculateVoteResult(room.id);
  }
}

function calculateVoteResult(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  const voteCounts = room.votes.reduce((acc, vote) => {
    acc[vote.targetId] = (acc[vote.targetId] || 0) + 1;
    return acc;
  }, {});

  const maxVotes = Math.max(...Object.values(voteCounts));
  const playersWithMaxVotes = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes);

  if (playersWithMaxVotes.length > 1) {
    // تعادل
    room.gameState = 'finished';
    broadcastToRoom(room.id, 'roundResult', {
      winner: 'spy',
      word: room.currentWord,
      spyWord: room.spyWord,
      spyPlayer: players.get(room.spyId).name,
      isSpyEliminated: false,
      tie: true,
    });
    console.log(`🎯 تعادل في التصويت! فاز المندس ${players.get(room.spyId).name} تلقائياً.`);
  } else {
    const votedPlayerId = playersWithMaxVotes[0];
    if (votedPlayerId === room.spyId) {
      // المندس انكشف
      room.gameState = 'challenge';
      const challengeWords = generateChallengeWords(room.category, room.currentWord);
      room.challenge = { spyId: room.spyId, words: challengeWords, correctWord: room.currentWord };
      sendToPlayer(room.spyId, 'spyChallenge', { words: challengeWords });
      room.players.filter(pid => pid !== room.spyId).forEach(pid => {
        sendToPlayer(pid, 'waitingForChallenge', { spyName: players.get(room.spyId).name });
      });
      room.challengeTimer = setTimeout(() => {
        if (room.gameState === 'challenge') {
          handleSpyChallengeAnswer(null, room.spyId, { chosenWord: '' });
        }
      }, 120000);
      console.log(`🚨 المندس ${players.get(room.spyId).name} انكشف! بدأ تحدي الكلمات.`);
    } else {
      // المندس لم ينكشف
      room.gameState = 'finished';
      broadcastToRoom(room.id, 'roundResult', {
        winner: 'spy',
        word: room.currentWord,
        spyWord: room.spyWord,
        spyPlayer: players.get(room.spyId).name,
        isSpyEliminated: false,
      });
      console.log(`🎉 فاز المندس ${players.get(room.spyId).name} بالتصويت.`);
    }
  }

  room.players.forEach(pid => { players.get(pid).hasVoted = false; });
  rooms.set(roomId, room);
}

function startVotingTimer(room) {
  if (room.votingTimer) clearTimeout(room.votingTimer);
  room.votingTimer = setTimeout(() => {
    if (room.gameState === 'voting') {
      calculateVoteResult(room.id);
    }
  }, 60000);
}

function handleSpyChallengeAnswer(ws, userId, data) {
  const room = players.get(userId)?.roomId ? rooms.get(players.get(userId).roomId) : null;
  if (!room || room.gameState !== 'challenge' || room.spyId !== userId) return;

  clearTimeout(room.challengeTimer);
  const { chosenWord } = data;
  const result = { word: room.currentWord, spyWord: room.spyWord, spyPlayer: players.get(room.spyId).name, challenge: { chosenWord, correctWord: room.currentWord } };

  if (chosenWord === room.currentWord) {
    result.winner = 'spy';
    result.challenge.status = 'win';
    console.log(`🎉 فاز المندس ${players.get(room.spyId).name} بتحدي الكلمات.`);
  } else {
    result.winner = 'normal';
    result.challenge.status = 'lose';
    console.log(`❌ خسر المندس ${players.get(room.spyId).name} تحدي الكلمات.`);
  }

  room.gameState = 'finished';
  broadcastToRoom(room.id, 'roundResult', result);
  rooms.set(room.id, room);
}

function handleRequestNewRound(ws, userId, data) {
  const player = players.get(userId);
  if (!player || !player.isCreator) return;

  const room = rooms.get(player.roomId);
  if (!room || room.gameState !== 'finished') return;

  room.newRoundVote = { requester: userId, votes: {} };
  broadcastToRoom(room.id, 'newRoundRequested', { requesterName: player.name });
  console.log(`📢 طلب جولة جديدة في الغرفة ${room.roomCode}`);
}

function handleVoteNewRound(ws, userId, data) {
  const player = players.get(userId);
  if (!player || !player.roomId) return;

  const room = rooms.get(player.roomId);
  if (!room || room.gameState !== 'finished' || !room.newRoundVote) return;

  const { accept } = data;

  if (accept) {
    room.newRoundVote.votes[userId] = true;
    const allVoted = room.players.every(pid => room.newRoundVote.votes[pid]);
    if (allVoted) {
      console.log(`✅ تم قبول الجولة الجديدة في الغرفة ${room.roomCode}`);
      startNewRound(room.id);
      room.newRoundVote = null;
    }
  } else {
    console.log(`🚶‍♂️ اللاعب ${player.name} رفض الجولة الجديدة وغادر الغرفة ${room.roomCode}.`);
    broadcastToRoom(room.id, 'playerLeft', { userId, playerName: player.name, reason: 'rejectedNewRound' });
    handleLeaveRoom(ws, userId, { roomId: room.id });
    room.newRoundVote = null;
  }
  rooms.set(room.id, room);
}

function handleLeaveRoom(ws, userId, data) {
  const player = players.get(userId);
  if (!player) return;

  const room = rooms.get(player.roomId);
  if (!room) return;

  room.players = room.players.filter(pid => pid !== userId);
  players.delete(userId);

  if (room.players.length === 0) {
    rooms.delete(room.id);
    console.log(`🗑️ تم حذف الغرفة ${room.roomCode} لعدم وجود لاعبين.`);
  } else {
    if (player.isCreator) {
      const newCreator = players.get(room.players[0]);
      newCreator.isCreator = true;
      console.log(`👑 تم تعيين ${newCreator.name} كمنشئ جديد للغرفة ${room.roomCode}.`);
    }
    broadcastToRoom(room.id, 'playerLeft', { userId, playerName: player.name, players: getPlayersInRoom(room.id) });
    console.log(`👋 غادر اللاعب ${player.name} (${userId}).`);
  }
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

function handleDisconnect(userId) {
  const player = players.get(userId);
  if (player) {
    console.log(`⏰ حذف اللاعب ${player.name} بعد انقطاع الاتصال`);
    handleLeaveRoom(null, userId, {});
  }
}

// ============================================
// WebSocket معالجات الاتصال
// ============================================
wss.on('connection', (ws) => {
  const userId = uuidv4();
  players.set(userId, { id: userId, ws: ws, name: null, roomId: null });
  sendToPlayer(userId, 'setUserId', { userId }, ws);
  console.log(`✅ اتصال WebSocket جديد: ${userId}`);

  ws.on('message', (message) => {
    try {
      const { event, data } = JSON.parse(message);
      console.log(`📨 رسالة من ${userId}: ${event}`, data);
      const handler = {
        createRoom: handleCreateRoom,
        joinRoom: handleJoinRoom,
        startGame: handleStartGame,
        finishQuestion: handleFinishQuestion,
        vote: handleVote,
        spyChallengeAnswer: handleSpyChallengeAnswer,
        requestNewRound: handleRequestNewRound,
        voteNewRound: handleVoteNewRound,
        leaveRoom: handleLeaveRoom,
        chatMessage: handleChatMessage,
        ping: () => sendToPlayer(userId, 'pong', {}),
      }[event];
      if (handler) handler(ws, userId, data);
    } catch (error) {
      console.error('❌ خطأ في معالجة الرسالة:', error);
    }
  });

  ws.on('close', () => {
    console.log(`❌ انفصال WebSocket: ${userId}`);
    handleDisconnect(userId);
  });
});

console.log('🎮 لعبة برا السالفة تعمل على http://localhost:3000');
console.log(`📊 الوقت الحالي: ${new Date().toLocaleString('ar-SA')}`);
