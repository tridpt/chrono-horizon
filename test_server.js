/**
 * 🧪 E2E Automated Test Suite cho ChronoHorizon (Port 4140)
 * Kiểm thử toàn diện:
 * - Khám phá Hotspot 2D & Thu thập Vật phẩm
 * - Xưởng Ghép Vật Phẩm (Inventory Crafting)
 * - 3 Cơ Quan Giải Đố (Cổ ngữ, Tinh bàn 3 vòng, Chiết quang Laser 5x5)
 * - Vòng lặp Thời gian 22 Phút & Bảo toàn Ký ức Lượng tử khi Reset Loop
 * - Bảng Suy luận Lịch sử & Kích hoạt True Ending tại Lõi Chrono-Core
 * - Sinh Chiến dịch Dị điểm Ngẫu nhiên (Procedural) & Xuất OSINT
 */

const assert = require('node:assert');
const http = require('node:http');
const { server } = require('./server.js');

function requestJson(port, method, path, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: { 'Content-Type': 'application/json' }
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(raw) });
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const testPort = server.address().port;
  console.log(`🚀 Đang chạy bộ kiểm thử E2E ChronoHorizon trên cổng tạm ${testPort}...`);

  try {
    // 1. Health check
    const health = await requestJson(testPort, 'GET', '/api/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.data.service, 'chrono-horizon');
    console.log('✅ [1/9] Healthcheck & Khởi tạo Server OK');

    // 2. Khám phá Khoang Chỉ Huy & Vòm Sinh Thái + Ghép Thẻ Từ Chỉ Huy
    await requestJson(testPort, 'POST', '/api/inspect', {
      sectorId: 'sector-bridge',
      hotspotId: 'hs-bridge-blackbox'
    });
    await requestJson(testPort, 'POST', '/api/inspect', {
      sectorId: 'sector-bridge',
      hotspotId: 'hs-bridge-cryo-locker'
    });
    await requestJson(testPort, 'POST', '/api/navigate', { sectorId: 'sector-hydro' });
    await requestJson(testPort, 'POST', '/api/inspect', {
      sectorId: 'sector-hydro',
      hotspotId: 'hs-hydro-workbench'
    });

    const craftCard = await requestJson(testPort, 'POST', '/api/craft', {
      itemA: 'item-frozen-card',
      itemB: 'item-plasma-torch'
    });
    assert.strictEqual(craftCard.status, 200);
    assert.ok(craftCard.data.state.session.inventory.includes('item-command-card'));
    console.log('✅ [2/9] Khám phá Hotspot & Chế tạo Thẻ Từ Chỉ Huy Đã Giải Đông OK');

    // 3. Giải Bàn Chiết Quang Lượng Tử 5x5 (Ray-Tracing Engine)
    const opticsRes = await requestJson(testPort, 'POST', '/api/puzzle/optics', {
      autoCalibrate: true
    });
    assert.strictEqual(opticsRes.status, 200);
    assert.strictEqual(opticsRes.data.solved, true);
    assert.strictEqual(opticsRes.data.opticsTrace.sensors.alphaRed, true);
    assert.strictEqual(opticsRes.data.opticsTrace.sensors.betaBlue, true);
    assert.strictEqual(opticsRes.data.opticsTrace.sensors.gammaViolet, true);
    assert.strictEqual(opticsRes.data.opticsTrace.hazardCoreHit, false);
    console.log('✅ [3/9] Cơ Quan Chiết Quang 5x5 (Ray-Tracing Đỏ + Lam ➔ Tachyon Tím) OK');

    // 4. Giải Tinh Bàn 3 Vòng Đồng Tâm
    const astroRes = await requestJson(testPort, 'POST', '/api/puzzle/astrolabe', {
      innerAngle: 120,
      middleAngle: 240,
      outerAngle: 60
    });
    assert.strictEqual(astroRes.status, 200);
    assert.strictEqual(astroRes.data.solved, true);
    console.log('✅ [4/9] Cơ Quan Tinh Bàn Điều Hướng 3 Vòng Đồng Tâm (120°•240°•60°) OK');

    // 5. Giải Mã Cổ Ngữ Vẫn Tinh
    const glyphRes = await requestJson(testPort, 'POST', '/api/puzzle/glyphs', {
      autoSolve: true
    });
    assert.strictEqual(glyphRes.status, 200);
    assert.strictEqual(glyphRes.data.solved, true);
    console.log('✅ [5/9] Cơ Quan Giải Mã Cổ Ngữ Ngoại Tinh (6/6 Ký tự) OK');

    // 6. Kiểm tra Reset Vòng Lặp Thời Gian & Bảo toàn Ký ức Lượng tử
    const resetRes = await requestJson(testPort, 'POST', '/api/phase', {
      action: 'reset_loop'
    });
    assert.strictEqual(resetRes.status, 200);
    assert.strictEqual(resetRes.data.state.session.loopNumber, 2);
    assert.strictEqual(resetRes.data.state.session.persistentMemory.puzzlesSolved.optics, true);
    assert.strictEqual(resetRes.data.state.session.persistentMemory.puzzlesSolved.astrolabe, true);
    assert.strictEqual(resetRes.data.state.session.persistentMemory.puzzlesSolved.glyphs, true);
    assert.ok(resetRes.data.state.session.inventory.includes('item-command-card'));
    console.log('✅ [6/9] Vòng lặp Thời gian Chu kỳ #2 & Bảo toàn Ký ức Lượng tử OK');

    // 7. Hoàn tất Bảng Suy Luận Lịch Sử & Kích hoạt True Ending tại Lõi Chrono-Core
    const dedRes = await requestJson(testPort, 'POST', '/api/deduction/verify', {
      autoDeduce: true
    });
    assert.strictEqual(dedRes.status, 200);
    assert.strictEqual(dedRes.data.solved, true);

    const endRes = await requestJson(testPort, 'POST', '/api/chronocore/activate', {
      protocol: 'HARMONY'
    });
    assert.strictEqual(endRes.status, 200);
    assert.strictEqual(endRes.data.ending.id, 'ENDING_TRUE_SYMBIOSIS');
    console.log('✅ [7/9] Bảng Suy Luận Lịch Sử & Mở khóa True Ending (Quantum Symbiosis) OK');

    // 8. Sinh Chiến dịch Dị điểm Vũ trụ Ngẫu nhiên (Procedural Generator)
    const procRes = await requestJson(testPort, 'POST', '/api/campaign/procedural');
    assert.strictEqual(procRes.status, 200);
    assert.ok(procRes.data.state.campaign.id.startsWith('campaign-proc-'));
    console.log('✅ [8/9] Bộ Sinh Dị Điểm Vũ Trụ Ngẫu Nhiên (Procedural Anomaly) OK');

    // 9. Xuất Dữ liệu Tín hiệu sang OmniTrace OSINT
    const osintRes = await requestJson(testPort, 'POST', '/api/osint-export');
    assert.strictEqual(osintRes.status, 200);
    assert.strictEqual(osintRes.data.exported, true);
    console.log('✅ [9/11] Cầu nối Liên thông Dữ liệu sang OmniTrace OSINT OK');

    // 10. Nhiệm vụ Bộ Hành Không Gian Không Trọng Lực (EVA Zero-G Spacewalk) & Sơ đồ Manh Mối
    const evaRes = await requestJson(testPort, 'POST', '/api/eva/complete', {
      weldedConduits: 3,
      collectedShards: 3
    });
    assert.strictEqual(evaRes.status, 200);
    assert.strictEqual(evaRes.data.evaCompleted, true);
    assert.ok(evaRes.data.state.session.inventory.includes('item-tachyon-shard'));
    assert.ok(Array.isArray(evaRes.data.state.rumorGraph.nodes));
    assert.strictEqual(evaRes.data.state.rumorGraph.nodes.length, 11);
    console.log('✅ [10/11] Nhiệm vụ Bộ Hành Không Trọng Lực (EVA Zero-G) & Ship Log Rumor Graph OK');

    // 11. Hỏi đáp trực tiếp AI Trạm KRONOS-7
    const kronosRes = await requestJson(testPort, 'POST', '/api/kronos/ask', {
      question: 'tọa độ 3 vòng tinh bàn'
    });
    assert.strictEqual(kronosRes.status, 200);
    assert.strictEqual(kronosRes.data.speaker, 'KRONOS-7');
    assert.ok(kronosRes.data.reply.includes('Nội Tinh'));
    console.log('✅ [11/11] Hỏi Đáp Trực Tiếp AI Trạm KRONOS-7 OK');

    console.log('🎉 TẤT CẢ 11/11 BÀI KIỂM THỬ E2E CỦA CHRONO-HORIZON ĐỀU VƯỢT QUA XUẤT SẮC!');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Kiểm thử thất bại:', err);
  process.exit(1);
});
