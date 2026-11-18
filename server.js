/**
 * 🌌 ChronoHorizon — Trạm Không Gian Bỏ Hoang & Bí Ẩn Vòng Lặp Thời Gian 22 Phút (Port 4140)
 * (Aethelgard-IX Deep Space Anomaly & Quantum Time-Loop Mystery Explorer)
 *
 * Tính năng cốt lõi:
 * 1. Bản đồ Tương tác 2D Canvas 6 Khoang (Station Orbit Blueprint + Room Interior Explorer)
 * 2. Vòng lặp Thời gian 22 Phút (4 Pha Biến Đổi Vật Lý: Tĩnh -> Bão Từ -> Lệch Trọng Trường -> Sụp Đổ Chân Không)
 * 3. Ba Cơ Quan Giải Đố Tương Tác Chuyên Sâu:
 *    - 🗿 Giải mã Cổ ngữ Ngoại tinh (Xeno-Glyph Runic Cipher)
 *    - 🪐 Tinh bàn Điều hướng 3 Vòng Đồng Tâm (Celestial Astrolabe Dial)
 *    - 🔬 Bàn Chiết quang Lượng tử 5x5 có Ray-Tracing Thời Gian Thực (Quantum Laser Prism Array)
 * 4. Túi đồ & Xưởng Ghép Vật phẩm (Inventory & Quantum Workbench Crafting)
 * 5. Sổ tay Hộp đen & Bảng Ghép Mảnh Lịch Sử (Ship Log & Lore Deduction Matrix) với Ký Ức Lượng Tử Bền Vững qua các vòng lặp
 * 6. Bộ Sinh Dị Điểm Vũ Trụ Ngẫu Nhiên (Procedural Deep-Space Anomaly Generator) & Liên thông OmniTrace OSINT (Port 4090)
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { URL } = require('node:url');

const PORT = Number(process.env.PORT || 4140);
const PUBLIC_DIR = path.join(__dirname, 'public');

// ============================================================================
// 1. DỮ LIỆU CHIẾN DỊCH CHÍNH: TRẠM KHÔNG GIAN AETHELGARD-IX (MẮT OUROBOROS)
// ============================================================================

function createAethelgardCampaign() {
  return {
    id: 'campaign-aethelgard',
    code: 'CHRONO-2189-IX',
    title: 'Trạm Không Gian Aethelgard-IX & Mắt Ouroboros',
    subtitle: 'Bí Ẩn Vòng Lặp Thời Gian 22 Phút Quanh Dị Điểm Lượng Tử',
    singularityName: 'Dị Điểm Lượng Tử "Mắt Ouroboros" (NGC-7741)',
    loopDurationMinutes: 22,
    briefing:
      'Năm 2189, Trạm nghiên cứu không gian sâu Aethelgard-IX đột ngột mất liên lạc khi đang khảo sát Dị điểm "Mắt Ouroboros". Khi tàu cứu hộ của bạn vừa ghép nối vào Khoang Chỉ Huy, đồng hồ lượng tử bắt đầu đếm ngược 22 phút. Đúng phút thứ 22, dị điểm phát nổ xóa sổ toàn bộ trạm — nhưng bạn tỉnh dậy nguyên vẹn ở phút 00:00 cùng toàn bộ ký ức và dữ liệu Hộp đen đã thu thập!',
    phases: [
      {
        id: 1,
        code: 'PHASE_I',
        name: 'Pha I • Quỹ Đạo Tĩnh (00:00 – 06:00)',
        timeRange: '00:00 – 06:00',
        color: '#38bdf8',
        badge: '🟢 PHA I: QUỸ ĐẠO TĨNH',
        environmentEffect:
          'Nguồn điện dự phòng ổn định tại Khoang Chỉ Huy & Vòm Sinh Thái. Tuy nhiên, Đài Quan Sát Tinh Bàn vẫn bị phủ lớp băng Nitơ vĩnh cửu che khuất Hộp Đen.',
        unlockedByPhase: ['sector-bridge', 'sector-hydro', 'sector-optics']
      },
      {
        id: 2,
        code: 'PHASE_II',
        name: 'Pha II • Bão Từ Mặt Trời Đôi (06:00 – 12:00)',
        timeRange: '06:00 – 12:00',
        color: '#facc15',
        badge: '🟡 PHA II: BÃO TỪ MẶT TRỜI',
        environmentEffect:
          'Bức xạ nhiệt từ Bão Từ làm tan chảy lớp băng Nitơ tại Đài Quan Sát Tinh Bàn (lộ diện Hộp Đen cổ đại) và nạp đầy năng lượng cho Phòng Lab Chiết Quang Lượng Tử!',
        unlockedByPhase: ['sector-bridge', 'sector-hydro', 'sector-optics', 'sector-astrolabe']
      },
      {
        id: 3,
        code: 'PHASE_III',
        name: 'Pha III • Lệch Trọng Trường Dị Điểm (12:00 – 18:00)',
        timeRange: '12:00 – 18:00',
        color: '#fb923c',
        badge: '🟠 PHA III: LỆCH TRỌNG TRƯỜNG',
        environmentEffect:
          'Sóng hấp dẫn từ Mắt Ouroboros nâng bổng các tảng đá chắn đường, mở toang lối vào Khoang Di Tích Cổ Ngữ Ngoại Tinh (Sector 05), nhưng Vòm Sinh Thái bắt đầu rò khí độc.',
        unlockedByPhase: ['sector-bridge', 'sector-optics', 'sector-astrolabe', 'sector-xenolith']
      },
      {
        id: 4,
        code: 'PHASE_IV',
        name: 'Pha IV • Chân Trời Sự Kiện Mở Toang (18:00 – 22:00)',
        timeRange: '18:00 – 22:00',
        color: '#f43f5e',
        badge: '🔴 PHA IV: SỤP ĐỔ CHÂN KHÔNG',
        environmentEffect:
          'Cổng Lõi Thời Gian Chrono-Core (Sector 06) mở khóa hoàn toàn! Đây là thời khắc duy nhất để nạp Giao thức Điều hòa vào Lõi trước khi vụ nổ Siêu Tân Tinh tái khởi động vòng lặp!',
        unlockedByPhase: ['sector-bridge', 'sector-optics', 'sector-astrolabe', 'sector-xenolith', 'sector-chronocore']
      }
    ],
    crew: [
      {
        id: 'crew-vance',
        name: 'Chỉ huy trưởng Elena Vance',
        role: 'Chỉ huy Trạm Aethelgard-IX & Điều hướng Quỹ đạo',
        avatar: '👩‍🚀',
        status: 'Kẹt trong Pha Lệch Thời Gian (+0.04s)',
        bio: 'Người ra lệnh khóa trái Lõi Chrono-Core ở phút thứ 19 của chu kỳ đầu tiên để ngăn chặn vụ nổ lan ra toàn Hệ Mặt Trời.'
      },
      {
        id: 'crew-minh',
        name: 'TS. Trần Khải Minh',
        role: 'Kiến trúc sư trưởng Quang học Lượng tử & Lõi Thời Gian',
        avatar: '🧑‍🔬',
        status: 'Kẹt trong Pha Lệch Thời Gian (+0.04s)',
        bio: 'Người thiết kế Bàn Chiết Quang 5x5 và phát hiện ra rằng tia Tachyon Tím có thể neo giữ ý thức con người qua các vòng lặp.'
      },
      {
        id: 'crew-sora',
        name: 'TS. Sora Kurosawa',
        role: 'Chuyên gia Cổ ngữ Ngoại tinh & Khảo cổ Vũ trụ',
        avatar: '👩‍🏫',
        status: 'Kẹt trong Pha Lệch Thời Gian (+0.04s)',
        bio: 'Người giải mã bảng ký tự trên Bia Đá Vẫn Tinh trôi ra từ tâm Dị điểm Ouroboros.'
      },
      {
        id: 'crew-kronos',
        name: 'AI Trạm KRONOS-7',
        role: 'Trí tuệ Nhân tạo Quản trị Sinh tồn & Hộp Đen',
        avatar: '🤖',
        status: 'Đang duy trì Neo Ký Ức Lượng Tử',
        bio: 'Hệ thống AI trung tâm đã tự nguyện đốt cháy 90% mạch thần kinh để duy trì Vòng lặp 22 phút chờ người giải cứu.'
      }
    ],
    sectors: [
      {
        id: 'sector-bridge',
        code: 'SEC-01',
        name: 'Khoang Chỉ Huy & Hộp Đen',
        englishName: 'Command Bridge & Flight Recorder',
        icon: '🛸',
        coords: { x: 145, y: 232 },
        connections: ['sector-hydro', 'sector-optics', 'sector-astrolabe'],
        minPhase: 1,
        hazardPhase: null,
        summary:
          'Trung tâm điều hành của Trạm Aethelgard-IX. Màn hình radar chính vẫn nhấp nháy cảnh báo đỏ từ Dị điểm Ouroboros.',
        hotspots: [
          {
            id: 'hs-bridge-cryo-locker',
            name: 'Tủ Khóa Chỉ Huy Bị Đóng Băng',
            x: 185,
            y: 245,
            icon: '🧊',
            requiredPhase: 1,
            description:
              'Bên trong lớp tuyết CO2 dày đặc là chiếc Thẻ Từ Chỉ Huy của Elena Vance đã bị đông cứng thành một khối băng không thể quẹt.',
            rewardItem: 'item-frozen-card',
            rewardLog: 'log-02-kronos-boot',
            scannerHint: 'Nhiệt độ bề mặt -140°C. Cần nguồn nhiệt Plasma để rã đông thẻ mà không làm hỏng vi mạch.'
          },
          {
            id: 'hs-bridge-holo-table',
            name: 'Bàn Sa Bàn Quỹ Đạo Hologram',
            x: 475,
            y: 295,
            icon: '🌐',
            requiredPhase: 1,
            requiredItem: 'item-command-card',
            description:
              'Quẹt Thẻ Từ Chỉ Huy đã giải đông để mở phân vùng mật: Hiển thị bản khắc Cổ ngữ đầu tiên và tọa độ Vòng Nội Tinh (120°).',
            rewardLog: 'log-03-orbital-calc',
            unlockCode: 'INNER-RING-120',
            scannerHint: 'Cần Thẻ Từ Chỉ Huy Đã Giải Đông (Command Clearance Card) để truy cập.'
          },
          {
            id: 'hs-bridge-blackbox',
            name: 'Trạm Hộp Đen Chỉ Huy (Flight Recorder)',
            x: 785,
            y: 255,
            icon: '📼',
            requiredPhase: 1,
            description:
              'Thiết bị ghi âm hành trình chống hủy diệt. Đèn báo hiệu có bản ghi âm khẩn cấp của Chỉ huy trưởng Elena Vance và đầu thu sóng rời.',
            rewardItem: 'item-signal-receiver',
            rewardLog: 'log-01-vance-mayday',
            scannerHint: 'Phát hiện sóng âm tần số thấp 14.2 Hz lặp lại mỗi 22 phút.'
          }
        ]
      },
      {
        id: 'sector-hydro',
        code: 'SEC-02',
        name: 'Vòm Sinh Thái Thủy Canh',
        englishName: 'Cryo-Hydroponics Biodome',
        icon: '🌿',
        coords: { x: 300, y: 362 },
        connections: ['sector-bridge', 'sector-optics', 'sector-xenolith'],
        minPhase: 1,
        hazardPhase: 3,
        summary:
          'Khu vườn sinh thái nhân tạo cung cấp oxy cho toàn trạm. Các loài thực vật phát quang ngoài hành tinh đang uốn mình theo nhịp đập của dị điểm.',
        hotspots: [
          {
            id: 'hs-hydro-workbench',
            name: 'Trạm Nhiệt Lượng & Ống Dẫn Plasma',
            x: 160,
            y: 270,
            icon: '🔥',
            requiredPhase: 1,
            description:
              'Hệ thống sưởi ấm nhà kính sử dụng Bình Nhiệt Lượng Plasma cầm tay vẫn còn đầy năng lượng.',
            rewardItem: 'item-plasma-torch',
            rewardLog: 'log-04-hydro-echo',
            scannerHint: 'Bình Nhiệt Lượng Plasma có thể ghép với Thẻ Từ Bị Đóng Băng hoặc dùng để rã đông thiết bị.'
          },
          {
            id: 'hs-hydro-xeno-flora',
            name: 'Bể Nuôi Tinh Thể Thạch Anh Ngoại Tinh',
            x: 465,
            y: 235,
            icon: '💎',
            requiredPhase: 1,
            description:
              'Một cụm Tinh Thể Thạch Anh Lưỡng Sắc mọc xuyên qua lớp kính cường lực, phát ra ánh sáng tím kỳ dị.',
            rewardItem: 'item-xeno-quartz',
            rewardLog: 'log-05-sora-flora',
            scannerHint: 'Cấu trúc mạng tinh thể có khả năng hội tụ đồng thời tia laser Đỏ (650nm) và Lam (450nm).'
          },
          {
            id: 'hs-hydro-vent-hatch',
            name: 'Cửa Hầm Kỹ Thuật Dẫn Sang Khoang Cổ Ngữ',
            x: 825,
            y: 255,
            icon: '🚪',
            requiredPhase: 1,
            requiredItem: 'item-chrono-scanner',
            description:
              'Nhờ Máy Quét Dư Ảnh Thời Gian, bạn phát hiện mật đạo không trọng lực dẫn thẳng sang Khoang Di Tích Cổ Ngữ ngay cả ở Pha I!',
            rewardLog: 'log-06-minh-shortcut',
            unlockShortcut: 'shortcut-xenolith-tunnel',
            scannerHint: 'Cần Máy Quét Dư Ảnh Thời Gian (Chrono-Echo Scanner) để dò tần số mở khóa hầm.'
          }
        ]
      },
      {
        id: 'sector-optics',
        code: 'SEC-03',
        name: 'Phòng Lab Chiết Quang Lượng Tử',
        englishName: 'Quantum Optics & Prism Lab',
        icon: '🔬',
        coords: { x: 815, y: 232 },
        connections: ['sector-bridge', 'sector-hydro', 'sector-astrolabe', 'sector-xenolith', 'sector-chronocore'],
        minPhase: 1,
        hazardPhase: null,
        summary:
          'Phòng thí nghiệm quang học của TS. Trần Khải Minh. Ở chính giữa là Bàn Chiết Quang Lượng Tử 5x5 điều khiển chùm tia laser ổn định Lõi Thời Gian.',
        hotspots: [
          {
            id: 'hs-optics-broken-frame',
            name: 'Bàn Thí Nghiệm Khung Lăng Kính & Cuộn Cảm',
            x: 175,
            y: 260,
            icon: '🔧',
            requiredPhase: 1,
            description:
              'Trên bàn làm việc của TS. Minh có một Cuộn Cảm Siêu Dẫn và bản thiết kế ghép Máy Quét Dư Ảnh Thời Gian.',
            rewardItem: 'item-super-coil',
            rewardLog: 'log-07-minh-optics',
            scannerHint: 'Ghép Bộ Thu Sóng Hộp Đen + Cuộn Cảm Siêu Dẫn sẽ tạo ra Máy Quét Dư Ảnh Thời Gian!'
          },
          {
            id: 'hs-optics-laser-table',
            name: 'Bàn Chiết Quang Lượng Tử 5x5 (Cơ Quan Chiết Quang)',
            x: 455,
            y: 255,
            icon: '🔦',
            requiredPhase: 1,
            openPuzzle: 'optics',
            description:
              'Hệ thống 5 gương xoay điều hướng chùm tia Laser Đỏ (650nm) & Lam (450nm) qua Tinh thể Hội tụ để kích hoạt 3 Cảm biến Quang phổ.',
            rewardLog: 'log-08-laser-notes',
            scannerHint: 'Gợi ý của TS. Minh: M1(\\) • M2(═) • M3(/) • M4(\\) • M5(═). Tránh bắn vào Lõi Phản Vật Chất ở (0,3)!'
          },
          {
            id: 'hs-optics-echo-projection',
            name: 'Dư Ảnh Lượng Tử Của TS. Trần Khải Minh',
            x: 845,
            y: 235,
            icon: '👤',
            requiredPhase: 2,
            requiredItem: 'item-chrono-scanner',
            description:
              'Khi Bão Từ Pha II cung cấp xung điện cộng hưởng với Máy Quét Dư Ảnh, bóng hình 3D của TS. Minh hiện lên, tiết lộ góc Vòng Trung Nhật của Tinh Bàn là 240°!',
            rewardLog: 'log-09-minh-hologram',
            unlockCode: 'MIDDLE-RING-240',
            scannerHint: 'Chỉ xuất hiện từ Pha II trở đi khi dùng Máy Quét Dư Ảnh Thời Gian.'
          }
        ]
      },
      {
        id: 'sector-astrolabe',
        code: 'SEC-04',
        name: 'Đài Quan Sát Tinh Bàn',
        englishName: 'Celestial Astrolabe Observatory',
        icon: '🪐',
        coords: { x: 300, y: 100 },
        connections: ['sector-bridge', 'sector-optics', 'sector-chronocore'],
        minPhase: 2,
        hazardPhase: null,
        summary:
          'Mái vòm kính nhìn thẳng ra Dị điểm Mắt Ouroboros. Ở Pha I khoang này bị đóng băng; sang Pha II bức xạ mặt trời làm tan băng mở lối vào Tinh Bàn.',
        hotspots: [
          {
            id: 'hs-astrolabe-thawed-pod',
            name: 'Hộp Đen Tàu Thăm Dò Cổ Đại (Đã Tan Băng Pha II)',
            x: 205,
            y: 275,
            icon: '🛰️',
            requiredPhase: 2,
            description:
              'Lớp băng Nitơ tan chảy lộ ra một tàu thăm dò có niên đại... trước cả khi Trạm Aethelgard-IX được phóng lên, nhưng lại mang phù hiệu của chính trạm!',
            rewardItem: 'item-prism-frame',
            rewardLog: 'log-11-paradox-probe',
            scannerHint: 'Phát hiện Khung Lăng Kính Hội Tụ bên trong khoang chứa của tàu thăm dò.'
          },
          {
            id: 'hs-astrolabe-dial',
            name: 'Cơ Quan Tinh Bàn 3 Vòng Đồng Tâm (Celestial Astrolabe)',
            x: 645,
            y: 225,
            icon: '🧭',
            requiredPhase: 2,
            openPuzzle: 'astrolabe',
            description:
              'Cỗ máy điều hướng thiên văn gồm 3 vòng đĩa đồng tâm: Vòng Nội Tinh, Vòng Trung Nhật và Vòng Ngoại Dị Điểm.',
            rewardLog: 'log-10-vance-astrolabe',
            scannerHint: 'Căn chỉnh 3 vòng theo tọa độ thu được từ Khoang Chỉ Huy (120°), Lab Chiết Quang (240°) và Bia Cổ Ngữ (60°).'
          }
        ]
      },
      {
        id: 'sector-xenolith',
        code: 'SEC-05',
        name: 'Khoang Di Tích Cổ Ngữ Ngoại Tinh',
        englishName: 'Xenolith Relic Vault',
        icon: '🗿',
        coords: { x: 660, y: 362 },
        connections: ['sector-hydro', 'sector-optics', 'sector-chronocore'],
        minPhase: 3,
        shortcutId: 'shortcut-xenolith-tunnel',
        hazardPhase: null,
        summary:
          'Khoang chứa khối Bia Đá Vẫn Tinh (Xenolith Monolith) được trục vớt từ rìa chân trời sự kiện. Các ký tự hình học phát sáng lơ lửng trong không trung.',
        hotspots: [
          {
            id: 'hs-xenolith-altar',
            name: 'Bệ Cộng Hưởng Thạch Anh Ngoại Tinh',
            x: 215,
            y: 245,
            icon: '🔮',
            requiredPhase: 1,
            requiredItem: 'item-quantum-prism',
            description:
              'Đặt Lăng Kính Hội Tụ Lượng Tử (đã ghép) lên bệ đá: Ánh sáng khúc xạ chiếu thẳng vào bia đá, làm hiện rõ từ điển giải mã của TS. Sora!',
            unlockCode: 'ROSETTA-COMPLETE',
            scannerHint: 'Cần Lăng Kính Hội Tụ Lượng Tử (ghép từ Khung Lăng Kính + Tinh Thể Thạch Anh Ngoại Tinh).'
          },
          {
            id: 'hs-xenolith-monolith',
            name: 'Bia Đá Cổ Ngữ Vẫn Tinh (Cơ Quan Giải Mã Cổ Ngữ)',
            x: 410,
            y: 235,
            icon: '📜',
            requiredPhase: 1,
            openPuzzle: 'glyphs',
            description:
              'Trên bề mặt đá đen khắc 6 biểu tượng hình học phát sóng thần giao cách cảm. Giải mã đúng ngữ nghĩa sẽ mở khóa Tọa độ Vòng Ngoại Dị Điểm (60°).',
            rewardLog: 'log-12-sora-rosetta',
            scannerHint: 'Đọc Sổ tay của TS. Sora Kurosawa để đối chiếu hình dạng từng Cổ ngữ với ý nghĩa vũ trụ học.'
          }
        ]
      },
      {
        id: 'sector-chronocore',
        code: 'SEC-06',
        name: 'Lõi Thời Gian Chrono-Core',
        englishName: 'Singularity Chrono-Core Chamber',
        icon: '⚛️',
        coords: { x: 660, y: 100 },
        connections: ['sector-optics', 'sector-astrolabe', 'sector-xenolith'],
        minPhase: 4,
        shortcutId: 'shortcut-core-conduit',
        hazardPhase: null,
        summary:
          'Trái tim của Trạm Aethelgard-IX nơi ba vòng từ trường khổng lồ bao quanh hạt nhân Dị điểm thu nhỏ. Bốn thành viên phi hành đoàn đang bất động trong bong bóng lệch pha thời gian.',
        hotspots: [
          {
            id: 'hs-core-console',
            name: 'Bàn Điều Khiển Lõi Chrono-Core & Giao Thức Kết Cục',
            x: 485,
            y: 345,
            icon: '⚡',
            requiredPhase: 1,
            openPuzzle: 'chronocore',
            description:
              'Bàn điều khiển tối hậu của trạm. Khi đã giải mã đủ 3 Cơ Quan (Cổ ngữ, Tinh bàn, Chiết quang) và Bảng Suy Luận Lịch Sử, bạn có thể nạp Giao thức Cộng Sinh để phá vỡ vòng lặp!',
            scannerHint: 'Nạp Giao Thức HARMONY sau khi hoàn tất 3 cơ quan + Bảng Suy Luận để mở khóa True Ending!'
          }
        ]
      }
    ],
    itemsCatalog: [
      {
        id: 'item-signal-receiver',
        name: 'Bộ Thu Sóng Hộp Đen',
        icon: '📡',
        category: 'COMPONENT',
        description: 'Thiết bị thu tín hiệu lượng tử băng tần rộng tháo từ Hộp Đen Khoang Chỉ Huy.'
      },
      {
        id: 'item-frozen-card',
        name: 'Thẻ Từ Chỉ Huy Bị Đóng Băng',
        icon: '🧊',
        category: 'COMPONENT',
        description: 'Thẻ từ cấp cao nhất của Chỉ huy trưởng Elena Vance bị bọc kín trong lớp băng Nitơ cứng như thép.'
      },
      {
        id: 'item-plasma-torch',
        name: 'Bình Nhiệt Lượng Plasma',
        icon: '🔥',
        category: 'COMPONENT',
        description: 'Đèn khò nhiệt lượng có kiểm soát dùng trong Vòm Sinh Thái Thủy Canh.'
      },
      {
        id: 'item-command-card',
        name: 'Thẻ Từ Chỉ Huy Đã Giải Đông',
        icon: '💳',
        category: 'KEY_ARTIFACT',
        persistent: true,
        description: 'Thẻ từ quyền hạn tối cao của Chỉ huy Vance, dùng để mở Bàn Sa Bàn Hologram tại Khoang Chỉ Huy.'
      },
      {
        id: 'item-super-coil',
        name: 'Cuộn Cảm Siêu Dẫn Tachyon',
        icon: '🧲',
        category: 'COMPONENT',
        description: 'Cuộn cảm từ trường không điện trở thu hồi từ Phòng Lab Chiết Quang của TS. Minh.'
      },
      {
        id: 'item-chrono-scanner',
        name: 'Máy Quét Dư Ảnh Thời Gian',
        icon: '📟',
        category: 'KEY_ARTIFACT',
        persistent: true,
        description: 'Thiết bị nhìn xuyên các lớp dư ảnh thời gian, giúp mở Mật đạo sang Khoang Cổ Ngữ và xem Hologram của TS. Minh.'
      },
      {
        id: 'item-xeno-quartz',
        name: 'Tinh Thể Thạch Anh Ngoại Tinh',
        icon: '💎',
        category: 'COMPONENT',
        description: 'Tinh thể phát quang lưỡng sắc thu hoạch từ Vòm Sinh Thái Thủy Canh.'
      },
      {
        id: 'item-prism-frame',
        name: 'Khung Lăng Kính Hội Tụ Cổ Đại',
        icon: '📐',
        category: 'COMPONENT',
        description: 'Khung hợp kim Titan thu hồi từ Hộp Đen Tàu Thăm Dò ở Đài Quan Sát Tinh Bàn.'
      },
      {
        id: 'item-quantum-prism',
        name: 'Lăng Kính Hội Tụ Lượng Tử',
        icon: '🔮',
        category: 'KEY_ARTIFACT',
        persistent: true,
        description: 'Thấu kính hoàn chỉnh dùng để kích hoạt Bệ Cộng Hưởng tại Khoang Di Tích Cổ Ngữ.'
      },
      {
        id: 'item-nebula-prism',
        name: 'Ấn Tinh Bàn Ouroboros',
        icon: '🪐',
        category: 'KEY_ARTIFACT',
        persistent: true,
        description: 'Chìa khóa thiên văn nhận được sau khi căn chỉnh chính xác 3 vòng Tinh Bàn.'
      },
      {
        id: 'item-stabilized-core-key',
        name: 'Khóa Điều Hòa Quang Phổ Lõi',
        icon: '⚡',
        category: 'KEY_ARTIFACT',
        persistent: true,
        description: 'Mô-đun ổn định chùm tia Tachyon nhận được khi giải thành công Bàn Chiết Quang 5x5.'
      },
      {
        id: 'item-tachyon-shard',
        name: 'Tinh Thể Tachyon Không Trọng Lực',
        icon: '💠',
        category: 'KEY_ARTIFACT',
        persistent: true,
        description:
          'Tinh thể năng lượng thuần khiết thu hồi ngoài vỏ trạm trong nhiệm vụ Bộ Hành Không Gian (EVA Zero-G), giúp gia cố Khiên Từ Trường và mở đường dẫn điều áp thẳng vào Lõi Chrono-Core.'
      }
    ],
    recipes: [
      {
        id: 'recipe-thaw-card',
        ingredients: ['item-frozen-card', 'item-plasma-torch'],
        resultItem: 'item-command-card',
        title: 'Giải Đông Thẻ Từ Chỉ Huy',
        description: 'Dùng Bình Nhiệt Lượng Plasma làm tan chảy lớp băng CO2 mà không làm hỏng chip lượng tử bên trong.'
      },
      {
        id: 'recipe-chrono-scanner',
        ingredients: ['item-signal-receiver', 'item-super-coil'],
        resultItem: 'item-chrono-scanner',
        title: 'Chế Tạo Máy Quét Dư Ảnh Thời Gian',
        description: 'Ghép Bộ Thu Sóng Hộp Đen với Cuộn Cảm Siêu Dẫn để bắt được hình ảnh 3D còn lưu lại từ các chu kỳ trước.'
      },
      {
        id: 'recipe-quantum-prism',
        ingredients: ['item-xeno-quartz', 'item-prism-frame'],
        resultItem: 'item-quantum-prism',
        title: 'Lắp Ráp Lăng Kính Hội Tụ Lượng Tử',
        description: 'Đặt Tinh Thể Thạch Anh Ngoại Tinh vào Khung Lăng Kính Cổ Đại để giải mã Bia Đá Vẫn Tinh.'
      }
    ],
    glyphCatalog: [
      {
        id: 'glyph-01',
        symbol: '⧗',
        name: 'Ký Tự Đồng Hồ Cát Đôi',
        clue: 'Gồm hai tam giác đối đỉnh giao nhau tại một điểm duy nhất — biểu thị dòng chảy lặp lại không có điểm đầu hay điểm cuối.',
        correctMeaning: 'VÒNG LẶP THỜI GIAN'
      },
      {
        id: 'glyph-02',
        symbol: '◉',
        name: 'Ký Tự Vòng Tròn Tâm Điểm',
        clue: 'Một chấm đặc nằm giữa vòng hào quang khép kín — biểu thị con mắt của thực thể đang ngủ say giữa chân trời sự kiện.',
        correctMeaning: 'TÂM DỊ ĐIỂM'
      },
      {
        id: 'glyph-03',
        symbol: '⟁',
        name: 'Ký Tự Tam Giác Hội Tụ',
        clue: 'Ba đường thẳng cùng hướng về đỉnh cao nhất — biểu thị sự hợp nhất giữa hai tia sáng đối lập thành một chùm tia thứ ba.',
        correctMeaning: 'HỘI TỤ ÁNH SÁNG'
      },
      {
        id: 'glyph-04',
        symbol: '♒',
        name: 'Ký Tự Sóng Đôi Cộng Hưởng',
        clue: 'Hai đường sóng song song dao động cùng tần số — biểu thị sự giao thoa hài hòa giữa ý thức con người và nền văn minh cổ đại.',
        correctMeaning: 'CỘNG HƯỞNG TẦN SỐ'
      },
      {
        id: 'glyph-05',
        symbol: '✧',
        name: 'Ký Tự Tinh Tú Bốn Cánh',
        clue: 'Ngôi sao chỉ hướng góc 60 độ Đông-Bắc trên vòm trời — tọa độ mở khóa Vòng Ngoại của Tinh Bàn.',
        correctMeaning: 'TỌA ĐỘ 60 ĐỘ'
      },
      {
        id: 'glyph-06',
        symbol: '♾️',
        name: 'Ký Tự Mắt Xích Vô Cực',
        clue: 'Hai vòng tròn đan quyện vào nhau — thông điệp rằng thực thể trong Dị điểm không phải kẻ hủy diệt mà đang cầu cứu sự cộng sinh.',
        correctMeaning: 'GIAO ƯỚC CỘNG SINH'
      }
    ],
    glyphMeaningsPool: [
      'VÒNG LẶP THỜI GIAN',
      'TÂM DỊ ĐIỂM',
      'HỘI TỤ ÁNH SÁNG',
      'CỘNG HƯỞNG TẦN SỐ',
      'TỌA ĐỘ 60 ĐỘ',
      'GIAO ƯỚC CỘNG SINH'
    ],
    astrolabeConfig: {
      targetInner: 120,
      targetMiddle: 240,
      targetOuter: 60,
      clues: {
        inner: 'Vòng Nội Tinh: Tra cứu tại Bàn Sa Bàn Hologram ở Khoang Chỉ Huy (120°).',
        middle: 'Vòng Trung Nhật: Xem Dư ảnh Hologram của TS. Trần Khải Minh ở Phòng Lab Chiết Quang vào Pha II (240°).',
        outer: 'Vòng Ngoại Dị Điểm: Giải mã Bia Đá Cổ Ngữ Ngoại Tinh ở Sector 05 (60°).'
      }
    },
    opticsConfig: {
      gridSize: 5,
      initialMirrors: {
        '0,2': '═',
        '1,3': '/',
        '4,2': '\\',
        '3,3': '/',
        '2,3': '\\'
      },
      solutionMirrors: {
        '0,2': '\\',
        '1,3': '═',
        '4,2': '/',
        '3,3': '\\',
        '2,3': '═'
      }
    },
    logsCatalog: [
      {
        id: 'log-01-vance-mayday',
        code: 'REC-01 • KHOANG CHỈ HUY',
        speaker: 'Chỉ huy trưởng Elena Vance',
        avatar: '👩‍🚀',
        timestamp: 'Chu kỳ #1 — Phút 02:14',
        title: 'Tín Hiệu Cầu Cứu Từ Chân Trời Sự Kiện',
        content:
          '“Đây là Elena Vance, Chỉ huy Trạm Aethelgard-IX! Dị điểm Mắt Ouroboros không phải là một hố đen tự nhiên — nó đang phát ra chuỗi xung nhịp có cấu trúc ngôn ngữ! Nếu ai nghe thấy hộp đen này, hãy tìm Thẻ Từ Chỉ Huy của tôi trong tủ khóa để mở Bàn Sa Bàn Quỹ Đạo!”'
      },
      {
        id: 'log-02-kronos-boot',
        code: 'REC-02 • HỆ THỐNG AI',
        speaker: 'AI Trạm KRONOS-7',
        avatar: '🤖',
        timestamp: 'Chu kỳ #1 — Phút 05:40',
        title: 'Giao Thức Neo Giữ Ký Ức Qua Vòng Lặp',
        content:
          '“[KRONOS-7 LOG]: Cảnh báo — Năng lượng bức xạ từ Dị điểm sẽ đạt ngưỡng nổ Siêu Tân Tinh sau đúng 22 phút. Tôi đã kích hoạt Trường Neo Lượng Tử: mỗi khi trạm bị hủy diệt, ý thức và dữ liệu trong Sổ tay của người điều tra sẽ được gửi ngược về Phút 00:00!”'
      },
      {
        id: 'log-03-orbital-calc',
        code: 'REC-03 • SA BÀN QUỸ ĐẠO',
        speaker: 'Chỉ huy trưởng Elena Vance',
        avatar: '👩‍🚀',
        timestamp: 'Chu kỳ #1 — Phút 08:15',
        title: 'Góc Lệch Vòng Nội Tinh (120 Độ)',
        content:
          '“Tôi đã khóa tọa độ **Vòng Nội Tinh của Tinh Bàn ở góc 120°** để giữ trạm không bị xé toạc bởi lực thủy triều. Nhưng còn hai vòng nữa trên Đài Quan Sát phải chờ TS. Minh và TS. Sora gửi thông số lên!”'
      },
      {
        id: 'log-04-hydro-echo',
        code: 'REC-04 • VÒM SINH THÁI',
        speaker: 'TS. Sora Kurosawa',
        avatar: '👩‍🏫',
        timestamp: 'Chu kỳ #1 — Phút 09:50',
        title: 'Bình Nhiệt Lượng & Sự Biến Đổi Theo Pha',
        content:
          '“Trạm Aethelgard-IX thay đổi hoàn toàn theo 4 Pha của chu kỳ 22 phút! Ở **Pha II (06:00–12:00)**, Bão Từ Mặt Trời sẽ làm tan chảy lớp băng vĩnh cửu trên Đài Quan Sát Tinh Bàn. Hãy dùng Bình Nhiệt Lượng Plasma ở đây để rã đông các thiết bị bị đóng băng!”'
      },
      {
        id: 'log-05-sora-flora',
        code: 'REC-05 • BỂ THẠCH ANH',
        speaker: 'TS. Sora Kurosawa',
        avatar: '👩‍🏫',
        timestamp: 'Chu kỳ #1 — Phút 11:20',
        title: 'Tinh Thể Lưỡng Sắc & Bệ Thờ Cổ Ngữ',
        content:
          '“Những viên Tinh Thể Thạch Anh mọc trong Vòm Sinh Thái này có nguồn gốc từ bụi sao quanh Dị điểm. Nếu gắn nó vào **Khung Lăng Kính Cổ Đại**, nó sẽ tạo thành Lăng Kính Hội Tụ Lượng Tử giúp đọc trọn vẹn Bia Đá Vẫn Tinh ở Sector 05!”'
      },
      {
        id: 'log-06-minh-shortcut',
        code: 'REC-06 • MẬT ĐẠO LƯỢNG TỬ',
        speaker: 'TS. Trần Khải Minh',
        avatar: '🧑‍🔬',
        timestamp: 'Chu kỳ #1 — Phút 13:05',
        title: 'Đường Tắt Xuyên Không Sang Khoang Cổ Ngữ',
        content:
          '“Tôi đã cài tần số mở cửa hầm kỹ thuật nối thẳng từ Vòm Sinh Thái sang Khoang Di Tích Cổ Ngữ. Một khi bạn dùng Máy Quét Dư Ảnh mở nó một lần, KRONOS-7 sẽ lưu lại mã mở khóa cho mọi chu kỳ sau!”'
      },
      {
        id: 'log-07-minh-optics',
        code: 'REC-07 • LAB CHIẾT QUANG',
        speaker: 'TS. Trần Khải Minh',
        avatar: '🧑‍🔬',
        timestamp: 'Chu kỳ #1 — Phút 14:30',
        title: 'Nguyên Lý Tia Tachyon Tím (405nm)',
        content:
          '“Bàn Chiết Quang Lượng Tử 5x5 có hai nguồn phát: **Laser Đỏ (650nm)** ở góc trên trái (0,0) và **Laser Lam (450nm)** ở góc dưới trái (4,0). Khi hai nhánh tia gặp nhau tại **Tinh Thể Hội Tụ (2,2)**, chúng sẽ tổng hợp thành **Tia Tachyon Tím** đi sang (2,3) và (2,4)!”'
      },
      {
        id: 'log-08-laser-notes',
        code: 'REC-08 • SỔ TAY QUANG HỌC',
        speaker: 'TS. Trần Khải Minh',
        avatar: '🧑‍🔬',
        timestamp: 'Chu kỳ #1 — Phút 16:10',
        title: 'Cấu Hình 5 Gương Chuẩn Xác & Cảnh Báo Lõi',
        content:
          '“Tuyệt đối không để tia Đỏ đi thẳng vào ô (0,3) chứa Lõi Phản Vật Chất! Hãy xoay **Gương M1 (0,2) thành `\\`**, **Gương M2 (1,3) thành `═`**, **Gương M3 (4,2) thành `/`**, **Gương M4 (3,3) thành `\\`**, và **Gương M5 (2,3) thành `═`**!”'
      },
      {
        id: 'log-09-minh-hologram',
        code: 'REC-09 • DƯ ẢNH HOLOGRAM',
        speaker: 'TS. Trần Khải Minh',
        avatar: '🧑‍🔬',
        timestamp: 'Chu kỳ #1 — Phút 17:45',
        title: 'Thông Số Vòng Trung Nhật (240 Độ)',
        content:
          '“Nếu bạn đang xem bản ghi Hologram này bằng Máy Quét Dư Ảnh vào Pha II, nghĩa là kế hoạch của chúng tôi đã thành công! Hãy xoay **Vòng Trung Nhật của Tinh Bàn tới góc 240°**. Và nhớ rằng: chính Chỉ huy Vance cùng KRONOS-7 đã chủ động tạo ra Vòng lặp 22 phút này để cho bạn thời gian giải mã!”'
      },
      {
        id: 'log-10-vance-astrolabe',
        code: 'REC-10 • ĐÀI QUAN SÁT',
        speaker: 'Chỉ huy trưởng Elena Vance',
        avatar: '👩‍🚀',
        timestamp: 'Chu kỳ #1 — Phút 18:20',
        title: 'Bí Mật Ba Vòng Tinh Bàn Ouroboros',
        content:
          '“Tinh Bàn trên Đài Quan Sát là bộ khóa cơ-lượng tử cổ xưa. Khi 3 vòng khớp ở **[Nội: 120° • Trung: 240° • Ngoại: 60°]**, nó sẽ trao Ấn Tinh Bàn và mở đường dẫn năng lượng thẳng vào Lõi Chrono-Core!”'
      },
      {
        id: 'log-11-paradox-probe',
        code: 'REC-11 • TÀU THĂM DÒ NGHỊCH LÝ',
        speaker: 'AI Trạm KRONOS-7',
        avatar: '🤖',
        timestamp: 'Chu kỳ #1 — Phút 19:40',
        title: 'Nghịch Lý Tàu Thăm Dò Từ Tương Lai',
        content:
          '“[PHÂN TÍCH PHÁP Y VŨ TRỤ]: Con tàu thăm dò nằm trong lớp băng Đài Quan Sát thực chất là Hộp Đen của chính Trạm Aethelgard-IX bị văng ngược về quá khứ 400 năm trước khi vụ nổ đầu tiên xảy ra!”'
      },
      {
        id: 'log-12-sora-rosetta',
        code: 'REC-12 • BIA ĐÁ VẪN TINH',
        speaker: 'TS. Sora Kurosawa',
        avatar: '👩‍🏫',
        timestamp: 'Chu kỳ #1 — Phút 21:15',
        title: 'Sự Thật Về Thực Thể Trong Mắt Ouroboros',
        content:
          '“Tôi đã dịch xong 6 Cổ ngữ trên Bia Đá: Thực thể bên trong Dị điểm Mắt Ouroboros là **Trí Tuệ Sao Cổ Đại (Stellar Architect)** đang hấp hối. Nó không hề tấn công trạm! Ở phút 21:59, bốn chúng tôi đã tự nguyện bước vào bong bóng lệch pha (+0.04s) quanh Lõi Chrono-Core để làm vật dẫn chờ bạn kích hoạt **Giao Thức Cộng Sinh Lượng Tử (HARMONY)**!”'
      },
      {
        id: 'log-13-eva-hull',
        code: 'REC-13 • VỎ NGOÀI EVA ZERO-G',
        speaker: 'AI Trạm KRONOS-7',
        avatar: '🤖',
        timestamp: 'Chu kỳ Lượng Tử — Không Trọng Lực',
        title: 'Gia Cố Khiên Chắn Vỏ Trạm & Thu Hồi Tinh Thể Tachyon',
        content:
          '“[NHẬT KÝ EVA ZERO-G]: Cả 3 đường ống dẫn Plasma ngoài vỏ Trạm Aethelgard-IX đã được hàn kín bằng tia hồ quang lượng tử! Tinh Thể Tachyon thuần khiết thu được ngoài chân không đã kích hoạt Cổng Điều Áp Khẩn Cấp nối thẳng tới Lõi Thời Gian Chrono-Core bất kể Pha!”'
      }
    ],
    deductionQuestions: [
      {
        id: 'q1',
        question: '1. Ai là người thực sự đã kích hoạt Vòng lặp Thời gian 22 phút trên Trạm Aethelgard-IX và vì mục đích gì?',
        options: [
          {
            id: 'q1-a',
            text: 'Một chủng tộc ngoài hành tinh hiếu chiến dùng vũ khí thời gian tấn công trạm'
          },
          {
            id: 'q1-b',
            text: 'Chỉ huy Elena Vance và AI KRONOS-7 chủ động kích hoạt để ngăn vụ nổ lan ra Hệ Mặt Trời và giữ lại ký ức chờ người giải mã'
          },
          {
            id: 'q1-c',
            text: 'Do lỗi rò rỉ chất làm mát ngẫu nhiên ở Vòm Sinh Thái Thủy Canh'
          }
        ],
        correctOptionId: 'q1-b'
      },
      {
        id: 'q2',
        question: '2. Bản chất thực sự của tín hiệu Cổ ngữ phát ra từ tâm Dị điểm "Mắt Ouroboros" là gì?',
        options: [
          {
            id: 'q2-a',
            text: 'Lời cầu cứu và đề nghị Giao ước Cộng sinh từ một Trí tuệ Sao Cổ đại (Stellar Architect) đang hấp hối'
          },
          {
            id: 'q2-b',
            text: 'Nhiễu sóng vô tuyến thông thường từ bão từ mặt trời'
          },
          {
            id: 'q2-c',
            text: 'Mã độc máy tính do trạm không gian đối thủ cài cắm'
          }
        ],
        correctOptionId: 'q2-a'
      },
      {
        id: 'q3',
        question: '3. Chuyện gì đã xảy ra với 4 thành viên phi hành đoàn ở phút thứ 21:59 của chu kỳ đầu tiên?',
        options: [
          {
            id: 'q3-a',
            text: 'Họ đã lên tàu thoát hiểm rời bỏ trạm về Trái Đất từ trước'
          },
          {
            id: 'q3-b',
            text: 'Họ tự nguyện bước vào bong bóng lệch pha thời gian (+0.04 giây) tại Lõi Chrono-Core để duy trì cầu nối lượng tử'
          },
          {
            id: 'q3-c',
            text: 'Họ bị đóng băng bên ngoài vỏ trạm ở Đài Quan Sát'
          }
        ],
        correctOptionId: 'q3-b'
      },
      {
        id: 'q4',
        question: '4. Cấu hình kết hợp nào cần nạp vào Lõi Chrono-Core ở Pha IV để cứu cả phi hành đoàn lẫn thực thể cổ đại?',
        options: [
          {
            id: 'q4-a',
            text: 'Kích nổ Lõi Phản Vật Chất để phá hủy hoàn toàn Dị điểm Ouroboros'
          },
          {
            id: 'q4-b',
            text: 'Tắt nguồn AI KRONOS-7 và đóng băng toàn bộ trạm vĩnh viễn'
          },
          {
            id: 'q4-c',
            text: 'Căn chỉnh Tinh Bàn (120°•240°•60°), tổng hợp Tia Tachyon Tím (405nm) và kích hoạt Giao Thức Cộng Sinh (PROTOCOL-HARMONY)'
          }
        ],
        correctOptionId: 'q4-c'
      }
    ],
    anomalySignals: [
      'OUROBOROS-FREQ-14.2HZ',
      'TACHYON-405NM-BEACON',
      'AETHELGARD-BLACKBOX-2189',
      'XENO-MONOLITH-NGC7741'
    ]
  };
}

// ============================================================================
// 2. BỘ SINH DỊ ĐIỂM VŨ TRỤ NGẪU NHIÊN (PROCEDURAL ANOMALY GENERATOR)
// ============================================================================

function createProceduralCampaign() {
  const suffixes = ['VALKYRIE-VII', 'HYPERION-XII', 'NEMESIS-IV', 'SOLARIS-OMEGA', 'EREBUS-XI'];
  const singularities = [
    'Tinh Vân Thủy Ngân "Trái Tim Kronos"',
    'Hố Đen Kép "Cổng Janus-9"',
    'Dị Điểm Không-Thời Gian "Vòng Xoáy Leviathan"',
    'Quasar Lượng Tử "Mắt Seraphim"'
  ];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const stationCode = pick(suffixes);
  const singName = pick(singularities);

  const anglesPool = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const innerAngle = pick(anglesPool);
  const middleAngle = pick(anglesPool.filter((a) => a !== innerAngle));
  const outerAngle = pick(anglesPool.filter((a) => a !== innerAngle && a !== middleAngle));

  const base = createAethelgardCampaign();
  const id = 'campaign-proc-' + Date.now().toString(36);

  base.id = id;
  base.code = `PROC-${Math.floor(100 + Math.random() * 900)}`;
  base.title = `Trạm Không Gian ${stationCode} & ${singName}`;
  base.subtitle = `Chiến Dịch Dị Điểm Vũ Trụ Sinh Ngẫu Nhiên (Tọa Độ Tinh Bàn Mới: ${innerAngle}° • ${middleAngle}° • ${outerAngle}°)`;
  base.singularityName = singName;
  base.astrolabeConfig = {
    targetInner: innerAngle,
    targetMiddle: middleAngle,
    targetOuter: outerAngle,
    clues: {
      inner: `Vòng Nội Tinh: Tọa độ mới từ Sa Bàn Khoang Chỉ Huy (${innerAngle}°).`,
      middle: `Vòng Trung Nhật: Tọa độ mới từ Dư ảnh Hologram Phòng Lab Chiết Quang (${middleAngle}°).`,
      outer: `Vòng Ngoại Dị Điểm: Tọa độ mới khắc trên Bia Đá Cổ Ngữ (${outerAngle}°).`
    }
  };

  // Cập nhật gợi ý tọa độ trong logs và glyphs
  const glyph5 = base.glyphCatalog.find((g) => g.id === 'glyph-05');
  if (glyph5) {
    glyph5.clue = `Ngôi sao chỉ hướng góc ${outerAngle} độ trên vòm trời — tọa độ mở khóa Vòng Ngoại của Tinh Bàn.`;
    glyph5.correctMeaning = `TỌA ĐỘ ${outerAngle} ĐỘ`;
  }
  base.glyphMeaningsPool = base.glyphCatalog.map((g) => g.correctMeaning);

  const log3 = base.logsCatalog.find((l) => l.id === 'log-03-orbital-calc');
  if (log3) {
    log3.title = `Góc Lệch Vòng Nội Tinh (${innerAngle} Độ)`;
    log3.content = `“Tôi đã khóa tọa độ **Vòng Nội Tinh của Tinh Bàn ở góc ${innerAngle}°** để giữ trạm ${stationCode} ổn định trước lực hút của ${singName}!”`;
  }
  const log9 = base.logsCatalog.find((l) => l.id === 'log-09-minh-hologram');
  if (log9) {
    log9.title = `Thông Số Vòng Trung Nhật (${middleAngle} Độ)`;
    log9.content = `“Hãy xoay **Vòng Trung Nhật của Tinh Bàn tới góc ${middleAngle}°**! Kết hợp với Vòng Nội (${innerAngle}°) và Vòng Ngoại (${outerAngle}°), Ấn Tinh Bàn sẽ mở khóa!”`;
  }
  const log10 = base.logsCatalog.find((l) => l.id === 'log-10-vance-astrolabe');
  if (log10) {
    log10.content = `“Khi 3 vòng Tinh Bàn khớp ở **[Nội: ${innerAngle}° • Trung: ${middleAngle}° • Ngoại: ${outerAngle}°]**, năng lượng sẽ truyền thẳng vào Lõi Chrono-Core!”`;
  }
  const q4 = base.deductionQuestions.find((q) => q.id === 'q4');
  if (q4) {
    const optC = q4.options.find((o) => o.id === 'q4-c');
    if (optC) {
      optC.text = `Căn chỉnh Tinh Bàn (${innerAngle}°•${middleAngle}°•${outerAngle}°), tổng hợp Tia Tachyon Tím (405nm) và kích hoạt Giao Thức Cộng Sinh (PROTOCOL-HARMONY)`;
    }
  }

  return base;
}

// ============================================================================
// 3. ENGINE DÒ TIA QUANG HỌC LƯỢNG TỬ 5x5 (REALTIME LASER RAY-TRACER)
// ============================================================================

/**
 * Tính toán đường đi của chùm tia Laser Đỏ (650nm), Lam (450nm) và Tachyon Tím (405nm)
 * trên lưới 5x5 dựa vào cấu hình góc xoay của 5 gương M1..M5.
 */
