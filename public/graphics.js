/**
 * 🎨 ChronoHorizon — High-Detail 2.5D Sci-Fi Graphics Engine
 * Hỗ trợ:
 * 1. Tải & Hiển thị Ảnh Nền Concept Art Độ Phân Giải Cao (/assets/*.png) kèm hiệu ứng Parallax 3D theo chuột
 * 2. Hố đen Gargantua / Mắt Ouroboros & Hiệu ứng Ánh sáng Thể tích (Volumetric Lighting)
 * 3. Ba Chế độ Kính Quét Mũ Bảo Hiểm (NORMAL • THERMAL Nhiệt Ảnh • ECHO Dư Ảnh Bóng Ma Phi Hành Đoàn)
 * 4. Cửa Hầm Áp Suất (Walkable Airlock Portals) hai bên trái/phải để đi bộ chuyển khoang trực tiếp
 * 5. Nhân vật Phi hành gia có hoạt ảnh bước đi, Jetpack, Đèn pha Quang phổ & Tia Laser Quét
 */

const playerState = {
  x: 240,
  y: 380,
  targetX: 240,
  targetY: 380,
  facing: 1,
  walkCycle: 0,
  isMoving: false,
  pendingHotspotId: null,
  pendingPortalSectorId: null,
  scanBeamTimer: 0,
  scanBeamTarget: null,
  visorMode: 'NORMAL', // 'NORMAL' | 'THERMAL' | 'ECHO'
  keys: { w: false, a: false, s: false, d: false },
  jetpackParticles: []
};

// Tự động nạp bộ ảnh nền Concept Art độ phân giải cao cho 6 khoang tàu & Sơ đồ Toàn Trạm
const sectorBgImages = {};
const SECTOR_IMAGE_MAP = {
  'sector-bridge': '/assets/sector-bridge.jpg',
  'sector-hydro': '/assets/sector-hydro.jpg',
  'sector-optics': '/assets/sector-optics.jpg',
  'sector-astrolabe': '/assets/sector-astrolabe.jpg',
  'sector-xenolith': '/assets/sector-xenolith.jpg',
  'sector-chronocore': '/assets/sector-chronocore.jpg',
  'station-orbit-map': '/assets/station-orbit-map.jpg'
};

function preloadSectorImages() {
  for (const [secId, url] of Object.entries(SECTOR_IMAGE_MAP)) {
    const img = new Image();
    img.onload = () => {
      sectorBgImages[secId] = img;
    };
    img.src = url;
  }
}

// Dữ liệu Dư Ảnh Lượng Tử (Quantum Echo Holograms) chỉ hiện khi bật kính ECHO [Phím 3]
const SECTOR_ECHO_GHOSTS = {
  'sector-bridge': {
    name: 'Chỉ huy trưởng Elena Vance',
    role: 'COMMANDER // AETHELGARD-IX',
    timecode: 'T+08:15 • Δt +0.04s',
    x: 325,
    y: 388,
    quote: '“Tôi đã giấu mã Vòng Nội Tinh (120°) trong Sa bàn. Hãy dùng nhiệt Plasma rã đông thẻ từ của tôi!”',
    wallCode: 'MẬT MÃ VÒNG NỘI TINH BÀN: 120°'
  },
  'sector-hydro': {
    name: 'TS. Sora Kurosawa',
    role: 'XENO-BOTANY & ARCHAEOLOGY',
    timecode: 'T+11:20 • Δt +0.04s',
    x: 310,
    y: 388,
    quote: '“Bình nhiệt lượng Plasma ở trạm sưởi sẽ làm tan chảy lớp băng Nitơ bọc Thẻ Từ Chỉ Huy!”',
    wallCode: 'CÔNG THỨC GHÉP: THẺ ĐÓNG BĂNG + BÌNH PLASMA'
  },
  'sector-optics': {
    name: 'TS. Trần Khải Minh',
    role: 'CHIEF QUANTUM OPTICS ARCHITECT',
    timecode: 'T+16:10 • Δt +0.04s',
    x: 645,
    y: 388,
    quote: '“Xoay 5 gương theo chuẩn: M1(\\) • M2(═) • M3(/) • M4(\\) • M5(═). Tọa độ Vòng Trung là 240°!”',
    wallCode: 'GƯƠNG: M1:\\  M2:═  M3:/  M4:\\  M5:═  |  VÒNG TRUNG: 240°'
  },
  'sector-astrolabe': {
    name: 'Chỉ huy trưởng Elena Vance',
    role: 'CELESTIAL ASTROLABE DOME',
    timecode: 'T+18:20 • Δt +0.04s',
    x: 425,
    y: 388,
    quote: '“Khi Bão Từ Pha II làm tan băng, hãy xoay 3 vòng Tinh Bàn khớp góc 120° • 240° • 60°!”',
    wallCode: 'TỌA ĐỘ TINH BÀN: NỘI 120° • TRUNG 240° • NGOẠI 60°'
  },
  'sector-xenolith': {
    name: 'TS. Sora Kurosawa',
    role: 'XENOLITH MONOLITH VAULT',
    timecode: 'T+21:15 • Δt +0.04s',
    x: 640,
    y: 388,
    quote: '“Thực thể trong Dị điểm đang cầu cứu! Ký tự Ngôi sao 4 cánh trên bia đá chỉ góc 60°!”',
    wallCode: 'MẬT MÃ CỔ NGỮ (✧) ➔ VÒNG NGOẠI DỊ ĐIỂM: 60°'
  },
  'sector-chronocore': {
    name: 'AI KRONOS-7 & Phi Hành Đoàn',
    role: 'CHRONO-CORE SINGULARITY NEXUS',
    timecode: 'T+21:59 • Δt +0.04s',
    x: 295,
    y: 388,
    quote: '“Hãy hoàn tất 4 câu hỏi Suy luận và kích hoạt Giao thức HARMONY để giải cứu chúng tôi!”',
    wallCode: 'GIAO THỨC KẾT CỤC THẬT: [PROTOCOL-HARMONY]'
  }
};

const ambientParticles = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 73) % 960,
  y: (i * 47) % 460,
  vx: ((i % 5) - 2) * 0.16,
  vy: -((i % 3) * 0.2 + 0.08),
  size: (i % 3) * 1.15 + 1,
  alpha: ((i % 7) + 2) * 0.08
}));

const bgStars = Array.from({ length: 120 }, (_, i) => ({
  x: (i * 131) % 960,
  y: (i * 89) % 480,
  r: (i % 3) * 0.65 + 0.4,
  twinkleSpeed: (i % 5) * 0.03 + 0.02,
  phase: i * 0.7
}));

function initPlayerControls() {
  preloadSectorImages();

  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') playerState.keys.w = true;
    if (k === 's' || k === 'arrowdown') playerState.keys.s = true;
    if (k === 'a' || k === 'arrowleft') playerState.keys.a = true;
    if (k === 'd' || k === 'arrowright') playerState.keys.d = true;
    if (k === '1' && typeof window.setVisorMode === 'function') window.setVisorMode('NORMAL');
    if (k === '2' && typeof window.setVisorMode === 'function') window.setVisorMode('THERMAL');
    if (k === '3' && typeof window.setVisorMode === 'function') window.setVisorMode('ECHO');
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') playerState.keys.w = false;
    if (k === 's' || k === 'arrowdown') playerState.keys.s = false;
    if (k === 'a' || k === 'arrowleft') playerState.keys.a = false;
    if (k === 'd' || k === 'arrowright') playerState.keys.d = false;
  });
}

