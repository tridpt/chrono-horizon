/**
 * 🌌 ChronoHorizon — Next-Gen AAA Gameplay, Audio & Cinematic Expansion Module
 * ----------------------------------------------------------------------------
 * 1. Hệ thống Âm thanh Vũ trụ Động 4 Pha (Dynamic Cosmic Organ/Drone + Heartbeat Pha IV + Visor/EVA SFX)
 * 2. Hiệu ứng Điện ảnh Toàn màn hình 60FPS: Vụ nổ Siêu Tân Tinh 22:00 & Tua Ngược Thời Gian về 00:00 + Cutscene 3 Kết Cục
 * 3. Nhiệm vụ Bộ Hành Không Gian Không Trọng Lực (EVA Zero-G Spacewalk: Jetpack Inertia, Hàn Hồ Quang 3 Ống Plasma, Nhặt Tinh Thể Tachyon)
 * 4. Sơ đồ Mạng Lưới Manh Mối (Outer Wilds Ship Log Rumor Graph) & Trạm Hỏi Đáp AI KRONOS-7 Trực Tiếp
 */

(function () {
  // ==========================================================================
  // 1. PRELOAD ẢNH CONCEPT ART BỘ HÀNH KHÔNG GIAN EVA ZERO-G
  // ==========================================================================
  const evaHullImg = new Image();
  let evaHullReady = false;
  evaHullImg.onload = () => {
    evaHullReady = true;
  };
  evaHullImg.src = '/assets/sector-eva-hull.jpg';

  // ==========================================================================
  // 2. HỆ THỐNG ÂM THANH KHÔNG GIAN ĐỘNG 4 PHA (WEB AUDIO HANS ZIMMER / OUTER WILDS)
  // ==========================================================================
  const dynamicAudio = {
    ctx: null,
    started: false,
    enabled: true,
    masterGain: null,
    filterNode: null,
    osc1: null,
    osc2: null,
    subOsc: null,
    lfo: null,
    lfoGain: null,
    currentPhase: 1,
    currentMode: 'ROOM',
    heartbeatTimer: null
  };

  // Tần số hợp âm Vũ trụ biến đổi theo 4 Pha (Hz)
  const PHASE_CHORDS = {
    1: { f1: 65.41, f2: 98.0, sub: 32.7, cutoff: 290, lfoRate: 0.18 }, // C2 + G2 (Tĩnh lặng huyền bí)
    2: { f1: 73.42, f2: 110.0, sub: 36.71, cutoff: 430, lfoRate: 0.42 }, // D2 + A2 (Bão từ Mặt trời đôi)
    3: { f1: 58.27, f2: 87.31, sub: 29.14, cutoff: 360, lfoRate: 0.68 }, // Bb1 + F2 (Lệch trọng trường Dị điểm)
    4: { f1: 61.74, f2: 92.5, sub: 30.87, cutoff: 580, lfoRate: 1.35 } // B1 + F#2 (Căng thẳng Sụp đổ Chân không)
  };

  function ensureAmbientAudio() {
    if (!dynamicAudio.enabled) return;
    if (dynamicAudio.started && dynamicAudio.ctx) {
      if (dynamicAudio.ctx.state === 'suspended') {
        dynamicAudio.ctx.resume().catch(() => {});
      }
      return;
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.055, ctx.currentTime + 1.8);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(290, ctx.currentTime);
      filter.Q.setValueAtTime(2.4, ctx.currentTime);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      subOsc.type = 'sine';

      osc1.frequency.setValueAtTime(65.41, ctx.currentTime);
      osc2.frequency.setValueAtTime(98.0, ctx.currentTime);
      osc2.detune.setValueAtTime(7, ctx.currentTime);
      subOsc.frequency.setValueAtTime(32.7, ctx.currentTime);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
      lfoGain.gain.setValueAtTime(95, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      subOsc.connect(filter);
      filter.connect(master);
      master.connect(ctx.destination);

      osc1.start();
      osc2.start();
      subOsc.start();
      lfo.start();

      dynamicAudio.ctx = ctx;
      dynamicAudio.masterGain = master;
      dynamicAudio.filterNode = filter;
      dynamicAudio.osc1 = osc1;
      dynamicAudio.osc2 = osc2;
      dynamicAudio.subOsc = subOsc;
      dynamicAudio.lfo = lfo;
      dynamicAudio.lfoGain = lfoGain;
      dynamicAudio.started = true;

      // Nhịp đập tim & Sonar cảnh báo khi ở Pha IV hoặc EVA
      dynamicAudio.heartbeatTimer = setInterval(() => {
        if (!dynamicAudio.enabled || !dynamicAudio.ctx || dynamicAudio.ctx.state !== 'running') {
          return;
        }
        const visor =
          window.ChronoGraphics && window.ChronoGraphics.playerState
            ? window.ChronoGraphics.playerState.visorMode
            : 'NORMAL';

        if (dynamicAudio.currentPhase === 4) {
          playHeartbeatAndKlaxon();
        } else if (visor === 'THERMAL') {
          playSubtlePulse(1250, 0.03, 'square', 0.014);
        } else if (visor === 'ECHO') {
          playSubtlePulse(784, 0.28, 'sine', 0.022);
        } else if (dynamicAudio.currentMode === 'EVA') {
          // Tiếng thở mũ phi hành gia nhẹ nhàng
          playSubtlePulse(145, 0.35, 'triangle', 0.018);
        }
      }, 2200);
    } catch (_) {
      // Ignore browser autoplay block until next gesture
    }
  }

  function playSubtlePulse(freq, dur, waveType, vol) {
    if (!dynamicAudio.ctx || !dynamicAudio.enabled) return;
    try {
      const now = dynamicAudio.ctx.currentTime;
      const o = dynamicAudio.ctx.createOscillator();
      const g = dynamicAudio.ctx.createGain();
      o.type = waveType || 'sine';
      o.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(vol || 0.02, now);
      g.gain.exponentialRampToValueAtTime(0.0008, now + dur);
      o.connect(g);
      g.connect(dynamicAudio.ctx.destination);
      o.start(now);
      o.stop(now + dur);
    } catch (_) {}
  }

  function playHeartbeatAndKlaxon() {
    if (!dynamicAudio.ctx || !dynamicAudio.enabled) return;
    try {
      const ctx = dynamicAudio.ctx;
      const now = ctx.currentTime;
      // Lub-dub heartbeat
      [0, 0.24].forEach((offset, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(idx === 0 ? 58 : 48, now + offset);
        o.frequency.exponentialRampToValueAtTime(28, now + offset + 0.18);
        g.gain.setValueAtTime(idx === 0 ? 0.11 : 0.08, now + offset);
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + offset);
        o.stop(now + offset + 0.21);
      });
      // Subtle high sonar klaxon harmonic
      const klax = ctx.createOscillator();
      const kg = ctx.createGain();
      klax.type = 'triangle';
      klax.frequency.setValueAtTime(880, now + 0.6);
      klax.frequency.exponentialRampToValueAtTime(660, now + 1.05);
      kg.gain.setValueAtTime(0.022, now + 0.6);
      kg.gain.exponentialRampToValueAtTime(0.0008, now + 1.1);
      klax.connect(kg);
      kg.connect(ctx.destination);
      klax.start(now + 0.6);
      klax.stop(now + 1.12);
    } catch (_) {}
  }

  function playSupernovaSoundFX() {
    ensureAmbientAudio();
    if (!dynamicAudio.ctx || !dynamicAudio.enabled) return;
    try {
      const ctx = dynamicAudio.ctx;
      const now = ctx.currentTime;
      // 1. Sub-bass Supernova Detonation (0.0s -> 1.4s)
      const boom = ctx.createOscillator();
      const bg = ctx.createGain();
      boom.type = 'sawtooth';
      boom.frequency.setValueAtTime(160, now);
      boom.frequency.exponentialRampToValueAtTime(26, now + 1.35);
      bg.gain.setValueAtTime(0.16, now);
      bg.gain.exponentialRampToValueAtTime(0.002, now + 1.45);
      boom.connect(bg);
      bg.connect(ctx.destination);
      boom.start(now);
      boom.stop(now + 1.48);

      // 2. Reverse Time-Rewind Crystalline Sweep (1.4s -> 3.4s)
      const rew = ctx.createOscillator();
      const rg = ctx.createGain();
      rew.type = 'sine';
      rew.frequency.setValueAtTime(130, now + 1.4);
      rew.frequency.exponentialRampToValueAtTime(1320, now + 3.3);
      rg.gain.setValueAtTime(0.005, now + 1.4);
      rg.gain.linearRampToValueAtTime(0.09, now + 2.8);
      rg.gain.exponentialRampToValueAtTime(0.001, now + 3.5);
      rew.connect(rg);
      rg.connect(ctx.destination);
      rew.start(now + 1.4);
      rew.stop(now + 3.55);
    } catch (_) {}
  }

  function playEndingChordFX(endingId) {
    ensureAmbientAudio();
    if (!dynamicAudio.ctx || !dynamicAudio.enabled) return;
    try {
      const ctx = dynamicAudio.ctx;
      const now = ctx.currentTime;
      const notes =
        endingId === 'ENDING_TRUE_SYMBIOSIS'
          ? [261.63, 329.63, 392.0, 493.88, 587.33] // Cmaj9 Hans Zimmer Uplift
          : endingId === 'ENDING_ETERNAL_GUARDIAN'
          ? [220.0, 261.63, 329.63, 440.0] // Am Noble Sentinel
          : [146.83, 174.61, 207.65, 277.18]; // Diminished Paradox
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = i % 2 === 0 ? 'triangle' : 'sine';
        o.frequency.setValueAtTime(freq, now + i * 0.08);
        g.gain.setValueAtTime(0.001, now + i * 0.08);
        g.gain.linearRampToValueAtTime(0.055, now + 0.5 + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.0008, now + 3.4);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + i * 0.08);
        o.stop(now + 3.5);
      });
    } catch (_) {}
  }

  function syncDynamicAudio(gameState, canvasMode, isSoundEnabled) {
    dynamicAudio.enabled = Boolean(isSoundEnabled);
    dynamicAudio.currentMode = canvasMode || 'ROOM';
    const phase = gameState && gameState.session ? gameState.session.currentPhase : 1;
    dynamicAudio.currentPhase = phase;

    if (!dynamicAudio.started || !dynamicAudio.ctx) return;
    const now = dynamicAudio.ctx.currentTime;

    if (!dynamicAudio.enabled) {
      dynamicAudio.masterGain.gain.setTargetAtTime(0.0001, now, 0.15);
      return;
    }

    const chord = PHASE_CHORDS[phase] || PHASE_CHORDS[1];
    const modeCutoffBoost = canvasMode === 'EVA' ? -90 : canvasMode === 'ORBIT' ? 60 : 0;
    dynamicAudio.masterGain.gain.setTargetAtTime(0.052, now, 0.3);
    dynamicAudio.osc1.frequency.setTargetAtTime(chord.f1, now, 0.6);
    dynamicAudio.osc2.frequency.setTargetAtTime(chord.f2, now, 0.6);
    dynamicAudio.subOsc.frequency.setTargetAtTime(chord.sub, now, 0.6);
    dynamicAudio.filterNode.frequency.setTargetAtTime(
      Math.max(140, chord.cutoff + modeCutoffBoost),
      now,
      0.5
    );
    dynamicAudio.lfo.frequency.setTargetAtTime(chord.lfoRate, now, 0.5);
  }

  // Tự động kích hoạt Ambient Audio ở thao tác đầu tiên của người chơi
  ['pointerdown', 'keydown'].forEach((evName) => {
    window.addEventListener(
      evName,
      () => {
        ensureAmbientAudio();
      },
      { passive: true }
    );
  });

  // ==========================================================================
  // 3. ENGINE ĐIỆN ẢNH TOÀN MÀN HÌNH 60FPS (SIÊU TÂN TINH 22:00 & 3 KẾT CỤC)
  // ==========================================================================
  const cinematicState = {
    active: false,
    mode: null, // 'SUPERNOVA' | 'ENDING'
    startTime: 0,
    loopNumber: 2,
    ending: null,
    sessionSnapshot: null,
    particles: [],
    rafId: null
  };

  function initParticlesForCutscene(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.25;
      const speed = 2.2 + Math.random() * 6.5;
      arr.push({
        ang,
        speed,
        dist: 12 + Math.random() * 26,
        size: 1.6 + Math.random() * 3.4,
        hue: i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#facc15' : '#e879f9'
      });
    }
    return arr;
  }

  function closeCinematicOverlay() {
    cinematicState.active = false;
    if (cinematicState.rafId) {
      cancelAnimationFrame(cinematicState.rafId);
      cinematicState.rafId = null;
    }
    const ov = document.getElementById('cinematicOverlay');
    if (ov) ov.classList.remove('open');
  }

  function playSupernovaCutscene(newLoopNumber) {
    const ov = document.getElementById('cinematicOverlay');
    const card = document.getElementById('cinematicEpilogueCard');
    const hud = document.getElementById('cinematicSupernovaHud');
    if (!ov) return;

    cinematicState.active = true;
    cinematicState.mode = 'SUPERNOVA';
    cinematicState.startTime = performance.now();
    cinematicState.loopNumber = newLoopNumber || 2;
    cinematicState.particles = initParticlesForCutscene(135);

    if (card) card.style.display = 'none';
    if (hud) hud.style.display = 'flex';
    ov.classList.add('open');
    playSupernovaSoundFX();

    if (cinematicState.rafId) cancelAnimationFrame(cinematicState.rafId);
    cinematicState.rafId = requestAnimationFrame(renderCinematicFrame);
  }

  function playEndingCutscene(endingObj, session) {
    const ov = document.getElementById('cinematicOverlay');
    const card = document.getElementById('cinematicEpilogueCard');
    const hud = document.getElementById('cinematicSupernovaHud');
    if (!ov || !endingObj) return;

    cinematicState.active = true;
    cinematicState.mode = 'ENDING';
    cinematicState.startTime = performance.now();
    cinematicState.ending = endingObj;
    cinematicState.sessionSnapshot = session;
    cinematicState.particles = initParticlesForCutscene(110);

    if (hud) hud.style.display = 'none';
    if (card) {
      card.style.display = 'block';
      const isHarmony = endingObj.id === 'ENDING_TRUE_SYMBIOSIS';
      const isContain = endingObj.id === 'ENDING_ETERNAL_GUARDIAN';
      const rankCode = isHarmony
        ? 'RANK S+ // QUANTUM SYMBIOSIS SAVIOR'
        : isContain
        ? 'RANK A // EVENT HORIZON SENTINEL'
        : 'RANK C // TIMELINE PARADOX FRACTURE';

      const crewFates = isHarmony
        ? [
            { name: 'Chỉ huy Elena Vance', state: 'ĐÃ GIẢI CỨU • Trở về quỹ đạo Trái Đất', col: '#34d399' },
            { name: 'TS. Trần Khải Minh', state: 'ĐÃ GIẢI CỨU • Đồng bộ thành công Lõi Tachyon', col: '#34d399' },
            { name: 'TS. Sora Kurosawa', state: 'ĐÃ GIẢI CỨU • Giao ước cùng Kiến Trúc Sư Sao', col: '#34d399' },
            { name: 'AI Trạm KRONOS-7', state: 'NÂNG CẤP LƯỢNG TỬ • Phục hồi 100% mạng thần kinh', col: '#38bdf8' }
          ]
        : isContain
        ? [
            { name: 'Hệ Mặt Trời', state: 'AN TOÀN VĨNH VIỄN • Siêu tân tinh bị triệt tiêu', col: '#38bdf8' },
            { name: 'Phi Hành Đoàn Aethelgard', state: 'NEO TĨNH LẶNG • Bất tử nơi rìa Chân Trời Sự Kiện', col: '#facc15' },
            { name: 'Hộp Đen Truyền Tin', state: 'ĐÃ PHÁT VỀ TRÁI ĐẤT • Lưu danh huyền thoại', col: '#34d399' },
            { name: 'AI Trạm KRONOS-7', state: 'NGƯỜI GÁC ĐÊM • Duy trì phong ấn vĩnh cửu', col: '#a855f7' }
          ]
        : [
            { name: 'Màng Không-Thời Gian', state: 'RẠCH VỠ ĐA VŨ TRỤ • Phân tách hàng ngàn bản sao', col: '#fb7185' },
            { name: 'Phi Hành Đoàn Aethelgard', state: 'VẪN MẮC KẸT (+0.04s) • Chờ chu kỳ giải cứu mới', col: '#facc15' },
            { name: 'Lõi Phản Vật Chất', state: 'QUÁ TẢI CƯỠNG BỨC • Thiếu điều hòa Tia Tím', col: '#fb7185' },
            { name: 'AI Trạm KRONOS-7', state: 'TÁI KÍCH HOẠT NEO • Kéo ý thức về Phút 00:00', col: '#38bdf8' }
          ];

      const logsCount = session && session.persistentMemory ? session.persistentMemory.discoveredLogs.length : 0;
      const evaDone = session && session.persistentMemory && session.persistentMemory.evaCompleted;

      card.innerHTML = `
        <div class="epilogue-top-row">
          <span class="epilogue-code-pill" style="--ep-col:${endingObj.badgeColor};">${endingObj.code}</span>
          <span class="epilogue-rank-pill" style="--ep-col:${endingObj.badgeColor};">${rankCode}</span>
        </div>
        <h2 class="epilogue-main-title">${endingObj.title}</h2>
        <p class="epilogue-summary">${endingObj.summary}</p>

        <div class="epilogue-crew-grid">
          ${crewFates
            .map(
              (c) => `
            <div class="epilogue-crew-card">
              <div class="epilogue-crew-name">${c.name}</div>
              <div class="epilogue-crew-state" style="color:${c.col};">● ${c.state}</div>
            </div>
          `
            )
            .join('')}
        </div>

        <div class="epilogue-stats-bar">
          <span>⏱ Chu kỳ hoàn thành: <strong>#${session ? session.loopNumber : 1}</strong></span>
          <span>📼 Hộp đen giải mã: <strong>${logsCount}/13</strong></span>
          <span>🧑‍🚀 Bộ hành EVA Zero-G: <strong>${evaDone ? 'HOÀN TẤT 100%' : 'CHƯA THỰC HIỆN'}</strong></span>
        </div>

        <div class="epilogue-actions">
          <button class="btn btn-primary" onclick="window.ChronoUpgrades.closeCinematic()">
            🌌 Quay Lại Trạm (Tiếp Tục Khám Phá)
          </button>
          <button class="btn btn-warning" onclick="window.ChronoUpgrades.closeCinematic(); generateProceduralCampaign();">
            🎲 Sinh Chiến Dịch Vũ Trụ Ngẫu Nhiên Mới
          </button>
        </div>
      `;
    }

    ov.classList.add('open');
    playEndingChordFX(endingObj.id);

    if (cinematicState.rafId) cancelAnimationFrame(cinematicState.rafId);
    cinematicState.rafId = requestAnimationFrame(renderCinematicFrame);
  }

  function renderCinematicFrame(now) {
    if (!cinematicState.active) return;
    const canvas = document.getElementById('cinematicCanvas');
    if (!canvas) return;
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const elapsed = (now - cinematicState.startTime) / 1000;

    if (cinematicState.mode === 'SUPERNOVA') {
      if (elapsed >= 4.25) {
        closeCinematicOverlay();
        return;
      }

      // Camera shake trong 1.4s đầu vụ nổ Siêu Tân Tinh
      ctx.save();
      ctx.fillStyle = 'rgba(3, 6, 16, 0.92)';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      if (elapsed < 1.45) {
        const shake = (1.45 - elapsed) * 16;
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      }

      // Pha 1 (0..1.45s): Vụ nổ Siêu Tân Tinh Mắt Ouroboros
      // Pha 2 (1.45..3.5s): Đảo ngược dòng hạt Tachyon thu về Tâm Ký Ức (22:00 -> 00:00)
      const isRewind = elapsed >= 1.45;
      const tNorm = !isRewind
        ? elapsed / 1.45
        : Math.max(0, 1 - (elapsed - 1.45) / 1.95);

      // Sóng xung kích Hố đen / Siêu tân tinh
      const maxR = Math.hypot(w, h) * 0.55;
      const shockR = Math.max(16, tNorm * maxR);
      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, shockR);
      if (!isRewind) {
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.22, 'rgba(250, 204, 21, 0.92)');
        grad.addColorStop(0.52, 'rgba(244, 63, 94, 0.65)');
        grad.addColorStop(0.82, 'rgba(168, 85, 247, 0.28)');
        grad.addColorStop(1, 'rgba(3, 6, 16, 0)');
      } else {
        grad.addColorStop(0, '#e0f2fe');
        grad.addColorStop(0.25, 'rgba(56, 189, 248, 0.78)');
        grad.addColorStop(0.6, 'rgba(168, 85, 247, 0.35)');
        grad.addColorStop(1, 'rgba(3, 6, 16, 0)');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
      ctx.fill();

      // Vòng xuyến sóng chấn động kép
      ctx.strokeStyle = !isRewind ? 'rgba(254, 240, 138, 0.85)' : 'rgba(56, 189, 248, 0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, shockR * 0.78, 0, Math.PI * 2);
      ctx.stroke();

      // 135 hạt vật chất & ký ức bay bung ra rồi xoắn ngược trở về 00:00
      for (const pt of cinematicState.particles) {
        const spiralAngle = pt.ang + (isRewind ? (elapsed - 1.45) * 2.2 : elapsed * 0.5);
        const radius = pt.dist + tNorm * pt.speed * 95;
        const px = cx + Math.cos(spiralAngle) * radius;
        const py = cy + Math.sin(spiralAngle) * radius;

        ctx.strokeStyle = pt.hue;
        ctx.lineWidth = pt.size * 0.85;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(
          px - Math.cos(spiralAngle) * (isRewind ? -18 : 18),
          py - Math.sin(spiralAngle) * (isRewind ? -18 : 18)
        );
        ctx.stroke();
      }

      // Cập nhật chữ HUD đồng hồ tua ngược 22:00 -> 00:00
      const phaseEl = document.getElementById('cineSupernovaStage');
      const clockEl = document.getElementById('cineSupernovaClock');
      const subEl = document.getElementById('cineSupernovaSub');
      if (phaseEl && clockEl && subEl) {
        if (!isRewind) {
          phaseEl.textContent = '💥 SUPERNOVA DETONATION // MẮT OUROBOROS SỤP ĐỔ';
          phaseEl.style.color = '#fda4af';
          clockEl.textContent = '22:00:00';
          subEl.textContent = 'Trường Neo Lượng Tử KRONOS-7 đang thu giữ toàn bộ ký ức & dữ liệu Hộp đen...';
        } else {
          const minsLeft = Math.max(0, Math.round(tNorm * 22));
          const secsLeft = Math.max(0, Math.floor(((tNorm * 22) % 1) * 60));
          phaseEl.textContent = `⏪ QUANTUM MEMORY REWIND // KHỞI TẠO CHU KỲ #${cinematicState.loopNumber}`;
          phaseEl.style.color = '#38bdf8';
          clockEl.textContent = `${String(minsLeft).padStart(2, '0')}:${String(secsLeft).padStart(2, '0')}`;
          subEl.textContent = 'Bảo toàn 100% Sổ tay Hộp đen, Cổ ngữ, Công thức & Chìa khóa Lượng tử!';
        }
      }

      ctx.restore();
    } else if (cinematicState.mode === 'ENDING') {
      // Nền vũ trụ 60FPS cho màn hình Epilogue 3 Kết Cục
      ctx.fillStyle = 'rgba(3, 7, 18, 0.92)';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const endColor = cinematicState.ending ? cinematicState.ending.badgeColor : '#10b981';

      const halo = ctx.createRadialGradient(cx, cy * 0.72, 10, cx, cy * 0.72, Math.min(w, h) * 0.62);
      halo.addColorStop(0, endColor + '55');
      halo.addColorStop(0.5, 'rgba(56, 189, 248, 0.14)');
      halo.addColorStop(1, 'rgba(2, 5, 14, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // 3 Vòng Tinh Bàn Khổng Lồ Xoay Chậm Phía Sau Thẻ Kết Cục
      [150, 230, 310].forEach((r, idx) => {
        ctx.save();
        ctx.translate(cx, cy * 0.78);
        ctx.rotate(elapsed * (idx % 2 === 0 ? 0.18 : -0.14) + idx);
        ctx.strokeStyle = endColor + '44';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([12, 8]);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      for (const pt of cinematicState.particles) {
        const ang = pt.ang + elapsed * 0.12;
        const rad = 60 + ((pt.dist * 9 + elapsed * 22) % (Math.max(w, h) * 0.55));
        const px = cx + Math.cos(ang) * rad;
        const py = cy + Math.sin(ang) * rad * 0.65;
        ctx.fillStyle = pt.hue;
        ctx.beginPath();
        ctx.arc(px, py, pt.size * 0.75, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    cinematicState.rafId = requestAnimationFrame(renderCinematicFrame);
  }

  // ==========================================================================
  // 4. NHIỆM VỤ BỘ HÀNH KHÔNG GIAN KHÔNG TRỌNG LỰC (EVA ZERO-G SPACEWALK)
  // ==========================================================================
  const evaState = {
    x: 185,
    y: 265,
    vx: 0,
    vy: 0,
    oxygen: 100,
    mouseDown: false,
    keys: { w: false, a: false, s: false, d: false },
    thrusterParticles: [],
    submittingComplete: false,
    shieldFlash: 0,
    conduits: [
      { id: 'c1', label: 'ỐNG PLASMA SỐ 1', x: 445, y: 235, progress: 0, welded: false },
      { id: 'c2', label: 'ỐNG PLASMA SỐ 2', x: 515, y: 345, progress: 0, welded: false },
      { id: 'c3', label: 'TRẠM TỪ TRƯỜNG SỐ 3', x: 380, y: 125, progress: 0, welded: false }
    ],
    shards: [
      { id: 's1', x: 635, y: 185, baseY: 185, collected: false },
      { id: 's2', x: 705, y: 295, baseY: 295, collected: false },
      { id: 's3', x: 590, y: 385, baseY: 385, collected: false }
    ],
    asteroids: [
      { x: 560, y: 120, vx: -0.65, vy: 0.48, r: 16, rot: 0 },
      { x: 740, y: 240, vx: -0.82, vy: -0.35, r: 19, rot: 1.2 },
      { x: 650, y: 390, vx: 0.55, vy: -0.62, r: 15, rot: 2.4 }
    ]
  };

  function setupEvaInputs() {
    window.addEventListener('keydown', (e) => {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') evaState.keys.w = true;
      if (k === 's' || e.key === 'ArrowDown') evaState.keys.s = true;
      if (k === 'a' || e.key === 'ArrowLeft') evaState.keys.a = true;
      if (k === 'd' || e.key === 'ArrowRight') evaState.keys.d = true;
    });
    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') evaState.keys.w = false;
      if (k === 's' || e.key === 'ArrowDown') evaState.keys.s = false;
      if (k === 'a' || e.key === 'ArrowLeft') evaState.keys.a = false;
      if (k === 'd' || e.key === 'ArrowRight') evaState.keys.d = false;
    });

    const spaceCanvas = document.getElementById('spaceCanvas');
    if (spaceCanvas) {
      spaceCanvas.addEventListener('mousedown', () => {
        evaState.mouseDown = true;
      });
      window.addEventListener('mouseup', () => {
        evaState.mouseDown = false;
      });
    }
  }

  async function notifyServerEvaComplete() {
    if (evaState.submittingComplete) return;
    evaState.submittingComplete = true;
    try {
      if (typeof playSciFiSound === 'function') playSciFiSound('solve');
      const res = await apiRequest('/api/eva/complete', 'POST', {
        weldedConduits: 3,
        collectedShards: 3
      });
      if (res && res.state && typeof window.syncExternalGameState === 'function') {
        window.syncExternalGameState(res.state, res.message);
      }
    } catch (_) {
      evaState.submittingComplete = false;
    }
  }

  function drawEvaSpacewalk(ctx, w, h, animFrame, mousePos, gameState) {
    const alreadyDone =
      gameState &&
      gameState.session &&
      gameState.session.persistentMemory &&
      gameState.session.persistentMemory.evaCompleted;

    if (alreadyDone) {
      evaState.conduits.forEach((c) => {
        c.welded = true;
        c.progress = 100;
      });
      evaState.shards.forEach((s) => {
        s.collected = true;
      });
    }

    // 1. Vẽ nền Concept Art Không Gian Vỏ Trạm Aethelgard-IX + Hố Đen Gargantua
    if (evaHullReady) {
      const driftX = Math.sin(animFrame * 0.012) * 5;
      const driftY = Math.cos(animFrame * 0.01) * 3;
      ctx.drawImage(evaHullImg, driftX - 6, driftY - 4, w + 12, h + 8);
      ctx.fillStyle = 'rgba(3, 8, 22, 0.28)';
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Cập nhật vật lý Không Trọng Lực (Zero-G Inertia)
    let thrustX = 0;
    let thrustY = 0;
    if (evaState.keys.a) thrustX -= 0.16;
    if (evaState.keys.d) thrustX += 0.16;
    if (evaState.keys.w) thrustY -= 0.16;
    if (evaState.keys.s) thrustY += 0.16;

    if (evaState.mouseDown && mousePos && mousePos.inside) {
      const dx = mousePos.x - evaState.x;
      const dy = mousePos.y - evaState.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 18) {
        thrustX += (dx / dist) * 0.17;
        thrustY += (dy / dist) * 0.17;
      }
    }

    // Lực hút nhẹ về phía Hố Đen bên phải nếu bay quá xa ra ngoài chân không
    if (evaState.x > 540) {
      thrustX += 0.018;
    }

    evaState.vx = (evaState.vx + thrustX) * 0.975;
    evaState.vy = (evaState.vy + thrustY) * 0.975;
    const maxSpd = 4.3;
    const curSpd = Math.hypot(evaState.vx, evaState.vy);
    if (curSpd > maxSpd) {
      evaState.vx = (evaState.vx / curSpd) * maxSpd;
      evaState.vy = (evaState.vy / curSpd) * maxSpd;
    }

    evaState.x = Math.max(85, Math.min(w - 55, evaState.x + evaState.vx));
    evaState.y = Math.max(78, Math.min(h - 58, evaState.y + evaState.vy));

    // Phun hạt lửa Plasma xanh từ Jetpack khi đẩy
    if (Math.hypot(thrustX, thrustY) > 0.02) {
      for (let i = 0; i < 2; i++) {
        evaState.thrusterParticles.push({
          x: evaState.x - thrustX * 45 + (Math.random() - 0.5) * 6,
          y: evaState.y - 12 - thrustY * 45 + (Math.random() - 0.5) * 6,
          vx: -thrustX * 9 + (Math.random() - 0.5) * 1.2,
          vy: -thrustY * 9 + (Math.random() - 0.5) * 1.2,
          life: 1
        });
      }
    }

    // Bình dưỡng khí O2: giảm nhẹ ngoài chân không, nạp đầy tức thì khi về gần Cửa Airlock 03 (140, 265)
    const distAirlock = Math.hypot(evaState.x - 140, evaState.y - 265);
    if (distAirlock < 85) {
      evaState.oxygen = Math.min(100, evaState.oxygen + 0.65);
    } else {
      evaState.oxygen = Math.max(15, evaState.oxygen - 0.018);
    }

    // 3. Dây Cáp An Toàn (Quantum Tether Cable) nối từ Airlock 03 tới lưng Phi hành gia
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.52)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(138, 268);
    const midX = (138 + evaState.x) / 2;
    const midY = (268 + evaState.y) / 2 + Math.sin(animFrame * 0.05) * 18;
    ctx.quadraticCurveTo(midX, midY, evaState.x - 8, evaState.y - 18);
    ctx.stroke();
    ctx.restore();

    // Vẽ Cổng Airlock 03 quay về Khoang Trong Trạm
    ctx.save();
    const airPulse = 0.65 + 0.35 * Math.sin(animFrame * 0.08);
    ctx.strokeStyle = `rgba(56, 189, 248, ${airPulse})`;
    ctx.fillStyle = 'rgba(6, 18, 38, 0.82)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(138, 268, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('AIRLOCK', 138, 266);
    ctx.fillStyle = '#bae6fd';
    ctx.font = 'bold 9px "Segoe UI", sans-serif';
    ctx.fillText('NẠP O₂ / VÀO', 138, 279);
    ctx.restore();

    // 4. Vẽ & Kiểm tra Va chạm Thiên Thạch Băng Trôi Nổi
    for (const ast of evaState.asteroids) {
      ast.x += ast.vx;
      ast.y += ast.vy;
      ast.rot += 0.02;
      if (ast.x < 460 || ast.x > w - 40) ast.vx *= -1;
      if (ast.y < 75 || ast.y > h - 55) ast.vy *= -1;

      const dAst = Math.hypot(evaState.x - ast.x, evaState.y - (ast.y + 12));
      if (dAst < ast.r + 20) {
        const pushAng = Math.atan2(evaState.y - ast.y, evaState.x - ast.x);
        evaState.vx += Math.cos(pushAng) * 2.4;
        evaState.vy += Math.sin(pushAng) * 2.4;
        evaState.shieldFlash = 12;
        if (typeof playSciFiSound === 'function') playSciFiSound('click');
      }

      ctx.save();
      ctx.translate(ast.x, ast.y);
      ctx.rotate(ast.rot);
      ctx.fillStyle = 'rgba(30, 41, 59, 0.92)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.75)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let k = 0; k < 7; k++) {
        const a = (Math.PI * 2 * k) / 7;
        const rr = ast.r * (k % 2 === 0 ? 1 : 0.76);
        if (k === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
        else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 5. Vẽ & Thu thập 3 Mảnh Tinh Thể Tachyon Lơ Lửng
    for (const sh of evaState.shards) {
      if (sh.collected) continue;
      sh.y = sh.baseY + Math.sin(animFrame * 0.06 + sh.x) * 8;
      if (Math.hypot(evaState.x - sh.x, evaState.y - 16 - sh.y) < 36) {
        sh.collected = true;
        if (typeof playSciFiSound === 'function') playSciFiSound('scan');
      }

      ctx.save();
      ctx.translate(sh.x, sh.y);
      ctx.rotate(Math.sin(animFrame * 0.04) * 0.25);
      ctx.shadowColor = '#e879f9';
      ctx.shadowBlur = 14;
      ctx.fillStyle = 'rgba(217, 70, 239, 0.35)';
      ctx.strokeStyle = '#f5d0fe';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(10, 0);
      ctx.lineTo(0, 14);
      ctx.lineTo(-10, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.font = 'bold 9.5px Consolas, monospace';
      ctx.fillStyle = '#fae8ff';
      ctx.textAlign = 'center';
      ctx.fillText('TACHYON', 0, 25);
      ctx.restore();
    }

    // 6. Vẽ & Hàn Hồ Quang 3 Ống Dẫn Plasma Bị Đứt Trên Vỏ Trạm
    let activeWeldTarget = null;
    for (const cd of evaState.conduits) {
      const distC = Math.hypot(evaState.x - cd.x, evaState.y - 16 - cd.y);
      const isWeldingNow = !cd.welded && distC <= 68;
      if (isWeldingNow) {
        activeWeldTarget = cd;
        cd.progress = Math.min(100, cd.progress + 1.15);
        if (cd.progress >= 100) {
          cd.welded = true;
          if (typeof playSciFiSound === 'function') playSciFiSound('solve');
        } else if (animFrame % 8 === 0) {
          playSubtlePulse(420 + cd.progress * 4, 0.05, 'sawtooth', 0.02);
        }
      }

      ctx.save();
      const col = cd.welded ? '#10b981' : isWeldingNow ? '#38bdf8' : '#fb923c';
      ctx.strokeStyle = col;
      ctx.fillStyle = 'rgba(7, 13, 28, 0.88)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cd.x, cd.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Vòng cung tiến độ hàn 0..100%
      if (!cd.welded && cd.progress > 0) {
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(cd.x, cd.y, 24, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * cd.progress) / 100);
        ctx.stroke();
      }

      // Tia lửa điện nếu chưa hàn xong
      if (!cd.welded && animFrame % 4 < 2) {
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.5;
        for (let s = 0; s < 3; s++) {
          const sa = animFrame * 0.3 + s * 2.1;
          ctx.beginPath();
          ctx.moveTo(cd.x, cd.y);
          ctx.lineTo(cd.x + Math.cos(sa) * 16, cd.y + Math.sin(sa) * 16);
          ctx.stroke();
        }
      }

      ctx.fillStyle = cd.welded ? '#6ee7b7' : '#fed7aa';
      ctx.font = 'bold 10px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(cd.welded ? '✓OK' : `${Math.floor(cd.progress)}%`, cd.x, cd.y + 4);

      ctx.fillStyle = 'rgba(6, 12, 28, 0.92)';
      ctx.fillRect(cd.x - 58, cd.y + 24, 116, 17);
      ctx.fillStyle = cd.welded ? '#6ee7b7' : '#f8fafc';
      ctx.font = 'bold 9.5px "Segoe UI", sans-serif';
      ctx.fillText(cd.welded ? `${cd.label} (KÍN)` : cd.label, cd.x, cd.y + 36);
      ctx.restore();
    }

    // 7. Vẽ hạt lửa phản lực Jetpack & Tia Hàn Laser Hồ Quang từ súng Phi hành gia
    for (let i = evaState.thrusterParticles.length - 1; i >= 0; i--) {
      const tp = evaState.thrusterParticles[i];
      tp.x += tp.vx;
      tp.y += tp.vy;
      tp.life -= 0.06;
      if (tp.life <= 0) {
        evaState.thrusterParticles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(56, 189, 248, ${tp.life * 0.85})`;
      ctx.beginPath();
      ctx.arc(tp.x, tp.y, tp.life * 4.2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (activeWeldTarget) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(evaState.x + 12, evaState.y - 22);
      ctx.lineTo(activeWeldTarget.x, activeWeldTarget.y);
      ctx.stroke();
      ctx.restore();
    }

    // 8. Vẽ Phi Hành Gia Exo-Suit Lơ Lửng Không Trọng Lực
    if (window.ChronoGraphics && typeof window.ChronoGraphics.drawAstronautAndFlashlight === 'function') {
      const pState = window.ChronoGraphics.playerState;
      const savedX = pState.x;
      const savedY = pState.y;
      const savedWalk = pState.walkCycle;
      pState.x = evaState.x;
      pState.y = evaState.y;
      pState.facing = evaState.vx < -0.15 ? -1 : 1;
      pState.walkCycle = animFrame * 0.08;
      window.ChronoGraphics.drawAstronautAndFlashlight(ctx, mousePos, animFrame);
      pState.x = savedX;
      pState.y = savedY;
      pState.walkCycle = savedWalk;
    }

    if (evaState.shieldFlash > 0) {
      evaState.shieldFlash--;
      ctx.save();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(evaState.x, evaState.y - 24, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 9. Kiểm tra Hoàn tất Nhiệm vụ EVA Zero-G
    const weldedCount = evaState.conduits.filter((c) => c.welded).length;
    const shardCount = evaState.shards.filter((s) => s.collected).length;
    if (weldedCount === 3 && shardCount === 3 && !alreadyDone && !evaState.submittingComplete) {
      notifyServerEvaComplete();
    }

    // 10. Thanh Telemetry HUD EVA ở phía trên Canvas
    const bannerW = 540;
    const bannerX = (w - bannerW) / 2;
    const bannerY = 50;
    ctx.save();
    ctx.fillStyle = 'rgba(5, 11, 26, 0.9)';
    ctx.strokeStyle = weldedCount === 3 && shardCount === 3 ? '#10b981' : '#38bdf8';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(bannerX, bannerY, bannerW, 30, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px Consolas, monospace';
    ctx.fillStyle = '#e0f2fe';
    ctx.textAlign = 'center';
    ctx.fillText(
      `EVA ZERO-G // O₂: ${Math.round(evaState.oxygen)}%  |  HÀN ỐNG PLASMA: ${weldedCount}/3  |  TINH THỂ TACHYON: ${shardCount}/3`,
      w / 2,
      bannerY + 19
    );
    ctx.restore();
  }

  // ==========================================================================
  // 5. SƠ ĐỒ MẠNG LƯỚI MANH MỐI (OUTER WILDS SHIP LOG RUMOR GRAPH)
  // ==========================================================================
  const rumorState = {
    selectedNodeId: 'node-core',
    hoverNodeId: null,
    boundEvents: false
  };

  function bindRumorGraphEvents() {
    if (rumorState.boundEvents) return;
    const c = document.getElementById('rumorGraphCanvas');
    if (!c) return;
    rumorState.boundEvents = true;

    c.addEventListener('mousemove', (e) => {
      if (!window.latestRumorGraph) return;
      const rect = c.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) * c.width) / rect.width;
      const my = ((e.clientY - rect.top) * c.height) / rect.height;
      let found = null;
      for (const n of window.latestRumorGraph.nodes) {
        if (Math.hypot(mx - n.x, my - n.y) <= 44) {
          found = n.id;
          break;
        }
      }
      rumorState.hoverNodeId = found;
      c.style.cursor = found ? 'pointer' : 'default';
    });

    c.addEventListener('click', () => {
      if (rumorState.hoverNodeId && window.latestRumorGraph) {
        rumorState.selectedNodeId = rumorState.hoverNodeId;
        if (typeof playSciFiSound === 'function') playSciFiSound('click');
        updateRumorDetailCard(window.latestRumorGraph);
      }
    });
  }

  function updateRumorDetailCard(rumorGraph) {
    const box = document.getElementById('rumorNodeDetailBox');
    if (!box || !rumorGraph) return;
    const node =
      rumorGraph.nodes.find((n) => n.id === rumorState.selectedNodeId) || rumorGraph.nodes[0];
    if (!node) return;

    const badgeCol =
      node.status === 'SOLVED' ? '#10b981' : node.status === 'DISCOVERED' ? '#38bdf8' : '#f43f5e';
    const stateLabel =
      node.status === 'SOLVED'
        ? '● ĐÃ GIẢI MÃ HOÀN TẤT'
        : node.status === 'DISCOVERED'
        ? '◐ ĐANG ĐIỀU TRA'
        : '🔒 CHƯA MỞ KHÓA';

    box.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:4px;">
        <span style="font-family:var(--font-mono); font-size:0.7rem; font-weight:800; color:${badgeCol};">
          [${node.code}] ${node.title}
        </span>
        <span style="font-family:var(--font-mono); font-size:0.68rem; font-weight:800; color:${badgeCol};">
          ${stateLabel}
        </span>
      </div>
      <div style="font-size:0.8rem; color:#e2e8f0; line-height:1.45;">${node.detail}</div>
    `;
  }

  function drawRumorGraphCanvas(rumorGraph, animFrame) {
    window.latestRumorGraph = rumorGraph;
    const c = document.getElementById('rumorGraphCanvas');
    if (!c || !rumorGraph) return;
    bindRumorGraphEvents();

    const modalLore = document.getElementById('modal-lore');
    if (!modalLore || !modalLore.classList.contains('open')) return;
    const pane = document.getElementById('lorePane-rumor');
    if (!pane || pane.style.display === 'none') return;

    const ctx = c.getContext('2d');
    const w = c.width;
    const h = c.height;
    ctx.clearRect(0, 0, w, h);

    // Nền lưới tọa độ thiên văn sâu thẳm
    ctx.fillStyle = '#040917';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const nodeMap = {};
    rumorGraph.nodes.forEach((n) => {
      nodeMap[n.id] = n;
    });

    // Vẽ đường liên kết suy luận Bézier + hạt xung thần kinh chạy dọc dây
    for (const edge of rumorGraph.edges) {
      const a = nodeMap[edge.from];
      const b = nodeMap[edge.to];
      if (!a || !b) continue;
      const bothActive = a.status !== 'LOCKED' && b.status !== 'LOCKED';
      const bothSolved = a.status === 'SOLVED' && b.status === 'SOLVED';

      ctx.save();
      ctx.strokeStyle = bothSolved
        ? 'rgba(16, 185, 129, 0.65)'
        : bothActive
        ? 'rgba(56, 189, 248, 0.45)'
        : 'rgba(100, 116, 139, 0.25)';
      ctx.lineWidth = bothSolved ? 2.4 : 1.6;
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2 - 14;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(cx, cy, b.x, b.y);
      ctx.stroke();

      if (bothActive) {
        const t = ((animFrame * 0.012 + (a.x % 7) * 0.13) % 1);
        const px = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cx + t * t * b.x;
        const py = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cy + t * t * b.y;
        ctx.fillStyle = bothSolved ? '#34d399' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Vẽ 11 Node Manh Mối kiểu Ship Log Outer Wilds
    for (const n of rumorGraph.nodes) {
      const isSel = rumorState.selectedNodeId === n.id;
      const isHov = rumorState.hoverNodeId === n.id;
      const col =
        n.status === 'SOLVED'
          ? '#10b981'
          : n.status === 'DISCOVERED'
          ? n.category === 'CORE'
            ? '#a855f7'
            : '#38bdf8'
          : '#64748b';

      const bw = 132;
      const bh = 52;
      const bx = n.x - bw / 2;
      const by = n.y - bh / 2;

      ctx.save();
      if (isSel || isHov) {
        ctx.shadowColor = col;
        ctx.shadowBlur = 16;
      }
      ctx.fillStyle = isSel ? 'rgba(14, 30, 62, 0.98)' : 'rgba(8, 15, 32, 0.94)';
      ctx.strokeStyle = isSel ? '#fde047' : col;
      ctx.lineWidth = isSel ? 2.2 : 1.5;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 9);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = col;
      ctx.fillRect(bx, by + 6, 3.5, bh - 12);

      ctx.font = 'bold 9.5px Consolas, monospace';
      ctx.fillStyle = col;
      ctx.textAlign = 'left';
      ctx.fillText(n.code, bx + 10, by + 17);

      ctx.textAlign = 'right';
      ctx.fillText(n.status === 'SOLVED' ? '✓' : n.status === 'DISCOVERED' ? '●' : '🔒', bx + bw - 9, by + 17);

      ctx.textAlign = 'left';
      ctx.font = 'bold 11px "Segoe UI", sans-serif';
      ctx.fillStyle = n.status === 'LOCKED' ? '#94a3b8' : '#f8fafc';
      const shortTitle = n.title.length > 17 ? n.title.slice(0, 16) + '…' : n.title;
      ctx.fillText(shortTitle, bx + 10, by + 37);
      ctx.restore();
    }
  }

  // ==========================================================================
  // 6. HỎI ĐÁP TRỰC TIẾP VỚI AI TRẠM KRONOS-7 NGAY TRÊN THANH COMMS
  // ==========================================================================
  function toggleKronosConsole() {
    const drawer = document.getElementById('kronosAskDrawer');
    if (!drawer) return;
    const isHidden = drawer.style.display === 'none' || !drawer.style.display;
    drawer.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) {
      const inp = document.getElementById('kronosAskInput');
      if (inp) inp.focus();
    }
  }

  async function askKronosQuestion(presetQuestion) {
    const inp = document.getElementById('kronosAskInput');
    const q = presetQuestion !== undefined ? presetQuestion : inp ? inp.value.trim() : '';
    try {
      if (typeof playSciFiSound === 'function') playSciFiSound('scan');
      const res = await apiRequest('/api/kronos/ask', 'POST', { question: q });
      if (inp && presetQuestion === undefined) inp.value = '';
      if (res && res.reply && typeof setNarrative === 'function') {
        const formatted = res.reply.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fde047;">$1</strong>');
        setNarrative(`<span style="color:var(--cyan); font-family:var(--font-mono); font-size:0.74rem;">[${res.tag}]</span> ${formatted}`);
      }
    } catch (err) {
      if (typeof showToast === 'function') showToast('⚠️ ' + err.message);
    }
  }

  // ==========================================================================
  // 7. HỆ THỐNG GIỚI THIỆU MỤC TIÊU & DẪN ĐƯỜNG 6 BƯỚC TRỰC TIẾP
  // ==========================================================================
  let hasAutoShownBriefing = false;

  function getMissionSteps(st) {
    if (!st || !st.session) return [];
    const sess = st.session;
    const invIds = new Set(
      (sess.inventory || []).map((i) => (typeof i === 'string' ? i : i.id))
    );
    const solved = (sess.persistentMemory && sess.persistentMemory.puzzlesSolved) || {};
    const hasKeycard = invIds.has('item-cmd-keycard');
    const hasFrozenCard = invIds.has('item-frozen-keycard');
    const hasPrism = invIds.has('item-focused-prism');
    const hasCore = invIds.has('item-charged-core');
    const hasShard = invIds.has('item-tachyon-shard');
    const glyphsDone = Boolean(solved.glyphs);
    const astroDone = Boolean(solved.astrolabe);
    const opticsDone = Boolean(solved.optics);
    const anyEndingUnlocked = Boolean(sess.unlockedEnding || solved.deduction);

    return [
      {
        step: 1,
        code: 'STEP-01 // KEYCARD',
        title: 'Bước 1: Quét Hiện Trường & Rã Đông Thẻ Từ Chỉ Huy',
        desc: hasKeycard
          ? 'Đã thu hồi và rã đông thành công Thẻ Từ Chỉ Huy của Elena Vance.'
          : hasFrozenCard
          ? 'Bạn đã có Khối Băng Chứa Thẻ Từ! Hãy sang [SEC-02] Vòm Sinh Thái lấy Đèn Nhiệt hoặc mở Túi Đồ ghép để rã đông.'
          : 'Dùng Kính Chuẩn [1] & Dư Ảnh [3] quét Khoang Chỉ Huy [SEC-01] để lấy Khối Băng Chứa Thẻ Từ, sau đó sang [SEC-02] Vòm Sinh Thái lấy Đèn Nhiệt để rã đông.',
        done: hasKeycard,
        actionLabel: hasFrozenCard ? 'Rã Đông Trong Túi Đồ ➔' : 'Tới Khoang [SEC-01] ➔',
        runAction() {
          if (hasFrozenCard && invIds.has('item-thermal-lamp')) {
            if (typeof openModal === 'function') openModal('modal-inventory');
          } else if (hasFrozenCard) {
            if (typeof navigateSector === 'function') navigateSector('sector-biodome');
          } else {
            if (typeof navigateSector === 'function') navigateSector('sector-bridge');
          }
        }
      },
      {
        step: 2,
        code: 'STEP-02 // QUANTUM CRAFT',
        title: 'Bước 2: Chế Tạo Lăng Kính Hội Tụ & Sạc Lõi Pin Lượng Tử',
        desc:
          hasPrism && hasCore
            ? 'Đã chế tạo hoàn tất Lăng Kính Hội Tụ Lượng Tử và Lõi Pin Điểm Không Sạc Đầy (Giữ nguyên vĩnh viễn qua các vòng lặp).'
            : 'Khám phá [SEC-02] & [SEC-03] để thu thập Thấu Kính + Cuộn Cảm + Lõi Pin Cạn, sau đó mở "Túi Đồ & Ghép Đồ" bấm Ghép Ngay.',
        done: hasPrism && hasCore,
        actionLabel: 'Mở Xưởng Ghép Đồ ➔',
        runAction() {
          if (typeof openModal === 'function') openModal('modal-inventory');
        }
      },
      {
        step: 3,
        code: 'STEP-03 // XENO-GLYPHS',
        title: 'Bước 3: Giải Mã 6 Cổ Ngữ Vẫn Tinh (Lấy Tọa Độ Vòng Ngoại)',
        desc: glyphsDone
          ? 'Đã giải mã trọn vẹn 6/6 Cổ ngữ Ngoại tinh và thu được tọa độ Vòng Ngoại Tinh Bàn (60°).'
          : 'Mở bảng "Giải Mã Cổ Ngữ" (nút dưới đáy màn hình), đối chiếu hình dạng 6 ký tự ngoại tinh hoặc bấm "💡 Tự Điền Theo Từ Điển Sora" rồi xác nhận.',
        done: glyphsDone,
        actionLabel: 'Giải Mã Cổ Ngữ ➔',
        runAction() {
          if (typeof openModal === 'function') openModal('modal-glyphs');
        }
      },
      {
        step: 4,
        code: 'STEP-04 // ASTROLABE',
        title: 'Bước 4: Căn Chỉnh Tinh Bàn 3 Vòng Đồng Tâm',
        desc: astroDone
          ? 'Tinh Bàn 3 Vòng đã khóa chuẩn xác vào tọa độ Mắt Ouroboros (Nội Tinh 120° • Trung Nhật 240° • Ngoại Dị Điểm 60°).'
          : 'Mở "Tinh Bàn 3 Vòng" tại Đài Quan Sát [SEC-04], xoay 3 vòng về góc chuẩn (120° • 240° • 60°) rồi bấm "🪐 Kích Hoạt Tinh Bàn".',
        done: astroDone,
        actionLabel: 'Mở Tinh Bàn 3 Vòng ➔',
        runAction() {
          if (typeof openModal === 'function') openModal('modal-astrolabe');
        }
      },
      {
        step: 5,
        code: 'STEP-05 // LASER 5x5',
        title: 'Bước 5: Căn Chỉnh Bàn Chiết Quang Laser 5×5 & Bộ Hành EVA',
        desc:
          opticsDone && hasShard
            ? 'Chùm tia Laser đã thắp sáng đủ 3 Cảm biến α, β, γ và vỏ trạm EVA đã được hàn kín 100%.'
            : !opticsDone
            ? 'Mở "Chiết Quang 5×5" tại Phòng Lab [SEC-03], xoay 5 gương phản xạ M1..M5 để thắp sáng đủ 3 cảm biến α, β, γ.'
            : 'Bấm nút "Bộ Hành EVA Zero-G" trên góc phải Canvas để bay ra ngoài vỏ trạm hàn 3 ống dẫn Plasma & thu hồi Tinh Thể Tachyon.',
        done: opticsDone && hasShard,
        actionLabel: !opticsDone ? 'Mở Chiết Quang 5×5 ➔' : 'Bay Bộ Hành EVA ➔',
        runAction() {
          if (!opticsDone) {
            if (typeof openModal === 'function') openModal('modal-optics');
          } else {
            if (typeof closeModal === 'function') closeModal(false);
            if (typeof setCanvasMode === 'function') setCanvasMode('EVA');
          }
        }
      },
      {
        step: 6,
        code: 'STEP-06 // CHRONO-CORE',
        title: 'Bước 6: Phá Vỡ Vòng Lặp Thời Gian & Giải Cứu Phi Hành Đoàn',
        desc: anyEndingUnlocked
          ? 'Chúc mừng Chỉ huy! Bạn đã mở khóa Kết cục Chiến dịch và giải cứu Trạm Aethelgard-IX khỏi Dị điểm.'
          : 'Khi đã hoàn tất các bước trên, mở "Hộp Đen & Phá Án" -> trả lời Bảng Suy Luận và chọn nhánh "🌟 Phá Vỡ Vòng Lặp (True Ending — Rank S+)"!',
        done: anyEndingUnlocked,
        actionLabel: 'Mở Hộp Đen & Phá Án ➔',
        runAction() {
          if (typeof openModal === 'function') openModal('modal-lore');
          if (typeof switchLoreSubTab === 'function') switchLoreSubTab('logs');
        }
      }
    ];
  }

  function syncMissionObjectivesUI(st) {
    if (!st) return;
    const steps = getMissionSteps(st);
    const doneCount = steps.filter((s) => s.done).length;
    const currentStep = steps.find((s) => !s.done) || steps[steps.length - 1];

    const badge = document.getElementById('hudObjectiveBadge');
    if (badge) {
      badge.textContent = `${doneCount}/${steps.length}`;
      badge.className = 'obj-progress-pill' + (doneCount === steps.length ? ' done' : '');
    }

    const stepTag = document.getElementById('objStepTag');
    const stepDesc = document.getElementById('objStepDesc');
    const goBtn = document.getElementById('objGoBtn');
    if (stepTag && currentStep) {
      stepTag.textContent =
        doneCount === steps.length
          ? '🏆 ĐÃ HOÀN TẤT 6/6 BƯỚC'
          : `🎯 MỤC TIÊU BƯỚC ${currentStep.step}/6`;
    }
    if (stepDesc && currentStep) {
      stepDesc.innerHTML = `<strong>${currentStep.title.replace(/^Bước \d:\s*/, '')}:</strong> ${currentStep.desc}`;
    }
    if (goBtn && currentStep) {
      goBtn.innerHTML = `<span>${currentStep.actionLabel}</span>`;
    }

    const summaryEl = document.getElementById('briefingProgressSummary');
    if (summaryEl) {
      summaryEl.textContent = `Tiến độ Chiến dịch: ${doneCount}/${steps.length} Bước hoàn tất`;
    }

    const gridEl = document.getElementById('briefingChecklistGrid');
    if (gridEl) {
      gridEl.innerHTML = steps
        .map((s) => {
          const isCurrent = currentStep && currentStep.step === s.step && !s.done;
          const statusClass = s.done ? 'done' : isCurrent ? 'current' : 'pending';
          const statusLabel = s.done
            ? '✅ ĐÃ HOÀN TẤT'
            : isCurrent
            ? '🎯 MỤC TIÊU HIỆN TẠI'
            : '⏳ CHƯA HOÀN TẤT';
          return `
            <div class="briefing-step-card ${statusClass}">
              <div class="b-step-top">
                <span class="b-step-code">${s.code}</span>
                <span class="b-step-status ${statusClass}">${statusLabel}</span>
              </div>
              <div class="b-step-title">${s.title}</div>
              <div class="b-step-desc">${s.desc}</div>
              <div class="b-step-foot">
                <button class="btn ${s.done ? '' : 'btn-primary'} b-step-btn" onclick="window.ChronoUpgrades.runMissionStep(${s.step})">
                  ${s.actionLabel}
                </button>
              </div>
            </div>
          `;
        })
        .join('');
    }

    // Tự động mở Cẩm nang Mục tiêu ở lần đầu tiên vào game để người chơi nắm rõ mục tiêu
    if (!hasAutoShownBriefing) {
      hasAutoShownBriefing = true;
      try {
        const seen = sessionStorage.getItem('chrono_briefing_shown');
        if (!seen && doneCount === 0) {
          sessionStorage.setItem('chrono_briefing_shown', '1');
          setTimeout(() => {
            if (typeof openModal === 'function') openModal('modal-briefing');
          }, 350);
        }
      } catch (_) {}
    }
  }

  function openMissionBriefing() {
    if (typeof gameState !== 'undefined' && gameState) {
      syncMissionObjectivesUI(gameState);
    }
    if (typeof openModal === 'function') {
      openModal('modal-briefing');
    }
  }

  function runMissionStep(stepNumber) {
    if (typeof gameState === 'undefined' || !gameState) return;
    const steps = getMissionSteps(gameState);
    const found = steps.find((s) => s.step === stepNumber);
    if (found && typeof found.runAction === 'function') {
      if (typeof closeModal === 'function') closeModal(false);
      found.runAction();
    }
  }

  function executeCurrentObjective() {
    if (typeof gameState === 'undefined' || !gameState) return;
    const steps = getMissionSteps(gameState);
    const currentStep = steps.find((s) => !s.done) || steps[steps.length - 1];
    if (currentStep && typeof currentStep.runAction === 'function') {
      if (typeof closeModal === 'function') closeModal(false);
      currentStep.runAction();
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    setupEvaInputs();
    const inp = document.getElementById('kronosAskInput');
    if (inp) {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          askKronosQuestion();
        }
      });
    }
  });

  window.ChronoUpgrades = {
    syncDynamicAudio,
    syncMissionObjectivesUI,
    openMissionBriefing,
    runMissionStep,
    executeCurrentObjective,
    playSupernovaCutscene,
    playEndingCutscene,
    closeCinematic: closeCinematicOverlay,
    drawEvaSpacewalk,
    drawRumorGraphCanvas,
    updateRumorDetailCard,
    toggleKronosConsole,
    askKronosQuestion,
    handleEvaCanvasClick(cx, cy) {
      // Nếu người chơi click vào cổng AIRLOCK 03 bên trái khi đang EVA -> quay về Khoang Trong Trạm
      if (Math.hypot(cx - 138, cy - 268) <= 38) {
        if (typeof setCanvasMode === 'function') setCanvasMode('ROOM');
        return true;
      }
      return false;
    }
  };
})();