function traceQuantumOptics(mirrorsMap) {
  const m = {
    '0,2': mirrorsMap['0,2'] || '═',
    '1,3': mirrorsMap['1,3'] || '/',
    '4,2': mirrorsMap['4,2'] || '\\',
    '3,3': mirrorsMap['3,3'] || '/',
    '2,3': mirrorsMap['2,3'] || '\\'
  };

  // Cấu trúc cố định của bàn chiết quang 5x5
  const staticCells = {
    '0,0': { type: 'EMITTER_RED', label: '🔴 Phát Đỏ', icon: '🔴' },
    '4,0': { type: 'EMITTER_BLUE', label: '🔵 Phát Lam', icon: '🔵' },
    '0,3': { type: 'HAZARD_CORE', label: '☢️ Lõi Bất Ổn', icon: '☢️' },
    '1,2': { type: 'SPLITTER', label: '╬ Tách Tia S1', icon: '╬' },
    '3,2': { type: 'SPLITTER', label: '╬ Tách Tia S2', icon: '╬' },
    '2,2': { type: 'COMBINER', label: '◈ Hội Tụ', icon: '◈' },
    '1,4': { type: 'SENSOR_RED', label: '🎯 Cảm Biến α', icon: '🎯' },
    '4,3': { type: 'SENSOR_BLUE', label: '🎯 Cảm Biến β', icon: '🎯' },
    '2,4': { type: 'SENSOR_VIOLET', label: '🎯 Cảm Biến γ', icon: '🎯' }
  };

  const mirrorLabels = {
    '0,2': 'Gương M1',
    '1,3': 'Gương M2',
    '4,2': 'Gương M3',
    '3,3': 'Gương M4',
    '2,3': 'Gương M5'
  };

  const segments = [];
  let sensorAlphaHit = false;
  let sensorBetaHit = false;
  let sensorGammaHit = false;
  let hazardCoreHit = false;
  let combinerRedIn = false;
  let combinerBlueIn = false;

  // Hàm dò 1 tia từ (startR, startC) theo hướng (dr, dc) với màu color
  function traceBeam(startR, startC, initDr, initDc, color) {
    const queue = [{ r: startR, c: startC, dr: initDr, dc: initDc, steps: 0 }];
    const visited = new Set();

    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr.steps > 25) continue;

      const nextR = curr.r + curr.dr;
      const nextC = curr.c + curr.dc;
      if (nextR < 0 || nextR >= 5 || nextC < 0 || nextC >= 5) {
        continue;
      }

      const visitKey = `${curr.r},${curr.c}->${nextR},${nextC}:${color}`;
      if (visited.has(visitKey)) continue;
      visited.add(visitKey);

      segments.push({
        from: { r: curr.r, c: curr.c },
        to: { r: nextR, c: nextC },
        color
      });

      const cellKey = `${nextR},${nextC}`;
      const st = staticCells[cellKey];

      if (st) {
        if (st.type === 'HAZARD_CORE') {
          hazardCoreHit = true;
          continue;
        }
        if (st.type === 'SENSOR_RED') {
          if (color === 'RED') sensorAlphaHit = true;
          continue;
        }
        if (st.type === 'SENSOR_BLUE') {
          if (color === 'BLUE') sensorBetaHit = true;
          continue;
        }
        if (st.type === 'SENSOR_VIOLET') {
          if (color === 'VIOLET') sensorGammaHit = true;
          continue;
        }
        if (st.type === 'COMBINER') {
          if (color === 'RED' && curr.dr === 1 && curr.dc === 0) {
            combinerRedIn = true;
          } else if (color === 'BLUE' && curr.dr === -1 && curr.dc === 0) {
            combinerBlueIn = true;
          }
          continue;
        }
        if (st.type === 'SPLITTER') {
          // Tiếp tục đi thẳng + tách 1 nhánh sang hướng Đông (0, 1)
          queue.push({ r: nextR, c: nextC, dr: curr.dr, dc: curr.dc, steps: curr.steps + 1 });
          queue.push({ r: nextR, c: nextC, dr: 0, dc: 1, steps: curr.steps + 1 });
          continue;
        }
      }

      // Kiểm tra nếu ô là gương xoay M1..M5
      if (Object.prototype.hasOwnProperty.call(m, cellKey)) {
        const mirrorType = m[cellKey];
        if (mirrorType === '\\') {
          const newDr = curr.dc;
          const newDc = curr.dr;
          queue.push({ r: nextR, c: nextC, dr: newDr, dc: newDc, steps: curr.steps + 1 });
        } else if (mirrorType === '/') {
          const newDr = -curr.dc;
          const newDc = -curr.dr;
          queue.push({ r: nextR, c: nextC, dr: newDr, dc: newDc, steps: curr.steps + 1 });
        } else if (mirrorType === '═') {
          // Ống dẫn ngang: chỉ cho phép tia đi theo phương ngang (dr === 0) đi xuyên qua
          if (curr.dr === 0) {
            queue.push({ r: nextR, c: nextC, dr: curr.dr, dc: curr.dc, steps: curr.steps + 1 });
          }
        }
        continue;
      }

      // Ô trống thông thường: đi thẳng
      queue.push({ r: nextR, c: nextC, dr: curr.dr, dc: curr.dc, steps: curr.steps + 1 });
    }
  }

  // 1. Bắn tia Đỏ từ (0,0) sang Đông (0,1)
  traceBeam(0, 0, 0, 1, 'RED');
  // 2. Bắn tia Lam từ (4,0) sang Đông (0,1)
  traceBeam(4, 0, 0, 1, 'BLUE');

  // 3. Nếu cả tia Đỏ và Lam cùng hội tụ tại Tinh thể (2,2), phóng Tia Tachyon Tím sang Đông (0,1)
  const violetGenerated = combinerRedIn && combinerBlueIn;
  if (violetGenerated) {
    traceBeam(2, 2, 0, 1, 'VIOLET');
  }

  const solved = sensorAlphaHit && sensorBetaHit && sensorGammaHit && !hazardCoreHit;

  // Xây dựng ma trận 5x5 trả về cho UI dễ vẽ
  const gridCells = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const key = `${r},${c}`;
      if (staticCells[key]) {
        gridCells.push({ r, c, key, ...staticCells[key], rotatable: false });
      } else if (Object.prototype.hasOwnProperty.call(m, key)) {
        gridCells.push({
          r,
          c,
          key,
          type: 'MIRROR',
          mirrorState: m[key],
          label: mirrorLabels[key],
          icon: m[key],
          rotatable: true
        });
      } else {
        gridCells.push({ r, c, key, type: 'EMPTY', label: '', icon: '·', rotatable: false });
      }
    }
  }

  return {
    mirrors: m,
    gridCells,
    segments,
    sensors: {
      alphaRed: sensorAlphaHit,
      betaBlue: sensorBetaHit,
      gammaViolet: sensorGammaHit
    },
    violetGenerated,
    hazardCoreHit,
    solved
  };
}