function updatePlayerPhysics() {
  const speed = 4.5;
  let manualMove = false;

  if (playerState.keys.a) {
    playerState.x -= speed;
    playerState.facing = -1;
    manualMove = true;
  }
  if (playerState.keys.d) {
    playerState.x += speed;
    playerState.facing = 1;
    manualMove = true;
  }
  if (playerState.keys.w) {
    playerState.y -= speed * 0.7;
    manualMove = true;
  }
  if (playerState.keys.s) {
    playerState.y += speed * 0.7;
    manualMove = true;
  }

  if (manualMove) {
    playerState.targetX = playerState.x;
    playerState.targetY = playerState.y;
    playerState.pendingHotspotId = null;
    playerState.pendingPortalSectorId = null;
    playerState.isMoving = true;
  } else {
    const dx = playerState.targetX - playerState.x;
    const dy = playerState.targetY - playerState.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
      playerState.x += (dx / dist) * speed;
      playerState.y += (dy / dist) * speed;
      playerState.facing = dx >= 0 ? 1 : -1;
      playerState.isMoving = true;
    } else {
      playerState.isMoving = false;
      if (playerState.pendingHotspotId) {
        const hsId = playerState.pendingHotspotId;
        playerState.pendingHotspotId = null;
        if (typeof window.triggerHotspotInspection === 'function') {
          window.triggerHotspotInspection(hsId);
        }
      } else if (playerState.pendingPortalSectorId) {
        const targetSec = playerState.pendingPortalSectorId;
        playerState.pendingPortalSectorId = null;
        if (typeof window.navigateSector === 'function') {
          window.navigateSector(targetSec);
        }
      }
    }
  }

  playerState.x = Math.max(70, Math.min(890, playerState.x));
  playerState.y = Math.max(320, Math.min(425, playerState.y));

  if (playerState.isMoving) {
    playerState.walkCycle += 0.25;
    if (Math.random() < 0.7) {
      playerState.jetpackParticles.push({
        x: playerState.x - playerState.facing * 12,
        y: playerState.y - 26 + (Math.random() * 6 - 3),
        vx: -playerState.facing * (1.3 + Math.random() * 1.5),
        vy: 0.3 + Math.random() * 0.7,
        life: 1.0,
        color: Math.random() > 0.4 ? '#38bdf8' : '#a855f7'
      });
    }
  } else {
    playerState.walkCycle += 0.05;
  }

  for (let i = playerState.jetpackParticles.length - 1; i >= 0; i--) {
    const p = playerState.jetpackParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.06;
    if (p.life <= 0) playerState.jetpackParticles.splice(i, 1);
  }

  if (playerState.scanBeamTimer > 0) {
    playerState.scanBeamTimer--;
  }
}

// ============================================================================
// 1. VẼ HỐ ĐEN GARGANTUA / MẮT OUROBOROS
// ============================================================================

