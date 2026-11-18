/**
 * 🌌 ChronoHorizon — Clean Game UI Engine
 * Màn hình chính chỉ hiển thị Bản đồ 2D Canvas & Thanh Hộp thoại;
 * Toàn bộ Khoang, Túi đồ, Cổ ngữ, Tinh bàn, Chiết quang & Hộp đen được cất gọn vào các Nút bấm mở Modal từng phần!
 */

let gameState = null;
let canvasMode = 'ROOM'; // 'ROOM' | 'ORBIT'
let selectedInventoryIds = [];
let soundEnabled = true;
let autoClockEnabled = true;
let mousePos = { x: 470, y: 230, inside: false };
let animFrame = 0;

// ============================================================================
// 1. QUẢN LÝ ĐÓNG / MỞ MODAL TỪNG PHẦN (KHÔNG BÀY TRÀN LAN RA MÀN HÌNH)
// ============================================================================

function openModal(modalId) {
  playSciFiSound('click');
  closeModal(false);
  const el = document.getElementById(modalId);
  if (el) {
    el.classList.add('open');
  }
  if (modalId === 'modal-astrolabe') {
    setTimeout(renderAstrolabeCanvas, 30);
  }
}

function closeModal(withSound = true) {
  if (withSound) playSciFiSound('click');
  document.querySelectorAll('.modal-backdrop.open').forEach((el) => {
    el.classList.remove('open');
  });
}

function backdropClose(event, modalId) {
  if (event.target && event.target.id === modalId) {
    closeModal();
  }
}

function switchLoreSubTab(subTab) {
  playSciFiSound('click');
  const tabs = ['rumor', 'logs', 'deduction', 'core'];
  for (const t of tabs) {
    const btn = document.getElementById(`loreTabBtn-${t}`);
    const pane = document.getElementById(`lorePane-${t}`);
    if (btn) btn.classList.toggle('active', t === subTab);
    if (pane) pane.style.display = t === subTab ? 'block' : 'none';
  }
  if (subTab === 'rumor' && window.ChronoUpgrades && gameState && gameState.rumorGraph) {
    window.ChronoUpgrades.updateRumorDetailCard(gameState.rumorGraph);
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (window.ChronoUpgrades && typeof window.ChronoUpgrades.closeCinematic === 'function') {
      window.ChronoUpgrades.closeCinematic();
    }
    closeModal();
  }
});

// ============================================================================
// 2. BỘ TỔNG HỢP ÂM THANH VŨ TRỤ (WEB AUDIO API SYNTHESIZER)
// ============================================================================

let audioCtx = null;
function playSciFiSound(type) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'scan') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'solve') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.32);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.55);
    } else if (type === 'warp') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.45);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
      osc.start(now);
      osc.stop(now + 0.48);
    }
  } catch (_) {
    // Ignore audio context restrictions
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const pill = document.getElementById('soundStatusPill');
  if (pill) {
    pill.textContent = soundEnabled ? '● ĐANG BẬT' : '○ ĐANG TẮT';
    pill.classList.toggle('on', soundEnabled);
    pill.classList.toggle('off', !soundEnabled);
  }
  if (window.ChronoUpgrades && typeof window.ChronoUpgrades.syncDynamicAudio === 'function') {
    window.ChronoUpgrades.syncDynamicAudio(gameState, canvasMode, soundEnabled);
  }
}

function toggleAutoClock() {
  autoClockEnabled = !autoClockEnabled;
  const btn = document.getElementById('btnAutoClock');
  if (btn) {
    btn.textContent = autoClockEnabled ? '⏸️ Đồng Hồ: TỰ ĐỘNG' : '▶️ Đồng Hồ: ĐANG DỪNG';
  }
}

function showToast(msg) {
  const box = document.getElementById('toastBox');
  if (!box) return;
  box.textContent = msg;
  box.style.display = 'block';
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    box.style.display = 'none';
  }, 4200);
}

function setNarrative(htmlText, actionBtnHtml = '') {
  const nar = document.getElementById('narrativeText');
  const slot = document.getElementById('narrativeActionSlot');
  if (nar) nar.innerHTML = htmlText;
  if (slot) slot.innerHTML = actionBtnHtml;
}

// ============================================================================
// 3. GIAO TIẾP API VỚI BACKEND
// ============================================================================

async function apiRequest(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  const data = await res.json();
  if (!res.ok) {
    if (data.state) {
      gameState = data.state;
      renderAll();
    }
    throw new Error(data.error || 'Lỗi yêu cầu máy chủ');
  }
  return data;
}