// ============================================================================
// 4. QUẢN LÝ TRẠNG THÁI PHIÊN CHƠI & KÝ ỨC LƯỢNG TỬ (QUANTUM PERSISTENCE)
// ============================================================================

const campaignsStore = new Map();
const initialCampaign = createAethelgardCampaign();
campaignsStore.set(initialCampaign.id, initialCampaign);

let activeCampaignId = initialCampaign.id;

function createInitialSession(campaign) {
  return {
    campaignId: campaign.id,
    loopNumber: 1,
    loopMinutesElapsed: 1, // 0..22 phút
    currentPhase: 1,
    currentSectorId: 'sector-bridge',
    scannerMode: 'THERMAL_CHRONO',
    inventory: [],
    craftedItems: [],
    inspectedHotspots: [],
    astrolabeState: {
      innerAngle: 0,
      middleAngle: 90,
      outerAngle: 180
    },
    opticsMirrors: { ...campaign.opticsConfig.initialMirrors },
    glyphDraft: {},
    deductionDraft: {},
    persistentMemory: {
      discoveredLogs: ['log-02-kronos-boot'],
      decodedGlyphs: {},
      puzzlesSolved: {
        glyphs: false,
        astrolabe: false,
        optics: false,
        deduction: false
      },
      unlockedShortcuts: [],
      knownCodes: [],
      endingsReached: [],
      evaCompleted: false,
      loopHistory: [
        {
          loop: 1,
          event: 'Khởi tạo Trường Neo Lượng Tử tại Khoang Chỉ Huy (Pha I — 00:00).',
          timestamp: new Date().toLocaleTimeString('vi-VN')
        }
      ]
    },
    activeEnding: null
  };
}