function drawDeepSpaceAndSingularity(ctx, w, h, centerX, centerY, scale, phaseId, frame) {
  ctx.save();

  const spaceGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, w * 0.85);
  if (phaseId === 1) {
    spaceGrad.addColorStop(0, '#130b2e');
    spaceGrad.addColorStop(0.45, '#070b19');
    spaceGrad.addColorStop(1, '#02040a');
  } else if (phaseId === 2) {
    spaceGrad.addColorStop(0, '#3b1d0a');
    spaceGrad.addColorStop(0.45, '#140c1c');
    spaceGrad.addColorStop(1, '#03050c');
  } else if (phaseId === 3) {
    spaceGrad.addColorStop(0, '#2e0b29');
    spaceGrad.addColorStop(0.45, '#0d0920');
    spaceGrad.addColorStop(1, '#020309');
  } else {
    spaceGrad.addColorStop(0, '#450a18');
    spaceGrad.addColorStop(0.45, '#190614');
    spaceGrad.addColorStop(1, '#040208');
  }
  ctx.fillStyle = spaceGrad;
  ctx.fillRect(0, 0, w, h);

  for (const st of bgStars) {
    const alpha = 0.35 + 0.55 * Math.sin(frame * st.twinkleSpeed + st.phase);
    ctx.fillStyle = `rgba(226, 240, 255, ${alpha.toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
    ctx.fill();
  }

  const phasePalettes = {
    1: { inner: '#ffffff', mid: '#38bdf8', outer: '#9333ea' },
    2: { inner: '#ffffff', mid: '#facc15', outer: '#ea580c' },
    3: { inner: '#ffffff', mid: '#fb923c', outer: '#a855f7' },
    4: { inner: '#ffffff', mid: '#f43f5e', outer: '#7f1d1d' }
  };
  const pal = phasePalettes[phaseId] || phasePalettes[1];

  const bhRadius = 42 * scale;
  const pulse = Math.sin(frame * 0.04) * 5 * scale;

  const haloGrad = ctx.createRadialGradient(
    centerX,
    centerY,
    bhRadius * 0.8,
    centerX,
    centerY,
    bhRadius * 3.2 + pulse
  );
  haloGrad.addColorStop(0, pal.inner);
  haloGrad.addColorStop(0.28, pal.mid);
  haloGrad.addColorStop(0.62, pal.outer);
  haloGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, bhRadius * 3.2 + pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(-0.18 + Math.sin(frame * 0.01) * 0.03);
  for (let i = 3; i >= 1; i--) {
    const rx = bhRadius * (1.5 + i * 0.52);
    const ry = bhRadius * (0.28 + i * 0.09);
    ctx.strokeStyle = i === 1 ? pal.inner : i === 2 ? pal.mid : pal.outer;
    ctx.lineWidth = (7 - i * 1.4) * scale;
    ctx.globalAlpha = 0.82 - i * 0.15;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, Math.PI, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = '#010206';
  ctx.beginPath();
  ctx.arc(centerX, centerY, bhRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2 * scale;
  ctx.shadowColor = pal.mid;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(centerX, centerY, bhRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(-0.18 + Math.sin(frame * 0.01) * 0.03);
  for (let i = 3; i >= 1; i--) {
    const rx = bhRadius * (1.55 + i * 0.52);
    const ry = bhRadius * (0.28 + i * 0.09);
    ctx.strokeStyle = i === 1 ? '#ffffff' : i === 2 ? pal.mid : pal.outer;
    ctx.lineWidth = (8 - i * 1.5) * scale;
    ctx.globalAlpha = 0.92 - i * 0.15;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
}

// ============================================================================
// 2. VẼ KIẾN TRÚC PHÒNG (ƯU TIÊN ẢNH CONCEPT ART AI ĐỘ PHÂN GIẢI CAO + SHADER)
// ============================================================================

function drawSciFiRoomArchitecture(ctx, w, h, sectorId, phaseId, frame, mousePos) {
  ctx.save();

  const bgImg = sectorBgImages[sectorId];
  if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
    // Hiệu ứng Camera Parallax 3D mượt mà theo vị trí chuột
    const px = mousePos && mousePos.inside ? ((mousePos.x - w / 2) / w) * -18 : 0;
    const py = mousePos && mousePos.inside ? ((mousePos.y - h / 2) / h) * -10 : 0;
    ctx.drawImage(bgImg, px - 14, py - 10, w + 28, h + 20);

    // Phủ lớp ánh sáng môi trường theo Pha (Ambient Phase Tint)
    const phaseTints = {
      1: 'rgba(6, 15, 36, 0.25)',
      2: 'rgba(65, 35, 8, 0.22)',
      3: 'rgba(45, 10, 55, 0.26)',
      4: 'rgba(85, 10, 25, 0.34)'
    };
    ctx.fillStyle = phaseTints[phaseId] || phaseTints[1];
    ctx.fillRect(0, 0, w, h);

    // Đổ bóng tối nhẹ dưới sàn để nhân vật & thiết bị nổi bật rõ nét
    const floorShadow = ctx.createLinearGradient(0, h - 165, 0, h);
    floorShadow.addColorStop(0, 'transparent');
    floorShadow.addColorStop(1, 'rgba(3, 6, 15, 0.72)');
    ctx.fillStyle = floorShadow;
    ctx.fillRect(0, h - 165, w, 165);
  } else {
    // Fallback Procedural 2.5D nếu ảnh đang tải
    drawDeepSpaceAndSingularity(ctx, w, h, w / 2, 140, 1.05, phaseId, frame);

    const floorGrad = ctx.createLinearGradient(0, 305, 0, h);
    floorGrad.addColorStop(0, '#16243d');
    floorGrad.addColorStop(1, '#050914');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, 305, w, h - 305);
  }

  // Nếu đang bật Chế độ Kính Nhiệt Ảnh (THERMAL) -> Vẽ đường cáp năng lượng ngầm dưới sàn
  if (playerState.visorMode === 'THERMAL') {
    ctx.fillStyle = 'rgba(8, 12, 48, 0.55)';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 12;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.moveTo(80, 375);
    ctx.lineTo(w / 2, 345);
    ctx.lineTo(w - 80, 375);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  }

  // Nếu đang bật Chế độ Kính Dư Ảnh Lượng Tử (ECHO) -> Phủ lớp trường lượng tử Tachyon lên căn phòng
  if (playerState.visorMode === 'ECHO') {
    const echoTint = ctx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, w * 0.65);
    echoTint.addColorStop(0, 'rgba(30, 12, 64, 0.28)');
    echoTint.addColorStop(1, 'rgba(14, 5, 36, 0.58)');
    ctx.fillStyle = echoTint;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.restore();
}

// ============================================================================
// 2B. VẼ HOLOGRAM DƯ ẢNH LƯỢNG TỬ 3D & BẢNG GIẢI MÃ TẦN SỐ TACHYON (ECHO VISOR)
// ============================================================================

function drawQuantumEchoProjection(ctx, w, h, sectorId, frame) {
  if (playerState.visorMode !== 'ECHO') return;
  const echo = SECTOR_ECHO_GHOSTS[sectorId];
  if (!echo) return;

  ctx.save();

  // 1. BẢNG MẬT MÃ TACHYON TRÊN VÁCH TRÊN (Chamfered Quantum Telemetry Banner)
  ctx.font = 'bold 13px Consolas, monospace';
  const codeTextW = ctx.measureText(echo.wallCode).width;
  const bannerW = Math.max(380, Math.ceil(codeTextW + 96));
  const bannerH = 44;
  const bx = (w - bannerW) / 2;
  const by = 54 + Math.sin(frame * 0.04) * 2;
  const cut = 10;

  ctx.save();
  ctx.fillStyle = 'rgba(11, 6, 28, 0.92)';
  ctx.strokeStyle = '#e879f9';
  ctx.lineWidth = 1.6;
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 16;

  ctx.beginPath();
  ctx.moveTo(bx + cut, by);
  ctx.lineTo(bx + bannerW - cut, by);
  ctx.lineTo(bx + bannerW, by + cut);
  ctx.lineTo(bx + bannerW, by + bannerH - cut);
  ctx.lineTo(bx + bannerW - cut, by + bannerH);
  ctx.lineTo(bx + cut, by + bannerH);
  ctx.lineTo(bx, by + bannerH - cut);
  ctx.lineTo(bx, by + cut);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Thanh ánh sáng Cyan-Magenta trên đỉnh Banner
  const topGrad = ctx.createLinearGradient(bx, by, bx + bannerW, by);
  topGrad.addColorStop(0, 'transparent');
  topGrad.addColorStop(0.25, '#38bdf8');
  topGrad.addColorStop(0.75, '#e879f9');
  topGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = topGrad;
  ctx.fillRect(bx + 20, by, bannerW - 40, 2.5);

  // Nhãn phụ nhỏ phía trên
  ctx.font = 'bold 9.5px Consolas, monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.fillText('◈ TACHYON MEMORY TRACE // TẦN SỐ DƯ ẢNH 14.2 Hz ◈', w / 2, by + 15);

  // Dòng mật mã chính phát sáng
  ctx.font = 'bold 13.5px Consolas, monospace';
  ctx.fillStyle = '#f5d0fe';
  ctx.shadowColor = '#d946ef';
  ctx.shadowBlur = 10;
  ctx.fillText(echo.wallCode, w / 2, by + 34);
  ctx.restore();

  // 2. VẼ HÌNH CHIẾU HOLOGRAM 3D CỦA THÀNH VIÊN PHI HÀNH ĐOÀN TRÊN SÀN
  const gx = echo.x;
  const gy = echo.y;
  const floatOffset = Math.sin(frame * 0.06) * 3.5;

  ctx.save();
  ctx.translate(gx, gy);

  // 2.1. Đế phát tia Hologram dưới sàn (Dual Rotating Quantum Emitter Rings)
  const floorGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 46);
  floorGlow.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
  floorGlow.addColorStop(0.5, 'rgba(217, 70, 239, 0.28)');
  floorGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = floorGlow;
  ctx.beginPath();
  ctx.ellipse(0, 2, 46, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.ellipse(0, 2, 30, 8.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#e879f9';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.ellipse(0, 2, 20, 5.5, 0, frame * 0.03, frame * 0.03 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 2.2. Luồng sáng thể tích chiếu ngược từ đế lên (Volumetric Light Cone)
  const beamGrad = ctx.createLinearGradient(0, 2, 0, -96);
  beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.34)');
  beamGrad.addColorStop(0.45, 'rgba(217, 70, 239, 0.16)');
  beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(-26, 2);
  ctx.lineTo(-38, -94);
  ctx.lineTo(38, -94);
  ctx.lineTo(26, 2);
  ctx.closePath();
  ctx.fill();

  // 2.3. Mô hình Nhân vật Phi Hành Đoàn Hologram 2.5D chi tiết (thay thế hình que cũ)
  ctx.save();
  ctx.translate(0, floatOffset);

  const bodyGrad = ctx.createLinearGradient(0, -82, 0, 0);
  bodyGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
  bodyGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.42)');
  bodyGrad.addColorStop(1, 'rgba(56, 189, 248, 0.15)');

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = '#f0abfc';
  ctx.lineWidth = 1.7;
  ctx.shadowColor = '#e879f9';
  ctx.shadowBlur = 10;

  // Hai chân & Giày phi hành gia
  ctx.beginPath();
  ctx.roundRect(-10, -28, 7, 26, 3);
  ctx.roundRect(3, -28, 7, 26, 3);
  ctx.fill();
  ctx.stroke();

  // Thân áo giáp / Áo khoác sĩ quan vũ trụ có cầu vai
  ctx.beginPath();
  ctx.moveTo(-15, -56);
  ctx.lineTo(15, -56);
  ctx.lineTo(12, -26);
  ctx.lineTo(-12, -26);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Đai lưng & Lõi đồng hồ lượng tử trước ngực
  ctx.strokeStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(-12, -34);
  ctx.lineTo(12, -34);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(0, -45, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Tay trái & Tay phải giơ lên phát tín hiệu Khối Tinh Thể Hologram
  ctx.strokeStyle = '#f0abfc';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-14, -52);
  ctx.lineTo(-19, -34);
  ctx.moveTo(14, -52);
  ctx.lineTo(24, -60);
  ctx.stroke();

  // Khối tinh thể dữ liệu xoay lơ lửng trên bàn tay phải
  const cubeY = -69 + Math.sin(frame * 0.1) * 2.5;
  ctx.save();
  ctx.translate(26, cubeY);
  ctx.rotate(frame * 0.04);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.4;
  ctx.strokeRect(-4.5, -4.5, 9, 9);
  ctx.restore();

  // Đầu & Mũ bảo hiểm Kính Quang Phổ
  ctx.lineWidth = 1.7;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#f0abfc';
  ctx.beginPath();
  ctx.arc(0, -69, 11.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Kính Visor phát sáng của Dư ảnh
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.ellipse(2, -69, 7, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Vòng hào quang thần kinh quanh đầu
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.ellipse(0, -72, 16, 4.5, -0.15, 0, Math.PI * 2);
  ctx.stroke();

  // Các vạch quét ngang (Hologram Scanlines) chạy dọc cơ thể
  ctx.shadowBlur = 0;
  for (let sy = -80; sy < 0; sy += 7) {
    const glitchShift = Math.sin(frame * 0.15 + sy) > 0.92 ? 3 : 0;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.fillRect(-16 + glitchShift, sy, 32, 1.5);
  }

  // Các hạt photon Tachyon bay lên từ bóng dư ảnh
  for (let p = 0; p < 5; p++) {
    const py = -((frame * 0.8 + p * 18) % 86);
    const px = Math.sin(frame * 0.05 + p * 2.1) * 18;
    ctx.fillStyle = p % 2 === 0 ? '#38bdf8' : '#f0abfc';
    ctx.beginPath();
    ctx.arc(px, py, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.restore();

  // 3. KHUNG HỘI THOẠI KÝ ỨC LƯỢNG TỬ CAO CẤP (Chamfered Memory Transcription HUD)
  ctx.font = '11.5px "Segoe UI", system-ui, sans-serif';
  const quoteTextW = ctx.measureText(echo.quote).width;
  const cardW = Math.min(520, Math.max(390, Math.ceil(quoteTextW + 38)));
  const cardH = 58;

  // Đặt khung hội thoại ở vùng không gian thoáng phía trên (y = 132), tự động căn lề trong màn hình
  const cardX = Math.max(24, Math.min(w - cardW - 24, gx - cardW / 2));
  const cardY = 128 + Math.sin(frame * 0.05) * 2;
  const cCut = 9;

  // Đường tia dẫn (Projection Leader Line) từ mũ bảo hiểm của Dư ảnh lên khung hội thoại
  ctx.save();
  ctx.strokeStyle = 'rgba(232, 121, 249, 0.6)';
  ctx.lineWidth = 1.4;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(gx, gy - 82 + floatOffset);
  ctx.lineTo(gx, cardY + cardH);
  ctx.stroke();
  ctx.setLineDash([]);

  // Nền kính vát góc sang trọng
  const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  cardGrad.addColorStop(0, 'rgba(13, 8, 34, 0.95)');
  cardGrad.addColorStop(0.6, 'rgba(24, 11, 52, 0.94)');
  cardGrad.addColorStop(1, 'rgba(9, 16, 38, 0.95)');

  ctx.fillStyle = cardGrad;
  ctx.strokeStyle = '#d946ef';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'rgba(217, 70, 239, 0.45)';
  ctx.shadowBlur = 14;

  ctx.beginPath();
  ctx.moveTo(cardX + cCut, cardY);
  ctx.lineTo(cardX + cardW - cCut, cardY);
  ctx.lineTo(cardX + cardW, cardY + cCut);
  ctx.lineTo(cardX + cardW, cardY + cardH - cCut);
  ctx.lineTo(cardX + cardW - cCut, cardY + cardH);
  ctx.lineTo(cardX + cCut, cardY + cardH);
  ctx.lineTo(cardX, cardY + cardH - cCut);
  ctx.lineTo(cardX, cardY + cCut);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Thanh viền trái phát sáng Cyan
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(cardX, cardY + cCut, 3, cardH - cCut * 2);

  // Biểu đồ Sóng Âm Giọng Nói Động (Animated Voiceprint Equalizer — thay thế Emoji 👻)
  const eqX = cardX + 14;
  const eqY = cardY + 18;
  for (let b = 0; b < 5; b++) {
    const bh = 4 + Math.abs(Math.sin(frame * 0.16 + b * 1.1)) * 10;
    ctx.fillStyle = b % 2 === 0 ? '#38bdf8' : '#e879f9';
    ctx.fillRect(eqX + b * 4, eqY - bh / 2, 2.4, bh);
  }

  // Hàng tiêu đề: Tên nhân vật + Chức vụ + Nhãn thời gian lệch pha
  ctx.font = 'bold 11.5px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#f0abfc';
  ctx.textAlign = 'left';
  ctx.fillText(echo.name.toUpperCase(), cardX + 40, cardY + 21);

  const nameW = ctx.measureText(echo.name.toUpperCase()).width;
  ctx.font = 'bold 9.5px Consolas, monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`// ${echo.role}`, cardX + 48 + nameW, cardY + 20.5);

  // Huy hiệu Timecode góc phải trên của Card
  const tcW = 118;
  ctx.fillStyle = 'rgba(217, 70, 239, 0.18)';
  ctx.strokeStyle = 'rgba(232, 121, 249, 0.55)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX + cardW - tcW - 10, cardY + 8, tcW, 17, 5);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 9.5px Consolas, monospace';
  ctx.fillStyle = '#f5d0fe';
  ctx.textAlign = 'center';
  ctx.fillText(echo.timecode, cardX + cardW - tcW / 2 - 10, cardY + 19.5);

  // Vạch phân cách mảnh
  ctx.strokeStyle = 'rgba(232, 121, 249, 0.22)';
  ctx.beginPath();
  ctx.moveTo(cardX + 12, cardY + 29);
  ctx.lineTo(cardX + cardW - 12, cardY + 29);
  ctx.stroke();

  // Nội dung câu thoại Dư ảnh
  ctx.font = '600 11.5px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.fillText(echo.quote, cardX + cardW / 2, cardY + 46);

  ctx.restore();
  ctx.restore();
}

