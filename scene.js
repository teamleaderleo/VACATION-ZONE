(() => {
  const canvas = document.getElementById('resort-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR_LIMIT = 2;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let tileW = 72;
  let tileH = 36;
  let originX = 0;
  let originY = 0;
  let last = performance.now();

  const COLS = 15;
  const ROWS = 10;
  const pool = { x0: 6, y0: 2, x1: 10, y1: 5 };

  const palette = {
    grass: '#9fc88d',
    grass2: '#94be82',
    sand: '#e8cd91',
    sand2: '#dfbf79',
    pool: '#69c9c7',
    poolDeep: '#4ab2b1',
    poolEdge: '#f6ebcf',
    coral: '#df7765',
    sun: '#efaa55',
    cream: '#fff7df',
    ink: '#1d302d',
    wood: '#8c613c',
    woodDark: '#644128',
    mint: '#b9dbc4',
    pink: '#e8a09a',
    blue: '#78a9cf',
    purple: '#9a8abf'
  };

  const walkable = [
    [2.2, 2.3], [3.2, 3.5], [4.4, 2.5], [4.8, 5.6],
    [5.4, 7.3], [7.0, 7.2], [9.0, 7.4], [11.3, 6.4],
    [12.0, 4.2], [10.8, 2.2], [7.0, 1.2], [2.6, 6.8],
    [3.8, 8.0], [8.2, 8.2], [11.8, 7.8]
  ];

  const gooberColors = [palette.coral, palette.sun, palette.mint, palette.blue, palette.pink, palette.purple];
  const goobers = Array.from({ length: 14 }, (_, i) => {
    const a = walkable[i % walkable.length];
    const b = walkable[(i * 5 + 3) % walkable.length];
    return {
      x: a[0], y: a[1], tx: b[0], ty: b[1],
      speed: .18 + (i % 5) * .025,
      phase: i * .73,
      color: gooberColors[i % gooberColors.length],
      wait: (i % 4) * .4
    };
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const scale = Math.min(w / 1180, h / 760);
    tileW = Math.max(44, Math.min(82, 72 * scale + 12));
    tileH = tileW * .5;
    originX = w * (w < 700 ? .5 : .57);
    originY = h * (w < 700 ? .34 : .27);
  }

  function iso(x, y, z = 0) {
    return {
      x: originX + (x - y) * tileW * .5,
      y: originY + (x + y) * tileH * .5 - z
    };
  }

  function poly(points, fill, stroke = null, lineWidth = 1) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function tile(x, y, fill, stroke = 'rgba(29,48,45,.08)') {
    poly([iso(x, y), iso(x + 1, y), iso(x + 1, y + 1), iso(x, y + 1)], fill, stroke);
  }

  function inPool(x, y) {
    return x >= pool.x0 && x < pool.x1 && y >= pool.y0 && y < pool.y1;
  }

  function drawIsland() {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        let fill;
        const fringe = x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1;
        const beach = x < 5 && y > 5;
        if (inPool(x, y)) fill = (x + y) % 2 ? palette.pool : palette.poolDeep;
        else if (beach || fringe) fill = (x + y) % 2 ? palette.sand : palette.sand2;
        else fill = (x + y) % 2 ? palette.grass : palette.grass2;
        tile(x, y, fill);
      }
    }

    // Pool coping.
    ctx.strokeStyle = palette.poolEdge;
    ctx.lineWidth = Math.max(4, tileW * .07);
    const p1 = iso(pool.x0, pool.y0);
    const p2 = iso(pool.x1, pool.y0);
    const p3 = iso(pool.x1, pool.y1);
    const p4 = iso(pool.x0, pool.y1);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.closePath(); ctx.stroke();
  }

  function drawPoolShimmer(t) {
    ctx.save();
    const pts = [iso(pool.x0, pool.y0), iso(pool.x1, pool.y0), iso(pool.x1, pool.y1), iso(pool.x0, pool.y1)];
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,232,.32)';
    ctx.lineWidth = 1.4;
    const top = Math.min(...pts.map(p => p.y));
    const bottom = Math.max(...pts.map(p => p.y));
    for (let y = top - 10; y < bottom + 12; y += 12) {
      ctx.beginPath();
      for (let x = Math.min(...pts.map(p => p.x)) - 30; x < Math.max(...pts.map(p => p.x)) + 30; x += 8) {
        const yy = y + Math.sin(x * .045 + t * .0015) * 2.6;
        if (x === Math.min(...pts.map(p => p.x)) - 30) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBeachWaves(t) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,249,225,.42)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const a = iso(.2, 8.3 + i * .35);
      const b = iso(4.8, 9.1 + i * .2);
      ctx.beginPath();
      const steps = 30;
      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        const x = a.x + (b.x - a.x) * u;
        const y = a.y + (b.y - a.y) * u + Math.sin(u * 13 + t * .0018 + i) * 2;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function ellipse(x, y, rx, ry, fill) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function drawPalm(x, y, scale = 1) {
    const p = iso(x, y);
    const H = 46 * scale;
    ctx.strokeStyle = '#7b5736';
    ctx.lineWidth = 6 * scale;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(p.x - 7 * scale, p.y - H * .55, p.x + 2 * scale, p.y - H); ctx.stroke();
    const top = { x: p.x + 2 * scale, y: p.y - H };
    ctx.strokeStyle = '#38795d';
    ctx.lineWidth = 5 * scale;
    for (let i = 0; i < 7; i++) {
      const a = i / 7 * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.quadraticCurveTo(top.x + Math.cos(a) * 16 * scale, top.y + Math.sin(a) * 5 * scale, top.x + Math.cos(a) * 28 * scale, top.y + Math.sin(a) * 12 * scale);
      ctx.stroke();
    }
  }

  function drawUmbrella(x, y, color) {
    const p = iso(x, y);
    ctx.strokeStyle = '#775943'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y - 31); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p.x - 22, p.y - 29); ctx.quadraticCurveTo(p.x, p.y - 45, p.x + 22, p.y - 29); ctx.quadraticCurveTo(p.x, p.y - 22, p.x - 22, p.y - 29); ctx.fillStyle = color; ctx.fill();
  }

  function drawLounger(x, y, color) {
    const p = iso(x, y);
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(-.25);
    ctx.fillStyle = color; ctx.fillRect(-18, -5, 36, 10);
    ctx.fillStyle = '#f7e9c8'; ctx.fillRect(-13, -3, 13, 6);
    ctx.restore();
  }

  function drawHammock(x, y) {
    const a = iso(x - .45, y); const b = iso(x + .55, y + .1);
    ctx.strokeStyle = '#705039'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x, a.y - 34); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x, b.y - 34); ctx.stroke();
    ctx.strokeStyle = '#f7e5bd'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(a.x, a.y - 26); ctx.quadraticCurveTo((a.x+b.x)/2, (a.y+b.y)/2 - 5, b.x, b.y - 26); ctx.stroke();
  }

  function drawKiosk(x, y) {
    const p = iso(x, y);
    ctx.fillStyle = palette.coral; ctx.fillRect(p.x - 24, p.y - 45, 48, 42);
    ctx.fillStyle = palette.cream; ctx.fillRect(p.x - 18, p.y - 37, 36, 17);
    ctx.fillStyle = palette.ink; ctx.font = '700 8px Courier New'; ctx.textAlign = 'center'; ctx.fillText('POSTCARDS', p.x, p.y - 26);
    ctx.fillStyle = palette.sun; ctx.beginPath(); ctx.moveTo(p.x - 30, p.y - 45); ctx.lineTo(p.x, p.y - 62); ctx.lineTo(p.x + 30, p.y - 45); ctx.closePath(); ctx.fill();
  }

  function drawSpa(x, y) {
    const p = iso(x, y);
    ctx.fillStyle = '#f2e4cd'; ctx.fillRect(p.x - 28, p.y - 43, 56, 40);
    ctx.fillStyle = palette.seaDeep; ctx.fillRect(p.x - 20, p.y - 35, 15, 32);
    ctx.fillStyle = palette.mint; ctx.fillRect(p.x + 4, p.y - 32, 17, 13);
    ctx.fillStyle = palette.wood; ctx.fillRect(p.x - 33, p.y - 49, 66, 7);
  }

  function drawSandcastle(x, y) {
    const p = iso(x, y);
    ctx.fillStyle = '#d6ae63';
    ctx.fillRect(p.x - 22, p.y - 19, 44, 18);
    ctx.fillRect(p.x - 17, p.y - 31, 12, 15); ctx.fillRect(p.x + 6, p.y - 31, 12, 15);
    ctx.fillStyle = '#a57e42'; ctx.fillRect(p.x - 5, p.y - 10, 10, 9);
  }

  function drawResortSign(x, y) {
    const p = iso(x, y);
    ctx.fillStyle = palette.woodDark; ctx.fillRect(p.x - 2, p.y - 36, 4, 35);
    ctx.fillStyle = palette.coral; ctx.fillRect(p.x - 31, p.y - 57, 62, 24);
    ctx.strokeStyle = palette.ink; ctx.lineWidth = 2; ctx.strokeRect(p.x - 31, p.y - 57, 62, 24);
    ctx.fillStyle = '#fff8e5'; ctx.font = '900 8px Courier New'; ctx.textAlign = 'center'; ctx.fillText('VACATION ZONE', p.x, p.y - 43);
  }

  function drawProps() {
    const props = [
      { d: 2.5, f: () => drawPalm(1.1, 1.4, .9) },
      { d: 4.5, f: () => drawHammock(2.2, 2.2) },
      { d: 6.2, f: () => drawResortSign(4.1, 2.1) },
      { d: 8.0, f: () => drawUmbrella(3.1, 6.8, palette.coral) },
      { d: 8.2, f: () => drawLounger(3.7, 6.6, palette.cream) },
      { d: 9.6, f: () => drawSandcastle(2.4, 7.3) },
      { d: 10.1, f: () => drawPalm(1.2, 8.2, 1.05) },
      { d: 10.8, f: () => drawUmbrella(9.5, 1.3, palette.sun) },
      { d: 11.5, f: () => drawLounger(10.1, 1.5, palette.pink) },
      { d: 12.0, f: () => drawSpa(11.2, 2.1) },
      { d: 14.0, f: () => drawKiosk(12.0, 4.4) },
      { d: 16.0, f: () => drawPalm(12.8, 6.7, .95) },
      { d: 17.8, f: () => drawPalm(9.4, 8.5, 1.0) }
    ];
    props.sort((a,b) => a.d - b.d).forEach(p => p.f());
  }

  function updateGoobers(dt) {
    if (reduceMotion) return;
    for (const g of goobers) {
      if (g.wait > 0) { g.wait -= dt; continue; }
      const dx = g.tx - g.x, dy = g.ty - g.y;
      const dist = Math.hypot(dx, dy);
      if (dist < .05) {
        const target = walkable[Math.floor(Math.random() * walkable.length)];
        g.tx = target[0]; g.ty = target[1]; g.wait = .5 + Math.random() * 1.6;
      } else {
        const step = Math.min(dist, g.speed * dt);
        g.x += dx / dist * step; g.y += dy / dist * step;
      }
    }
  }

  function drawGoober(g, t) {
    const p = iso(g.x, g.y);
    const bob = reduceMotion ? 0 : Math.sin(t * .004 + g.phase) * 1.6;
    ellipse(p.x, p.y + 3, 9, 4.2, 'rgba(22,52,47,.18)');
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y - 11 + bob, 9.2, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#27413d';
    ctx.fillRect(p.x - 6, p.y - 15 + bob, 12, 5.5);
    ctx.fillStyle = '#d9f1d5';
    ctx.fillRect(p.x - 3.5, p.y - 13.5 + bob, 2, 2);
    ctx.fillRect(p.x + 1.5, p.y - 13.5 + bob, 2, 2);
    ctx.strokeStyle = '#2a4944'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(p.x - 5, p.y - 1 + bob); ctx.lineTo(p.x - 7, p.y + 4); ctx.moveTo(p.x + 5, p.y - 1 + bob); ctx.lineTo(p.x + 7, p.y + 4); ctx.stroke();
  }

  function drawGoobers(t) {
    [...goobers].sort((a,b) => (a.x + a.y) - (b.x + b.y)).forEach(g => drawGoober(g, t));
  }

  function drawOuterWater(t) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,239,.18)';
    ctx.lineWidth = 1;
    for (let y = h * .38; y < h; y += 22) {
      ctx.beginPath();
      for (let x = -20; x <= w + 20; x += 12) {
        const yy = y + Math.sin(x * .025 + t * .001 + y * .012) * 3;
        if (x === -20) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000);
    last = now;
    ctx.clearRect(0, 0, w, h);
    drawOuterWater(now);
    drawIsland();
    drawPoolShimmer(now);
    drawBeachWaves(now);
    updateGoobers(dt);
    drawProps();
    drawGoobers(now);
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  requestAnimationFrame(frame);
})();