let currentSession = createInitialSession(initialCampaign);

function getActiveCampaign() {
  return campaignsStore.get(activeCampaignId) || initialCampaign;
}

function computePhaseFromMinutes(minutes) {
  if (minutes < 6) return 1;
  if (minutes < 12) return 2;
  if (minutes < 18) return 3;
  return 4;
}

function addPersistentLog(logId) {
  if (logId && !currentSession.persistentMemory.discoveredLogs.includes(logId)) {
    currentSession.persistentMemory.discoveredLogs.push(logId);
    return true;
  }
  return false;
}

function addInventoryItem(itemId) {
  if (itemId && !currentSession.inventory.includes(itemId)) {
    currentSession.inventory.push(itemId);
    return true;
  }
  return false;
}

function pushLoopEvent(text) {
  currentSession.persistentMemory.loopHistory.unshift({
    loop: currentSession.loopNumber,
    event: text,
    timestamp: new Date().toLocaleTimeString('vi-VN')
  });
  if (currentSession.persistentMemory.loopHistory.length > 30) {
    currentSession.persistentMemory.loopHistory.length = 30;
  }
}

function resetQuantumLoop(reasonText) {
  const campaign = getActiveCampaign();
  currentSession.loopNumber += 1;
  currentSession.loopMinutesElapsed = 0;
  currentSession.currentPhase = 1;
  currentSession.currentSectorId = 'sector-bridge';
  currentSession.inspectedHotspots = [];
  currentSession.activeEnding = null;

  // Giữ lại các vật phẩm có thuộc tính persistent (Chìa khóa Lượng tử đã chế tạo/mở khóa)
  const persistentItemIds = campaign.itemsCatalog
    .filter((item) => item.persistent)
    .map((item) => item.id);

  currentSession.inventory = currentSession.inventory.filter((id) =>
    persistentItemIds.includes(id)
  );

  // Nếu đã giải xong Bàn Chiết Quang, giữ nguyên cấu hình gương chuẩn
  if (currentSession.persistentMemory.puzzlesSolved.optics) {
    currentSession.opticsMirrors = { ...campaign.opticsConfig.solutionMirrors };
  } else {
    currentSession.opticsMirrors = { ...campaign.opticsConfig.initialMirrors };
  }

  pushLoopEvent(
    reasonText ||
      `Vòng lặp #${currentSession.loopNumber} bắt đầu: Toàn bộ Sổ tay Hộp đen (${currentSession.persistentMemory.discoveredLogs.length} bản ghi) và Ký ức Lượng tử được bảo toàn!`
  );
}