// ============================================================================
// 3. VẼ CỬA HẦM ÁP SUẤT CHUYỂN KHOANG TRỰC TIẾP HAI BÊN TRÁI / PHẢI
// ============================================================================

function drawAirlockPortals(ctx, w, h, leftSector, rightSector, mousePos, frame) {
  const portals = [];
  if (leftSector) {
    portals.push({ x: 48, y: 345, side: 'LEFT', sector: leftSector });
  }
  if (rightSector) {
    portals.push({ x: w - 48, y: 345, side: 'RIGHT', sector: rightSector });
  }

  for (const pt of portals) {
    const isHover =
      mousePos && mousePos.inside && Math.hypot(mousePos.x - pt.x, mousePos.y - pt.y) <= 46;
    const baseColor = pt.sector.accessible ? '#38bdf8' : '#f43f5e';
    const activeColor = isHover ? '#fde047' : baseColor;

    ctx.save();
    ctx.translate(pt.x, pt.y);

    // Quầng sáng năng lượng phía sau Cửa Hầm
    const gateGrad = ctx.createRadialGradient(0, -12, 4, 0, -12, 44);
    gateGrad.addColorStop(0, activeColor + '66');
    gateGrad.addColorStop(0.65, 'rgba(6, 12, 28, 0.4)');
    gateGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = gateGrad;
    ctx.beginPath();
    ctx.arc(0, -12, 44, 0, Math.PI * 2);
    ctx.fill();

    // Khung Lục Giác Dọc (Sci-Fi Airlock Frame)
    const fw = isHover ? 24 : 21;
    const fh = isHover ? 36 : 33;
    ctx.fillStyle = isHover ? 'rgba(12, 28, 58, 0.92)' : 'rgba(5, 11, 26, 0.86)';
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = isHover ? 2.4 : 1.8;
    ctx.shadowColor = activeColor;
    ctx.shadowBlur = isHover ? 12 : 5;

    ctx.beginPath();
    ctx.moveTo(0, -12 - fh);
    ctx.lineTo(fw, -12 - fh * 0.55);
    ctx.lineTo(fw, -12 + fh * 0.55);
    ctx.lineTo(0, -12 + fh);
    ctx.lineTo(-fw, -12 + fh * 0.55);
    ctx.lineTo(-fw, -12 - fh * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Vẽ Mũi Tên Chevron Kép Bằng Vector Phát Sáng (thay cho Emoji ⬅️/➡️)
    const dir = pt.side === 'LEFT' ? -1 : 1;
    const slide = Math.sin(frame * 0.1) * 2.5 * dir;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = -1; i <= 1; i += 2) {
      const ox = slide + i * 3.5;
      ctx.beginPath();
      ctx.moveTo(ox - dir * 5, -19);
      ctx.lineTo(ox + dir * 4, -12);
      ctx.lineTo(ox - dir * 5, -5);
      ctx.stroke();
    }

    // Bảng mã khoang nhỏ gọn bên dưới cửa hầm
    ctx.fillStyle = 'rgba(4, 9, 22, 0.94)';
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-28, 25, 56, 18, 5);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 10px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = isHover ? '#fde047' : '#e2e8f0';
    ctx.fillText(pt.sector.code, 0, 37);
    ctx.restore();
  }

  return portals;
}

// ============================================================================
// 4. VẼ NÚT VẬT THỂ TƯƠNG TÁC HOLOGRAM (CUSTOM VECTOR SCI-FI HUD NODE)
// ============================================================================