async function loadState() {
  try {
    const data = await apiRequest('/api/state');
    gameState = data;
    renderAll();
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

async function navigateSector(sectorId) {
  try {
    playSciFiSound('click');
    const res = await apiRequest('/api/navigate', 'POST', { sectorId });
    gameState = res.state;
    closeModal(false);
    setCanvasMode('ROOM');
    renderAll();
    const sec = gameState.campaign.sectors.find((s) => s.id === sectorId);
    setNarrative(
      `🛸 <strong>Đã tới [${sec.code}] ${sec.name}:</strong> ${sec.summary}`
    );
  } catch (err) {
    showToast('🔒 ' + err.message);
  }
}

async function setPhase(targetPhase) {
  try {
    playSciFiSound('warp');
    const res = await apiRequest('/api/phase', 'POST', { action: 'set_phase', targetPhase });
    gameState = res.state;
    closeModal(false);
    renderAll();
    const phaseInfo = gameState.campaign.phases.find((p) => p.id === gameState.session.currentPhase);
    setNarrative(`⏱️ <strong>${phaseInfo.badge}:</strong> ${phaseInfo.environmentEffect}`);
    showToast('⏱️ ' + res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

async function advancePhase() {
  try {
    playSciFiSound('warp');
    const res = await apiRequest('/api/phase', 'POST', { action: 'advance_phase' });
    gameState = res.state;
    renderAll();
    const phaseInfo = gameState.campaign.phases.find((p) => p.id === gameState.session.currentPhase);
    setNarrative(`⏱️ <strong>${phaseInfo.badge}:</strong> ${phaseInfo.environmentEffect}`);
    if (res.loopReset && window.ChronoUpgrades) {
      window.ChronoUpgrades.playSupernovaCutscene(gameState.session.loopNumber);
    }
    showToast(res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

async function resetLoop() {
  try {
    playSciFiSound('warp');
    const res = await apiRequest('/api/phase', 'POST', { action: 'reset_loop' });
    gameState = res.state;
    closeModal(false);
    renderAll();
    if (window.ChronoUpgrades) {
      window.ChronoUpgrades.playSupernovaCutscene(gameState.session.loopNumber);
    }
    setNarrative(`🔄 <strong>Chu kỳ #${gameState.session.loopNumber}:</strong> ${res.message}`);
    showToast(res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

function closeInspectorDrawer() {
  const drawer = document.getElementById('inspectorDrawer');
  if (drawer) drawer.style.display = 'none';
}

function openInspectorDrawer(hotspot, message, rewards, openPuzzle) {
  const drawer = document.getElementById('inspectorDrawer');
  if (!drawer) return;
  document.getElementById('inspTitle').innerHTML = `
    <span style="display:inline-flex; align-items:center; gap:7px;">
      <span style="font-family:var(--font-mono); font-size:0.66rem; padding:2px 6px; border-radius:5px; background:rgba(56,189,248,0.18); border:1px solid rgba(56,189,248,0.5); color:var(--cyan);">SCAN</span>
      <span>${hotspot.name}</span>
    </span>
  `;

  const rewardHtml =
    rewards && rewards.length > 0
      ? `<div class="insp-reward-box">
           <div style="font-family:var(--font-mono); font-size:0.65rem; color:#6ee7b7; margin-bottom:3px; letter-spacing:0.06em;">LOOT // QUANTUM RECOVERY</div>
           <div>✨ ${rewards.join('<br/>✨ ')}</div>
         </div>`
      : '';

  document.getElementById('inspBody').innerHTML = `
    <div style="color:#e2e8f0; line-height:1.5;">${hotspot.description}</div>
    <div class="insp-scan-readout">
      <span style="font-family:var(--font-mono); font-weight:800; color:var(--cyan);">TELEMETRY //</span>
      <span>${hotspot.scannerHint}</span>
    </div>
    ${rewardHtml}
  `;

  const actionsEl = document.getElementById('inspActions');
  let btns = '';
  if (openPuzzle === 'glyphs') {
    btns += `<button class="btn btn-primary" onclick="openModal('modal-glyphs')">🗿 Mở Bàn Giải Mã Cổ Ngữ</button>`;
  } else if (openPuzzle === 'astrolabe') {
    btns += `<button class="btn btn-primary" onclick="openModal('modal-astrolabe')">🪐 Mở Tinh Bàn 3 Vòng</button>`;
  } else if (openPuzzle === 'optics') {
    btns += `<button class="btn btn-primary" onclick="openModal('modal-optics')">🔬 Mở Bàn Chiết Quang 5×5</button>`;
  } else if (openPuzzle === 'chronocore') {
    btns += `<button class="btn btn-success" onclick="openModal('modal-lore'); switchLoreSubTab('core');">⚛️ Mở Bàn Điều Khiển Lõi Chrono-Core</button>`;
  }
  btns += `<button class="btn" onclick="openModal('modal-inventory')">🎒 Mở Túi Đồ &amp; Xưởng Ghép</button>`;
  actionsEl.innerHTML = btns;
  drawer.style.display = 'block';
}

window.setVisorMode = function (mode) {
  playSciFiSound('scan');
  if (window.ChronoGraphics) {
    window.ChronoGraphics.playerState.visorMode = mode;
  }
  ['NORMAL', 'THERMAL', 'ECHO'].forEach((m) => {
    const btn = document.getElementById(`visorBtn-${m}`);
    if (btn) btn.classList.toggle('active', m === mode);
  });

  if (mode === 'THERMAL') {
    setNarrative(
      '🌡️ <strong>Kính Nhiệt Ảnh Hồng Ngoại:</strong> Phát hiện đường cáp năng lượng ngầm dưới sàn tàu và mức chênh lệch nhiệt độ cực đại (-140°C / +680°C) trên từng thiết bị!'
    );
  } else if (mode === 'ECHO') {
    const secId = gameState ? gameState.session.currentSectorId : 'sector-bridge';
    const echo = window.ChronoGraphics ? window.ChronoGraphics.SECTOR_ECHO_GHOSTS[secId] : null;
    setNarrative(
      echo
        ? `👻 <strong>Kính Dư Ảnh Lượng Tử — ${echo.name}:</strong> ${echo.quote} <span style="color:#f0abfc;">(${echo.wallCode})</span>`
        : '👻 <strong>Kính Dư Ảnh Lượng Tử:</strong> Nhìn xuyên chiều thời gian để thấy bóng ma ký ức của phi hành đoàn!'
    );
  } else {
    setNarrative(
      '🔦 <strong>Kính Chuẩn Vật Lý:</strong> Click vào các thiết bị hoặc cửa hầm hai bên để điều khiển Phi hành gia khám phá.'
    );
  }
};

async function inspectHotspot(hotspotId) {
  try {
    playSciFiSound('scan');
    const res = await apiRequest('/api/inspect', 'POST', {
      sectorId: gameState.session.currentSectorId,
      hotspotId
    });
    gameState = res.state;
    renderAll();

    let actionBtn = '';
    if (res.openPuzzle === 'glyphs') {
      actionBtn = `<button class="btn btn-primary" onclick="openModal('modal-glyphs')">🗿 Mở Bàn Giải Mã Cổ Ngữ</button>`;
      openModal('modal-glyphs');
    } else if (res.openPuzzle === 'astrolabe') {
      actionBtn = `<button class="btn btn-primary" onclick="openModal('modal-astrolabe')">🪐 Mở Tinh Bàn 3 Vòng</button>`;
      openModal('modal-astrolabe');
    } else if (res.openPuzzle === 'optics') {
      actionBtn = `<button class="btn btn-primary" onclick="openModal('modal-optics')">🔬 Mở Bàn Chiết Quang 5x5</button>`;
      openModal('modal-optics');
    } else if (res.openPuzzle === 'chronocore') {
      actionBtn = `<button class="btn btn-success" onclick="openModal('modal-lore'); switchLoreSubTab('core');">⚛️ Mở Bàn Điều Khiển Lõi Chrono-Core</button>`;
      openModal('modal-lore');
      switchLoreSubTab('core');
    }

    openInspectorDrawer(res.hotspot, res.message, res.rewards, res.openPuzzle);
    setNarrative(`🔍 <strong>${res.hotspot.name}:</strong> ${res.message}`, actionBtn);
  } catch (err) {
    setNarrative(`🔒 <strong>Đang khóa:</strong> ${err.message}`);
    showToast('🔒 ' + err.message);
  }
}

async function craftByRecipe(recipeId) {
  try {
    playSciFiSound('solve');
    const res = await apiRequest('/api/craft', 'POST', { recipeId });
    gameState = res.state;
    selectedInventoryIds = [];
    renderAll();
    setNarrative(`🛠️ <strong>Chế tạo thành công:</strong> ${res.message}`);
    showToast(res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

async function craftSelectedItems() {
  if (selectedInventoryIds.length !== 2) {
    showToast('🎒 Hãy click chọn đúng 2 vật phẩm trong Túi đồ để ghép!');
    return;
  }
  try {
    playSciFiSound('solve');
    const res = await apiRequest('/api/craft', 'POST', {
      itemA: selectedInventoryIds[0],
      itemB: selectedInventoryIds[1]
    });
    gameState = res.state;
    selectedInventoryIds = [];
    renderAll();
    showToast(res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

// Cơ quan 1: Cổ ngữ
async function submitGlyphs(autoSolve = false) {
  try {
    const mappings = {};
    if (!autoSolve && gameState) {
      for (const g of gameState.campaign.glyphCatalog) {
        const sel = document.getElementById(`glyphSelect-${g.id}`);
        if (sel) mappings[g.id] = sel.value;
      }
    }
    const res = await apiRequest('/api/puzzle/glyphs', 'POST', { mappings, autoSolve });
    gameState = res.state;
    if (res.solved) playSciFiSound('solve');
    else playSciFiSound('scan');
    renderAll();
    showToast(res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

function autoSolveGlyphs() {
  submitGlyphs(true);
}

// Cơ quan 2: Tinh bàn
async function rotateAstrolabeRing(ringKey, delta) {
  if (!gameState) return;
  const st = { ...gameState.session.astrolabeState };
  st[ringKey] = (((st[ringKey] + delta) % 360) + 360) % 360;
  try {
    playSciFiSound('click');
    const res = await apiRequest('/api/puzzle/astrolabe', 'POST', st);
    gameState = res.state;
    if (res.solved) playSciFiSound('solve');
    renderAll();
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

async function submitAstrolabe() {
  if (!gameState) return;
  try {
    const res = await apiRequest('/api/puzzle/astrolabe', 'POST', gameState.session.astrolabeState);
    gameState = res.state;
    if (res.solved) playSciFiSound('solve');
    renderAll();
    showToast(res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

async function autoAlignAstrolabe() {
  try {
    playSciFiSound('solve');
    const res = await apiRequest('/api/puzzle/astrolabe', 'POST', { autoAlign: true });
    gameState = res.state;
    renderAll();
    showToast(res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

// Cơ quan 3: Chiết quang 5x5
async function clickOpticsMirror(cellKey) {
  try {
    playSciFiSound('click');
    const res = await apiRequest('/api/puzzle/optics', 'POST', { cellKey });
    gameState = res.state;
    if (res.solved) playSciFiSound('solve');
    renderAll();
    if (res.solved || res.opticsTrace.hazardCoreHit) {
      showToast(res.message);
    }
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

async function autoCalibrateOptics() {
  try {
    playSciFiSound('solve');
    const res = await apiRequest('/api/puzzle/optics', 'POST', { autoCalibrate: true });
    gameState = res.state;
    renderAll();
    showToast(res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

// Cơ quan 4: Bảng suy luận & Chrono-Core
async function submitDeduction(autoDeduce = false) {
  try {
    const answers = {};
    if (!autoDeduce && gameState) {
      for (const q of gameState.campaign.deductionQuestions) {
        const el = document.querySelector(`input[name="ded-${q.id}"]:checked`);
        if (el) answers[q.id] = el.value;
      }
    }
    const res = await apiRequest('/api/deduction/verify', 'POST', { answers, autoDeduce });
    gameState = res.state;
    if (res.solved) playSciFiSound('solve');
    renderAll();
    showToast(res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

function autoDeduceLore() {
  submitDeduction(true);
}

async function activateChronoCore(protocol) {
  try {
    playSciFiSound('solve');
    const res = await apiRequest('/api/chronocore/activate', 'POST', { protocol });
    gameState = res.state;
    renderAll();
    if (res.ending && window.ChronoUpgrades) {
      closeModal(false);
      window.ChronoUpgrades.playEndingCutscene(res.ending, gameState.session);
    }
    showToast('🌌 ' + res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

async function generateProceduralCampaign() {
  try {
    playSciFiSound('warp');
    const res = await apiRequest('/api/campaign/procedural', 'POST');
    gameState = res.state;
    renderAll();
    setNarrative(`🎲 <strong>Chiến dịch Dị điểm mới:</strong> ${res.message}`);
    showToast(res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

async function exportToOsint() {
  try {
    playSciFiSound('scan');
    const res = await apiRequest('/api/osint-export', 'POST');
    showToast(res.message);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
}

// ============================================================================
// 4. CẬP NHẬT GIAO DIỆN GỌN GÀNG & CÁC MODAL
// ============================================================================

function setCanvasMode(mode) {
  canvasMode = mode;
  const btnRoom = document.getElementById('btnViewRoom');
  const btnOrbit = document.getElementById('btnViewOrbit');
  const btnEva = document.getElementById('btnViewEva');
  if (btnRoom) btnRoom.classList.toggle('active', mode === 'ROOM');
  if (btnOrbit) btnOrbit.classList.toggle('active', mode === 'ORBIT');
  if (btnEva) btnEva.classList.toggle('active', mode === 'EVA');
  const visorModes = document.querySelector('.canvas-visor-modes');
  if (visorModes) {
    visorModes.style.display = mode === 'ROOM' ? 'flex' : 'none';
  }
  if (window.ChronoUpgrades && typeof window.ChronoUpgrades.syncDynamicAudio === 'function') {
    window.ChronoUpgrades.syncDynamicAudio(gameState, canvasMode, soundEnabled);
  }
  if (mode === 'ORBIT') {
    closeInspectorDrawer();
    setNarrative(
      '🪐 <strong>Sơ Đồ Quỹ Đạo Toàn Trạm Aethelgard-IX:</strong> Trỏ chuột vào từng khoang để xem thông số Lượng tử hoặc Click trực tiếp vào huy hiệu khoang để dịch chuyển tức thời!'
    );
  } else if (mode === 'EVA') {
    closeInspectorDrawer();
    setNarrative(
      '🧑‍🚀 <strong>Bộ Hành Không Trọng Lực (EVA Zero-G):</strong> Dùng <strong>WASD</strong> hoặc <strong>Giữ Chuột Trái</strong> để phun phản lực Jetpack, né thiên thạch, bay tới gần <strong>3 Ống Dẫn Plasma Đứt</strong> để tự động hàn hồ quang và thu thập <strong>3 Mảnh Tinh Thể Tachyon</strong>!'
    );
  }
}

window.syncExternalGameState = function (newState, toastMsg) {
  gameState = newState;
  renderAll();
  if (toastMsg) {
    setNarrative(`🧑‍🚀 <strong>EVA ZERO-G HOÀN TẤT:</strong> ${toastMsg}`);
    showToast(toastMsg);
  }
};

function toggleSelectInventoryItem(itemId) {
  if (selectedInventoryIds.includes(itemId)) {
    selectedInventoryIds = selectedInventoryIds.filter((id) => id !== itemId);
  } else {
    if (selectedInventoryIds.length >= 2) {
      selectedInventoryIds.shift();
    }
    selectedInventoryIds.push(itemId);
  }
  renderInventoryAndRecipes();
}

function renderAll() {
  if (!gameState) return;
  const { campaign, session } = gameState;
  const currSec = campaign.sectors.find((s) => s.id === session.currentSectorId) || campaign.sectors[0];
  const phaseInfo = campaign.phases.find((p) => p.id === session.currentPhase) || campaign.phases[0];

  // 1. Top HUD
  document.getElementById('hudSectorTitle').textContent = `[${currSec.code}] ${currSec.name}`;
  document.getElementById('loopBadge').textContent = `CHU KỲ #${session.loopNumber}`;
  const mm = String(session.loopMinutesElapsed).padStart(2, '0');
  document.getElementById('clockDisplay').textContent = `${mm}:00 / 22:00`;

  const phaseChip = document.getElementById('phaseChip');
  phaseChip.textContent = phaseInfo.badge;
  phaseChip.style.color = phaseInfo.color;

  const progFill = document.getElementById('clockProgressFill');
  if (progFill) {
    const pct = Math.min(100, Math.max(5, (session.loopMinutesElapsed / 22) * 100));
    progFill.style.width = `${pct}%`;
    progFill.style.background = `linear-gradient(90deg, #38bdf8, ${phaseInfo.color})`;
  }

  // Cập nhật thông tin trong Modal Thời Gian
  const modalPhaseTitle = document.getElementById('modalPhaseTitle');
  const modalPhaseDesc = document.getElementById('modalPhaseDesc');
  if (modalPhaseTitle) modalPhaseTitle.textContent = `${phaseInfo.badge} (${phaseInfo.timeRange})`;
  if (modalPhaseDesc) modalPhaseDesc.textContent = phaseInfo.environmentEffect;

  // 2. Bottom Dock Badges (6 nút gọn gàng)
  const openSecCount = campaign.sectors.filter((s) => s.accessible).length;
  document.getElementById('badgeSectors').textContent = `${openSecCount}/6 mở`;
  document.getElementById('badgeInventory').textContent = `${session.inventory.length} món`;

  const solved = session.persistentMemory.puzzlesSolved;
  const dockGlyphs = document.getElementById('dockBtn-glyphs');
  dockGlyphs.classList.toggle('solved', solved.glyphs);
  document.getElementById('badgeGlyphs').textContent = solved.glyphs ? '✅ Đã giải' : '6 ký tự';

  const dockAstro = document.getElementById('dockBtn-astrolabe');
  dockAstro.classList.toggle('solved', solved.astrolabe);
  document.getElementById('badgeAstrolabe').textContent = solved.astrolabe ? '✅ Đã giải' : '3 vòng';

  const dockOptics = document.getElementById('dockBtn-optics');
  dockOptics.classList.toggle('solved', solved.optics);
  document.getElementById('badgeOptics').textContent = solved.optics ? '✅ Đã giải' : '5 gương';

  const dockLore = document.getElementById('dockBtn-lore');
  dockLore.classList.toggle('solved', solved.deduction);
  document.getElementById('badgeLore').textContent = `${session.persistentMemory.discoveredLogs.length}/${campaign.logsCatalog.length} log`;

  // 3. Render nội dung bên trong các Modal
  renderActiveSectorHotspots();
  renderSectorsModal();
  renderInventoryAndRecipes();
  renderGlyphsMechanism();
  renderAstrolabeMechanism();
  renderOpticsMechanism();
  renderDeductionAndLogsModal();

  if (window.ChronoUpgrades) {
    if (typeof window.ChronoUpgrades.syncDynamicAudio === 'function') {
      window.ChronoUpgrades.syncDynamicAudio(gameState, canvasMode, soundEnabled);
    }
    if (typeof window.ChronoUpgrades.syncMissionObjectivesUI === 'function') {
      window.ChronoUpgrades.syncMissionObjectivesUI(gameState);
    }
    if (gameState.rumorGraph && typeof window.ChronoUpgrades.updateRumorDetailCard === 'function') {
      window.ChronoUpgrades.updateRumorDetailCard(gameState.rumorGraph);
    }
  }
}

function renderActiveSectorHotspots() {
  const { campaign, session } = gameState;
  const sec = campaign.sectors.find((s) => s.id === session.currentSectorId) || campaign.sectors[0];
  const strip = document.getElementById('hotspotsStrip');

  strip.innerHTML = sec.hotspots
    .map((hs) => {
      const done = session.inspectedHotspots.includes(hs.id);
      return `
        <button class="hs-pill ${done ? 'done' : ''}" onclick="window.triggerHotspotInspection('${hs.id}')">
          <span>${hs.icon}</span>
          <span>${hs.name}</span>
          <span>${done ? '✅' : '🔍'}</span>
        </button>
      `;
    })
    .join('');
}

function renderSectorsModal() {
  const { campaign, session } = gameState;
  const container = document.getElementById('sectorList');
  container.innerHTML = campaign.sectors
    .map((sec) => {
      const isCurr = sec.id === session.currentSectorId;
      const doneCount = sec.hotspots.filter((h) => session.inspectedHotspots.includes(h.id)).length;
      const totalCount = sec.hotspots.length;
      const statusClass = isCurr ? 'curr' : sec.accessible ? 'open' : 'locked';
      const statusLabel = isCurr
        ? '● ĐANG Ở ĐÂY'
        : sec.accessible
        ? '● ĐÃ MỞ KHÓA'
        : `🔒 MỞ Ở PHA ${sec.minPhase}`;

      return `
        <div class="sector-card ${isCurr ? 'active' : ''} ${sec.accessible ? '' : 'locked'}"
             onclick="navigateSector('${sec.id}')">
          <div class="sector-card-banner" style="background-image: url('/assets/${sec.id}.jpg');">
            <div class="sector-banner-overlay"></div>
            <div class="sector-banner-top">
              <span class="sector-code-pill">${sec.code}</span>
              <span class="sector-status-pill ${statusClass}">${statusLabel}</span>
            </div>
            <div class="sector-banner-bottom">
              <div class="sector-title-vn">${sec.name}</div>
              <div class="sector-title-en">${(sec.englishName || '').toUpperCase()}</div>
            </div>
          </div>
          <div class="sector-card-body">
            <div class="sector-summary-text">${sec.summary}</div>
            <div class="sector-card-footer">
              <span class="sector-access-tag">⚡ ${sec.accessReason}</span>
              <span class="sector-scan-count ${doneCount === totalCount ? 'all-done' : ''}">
                🔍 ${doneCount}/${totalCount} thiết bị
              </span>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderInventoryAndRecipes() {
  const { campaign, session } = gameState;
  const invContainer = document.getElementById('inventoryGrid');

  if (session.inventory.length === 0) {
    invContainer.innerHTML = `
      <div class="card-box" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: 0.82rem; border-style: dashed;">
        Khoang chứa vật phẩm đang trống. Hãy click vào các thiết bị Bát Giác trên màn hình chính để thu thập vật phẩm!
      </div>
    `;
  } else {
    invContainer.innerHTML = session.inventory
      .map((itemId) => {
        const item = campaign.itemsCatalog.find((i) => i.id === itemId);
        if (!item) return '';
        const isSel = selectedInventoryIds.includes(itemId);
        return `
          <div class="inv-item ${isSel ? 'selected' : ''}" onclick="toggleSelectInventoryItem('${item.id}')">
            <div class="inv-item-top">
              <span class="inv-icon-pod">${item.icon}</span>
              <span class="inv-cat-tag">${item.category === 'CRAFTED' ? 'LƯỢNG TỬ' : 'LINH KIỆN'}</span>
            </div>
            <div style="font-weight: 700; font-size: 0.85rem; color: #f8fafc; margin: 6px 0 4px;">
              ${item.name}
            </div>
            <div style="font-size: 0.74rem; color: var(--text-muted); line-height: 1.4;">
              ${item.description}
            </div>
          </div>
        `;
      })
      .join('');
  }

  const recContainer = document.getElementById('recipeList');
  recContainer.innerHTML = campaign.recipes
    .map((rec) => {
      const resultItem = campaign.itemsCatalog.find((i) => i.id === rec.resultItem);
      const alreadyCrafted = session.inventory.includes(rec.resultItem);
      const hasAll = rec.ingredients.every((ingId) => session.inventory.includes(ingId));
      const ingChips = rec.ingredients
        .map((ingId) => {
          const obj = campaign.itemsCatalog.find((i) => i.id === ingId);
          const owned = session.inventory.includes(ingId);
          return `<span class="recipe-ing-chip ${owned ? 'owned' : ''}">${owned ? '✓' : '○'} ${
            obj ? obj.name : ingId
          }</span>`;
        })
        .join('<span style="color:#64748b; font-weight:700;">+</span>');

      return `
        <div class="recipe-card ${alreadyCrafted ? 'crafted' : hasAll ? 'ready' : ''}">
          <div style="flex: 1;">
            <div style="font-weight: 800; font-size: 0.87rem; color: #f8fafc; margin-bottom: 6px;">
              ${resultItem ? resultItem.icon : '🛠️'} ${rec.title}
            </div>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              ${ingChips}
            </div>
          </div>
          ${
            alreadyCrafted
              ? '<span class="sys-status-pill on">✓ ĐÃ CHẾ TẠO</span>'
              : `<button class="btn ${hasAll ? 'btn-success' : ''}" onclick="craftByRecipe('${rec.id}')">
                   ⚡ Ghép Ngay
                 </button>`
          }
        </div>
      `;
    })
    .join('');
}

function renderGlyphsMechanism() {
  const { campaign, session } = gameState;
  const grid = document.getElementById('glyphGrid');
  grid.innerHTML = campaign.glyphCatalog
    .map((g, idx) => {
      const currentVal =
        session.persistentMemory.decodedGlyphs[g.id] || session.glyphDraft[g.id] || '';
      const isDecoded = currentVal === g.correctMeaning;

      const optionsHtml = [
        '<option value="">-- Chọn ngữ nghĩa Vũ trụ học --</option>',
        ...campaign.glyphMeaningsPool.map(
          (m) => `<option value="${m}" ${currentVal === m ? 'selected' : ''}>${m}</option>`
        )
      ].join('');

      return `
        <div class="glyph-card ${isDecoded ? 'decoded' : ''}">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <div class="glyph-pedestal">
              <span class="glyph-symbol">${g.symbol === '♾️' ? '∞' : g.symbol}</span>
            </div>
            <div style="text-align: right;">
              <div style="font-family: var(--font-mono); font-size: 0.64rem; color: #94a3b8;">RUNE-0${idx + 1}</div>
              <span style="font-size: 0.72rem; font-weight: 800; color: ${
                isDecoded ? 'var(--emerald)' : '#e9d5ff'
              };">
                ${isDecoded ? '● ĐÃ GIẢI MÃ' : '◈ CHƯA DỊCH'}
              </span>
            </div>
          </div>
          <div style="font-weight: 800; font-size: 0.86rem; color: #f8fafc; margin-top: 4px;">${g.name}</div>
          <div style="font-size: 0.75rem; color: #cbd5e1; line-height: 1.42; flex: 1;">${g.clue}</div>
          <select class="glyph-select" id="glyphSelect-${g.id}">
            ${optionsHtml}
          </select>
        </div>
      `;
    })
    .join('');
}

function renderAstrolabeMechanism() {
  const { campaign, session } = gameState;
  const cfg = campaign.astrolabeConfig;
  const st = session.astrolabeState;

  const rings = [
    {
      key: 'innerAngle',
      name: '1. Vòng Nội Tinh (Inner Ring)',
      current: st.innerAngle,
      target: cfg.targetInner,
      clue: cfg.clues.inner
    },
    {
      key: 'middleAngle',
      name: '2. Vòng Trung Nhật (Middle Ring)',
      current: st.middleAngle,
      target: cfg.targetMiddle,
      clue: cfg.clues.middle
    },
    {
      key: 'outerAngle',
      name: '3. Vòng Ngoại Dị Điểm (Outer Ring)',
      current: st.outerAngle,
      target: cfg.targetOuter,
      clue: cfg.clues.outer
    }
  ];

  const container = document.getElementById('astrolabeControls');
  container.innerHTML = rings
    .map((r) => {
      const matched = r.current === r.target;
      return `
        <div class="card-box" style="border-color: ${matched ? 'var(--emerald)' : 'rgba(56,189,248,0.28)'};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="font-size: 0.85rem;">${r.name}</strong>
            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: ${
              matched ? 'var(--emerald)' : 'var(--gold)'
            };">
              ${r.current}° ${matched ? '✅ KHỚP' : ''}
            </span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">
            💡 ${r.clue}
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn" onclick="rotateAstrolabeRing('${r.key}', -30)">↺ Xoay -30°</button>
            <button class="btn btn-primary" onclick="rotateAstrolabeRing('${r.key}', 30)">↻ Xoay +30°</button>
          </div>
        </div>
      `;
    })
    .join('');

  renderAstrolabeCanvas();
}

function renderAstrolabeCanvas() {
  if (gameState && window.ChronoGraphics && window.ChronoGraphics.drawAstrolabeInteractiveCanvas) {
    window.ChronoGraphics.drawAstrolabeInteractiveCanvas(
      gameState.campaign,
      gameState.session,
      animFrame
    );
  }
}

function renderOpticsMechanism() {
  const { opticsTrace } = gameState;
  if (!opticsTrace) return;

  const cellColors = {};
  for (const seg of opticsTrace.segments) {
    const k1 = `${seg.from.r},${seg.from.c}`;
    const k2 = `${seg.to.r},${seg.to.c}`;
    cellColors[k1] = seg.color;
    cellColors[k2] = seg.color;
  }

  const board = document.getElementById('opticsBoard');
  board.innerHTML = opticsTrace.gridCells
    .map((cell) => {
      const beamColor = cellColors[cell.key];
      let beamClass = '';
      if (beamColor === 'RED') beamClass = 'beam-red';
      if (beamColor === 'BLUE') beamClass = 'beam-blue';
      if (beamColor === 'VIOLET') beamClass = 'beam-violet';

      const clickAttr = cell.rotatable ? `onclick="clickOpticsMirror('${cell.key}')"` : '';
      return `
        <div class="optics-cell ${cell.rotatable ? 'rotatable' : ''} ${beamClass}" ${clickAttr}>
          <div>${cell.icon}</div>
          <div class="optics-cell-label">${cell.label || `(${cell.r},${cell.c})`}</div>
        </div>
      `;
    })
    .join('');

  const telemetry = document.getElementById('opticsTelemetryPanel');
  const s = opticsTrace.sensors;
  telemetry.innerHTML = `
    <div class="card-box">
      <div style="font-weight: 700; margin-bottom: 8px; color: #f8fafc;">
        📊 Trạng Thái 3 Cảm Biến Quang Phổ
      </div>
      <div style="display: flex; flex-direction: column; gap: 7px; font-size: 0.82rem;">
        <div>🔴 Cảm Biến Alpha (1,4): <strong>${s.alphaRed ? '✅ ĐÃ KÍCH HOẠT' : '⚪ Chưa có tia'}</strong></div>
        <div>🔵 Cảm Biến Beta (4,3): <strong>${s.betaBlue ? '✅ ĐÃ KÍCH HOẠT' : '⚪ Chưa có tia'}</strong></div>
        <div>🟣 Tinh Thể Hội Tụ (2,2): <strong>${
          opticsTrace.violetGenerated ? '✨ ĐANG PHÓNG TIA TÍM' : '⚪ Chờ 2 tia Đỏ & Lam'
        }</strong></div>
        <div>🟣 Cảm Biến Gamma (2,4): <strong>${s.gammaViolet ? '✅ ĐÃ KÍCH HOẠT' : '⚪ Chưa có tia'}</strong></div>
        <div>☢️ Lõi Phản Vật Chất (0,3): <strong style="color: ${
          opticsTrace.hazardCoreHit ? 'var(--crimson)' : 'var(--emerald)'
        };">${opticsTrace.hazardCoreHit ? '🚨 BỊ CHIẾU TRÚNG!' : '🟢 AN TOÀN'}</strong></div>
      </div>
      <div style="margin-top: 10px; font-size: 0.76rem; color: var(--text-muted);">
        💡 Gợi ý Sổ tay TS. Minh:<br/>
        <code>M1(0,2) = \\</code> • <code>M2(1,3) = ═</code> • <code>M3(4,2) = /</code> • <code>M4(3,3) = \\</code> • <code>M5(2,3) = ═</code>
      </div>
    </div>
  `;
}

function renderDeductionAndLogsModal() {
  const { campaign, session } = gameState;
  const codes = session.persistentMemory.knownCodes;
  const codesBox = document.getElementById('knownCodesBox');
  if (codesBox) {
    codesBox.innerHTML =
      codes.length > 0
        ? `<div class="known-codes-label">QUANTUM KEYS // ĐÃ LƯU KÝ ỨC</div>
           <div class="known-codes-chips">${codes
             .map((c) => `<span class="known-code-chip">${c}</span>`)
             .join('')}</div>`
        : `<div class="known-codes-label">QUANTUM KEYS // CHƯA THU THẬP</div>
           <div style="font-size:0.78rem; color:var(--text-muted);">Hãy quét các thiết bị &amp; mở Dư Ảnh Lượng Tử [Phím 3] trong các khoang để thu thập mật mã.</div>`;
  }

  // Danh sách Hộp đen (Audio Flight Logs)
  const discovered = session.persistentMemory.discoveredLogs;
  const logsContainer = document.getElementById('logsList');
  logsContainer.innerHTML = campaign.logsCatalog
    .filter((l) => discovered.includes(l.id))
    .map(
      (l) => `
      <div class="blackbox-log-card">
        <div class="blackbox-log-top">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="blackbox-code-pill">${l.code}</span>
            <span class="blackbox-wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          </div>
          <span class="blackbox-time-pill">⏱ ${l.timestamp}</span>
        </div>
        <div class="blackbox-speaker-row">
          <span class="blackbox-avatar">${l.avatar}</span>
          <div>
            <div class="blackbox-speaker">${l.speaker}</div>
            <div class="blackbox-title">${l.title}</div>
          </div>
        </div>
        <div class="blackbox-transcript">“${l.content}”</div>
      </div>
    `
    )
    .join('');

  // Danh sách 4 câu hỏi Suy luận
  const dedList = document.getElementById('deductionList');
  dedList.innerHTML = campaign.deductionQuestions
    .map((q, idx) => {
      const picked = session.persistentMemory.puzzlesSolved.deduction
        ? q.correctOptionId
        : session.deductionDraft[q.id] || '';
      return `
        <div class="deduction-card">
          <div class="deduction-q-head">
            <span class="deduction-q-num">HỒ SƠ #0${idx + 1}</span>
            <span class="deduction-q-title">${q.question}</span>
          </div>
          <div class="deduction-opts">
            ${q.options
              .map(
                (opt) => `
                <label class="deduction-opt">
                  <input type="radio" name="ded-${q.id}" value="${opt.id}" ${
                  picked === opt.id ? 'checked' : ''
                } />
                  <span class="deduction-radio-dot"></span>
                  <span class="deduction-opt-text">${opt.text}</span>
                </label>
              `
              )
              .join('')}
          </div>
        </div>
      `;
    })
    .join('');

  // Thanh Trạng Thái 4 Khóa Lượng Tử trước khi kích hoạt Chrono-Core
  const readinessEl = document.getElementById('coreReadinessBar');
  if (readinessEl) {
    const pz = session.persistentMemory.puzzlesSolved;
    const checks = [
      { code: 'RUNE-03', label: 'Cổ Ngữ Vẫn Tinh', ok: pz.glyphs },
      { code: 'ASTRO-04', label: 'Tinh Bàn 3 Vòng', ok: pz.astrolabe },
      { code: 'LASER-05', label: 'Chiết Quang 5×5', ok: pz.optics },
      { code: 'DEDUCE-06', label: 'Chân Tướng Lịch Sử', ok: pz.deduction }
    ];
    readinessEl.innerHTML = checks
      .map(
        (c) => `
        <div class="core-ready-chip ${c.ok ? 'ready' : ''}">
          <span class="core-ready-code">${c.code}</span>
          <span class="core-ready-name">${c.label}</span>
          <span class="core-ready-state">${c.ok ? '● LOCKED-IN' : '○ CHƯA KHỚP'}</span>
        </div>
      `
      )
      .join('');
  }

  // Khu vực Kết cục
  const endingArea = document.getElementById('endingDisplayArea');
  if (session.activeEnding) {
    const end = session.activeEnding;
    endingArea.innerHTML = `
      <div class="ending-banner-card" style="--end-col: ${end.badgeColor};">
        <div class="ending-banner-code">${end.code} // CHRONO-HORIZON EPILOGUE</div>
        <h3 class="ending-banner-title">${end.title}</h3>
        <p class="ending-banner-desc">${end.summary}</p>
      </div>
    `;
  } else {
    endingArea.innerHTML = '';
  }

  // Lịch sử vòng lặp trong Modal Settings
  const histContainer = document.getElementById('loopHistoryList');
  if (histContainer) {
    histContainer.innerHTML = session.persistentMemory.loopHistory
      .map((h) => {
        const isReset = h.event.includes('phát nổ') || h.event.includes('Tái khởi động');
        const isSolve =
          h.event.includes('Giải') ||
          h.event.includes('Chế tạo') ||
          h.event.includes('Hoàn tất') ||
          h.event.includes('Khớp');
        const typeClass = isReset ? 'type-reset' : isSolve ? 'type-solve' : 'type-info';
        const tagLabel = isReset ? 'SIÊU TÂN TINH' : isSolve ? 'GIẢI MÃ' : 'HÀNH TRÌNH';

        return `
        <div class="timeline-entry ${typeClass}">
          <div class="timeline-node"></div>
          <div class="timeline-card">
            <div class="timeline-meta">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="timeline-loop-pill">CHU KỲ #${h.loop}</span>
                <span class="timeline-type-tag">${tagLabel}</span>
              </div>
              <span class="timeline-clock">⏱ ${h.timestamp}</span>
            </div>
            <div class="timeline-text">${h.event}</div>
          </div>
        </div>
      `;
      })
      .join('');
  }
}

// ============================================================================
// 5. ENGINE VẼ 2.5D INTERACTIVE CANVAS (SÂN KHẤU CHÍNH + PHI HÀNH GIA + SHADER HỐ ĐEN)
// ============================================================================

window.triggerHotspotInspection = function (hotspotId) {
  if (!gameState) return;
  const currSec = gameState.campaign.sectors.find(
    (s) => s.id === gameState.session.currentSectorId
  );
  if (currSec) {
    const hs = currSec.hotspots.find((h) => h.id === hotspotId);
    if (hs && window.ChronoGraphics) {
      window.ChronoGraphics.playerState.scanBeamTimer = 34;
      window.ChronoGraphics.playerState.scanBeamTarget = { x: hs.x, y: hs.y };
    }
  }
  inspectHotspot(hotspotId);
};

function setupCanvasInteractions() {
  if (window.ChronoGraphics) {
    window.ChronoGraphics.initPlayerControls();
  }

  // Tương tác trên Bàn Chiết Quang Laser 5x5 Canvas
  const opticsCanvas = document.getElementById('opticsCanvas');
  if (opticsCanvas) {
    opticsCanvas.addEventListener('click', (e) => {
      if (!gameState || !gameState.opticsTrace) return;
      const rect = opticsCanvas.getBoundingClientRect();
      const scaleX = opticsCanvas.width / rect.width;
      const scaleY = opticsCanvas.height / rect.height;
      const cx = (e.clientX - rect.left) * scaleX;
      const cy = (e.clientY - rect.top) * scaleY;
      const cellSize = opticsCanvas.width / 5;
      const c = Math.floor(cx / cellSize);
      const r = Math.floor(cy / cellSize);
      const key = `${r},${c}`;
      const cell = gameState.opticsTrace.gridCells.find((item) => item.key === key);
      if (cell && cell.rotatable) {
        clickOpticsMirror(key);
      }
    });
  }

  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mousePos.x = (e.clientX - rect.left) * scaleX;
    mousePos.y = (e.clientY - rect.top) * scaleY;
    mousePos.inside = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mousePos.inside = false;
  });

  canvas.addEventListener('click', (e) => {
    if (!gameState) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    if (canvasMode === 'EVA') {
      if (
        window.ChronoUpgrades &&
        typeof window.ChronoUpgrades.handleEvaCanvasClick === 'function'
      ) {
        window.ChronoUpgrades.handleEvaCanvasClick(cx, cy);
      }
      return;
    }

    if (canvasMode === 'ORBIT') {
      const ORBIT_NODE_POS = {
        'sector-astrolabe': { x: 300, y: 100 },
        'sector-chronocore': { x: 660, y: 100 },
        'sector-bridge': { x: 145, y: 232 },
        'sector-optics': { x: 815, y: 232 },
        'sector-hydro': { x: 300, y: 362 },
        'sector-xenolith': { x: 660, y: 362 }
      };
      for (const sec of gameState.campaign.sectors) {
        const pos = ORBIT_NODE_POS[sec.id] || sec.coords;
        const sx = pos.x;
        const sy = pos.y;
        const inMedallion = Math.hypot(cx - sx, cy - sy) <= 50;
        const inPlate = Math.abs(cx - sx) <= 108 && cy >= sy + 42 && cy <= sy + 88;
        if (inMedallion || inPlate) {
          navigateSector(sec.id);
          return;
        }
      }
    } else {
      const currSec = gameState.campaign.sectors.find(
        (s) => s.id === gameState.session.currentSectorId
      );
      if (!currSec) return;

      const pState = window.ChronoGraphics ? window.ChronoGraphics.playerState : null;

      // 1. Kiểm tra click vào Cửa Hầm Chuyển Khoang Trái / Phải
      const connSectors = currSec.connections
        .map((id) => gameState.campaign.sectors.find((s) => s.id === id))
        .filter(Boolean);
      const leftSec = connSectors[0] || null;
      const rightSec = connSectors[1] || null;

      if (leftSec && Math.hypot(cx - 46, cy - 345) <= 46) {
        if (pState) {
          pState.targetX = 78;
          pState.targetY = 365;
          pState.pendingPortalSectorId = leftSec.id;
        } else {
          navigateSector(leftSec.id);
        }
        return;
      }
      if (rightSec && Math.hypot(cx - (canvas.width - 46), cy - 345) <= 46) {
        if (pState) {
          pState.targetX = canvas.width - 78;
          pState.targetY = 365;
          pState.pendingPortalSectorId = rightSec.id;
        } else {
          navigateSector(rightSec.id);
        }
        return;
      }

      // 2. Kiểm tra click vào Vật thể tương tác (Hotspot)
      for (const hs of currSec.hotspots) {
        const hx = hs.x;
        const hy = hs.y;
        if (Math.hypot(cx - hx, cy - hy) <= 52) {
          if (pState) {
            const standX = Math.max(95, Math.min(865, hx));
            const standY = Math.max(330, Math.min(415, hy + 95));
            if (Math.hypot(pState.x - standX, pState.y - standY) <= 45) {
              window.triggerHotspotInspection(hs.id);
            } else {
              pState.targetX = standX;
              pState.targetY = standY;
              pState.pendingHotspotId = hs.id;
              playSciFiSound('click');
            }
          } else {
            inspectHotspot(hs.id);
          }
          return;
        }
      }

      // 3. Nếu click xuống sàn khoang -> Cho Phi hành gia đi bộ/bay tới vị trí đó
      closeInspectorDrawer();
      if (pState) {
        pState.targetX = Math.max(85, Math.min(875, cx));
        pState.targetY = Math.max(325, Math.min(420, cy));
        pState.pendingHotspotId = null;
        pState.pendingPortalSectorId = null;
        playSciFiSound('click');
      }
    }
  });
}

function drawSpaceCanvas() {
  animFrame++;
  const canvas = document.getElementById('spaceCanvas');
  if (canvas && gameState && window.ChronoGraphics) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (canvasMode === 'ORBIT') {
      drawOrbitBlueprint(ctx, w, h);
    } else if (canvasMode === 'EVA' && window.ChronoUpgrades) {
      window.ChronoUpgrades.drawEvaSpacewalk(ctx, w, h, animFrame, mousePos, gameState);
    } else {
      drawRoomInterior(ctx, w, h);
    }

    if (window.ChronoUpgrades && gameState.rumorGraph) {
      window.ChronoUpgrades.drawRumorGraphCanvas(gameState.rumorGraph, animFrame);
    }

    if (gameState.opticsTrace) {
      window.ChronoGraphics.drawOpticsInteractiveCanvas(gameState.opticsTrace, animFrame);
    }
    if (window.ChronoGraphics.drawAstrolabeInteractiveCanvas) {
      window.ChronoGraphics.drawAstrolabeInteractiveCanvas(
        gameState.campaign,
        gameState.session,
        animFrame
      );
    }
  }
  requestAnimationFrame(drawSpaceCanvas);
}

function drawOrbitBlueprint(ctx, w, h) {
  const { campaign, session } = gameState;
  const cx = w / 2;
  const cy = h / 2 - 6;

  // Tọa độ chuẩn 6 Khoang tạo thành Vòng Lục Giác Đối Xứng quanh Hố Đen (không đè lên tâm Hố Đen)
  const ORBIT_NODE_POS = {
    'sector-astrolabe': { x: 300, y: 100 },
    'sector-chronocore': { x: 660, y: 100 },
    'sector-bridge': { x: 145, y: 232 },
    'sector-optics': { x: 815, y: 232 },
    'sector-hydro': { x: 300, y: 362 },
    'sector-xenolith': { x: 660, y: 362 }
  };

  const getPos = (sec) => ORBIT_NODE_POS[sec.id] || sec.coords;

  // 1. Vẽ Ảnh Nền Vũ Trụ & Hố Đen Gargantua 16:9 độ phân giải cao kèm hiệu ứng Parallax 3D
  const orbitImg =
    window.ChronoGraphics && window.ChronoGraphics.sectorBgImages
      ? window.ChronoGraphics.sectorBgImages['station-orbit-map']
      : null;

  if (orbitImg && orbitImg.complete && orbitImg.naturalWidth > 0) {
    ctx.save();
    const px = mousePos.inside ? ((mousePos.x - w / 2) / w) * -16 : 0;
    const py = mousePos.inside ? ((mousePos.y - h / 2) / h) * -10 : 0;
    ctx.drawImage(orbitImg, px - 18, py - 12, w + 36, h + 24);

    // Lớp phủ Vignette làm nổi bật các nút Hologram và đường dẫn năng lượng
    const vig = ctx.createRadialGradient(cx, cy, 80, cx, cy, w * 0.65);
    vig.addColorStop(0, 'rgba(2, 6, 18, 0.05)');
    vig.addColorStop(0.55, 'rgba(2, 6, 18, 0.35)');
    vig.addColorStop(1, 'rgba(2, 6, 18, 0.78)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  } else {
    window.ChronoGraphics.drawDeepSpaceAndSingularity(
      ctx,
      w,
      h,
      cx,
      cy,
      1.25,
      session.currentPhase,
      animFrame
    );
  }

  // 2. Vẽ Hệ thống Vòng Tinh Bàn Quỹ Đạo & Lưới Tọa Độ Thiên Văn quanh Dị Điểm
  const phaseColors = {
    1: '#38bdf8',
    2: '#facc15',
    3: '#fb923c',
    4: '#f43f5e'
  };
  const activePhaseColor = phaseColors[session.currentPhase] || '#38bdf8';

  ctx.save();
  // Vòng quỹ đạo chính nối 6 khoang (rx = 335, ry = 152)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.26)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 335, 152, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(168, 85, 247, 0.22)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, 347, 160, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Vòng sóng hấp dẫn xoay quanh Chân trời sự kiện
  ctx.strokeStyle = activePhaseColor + '55';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, 138, 68, 0, animFrame * 0.008, animFrame * 0.008 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Vạch chia độ thiên văn quanh quỹ đạo
  for (let i = 0; i < 36; i++) {
    const ang = (i * 10 * Math.PI) / 180 + animFrame * 0.0015;
    const x1 = cx + Math.cos(ang) * 326;
    const y1 = cy + Math.sin(ang) * 146;
    const x2 = cx + Math.cos(ang) * (i % 3 === 0 ? 342 : 334);
    const y2 = cy + Math.sin(ang) * (i % 3 === 0 ? 156 : 151);
    ctx.strokeStyle = i % 3 === 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = i % 3 === 0 ? 1.5 : 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Nhãn Telemetry Trung Tâm Dị Điểm (không bị bất kỳ khoang nào che khuất)
  ctx.fillStyle = 'rgba(4, 9, 24, 0.78)';
  ctx.strokeStyle = activePhaseColor + '88';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(cx - 142, cy + 72, 284, 24, 12);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 10.5px Consolas, monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.fillText('🌌 TÂM DỊ ĐIỂM: MẮT OUROBOROS (NGC-7741)', cx, cy + 88);
  ctx.restore();

  // 3. Vẽ Ống Dẫn Năng Lượng Uốn Cong (Curved Bézier Conduits) & Xung Plasma Chạy Dọc Tuyến
  const drawnPairs = new Set();
  for (const sec of campaign.sectors) {
    const p1 = getPos(sec);
    for (const targetId of sec.connections) {
      const pairKey = [sec.id, targetId].sort().join('--');
      if (drawnPairs.has(pairKey)) continue;
      drawnPairs.add(pairKey);

      const target = campaign.sectors.find((s) => s.id === targetId);
      if (!target) continue;
      const p2 = getPos(target);

      // Tính điểm điều khiển Bézier để đường cáp uốn vòng qua Hố Đen thay vì cắt ngang tâm
      let mx = (p1.x + p2.x) / 2;
      let my = (p1.y + p2.y) / 2;
      const distCenter = Math.hypot(mx - cx, my - cy);
      if (distCenter < 150) {
        const dirY = my <= cy ? -1 : 1;
        my = cy + dirY * 145;
      }

      const bothOpen = sec.accessible && target.accessible;
      const touchesCurr =
        sec.id === session.currentSectorId || target.id === session.currentSectorId;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(mx, my, p2.x, p2.y);

      if (bothOpen) {
        ctx.strokeStyle = touchesCurr
          ? 'rgba(56, 189, 248, 0.72)'
          : 'rgba(16, 185, 129, 0.42)';
        ctx.lineWidth = touchesCurr ? 3 : 2.2;
        ctx.shadowColor = touchesCurr ? '#38bdf8' : '#10b981';
        ctx.shadowBlur = touchesCurr ? 10 : 4;
        ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.32)';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Vẽ hạt xung năng lượng Plasma chạy dọc ống dẫn
      if (bothOpen) {
        const pulseCount = touchesCurr ? 2 : 1;
        for (let k = 0; k < pulseCount; k++) {
          const t = (animFrame * 0.007 + k * 0.5) % 1;
          const inv = 1 - t;
          const px = inv * inv * p1.x + 2 * inv * t * mx + t * t * p2.x;
          const py = inv * inv * p1.y + 2 * inv * t * my + t * t * p2.y;

          ctx.fillStyle = touchesCurr ? '#bae6fd' : '#6ee7b7';
          ctx.shadowColor = touchesCurr ? '#38bdf8' : '#10b981';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(px, py, touchesCurr ? 3.8 : 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }

  // 4. Vẽ 6 Huy Hiệu Khoang Hologram Kèm Hình Ảnh Nội Thất Thật Bên Trong
  let hoveredSec = null;
  for (const sec of campaign.sectors) {
    const pos = getPos(sec);
    const sx = pos.x;
    const sy = pos.y;
    const isCurr = sec.id === session.currentSectorId;
    const inMedallion = mousePos.inside && Math.hypot(mousePos.x - sx, mousePos.y - sy) <= 50;
    const inPlate =
      mousePos.inside &&
      Math.abs(mousePos.x - sx) <= 108 &&
      mousePos.y >= sy + 42 &&
      mousePos.y <= sy + 88;
    const isHover = inMedallion || inPlate;
    if (isHover) hoveredSec = { sec, sx, sy };

    const r = isCurr ? 43 : isHover ? 42 : 38;
    const themeColor = isCurr ? '#38bdf8' : sec.accessible ? '#10b981' : '#f43f5e';
    const doneHotspots = sec.hotspots.filter((h) => session.inspectedHotspots.includes(h.id)).length;

    ctx.save();
    ctx.translate(sx, sy);

    // 4.1. Quầng sáng Halo phía sau Huy hiệu
    const halo = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r + 24);
    halo.addColorStop(0, themeColor + '66');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, r + 24, 0, Math.PI * 2);
    ctx.fill();

    // 4.2. Cắt Khung Tròn (Circular Clip) và vẽ Ảnh Concept Art thật của khoang đó
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.clip();

    const roomImg =
      window.ChronoGraphics && window.ChronoGraphics.sectorBgImages
        ? window.ChronoGraphics.sectorBgImages[sec.id]
        : null;
    if (roomImg && roomImg.complete && roomImg.naturalWidth > 0) {
      ctx.drawImage(roomImg, -r * 1.7, -r * 1.05, r * 3.4, r * 2.1);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-r, -r, r * 2, r * 2);
    }

    // Lớp phủ hologram trên ảnh thu nhỏ
    if (!sec.accessible) {
      ctx.fillStyle = 'rgba(45, 6, 22, 0.58)';
      ctx.fillRect(-r, -r, r * 2, r * 2);
    } else if (isCurr) {
      ctx.fillStyle = 'rgba(14, 165, 233, 0.14)';
      ctx.fillRect(-r, -r, r * 2, r * 2);
    }

    // Vạch quét ngang (Scanline) bên trong thấu kính khoang
    const scanY = ((animFrame * 1.2) % (r * 2)) - r;
    ctx.fillStyle = themeColor + '33';
    ctx.fillRect(-r, scanY, r * 2, 3);
    ctx.restore();

    // 4.3. Vòng Bezel Cơ Khí Lượng Tử bao quanh thấu kính
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = isCurr || isHover ? 3.2 : 2.4;
    ctx.shadowColor = themeColor;
    ctx.shadowBlur = isCurr || isHover ? 14 : 6;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Vòng nét đứt xoay ngược chiều bên ngoài
    ctx.save();
    ctx.rotate((animFrame * 0.015 + sx) * (isCurr ? 1.5 : 0.7));
    ctx.strokeStyle = isCurr ? '#bae6fd' : themeColor + 'aa';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Nếu là khoang hiện tại -> Vẽ sóng radar lan tỏa
    if (isCurr) {
      const pulseR = r + 8 + ((animFrame * 0.45) % 18);
      const pulseAlpha = Math.max(0, 1 - ((animFrame * 0.45) % 18) / 18);
      ctx.strokeStyle = `rgba(56, 189, 248, ${pulseAlpha * 0.75})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 4.4. Huy hiệu trạng thái nhỏ phía trên Đỉnh Thấu Kính
    const topBadgeText = isCurr
      ? '📍 VỊ TRÍ HIỆN TẠI'
      : sec.accessible
      ? `✨ ${doneHotspots}/${sec.hotspots.length} THIẾT BỊ`
      : `🔒 MỞ Ở PHA ${sec.minPhase}`;
    const topBadgeW = isCurr ? 114 : 98;
    ctx.fillStyle = isCurr
      ? 'rgba(3, 105, 161, 0.95)'
      : sec.accessible
      ? 'rgba(6, 78, 59, 0.92)'
      : 'rgba(136, 19, 55, 0.92)';
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-topBadgeW / 2, -r - 22, topBadgeW, 18, 9);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 9.5px Segoe UI';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(topBadgeText, 0, -r - 10);

    // 4.5. Bảng Tên Glassmorphism Sang Trọng Phía Dưới Thấu Kính
    const plateW = 214;
    const plateH = 40;
    const plateY = r + 10;

    ctx.fillStyle = isHover ? 'rgba(12, 25, 52, 0.96)' : 'rgba(5, 11, 26, 0.9)';
    ctx.strokeStyle = isCurr || isHover ? '#38bdf8' : themeColor + '88';
    ctx.lineWidth = isCurr || isHover ? 1.8 : 1.2;
    ctx.beginPath();
    ctx.roundRect(-plateW / 2, plateY, plateW, plateH, 8);
    ctx.fill();
    ctx.stroke();

    // Thanh neon trang trí sát mép trên bảng tên
    ctx.fillStyle = themeColor;
    ctx.fillRect(-plateW / 2 + 14, plateY, plateW - 28, 2);

    ctx.font = 'bold 10.5px Consolas, monospace';
    ctx.fillStyle = isCurr ? '#38bdf8' : sec.accessible ? '#34d399' : '#fb7185';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${sec.icon} [${sec.code}] • ${sec.accessible ? 'ĐÃ MỞ KHÓA' : 'ĐANG KHÓA'}`,
      0,
      plateY + 15
    );

    ctx.font = 'bold 12px Segoe UI';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(sec.name, 0, plateY + 32);

    ctx.restore();
  }

  // 5. Đổi con trỏ chuột & Hiển thị Thanh Thông Tin Chiến Thuật khi trỏ vào Khoang
  const canvas = document.getElementById('spaceCanvas');
  if (canvas) {
    canvas.style.cursor = hoveredSec ? 'pointer' : 'default';
  }

  if (hoveredSec) {
    const { sec } = hoveredSec;
    const bannerW = 620;
    const bannerH = 34;
    const bx = (w - bannerW) / 2;
    const by = h - 42;

    ctx.save();
    ctx.fillStyle = 'rgba(4, 9, 24, 0.94)';
    ctx.strokeStyle = sec.accessible ? '#38bdf8' : '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, by, bannerW, bannerH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11.5px Segoe UI';
    ctx.fillStyle = sec.accessible ? '#bae6fd' : '#fda4af';
    ctx.textAlign = 'center';
    const actionLabel = sec.accessible
      ? `⚡ CLICK ĐỂ DỊCH CHUYỂN TỚI [${sec.code}] ${sec.name.toUpperCase()} — ${sec.accessReason}`
      : `🔒 [${sec.code}] ĐANG KHÓA — ${sec.accessReason}`;
    ctx.fillText(actionLabel, w / 2, by + 21);
    ctx.restore();
  }
}

function drawRoomInterior(ctx, w, h) {
  const { campaign, session } = gameState;
  const sec = campaign.sectors.find((s) => s.id === session.currentSectorId) || campaign.sectors[0];

  // 1. Vẽ Kiến trúc Khoang (Ảnh nền Concept Art 16:9 độ phân giải cao + Parallax 3D + Hiệu ứng Kính Nhiệt/Dư Ảnh)
  window.ChronoGraphics.drawSciFiRoomArchitecture(
    ctx,
    w,
    h,
    sec.id,
    session.currentPhase,
    animFrame,
    mousePos
  );

  // 2. Vẽ 2 Cửa Hầm Áp Suất Trái/Phải để đi bộ chuyển khoang trực tiếp
  const connSectors = sec.connections
    .map((id) => campaign.sectors.find((s) => s.id === id))
    .filter(Boolean);
  window.ChronoGraphics.drawAirlockPortals(
    ctx,
    w,
    h,
    connSectors[0] || null,
    connSectors[1] || null,
    mousePos,
    animFrame
  );

  // 3. Vẽ các Vòng Quét Hologram trên từng Vật thể trong tranh Concept Art
  let hoveredHotspot = null;
  for (const hs of sec.hotspots) {
    const hx = hs.x;
    const hy = hs.y;
    const inspected = session.inspectedHotspots.includes(hs.id);
    const phaseOk = !hs.requiredPhase || session.currentPhase >= hs.requiredPhase;
    const itemOk = !hs.requiredItem || session.inventory.includes(hs.requiredItem);
    const available = phaseOk && itemOk;
    const isHover = mousePos.inside && Math.hypot(mousePos.x - hx, mousePos.y - hy) <= 50;
    if (isHover) hoveredHotspot = { ...hs, hx, hy };

    window.ChronoGraphics.drawCustomHotspotProp(
      ctx,
      hs,
      hx,
      hy,
      inspected,
      available,
      isHover,
      animFrame
    );
  }

  // 3B. Vẽ Hình Chiếu Hologram Dư Ảnh Lượng Tử 3D & Bảng Mật Mã Tachyon (khi bật Kính [3] ECHO)
  if (typeof window.ChronoGraphics.drawQuantumEchoProjection === 'function') {
    window.ChronoGraphics.drawQuantumEchoProjection(ctx, w, h, sec.id, animFrame);
  }

  // 4. Cập nhật & Vẽ Nhân vật Phi Hành Gia + Đèn Pin Quang Phổ + Tia Laser Quét
  window.ChronoGraphics.updatePlayerPhysics();
  window.ChronoGraphics.drawAstronautAndFlashlight(ctx, mousePos, animFrame);

  // 5. Hạt bụi lượng tử trôi nổi trong không gian
  for (const pt of window.ChronoGraphics.ambientParticles) {
    pt.x += pt.vx;
    pt.y += pt.vy;
    if (pt.y < 60) pt.y = 420;
    if (pt.x < 40) pt.x = w - 40;
    if (pt.x > w - 40) pt.x = 40;
    ctx.fillStyle = `rgba(186, 230, 253, ${pt.alpha})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Tooltip HUD vát góc sang trọng khi trỏ chuột vào thiết bị
  if (hoveredHotspot) {
    const boxW = 430;
    const boxH = 54;
    const bx = Math.min(Math.max(36, hoveredHotspot.hx - boxW / 2), w - boxW - 36);
    const by = Math.max(52, hoveredHotspot.hy - 90);
    const cut = 8;

    ctx.save();
    ctx.fillStyle = 'rgba(6, 13, 30, 0.96)';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(bx + cut, by);
    ctx.lineTo(bx + boxW - cut, by);
    ctx.lineTo(bx + boxW, by + cut);
    ctx.lineTo(bx + boxW, by + boxH - cut);
    ctx.lineTo(bx + boxW - cut, by + boxH);
    ctx.lineTo(bx + cut, by + boxH);
    ctx.lineTo(bx, by + boxH - cut);
    ctx.lineTo(bx, by + cut);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#fde047';
    ctx.fillRect(bx, by + cut, 3, boxH - cut * 2);

    ctx.font = 'bold 12px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'left';
    ctx.fillText(`◈ CLICK ĐỂ QUÉT: ${hoveredHotspot.name}`, bx + 14, by + 20);

    ctx.font = '11px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    const hint =
      hoveredHotspot.scannerHint.length > 65
        ? hoveredHotspot.scannerHint.slice(0, 65) + '...'
        : hoveredHotspot.scannerHint;
    ctx.fillText(hint, bx + 14, by + 40);
    ctx.restore();
  }
}

setInterval(async () => {
  if (!autoClockEnabled || !gameState) return;
  try {
    const res = await apiRequest('/api/phase', 'POST', { action: 'tick', deltaMinutes: 1 });
    gameState = res.state;
    renderAll();
    if (res.loopReset && res.message) {
      if (window.ChronoUpgrades && typeof window.ChronoUpgrades.playSupernovaCutscene === 'function') {
        window.ChronoUpgrades.playSupernovaCutscene(gameState.session.loopNumber);
      }
      showToast(res.message);
    }
  } catch (_) {}
}, 12000);

window.addEventListener('DOMContentLoaded', () => {
  setupCanvasInteractions();
  loadState();
  requestAnimationFrame(drawSpaceCanvas);
});