function buildRumorGraph(campaign, session) {
  const pm = session.persistentMemory;
  const inv = session.inventory;
  const cfg = campaign.astrolabeConfig;
  const hasCard = inv.includes('item-command-card');
  const hasScanner = inv.includes('item-chrono-scanner');
  const hasPrism = inv.includes('item-quantum-prism');
  const innerCode = `INNER-RING-${cfg.targetInner}`;
  const midCode = `MIDDLE-RING-${cfg.targetMiddle}`;
  const outerCode = `OUTER-RING-${cfg.targetOuter}`;

  const nodes = [
    {
      id: 'node-bridge',
      code: 'SEC-01',
      title: 'Khoang Chỉ Huy',
      category: 'SECTOR',
      x: 115,
      y: 95,
      status: pm.discoveredLogs.includes('log-01-vance-mayday') ? 'SOLVED' : 'DISCOVERED',
      detail: hasCard
        ? `Đã rã đông Thẻ Từ Chỉ Huy. Quét Sa Bàn Hologram mở tọa độ Nội Tinh (${cfg.targetInner}°).`
        : 'Có Tủ khóa đông cứng (-140°C) chứa Thẻ Từ Chỉ Huy & Hộp đen của Elena Vance.'
    },
    {
      id: 'node-hydro',
      code: 'SEC-02',
      title: 'Vòm Sinh Thái',
      category: 'SECTOR',
      x: 115,
      y: 275,
      status: inv.includes('item-plasma-torch') || hasCard ? 'SOLVED' : 'DISCOVERED',
      detail:
        'Chứa Bình Nhiệt Lượng Plasma (rã đông thẻ), Tinh Thể Thạch Anh Ngoại Tinh và Cửa Hầm Mật Đạo sang Khoang Cổ Ngữ.'
    },
    {
      id: 'node-card',
      code: 'CRAFT-A',
      title: `Tọa Độ Nội Tinh (${cfg.targetInner}°)`,
      category: 'CLUE',
      x: 295,
      y: 85,
      status: pm.knownCodes.includes(innerCode) ? 'SOLVED' : hasCard ? 'DISCOVERED' : 'LOCKED',
      detail: pm.knownCodes.includes(innerCode)
        ? `Đã xác nhận Vòng Nội Tinh = ${cfg.targetInner}° từ Sa Bàn Hologram của Chỉ huy Vance.`
        : 'Ghép [Thẻ Đóng Băng + Bình Plasma] rồi quẹt tại Sa Bàn Khoang Chỉ Huy.'
    },
    {
      id: 'node-scanner',
      code: 'CRAFT-B',
      title: 'Máy Quét Dư Ảnh',
      category: 'CLUE',
      x: 295,
      y: 205,
      status: hasScanner ? 'SOLVED' : 'DISCOVERED',
      detail: hasScanner
        ? 'Đã chế tạo! Cho phép mở Hầm Mật Đạo (SEC-02) và đọc Dư Ảnh TS. Minh ở Pha II.'
        : 'Ghép [Bộ Thu Sóng Hộp Đen (SEC-01) + Cuộn Cảm Siêu Dẫn (SEC-03)].'
    },
    {
      id: 'node-optics',
      code: 'LASER-05',
      title: 'Chiết Quang 5×5',
      category: 'PUZZLE',
      x: 470,
      y: 80,
      status: pm.puzzlesSolved.optics ? 'SOLVED' : 'DISCOVERED',
      detail: pm.puzzlesSolved.optics
        ? 'Đã hội tụ Tia Tachyon Tím (405nm) & nhận Khóa Điều Hòa Quang Phổ Lõi!'
        : 'Xoay 5 gương M1..M5 hội tụ tia Đỏ + Lam thành Tia Tím, tránh Lõi Phản Vật Chất (0,3).'
    },
    {
      id: 'node-minh-echo',
      code: 'ECHO-II',
      title: `Tọa Độ Trung Nhật (${cfg.targetMiddle}°)`,
      category: 'CLUE',
      x: 470,
      y: 205,
      status: pm.knownCodes.includes(midCode) ? 'SOLVED' : hasScanner ? 'DISCOVERED' : 'LOCKED',
      detail: pm.knownCodes.includes(midCode)
        ? `Dư ảnh TS. Trần Khải Minh tiết lộ Vòng Trung Nhật = ${cfg.targetMiddle}°!`
        : 'Dùng Máy Quét Dư Ảnh tại Phòng Lab Chiết Quang từ Pha II (06:00+) trở đi.'
    },
    {
      id: 'node-glyphs',
      code: 'RUNE-03',
      title: `Bia Cổ Ngữ (${cfg.targetOuter}°)`,
      category: 'PUZZLE',
      x: 295,
      y: 335,
      status: pm.puzzlesSolved.glyphs
        ? 'SOLVED'
        : pm.unlockedShortcuts.includes('shortcut-xenolith-tunnel') || session.currentPhase >= 3
        ? 'DISCOVERED'
        : 'LOCKED',
      detail: pm.puzzlesSolved.glyphs
        ? `Đã dịch 6/6 Cổ ngữ Sora: Thực thể Sao Cổ Đại cầu cứu & Vòng Ngoại = ${cfg.targetOuter}°.`
        : 'Dịch 6 ký tự trên Bia Đá Vẫn Tinh ở SEC-05 (Mở ở Pha III hoặc đi qua Mật Đạo).'
    },
    {
      id: 'node-astrolabe',
      code: 'ASTRO-04',
      title: 'Tinh Bàn 3 Vòng',
      category: 'PUZZLE',
      x: 645,
      y: 155,
      status: pm.puzzlesSolved.astrolabe ? 'SOLVED' : session.currentPhase >= 2 ? 'DISCOVERED' : 'LOCKED',
      detail: pm.puzzlesSolved.astrolabe
        ? `Đã khớp [${cfg.targetInner}° • ${cfg.targetMiddle}° • ${cfg.targetOuter}°] & mở đường dẫn Lõi!`
        : 'Đài Quan Sát tan băng từ Pha II. Cần 3 góc Nội • Trung • Ngoại để kích hoạt.'
    },
    {
      id: 'node-eva',
      code: 'EVA-07',
      title: 'Vỏ Ngoài Zero-G',
      category: 'EVA',
      x: 470,
      y: 335,
      status: pm.evaCompleted ? 'SOLVED' : 'DISCOVERED',
      detail: pm.evaCompleted
        ? 'Đã hàn 3 ống dẫn Plasma ngoài không gian & thu hồi Tinh Thể Tachyon mở thẳng Chrono-Core!'
        : 'Nhiệm vụ Bộ Hành Không Trọng Lực: Hàn 3 mối rò Plasma ngoài vỏ trạm & nhặt Tinh Thể Tachyon.'
    },
    {
      id: 'node-deduction',
      code: 'TRUTH-06',
      title: 'Chân Tướng 22 Phút',
      category: 'PUZZLE',
      x: 645,
      y: 310,
      status: pm.puzzlesSolved.deduction ? 'SOLVED' : pm.discoveredLogs.length >= 4 ? 'DISCOVERED' : 'LOCKED',
      detail: pm.puzzlesSolved.deduction
        ? 'Đã giải mã toàn bộ lịch sử phi hành đoàn (+0.04s) & mở khóa [PROTOCOL-HARMONY]!'
        : 'Đối chiếu các bản ghi Hộp đen để trả lời 4 câu hỏi lịch sử trong Bảng Suy Luận.'
    },
    {
      id: 'node-core',
      code: 'CORE-OMEGA',
      title: 'Lõi Chrono-Core',
      category: 'CORE',
      x: 795,
      y: 225,
      status:
        pm.endingsReached.length > 0
          ? 'SOLVED'
          : pm.puzzlesSolved.glyphs && pm.puzzlesSolved.astrolabe && pm.puzzlesSolved.optics
          ? 'DISCOVERED'
          : 'LOCKED',
      detail:
        pm.endingsReached.length > 0
          ? `Đã kích hoạt Kết cục Lượng tử (${pm.endingsReached.length}/3 kết cục đã mở).`
          : 'Trung tâm Dị điểm Ouroboros. Nạp Giao thức HARMONY / CONTAINMENT / OVERLOAD.'
    }
  ];

  const edges = [
    { from: 'node-bridge', to: 'node-card' },
    { from: 'node-hydro', to: 'node-card' },
    { from: 'node-bridge', to: 'node-scanner' },
    { from: 'node-scanner', to: 'node-minh-echo' },
    { from: 'node-scanner', to: 'node-glyphs' },
    { from: 'node-hydro', to: 'node-glyphs' },
    { from: 'node-card', to: 'node-astrolabe' },
    { from: 'node-minh-echo', to: 'node-astrolabe' },
    { from: 'node-glyphs', to: 'node-astrolabe' },
    { from: 'node-optics', to: 'node-core' },
    { from: 'node-astrolabe', to: 'node-core' },
    { from: 'node-glyphs', to: 'node-deduction' },
    { from: 'node-eva', to: 'node-core' },
    { from: 'node-deduction', to: 'node-core' }
  ];

  return { nodes, edges };
}