const HOTSPOT_SHORT_NAMES = {
  'hs-bridge-cryo-locker': 'TỦ KHÓA ĐÓNG BĂNG',
  'hs-bridge-holo-table': 'SA BÀN HOLOGRAM',
  'hs-bridge-blackbox': 'HỘP ĐEN CHỈ HUY',
  'hs-hydro-workbench': 'TRẠM NHIỆT PLASMA',
  'hs-hydro-xeno-flora': 'BỂ THẠCH ANH TÍM',
  'hs-hydro-vent-hatch': 'HẦM MẬT ĐẠO CỔ NGỮ',
  'hs-optics-broken-frame': 'KHUNG LĂNG KÍNH & CUỘN CẢM',
  'hs-optics-laser-table': 'BÀN CHIẾT QUANG 5×5',
  'hs-optics-echo-projection': 'DƯ ẢNH TS. KHẢI MINH',
  'hs-astrolabe-thawed-pod': 'TÀU THĂM DÒ CỔ ĐẠI',
  'hs-astrolabe-dial': 'TINH BÀN 3 VÒNG',
  'hs-xenolith-altar': 'BỆ CỘNG HƯỞNG THẠCH ANH',
  'hs-xenolith-monolith': 'BIA ĐÁ CỔ NGỮ VẪN TINH',
  'hs-core-console': 'ĐIỀU KHIỂN CHRONO-CORE'
};

function drawHotspotVectorGlyph(ctx, hs, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;

  const id = hs.id || '';

  if (id.includes('broken-frame')) {
    // Icon Cuộn Cảm & Lăng Kính Quang Học (Hexagon Prism + Wave)
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(7, -3);
    ctx.lineTo(7, 4);
    ctx.lineTo(0, 8);
    ctx.lineTo(-7, 4);
    ctx.lineTo(-7, -3);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (id.includes('laser-table') || hs.openPuzzle === 'optics') {
    // Icon Lăng Kính Tam Giác Chiết Quang Tia Laser
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(8, 6);
    ctx.lineTo(-8, 6);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(0, -1);
    ctx.lineTo(10, -5);
    ctx.moveTo(0, -1);
    ctx.lineTo(10, 3);
    ctx.stroke();
  } else if (id.includes('cryo') || id.includes('thawed')) {
    // Icon Tinh Thể Băng Lượng Tử 6 Cánh
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * -8, Math.sin(a) * -8);
      ctx.lineTo(Math.cos(a) * 8, Math.sin(a) * 8);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.stroke();
  } else if (id.includes('holo') || id.includes('dial') || hs.openPuzzle === 'astrolabe') {
    // Icon Tinh Bàn Đồng Tâm / Quỹ Đạo Hologram
    ctx.beginPath();
    ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, 7.5, 3.2, 0.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (id.includes('blackbox')) {
    // Icon Sóng Tín Hiệu Hộp Đen
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-2, -6);
    ctx.lineTo(1, 7);
    ctx.lineTo(4, -4);
    ctx.lineTo(6, 0);
    ctx.lineTo(8, 0);
    ctx.stroke();
  } else if (id.includes('workbench') || id.includes('plasma')) {
    // Icon Lõi Nhiệt Năng Plasma
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.quadraticCurveTo(7, -1, 4, 6);
    ctx.quadraticCurveTo(0, 9, -4, 6);
    ctx.quadraticCurveTo(-7, -1, 0, -8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 2, 2.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (id.includes('flora') || id.includes('altar') || id.includes('monolith')) {
    // Icon Tinh Thể / Bia Đá Kim Cương
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(6, 0);
    ctx.lineTo(0, 9);
    ctx.lineTo(-6, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(0, 9);
    ctx.stroke();
  } else {
    // Icon Ngôi Sao Quét Lượng Tử 4 Cánh Chuẩn Sci-Fi
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(2.2, -2.2);
    ctx.lineTo(8, 0);
    ctx.lineTo(2.2, 2.2);
    ctx.lineTo(0, 8);
    ctx.lineTo(-2.2, 2.2);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-2.2, -2.2);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.restore();
}

function drawCustomHotspotProp(ctx, hs, hx, hy, inspected, available, isHover, frame) {
  ctx.save();
  ctx.translate(hx, hy);

  // Bảng màu Trạng thái Chuẩn Sci-Fi
  const baseColor = inspected ? '#10b981' : available ? '#38bdf8' : '#f59e0b';
  const activeColor = isHover ? '#fde047' : baseColor;

  // 1. Nếu bật kính THERMAL -> Vẽ quầng bức xạ nhiệt độ lên vật thể
  if (playerState.visorMode === 'THERMAL') {
    const isCold = hs.id.includes('cryo') || hs.id.includes('thawed');
    const thGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 54);
    thGrad.addColorStop(0, '#ffffff');
    thGrad.addColorStop(0.45, isCold ? '#38bdf8' : '#f97316');
    thGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = thGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 54, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 11px Consolas, monospace';
    ctx.fillStyle = isCold ? '#7dd3fc' : '#fdba74';
    ctx.textAlign = 'center';
    ctx.fillText(isCold ? '❄️ -140°C CRYO' : '🔥 +680°C CORE', 0, -34);
  }

  // 2. Quầng Sáng Ambient Mềm Mại & Sóng Radar Lan Tỏa
  const haloR = isHover ? 42 : 32;
  const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, haloR);
  auraGrad.addColorStop(0, activeColor + (isHover ? '55' : '33'));
  auraGrad.addColorStop(0.65, activeColor + '11');
  auraGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(0, 0, haloR, 0, Math.PI * 2);
  ctx.fill();

  // Sóng xung nhịp mảnh tinh tế
  const pulseProgress = ((frame * 0.02 + (hx % 7)) % 1);
  const pulseR = 17 + pulseProgress * 16;
  ctx.strokeStyle = activeColor;
  ctx.globalAlpha = (1 - pulseProgress) * 0.55;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // 3. Hai Cung Quỹ Đạo Cyber Xoay Đối Xứng (thay thế vòng nét đứt + ngoặc vuông rối mắt)
  const arcR = isHover ? 23 : 20;
  ctx.save();
  ctx.rotate(frame * (isHover ? 0.035 : 0.018));
  ctx.strokeStyle = activeColor;
  ctx.lineWidth = isHover ? 2.2 : 1.6;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(0, 0, arcR, -0.65, 0.65);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, arcR, Math.PI - 0.65, Math.PI + 0.65);
  ctx.stroke();

  // 2 điểm sáng nhỏ trên vành quỹ đạo
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -arcR, 2, 0, Math.PI * 2);
  ctx.arc(0, arcR, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Nhân Nút Lục Giác / Bát Giác Kính Đen Sang Trọng (Octagonal Cyber Medallion)
  const coreR = isHover ? 16.5 : 14.5;
  const coreGrad = ctx.createRadialGradient(0, -4, 1, 0, 0, coreR);
  coreGrad.addColorStop(0, isHover ? '#16355d' : '#0d2240');
  coreGrad.addColorStop(1, '#040918');

  ctx.fillStyle = coreGrad;
  ctx.strokeStyle = activeColor;
  ctx.lineWidth = isHover ? 2.2 : 1.7;
  ctx.shadowColor = activeColor;
  ctx.shadowBlur = isHover ? 12 : 6;

  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + Math.PI / 8;
    const px = Math.cos(a) * coreR;
    const py = Math.sin(a) * coreR;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Vẽ Icon Vector Sci-Fi sắc nét ở chính giữa nút (không dùng Emoji mặc định của Windows)
  drawHotspotVectorGlyph(ctx, hs, isHover ? '#fef08a' : '#f8fafc');

  // 5. Huy hiệu Trạng thái Mini ở góc phải-trên của Nút (✓ Đã quét / ! Cần điều kiện)
  if (inspected || !available) {
    const bx = 13;
    const by = -13;
    ctx.fillStyle = inspected ? '#059669' : '#d97706';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(bx, by, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (inspected) {
      ctx.moveTo(bx - 2.8, by + 0.2);
      ctx.lineTo(bx - 0.6, by + 2.4);
      ctx.lineTo(bx + 3.2, by - 2.2);
    } else {
      ctx.moveTo(bx, by - 2.6);
      ctx.lineTo(bx, by + 0.5);
      ctx.moveTo(bx, by + 2.8);
      ctx.lineTo(bx, by + 3);
    }
    ctx.stroke();
  }

  // 6. Bảng Nhãn Sci-Fi Vát Góc Gọn Đẹp (Không bao giờ đè lên nút bên cạnh hoặc tràn lề)
  const shortTitle = HOTSPOT_SHORT_NAMES[hs.id] || hs.name.toUpperCase();
  ctx.font = 'bold 10.5px "Segoe UI", system-ui, sans-serif';
  const textMetrics = ctx.measureText(shortTitle);
  const badgeSlotW = 20;
  const padX = 10;
  const tagW = Math.ceil(textMetrics.width + badgeSlotW + padX * 2);
  const tagH = 22;
  const tagY = 26;

  // Tự động dịch tâm bảng nhãn nếu sát mép trái/phải màn hình (960px)
  let shiftX = 0;
  if (hx - tagW / 2 < 14) shiftX = 14 - (hx - tagW / 2);
  if (hx + tagW / 2 > 946) shiftX = 946 - (hx + tagW / 2);

  // Đường kim chỉ (Leader Pin) nối từ tâm nút xuống bảng nhãn
  ctx.strokeStyle = activeColor + 'aa';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(0, coreR + 2);
  ctx.lineTo(0, tagY);
  ctx.stroke();

  ctx.save();
  ctx.translate(shiftX, tagY);

  // Khung bảng nhãn vát góc 45 độ kiểu Cyberpunk / Outer Wilds
  const cut = 5;
  const left = -tagW / 2;
  const right = tagW / 2;

  ctx.fillStyle = isHover ? 'rgba(12, 28, 56, 0.96)' : 'rgba(5, 11, 25, 0.92)';
  ctx.strokeStyle = activeColor;
  ctx.lineWidth = isHover ? 1.7 : 1.2;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.moveTo(left + cut, 0);
  ctx.lineTo(right - cut, 0);
  ctx.lineTo(right, cut);
  ctx.lineTo(right, tagH - cut);
  ctx.lineTo(right - cut, tagH);
  ctx.lineTo(left + cut, tagH);
  ctx.lineTo(left, tagH - cut);
  ctx.lineTo(left, cut);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Ô trạng thái bên trái tách biệt rõ ràng bằng vạch ngăn (không bao giờ đè lên chữ!)
  const sepX = left + badgeSlotW + 4;
  ctx.strokeStyle = activeColor + '55';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sepX, 4);
  ctx.lineTo(sepX, tagH - 4);
  ctx.stroke();

  // Vẽ ký hiệu trạng thái bên trong ô trái
  const iconCx = left + (badgeSlotW + 4) / 2;
  const iconCy = tagH / 2;
  if (inspected) {
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(iconCx - 3.5, iconCy + 0.2);
    ctx.lineTo(iconCx - 0.8, iconCy + 3);
    ctx.lineTo(iconCx + 4, iconCy - 2.8);
    ctx.stroke();
  } else {
    ctx.fillStyle = activeColor;
    ctx.beginPath();
    ctx.moveTo(iconCx, iconCy - 3.8);
    ctx.lineTo(iconCx + 3.8, iconCy);
    ctx.lineTo(iconCx, iconCy + 3.8);
    ctx.lineTo(iconCx - 3.8, iconCy);
    ctx.closePath();
    ctx.fill();
  }

  // Chữ tiêu đề căn giữa trong phần bên phải của vạch ngăn
  ctx.fillStyle = isHover ? '#fef08a' : inspected ? '#d1fae5' : '#f1f5f9';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const textCenterX = sepX + (right - sepX) / 2;
  ctx.fillText(shortTitle, textCenterX, tagH / 2 + 0.5);

  ctx.restore();
  ctx.restore();
}

// ============================================================================
// 5. VẼ NHÂN VẬT PHI HÀNH GIA + ĐÈN PHA QUANG PHỔ
// ============================================================================

function drawAstronautAndFlashlight(ctx, mousePos, frame) {
  const p = playerState;

  for (const pt of p.jetpackParticles) {
    ctx.fillStyle = pt.color;
    ctx.globalAlpha = Math.max(0, pt.life);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3.5 * pt.life, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const headX = p.x;
  const headY = p.y - 44;
  const angle = Math.atan2(mousePos.y - headY, mousePos.x - headX);

  ctx.save();
  const coneGrad = ctx.createRadialGradient(headX, headY, 8, headX, headY, 290);
  if (p.visorMode === 'THERMAL') {
    coneGrad.addColorStop(0, 'rgba(249, 115, 22, 0.32)');
    coneGrad.addColorStop(0.55, 'rgba(244, 63, 94, 0.1)');
  } else if (p.visorMode === 'ECHO') {
    coneGrad.addColorStop(0, 'rgba(217, 70, 239, 0.35)');
    coneGrad.addColorStop(0.55, 'rgba(168, 85, 247, 0.12)');
  } else {
    coneGrad.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
    coneGrad.addColorStop(0.55, 'rgba(56, 189, 248, 0.08)');
  }
  coneGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(headX, headY);
  ctx.arc(headX, headY, 290, angle - 0.34, angle + 0.34);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (p.scanBeamTimer > 0 && p.scanBeamTarget) {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.2;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(p.x + p.facing * 14, p.y - 28);
    ctx.lineTo(p.scanBeamTarget.x, p.scanBeamTarget.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      p.scanBeamTarget.x,
      p.scanBeamTarget.y,
      15 + ((32 - p.scanBeamTimer) % 26),
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(p.x, p.y);

  // Bóng đổ mềm dưới sàn kèm phản quang ánh đèn mũ bảo hiểm
  const shadowGrad = ctx.createRadialGradient(0, 4, 2, 0, 4, 24);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  shadowGrad.addColorStop(0.7, 'rgba(2, 6, 23, 0.35)');
  shadowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(0, 4, 24, 7.5, 0, 0, Math.PI * 2);
  ctx.fill();

  const bob = p.isMoving ? Math.abs(Math.sin(p.walkCycle)) * 4 : Math.sin(frame * 0.06) * 1.6;
  const legSwing = p.isMoving ? Math.sin(p.walkCycle) * 8.5 : 0;
  const armSwing = p.isMoving ? -Math.sin(p.walkCycle) * 5 : 0;

  const visorTheme =
    p.visorMode === 'THERMAL'
      ? { main: '#f97316', deep: '#dc2626', glow: '#fb923c' }
      : p.visorMode === 'ECHO'
      ? { main: '#e879f9', deep: '#7e22ce', glow: '#d946ef' }
      : { main: '#38bdf8', deep: '#0369a1', glow: '#0ea5e9' };

  ctx.scale(p.facing, 1);
  ctx.translate(0, -bob);

  // 1. Ba-lô Phản lực Kép (Dual-Thruster Exo-Jetpack)
  const packGrad = ctx.createLinearGradient(-22, -46, -8, -16);
  packGrad.addColorStop(0, '#475569');
  packGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = packGrad;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(-20, -45, 12, 27, 4);
  ctx.fill();
  ctx.stroke();

  // Ống năng lượng Plasma phát sáng trên lưng Jetpack
  ctx.fillStyle = visorTheme.main;
  ctx.shadowColor = visorTheme.glow;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect(-17.5, -40, 4.5, 15, 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Vòi phun phản lực dưới đáy Jetpack
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(-18, -18);
  ctx.lineTo(-11, -18);
  ctx.lineTo(-9.5, -13);
  ctx.lineTo(-19.5, -13);
  ctx.closePath();
  ctx.fill();

  if (p.isMoving) {
    const flameH = 7 + Math.sin(frame * 0.6) * 3;
    const flGrad = ctx.createLinearGradient(-14.5, -13, -14.5, -13 + flameH);
    flGrad.addColorStop(0, '#ffffff');
    flGrad.addColorStop(0.5, visorTheme.main);
    flGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = flGrad;
    ctx.beginPath();
    ctx.moveTo(-17.5, -13);
    ctx.lineTo(-11.5, -13);
    ctx.lineTo(-14.5, -13 + flameH);
    ctx.closePath();
    ctx.fill();
  }

  // 2. Chân Sau (Back Leg + Magnetic Space Boot)
  ctx.save();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 6.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-3, -18);
  ctx.lineTo(-4 - legSwing * 0.85, -2);
  ctx.stroke();
  // Giày từ tính chân sau
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.roundRect(-7 - legSwing * 0.85, -4, 9.5, 5.5, 2.5);
  ctx.fill();
  ctx.restore();

  // 3. Chân Trước (Front Articulated Exo-Leg + Knee Pad + Boot)
  ctx.save();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(3.5, -18);
  ctx.lineTo(4 + legSwing, -2);
  ctx.stroke();
  // Giáp đầu gối
  ctx.fillStyle = visorTheme.main;
  ctx.beginPath();
  ctx.arc(3.8 + legSwing * 0.5, -10, 2.6, 0, Math.PI * 2);
  ctx.fill();
  // Giày từ tính chân trước có đế phát sáng
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.roundRect(0.5 + legSwing, -4.5, 11, 6, 2.5);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 4. Giáp Thân Exo-Suit (Shaded Titanium Torso + Belt + Chest Core)
  const suitGrad = ctx.createLinearGradient(-11, -44, 12, -16);
  suitGrad.addColorStop(0, '#ffffff');
  suitGrad.addColorStop(0.55, '#e2e8f0');
  suitGrad.addColorStop(1, '#94a3b8');

  ctx.fillStyle = suitGrad;
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(-11, -44, 22, 27, 7);
  ctx.fill();
  ctx.stroke();

  // Đai lưng kỹ thuật (Utility Belt)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-11, -23, 22, 4.5);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(1, -22.5, 4.5, 3.5);

  // Mô-đun Sinh tồn & Đồng hồ Lượng tử trước ngực
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = visorTheme.main;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(-3.5, -38.5, 11, 9, 2.5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = visorTheme.main;
  ctx.shadowColor = visorTheme.glow;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(2, -34, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 5. Mũ Bảo Hiểm Phi Hành Gia Vòm Kính Toàn Cảnh (Panoramic Space Helmet)
  const helmGrad = ctx.createRadialGradient(-4, -59, 2, 0, -54, 16);
  helmGrad.addColorStop(0, '#ffffff');
  helmGrad.addColorStop(0.7, '#e2e8f0');
  helmGrad.addColorStop(1, '#94a3b8');

  ctx.fillStyle = helmGrad;
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, -54, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Vòng cổ kim loại khóa áp suất
  ctx.strokeStyle = visorTheme.main;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-9, -43);
  ctx.lineTo(9, -43);
  ctx.stroke();

  // Anten liên lạc KRONOS gắn bên mũ
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-6, -65);
  ctx.lineTo(-9, -73);
  ctx.stroke();
  ctx.fillStyle = visorTheme.main;
  ctx.beginPath();
  ctx.arc(-9, -73, 2, 0, Math.PI * 2);
  ctx.fill();

  // Kính Visor Quang Phổ Vòm Rộng có phản xạ ánh sáng kép
  const visorGrad = ctx.createLinearGradient(-1, -61, 13, -46);
  visorGrad.addColorStop(0, visorTheme.main);
  visorGrad.addColorStop(0.6, visorTheme.deep);
  visorGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = visorGrad;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.ellipse(4.8, -54, 8.8, 7.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Vệt phản quang kính mũ (Specular Highlight)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.ellipse(6.8, -57.5, 3.6, 1.6, -0.35, 0, Math.PI * 2);
  ctx.fill();

  // Đèn pha gắn bên thái dương mũ
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-1, -55, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 6. Cánh Tay Trước + Cầu Vai + Súng Quét Lượng Tử Cầm Tay (Quantum Tricorder)
  // Cầu vai (Shoulder Pauldron)
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = visorTheme.main;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, -37, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 5.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -36);
  ctx.lineTo(11 + armSwing * 0.4, -28);
  ctx.stroke();

  // Thiết bị quét cầm tay (Scanner Gun)
  const gx = 12 + armSwing * 0.4;
  const gy = -28;
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = visorTheme.main;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(gx - 1, gy - 3, 8, 5, 1.5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = visorTheme.main;
  ctx.beginPath();
  ctx.arc(gx + 7.5, gy - 0.5, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ============================================================================
// 6. VẼ BÀN CHIẾT QUANG LASER 5x5 BẰNG VECTOR HARDWARE ĐỘNG (KHÔNG DÙNG EMOJI)
// ============================================================================

function drawOpticsInteractiveCanvas(opticsTrace, frame) {
  const canvas = document.getElementById('opticsCanvas');
  if (!canvas || !opticsTrace) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cellSize = w / 5;

  ctx.clearRect(0, 0, w, h);

  // Nền bo mạch quang học lượng tử sâu
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7);
  bgGrad.addColorStop(0, '#09152e');
  bgGrad.addColorStop(1, '#030712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Vẽ lưới ô quang học có chấm góc kỹ thuật
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const x = c * cellSize;
      const y = r * cellSize;
      ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(15, 23, 42, 0.35)' : 'rgba(8, 14, 30, 0.35)';
      ctx.fillRect(x + 3, y + 3, cellSize - 6, cellSize - 6);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 3, y + 3, cellSize - 6, cellSize - 6);
    }
  }

  const colorMap = {
    RED: { core: '#ffe4e6', glow: '#f43f5e' },
    BLUE: { core: '#e0f2fe', glow: '#38bdf8' },
    VIOLET: { core: '#fae8ff', glow: '#c084fc' }
  };

  // Vẽ các tia Laser + Hạt Photon chạy dọc chùm tia
  for (let idx = 0; idx < opticsTrace.segments.length; idx++) {
    const seg = opticsTrace.segments[idx];
    const x1 = (seg.from.c + 0.5) * cellSize;
    const y1 = (seg.from.r + 0.5) * cellSize;
    const x2 = (seg.to.c + 0.5) * cellSize;
    const y2 = (seg.to.r + 0.5) * cellSize;
    const col = colorMap[seg.color] || colorMap.BLUE;

    ctx.save();
    ctx.strokeStyle = col.glow;
    ctx.lineWidth = 7.5;
    ctx.shadowColor = col.glow;
    ctx.shadowBlur = 15;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.strokeStyle = col.core;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Hạt photon di chuyển dọc tia
    const t = ((frame * 0.04 + idx * 0.23) % 1);
    const px = x1 + (x2 - x1) * t;
    const py = y1 + (y2 - y1) * t;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Vẽ các linh kiện phần cứng Vector trên từng ô 5x5
  for (const cell of opticsTrace.gridCells) {
    const cx = (cell.c + 0.5) * cellSize;
    const cy = (cell.r + 0.5) * cellSize;

    ctx.save();
    ctx.translate(cx, cy);

    if (cell.rotatable) {
      // Đế Gương Xoay Cơ-Lượng Tử (M1..M5)
      ctx.fillStyle = 'rgba(8, 47, 73, 0.55)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-cellSize * 0.39, -cellSize * 0.39, cellSize * 0.78, cellSize * 0.78, 9);
      ctx.fill();
      ctx.stroke();

      // Vòng xoay cơ khí bên trong
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -2, 16, 0, Math.PI * 2);
      ctx.stroke();

      // Mặt Gương Phản Xạ Vàng Kim Phát Sáng
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      if (cell.mirrorState === '/') {
        ctx.moveTo(-14, 12);
        ctx.lineTo(14, -16);
      } else if (cell.mirrorState === '\\') {
        ctx.moveTo(-14, -16);
        ctx.lineTo(14, 12);
      } else {
        ctx.moveTo(-16, -7);
        ctx.lineTo(16, -7);
        ctx.moveTo(-16, 3);
        ctx.lineTo(16, 3);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 9.5px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(cell.label.replace('Gương ', ''), 0, cellSize * 0.34);
    } else if (cell.type === 'EMITTER_RED' || cell.type === 'EMITTER_BLUE') {
      const isRed = cell.type === 'EMITTER_RED';
      const eCol = isRed ? '#f43f5e' : '#38bdf8';
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = eCol;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-18, -14, 30, 22, 5);
      ctx.fill();
      ctx.stroke();

      // Thấu kính phóng tia bên phải
      ctx.fillStyle = eCol;
      ctx.shadowColor = eCol;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(12, -3, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 8.5px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(isRed ? 'PHÁT ĐỎ' : 'PHÁT LAM', 0, cellSize * 0.35);
    } else if (cell.type === 'SPLITTER') {
      // Khối Tinh Thể Tách Tia Bán Mạ
      ctx.save();
      ctx.translate(0, -3);
      ctx.strokeStyle = '#94a3b8';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(14, 0);
      ctx.lineTo(0, 14);
      ctx.lineTo(-14, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.lineTo(10, 10);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 8.5px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TÁCH TIA', 0, cellSize * 0.35);
    } else if (cell.type === 'COMBINER') {
      // Tinh Thể Thạch Anh Hội Tụ Tím (2,2)
      const active = opticsTrace.violetGenerated;
      ctx.save();
      ctx.translate(0, -3);
      ctx.rotate(frame * (active ? 0.04 : 0.012));
      ctx.fillStyle = active ? 'rgba(192, 132, 252, 0.45)' : 'rgba(168, 85, 247, 0.18)';
      ctx.strokeStyle = active ? '#f5d0fe' : '#a855f7';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = active ? 16 : 6;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const r = i % 2 === 0 ? 15 : 9;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#e9d5ff';
      ctx.font = 'bold 8.5px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('HỘI TỤ', 0, cellSize * 0.35);
    } else if (cell.type === 'HAZARD_CORE') {
      // Lõi Phản Vật Chất Nguy Hiểm (0,3)
      const hit = opticsTrace.hazardCoreHit;
      const hCol = hit ? '#ef4444' : '#f59e0b';
      ctx.save();
      ctx.translate(0, -3);
      ctx.rotate(-frame * 0.03);
      ctx.strokeStyle = hCol;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = hCol;
      ctx.shadowColor = hCol;
      ctx.shadowBlur = hit ? 18 : 8;
      ctx.beginPath();
      ctx.arc(0, 0, hit ? 7.5 : 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = hit ? '#fca5a5' : '#fde68a';
      ctx.font = 'bold 8.5px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LÕI BẤT ỔN', 0, cellSize * 0.35);
    } else if (
      cell.type === 'SENSOR_RED' ||
      cell.type === 'SENSOR_BLUE' ||
      cell.type === 'SENSOR_VIOLET'
    ) {
      const sConf =
        cell.type === 'SENSOR_RED'
          ? { col: '#f43f5e', on: opticsTrace.sensors.alphaRed, name: 'CẢM BIẾN α' }
          : cell.type === 'SENSOR_BLUE'
          ? { col: '#38bdf8', on: opticsTrace.sensors.betaBlue, name: 'CẢM BIẾN β' }
          : { col: '#c084fc', on: opticsTrace.sensors.gammaViolet, name: 'CẢM BIẾN γ' };

      ctx.save();
      ctx.translate(0, -3);
      ctx.strokeStyle = sConf.on ? '#10b981' : sConf.col;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = sConf.on ? sConf.col : 'rgba(15, 23, 42, 0.9)';
      ctx.shadowColor = sConf.col;
      ctx.shadowBlur = sConf.on ? 16 : 0;
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = sConf.on ? '#6ee7b7' : '#cbd5e1';
      ctx.font = 'bold 8.5px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(sConf.name, 0, cellSize * 0.35);
    }

    ctx.restore();
  }
}

// ============================================================================
// 7. VẼ CƠ QUAN TINH BÀN 3 VÒNG ĐỒNG TÂM BẰNG GYROSCOPE ĐỘNG 60FPS
// ============================================================================

function drawAstrolabeInteractiveCanvas(campaign, session, frame) {
  const canvas = document.getElementById('astrolabeCanvas');
  if (!canvas || !campaign || !session) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  ctx.clearRect(0, 0, w, h);

  // 1. Nền Vũ Trụ Tinh Bàn & Lưới Cung Hoàng Đạo 12 Góc (0°..330°)
  const bg = ctx.createRadialGradient(cx, cy, 8, cx, cy, w * 0.5);
  bg.addColorStop(0, '#131c3d');
  bg.addColorStop(0.65, '#060b1d');
  bg.addColorStop(1, '#02050e');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.49, 0, Math.PI * 2);
  ctx.fill();

  // Vòng chia độ vàng đồng / cyan ngoài cùng
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.47, 0, Math.PI * 2);
  ctx.stroke();

  for (let deg = 0; deg < 360; deg += 30) {
    const rad = ((deg - 90) * Math.PI) / 180;
    const x1 = cx + Math.cos(rad) * 28;
    const y1 = cy + Math.sin(rad) * 28;
    const x2 = cx + Math.cos(rad) * (w * 0.46);
    const y2 = cy + Math.sin(rad) * (w * 0.46);

    ctx.strokeStyle = deg % 90 === 0 ? 'rgba(56, 189, 248, 0.22)' : 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Nhãn số độ quanh vành ngoài
    const lx = cx + Math.cos(rad) * (w * 0.425);
    const ly = cy + Math.sin(rad) * (w * 0.425);
    ctx.font = 'bold 8.5px Consolas, monospace';
    ctx.fillStyle = 'rgba(186, 230, 253, 0.65)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${deg}°`, lx, ly);
  }

  const cfg = campaign.astrolabeConfig;
  const st = session.astrolabeState;

  const ringSpecs = [
    { radius: 94, angle: st.outerAngle, target: cfg.targetOuter, color: '#a855f7' },
    { radius: 67, angle: st.middleAngle, target: cfg.targetMiddle, color: '#facc15' },
    { radius: 41, angle: st.innerAngle, target: cfg.targetInner, color: '#38bdf8' }
  ];

  // 2. Tâm Dị Điểm Mắt Ouroboros ở chính giữa Tinh Bàn
  const allMatched = ringSpecs.every((r) => r.angle === r.target);
  const coreGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 26);
  coreGlow.addColorStop(0, '#ffffff');
  coreGlow.addColorStop(0.4, allMatched ? '#10b981' : '#38bdf8');
  coreGlow.addColorStop(0.75, 'rgba(168, 85, 247, 0.35)');
  coreGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, 26 + Math.sin(frame * 0.08) * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#030712';
  ctx.strokeStyle = allMatched ? '#34d399' : '#bae6fd';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 3. Vẽ 3 Vòng Đĩa Cơ-Lượng Tử Đồng Tâm
  for (const r of ringSpecs) {
    const matched = r.angle === r.target;
    const activeCol = matched ? '#10b981' : r.color;

    // Vành đĩa chính
    ctx.save();
    ctx.strokeStyle = activeCol;
    ctx.lineWidth = matched ? 3.5 : 2.4;
    ctx.shadowColor = activeCol;
    ctx.shadowBlur = matched ? 12 : 5;
    ctx.beginPath();
    ctx.arc(cx, cy, r.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Vành phụ nét đứt xoay nhẹ
    ctx.strokeStyle = activeCol + '55';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, r.radius - 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ổ Khóa Mục Tiêu (Target Socket)
    const targetRad = ((r.target - 90) * Math.PI) / 180;
    const tx = cx + Math.cos(targetRad) * r.radius;
    const ty = cy + Math.sin(targetRad) * r.radius;

    ctx.strokeStyle = matched ? '#34d399' : 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(tx, ty, 8.5, 0, Math.PI * 2);
    ctx.stroke();

    // Viên Ngọc Định Vị Đang Xoay (Current Node)
    const rad = ((r.angle - 90) * Math.PI) / 180;
    const px = cx + Math.cos(rad) * r.radius;
    const py = cy + Math.sin(rad) * r.radius;

    if (matched) {
      // Tia năng lượng khóa vào Tâm Dị Điểm khi khớp góc
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.65)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();
    }

    ctx.fillStyle = matched ? '#34d399' : r.color;
    ctx.shadowColor = activeCol;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

window.ChronoGraphics = {
  playerState,
  sectorBgImages,
  ambientParticles,
  SECTOR_ECHO_GHOSTS,
  initPlayerControls,
  updatePlayerPhysics,
  drawDeepSpaceAndSingularity,
  drawSciFiRoomArchitecture,
  drawQuantumEchoProjection,
  drawAirlockPortals,
  drawCustomHotspotProp,
  drawAstronautAndFlashlight,
  drawOpticsInteractiveCanvas,
  drawAstrolabeInteractiveCanvas
};