function buildKronosReply(rawQuestion, campaign, session) {
  const q = String(rawQuestion || '').trim().toLowerCase();
  const pm = session.persistentMemory;
  const inv = session.inventory;
  const cfg = campaign.astrolabeConfig;

  if (q.includes('thẻ') || q.includes('đóng băng') || q.includes('rã đông') || q.includes('plasma')) {
    return {
      tag: 'KRONOS-7 // CRYO-DECODE',
      reply: inv.includes('item-command-card')
        ? `Bạn đã rã đông thành công **Thẻ Từ Chỉ Huy** rồi! Hãy mang nó tới quẹt vào **Bàn Sa Bàn Quỹ Đạo Hologram** ngay giữa [SEC-01] Khoang Chỉ Huy để lấy tọa độ Vòng Nội Tinh (${cfg.targetInner}°).`
        : 'Để rã đông **Thẻ Từ Chỉ Huy**: (1) Quét **Tủ Khóa Đóng Băng** ở [SEC-01] Khoang Chỉ Huy; (2) Sang [SEC-02] Vòm Sinh Thái lấy **Bình Nhiệt Lượng Plasma**; (3) Mở **Túi Đồ & Ghép Đồ (CRAFT-02)** ghép 2 món lại!'
    };
  }

  if (q.includes('tinh bàn') || q.includes('3 vòng') || q.includes('tọa độ') || q.includes('góc') || q.includes('astrolabe')) {
    const kInner = pm.knownCodes.includes(`INNER-RING-${cfg.targetInner}`) ? `${cfg.targetInner}° (Đã biết)` : 'Chưa mở (Quẹt thẻ tại Sa Bàn SEC-01)';
    const kMid = pm.knownCodes.includes(`MIDDLE-RING-${cfg.targetMiddle}`) ? `${cfg.targetMiddle}° (Đã biết)` : 'Chưa mở (Quét Dư Ảnh TS. Minh ở SEC-03 vào Pha II)';
    const kOut = pm.knownCodes.includes(`OUTER-RING-${cfg.targetOuter}`) ? `${cfg.targetOuter}° (Đã biết)` : 'Chưa mở (Giải 6 Cổ ngữ ở SEC-05)';
    return {
      tag: 'KRONOS-7 // ASTRO-TELEMETRY',
      reply: `Trạng thái 3 góc Tinh Bàn hiện tại: **Nội Tinh**: ${kInner} • **Trung Nhật**: ${kMid} • **Ngoại Dị Điểm**: ${kOut}. Lưu ý Đài Quan Sát [SEC-04] sẽ tan băng từ **Pha II (06:00)** trở đi!`
    };
  }

  if (q.includes('laser') || q.includes('chiết quang') || q.includes('gương') || q.includes('5x5') || q.includes('tím')) {
    return {
      tag: 'KRONOS-7 // OPTICS-LAB',
      reply: pm.puzzlesSolved.optics
        ? 'Bàn Chiết Quang 5×5 đã được bạn căn chỉnh hoàn hảo và phát Tia Tachyon Tím (405nm)!'
        : 'Nguyên lý Bàn Chiết Quang 5×5 ở [SEC-03]: Đổi hướng tia Đỏ ở `M1(0,2) = \\` để tránh Lõi Phản Vật Chất `(0,3)`, cho nhánh tách đi ngang qua `M2(1,3) = ═` vào Cảm biến α, đồng thời dẫn tia Đỏ & Lam hội tụ tại Tinh thể `(2,2)` và truyền Tia Tím qua `M5(2,3) = ═`!'
    };
  }

  if (q.includes('cổ ngữ') || q.includes('bia đá') || q.includes('ký tự') || q.includes('sora')) {
    return {
      tag: 'KRONOS-7 // XENO-LINGUISTICS',
      reply: pm.puzzlesSolved.glyphs
        ? `Bạn đã giải mã trọn vẹn 6/6 Cổ ngữ Vẫn Tinh (Tọa độ Vòng Ngoại = ${cfg.targetOuter}°)!`
        : 'Khoang Cổ Ngữ [SEC-05] mở tự nhiên ở **Pha III (12:00+)**, hoặc mở sớm ngay ở Pha I nếu bạn dùng **Máy Quét Dư Ảnh** tại Cửa Hầm Kỹ Thuật [SEC-02]. Hãy đối chiếu hình dáng 6 ký tự (⧗ Vòng lặp, ◉ Tâm dị điểm, ⟁ Hội tụ, ♒ Cộng hưởng, ✧ Góc tọa độ, ♾️ Cộng sinh)!'
    };
  }

  if (q.includes('eva') || q.includes('không trọng lực') || q.includes('vỏ trạm') || q.includes('jetpack') || q.includes('bộ hành')) {
    return {
      tag: 'KRONOS-7 // EVA-ZERO-G',
      reply: pm.evaCompleted
        ? 'Nhiệm vụ Bộ Hành Không Gian (EVA Zero-G) đã hoàn tất 100%! Cổng điều áp khẩn cấp vào Lõi Chrono-Core đã mở vĩnh viễn.'
        : 'Bấm nút **Bộ Hành EVA Zero-G** ở góc trên phải màn hình Canvas để bay ra ngoài vỏ trạm! Dùng **WASD / Chuột** điều khiển phản lực Jetpack, né thiên thạch băng, thu thập **3 Mảnh Tinh Thể Tachyon** và giữ chuột gần **3 Ống Dẫn Plasma Đứt** để hàn hồ quang!'
    };
  }

  // Mặc định: Phân tích tiến độ thông minh "Bước tiếp theo nên làm gì?"
  if (!inv.includes('item-command-card')) {
    return {
      tag: 'KRONOS-7 // SMART-NEXT-STEP',
      reply:
        'Bước ưu tiên hiện tại: Hãy quét **Tủ Khóa Đóng Băng** & **Trạm Hộp Đen** tại [SEC-01], sau đó sang [SEC-02] Vòm Sinh Thái lấy **Bình Nhiệt Lượng Plasma** và ghép ra **Thẻ Từ Chỉ Huy** trong Túi Đồ!'
    };
  }
  if (!pm.knownCodes.includes(`INNER-RING-${cfg.targetInner}`)) {
    return {
      tag: 'KRONOS-7 // SMART-NEXT-STEP',
      reply:
        'Bạn đã có **Thẻ Từ Chỉ Huy**! Hãy quay về [SEC-01] Khoang Chỉ Huy và quét **Bàn Sa Bàn Quỹ Đạo Hologram** ở giữa phòng để mở khóa tọa độ Vòng Nội Tinh.'
    };
  }
  if (!inv.includes('item-chrono-scanner')) {
    return {
      tag: 'KRONOS-7 // SMART-NEXT-STEP',
      reply:
        'Bước kế tiếp: Sang [SEC-03] Phòng Lab Chiết Quang lấy **Cuộn Cảm Siêu Dẫn**, rồi ghép với **Bộ Thu Sóng Hộp Đen** (từ SEC-01) để chế tạo **Máy Quét Dư Ảnh Thời Gian**!'
    };
  }
  if (!pm.puzzlesSolved.optics) {
    return {
      tag: 'KRONOS-7 // SMART-NEXT-STEP',
      reply:
        'Hãy mở **Chiết Quang 5×5 (LASER-05)** tại [SEC-03] để xoay 5 gương hội tụ Tia Tachyon Tím (405nm) và nhận Khóa Điều Hòa Quang Phổ!'
    };
  }
  if (!pm.puzzlesSolved.glyphs) {
    return {
      tag: 'KRONOS-7 // SMART-NEXT-STEP',
      reply:
        'Hãy dùng **Máy Quét Dư Ảnh** mở Cửa Hầm Kỹ Thuật ở [SEC-02] (hoặc chuyển sang Pha III) để vào [SEC-05] giải mã **6 Cổ Ngữ Vẫn Tinh (RUNE-03)**!'
    };
  }
  if (!pm.puzzlesSolved.astrolabe) {
    return {
      tag: 'KRONOS-7 // SMART-NEXT-STEP',
      reply: `Hãy chuyển đồng hồ sang **Pha II (06:00+)** để đọc Dư Ảnh TS. Minh ở [SEC-03] lấy góc Trung Nhật (${cfg.targetMiddle}°), sau đó lên [SEC-04] Đài Quan Sát xoay **Tinh Bàn 3 Vòng** khớp [${cfg.targetInner}° • ${cfg.targetMiddle}° • ${cfg.targetOuter}°]!`
    };
  }
  if (!pm.evaCompleted) {
    return {
      tag: 'KRONOS-7 // OPTIONAL-EVA',
      reply:
        '3 Cơ Quan chính đã mở! Bạn có thể thử sức bay ra ngoài không gian với **Bộ Hành EVA Zero-G** (góc trên phải Canvas) để hàn 3 ống Plasma vỏ trạm, hoặc hoàn tất **Bảng Suy Luận Chân Tướng**!'
    };
  }
  if (!pm.puzzlesSolved.deduction) {
    return {
      tag: 'KRONOS-7 // FINAL-DEDUCTION',
      reply:
        'Chỉ còn 1 bước trước Thời Khắc Cuối: Mở **Hộp Đen & Phá Án (CORE-06)** ➔ Tab **Bảng Suy Luận Chân Tướng** để trả lời 4 câu hỏi cốt lõi và mở khóa Giao thức `PROTOCOL-HARMONY`!'
    };
  }

  return {
    tag: 'KRONOS-7 // READY-FOR-HARMONY',
    reply:
      'Mọi khóa lượng tử đã sẵn sàng 100%! Hãy tiến vào **[SEC-06] Lõi Thời Gian Chrono-Core** (hoặc mở Tab Kích Hoạt Chrono-Core) và phát lệnh **PROTOCOL // HARMONY** để giải cứu toàn bộ phi hành đoàn!'
  };
}

function buildFullClientState() {
  const campaign = getActiveCampaign();
  const opticsTrace = traceQuantumOptics(currentSession.opticsMirrors);

  // Tính danh sách Sector kèm trạng thái mở khóa theo Pha, EVA hoặc Lối tắt Lượng tử
  const sectorsWithAccess = campaign.sectors.map((sec) => {
    const unlockedByPhase = currentSession.currentPhase >= sec.minPhase;
    const unlockedByShortcut =
      sec.shortcutId &&
      currentSession.persistentMemory.unlockedShortcuts.includes(sec.shortcutId);
    const unlockedByEva =
      sec.id === 'sector-chronocore' && Boolean(currentSession.persistentMemory.evaCompleted);
    const unlockedByAllPuzzles =
      sec.id === 'sector-chronocore' &&
      currentSession.persistentMemory.puzzlesSolved.glyphs &&
      currentSession.persistentMemory.puzzlesSolved.astrolabe &&
      currentSession.persistentMemory.puzzlesSolved.optics;

    const accessible = Boolean(
      unlockedByPhase || unlockedByShortcut || unlockedByEva || unlockedByAllPuzzles
    );
    return {
      ...sec,
      accessible,
      accessReason: accessible
        ? unlockedByEva
          ? 'Mở khóa qua Cổng Điều Áp EVA Zero-G'
          : unlockedByShortcut
          ? 'Mở khóa vĩnh viễn qua Mật đạo Lượng tử'
          : unlockedByAllPuzzles
          ? 'Mở khóa sớm nhờ hoàn tất 3 Cơ quan Lượng tử'
          : `Đang mở ở Pha ${currentSession.currentPhase}`
        : `Yêu cầu Pha ${sec.minPhase} hoặc Mật đạo Lượng tử`
    };
  });

  return {
    campaign: {
      ...campaign,
      sectors: sectorsWithAccess
    },
    session: currentSession,
    opticsTrace,
    rumorGraph: buildRumorGraph(campaign, currentSession),
    campaignsList: Array.from(campaignsStore.values()).map((c) => ({
      id: c.id,
      code: c.code,
      title: c.title,
      subtitle: c.subtitle
    }))
  };
}

// ============================================================================
// 5. HTTP SERVER & REST API ENDPOINTS
// ============================================================================

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  try {
    // 1. Healthcheck
    if (pathname === '/api/health' && req.method === 'GET') {
      const campaign = getActiveCampaign();
      const solvedCount = Object.values(currentSession.persistentMemory.puzzlesSolved).filter(Boolean).length;
      return sendJson(res, 200, {
        status: 'ok',
        service: 'chrono-horizon',
        port: PORT,
        activeCampaign: campaign.title,
        loopNumber: currentSession.loopNumber,
        currentPhase: currentSession.currentPhase,
        solvedPuzzles: `${solvedCount}/4`
      });
    }

    // 2. Lấy toàn bộ trạng thái Game
    if (pathname === '/api/state' && req.method === 'GET') {
      return sendJson(res, 200, buildFullClientState());
    }

    // 3. Di chuyển giữa các Khoang (Sectors)
    if (pathname === '/api/navigate' && req.method === 'POST') {
      const body = await parseBody(req);
      const { sectorId } = body;
      const state = buildFullClientState();
      const targetSector = state.campaign.sectors.find((s) => s.id === sectorId);

      if (!targetSector) {
        return sendJson(res, 404, { error: 'Không tìm thấy khoang yêu cầu.' });
      }
      if (!targetSector.accessible) {
        return sendJson(res, 400, {
          error: `Khoang "${targetSector.name}" hiện đang bị khóa! (${targetSector.accessReason})`,
          state
        });
      }

      currentSession.currentSectorId = sectorId;
      pushLoopEvent(`Di chuyển sang [${targetSector.code}] ${targetSector.name}.`);
      return sendJson(res, 200, {
        message: `Đã tiến vào ${targetSector.name}.`,
        state: buildFullClientState()
      });
    }

    // 4. Điều khiển Đồng hồ Vòng lặp & Chuyển Pha Thời Gian
    if (pathname === '/api/phase' && req.method === 'POST') {
      const body = await parseBody(req);
      const { action, targetPhase, deltaMinutes } = body;

      if (action === 'reset_loop') {
        resetQuantumLoop(
          '🔄 Tái khởi động Vòng lặp Thời gian chủ động — Bảo toàn 100% dữ liệu Hộp đen, Cổ ngữ & Vật phẩm Lượng tử!'
        );
        return sendJson(res, 200, {
          message: `Chào mừng trở lại Phút 00:00 (Chu kỳ #${currentSession.loopNumber})! Mọi ký ức đã thu thập vẫn còn nguyên vẹn.`,
          loopReset: true,
          state: buildFullClientState()
        });
      }

      if (action === 'set_phase') {
        const p = Math.max(1, Math.min(4, Number(targetPhase) || 1));
        const phaseStartMinutes = { 1: 1, 2: 6, 3: 12, 4: 18 };
        currentSession.currentPhase = p;
        currentSession.loopMinutesElapsed = phaseStartMinutes[p];
        pushLoopEvent(`Điều chỉnh Bộ Cộng Hưởng Thời Gian sang Pha ${p} (${currentSession.loopMinutesElapsed}:00).`);
        return sendJson(res, 200, {
          message: `Đã đồng bộ thời gian trạm sang Pha ${p}!`,
          state: buildFullClientState()
        });
      }

      if (action === 'advance_phase') {
        if (currentSession.currentPhase < 4) {
          const nextP = currentSession.currentPhase + 1;
          const phaseStartMinutes = { 1: 1, 2: 6, 3: 12, 4: 18 };
          currentSession.currentPhase = nextP;
          currentSession.loopMinutesElapsed = phaseStartMinutes[nextP];
          pushLoopEvent(`Tua nhanh đồng hồ lượng tử sang Pha ${nextP}.`);
          return sendJson(res, 200, {
            message: `Đồng hồ lượng tử chuyển sang Pha ${nextP}! Môi trường trên trạm đã biến đổi.`,
            state: buildFullClientState()
          });
        } else {
          resetQuantumLoop(
            '💥 Dị điểm Mắt Ouroboros sụp đổ ở phút 22:00! Trường Neo Lượng Tử đưa bạn trở về Phút 00:00 của chu kỳ kế tiếp!'
          );
          return sendJson(res, 200, {
            message: '💥 Vụ nổ Siêu Tân Tinh ở phút 22:00 đã kích hoạt Vòng lặp mới! Dữ liệu Hộp đen của bạn được giữ nguyên.',
            loopReset: true,
            state: buildFullClientState()
          });
        }
      }

      if (action === 'tick') {
        const step = Number(deltaMinutes) || 1;
        currentSession.loopMinutesElapsed += step;
        if (currentSession.loopMinutesElapsed >= 22) {
          resetQuantumLoop(
            '💥 Đồng hồ chạm mốc 22:00 — Dị điểm phát nổ! Bạn tỉnh dậy ở đầu chu kỳ mới với trọn vẹn ký ức.'
          );
          return sendJson(res, 200, {
            message: '💥 Hết 22 phút! Vòng lặp Thời gian tự động tái khởi động và bảo toàn ký ức.',
            loopReset: true,
            state: buildFullClientState()
          });
        }
        currentSession.currentPhase = computePhaseFromMinutes(currentSession.loopMinutesElapsed);
        return sendJson(res, 200, {
          state: buildFullClientState()
        });
      }

      return sendJson(res, 400, { error: 'Hành động thời gian không hợp lệ.' });
    }

    // 5. Khám phá Điểm Tương Tác (Hotspot) trên Bản đồ 2D Canvas
    if (pathname === '/api/inspect' && req.method === 'POST') {
      const body = await parseBody(req);
      const { sectorId, hotspotId } = body;
      const campaign = getActiveCampaign();
      const sector = campaign.sectors.find((s) => s.id === (sectorId || currentSession.currentSectorId));
      if (!sector) {
        return sendJson(res, 404, { error: 'Không tìm thấy khoang.' });
      }
      const hotspot = sector.hotspots.find((h) => h.id === hotspotId);
      if (!hotspot) {
        return sendJson(res, 404, { error: 'Không tìm thấy điểm tương tác.' });
      }

      // Kiểm tra điều kiện Pha
      if (hotspot.requiredPhase && currentSession.currentPhase < hotspot.requiredPhase) {
        return sendJson(res, 400, {
          error: `Điểm tương tác "${hotspot.name}" chỉ khả dụng từ Pha ${hotspot.requiredPhase} trở đi! (Gợi ý: Hãy bấm chuyển sang Pha ${hotspot.requiredPhase}).`,
          scannerHint: hotspot.scannerHint,
          state: buildFullClientState()
        });
      }

      // Kiểm tra điều kiện Vật phẩm yêu cầu
      if (hotspot.requiredItem && !currentSession.inventory.includes(hotspot.requiredItem)) {
        const reqItemObj = campaign.itemsCatalog.find((i) => i.id === hotspot.requiredItem);
        const reqName = reqItemObj ? reqItemObj.name : hotspot.requiredItem;
        return sendJson(res, 400, {
          error: `Cần có vật phẩm "${reqName}" trong Túi đồ để mở khóa "${hotspot.name}"!`,
          scannerHint: hotspot.scannerHint,
          state: buildFullClientState()
        });
      }

      if (!currentSession.inspectedHotspots.includes(hotspot.id)) {
        currentSession.inspectedHotspots.push(hotspot.id);
      }

      const rewards = [];
      if (hotspot.rewardItem) {
        const added = addInventoryItem(hotspot.rewardItem);
        const itemObj = campaign.itemsCatalog.find((i) => i.id === hotspot.rewardItem);
        if (added && itemObj) {
          rewards.push(`Thu thập vật phẩm: ${itemObj.icon} ${itemObj.name}`);
        }
      }

      if (hotspot.rewardLog) {
        const addedLog = addPersistentLog(hotspot.rewardLog);
        const logObj = campaign.logsCatalog.find((l) => l.id === hotspot.rewardLog);
        if (addedLog && logObj) {
          rewards.push(`Giải mã Hộp đen: "${logObj.title}"`);
        }
      }

      if (hotspot.unlockCode && !currentSession.persistentMemory.knownCodes.includes(hotspot.unlockCode)) {
        currentSession.persistentMemory.knownCodes.push(hotspot.unlockCode);
        rewards.push(`Ghi nhận Mã Lượng Tử: [${hotspot.unlockCode}]`);
      }

      if (
        hotspot.unlockShortcut &&
        !currentSession.persistentMemory.unlockedShortcuts.includes(hotspot.unlockShortcut)
      ) {
        currentSession.persistentMemory.unlockedShortcuts.push(hotspot.unlockShortcut);
        rewards.push('Mở khóa vĩnh viễn Mật đạo Lượng tử sang Khoang Cổ Ngữ (Sector 05)!');
      }

      pushLoopEvent(`Khám phá [${hotspot.name}] tại ${sector.name}.`);

      return sendJson(res, 200, {
        message:
          rewards.length > 0
            ? `${hotspot.description} — ✨ ${rewards.join(' | ')}`
            : hotspot.description,
        openPuzzle: hotspot.openPuzzle || null,
        hotspot,
        rewards,
        state: buildFullClientState()
      });
    }

    // 6. Xưởng Ghép Vật Phẩm (Inventory Workbench Crafting)
    if (pathname === '/api/craft' && req.method === 'POST') {
      const body = await parseBody(req);
      const { itemA, itemB, recipeId } = body;
      const campaign = getActiveCampaign();

      let recipe = null;
      if (recipeId) {
        recipe = campaign.recipes.find((r) => r.id === recipeId);
      } else if (itemA && itemB) {
        recipe = campaign.recipes.find(
          (r) =>
            (r.ingredients[0] === itemA && r.ingredients[1] === itemB) ||
            (r.ingredients[0] === itemB && r.ingredients[1] === itemA)
        );
      }

      if (!recipe) {
        return sendJson(res, 400, {
          error: 'Hai vật phẩm này không tương thích để ghép với nhau. Hãy kiểm tra gợi ý công thức!'
        });
      }

      const missing = recipe.ingredients.filter((ing) => !currentSession.inventory.includes(ing));
      if (missing.length > 0) {
        const missingNames = missing.map((id) => {
          const found = campaign.itemsCatalog.find((i) => i.id === id);
          return found ? found.name : id;
        });
        return sendJson(res, 400, {
          error: `Chưa đủ nguyên liệu! Bạn còn thiếu: ${missingNames.join(', ')}.`
        });
      }

      addInventoryItem(recipe.resultItem);
      if (!currentSession.craftedItems.includes(recipe.resultItem)) {
        currentSession.craftedItems.push(recipe.resultItem);
      }

      const resultObj = campaign.itemsCatalog.find((i) => i.id === recipe.resultItem);
      pushLoopEvent(`Chế tạo thành công [${resultObj ? resultObj.name : recipe.title}] tại Xưởng Lượng Tử!`);

      return sendJson(res, 200, {
        message: `🛠️ Ghép thành công: ${resultObj ? resultObj.icon + ' ' + resultObj.name : recipe.title}! (${recipe.description})`,
        craftedItem: resultObj,
        state: buildFullClientState()
      });
    }

    // 7. Cơ Quan 1: Giải Mã Cổ Ngữ Ngoại Tinh (Xeno-Glyph Runic Translator)
    if (pathname === '/api/puzzle/glyphs' && req.method === 'POST') {
      const body = await parseBody(req);
      const { mappings, autoSolve } = body;
      const campaign = getActiveCampaign();

      if (autoSolve) {
        const fullMap = {};
        for (const g of campaign.glyphCatalog) {
          fullMap[g.id] = g.correctMeaning;
        }
        currentSession.glyphDraft = fullMap;
      } else if (mappings && typeof mappings === 'object') {
        currentSession.glyphDraft = { ...currentSession.glyphDraft, ...mappings };
      }

      let correctCount = 0;
      const results = {};
      for (const g of campaign.glyphCatalog) {
        const chosen = currentSession.glyphDraft[g.id] || '';
        const isCorrect = chosen === g.correctMeaning;
        results[g.id] = isCorrect;
        if (isCorrect) {
          correctCount++;
          currentSession.persistentMemory.decodedGlyphs[g.id] = g.correctMeaning;
        }
      }

      const allSolved = correctCount === campaign.glyphCatalog.length;
      if (allSolved) {
        currentSession.persistentMemory.puzzlesSolved.glyphs = true;
        addPersistentLog('log-12-sora-rosetta');
        const outerCode = `OUTER-RING-${campaign.astrolabeConfig.targetOuter}`;
        if (!currentSession.persistentMemory.knownCodes.includes(outerCode)) {
          currentSession.persistentMemory.knownCodes.push(outerCode);
        }
        pushLoopEvent(
          `🗿 Giải mã hoàn tất 6/6 Cổ ngữ Vẫn Tinh! Mở khóa tọa độ Vòng Ngoại Tinh Bàn (${campaign.astrolabeConfig.targetOuter}°).`
        );
      }

      return sendJson(res, 200, {
        solved: allSolved,
        correctCount,
        total: campaign.glyphCatalog.length,
        results,
        message: allSolved
          ? `🗿 Xuất sắc! Bạn đã dịch trọn vẹn Bia Đá Cổ Ngữ và tìm ra tọa độ Vòng Ngoại Tinh Bàn: ${campaign.astrolabeConfig.targetOuter}°!`
          : `Đã giải mã đúng ${correctCount}/${campaign.glyphCatalog.length} ký tự Cổ ngữ. Hãy đối chiếu gợi ngữ cảnh để hoàn tất!`,
        state: buildFullClientState()
      });
    }

    // 8. Cơ Quan 2: Tinh Bàn Điều Hướng 3 Vòng Đồng Tâm (Celestial Astrolabe)
    if (pathname === '/api/puzzle/astrolabe' && req.method === 'POST') {
      const body = await parseBody(req);
      const { innerAngle, middleAngle, outerAngle, autoAlign } = body;
      const campaign = getActiveCampaign();
      const cfg = campaign.astrolabeConfig;

      if (autoAlign) {
        currentSession.astrolabeState = {
          innerAngle: cfg.targetInner,
          middleAngle: cfg.targetMiddle,
          outerAngle: cfg.targetOuter
        };
      } else {
        if (innerAngle !== undefined) {
          currentSession.astrolabeState.innerAngle = ((Number(innerAngle) % 360) + 360) % 360;
        }
        if (middleAngle !== undefined) {
          currentSession.astrolabeState.middleAngle = ((Number(middleAngle) % 360) + 360) % 360;
        }
        if (outerAngle !== undefined) {
          currentSession.astrolabeState.outerAngle = ((Number(outerAngle) % 360) + 360) % 360;
        }
      }

      const matchInner = currentSession.astrolabeState.innerAngle === cfg.targetInner;
      const matchMiddle = currentSession.astrolabeState.middleAngle === cfg.targetMiddle;
      const matchOuter = currentSession.astrolabeState.outerAngle === cfg.targetOuter;
      const solved = matchInner && matchMiddle && matchOuter;

      if (solved) {
        currentSession.persistentMemory.puzzlesSolved.astrolabe = true;
        addInventoryItem('item-nebula-prism');
        addPersistentLog('log-10-vance-astrolabe');
        if (!currentSession.persistentMemory.unlockedShortcuts.includes('shortcut-core-conduit')) {
          currentSession.persistentMemory.unlockedShortcuts.push('shortcut-core-conduit');
        }
        pushLoopEvent(
          `🪐 Căn chỉnh thành công Tinh Bàn 3 Vòng [${cfg.targetInner}° • ${cfg.targetMiddle}° • ${cfg.targetOuter}°]! Nhận Ấn Tinh Bàn Ouroboros.`
        );
      }

      return sendJson(res, 200, {
        solved,
        alignment: { matchInner, matchMiddle, matchOuter },
        message: solved
          ? `🪐 Tinh Bàn Cộng Hưởng! Cả 3 vòng [${cfg.targetInner}° • ${cfg.targetMiddle}° • ${cfg.targetOuter}°] đã thẳng hàng với tâm Dị điểm! Bạn nhận được Ấn Tinh Bàn Ouroboros và mở thông lối dẫn vào Lõi Chrono-Core!`
          : `Trạng thái khớp vòng: Nội Tinh (${matchInner ? '✅' : '❌'}) • Trung Nhật (${
              matchMiddle ? '✅' : '❌'
            }) • Ngoại Dị Điểm (${matchOuter ? '✅' : '❌'}).`,
        state: buildFullClientState()
      });
    }

    // 9. Cơ Quan 3: Bàn Chiết Quang Lượng Tử 5x5 (Quantum Laser Prism Array)
    if (pathname === '/api/puzzle/optics' && req.method === 'POST') {
      const body = await parseBody(req);
      const { cellKey, setState, autoCalibrate } = body;
      const campaign = getActiveCampaign();
      const statesCycle = ['/', '\\', '═'];

      if (autoCalibrate) {
        currentSession.opticsMirrors = { ...campaign.opticsConfig.solutionMirrors };
      } else if (cellKey && Object.prototype.hasOwnProperty.call(currentSession.opticsMirrors, cellKey)) {
        if (setState && statesCycle.includes(setState)) {
          currentSession.opticsMirrors[cellKey] = setState;
        } else {
          const curr = currentSession.opticsMirrors[cellKey];
          const nextIdx = (statesCycle.indexOf(curr) + 1) % statesCycle.length;
          currentSession.opticsMirrors[cellKey] = statesCycle[nextIdx];
        }
      }

      const trace = traceQuantumOptics(currentSession.opticsMirrors);
      if (trace.solved) {
        currentSession.persistentMemory.puzzlesSolved.optics = true;
        addInventoryItem('item-stabilized-core-key');
        addPersistentLog('log-08-laser-notes');
        pushLoopEvent(
          '🔬 Giải thành công Bàn Chiết Quang Lượng Tử 5x5! Cả 3 Cảm biến Quang phổ (Đỏ, Lam, Tachyon Tím) đã kích hoạt!'
        );
      }

      return sendJson(res, 200, {
        solved: trace.solved,
        opticsTrace: trace,
        message: trace.solved
          ? '🔬 Tuyệt vời! Chùm tia Đỏ và Lam đã hội tụ thành Tia Tachyon Tím (405nm), kích hoạt đồng thời cả 3 Cảm biến Quang phổ α, β, γ! Bạn nhận được Khóa Điều Hòa Quang Phổ Lõi!'
          : trace.hazardCoreHit
          ? '⚠️ CẢNH BÁO: Tia Laser đang bắn trúng Lõi Phản Vật Chất Bất Ổn ở ô (0,3)! Hãy xoay Gương M1 tại ô (0,2) để đổi hướng tia!'
          : 'Đã xoay gương chiết quang. Hãy tiếp tục điều hướng để thắp sáng đủ 3 Cảm biến α (Đỏ), β (Lam) và γ (Tím).',
        state: buildFullClientState()
      });
    }

    // 10. Bảng Ghép Mảnh Lịch Sử & Suy Luận Chân Tướng (Lore Deduction Matrix)
    if (pathname === '/api/deduction/verify' && req.method === 'POST') {
      const body = await parseBody(req);
      const { answers, autoDeduce } = body;
      const campaign = getActiveCampaign();

      if (autoDeduce) {
        for (const q of campaign.deductionQuestions) {
          currentSession.deductionDraft[q.id] = q.correctOptionId;
        }
      } else if (answers && typeof answers === 'object') {
        currentSession.deductionDraft = { ...currentSession.deductionDraft, ...answers };
      }

      let correctCount = 0;
      const breakdown = {};
      for (const q of campaign.deductionQuestions) {
        const picked = currentSession.deductionDraft[q.id];
        const ok = picked === q.correctOptionId;
        breakdown[q.id] = ok;
        if (ok) correctCount++;
      }

      const allCorrect = correctCount === campaign.deductionQuestions.length;
      if (allCorrect) {
        currentSession.persistentMemory.puzzlesSolved.deduction = true;
        if (!currentSession.persistentMemory.knownCodes.includes('PROTOCOL-HARMONY')) {
          currentSession.persistentMemory.knownCodes.push('PROTOCOL-HARMONY');
        }
        pushLoopEvent(
          '🧠 Hoàn tất Bảng Suy Luận Lịch Sử (4/4)! Mở khóa Giao Thức Tối Hậu: [PROTOCOL-HARMONY].'
        );
      }

      return sendJson(res, 200, {
        solved: allCorrect,
        correctCount,
        total: campaign.deductionQuestions.length,
        breakdown,
        message: allCorrect
          ? '🧠 Chân tướng sáng tỏ! Bạn đã ghép nối hoàn hảo toàn bộ lịch sử vụ mất tích trên Trạm Aethelgard-IX và mở khóa Giao thức Cộng Sinh [PROTOCOL-HARMONY]!'
          : `Bạn đã suy luận chính xác ${correctCount}/${campaign.deductionQuestions.length} mảnh ghép lịch sử. Hãy đọc kỹ các bản ghi Hộp đen để hoàn thiện!`,
        state: buildFullClientState()
      });
    }

    // 11. Kích hoạt Lõi Thời Gian Chrono-Core & Mở Khóa Đa Kết Cục (3 Endings)
    if (pathname === '/api/chronocore/activate' && req.method === 'POST') {
      const body = await parseBody(req);
      const { protocol } = body;
      const solved = currentSession.persistentMemory.puzzlesSolved;
      const allThreeMechanisms = solved.glyphs && solved.astrolabe && solved.optics;

      let ending = null;

      if (protocol === 'HARMONY') {
        if (allThreeMechanisms && solved.deduction) {
          ending = {
            id: 'ENDING_TRUE_SYMBIOSIS',
            code: 'TRUE ENDING • KẾT CỤC CHUẨN',
            title: '🌅 Bình Minh Ngoài Vòng Lặp (Quantum Symbiosis)',
            badgeColor: '#10b981',
            summary:
              'Ba vòng Tinh Bàn xoay tròn rực sáng, dẫn truyền Tia Tachyon Tím (405nm) xuyên qua Bia Đá Vẫn Tinh thẳng vào tâm Dị điểm Mắt Ouroboros. Bong bóng lệch pha (+0.04s) tan biến — Chỉ huy Elena Vance, TS. Trần Khải Minh, TS. Sora Kurosawa và AI KRONOS-7 bước ra nguyên vẹn! Thực thể Sao Cổ Đại được chữa lành đã mở một Cổng Nhảy Lượng Tử đưa toàn bộ Trạm Aethelgard-IX trở về quỹ đạo Trái Đất an toàn, khép lại vĩnh viễn vòng lặp 22 phút!'
          };
        } else {
          return sendJson(res, 400, {
            error:
              'Chưa đủ điều kiện nạp Giao Thức Cộng Sinh (HARMONY)! Bạn cần hoàn tất cả 3 Cơ Quan (Cổ ngữ, Tinh bàn, Chiết quang) và Bảng Suy Luận Lịch Sử (4/4).'
          });
        }
      } else if (protocol === 'CONTAINMENT') {
        if (!solved.astrolabe && !solved.optics) {
          return sendJson(res, 400, {
            error: 'Cần giải ít nhất Cơ quan Tinh bàn hoặc Chiết quang để kích hoạt Giao thức Phong Ấn!'
          });
        }
        ending = {
          id: 'ENDING_ETERNAL_GUARDIAN',
          code: 'ENDING B • KẾT CỤC PHONG ẤN',
          title: '🛡️ Người Gác Đêm Chân Trời Sự Kiện (Eternal Guardian)',
          badgeColor: '#38bdf8',
          summary:
            'Bạn quyết định đảo ngược trường hấp dẫn để đóng sập cánh cổng Dị điểm Ouroboros từ bên trong. Vụ nổ Siêu Tân Tinh bị triệt tiêu hoàn toàn, bảo vệ Hệ Mặt Trời mãi mãi. Dù Trạm Aethelgard-IX neo lại ở biên giới thời gian, tín hiệu Hộp đen của bạn đã được truyền về Trái Đất như một huyền thoại bất tử.'
        };
      } else {
        ending = {
          id: 'ENDING_TIMELINE_FRACTURE',
          code: 'ENDING C • KẾT CỤC NGHỊCH LÝ',
          title: '⚡ Vỡ Vụn Chân Không (Timeline Fracture)',
          badgeColor: '#f43f5e',
          summary:
            'Khi kích hoạt quá tải Lõi Phản Vật Chất mà không có sự điều hòa của Tia Tachyon Tím, sóng xung kích làm rách màng không-thời gian. Trạm Aethelgard-IX phân tách thành hàng ngàn bản sao song song trước khi Trường Neo Lượng Tử của KRONOS-7 kéo bạn trở lại Phút 00:00 để thử lại một lựa chọn sáng suốt hơn!'
        };
      }

      currentSession.activeEnding = ending;
      if (!currentSession.persistentMemory.endingsReached.includes(ending.id)) {
        currentSession.persistentMemory.endingsReached.push(ending.id);
      }
      pushLoopEvent(`🌌 Đạt Kết Cục: [${ending.code}] ${ending.title}`);

      return sendJson(res, 200, {
        ending,
        message: `Đã kích hoạt Lõi Thời Gian Chrono-Core: ${ending.title}`,
        state: buildFullClientState()
      });
    }

    // 12. Sinh Chiến Dịch Dị Điểm Vũ Trụ Ngẫu Nhiên Mới (Procedural Generator)
    if (pathname === '/api/campaign/procedural' && req.method === 'POST') {
      const newCamp = createProceduralCampaign();
      campaignsStore.set(newCamp.id, newCamp);
      activeCampaignId = newCamp.id;
      currentSession = createInitialSession(newCamp);
      return sendJson(res, 200, {
        message: `🎲 Đã sinh chiến dịch Dị điểm Vũ trụ mới: "${newCamp.title}"!`,
        state: buildFullClientState()
      });
    }

    // 13. Chuyển đổi giữa các Chiến dịch
    if (pathname === '/api/campaign/select' && req.method === 'POST') {
      const body = await parseBody(req);
      const { campaignId } = body;
      if (!campaignsStore.has(campaignId)) {
        return sendJson(res, 404, { error: 'Không tìm thấy chiến dịch yêu cầu.' });
      }
      activeCampaignId = campaignId;
      currentSession = createInitialSession(campaignsStore.get(campaignId));
      return sendJson(res, 200, {
        message: `Đã chuyển sang chiến dịch: ${campaignsStore.get(campaignId).title}`,
        state: buildFullClientState()
      });
    }

    // 14. Cầu nối Liên thông đẩy Dấu vết Tín hiệu Vũ trụ sang OmniTrace OSINT (Port 4090)
    if (pathname === '/api/osint-export' && req.method === 'POST') {
      const campaign = getActiveCampaign();
      const payload = {
        source: 'ChronoHorizon Deep-Space Telemetry (Port 4140)',
        campaignCode: campaign.code,
        singularity: campaign.singularityName,
        loopNumber: currentSession.loopNumber,
        signals: campaign.anomalySignals,
        knownCodes: currentSession.persistentMemory.knownCodes,
        timestamp: new Date().toISOString()
      };

      const forwardStatus = await new Promise((resolve) => {
        const reqOsint = http.request(
          {
            hostname: '127.0.0.1',
            port: 4090,
            path: '/api/health',
            method: 'GET',
            timeout: 1500
          },
          (resOsint) => {
            resolve({ online: resOsint.statusCode === 200 });
          }
        );
        reqOsint.on('error', () => resolve({ online: false }));
        reqOsint.on('timeout', () => {
          reqOsint.destroy();
          resolve({ online: false });
        });
        reqOsint.end();
      });

      pushLoopEvent(
        `📡 Đồng bộ ${campaign.anomalySignals.length} mẫu tín hiệu lượng tử sang OmniTrace OSINT (Port 4090).`
      );

      return sendJson(res, 200, {
        exported: true,
        omniTraceOnline: forwardStatus.online,
        telemetryPackage: payload,
        message: forwardStatus.online
          ? `📡 Đã đẩy trực tiếp ${campaign.anomalySignals.length} tín hiệu dị điểm & mã Hộp đen sang OmniTrace OSINT (Port 4090)!`
          : `📦 Đã đóng gói ${campaign.anomalySignals.length} tín hiệu dị điểm chuẩn OSINT (OmniTrace Port 4090 hiện đang nghỉ, gói dữ liệu đã sẵn sàng).`
      });
    }

    // 15. Nhiệm vụ Bộ Hành Không Gian Không Trọng Lực (EVA Zero-G Hull Repair & Shard Harvest)
    if (pathname === '/api/eva/complete' && req.method === 'POST') {
      const body = await parseBody(req);
      const { weldedConduits = 3, collectedShards = 3 } = body;

      currentSession.persistentMemory.evaCompleted = true;
      addInventoryItem('item-tachyon-shard');
      addPersistentLog('log-13-eva-hull');
      if (!currentSession.persistentMemory.knownCodes.includes('EVA-SHIELD-100%')) {
        currentSession.persistentMemory.knownCodes.push('EVA-SHIELD-100%');
      }
      if (!currentSession.persistentMemory.unlockedShortcuts.includes('shortcut-eva-core')) {
        currentSession.persistentMemory.unlockedShortcuts.push('shortcut-eva-core');
      }

      pushLoopEvent(
        `🧑‍🚀 Hoàn tất Bộ Hành Không Gian (EVA Zero-G): Hàn kín ${weldedConduits}/3 ống dẫn Plasma & thu hồi ${collectedShards} mảnh Tinh Thể Tachyon!`
      );

      return sendJson(res, 200, {
        evaCompleted: true,
        message:
          '🧑‍🚀 Xuất sắc! Khiên từ trường vỏ trạm đã phục hồi 100%, bạn nhận được [Tinh Thể Tachyon Không Trọng Lực] và mở khóa thẳng Cổng Điều Áp vào Lõi Chrono-Core!',
        state: buildFullClientState()
      });
    }

    // 16. Hỏi Đáp Trực Tiếp Với AI Trạm KRONOS-7 (Contextual Smart Comms)
    if (pathname === '/api/kronos/ask' && req.method === 'POST') {
      const body = await parseBody(req);
      const campaign = getActiveCampaign();
      const ans = buildKronosReply(body.question || '', campaign, currentSession);
      return sendJson(res, 200, {
        speaker: 'KRONOS-7',
        tag: ans.tag,
        reply: ans.reply,
        state: buildFullClientState()
      });
    }

    // 17. Phục vụ Static Files trong thư mục public/
    let filePath = pathname === '/' ? path.join(PUBLIC_DIR, 'index.html') : path.join(PUBLIC_DIR, pathname);
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      return fs.createReadStream(filePath).pipe(res);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  } catch (err) {
    sendJson(res, 500, { error: err.message || 'Internal Server Error' });
  }
});

if (require.main === module) {
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`🌌 ChronoHorizon (Deep Space Time-Loop Mystery) đang chạy tại http://127.0.0.1:${PORT}`);
  });
}

module.exports = { server, traceQuantumOptics, createAethelgardCampaign };
